import test from 'node:test';
import assert from 'node:assert/strict';
import * as modulo from '../src/store.js';

const { TodoStore } = modulo;

// Armazenamento em memória (sem navegador), no lugar do localStorage.
class ArmazenamentoMemoria {
  constructor() {
    this.dados = {};
  }

  getItem(chave) {
    return this.dados[chave] ?? null;
  }

  setItem(chave, valor) {
    this.dados[chave] = String(valor);
  }
}

// Texto exato que a página exibe para o contador.
function textoContador(store) {
  return modulo.formatarRestantes(store.restantes());
}

function criarStoreComTarefas(armazenamento, titulos) {
  const store = new TodoStore(armazenamento);
  for (const titulo of titulos) store.adicionar(titulo);
  return store;
}

test('Issue #2, Cenário 1: sem tarefas mostra "0 itens restantes"', () => {
  const store = new TodoStore(new ArmazenamentoMemoria());

  assert.equal(textoContador(store), '0 itens restantes');
});

test('Issue #2, Cenário 2: 1 tarefa pendente mostra "1 item restante"', () => {
  const store = criarStoreComTarefas(new ArmazenamentoMemoria(), ['A']);

  assert.equal(textoContador(store), '1 item restante');
});

test('Issue #2, Cenário 3: 3 tarefas pendentes mostram "3 itens restantes"', () => {
  const store = criarStoreComTarefas(new ArmazenamentoMemoria(), ['A', 'B', 'C']);

  assert.equal(textoContador(store), '3 itens restantes');
});

test('Issue #2, Cenário 4: concluir uma tarefa atualiza para "2 itens restantes"', () => {
  const store = criarStoreComTarefas(new ArmazenamentoMemoria(), ['A', 'B', 'C']);

  store.alternar(store.listar()[0].id);

  assert.equal(textoContador(store), '2 itens restantes');
});

test('Issue #2, Cenário 5: só tarefas pendentes são contadas', () => {
  const store = criarStoreComTarefas(new ArmazenamentoMemoria(), ['A', 'B', 'C']);
  const [primeira, segunda] = store.listar();
  store.alternar(primeira.id);
  store.alternar(segunda.id);

  assert.equal(textoContador(store), '1 item restante');
});

test('Issue #2, Cenário 6: remover uma tarefa pendente atualiza para "1 item restante"', () => {
  const store = criarStoreComTarefas(new ArmazenamentoMemoria(), ['A', 'B']);

  store.remover(store.listar()[0].id);

  assert.equal(textoContador(store), '1 item restante');
});

test('Issue #2, Cenário 7: o contador persiste ao recarregar', () => {
  const armazenamento = new ArmazenamentoMemoria();
  criarStoreComTarefas(armazenamento, ['A', 'B']);

  const recarregado = new TodoStore(armazenamento);

  assert.equal(textoContador(recarregado), '2 itens restantes');
});
