package br.com.parque.dto;

import br.com.parque.model.Usuario;

public record UsuarioResponse(Long id, String nomeUsuario, String email) {

    public static UsuarioResponse de(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNomeUsuario(), u.getEmail());
    }
}
