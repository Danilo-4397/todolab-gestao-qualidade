# Revisão de código assistida por IA (Passo 5 da Aula 06)

> Esta é uma **revisão assistida por IA**, feita pelo Claude sobre código que o próprio Claude escreveu. Não substitui a revisão independente de uma pessoa (nível 1 da esteira, que continua pendente). O comentário abaixo deve ser postado pelo autor, na linha indicada do diff do PR, como evidência do exercício.

Alvo: `src/cidade.js`, função `carregarCidade` (Issues #5 e #7).

## O que o código faz

- `consultar` faz a requisição, lança erro se a resposta não for 2xx e devolve o JSON.
- `carregarCidade` consulta PRs fechados e Issues abertas em paralelo (`Promise.all`), monta o plano da cidade e devolve total e mensagem. Qualquer falha cai no `catch` e devolve só a mensagem de erro, sem total (evita mostrar "0 prédios" por engano).

## Critérios BDD

Atende aos cenários de falha (Issue #5, cenário 5; Issue #7, cenário 8) e à cidade vazia (cenário 7), todos cobertos por `tests/cidade.test.js` e `tests/cidade-canvas.test.js`.

## Riscos encontrados

1. O `catch {}` descarta a causa. O usuário vê a mesma mensagem para queda de rede, limite de 60 consultas/hora (HTTP 403) e JSON inesperado; depurar fica mais difícil.
2. `per_page=100` lê só os primeiros 100 PRs e Issues. Com mais que isso a cidade fica incompleta sem aviso (já registrado como risco conhecido).
3. `consultar` não confere se o JSON é uma lista. Se a API devolver um objeto com status 200, o erro só aparece depois, dentro de `planejarCidade`, e cai no mesmo `catch`.

Nenhum dos três quebra os critérios atuais; são melhorias.

## Comentário sugerido para postar na linha do `catch` no diff

> O `catch` sem parâmetro esconde a causa da falha: rede fora, limite de 60 consultas/hora da API pública (403) e JSON inesperado mostram a mesma mensagem. Para os critérios atuais está correto, porque o cenário 5 exige erro em vez de "0 prédios". Sugiro, em uma Issue futura, distinguir o 403 com uma mensagem específica e registrar o motivo com `console.warn`. Outro ponto: `per_page=100` lê só os 100 primeiros itens; vale avisar quando a lista vier cheia.
