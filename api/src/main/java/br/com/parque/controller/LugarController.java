package br.com.parque.controller;

import br.com.parque.dto.LugarResponse;
import br.com.parque.service.LugarService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lugares")
public class LugarController {

    private final LugarService service;

    public LugarController(LugarService service) {
        this.service = service;
    }

    // GET /api/lugares
    @GetMapping
    public List<LugarResponse> listar() {
        return service.listar();
    }

    // GET /api/lugares/{id}
    @GetMapping("/{id}")
    public LugarResponse buscar(@PathVariable Long id) {
        return service.buscar(id);
    }
}
