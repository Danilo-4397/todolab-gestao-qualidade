import test from 'node:test';
import assert from 'node:assert/strict';
import { TodoStore } from '../src/store.js';

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

const CHAVE = 'todolab:tarefas';

function criarStore(armazenamento, titulos, concluidas = []) {
  const store = new TodoStore(armazenamento);
  for (const titulo of titulos) store.adicionar(titulo);
  for (const tarefa of store.listar()) {
    if (concluidas.includes(tarefa.titulo)) store.alternar(tarefa.id);
  }
  return store;
}

test('Issue #4, Cenário 1: limpa só as concluídas e mantém a pendente', () => {
  const store = criarStore(new ArmazenamentoMemoria(), ['A', 'B', 'C'], ['A', 'B']);

  store.limparConcluidas();

  const titulos = store.listar().map((tarefa) => tarefa.titulo);
  assert.deepEqual(titulos, ['C']);
});

test('Issue #4, Cenário 2: com pelo menos 1 concluída, o botão deve aparecer', () => {
  const store = criarStore(new ArmazenamentoMemoria(), ['A', 'B'], ['A']);

  assert.equal(store.quantidadeConcluidas(), 1);
});

test('Issue #4, Cenário 3: sem nenhuma concluída, o botão não deve aparecer', () => {
  const store = criarStore(new ArmazenamentoMemoria(), ['A', 'B']);

  assert.equal(store.quantidadeConcluidas(), 0);
});

test('Issue #4, Cenário 4: as removidas não voltam e não ficam no armazenamento', () => {
  const armazenamento = new ArmazenamentoMemoria();
  const store = criarStore(armazenamento, ['Feita', 'Pendente'], ['Feita']);

  store.limparConcluidas();

  const recarregado = new TodoStore(armazenamento);
  assert.deepEqual(recarregado.listar().map((tarefa) => tarefa.titulo), ['Pendente']);
  assert.equal(armazenamento.getItem(CHAVE).includes('Feita'), false);
});

test('Issue #4, Cenário 5: todas concluídas, a lista fica vazia', () => {
  const store = criarStore(new ArmazenamentoMemoria(), ['A', 'B'], ['A', 'B']);

  store.limparConcluidas();

  assert.equal(store.listar().length, 0);
  assert.equal(store.quantidadeConcluidas(), 0);
});
