package br.com.parque.service;

import br.com.parque.dto.AuthResponse;
import br.com.parque.dto.LoginRequest;
import br.com.parque.dto.RegistroRequest;
import br.com.parque.dto.UsuarioResponse;
import br.com.parque.exception.ConflitoException;
import br.com.parque.exception.CredenciaisInvalidasException;
import br.com.parque.exception.RegraNegocioException;
import br.com.parque.model.Usuario;
import br.com.parque.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;
    private final TokenService tokens;
    private final Clock clock;

    public AuthService(UsuarioRepository usuarios, PasswordEncoder encoder, TokenService tokens, Clock clock) {
        this.usuarios = usuarios;
        this.encoder = encoder;
        this.tokens = tokens;
        this.clock = clock;
    }

    @Transactional
    public AuthResponse registrar(RegistroRequest req) {
        // BCrypt só considera os 72 primeiros bytes da senha
        if (req.senha().getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new RegraNegocioException("A senha é muito longa (máximo de 72 bytes).");
        }
        String email = req.email().trim().toLowerCase();
        if (usuarios.existsByEmail(email)) {
            throw new ConflitoException("Já existe uma conta com esse e-mail.");
        }
        Usuario novo = new Usuario(
                req.nomeUsuario().trim(),
                email,
                encoder.encode(req.senha()),
                LocalDateTime.now(clock));
        try {
            novo = usuarios.saveAndFlush(novo);
        } catch (DataIntegrityViolationException e) {
            throw new ConflitoException("Já existe uma conta com esse e-mail.");
        }
        return resposta(novo);
    }

    @Transactional(readOnly = true)
    public AuthResponse entrar(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        // Mesma mensagem para e-mail inexistente e senha errada, para não revelar quais e-mails têm conta
        Usuario usuario = usuarios.findByEmail(email)
                .filter(u -> encoder.matches(req.senha(), u.getSenhaHash()))
                .orElseThrow(() -> new CredenciaisInvalidasException("E-mail ou senha incorretos."));
        return resposta(usuario);
    }

    private AuthResponse resposta(Usuario usuario) {
        return new AuthResponse(tokens.gerar(usuario), UsuarioResponse.de(usuario));
    }
}
