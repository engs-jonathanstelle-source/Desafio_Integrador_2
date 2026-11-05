package br.com.parque.dto;

import br.com.parque.model.Agendamento;

import java.time.format.DateTimeFormatter;

/**
 * Visão do agendamento mostrada a todos os usuários logados. Traz o nome de usuário
 * (um apelido), mas nunca o e-mail. Data e hora vão como texto ("2026-11-10" e "09:00"),
 * no formato que o app compara.
 */
public record AgendamentoResponse(Long id, Long lugarId, String lugarNome, String data, String hora, String nomeUsuario) {

    private static final DateTimeFormatter HORA = DateTimeFormatter.ofPattern("HH:mm");

    public static AgendamentoResponse de(Agendamento a) {
        return new AgendamentoResponse(
                a.getId(),
                a.getLugar().getId(),
                a.getLugar().getNome(),
                a.getData().toString(),
                a.getHora().format(HORA),
                a.getUsuario().getNomeUsuario());
    }
}
