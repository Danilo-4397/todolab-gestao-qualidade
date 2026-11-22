# ISSUE-04 — Registro de diálogo com IA

> **Transparência sobre a fábrica:** nesta rodada a implementação foi feita pelo **Claude (Claude Code)**, a pedido do autor, e **não** pelo GitHub Copilot. Não existe diálogo com o Copilot para esta Issue.

## Identificação da rodada

- Issue: #4 — feat(tasks): limpar tarefas concluídas
- Branch (ramificação): feature/issue-4-limpar-concluidas
- Autor da alteração: Claude (Claude Code), solicitado por Danilo Cassiano de Souza
- Revisor previsto: a definir
- Data: 2026-11-22

## Contexto aprovado

- Link ou referência da Issue: https://github.com/Danilo-4397/todolab-gestao-qualidade/issues/4
- Critérios de aceite revisados pelo professor: demanda DEM-03 (A3) do catálogo do professor; os critérios foram escritos pela squad.
- Arquivos que podem ser alterados: src/store.js, src/app.js, index.html
- Arquivos que não devem ser alterados: scripts/, .github/, CSS
- Teste escrito antes da implementação: `tests/limpar-concluidas.test.js`, com 5 testes e 5 falhando antes da implementação.

## Prompt enviado à IA

```text
Pegue tudo que você consegue fazer no projeto e faça (pedido do autor, 2026-11-22).
Especificação oficial: Issue #4 no GitHub (cenários 1 a 5).
Regras: teste antes, JavaScript puro, menor alteração possível, sem CSS novo.
```

## Resposta ou resumo técnico da IA

- `src/store.js`: novos métodos `quantidadeConcluidas()` e `limparConcluidas()` (remove todas as concluídas e salva).
- `src/app.js`: `render()` esconde ou mostra o botão conforme `quantidadeConcluidas()`; o clique chama `limparConcluidas()` e redesenha.
- `index.html`: botão `#clear-completed` (começa oculto) no rodapé da lista.

## Decisões técnicas

- O botão reaproveita a classe existente `.remove` para não mexer no CSS (fora do escopo).
- Sem confirmação antes de apagar (fora do escopo).
- A mensagem de lista vazia (Cenário 5) já existia e é exibida porque `render()` a controla pelo total de tarefas.

## Verificação humana antes do Pull Request

- [ ] O diff foi lido pela equipe.
- [ ] Os critérios de aceite foram comparados com a alteração.
- [x] `npm run check` foi executado (abaixo).
- [ ] A verificação manual no navegador foi realizada. **Pendente: ninguém fez ainda.**
- [ ] Pendências, limitações ou dúvidas foram registradas abaixo.

Resultado do teste antes da implementação (`node --test tests/limpar-concluidas.test.js`, Node v22.23.4):

```text
tests 5 | pass 0 | fail 5
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

- Passos: **pendente** (Cenários 1 a 5 no navegador; conferir Local Storage nos Cenários 4 e 5).
- Resultado observado: **pendente**
- Risco: a visibilidade do botão (Cenários 2 e 3) só foi coberta por teste da regra, não no navegador.

## Pull Request e revisão

- URL ou número do Pull Request: [preencher depois]
- Autor do Pull Request: Danilo Cassiano de Souza
- Revisor (integrante diferente do autor): [a definir]
- O PR contém `Closes #4`? [ ] sim [ ] não
- Resultado do CI: [ ] verde [ ] vermelho [ ] ainda em execução
- Decisão: [ ] merge autorizado [ ] mudanças solicitadas [x] pendente

## Aprendizado da rodada

- Ambiguidade encontrada: a Issue não define a posição do botão. Decisão: rodapé da lista.
- Próxima melhoria de processo: [preencher depois pela equipe]
- Atenção: esta branch altera `index.html` e `src/app.js`, os mesmos arquivos da Issue #2. Ao integrar a segunda delas, pode haver conflito simples de merge.
