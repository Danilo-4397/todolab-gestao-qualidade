const MENSAGEM_ERRO = 'Não foi possível carregar o histórico.';
const MENSAGEM_VAZIA = 'A cidade ainda está vazia.';

export function formatarPredios(quantidade) {
  return quantidade === 1 ? '1 prédio' : `${quantidade} prédios`;
}

export function contarPrsIntegrados(prs) {
  return prs.filter((pr) => Boolean(pr.merged_at)).length;
}

export async function carregarResumoCidade(buscar, repositorio) {
  try {
    const url = `https://api.github.com/repos/${repositorio}/pulls?state=closed&per_page=100`;
    const resposta = await buscar(url, { headers: { Accept: 'application/vnd.github+json' } });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const total = contarPrsIntegrados(await resposta.json());
    return { total: formatarPredios(total), mensagem: total === 0 ? MENSAGEM_VAZIA : '' };
  } catch {
    return { total: '', mensagem: MENSAGEM_ERRO };
  }
}
