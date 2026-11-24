# ISSUE-07 — Registro de diálogo com IA

> **Transparência sobre a fábrica:** nesta rodada a implementação foi feita pelo **Claude (Claude Code)**, a pedido do autor, e **não** pelo GitHub Copilot. Não existe diálogo com o Copilot para esta Issue.

## Identificação da rodada

- Issue: #7 — feat(cidade): desenhar a Cidade do Processo no canvas com PRs e Issues reais
- Branch (ramificação): feature/issue-7-cidade-canvas (criada a partir da branch da Issue #5, que contém as #2 e #4)
- Autor da alteração: Claude (Claude Code), solicitado por Danilo Cassiano de Souza
- Revisor previsto: a definir
- Data: 2026-11-24

## Contexto aprovado

- Link ou referência da Issue: https://github.com/Danilo-4397/todolab-gestao-qualidade/issues/7
- Critérios de aceite revisados pelo professor: demanda proposta pela squad; sem revisão específica do professor.
- Arquivos que podem ser alterados: src/cidade.js, novos src/cidade-desenho.js, index.html, src/styles.css, src/cidade-app.js
- Arquivos que não devem ser alterados: gerenciador de tarefas (src/store.js, src/app.js), scripts/, .github/
- Teste escrito antes da implementação: `tests/cidade-canvas.test.js`, com 9 testes e 9 falhando antes da implementação (commit "test(cidade): adiciona testes da cidade no canvas").

## Prompt enviado à IA

```text
Especificação oficial: Issue #7 no GitHub (cenários 1 a 9).
Pedido do autor: "a ideia é ter realmente prédio construindo conforme as ideias",
ou seja, cada PR integrado vira um prédio e cada Issue aberta vira uma obra, desenhados no canvas.
Regras: teste antes, JavaScript puro, sem dependências, sem autenticação no GitHub,
não alterar o gerenciador de tarefas existente.
```

## Resposta ou resumo técnico da IA

- `src/cidade.js`: `tipoDoTitulo`, `planejarCidade` (posição, cor e altura de cada prédio e obra), `acharPorPonto`, `textoAlternativo` e `carregarCidade` (duas consultas à API pública: PRs fechados e Issues abertas).
- `src/cidade-desenho.js`: desenho no canvas (prédios com janelas, obras com andaime tracejado, destaque ao passar o mouse).
- `src/cidade-app.js`: liga dados, canvas, dica de texto, lista focável para teclado e leitores de tela, e animação de subida (pulada se o usuário prefere menos movimento).
- `index.html` e `src/styles.css`: canvas, dica e lista acessível; CSS mínimo para a rolagem horizontal.

## Decisões técnicas

- A cor vem do tipo do título do PR (feat, fix, docs, test, ci, outro). A altura também depende só do tipo, que é um dado real; nenhuma medida foi inventada.
- Obras ficam à direita dos prédios. Itens da lista "issues" que têm o campo `pull_request` são PRs e não viram obra.
- Se a consulta falhar, o canvas não é exibido e aparece só a mensagem de erro (Cenário 8).
- Limite conhecido: no máximo 100 PRs e 100 Issues por consulta (fora do escopo da Issue). Sem autenticação, a API pública permite 60 consultas por hora por IP.

## Verificação humana antes do Pull Request

- [ ] O diff foi lido pela equipe.
- [ ] Os critérios de aceite foram comparados com a alteração.
- [x] `npm run check` foi executado (abaixo).
- [ ] A verificação manual no navegador, com os dados reais do GitHub, foi realizada. **Pendente: ninguém fez ainda.**
- [ ] Pendências, limitações ou dúvidas foram registradas abaixo.

Resultado do teste antes da implementação (`node --test tests/cidade-canvas.test.js`, Node v22.23.4):

```text
tests 9 | pass 0 | fail 9
```

Resultado do teste depois da implementação (suíte inteira desta branch, `node --test`):

```text
tests 28 | pass 28 | fail 0
```

Resultado real do `npm run check`:

```text
Lint aprovado: 8 arquivos JavaScript verificados.
Build aprovado: artefato gerado em dist/.
```

Verificação feita pela IA, com navegador sem interface e **dados simulados** (não são dados reais do GitHub):

- 8 PRs simulados (7 integrados, 1 fechado sem merge) e 3 itens de Issues (2 Issues e 1 PR aberto): a página mostrou "7 prédios" e 2 obras; o PR sem merge e o PR aberto ficaram de fora.
- Cores diferentes por tipo; ao passar o mouse sobre o terceiro prédio, a dica mostrou "#9 docs: diário".
- Lista de texto alternativo com 9 itens; nenhum erro no Console.
- Com a rede bloqueada: apareceu "Não foi possível carregar o histórico.", sem "0 prédios" e sem canvas.

Verificação manual realizada pela equipe:

- Passos: **pendente** (rodar `npm run dev`, comparar prédios com Pull requests > Closed > Merged e obras com Issues > Open).
- Resultado observado: **pendente**

## Pull Request e revisão

- URL ou número do Pull Request: [preencher depois]
- Autor do Pull Request: Danilo Cassiano de Souza
- Revisor (integrante diferente do autor): [a definir]
- O PR contém `Closes #7`? [ ] sim [ ] não
- Resultado do CI: [ ] verde [ ] vermelho [ ] ainda em execução
- Decisão: [ ] merge autorizado [ ] mudanças solicitadas [x] pendente

## Aprendizado da rodada

- Ambiguidade encontrada: a Issue não define a altura dos prédios. Decisão: por tipo do PR, para não inventar dado.
- Próxima melhoria de processo: [preencher depois pela equipe]
