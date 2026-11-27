# ISSUE-03 — Registro de diálogo com IA

> **Transparência sobre a fábrica:** nesta rodada a implementação foi feita pelo **Claude (Claude Code)**, a pedido do autor, e **não** pelo GitHub Copilot. Não existe diálogo com o Copilot para esta Issue.

## Identificação da rodada

- Issue: #3 — feat(tasks): impedir que dados corrompidos no armazenamento derrubem a aplicação
- Branch (ramificação): feature/issue-3-dados-corrompidos
- Autor da alteração: Claude (Claude Code), solicitado por Danilo Cassiano de Souza
- Revisor previsto: a definir
- Data: 2026-11-22

## Contexto aprovado

- Link ou referência da Issue: https://github.com/Danilo-4397/todolab-gestao-qualidade/issues/3
- Critérios de aceite revisados pelo professor: demanda DEM-04 (A4) do catálogo do professor; os critérios foram escritos pela squad.
- Arquivos que podem ser alterados: src/store.js
- Arquivos que não devem ser alterados: scripts/, .github/, CSS, index.html, src/app.js
- Teste escrito antes da implementação: `tests/persistencia.test.js`, com 5 testes: 2 passavam (Cenários 1 e 2) e 3 falhavam (Cenários 3, 4 e 5).

## Prompt enviado à IA

```text
Pegue tudo que você consegue fazer no projeto e faça (pedido do autor, 2026-11-22).
Especificação oficial: Issue #3 no GitHub (cenários 1 a 5).
Regras: teste antes, JavaScript puro, menor alteração possível, sem tocar em scripts/ e .github/.
```

## Resposta ou resumo técnico da IA

- `src/store.js`, método `carregar()`: o `JSON.parse` agora fica dentro de `try/catch`. Se o JSON for inválido, ou se o valor não for uma lista (`Array.isArray`), devolve lista vazia, sem escrever nada no Console.

## Decisões técnicas

- Não há aviso ao usuário nem backup do dado descartado (fora do escopo da Issue).
- Não valida o formato de cada item da lista (fora do escopo). Risco conhecido: uma lista válida com itens malformados ainda é aceita.
- Cenário 5 funciona porque, ao adicionar, `salvar()` sobrescreve o valor corrompido.

## Verificação humana antes do Pull Request

- [ ] O diff foi lido pela equipe.
- [ ] Os critérios de aceite foram comparados com a alteração.
- [x] `npm run check` foi executado (abaixo).
- [x] A verificação manual no navegador foi realizada pelo autor em 2026-11-24 (resultado abaixo).
- [ ] Pendências, limitações ou dúvidas foram registradas abaixo.

Resultado do teste antes da implementação (`node --test tests/persistencia.test.js`, Node v22.23.4):

```text
tests 5 | pass 2 | fail 3
```

Resultado do teste depois da implementação:

```text
tests 5 | pass 5 | fail 0
```

Resultado real do `npm run check`:

```text
Lint aprovado: 5 arquivos JavaScript verificados.
Build aprovado: artefato gerado em dist/.
```

Verificação manual realizada:

- Passos: cenários da Issue executados em `npm run dev` (http://localhost:4173).
- Resultado observado: Cenários 1 a 5 executados no navegador em 2026-11-24, editando o Local Storage (F12). Resultado relatado pelo autor: todos conforme esperado, sem erro vermelho no Console no Cenário 3.

## Pull Request e revisão

- URL ou número do Pull Request: #10 (https://github.com/Danilo-4397/todolab-gestao-qualidade/pull/10)
- Autor do Pull Request: Danilo Cassiano de Souza
- Revisor (integrante diferente do autor): nenhum. Projeto individual; a exceção está registrada em docs/diario.md e em comentário no PR.
- O PR contém `Closes #3`? [x] sim [ ] não
- Resultado do CI: [x] verde [ ] vermelho [ ] ainda em execução (Quality Gate 0, job lint-and-build, no último commit da branch)
- Decisão: merge feito pelo autor, sem revisão independente (exceção registrada em docs/diario.md). A revisão independente segue pendente.

## Aprendizado da rodada

- Ambiguidade encontrada: a Issue não diz o que fazer com itens malformados dentro de uma lista válida. Ficou fora do escopo.
- Próxima melhoria de processo: não definida pela equipe nesta rodada. Pendência já registrada em `docs/diario.md`: ausência de revisor independente.
