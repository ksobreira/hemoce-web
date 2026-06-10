package com.github.sangueamigo.modules.administrador.dto.response;

import com.github.sangueamigo.modules.administrador.entity.Administrador;

public record AdministradorResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        String cargo,
        Long hemocentroId,
        String nomeHemocentro
) {
    public static AdministradorResponse from(Administrador administrador) {
        return new AdministradorResponse(
                administrador.getId(),
                administrador.getNome(),
                administrador.getConta().getEmail(),
                administrador.getTelefone(),
                administrador.getCargo(),
                administrador.getHemocentro() == null ? null : administrador.getHemocentro().getId(),
                administrador.getHemocentro() == null ? null : administrador.getHemocentro().getNome()
        );
    }
}
