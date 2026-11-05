package br.com.parque.controller;

import br.com.parque.dto.AuthResponse;
import br.com.parque.dto.LoginRequest;
import br.com.parque.dto.RegistroRequest;
import br.com.parque.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    // POST /api/auth/register  ->  201 { token, usuario } | 400 dados inválidos | 409 e-mail já existe
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registrar(@Valid @RequestBody RegistroRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registrar(req));
    }

    // POST /api/auth/login  ->  200 { token, usuario } | 401 e-mail ou senha incorretos
    @PostMapping("/login")
    public AuthResponse entrar(@Valid @RequestBody LoginRequest req) {
        return service.entrar(req);
    }
}
