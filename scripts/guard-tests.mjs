import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

function arquivos(pasta) {
  if (!existsSync(pasta)) return [];
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

const problemas = [];

// 1. Código de produção não pode conter teste nem depender de biblioteca de teste.
for (const caminho of arquivos('src').filter((nome) => nome.endsWith('.js'))) {
  const codigo = readFileSync(caminho, 'utf8');
  if (/\.test\.js$/.test(caminho)) problemas.push(`${caminho}: arquivo de teste dentro de src/`);
  if (/from\s+['"]node:(test|assert)/.test(codigo)) problemas.push(`${caminho}: importa node:test ou node:assert`);
  if (/^\s*(test|it|describe)\(/m.test(codigo)) problemas.push(`${caminho}: contém chamada de teste (test/it/describe)`);
  if (/\bexecutarTeste\w*/.test(codigo)) problemas.push(`${caminho}: contém função de teste executarTeste*`);
}

// 2. Tem que existir teste, e cada arquivo de teste precisa verificar algo.
const testes = arquivos('tests').filter((nome) => nome.endsWith('.test.js'));
if (testes.length === 0) problemas.push('tests/: nenhum arquivo *.test.js encontrado');
for (const caminho of testes) {
  const codigo = readFileSync(caminho, 'utf8');
  if (!/assert/.test(codigo)) problemas.push(`${caminho}: nenhuma asserção encontrada`);
  // 3. Teste não pode ser desligado para esconder falha.
  if (/\b(test|it|describe)\.(skip|only|todo)\b|\{\s*(skip|todo)\s*:/.test(codigo)) {
    problemas.push(`${caminho}: usa skip, only ou todo`);
  }
}

if (problemas.length > 0) {
  for (const problema of problemas) console.error(`FALHA ${problema}`);
  throw new Error(`guard-tests reprovado: ${problemas.length} problema(s).`);
}
console.log(`guard-tests aprovado: ${testes.length} arquivos de teste em tests/, nenhum teste em src/, nenhum skip/only/todo.`);
