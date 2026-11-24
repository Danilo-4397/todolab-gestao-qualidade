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

// ---- Cidade desenhada no canvas (Issue #7) ----

export const CORES = {
  feat: '#c7ff43',
  fix: '#ff6b35',
  docs: '#4da3ff',
  test: '#b388ff',
  ci: '#2ee6d6',
  outro: '#a7a39a',
};

// Altura por tipo: a única variação do desenho vem de um dado real (o tipo do título).
const ALTURAS = { feat: 150, fix: 110, docs: 80, test: 100, ci: 90, outro: 70 };

const MARGEM = 24;
const LARGURA_LOTE = 56;
const ESPACO = 14;
const ALTURA_CANVAS = 230;
const CHAO = ALTURA_CANVAS - 30;
const ALTURA_OBRA = 64;

export function tipoDoTitulo(titulo) {
  const achado = /^(feat|fix|docs|test|ci)(\([^)]*\))?!?:/.exec(titulo ?? '');
  return achado ? achado[1] : 'outro';
}

export function planejarCidade(prs, issues) {
  const integrados = prs
    .filter((pr) => Boolean(pr.merged_at))
    .sort((a, b) => new Date(a.merged_at) - new Date(b.merged_at));
  const abertas = issues.filter((issue) => !issue.pull_request);

  const predios = integrados.map((pr, indice) => {
    const tipo = tipoDoTitulo(pr.title);
    const altura = ALTURAS[tipo];
    return {
      numero: pr.number,
      titulo: pr.title,
      tipo,
      cor: CORES[tipo],
      x: MARGEM + indice * (LARGURA_LOTE + ESPACO),
      y: CHAO - altura,
      w: LARGURA_LOTE,
      h: altura,
    };
  });

  const inicioObras = MARGEM + predios.length * (LARGURA_LOTE + ESPACO);
  const obras = abertas.map((issue, indice) => ({
    numero: issue.number,
    titulo: issue.title,
    tipo: 'obra',
    x: inicioObras + indice * (LARGURA_LOTE + ESPACO),
    y: CHAO - ALTURA_OBRA,
    w: LARGURA_LOTE,
    h: ALTURA_OBRA,
  }));

  const lotes = predios.length + obras.length;
  const largura = MARGEM * 2 + Math.max(lotes, 1) * (LARGURA_LOTE + ESPACO) - ESPACO;
  return { predios, obras, largura, altura: ALTURA_CANVAS, chao: CHAO };
}

export function acharPorPonto(plano, px, py) {
  const dentro = (item) => px >= item.x && px <= item.x + item.w && py >= item.y && py <= item.y + item.h;
  return [...plano.predios, ...plano.obras].find(dentro) ?? null;
}

export function textoAlternativo(plano) {
  const linhas = [
    `${formatarPredios(plano.predios.length)} e ${plano.obras.length} em obra.`,
    ...plano.predios.map((p) => `Prédio: #${p.numero} ${p.titulo}`),
    ...plano.obras.map((o) => `Obra: #${o.numero} ${o.titulo}`),
  ];
  return linhas.join('\n');
}

async function consultar(buscar, url) {
  const resposta = await buscar(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  return resposta.json();
}

export async function carregarCidade(buscar, repositorio) {
  try {
    const base = `https://api.github.com/repos/${repositorio}`;
    const [prs, issues] = await Promise.all([
      consultar(buscar, `${base}/pulls?state=closed&per_page=100`),
      consultar(buscar, `${base}/issues?state=open&per_page=100`),
    ]);
    const plano = planejarCidade(prs, issues);
    const vazia = plano.predios.length === 0 && plano.obras.length === 0;
    return {
      plano,
      total: formatarPredios(plano.predios.length),
      mensagem: vazia ? MENSAGEM_VAZIA : '',
    };
  } catch {
    return { total: '', mensagem: MENSAGEM_ERRO };
  }
}
