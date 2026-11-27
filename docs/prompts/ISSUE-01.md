# ISSUE-01 — Registro de diálogo com IA

## Identificação da rodada

- Issue: #1 — feat(tasks): impedir criação de tarefas em branco ou só com espaços
- Branch (ramificação): feature/issue-1-impedir-tarefa-em-branco
- Autor da alteração: Danilo Cassiano de Souza
- Revisor previsto: a definir
- Data: 2026-11-17

## Contexto aprovado

- Link ou referência da Issue: https://github.com/Danilo-4397/todolab-gestao-qualidade/issues/1
- Critérios de aceite revisados pelo professor: demanda DEM-02 (A2) do catálogo apresentado pelo professor na Aula 05; os critérios desta Issue foram escritos pela squad e não houve revisão específica do professor.
- Arquivos que podem ser alterados: src/store.js e src/app.js
- Arquivos que não devem ser alterados: tests/store.test.js, scripts/, .github/
- Teste escrito antes da implementação: commit 3f2f416, com 2 testes passando (Cenários 1 e 2) e 3 falhando (Cenários 3, 4 e 5) antes da correção, como esperado.

## Prompt inicial enviado à IA

```text
Você é a fábrica de software terceirizada da squad de qualidade do TodoLab.
Sua tarefa é implementar a regra de negócio da Issue pública abaixo, sem alterar os testes.

[ESPECIFICAÇÃO OFICIAL VIA LINK PÚBLICO DO GITHUB]
Acesse, leia a User Story e extraia todos os cenários BDD e casos de borda desta Issue:
https://github.com/Danilo-4397/todolab-gestao-qualidade/issues/1

[ARQUIVOS DE CONTEXTO]
Consulte e edite exclusivamente: #file:src/store.js e/ou #file:src/app.js
Os testes que devem passar estão em #file:tests/store.test.js (somente leitura).

[RESTRIÇÕES]
1. JavaScript puro (ES Modules), sem dependências externas.
2. Preserve as assinaturas dos métodos existentes em store.js (adicionar, alternar, remover, listar).
3. Não insira seletores HTML nem manipulação de DOM em store.js.
4. NÃO altere a pasta tests/, nem scripts/, nem .github/. Não enfraqueça nem remova testes.
5. Faça a menor alteração possível e não mexa em nada fora do escopo da Issue (por exemplo, não altere remover() nem carregar()).
6. Ao final, explique quais arquivos alterou e como verificar manualmente.
```

## Resposta recebida da IA

```text
[Cole aqui a resposta integral do Copilot, depois de receber.]
```

## O que a equipe mudou depois

[Preencher depois: o que a equipe corrigiu, removeu ou recusou na proposta da IA. Se aceitou tudo, escreva isso.]

## Verificação humana antes do Pull Request

- [ ] O diff foi lido pela equipe.
- [ ] Os critérios de aceite foram comparados com a alteração.
- [ ] `npm run check` foi executado e o resultado real foi registrado.
- [ ] A verificação manual no navegador foi realizada.
- [ ] Pendências, limitações ou dúvidas foram registradas abaixo.

Resultado do teste antes da implementação (`node --test tests/store.test.js`):

```text
tests 5 | pass 2 | fail 3
Falharam: Cenário 3 (só espaços ou tabulações), Cenário 4 (espaços nas pontas), Cenário 5 (entrada inválida não altera armazenamento).
```

Resultado do teste depois da implementação:

```text
[Cole aqui a saída real depois de rodar.]
```

Resultado real do `npm run check`:

```text
[Cole aqui a saída relevante depois de rodar.]
```

Verificação manual realizada:

- Passos: no site em execução, o autor tentou adicionar uma tarefa com o campo vazio e outra só com espaços; depois recarregou a página (F5) com tarefas na lista e abriu o Console do navegador (F12).
- Resultado observado: informado pelo autor em 2026-11-27. A tarefa em branco e a só com espaços não foram criadas; ao recarregar, as tarefas continuaram na lista; o Console não mostrou nenhum erro.
- Pendências ou riscos: nenhuma informada pelo autor.

## Pull Request e revisão

- URL ou número do Pull Request: #6 (https://github.com/Danilo-4397/todolab-gestao-qualidade/pull/6)
- Autor do Pull Request: Danilo Cassiano de Souza
- Revisor (integrante diferente do autor): nenhum. Projeto individual; a exceção está registrada em docs/diario.md e em comentário no PR.
- O PR contém `Closes #1`? [x] sim [ ] não
- Commit ou hash da versão revisada: 7abca12 (último commit da branch); commit do merge na main: 5816330
- Resultado do CI: [x] verde [ ] vermelho [ ] ainda em execução (Quality Gate 0, job lint-and-build, no último commit da branch)
- Comentário substantivo do revisor: não houve revisão independente; o autor registrou a exceção em comentário no PR.
- Há mudanças solicitadas abertas? [ ] sim [x] não (não houve revisão)
- A aprovação é da versão atual, depois das últimas correções? [ ] sim [ ] não [x] não houve aprovação de terceiro
- Aceite manual registrado, com cenários e resultado observado: sim, na seção "Verificação manual realizada" acima (informado pelo autor em 2026-11-27, depois do merge).
- Decisão: merge feito pelo autor, sem revisão independente (exceção registrada em docs/diario.md). A revisão independente segue pendente.

O merge só é autorizado com CI verde, nenhuma mudança solicitada aberta, aceite manual registrado e aprovação da versão atual. Nesta rodada faltou a aprovação de terceiro (projeto individual); o merge foi feito pelo autor como exceção registrada.

## Aprendizado da rodada

- Ambiguidade encontrada: não registrada pela equipe nesta rodada.
- Decisão tomada: não registrada pela equipe nesta rodada.
- Próxima melhoria de processo: não definida pela equipe nesta rodada. Pendência já registrada em `docs/diario.md`: ausência de revisor independente.