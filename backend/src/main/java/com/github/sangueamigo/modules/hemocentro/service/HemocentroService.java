package com.github.sangueamigo.modules.hemocentro.service;

import com.github.sangueamigo.modules.agendamento.service.AgendamentoService;
import com.github.sangueamigo.modules.conta.exception.CnpjJaCadastradoException;
import com.github.sangueamigo.modules.hemocentro.dto.request.AtualizarHemocentroRequest;
import com.github.sangueamigo.modules.hemocentro.dto.request.AtualizarHorarioDisponivelRequest;
import com.github.sangueamigo.modules.hemocentro.dto.request.CriarHemocentroRequest;
import com.github.sangueamigo.modules.hemocentro.dto.request.CriarHorarioDisponivelRequest;
import com.github.sangueamigo.modules.hemocentro.dto.response.HemocentroResponse;
import com.github.sangueamigo.modules.hemocentro.dto.response.HorarioDisponivelResponse;
import com.github.sangueamigo.modules.hemocentro.entity.Hemocentro;
import com.github.sangueamigo.modules.hemocentro.exception.*;
import com.github.sangueamigo.modules.hemocentro.repository.HemocentroRepository;
import com.github.sangueamigo.modules.horariodisponivel.entity.HorarioDisponivel;
import com.github.sangueamigo.modules.horariodisponivel.repository.HorarioDisponivelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HemocentroService {

    private final HemocentroRepository hemocentroRepository;
    private final HorarioDisponivelRepository horarioDisponivelRepository;
    private final AgendamentoService agendamentoService;

    @Transactional
    public HemocentroResponse criar(CriarHemocentroRequest request) {
        if (hemocentroRepository.existsByCnpj(request.cnpj())) {
            throw new CnpjJaCadastradoException();
        }

        Hemocentro hemocentro = new Hemocentro();
        hemocentro.setNome(request.nome());
        hemocentro.setCnpj(request.cnpj());
        hemocentro.setTelefone(request.telefone());
        hemocentro.setEndereco(request.endereco());
        hemocentro.setCidade(request.cidade());
        hemocentro.setEstado(request.estado());

        return HemocentroResponse.from(hemocentroRepository.save(hemocentro));
    }

    @Transactional
    public HemocentroResponse atualizar(Long hemocentroId, AtualizarHemocentroRequest request) {
        Hemocentro hemocentro = buscarEntidadePorId(hemocentroId);

        hemocentro.setNome(request.nome());
        hemocentro.setTelefone(request.telefone());
        hemocentro.setEndereco(request.endereco());
        hemocentro.setCidade(request.cidade());
        hemocentro.setEstado(request.estado());

        return HemocentroResponse.from(hemocentroRepository.save(hemocentro));
    }

    @Transactional
    public void remover(Long hemocentroId) {
        Hemocentro hemocentro = buscarEntidadePorId(hemocentroId);
        hemocentroRepository.delete(hemocentro);
    }

    public HemocentroResponse buscarPorId(Long hemocentroId) {
        return HemocentroResponse.from(buscarEntidadePorId(hemocentroId));
    }

    public Hemocentro buscarEntidadePorId(Long hemocentroId) {
        return hemocentroRepository.findById(hemocentroId)
                .orElseThrow(HemocentroNaoEncontradoException::new);
    }

    public List<HemocentroResponse> listarTodos() {
        return hemocentroRepository.findAll()
                .stream()
                .map(HemocentroResponse::from)
                .toList();
    }

    @Transactional
    public HorarioDisponivelResponse criarHorario(Long hemocentroId, CriarHorarioDisponivelRequest request) {
        Hemocentro hemocentro = buscarEntidadePorId(hemocentroId);

        HorarioDisponivel horario = new HorarioDisponivel();
        horario.setHemocentro(hemocentro);
        horario.setData(request.data());
        horario.setHora(request.hora());
        horario.setVagas(request.vagas());
        horario.setDisponivel(true);

        return salvarHorarioTratandoDuplicidade(horario);
    }

    @Transactional
    public HorarioDisponivelResponse atualizarHorario(
            Long hemocentroId,
            Long horarioId,
            AtualizarHorarioDisponivelRequest request
    ) {
        HorarioDisponivel horario = buscarHorarioDoHemocentro(horarioId, hemocentroId);

        horario.setData(request.data());
        horario.setHora(request.hora());
        horario.setVagas(request.vagas());
        horario.setDisponivel(request.disponivel());

        return salvarHorarioTratandoDuplicidade(horario);
    }

    @Transactional
    public void removerHorario(Long hemocentroId, Long horarioId) {
        HorarioDisponivel horario = buscarHorarioDoHemocentro(horarioId, hemocentroId);

        if (agendamentoService.temAgendamentosAtivosNoHorario(horario.getId())) {
            throw new HorarioComAgendamentosAtivosException();
        }

        horarioDisponivelRepository.delete(horario);
    }

    public List<HorarioDisponivelResponse> listarHorarios(Long hemocentroId, LocalDate inicio, LocalDate fim) {
        return horarioDisponivelRepository
                .findByHemocentroIdAndDataBetween(hemocentroId, inicio, fim)
                .stream()
                .map(HorarioDisponivelResponse::from)
                .toList();
    }

    public List<HorarioDisponivelResponse> listarHorariosDisponiveisPorData(Long hemocentroId, LocalDate data) {
        return horarioDisponivelRepository
                .findByHemocentroIdAndDataAndDisponivelTrue(hemocentroId, data)
                .stream()
                .map(HorarioDisponivelResponse::from)
                .toList();
    }

    private HorarioDisponivel buscarHorarioDoHemocentro(Long horarioId, Long hemocentroId) {
        HorarioDisponivel horario = horarioDisponivelRepository.findById(horarioId)
                .orElseThrow(HorarioDisponivelNaoEncontradoException::new);

        if (!horario.getHemocentro().getId().equals(hemocentroId)) {
            throw new HorarioNaoPertenceAoHemocentroException();
        }

        return horario;
    }

    private HorarioDisponivelResponse salvarHorarioTratandoDuplicidade(HorarioDisponivel horario) {
        try {
            return HorarioDisponivelResponse.from(horarioDisponivelRepository.saveAndFlush(horario));
        } catch (DataIntegrityViolationException e) {
            throw new HorarioDisponivelDuplicadoException();
        }
    }
}
