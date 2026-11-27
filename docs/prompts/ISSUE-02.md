# ISSUE-02 — Registro de diálogo com IA

> **Transparência sobre a fábrica:** nesta rodada a implementação foi feita pelo **Claude (Claude Code)**, a pedido do autor, e **não** pelo GitHub Copilot. Não existe diálogo com o Copilot para esta Issue. O registro abaixo descreve o que realmente foi feito.

## Identificação da rodada

- Issue: #2 — feat(tasks): exibir contador de tarefas restantes
- Branch (ramificação): feature/issue-2-contador-tarefas-restantes
- Autor da alteração: Claude (Claude Code), solicitado por Danilo Cassiano de Souza
- Revisor previsto: a definir
- Data: 2026-11-22

## Contexto aprovado

- Link ou referência da Issue: https://github.com/Danilo-4397/todolab-gestao-qualidade/issues/2
- Critérios de aceite revisados pelo professor: demanda DEM-01 (A1) do catálogo do professor; os critérios desta Issue foram escritos pela squad.
- Arquivos que podem ser alterados: src/store.js, src/app.js, index.html
- Arquivos que não devem ser alterados: scripts/, .github/, src/styles.css, e os testes já escritos
- Teste escrito antes da implementação: `tests/contador.test.js` (commit "test(tasks): adiciona testes do contador..."), com 7 testes e 7 falhando antes da implementação.

## Prompt enviado à IA

```text
Pegue tudo que você consegue fazer no projeto e faça (pedido do autor, 2026-11-22).
Especificação oficial: Issue #2 no GitHub (cenários 1 a 7).
Regras da equipe: teste antes da implementação, JavaScript puro, sem dependências,
não alterar scripts/, .github/ nem CSS, menor alteração possível.
```

## Resposta ou resumo técnico da IA

- `src/store.js`: nova função exportada `formatarRestantes(quantidade)` (singular "1 item restante", demais casos "N itens restantes") e novo método `restantes()` que conta somente tarefas não concluídas.
- `src/app.js`: `render()` passa a escrever o texto do contador em `#todo-count`, então ele é atualizado ao adicionar, concluir e remover, sem recarregar.
- `index.html`: novo parágrafo `<p id="todo-count" aria-live="polite">` no rodapé da lista.

## Decisões técnicas

- A regra do texto (singular/plural) ficou em `store.js` para poder ser testada sem navegador.
- Sem alteração de CSS (fora do escopo). O contador usa o estilo existente do rodapé.
- `aria-live="polite"` para leitores de tela anunciarem a mudança.

## Verificação humana antes do Pull Request

- [ ] O diff foi lido pela equipe.
- [ ] Os critérios de aceite foram comparados com a alteração.
- [x] `npm run check` foi executado e o resultado real foi registrado (abaixo).
- [x] A verificação manual no navegador foi realizada pelo autor em 2026-11-24 (resultado abaixo).
- [ ] Pendências, limitações ou dúvidas foram registradas abaixo.

Resultado do teste antes da implementação (`node --test tests/contador.test.js`, Node v22.23.4):

```text
tests 7 | pass 0 | fail 7
```

Resultado do teste depois da implementação:

```text
tests 7 | pass 7 | fail 0
```

Resultado real do `npm run check`:

```text
Lint aprovado e Build aprovado: artefato gerado em dist/.
```

Verificação manual realizada:

- Passos: cenários da Issue executados em `npm run dev` (http://localhost:4173).
- Resultado observado: Cenários 1 a 7 executados no navegador em 2026-11-24, no localhost:4173. Resultado relatado pelo autor: todos conforme esperado.
- Pendências ou riscos: a atualização do contador na tela (Cenário 4 e 6) só foi verificada por teste da regra, não no navegador.

## Pull Request e revisão

- URL ou número do Pull Request: #8 (https://github.com/Danilo-4397/todolab-gestao-qualidade/pull/8)
- Autor do Pull Request: Danilo Cassiano de Souza
- Revisor (integrante diferente do autor): nenhum. Projeto individual; a exceção está registrada em docs/diario.md e em comentário no PR.
- O PR contém `Closes #2`? [x] sim [ ] não
- Commit ou hash da versão revisada: 7fe5b9c (último commit da branch); commit do merge na main: a6adb01
- Resultado do CI: [x] verde [ ] vermelho [ ] ainda em execução (Quality Gate 0, job lint-and-build, no último commit da branch)
- Comentário substantivo do revisor: não houve revisão independente; o autor registrou a exceção em comentário no PR.
- Decisão: merge feito pelo autor, sem revisão independente (exceção registrada em docs/diario.md). A revisão independente segue pendente.

## Aprendizado da rodada

- Ambiguidade encontrada: a Issue não diz se o contador deve ficar visível com a lista vazia. Decisão: sim, mostra "0 itens restantes" (Cenário 1).
- Decisão tomada: ver "Decisões técnicas".
- Próxima melhoria de processo: não definida pela equipe nesta rodada. Pendência já registrada em `docs/diario.md`: ausência de revisor independente.
