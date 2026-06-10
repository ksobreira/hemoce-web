package com.github.sangueamigo.modules.assistenteia.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.github.sangueamigo.modules.assistenteia.dto.AssistenteIaResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssistenteIaService {

    private static final Logger log = LoggerFactory.getLogger(AssistenteIaService.class);

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";
    private static final String AVISO_ORIENTATIVO =
            "Resposta orientativa. Casos específicos devem ser confirmados junto ao hemocentro ou profissional responsável.";
    private static final String INSTRUCOES = """
            Você é o assistente virtual do projeto Sangue Amigo.
            Responda em português do Brasil, de forma clara, acolhedora e curta.
            Responda somente dúvidas gerais relacionadas à doação de sangue.
            Não faça diagnósticos, não determine se uma pessoa está apta a doar e não substitua avaliação profissional.
            Em casos pessoais, sintomas, medicamentos ou condições de saúde, recomende confirmar diretamente com o hemocentro ou profissional responsável.
            """;

    @Value("${gemini.api-key:}")
    private String geminiApiKey;

    @Value("${gemini.model:gemini-2.5-flash}")
    private String model;

    private final RestClient.Builder restClientBuilder;

    @PostConstruct
    void logConfiguracaoGemini() {
        log.info("Gemini API key configurada: {}", chaveConfigurada());
        log.info("Modelo Gemini configurado: {}", model);
    }

    public AssistenteIaResponse responder(String pergunta) {
        if (!chaveConfigurada()) {
            log.info("Gemini API key ausente. Usando resposta local.");
            return respostaLocal();
        }

        try {
            GeminiResponse response = restClientBuilder.build()
                    .post()
                    .uri(GEMINI_URL, model)
                    .header("x-goog-api-key", geminiApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(GeminiRequest.from(pergunta))
                    .retrieve()
                    .body(GeminiResponse.class);

            String texto = extrairTexto(response);
            if (texto == null || texto.isBlank()) {
                log.warn("Resposta do Gemini veio vazia ou inválida. Usando resposta local.");
                return respostaLocal();
            }

            return new AssistenteIaResponse(texto.strip(), AVISO_ORIENTATIVO, true);
        } catch (Exception ex) {
            log.warn("Falha ao chamar Gemini, usando fallback local: {}", ex.getMessage());
            return respostaLocal();
        }
    }

    private boolean chaveConfigurada() {
        return geminiApiKey != null && !geminiApiKey.isBlank();
    }

    private AssistenteIaResponse respostaLocal() {
        String resposta = """
                Posso orientar sobre critérios gerais para doação de sangue: esteja em boas condições de saúde, leve documento oficial com foto, evite jejum e confirme na unidade os critérios de idade, peso, medicamentos, vacinas, procedimentos recentes e intervalo entre doações.
                """.strip();

        return new AssistenteIaResponse(resposta, AVISO_ORIENTATIVO, false);
    }

    private String extrairTexto(GeminiResponse response) {
        if (response == null || response.candidates() == null || response.candidates().isEmpty()) {
            return null;
        }

        Candidate candidate = response.candidates().get(0);
        if (candidate.content() == null
                || candidate.content().parts() == null
                || candidate.content().parts().isEmpty()) {
            return null;
        }

        return candidate.content().parts().stream()
                .map(Part::text)
                .filter(text -> text != null && !text.isBlank())
                .findFirst()
                .orElse(null);
    }

    private record GeminiRequest(
            List<Content> contents,
            @JsonProperty("system_instruction")
            Content systemInstruction,
            GenerationConfig generationConfig
    ) {
        static GeminiRequest from(String pergunta) {
            return new GeminiRequest(
                    List.of(new Content(List.of(new Part(pergunta)))),
                    new Content(List.of(new Part(INSTRUCOES.strip()))),
                    new GenerationConfig(500)
            );
        }
    }

    private record Content(List<Part> parts) {
    }

    private record Part(String text) {
    }

    private record GenerationConfig(Integer maxOutputTokens) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GeminiResponse(List<Candidate> candidates) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Candidate(Content content) {
    }
}
