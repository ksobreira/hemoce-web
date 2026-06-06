package com.github.sangueamigo.modules.agendamento.service;

import com.github.sangueamigo.modules.agendamento.dto.request.CriarAgendamentoRequest;
import com.github.sangueamigo.modules.agendamento.dto.response.AgendamentoResponse;
import com.github.sangueamigo.modules.agendamento.entity.Agendamento;
import com.github.sangueamigo.modules.agendamento.enums.StatusAgendamento;
import com.github.sangueamigo.modules.agendamento.event.AgendamentoCanceladoEvent;
import com.github.sangueamigo.modules.agendamento.event.AgendamentoConfirmadoEvent;
import com.github.sangueamigo.modules.agendamento.event.DoacaoRegistradaEvent;
import com.github.sangueamigo.modules.agendamento.exception.*;
import com.github.sangueamigo.modules.agendamento.repository.AgendamentoRepository;
import com.github.sangueamigo.modules.doacao.entity.Doacao;
import com.github.sangueamigo.modules.doacao.service.DoacaoService;
import com.github.sangueamigo.modules.horariodisponivel.entity.HorarioDisponivel;
import com.github.sangueamigo.modules.horariodisponivel.repository.HorarioDisponivelRepository;
import com.github.sangueamigo.modules.usuario.entity.Usuario;
import com.github.sangueamigo.modules.usuario.enums.Sexo;
import com.github.sangueamigo.modules.usuario.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final HorarioDisponivelRepository horarioRepository;
    private final UsuarioRepository usuarioRepository;
    private final DoacaoService doacaoService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public AgendamentoResponse criar(Long contaId, CriarAgendamentoRequest request) {
        Usuario usuario = usuarioRepository.findByContaId(contaId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado"));

        HorarioDisponivel horario = horarioRepository.findById(request.horarioId())
                .orElseThrow(HorarioIndisponivelException::new);

        validarDisponibilidadeHorario(horario);
        validarIntervaloMinimo(usuario);

        Agendamento agendamento = new Agendamento();
        agendamento.setUsuario(usuario);
        agendamento.setHemocentro(horario.getHemocentro());
        agendamento.setHorarioDisponivel(horario);
        agendamento.setData(horario.getData());
        agendamento.setHorario(horario.getHora());
        agendamento.setStatus(StatusAgendamento.PENDENTE);

        Agendamento salvo = agendamentoRepository.save(agendamento);
        atualizarVagasHorario(horario);
        return AgendamentoResponse.from(salvo);
    }

    @Transactional
    public void cancelar(Long agendamentoId, Long contaId) {
        Agendamento agendamento = buscarPorIdEValidarDono(agendamentoId, contaId);

        if (agendamento.getStatus() == StatusAgendamento.CONCLUIDO) {
            throw new IllegalStateException("Agendamentos concluidos nao podem ser cancelados.");
        }
        if (agendamento.getStatus() == StatusAgendamento.CANCELADO) {
            throw new IllegalStateException("Agendamento ja cancelado.");
        }

        agendamento.setStatus(StatusAgendamento.CANCELADO);
        agendamentoRepository.save(agendamento);
        devolverVaga(agendamento.getHorarioDisponivel());
        publicarCancelamento(agendamento);
    }

    @Transactional
    public AgendamentoResponse atualizarStatus(Long agendamentoId, StatusAgendamento novoStatus) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new AgendamentoNaoEncontradoException(agendamentoId));

        StatusAgendamento statusAtual = agendamento.getStatus();
        validarTransicaoStatus(statusAtual, novoStatus);

        if (statusAtual == novoStatus) {
            return AgendamentoResponse.from(agendamento);
        }

        switch (novoStatus) {
            case CONFIRMADO -> publicarConfirmacao(agendamento);
            case CANCELADO -> {
                devolverVaga(agendamento.getHorarioDisponivel());
                publicarCancelamento(agendamento);
            }
            case CONCLUIDO -> registrarDoacao(agendamento);
            case PENDENTE -> throw new IllegalStateException("Nao e permitido retornar um agendamento para PENDENTE.");
        }

        agendamento.setStatus(novoStatus);
        return AgendamentoResponse.from(agendamentoRepository.save(agendamento));
    }

    public List<AgendamentoResponse> listarTodosDoUsuario(Long contaId) {
        Usuario usuario = usuarioRepository.findByContaId(contaId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado."));

        return agendamentoRepository
                .findByUsuarioIdOrderByDataDesc(usuario.getId())
                .stream()
                .map(AgendamentoResponse::from)
                .toList();
    }

    public List<AgendamentoResponse> listarAtivosDoUsuario(Long contaId) {
        Usuario usuario = usuarioRepository.findByContaId(contaId)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado."));

        return agendamentoRepository
                .findByUsuarioIdAndStatusIn(
                        usuario.getId(),
                        List.of(StatusAgendamento.PENDENTE, StatusAgendamento.CONFIRMADO)
                )
                .stream()
                .map(AgendamentoResponse::from)
                .toList();
    }

    public List<AgendamentoResponse> listarPorHemocentro(Long hemocentroId, LocalDate data) {
        return agendamentoRepository
                .findByHemocentroIdAndDataOrderByHorario(hemocentroId, data)
                .stream()
                .map(AgendamentoResponse::from)
                .toList();
    }

    public boolean temAgendamentosAtivosNoHorario(Long horarioId) {
        return agendamentoRepository.countAgendamentosAtivosNoHorario(horarioId) > 0;
    }

    private void validarTransicaoStatus(StatusAgendamento atual, StatusAgendamento novo) {
        if (atual == novo) {
            return;
        }
        if (atual == StatusAgendamento.CANCELADO || atual == StatusAgendamento.CONCLUIDO) {
            throw new IllegalStateException("O status deste agendamento nao pode mais ser alterado.");
        }
        if (novo == StatusAgendamento.CONFIRMADO && atual != StatusAgendamento.PENDENTE) {
            throw new IllegalStateException("Apenas agendamentos pendentes podem ser confirmados.");
        }
        if (novo == StatusAgendamento.CONCLUIDO && atual != StatusAgendamento.CONFIRMADO) {
            throw new IllegalStateException("Apenas agendamentos confirmados podem ser concluidos.");
        }
    }

    private void registrarDoacao(Agendamento agendamento) {
        if (doacaoService.jaRegistrada(agendamento.getId())) {
            throw new DoacaoJaRegistradaException();
        }

        Doacao doacao = doacaoService.registrar(agendamento);
        Usuario usuario = agendamento.getUsuario();
        eventPublisher.publishEvent(new DoacaoRegistradaEvent(
                usuario.getConta().getEmail(),
                usuario.getNome(),
                agendamento.getHemocentro().getNome(),
                doacao.getDataDoacao()
        ));
    }

    private void publicarConfirmacao(Agendamento agendamento) {
        eventPublisher.publishEvent(new AgendamentoConfirmadoEvent(
                agendamento.getUsuario().getConta().getEmail(),
                agendamento.getUsuario().getNome(),
                agendamento.getHemocentro().getNome(),
                agendamento.getData(),
                agendamento.getHorario()
        ));
    }

    private void publicarCancelamento(Agendamento agendamento) {
        eventPublisher.publishEvent(new AgendamentoCanceladoEvent(
                agendamento.getUsuario().getConta().getEmail(),
                agendamento.getUsuario().getNome(),
                agendamento.getHemocentro().getNome(),
                agendamento.getData(),
                agendamento.getHorario()
        ));
    }

    private void validarDisponibilidadeHorario(HorarioDisponivel horario) {
        if (!horario.getDisponivel()) {
            throw new HorarioIndisponivelException();
        }

        long vagasOcupadas = agendamentoRepository.countAgendamentosAtivosNoHorario(horario.getId());
        if (vagasOcupadas >= horario.getVagas()) {
            throw new HorarioIndisponivelException();
        }
    }

    private void validarIntervaloMinimo(Usuario usuario) {
        Optional<Agendamento> ultima = agendamentoRepository
                .findTopByUsuarioIdAndStatusOrderByDataDesc(
                        usuario.getId(), StatusAgendamento.CONCLUIDO
                );

        ultima.ifPresent(agendamento -> {
            int diasMinimos = usuario.getSexo() == Sexo.MASCULINO ? 60 : 90;
            LocalDate liberadoEm = agendamento.getData().plusDays(diasMinimos);

            if (LocalDate.now().isBefore(liberadoEm)) {
                throw new UsuarioInaptoException(liberadoEm);
            }
        });
    }

    private void atualizarVagasHorario(HorarioDisponivel horario) {
        long vagasOcupadas = agendamentoRepository.countAgendamentosAtivosNoHorario(horario.getId());
        if (vagasOcupadas >= horario.getVagas()) {
            horario.setDisponivel(false);
            horarioRepository.save(horario);
        }
    }

    private Agendamento buscarPorIdEValidarDono(Long agendamentoId, Long contaId) {
        Agendamento agendamento = agendamentoRepository.findById(agendamentoId)
                .orElseThrow(() -> new AgendamentoNaoEncontradoException(agendamentoId));

        if (!agendamento.getUsuario().getConta().getId().equals(contaId)) {
            throw new AgendamentoNaoPertenceAoUsuarioException();
        }

        return agendamento;
    }

    private void devolverVaga(HorarioDisponivel horario) {
        if (!horario.getDisponivel()) {
            horario.setDisponivel(true);
            horarioRepository.save(horario);
        }
    }
}
