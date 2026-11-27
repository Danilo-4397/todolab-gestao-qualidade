# Nível 5 da esteira: testes E2E com Playwright (`npm run test:e2e`)

## O que foi feito

- `playwright.config.js` sobe o servidor do projeto (`npm run dev`) e roda os testes em Chromium.
- `e2e/todolab.spec.js`: 8 testes que usam a página como a pessoa usaria, derivados dos critérios das Issues #1, #2, #3, #4, #5 e #7:
  adicionar tarefa, não aceitar tarefa em branco, contador ao concluir e remover, limpar concluídas, persistência após recarregar, dado corrompido sem erro, cidade com um prédio por PR e uma obra por Issue, e cidade com erro quando o GitHub não responde.
- A API do GitHub é simulada nos testes (`page.route`), para o resultado não depender da rede nem do limite de consultas.
- CI: passos "Instalar dependências", "Instalar navegador do Playwright", "Testes E2E (Playwright)" e envio do relatório como artefato. Os portões anteriores seguem ativos.

## Decisão sobre dependências

O projeto era "sem dependências externas". O nível 5 exige Playwright, então `@playwright/test` entrou como **única** dependência, de desenvolvimento, com versão fixa (`1.63.0`) e `package-lock.json`. O código de produção em `src/` continua sem dependências.

## Evidência

- 8 de 8 testes passam localmente.
- Prova de que reprovam: ao desligar de propósito a validação de tarefa em branco em `src/store.js`, o teste "não cria tarefa em branco" falhou (1 falhou, 7 passaram). A alteração foi revertida.
- Os testes `node --test`, cobertura e guard-tests continuam passando (38 testes).
- O resultado do CI deve ser conferido na aba Checks do Pull Request.

## Limite conhecido

O desenho do canvas é verificado só pela existência e visibilidade do canvas e pela lista de texto. As cores e a posição exatas dos prédios são cobertas por testes unitários (`tests/cidade-canvas.test.js`), não por imagem.
