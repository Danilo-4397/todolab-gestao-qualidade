# Nível 7 da esteira: commits convencionais e release

## Commits convencionais

O histórico da `main` usa o padrão `tipo(escopo): descrição`, com os tipos `feat`, `fix`, `docs`, `test` e `ci`. Nos Pull Requests, o título do PR vira a mensagem do commit no Squash and merge.

Auditoria feita em 2026-11-26 com `git log --format=%s origin/main`: todos os commits seguem o padrão, exceto uma mensagem criada pela edição direta no GitHub (`Remove reviewer from README`), que fica registrada aqui por transparência e não foi reescrita para não alterar o histórico.

## Release `v1.0.0`

Criada pela interface do GitHub (Releases → Draft a new release), com a tag `v1.0.0` sobre a `main`.

Texto da release:

```text
TodoLab v1.0.0, primeira versão entregue da equipe Danilo-solo.

## Novidades
- feat(tasks): impedir tarefa em branco ou só com espaços (Issue #1, PR #6)
- feat(tasks): contador de tarefas restantes (Issue #2, PR #8)
- feat(tasks): botão Limpar concluídas (Issue #4, PR #9)
- fix(tasks): recuperação de dados corrompidos no localStorage (Issue #3, PR #10)
- feat(cidade): total de PRs integrados na Cidade do Processo (Issue #5, PR #11)
- feat(cidade): Cidade do Processo desenhada no canvas, um prédio por PR integrado (Issue #7, PR #12)

## Esteira de qualidade
- Nível 0: lint e build (Quality Gate)
- Nível 2: testes de aceitação no CI (`node:test`)
- Nível 3: cobertura mínima de 60%
- Nível 4: guard-tests
- Nível 5: testes E2E com Playwright
- Nível 6: branch protection na `main`
- Nível 8: resumo de métricas em cada Pull Request

## Limitações conhecidas
- Projeto individual: não houve aprovação de terceiro (nível 1 pendente).
- `remover()` identifica a tarefa pelo título; títulos repetidos podem remover a tarefa errada.
- A Cidade do Processo lê só os 100 primeiros PRs e Issues da API pública do GitHub.
- Implementação feita pelo Claude (não pelo GitHub Copilot), a pedido do autor.
```

## Conferência

- Tag `v1.0.0` aparece em Releases e em Tags.
- A release aponta para a `main` depois do merge do último PR.
