package com.github.sangueamigo.modules.administrador.service;

import com.github.sangueamigo.modules.administrador.dto.request.AtualizarAdministradorRequest;
import com.github.sangueamigo.modules.administrador.dto.response.AdministradorResponse;
import com.github.sangueamigo.modules.administrador.entity.Administrador;
import com.github.sangueamigo.modules.administrador.exception.AdministradorNaoEncontradoException;
import com.github.sangueamigo.modules.administrador.repository.AdministradorRepository;
import com.github.sangueamigo.modules.hemocentro.entity.Hemocentro;
import com.github.sangueamigo.modules.hemocentro.service.HemocentroService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdministradorService {

    private final AdministradorRepository administradorRepository;
    private final HemocentroService hemocentroService;

    @Transactional(readOnly = true)
    public AdministradorResponse buscarPerfil(Long contaId) {
        return AdministradorResponse.from(buscarPorContaId(contaId));
    }

    @Transactional
    public AdministradorResponse atualizarPerfil(Long contaId, AtualizarAdministradorRequest request) {
        Administrador administrador = buscarPorContaId(contaId);
        Hemocentro hemocentro = request.hemocentroId() == null
                ? null
                : hemocentroService.buscarEntidadePorId(request.hemocentroId());

        administrador.setNome(request.nome());
        administrador.setTelefone(request.telefone());
        administrador.setCargo(request.cargo());
        administrador.setHemocentro(hemocentro);

        return AdministradorResponse.from(administradorRepository.save(administrador));
    }

    private Administrador buscarPorContaId(Long contaId) {
        return administradorRepository.findByContaId(contaId)
                .orElseThrow(AdministradorNaoEncontradoException::new);
    }
}
