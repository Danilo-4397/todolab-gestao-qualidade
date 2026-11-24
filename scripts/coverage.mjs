import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

const MINIMO = 60;

const execucao = spawnSync(process.execPath, ['--test', '--experimental-test-coverage'], { encoding: 'utf8' });
process.stdout.write(execucao.stdout);
process.stderr.write(execucao.stderr);
if (execucao.status !== 0) {
  throw new Error('Cobertura não avaliada: os testes falharam.');
}

// Lê o relatório de cobertura (com prefixo "# " ou "ℹ ", conforme a versão do Node).
let pasta = '';
const medidos = new Map();
for (const linha of execucao.stdout.split('\n')) {
  const colunas = linha.replace(/^\s*(#|ℹ)\s?/, '').split('|').map((parte) => parte.trim());
  if (colunas.length < 4) continue;
  const nome = colunas[0].replace(/\\/g, '/');
  const porcentagemLinhas = colunas[1];
  if (!/\.js$/.test(nome)) {
    pasta = nome;
    continue;
  }
  // O Node 20 imprime o caminho completo (src/store.js); versões novas agrupam por pasta.
  const caminho = nome.includes('/') ? nome : `${pasta}/${nome}`;
  if (caminho.startsWith('src/') && porcentagemLinhas !== '') medidos.set(caminho.slice(4), Number(porcentagemLinhas));
}

if (medidos.size === 0) {
  throw new Error('Cobertura não avaliada: nenhum arquivo de src/ apareceu no relatório.');
}

// Arquivos de src/ que nenhum teste carrega não entram no relatório do Node; ficam listados.
const naoCarregados = readdirSync('src').filter((nome) => nome.endsWith('.js') && !medidos.has(nome));

let reprovou = false;
for (const [nome, valor] of medidos) {
  const aprovado = valor >= MINIMO;
  reprovou = reprovou || !aprovado;
  console.log(`${aprovado ? 'OK ' : 'FALHA'} src/${nome}: ${valor.toFixed(2)}% das linhas (mínimo ${MINIMO}%)`);
}
if (naoCarregados.length > 0) {
  console.log(`Sem teste unitário (dependem do navegador, ficam para os testes E2E): ${naoCarregados.join(', ')}`);
}
if (reprovou) throw new Error(`Cobertura abaixo de ${MINIMO}% em pelo menos um arquivo de src/.`);
console.log(`Cobertura aprovada: todos os arquivos de src/ testados têm ${MINIMO}% ou mais das linhas.`);
