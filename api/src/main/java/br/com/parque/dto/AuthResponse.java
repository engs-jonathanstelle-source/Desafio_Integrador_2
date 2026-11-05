package br.com.parque.dto;

/** Formato esperado pelo app: { token, usuario: { id, nomeUsuario, email } }. */
public record AuthResponse(String token, UsuarioResponse usuario) {
}
