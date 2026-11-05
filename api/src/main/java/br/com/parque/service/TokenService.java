package br.com.parque.service;

import br.com.parque.model.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class TokenService {

    private final JwtEncoder encoder;
    private final Clock clock;
    private final long expiracaoHoras;

    public TokenService(JwtEncoder encoder, Clock clock,
                        @Value("${app.jwt.expiracao-horas:168}") long expiracaoHoras) {
        this.encoder = encoder;
        this.clock = clock;
        this.expiracaoHoras = expiracaoHoras;
    }

    /** Gera um JWT cujo "subject" é o id do usuário. */
    public String gerar(Usuario usuario) {
        Instant agora = Instant.now(clock);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("parque-api")
                .issuedAt(agora)
                .expiresAt(agora.plus(expiracaoHoras, ChronoUnit.HOURS))
                .subject(String.valueOf(usuario.getId()))
                .build();
        JwsHeader cabecalho = JwsHeader.with(MacAlgorithm.HS256).build();
        return encoder.encode(JwtEncoderParameters.from(cabecalho, claims)).getTokenValue();
    }
}
