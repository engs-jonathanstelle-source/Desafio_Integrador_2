package br.com.parque.dto;

import br.com.parque.model.Lugar;

public record LugarResponse(Long id, String nome, String descricao, boolean agendavel) {

    public static LugarResponse de(Lugar l) {
        return new LugarResponse(l.getId(), l.getNome(), l.getDescricao(), l.isAgendavel());
    }
}
