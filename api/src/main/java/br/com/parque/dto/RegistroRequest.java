package br.com.parque.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegistroRequest(
        @NotBlank(message = "Informe o nome de usuário.")
        @Size(min = 3, max = 50, message = "O nome de usuário deve ter entre 3 e 50 caracteres.") String nomeUsuario,
        @NotBlank(message = "Informe o e-mail.")
        @Email(message = "E-mail inválido.")
        @Size(max = 120, message = "E-mail muito longo.") String email,
        @NotBlank(message = "Informe a senha.")
        @Size(min = 6, message = "A senha precisa ter ao menos 6 caracteres.") String senha) {
}
