# ISSUE-05 — Registro de diálogo com IA

> **Transparência sobre a fábrica:** nesta rodada a implementação foi feita pelo **Claude (Claude Code)**, a pedido do autor, e **não** pelo GitHub Copilot. Não existe diálogo com o Copilot para esta Issue.

## Identificação da rodada

- Issue: #5 — feat(cidade): exibir total de PRs integrados na Cidade do Processo
- Branch (ramificação): feature/issue-5-cidade-total-prs
- Autor da alteração: Claude (Claude Code), solicitado por Danilo Cassiano de Souza
- Revisor previsto: a definir
- Data: 2026-11-22

## Contexto aprovado

- Link ou referência da Issue: https://github.com/Danilo-4397/todolab-gestao-qualidade/issues/5
- Critérios de aceite revisados pelo professor: demanda proposta pela squad. O autor informou que o professor autorizou a extensão "Cidade do Processo" (verbalmente); isso ainda não está registrado por escrito.
- Arquivos que podem ser alterados: novos `src/cidade.js` e `src/cidade-app.js`, e `index.html`
- Arquivos que não devem ser alterados: gerenciador de tarefas (`src/store.js`, `src/app.js`), scripts/, .github/, CSS
- Teste escrito antes da implementação: `tests/cidade.test.js`, com 7 testes. Antes da implementação o arquivo nem carregava (módulo `src/cidade.js` inexistente): 0 passavam.

## Prompt enviado à IA

```text
Pegue tudo que você consegue fazer no projeto e faça (pedido do autor, 2026-11-22).
Especificação oficial: Issue #5 no GitHub (cenários 1 a 5).
Regras: teste antes, JavaScript puro, sem dependências, sem autenticação no GitHub,
não alterar o gerenciador de tarefas existente, sem CSS novo.
```

## Resposta ou resumo técnico da IA

- `src/cidade.js`: `formatarPredios()`, `contarPrsIntegrados()` (conta PRs com `merged_at`) e `carregarResumoCidade(buscar, repositorio)`, que consulta `https://api.github.com/repos/<repo>/pulls?state=closed&per_page=100`. Em qualquer falha (rede ou HTTP não-OK) devolve só a mensagem de erro, sem total.
- `src/cidade-app.js`: liga o resultado aos elementos da página.
- `index.html`: nova seção "Cidade do Processo" e o segundo script de módulo.

## Decisões técnicas

- `fetch` é injetado como parâmetro para testar sem internet.
- Reaproveita as classes de CSS existentes (`workbench`, `label`).
- Sem autenticação: o limite da API pública do GitHub é de 60 consultas por hora por IP. Se estourar, a página mostra a mensagem de erro (Cenário 5), nunca "0 prédios".
- Risco conhecido (fora do escopo, na Issue): só os primeiros 100 PRs fechados são lidos.

## Verificação humana antes do Pull Request

- [ ] O diff foi lido pela equipe.
- [ ] Os critérios de aceite foram comparados com a alteração.
- [x] `npm run check` foi executado (abaixo).
- [ ] A verificação manual no navegador foi realizada. **Pendente: ninguém fez ainda.**
- [ ] Pendências, limitações ou dúvidas foram registradas abaixo.

Resultado do teste antes da implementação (`node --test tests/cidade.test.js`, Node v22.23.4):

```text
tests 1 | pass 0 | fail 1  (o arquivo não carregou: módulo inexistente; os 7 testes não puderam rodar)
```

Resultado do teste depois da implementação:

```text
tests 7 | pass 7 | fail 0
```

Resultado real do `npm run check`:

```text
Lint aprovado: 7 arquivos JavaScript verificados.
Build aprovado: artefato gerado em dist/.
```

Verificação manual realizada:

- Passos: **pendente**. Comparar o número na página com Pull requests > Closed > Merged no GitHub (Cenários 3 e 4); F12 > Network > Offline e recarregar (Cenário 5). O Cenário 2 só pode ser visto depois do primeiro PR integrado.
- Resultado observado: **pendente**
- Os Cenários 3 e 4 contra o GitHub real só foram cobertos com resposta simulada nos testes.

## Pull Request e revisão

- URL ou número do Pull Request: [preencher depois]
- Autor do Pull Request: Danilo Cassiano de Souza
- Revisor (integrante diferente do autor): [a definir]
- O PR contém `Closes #5`? [ ] sim [ ] não
- Resultado do CI: [ ] verde [ ] vermelho [ ] ainda em execução
- Decisão: [ ] merge autorizado [ ] mudanças solicitadas [x] pendente

## Aprendizado da rodada

- Ambiguidade encontrada: a Issue não diz onde a seção aparece na página. Decisão: abaixo da fila de tarefas.
- Próxima melhoria de processo: [preencher depois pela equipe]
- Atenção: esta branch altera `index.html`, o mesmo arquivo das Issues #2 e #4. Pode haver conflito simples de merge.
