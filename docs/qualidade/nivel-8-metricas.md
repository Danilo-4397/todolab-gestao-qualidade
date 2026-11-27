# Nível 8 da esteira: resumo de métricas no Pull Request

## O que foi feito

- `scripts/metricas.mjs` gera um resumo em Markdown: testes que passaram, resultado da cobertura mínima, cobertura por arquivo, arquivos alterados, linhas adicionadas/removidas e quantos commits seguem o padrão convencional.
- O job `metricas-do-pr` do workflow roda só em Pull Requests, publica o resumo na página do run e comenta no PR (atualiza o comentário anterior em vez de criar vários).
- O job tem `pull-requests: write` só nele; o job principal continua com permissão de leitura.

## Interpretação da equipe

O material da Aula 12 não estava disponível. A descrição do professor pede "resumo de métricas no Pull Request"; escolhemos as métricas acima por serem as que o próprio projeto já produz. Se o professor pedir outras, o script é o único ponto de mudança.

## Evidência

Rodado localmente contra `origin/main`: 38 de 38 testes, cobertura aprovada. O comentário real no PR só existe depois que um PR for aberto com este workflow na base; conferir na aba Conversation do PR.
