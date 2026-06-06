package com.github.sangueamigo.modules.orientacao.controller;

import com.github.sangueamigo.modules.orientacao.dto.OrientacaoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/orientacoes")
public class OrientacaoController {

    @GetMapping
    public ResponseEntity<List<OrientacaoResponse>> listar() {
        return ResponseEntity.ok(List.of(
                new OrientacaoResponse(
                        "Requisitos basicos",
                        "Conferencias iniciais antes de buscar um hemocentro.",
                        List.of(
                                "Estar em boas condicoes gerais de saude.",
                                "Apresentar documento oficial com foto.",
                                "Estar alimentado e descansado.",
                                "Confirmar idade, peso e demais criterios diretamente com a unidade de doacao."
                        )
                ),
                new OrientacaoResponse(
                        "Antes da doacao",
                        "Cuidados recomendados para o dia da doacao.",
                        List.of(
                                "Evite jejum prolongado.",
                                "Beba agua ao longo do dia.",
                                "Evite bebidas alcoolicas nas horas anteriores.",
                                "Informe medicamentos em uso e historico recente de saude ao atendimento."
                        )
                ),
                new OrientacaoResponse(
                        "Impedimentos temporarios",
                        "Situacoes que podem exigir reagendamento.",
                        List.of(
                                "Febre, gripe ou infeccoes recentes.",
                                "Procedimentos, vacinas ou cirurgias recentes.",
                                "Tatuagem, piercing ou exposicoes de risco dentro do periodo definido pelo hemocentro.",
                                "Gestacao, pos-parto ou amamentacao conforme avaliacao da unidade."
                        )
                ),
                new OrientacaoResponse(
                        "Aviso importante",
                        "As informacoes sao orientativas.",
                        List.of(
                                "A decisao final sobre aptidao deve ser confirmada junto ao hemocentro.",
                                "Em caso de duvida especifica, procure a equipe de triagem ou um profissional responsavel."
                        )
                )
        ));
    }
}
