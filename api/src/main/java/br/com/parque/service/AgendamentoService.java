package br.com.parque.service;

import br.com.parque.dto.AgendamentoRequest;
import br.com.parque.dto.AgendamentoResponse;
import br.com.parque.exception.ConflitoException;
import br.com.parque.exception.CredenciaisInvalidasException;
import br.com.parque.exception.RecursoNaoEncontradoException;
import br.com.parque.exception.RegraNegocioException;
import br.com.parque.model.Agendamento;
import br.com.parque.model.Lugar;
import br.com.parque.model.Usuario;
import br.com.parque.repository.AgendamentoRepository;
import br.com.parque.repository.LugarRepository;
import br.com.parque.repository.UsuarioRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AgendamentoService {

    // Mesma grade de horários do app: de hora em hora, das 08:00 às 18:00.
    private static final LocalTime PRIMEIRO_HORARIO = LocalTime.of(8, 0);
    private static final LocalTime ULTIMO_HORARIO = LocalTime.of(18, 0);

    private final AgendamentoRepository agendamentos;
    private final LugarRepository lugares;
    private final UsuarioRepository usuarios;
    private final Clock clock;

    public AgendamentoService(AgendamentoRepository agendamentos, LugarRepository lugares,
                              UsuarioRepository usuarios, Clock clock) {
        this.agendamentos = agendamentos;
        this.lugares = lugares;
        this.usuarios = usuarios;
        this.clock = clock;
    }

    /** Agendamentos de hoje em diante, de um lugar ou de todos (quando lugarId é nulo). */
    @Transactional(readOnly = true)
    public List<AgendamentoResponse> listar(Long lugarId) {
        LocalDate hoje = LocalDate.now(clock);
        List<Agendamento> lista = (lugarId == null)
                ? agendamentos.findByDataGreaterThanEqualOrderByDataAscHoraAsc(hoje)
                : agendamentos.findByLugarIdAndDataGreaterThanEqualOrderByDataAscHoraAsc(lugarId, hoje);
        return lista.stream().map(AgendamentoResponse::de).toList();
    }

    @Transactional
    public AgendamentoResponse criar(Long usuarioId, AgendamentoRequest req) {
        // Token válido de um usuário que não existe mais (ex.: banco recriado)
        Usuario usuario = usuarios.findById(usuarioId)
                .orElseThrow(() -> new CredenciaisInvalidasException("Sessão inválida. Entre novamente."));
        Lugar lugar = lugares.findById(req.lugarId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Lugar não encontrado."));

        if (!lugar.isAgendavel()) {
            throw new RegraNegocioException("Este lugar não aceita agendamentos.");
        }
        validarHorario(req.hora());
        validarNaoPassou(req.data(), req.hora());

        if (agendamentos.existsByLugarIdAndDataAndHora(lugar.getId(), req.data(), req.hora())) {
            throw new ConflitoException("Horário já agendado.");
        }

        Agendamento novo = new Agendamento(lugar, usuario, req.data(), req.hora(), LocalDateTime.now(clock));
        try {
            // saveAndFlush força o INSERT agora: se outra pessoa gravou o mesmo horário
            // no meio tempo, a restrição única do banco acusa aqui.
            return AgendamentoResponse.de(agendamentos.saveAndFlush(novo));
        } catch (DataIntegrityViolationException e) {
            throw new ConflitoException("Horário já agendado.");
        }
    }

    private void validarHorario(LocalTime hora) {
        boolean cheia = hora.getMinute() == 0 && hora.getSecond() == 0;
        if (!cheia || hora.isBefore(PRIMEIRO_HORARIO) || hora.isAfter(ULTIMO_HORARIO)) {
            throw new RegraNegocioException("Horário inválido. Escolha uma hora cheia entre 08:00 e 18:00.");
        }
    }

    private void validarNaoPassou(LocalDate data, LocalTime hora) {
        LocalDateTime agora = LocalDateTime.now(clock);
        boolean diaPassado = data.isBefore(agora.toLocalDate());
        boolean horaPassada = data.isEqual(agora.toLocalDate()) && hora.getHour() <= agora.getHour();
        if (diaPassado || horaPassada) {
            throw new RegraNegocioException("Não é possível agendar em data ou horário que já passou.");
        }
    }
}
