package br.com.parque.service;

import br.com.parque.dto.LugarResponse;
import br.com.parque.exception.RecursoNaoEncontradoException;
import br.com.parque.repository.LugarRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LugarService {

    private final LugarRepository lugares;

    public LugarService(LugarRepository lugares) {
        this.lugares = lugares;
    }

    @Transactional(readOnly = true)
    public List<LugarResponse> listar() {
        return lugares.findAll(Sort.by("id")).stream().map(LugarResponse::de).toList();
    }

    @Transactional(readOnly = true)
    public LugarResponse buscar(Long id) {
        return lugares.findById(id)
                .map(LugarResponse::de)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Lugar não encontrado."));
    }
}
