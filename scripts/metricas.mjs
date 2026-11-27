// Gera o resumo de métricas do Pull Request (nível 8). Uso: node scripts/metricas.mjs [branch-base]
import { spawnSync } from 'node:child_process';

function executar(comando, argumentos) {
  const r = spawnSync(comando, argumentos, { encoding: 'utf8', env: { ...process.env, FORCE_COLOR: '0' } });
  return { saida: `${r.stdout ?? ''}${r.stderr ?? ''}`, ok: r.status === 0 };
}

const base = process.argv[2] ?? 'origin/main';
const numero = (texto, rotulo) => texto.match(new RegExp(`${rotulo}\\s+(\\d+)`))?.[1] ?? '?';

const testes = executar(process.execPath, ['--test']);
const total = numero(testes.saida, '# tests');
const passaram = numero(testes.saida, '# pass');
const falharam = numero(testes.saida, '# fail');

const cobertura = executar(process.execPath, ['scripts/coverage.mjs']);
const linhasCobertura = cobertura.saida.split('\n').filter((l) => /^(OK|FALHA)\s+src\//.test(l));

const diff = executar('git', ['diff', '--shortstat', `${base}...HEAD`]).saida.trim() || 'sem diferenças em relação à base';
const arquivos = executar('git', ['diff', '--name-only', `${base}...HEAD`]).saida.split('\n').filter(Boolean);
const commits = executar('git', ['log', '--oneline', `${base}..HEAD`]).saida.split('\n').filter(Boolean);
const convencionais = commits.filter((c) => /^[0-9a-f]+ (feat|fix|docs|test|ci|refactor|chore|merge)(\([^)]*\))?!?:/i.test(c)).length;

const linhas = [
  '### Resumo de métricas',
  '',
  '| Métrica | Valor |',
  '|---|---|',
  `| Testes (node:test) | ${passaram} de ${total} passaram, ${falharam} falharam |`,
  `| Cobertura mínima de 60% | ${cobertura.ok ? 'aprovada' : 'REPROVADA'} |`,
  `| Arquivos alterados | ${arquivos.length} |`,
  `| Alteração | ${diff} |`,
  `| Commits no PR | ${commits.length} (${convencionais} no padrão convencional) |`,
  '',
  '**Cobertura de linhas por arquivo de `src/`**',
  '',
  ...(linhasCobertura.length ? linhasCobertura.map((l) => `- ${l}`) : ['- sem dados']),
  '',
  '_Gerado por `scripts/metricas.mjs`. Os testes E2E têm relatório próprio no artefato `playwright-report`._',
];

console.log(linhas.join('\n'));
