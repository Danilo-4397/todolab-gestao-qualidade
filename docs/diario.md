# Diário do projeto

## Sprint 01 — Planejamento (Sprint Planning)

Registrado em 2026-11-17.

**1. Objetivo da Sprint**
Estabelecer um fluxo ágil rastreável no GitHub e impedir que o TodoLab aceite tarefas sem conteúdo válido, entregando o incremento com critérios, validação, revisão e CI aprovados. Também entra o contador de tarefas restantes (DEM-01).

**2. Itens selecionados**
- Issue #1: impedir criação de tarefas em branco ou só com espaços (DEM-02).
- Issue #2: exibir contador de tarefas restantes (DEM-01).

**3. Justificativa de prioridade**
A #1 é o pedido obrigatório do cliente na Aula 04 e tem prioridade P0. A #2 é pequena, toca os mesmos arquivos e é a entrega inicial pedida na Aula 03. As Issues #3, #4 e #5 estão prontas pela DoR (status Ready), mas ficam fora da Sprint 01 para respeitar a capacidade da equipe.

**4. Estimativa de cada item**
- #1: 2
- #2: 2
- Total da Sprint: 4 pontos.

**5. Capacidade e restrições da equipe**
- Equipe de 1 integrante (trabalho individual, autorizado pelo professor).
- Sprint de 1 semana (16/11 a 22/11/2026). O material do professor prevê 31/08 a 20/09; o trabalho está sendo feito agora por entrega tardia.
- Revisor independente e responsável pelo merge ainda não definidos: sem eles, nenhum PR pode ser integrado.
- Limite de WIP: no máximo 2 itens em In Progress.

**6. Responsáveis iniciais**
Danilo Cassiano de Souza em todos os papéis (Tech Lead, QA, Documentation & Metrics, Test Analyst). Code Reviewer e Release/DevOps Manager: a definir.

**7. Dependências e riscos conhecidos**
- Risco: sem outra pessoa para revisar e aprovar, os PRs ficam abertos (merge pendente).
- Risco: prazo curto para a esteira completa de testes das próximas aulas.
- Dependência: a Issue #5 (Cidade do Processo) depende de a validação do professor estar registrada na própria Issue.

## Registro de decisões

- 2026-11-16: os documentos iniciais (README, rodízio e registro do Quality Gate inicial) foram enviados direto para a main (commit 511ecb6), antes da primeira Issue, como preparação do repositório. A partir da primeira Issue, todo trabalho passa por branch e Pull Request.

- 2026-11-22: o projeto é individual, então não há revisor independente. Os PRs são integrados pelo próprio autor, com autorização do professor para trabalho individual (concedida verbalmente em 16/11/2026, informada pelo autor). Isso é uma exceção à regra "ninguém aprova o próprio PR" e fica registrada aqui como risco de governança. Aguarda-se confirmação do professor.
- 2026-11-22: as Issues #2, #3, #4 e #5 foram implementadas pelo Claude (Claude Code) e não pelo GitHub Copilot, a pedido do autor. Cada registro em `docs/prompts/ISSUE-NN.md` informa isso. Os testes foram escritos antes de cada implementação (commit `test(...)` anterior ao commit `feat(...)`).
- 2026-11-22: as Issues #2 a #5 ficaram fora do planejamento da Sprint 01 (que previa #1 e #2). A #2 está nela; #3, #4 e #5 foram adiantadas por decisão do autor devido ao prazo.
