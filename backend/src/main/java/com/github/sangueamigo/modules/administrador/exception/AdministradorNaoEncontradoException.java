package com.github.sangueamigo.modules.administrador.exception;

public class AdministradorNaoEncontradoException extends RuntimeException {
    public AdministradorNaoEncontradoException() {
        super("Perfil de administrador nao encontrado.");
    }
}
