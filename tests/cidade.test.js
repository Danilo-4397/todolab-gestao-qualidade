import test from 'node:test';
import assert from 'node:assert/strict';
import * as cidade from '../src/cidade.js';

const REPO = 'Danilo-4397/todolab-gestao-qualidade';

// Simula a resposta da API do GitHub: lista de PRs fechados.
function respostaComPrs(prs) {
  return async () => ({ ok: true, json: async () => prs });
}

const integrado = { merged_at: '2026-11-20T10:00:00Z' };
const fechadoSemMerge = { merged_at: null };

test('Issue #5, Cenário 1: nenhum PR integrado mostra "0 prédios" e cidade vazia', async () => {
  const resumo = await cidade.carregarResumoCidade(respostaComPrs([]), REPO);

  assert.equal(resumo.total, '0 prédios');
  assert.equal(resumo.mensagem, 'A cidade ainda está vazia.');
});

test('Issue #5, Cenário 2: 1 PR integrado mostra "1 prédio"', async () => {
  const resumo = await cidade.carregarResumoCidade(respostaComPrs([integrado]), REPO);

  assert.equal(resumo.total, '1 prédio');
});

test('Issue #5, Cenário 3: N PRs integrados mostram "N prédios"', async () => {
  const resumo = await cidade.carregarResumoCidade(
    respostaComPrs([integrado, integrado, integrado]),
    REPO,
  );

  assert.equal(resumo.total, '3 prédios');
});

test('Issue #5, Cenário 4: PRs fechados sem merge não entram na contagem', async () => {
  const resumo = await cidade.carregarResumoCidade(
    respostaComPrs([integrado, fechadoSemMerge, fechadoSemMerge]),
    REPO,
  );

  assert.equal(resumo.total, '1 prédio');
});

test('Issue #5, Cenário 5: falha de rede mostra erro e NÃO mostra "0 prédios"', async () => {
  const semInternet = async () => {
    throw new TypeError('Failed to fetch');
  };

  const resumo = await cidade.carregarResumoCidade(semInternet, REPO);

  assert.equal(resumo.mensagem, 'Não foi possível carregar o histórico.');
  assert.equal(resumo.total, '');
});

test('Issue #5, Cenário 5: limite de consultas excedido (HTTP 403) mostra erro', async () => {
  const limite = async () => ({ ok: false, status: 403, json: async () => ({}) });

  const resumo = await cidade.carregarResumoCidade(limite, REPO);

  assert.equal(resumo.mensagem, 'Não foi possível carregar o histórico.');
  assert.equal(resumo.total, '');
});

test('Issue #5: a consulta usa a API pública sem autenticação, só PRs fechados', async () => {
  let urlChamada = '';
  let opcoes;
  const espiao = async (url, init) => {
    urlChamada = url;
    opcoes = init;
    return { ok: true, json: async () => [] };
  };

  await cidade.carregarResumoCidade(espiao, REPO);

  assert.ok(urlChamada.startsWith(`https://api.github.com/repos/${REPO}/pulls`));
  assert.ok(urlChamada.includes('state=closed'));
  assert.equal(opcoes?.headers?.Authorization, undefined);
});
