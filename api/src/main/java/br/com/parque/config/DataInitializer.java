package br.com.parque.config;

import br.com.parque.model.Lugar;
import br.com.parque.repository.LugarRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Cadastra os lugares do parque na primeira execução (tabela vazia).
 * Ids, nomes e descrições são os mesmos de data/lugares.js no app: o app usa o id
 * para escolher a foto de cada lugar.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final LugarRepository lugares;

    public DataInitializer(LugarRepository lugares) {
        this.lugares = lugares;
    }

    @Override
    public void run(String... args) {
        if (lugares.count() > 0) {
            return;
        }
        lugares.saveAll(List.of(
                new Lugar(6L, "Campo de Futebol", "Campo de grama com gradil", true),
                new Lugar(7L, "Campo Society", "Campo society de grama sintética", true),
                new Lugar(8L, "Quadra de Vôlei de Areia", "Quadra de areia (vôlei/futevôlei)", true),
                new Lugar(9L, "Quiosque 1", "Área de descanso coberta", true),
                new Lugar(10L, "Quiosque 2", "Área de descanso coberta", true),
                new Lugar(11L, "Quiosque 3", "Área de descanso coberta", true),
                new Lugar(12L, "Quiosque 4", "Área de descanso coberta", true),
                new Lugar(13L, "Quiosque 5", "Área de descanso coberta", true)));
    }
}
