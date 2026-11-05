package br.com.parque.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Corpo do POST /api/agendamentos. O app também envia lugarNome, usuarioId, nomeUsuario
 * e email, mas esses campos são ignorados: quem agenda é o usuário do token JWT.
 */
public record AgendamentoRequest(
        @NotNull(message = "Informe o lugar.") Long lugarId,
        @NotNull(message = "Informe a data (AAAA-MM-DD).") LocalDate data,
        @NotNull(message = "Informe a hora (HH:MM).") LocalTime hora) {
}
