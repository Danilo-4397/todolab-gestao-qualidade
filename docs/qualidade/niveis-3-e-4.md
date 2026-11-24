# Níveis 3 e 4 da esteira: cobertura e guard-tests

## Nível 3: cobertura mínima de 60% (`npm run test:coverage`)

- Roda `node --test --experimental-test-coverage` e lê o relatório do próprio Node (sem dependências).
- Mede a cobertura de **linhas dos arquivos de `src/`** que os testes carregam. Os arquivos de teste ficam fora da conta, para não inflar o número.
- Reprova se qualquer arquivo medido de `src/` tiver menos de 60% das linhas.
- Limite conhecido: `src/app.js`, `src/cidade-app.js` e `src/cidade-desenho.js` dependem do navegador e nenhum teste os carrega, então não aparecem no relatório. O script lista esses arquivos na saída. Eles passam a ser exercitados pelos testes E2E (nível 5).
- Na criação: `src/store.js` e `src/cidade.js` com 100% das linhas (Node 20, 22 e 24).

## Nível 4: `guard-tests` (`npm run guard-tests`)

Verifica a separação de responsabilidades entre teste e código de produção:

1. Nenhum arquivo de `src/` importa `node:test` ou `node:assert`, tem chamada `test/it/describe`, função `executarTeste*` ou nome `*.test.js`.
2. Existe ao menos um `*.test.js` em `tests/`, e cada um contém asserções.
3. Nenhum teste usa `skip`, `only` ou `todo`, para ninguém desligar um teste e esconder falha.

Observação sobre a origem: o enunciado do professor descreve o nível 4 só como "separação de responsabilidades". As regras acima são a interpretação da equipe, a partir do que a devolutiva da Aula 10 criticou (teste dentro de `src/store.js`) e da regra "nunca alterar testes para esconder falhas". Se o material da Aula 10 definir outra regra, ajustar este script.

## Evidência

Os scripts foram executados localmente e também com intrusos de propósito (um `src/intruso.js` com `import test`, um `test.skip` e um mínimo de 101%) para provar que reprovam. O resultado do CI deve ser conferido na aba Checks do Pull Request.
