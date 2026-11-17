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