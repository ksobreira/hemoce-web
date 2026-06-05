package com.github.sangueamigo.modules.assistenteia.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.github.sangueamigo.modules.assistenteia.dto.AssistenteIaResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssistenteIaService {

    private static final String AVISO_ORIENTATIVO = "Resposta orientativa. Casos especificos devem ser confirmados junto ao hemocentro ou profissional responsavel.";

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    private final RestClient.Builder restClientBuilder;

    public AssistenteIaResponse responder(String pergunta) {
        if (apiKey == null || apiKey.isBlank()) {
            return respostaLocal(pergunta);
        }

        try {
            GeminiResponse response = restClientBuilder.build()
                    .post()
                    .uri("https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={apiKey}", model, apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(GeminiRequest.from(pergunta))
                    .retrieve()
                    .body(GeminiResponse.class);

            String texto = extrairTexto(response);
            if (texto == null || texto.isBlank()) {
                return respostaLocal(pergunta);
            }

            return new AssistenteIaResponse(texto.strip(), AVISO_ORIENTATIVO, true);
        } catch (Exception ex) {
            return respostaLocal(pergunta);
        }
    }

    private AssistenteIaResponse respostaLocal(String pergunta) {
        String resposta = """
                Posso orientar sobre criterios gerais para doacao de sangue: esteja em boas condicoes de saude, leve documento oficial com foto, evite jejum e confirme na unidade os criterios de idade, peso, medicamentos, vacinas, procedimentos recentes e intervalo entre doacoes.
                """.strip();

        return new AssistenteIaResponse(resposta, AVISO_ORIENTATIVO, false);
    }

    private String extrairTexto(GeminiResponse response) {
        if (response == null || response.candidates() == null || response.candidates().isEmpty()) {
            return null;
        }

        Candidate candidate = response.candidates().get(0);
        if (candidate.content() == null || candidate.content().parts() == null || candidate.content().parts().isEmpty()) {
            return null;
        }

        return candidate.content().parts().get(0).text();
    }

    private record GeminiRequest(
            List<Content> contents,
            SystemInstruction systemInstruction
    ) {
        static GeminiRequest from(String pergunta) {
            return new GeminiRequest(
                    List.of(new Content(List.of(new Part(pergunta)))),
                    new SystemInstruction(List.of(new Part("""
                            Voce e um assistente do projeto Sangue Amigo. Responda em portugues do Brasil, de forma clara e curta, apenas com orientacoes gerais sobre doacao de sangue. Nao diagnostique aptidao e sempre recomende confirmar casos especificos com o hemocentro.
                            """.strip())))
            );
        }
    }

    private record SystemInstruction(List<Part> parts) {
    }

    private record Content(List<Part> parts) {
    }

    private record Part(String text) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GeminiResponse(List<Candidate> candidates) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record Candidate(ContentResponse content) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record ContentResponse(List<PartResponse> parts) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record PartResponse(String text) {
    }
}
