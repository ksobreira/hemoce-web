package com.github.sangueamigo.modules.campanha.service;

import com.github.sangueamigo.modules.campanha.dto.request.AtualizarCampanhaRequest;
import com.github.sangueamigo.modules.campanha.dto.request.CriarCampanhaRequest;
import com.github.sangueamigo.modules.campanha.dto.response.CampanhaResponse;
import com.github.sangueamigo.modules.campanha.entity.Campanha;
import com.github.sangueamigo.modules.campanha.enums.StatusCampanha;
import com.github.sangueamigo.modules.campanha.enums.UrgenciaCampanha;
import com.github.sangueamigo.modules.campanha.event.CampanhaUrgenciaCriticaEvent;
import com.github.sangueamigo.modules.campanha.event.DestinatarioCampanhaCritica;
import com.github.sangueamigo.modules.campanha.exception.CampanhaNaoEncontradaException;
import com.github.sangueamigo.modules.campanha.exception.PeriodoCampanhaInvalidoException;
import com.github.sangueamigo.modules.campanha.repository.CampanhaRepository;
import com.github.sangueamigo.modules.hemocentro.entity.Hemocentro;
import com.github.sangueamigo.modules.hemocentro.service.HemocentroService;
import com.github.sangueamigo.modules.usuario.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CampanhaService {

    private final CampanhaRepository campanhaRepository;
    private final HemocentroService hemocentroService;
    private final UsuarioService usuarioService;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public CampanhaResponse criar(CriarCampanhaRequest request) {
        Hemocentro hemocentro = hemocentroService.buscarEntidadePorId(request.hemocentroId());
        validarPeriodo(request.dataInicio(), request.dataFim());

        Campanha campanha = new Campanha();
        campanha.setHemocentro(hemocentro);
        campanha.setTitulo(request.titulo());
        campanha.setDescricao(request.descricao());
        campanha.setUrlImagem(request.urlImagem());
        campanha.setTiposSanguineosNecessarios(request.tiposSanguineosNecessarios());
        campanha.setDataInicio(request.dataInicio());
        campanha.setDataFim(request.dataFim());
        campanha.setEndereco(valorOuPadrao(request.endereco(), hemocentro.getEndereco()));
        campanha.setCidade(valorOuPadrao(request.cidade(), hemocentro.getCidade()));
        campanha.setEstado(valorOuPadrao(request.estado(), hemocentro.getEstado()));
        campanha.setUrgencia(request.urgencia());
        campanha.setStatus(statusInicial(request.dataInicio()));

        Campanha salva = campanhaRepository.save(campanha);

        if (salva.getUrgencia() == UrgenciaCampanha.CRITICA) {
            publicarUrgenciaCritica(salva);
        }

        return CampanhaResponse.from(salva);
    }

    @Transactional
    public CampanhaResponse atualizar(Long campanhaId, AtualizarCampanhaRequest request) {
        Campanha campanha = buscarEntidadePorId(campanhaId);
        Hemocentro hemocentro = hemocentroService.buscarEntidadePorId(request.hemocentroId());
        validarPeriodo(request.dataInicio(), request.dataFim());

        UrgenciaCampanha urgenciaAnterior = campanha.getUrgencia();

        campanha.setHemocentro(hemocentro);
        campanha.setTitulo(request.titulo());
        campanha.setDescricao(request.descricao());
        campanha.setUrlImagem(request.urlImagem());
        campanha.setTiposSanguineosNecessarios(request.tiposSanguineosNecessarios());
        campanha.setDataInicio(request.dataInicio());
        campanha.setDataFim(request.dataFim());
        campanha.setEndereco(valorOuPadrao(request.endereco(), hemocentro.getEndereco()));
        campanha.setCidade(valorOuPadrao(request.cidade(), hemocentro.getCidade()));
        campanha.setEstado(valorOuPadrao(request.estado(), hemocentro.getEstado()));
        campanha.setStatus(request.status());
        campanha.setUrgencia(request.urgencia());

        Campanha salva = campanhaRepository.save(campanha);

        if (urgenciaAnterior != UrgenciaCampanha.CRITICA && salva.getUrgencia() == UrgenciaCampanha.CRITICA) {
            publicarUrgenciaCritica(salva);
        }

        return CampanhaResponse.from(salva);
    }

    @Transactional
    public void remover(Long campanhaId) {
        campanhaRepository.delete(buscarEntidadePorId(campanhaId));
    }

    public CampanhaResponse buscarPorId(Long campanhaId) {
        return CampanhaResponse.from(buscarEntidadePorId(campanhaId));
    }

    public List<CampanhaResponse> listarTodas() {
        return campanhaRepository.findAll()
                .stream()
                .map(CampanhaResponse::from)
                .toList();
    }

    public List<CampanhaResponse> listarPorHemocentro(Long hemocentroId) {
        return campanhaRepository.findByHemocentroIdOrderByDataInicioDesc(hemocentroId)
                .stream()
                .map(CampanhaResponse::from)
                .toList();
    }

    public List<CampanhaResponse> listarAtivas() {
        return campanhaRepository.findByStatusOrderByUrgenciaDesc(StatusCampanha.ATIVA)
                .stream()
                .map(CampanhaResponse::from)
                .toList();
    }

    private Campanha buscarEntidadePorId(Long campanhaId) {
        return campanhaRepository.findById(campanhaId)
                .orElseThrow(CampanhaNaoEncontradaException::new);
    }

    private void validarPeriodo(LocalDate dataInicio, LocalDate dataFim) {
        if (dataFim.isBefore(dataInicio)) {
            throw new PeriodoCampanhaInvalidoException();
        }
    }

    private StatusCampanha statusInicial(LocalDate dataInicio) {
        return dataInicio.isAfter(LocalDate.now()) ? StatusCampanha.AGENDADA : StatusCampanha.ATIVA;
    }

    private String valorOuPadrao(String valor, String padrao) {
        return valor == null || valor.isBlank() ? padrao : valor;
    }

    private void publicarUrgenciaCritica(Campanha campanha) {
        List<DestinatarioCampanhaCritica> destinatarios = usuarioService
                .listarDestinatariosCompativeis(campanha.getTiposSanguineosNecessarios())
                .stream()
                .map(usuario -> new DestinatarioCampanhaCritica(
                        usuario.email(),
                        usuario.nome(),
                        usuario.tipoSanguineo()
                ))
                .toList();

        eventPublisher.publishEvent(new CampanhaUrgenciaCriticaEvent(
                campanha.getId(),
                campanha.getTitulo(),
                campanha.getDescricao(),
                campanha.getHemocentro().getNome(),
                campanha.getDataInicio(),
                campanha.getDataFim(),
                campanha.getEndereco(),
                campanha.getCidade(),
                campanha.getEstado(),
                campanha.getTiposSanguineosNecessarios()
                        .stream()
                        .map(Enum::name)
                        .collect(Collectors.toSet()),
                destinatarios
        ));
    }
}
