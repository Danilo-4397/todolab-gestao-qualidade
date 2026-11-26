# Matriz de testes: automatizados e manuais

Pedida no Passo 6 da Aula 06: distinguir o que uma máquina executa sozinha do que uma pessoa verificou à mão.

## Testes automatizados (executados no CI a cada push e PR)

| Issue | Arquivo | Nível | Qtde | Comando | O que cobre |
|---|---|---|---|---|---|
| #1 (DEM-02) | `tests/store.test.js` | Unitário (`node:test`) | 5 | `npm test` | texto válido, vazio, só espaços/tabulações, trim, entrada inválida não altera nada |
| #2 (DEM-01) | `tests/contador.test.js` | Unitário | 7 | `npm test` | contador singular/plural, concluir, remover, persistência |
| #3 (DEM-04) | `tests/persistencia.test.js` | Unitário | 5 | `npm test` | recarregar, sem dado, JSON inválido, JSON que não é lista, recuperação |
| #4 (DEM-03) | `tests/limpar-concluidas.test.js` | Unitário | 5 | `npm test` | limpar só concluídas, botão, armazenamento |
| #5 | `tests/cidade.test.js` | Unitário | 7 | `npm test` | contagem de PRs integrados, falha de rede, HTTP 403 |
| #7 | `tests/cidade-canvas.test.js` | Unitário | 9 | `npm test` | prédios, ordem, cores, obras, clique, cidade vazia, erro, texto alternativo |
| #1 a #5 e #7 | `e2e/todolab.spec.js` | E2E (Playwright, Chromium) | 8 | `npm run test:e2e` | fluxo real no navegador, com a API do GitHub simulada |

Total: 38 testes unitários e 8 E2E. Portões que acompanham: cobertura mínima de 60% por arquivo de `src/` (`npm run test:coverage`) e `guard-tests` (`npm run guard-tests`).

## Testes manuais (executados por uma pessoa)

Fonte: relato do autor durante a sessão de trabalho. Nada abaixo foi inferido.

| Nível (Aula 06) | O que foi feito | Quem | Resultado informado |
|---|---|---|---|
| Integração, DevTools (F12) | Aba Application → Local Storage, chave `todolab:tarefas`, inserir dados e recarregar com F5 | autor | persistência confirmada; um registro duplicado foi apagado manualmente para testar |
| Aceitação (UAT) | `npm run dev`, cenários BDD das Issues #2, #3 e #4 na interface | autor | "deu certo" |
| Aceitação (UAT), Issue #5, cenário 5 | Internet desligada (Wi-Fi), recarregar | autor | mensagem de erro exibida, sem "0 prédios" |
| Aceitação (UAT), Issue #7 | Cidade com dados reais do GitHub | autor | 5 prédios e 1 obra desenhados no canvas |

Registrar aqui a data e o que foi visto, caso o professor peça mais detalhe.

## O que a matriz não cobre

- Console do navegador sem erros em vermelho: o E2E verifica isso apenas no cenário de dado corrompido; nos demais é conferência manual.
- Acessibilidade por leitor de tela: só há verificação estrutural (rótulos e lista em texto), não teste com leitor real.
- Defeito conhecido fora do escopo: `remover()` identifica a tarefa pelo título, então títulos repetidos podem remover a tarefa errada.

## Autoria dos testes (transparência)

A regra da Aula 06 é que o QA escreve o teste antes e a IA não o altera. Neste projeto o autor foi uma só pessoa e a implementação e os testes foram escritos pelo Claude a partir dos critérios das Issues. Para preservar a ordem, cada Issue tem um commit `test(...)` (falhando) anterior ao commit `feat(...)`.
