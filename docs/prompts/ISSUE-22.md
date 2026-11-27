# ISSUE-22 — Registro de diálogo com IA

> **Transparência sobre a fábrica:** nesta rodada a implementação foi feita pelo **Claude (Claude Code)**, a pedido do autor, e **não** pelo GitHub Copilot. Não existe diálogo com o Copilot para esta Issue.

## Identificação da rodada

- Issue: #22, feat(ui): redesenhar a interface e os prédios da Cidade do Processo
- Branch (ramificação): feature/visual-interface-cidade
- Autor da alteração: Claude (Claude Code), solicitado por Danilo Cassiano de Souza
- Revisor previsto: a definir
- Data: 2026-11-26

## Contexto aprovado

- Link ou referência da Issue: https://github.com/Danilo-4397/todolab-gestao-qualidade/issues/22
- Critérios de aceite revisados pelo professor: não. Demanda proposta pela própria equipe; a Issue declara que não foi apresentada nem validada pelo professor em sala.
- Arquivos que podem ser alterados: `index.html`, `src/styles.css`, `src/cidade-desenho.js`, `src/cidade-app.js`
- Arquivos que não devem ser alterados: `src/store.js`, `src/app.js`, `src/cidade.js` (lógica, cores e alturas), `tests/`, `scripts/`, `.github/`
- Teste escrito antes da implementação: não se aplica a esta rodada, porque é mudança visual. O que protege a mudança são os 38 testes unitários e os 8 E2E já existentes, que não foram alterados.

## Prompt enviado à IA

```text
Pedido do autor (2026-11-26): "muda o html e o css desse site, deixa visualmente mais bonito tudo,
coloca prédios melhores, uma interface melhor".
Regras: JavaScript puro, sem dependências, manter ids e textos usados pelos testes,
não alterar a lógica da cidade (cidade.js) nem os testes.
```

## Resposta ou resumo técnico da IA

- `index.html`: cidade como destaque no topo, painel de tarefas em seguida, legenda de cores, cópia em frase normal em vez de caixa alta. Ids e textos usados pelos testes ficaram iguais.
- `src/styles.css`: nova identidade (céu noturno com lua e estrelas, painel de tarefas em papel claro), foco visível, `prefers-reduced-motion`, layout para celular.
- `src/cidade-desenho.js`: prédios com sombreamento, janelas acesas ou apagadas (sorteio fixo por número do PR), porta, detalhe de topo por tipo (antena, caixa d'água, aparelhos, telhado pontudo, chaminé) e obras com guindaste, andaime e faixa de alerta.
- `src/cidade-app.js`: canvas desenhado na resolução da tela e ampliado, mapeamento do mouse corrigido para a nova escala, cidade abre mostrando os prédios mais recentes.

## Decisões técnicas

- O céu e o chão são pintados pelo CSS; o canvas desenha só prédios e obras. Assim a cena preenche a largura inteira mesmo com poucos prédios.
- As luzes das janelas são sorteadas com uma função fixa do número do PR: a cidade fica igual a cada carregamento e nenhum dado é inventado.
- `cidade.js` não foi alterado: cores, alturas e posições continuam cobertas pelos testes existentes.

## Verificação humana antes do Pull Request

- [ ] O diff foi lido pela equipe.
- [ ] Os critérios de aceite foram comparados com a alteração.
- [x] `npm run check` foi executado.
- [ ] A verificação manual no navegador foi realizada pelo autor.
- [ ] Pendências, limitações ou dúvidas foram registradas abaixo.

Resultados reais, obtidos pela IA antes do PR:

```text
Lint aprovado: 11 arquivos JavaScript verificados.
Build aprovado: artefato gerado em dist/.
node --test: 38 aprovados, 0 reprovados.
Playwright (E2E): 8 aprovados.
Cobertura mínima de 60%: aprovada.
guard-tests: aprovado.
```

Verificação visual feita pela IA em Chromium, com **dados simulados** da API (15 PRs e 1 Issue), no computador (1440 px) e no celular (390 px): cidade, painel de tarefas, checkbox e botões renderizaram sem cortes. Essa verificação não substitui a conferência do autor.

## Pull Request e revisão

- URL ou número do Pull Request: preencher depois do merge
- Autor do Pull Request: Danilo Cassiano de Souza
- Revisor (integrante diferente do autor): nenhum. Projeto individual; a exceção está registrada em `docs/diario.md` e em comentário no PR.
- O PR contém `Closes #22`? preencher ao abrir o PR
- Resultado do CI: preencher depois do CI
- Decisão: preencher depois do merge

## Aprendizado da rodada

- Ambiguidade encontrada: "mais bonito" não é um critério verificável. Decisão: critérios por comportamento (cada PR vira um prédio com janelas, celular sem cortes, menos movimento respeitado).
- Próxima melhoria de processo: [preencher depois pela equipe]
