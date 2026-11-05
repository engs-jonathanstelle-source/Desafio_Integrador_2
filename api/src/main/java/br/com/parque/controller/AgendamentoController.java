package br.com.parque.controller;

import br.com.parque.dto.AgendamentoRequest;
import br.com.parque.dto.AgendamentoResponse;
import br.com.parque.service.AgendamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/agendamentos")
public class AgendamentoController {

    private final AgendamentoService service;

    public AgendamentoController(AgendamentoService service) {
        this.service = service;
    }

    // GET /api/agendamentos?lugarId=1   (exige token)
    @GetMapping
    public List<AgendamentoResponse> listar(@RequestParam(required = false) Long lugarId) {
        return service.listar(lugarId);
    }

    // POST /api/agendamentos  (exige token; o usuário vem do token)
    //   -> 201 criado | 400 dados inválidos | 401 sem sessão | 404 lugar inexistente | 409 horário ocupado
    @PostMapping
    public ResponseEntity<AgendamentoResponse> criar(@AuthenticationPrincipal Jwt jwt,
                                                     @Valid @RequestBody AgendamentoRequest req) {
        Long usuarioId = Long.valueOf(jwt.getSubject());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(usuarioId, req));
    }
}
