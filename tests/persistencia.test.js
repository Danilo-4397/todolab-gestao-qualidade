import test from 'node:test';
import assert from 'node:assert/strict';
import { TodoStore } from '../src/store.js';

// Armazenamento em memória (sem navegador), no lugar do localStorage.
class ArmazenamentoMemoria {
  constructor(dados = {}) {
    this.dados = dados;
  }

  getItem(chave) {
    return this.dados[chave] ?? null;
  }

  setItem(chave, valor) {
    this.dados[chave] = String(valor);
  }
}

const CHAVE = 'todolab:tarefas';

test('Issue #3, Cenário 1: 2 tarefas cadastradas continuam após recarregar', () => {
  const armazenamento = new ArmazenamentoMemoria();
  const store = new TodoStore(armazenamento);
  store.adicionar('A');
  store.adicionar('B');

  const recarregado = new TodoStore(armazenamento);

  assert.equal(recarregado.listar().length, 2);
});

test('Issue #3, Cenário 2: sem dado salvo abre com a lista vazia', () => {
  const store = new TodoStore(new ArmazenamentoMemoria());

  assert.deepEqual(store.listar(), []);
});

test('Issue #3, Cenário 3: JSON inválido abre com a lista vazia e sem erro', () => {
  const armazenamento = new ArmazenamentoMemoria({ [CHAVE]: '{abc' });
  const erros = [];
  const original = console.error;
  console.error = (...args) => erros.push(args);

  try {
    const store = new TodoStore(armazenamento);
    assert.deepEqual(store.listar(), []);
  } finally {
    console.error = original;
  }

  assert.equal(erros.length, 0, 'Não deveria escrever erro no Console');
});

test('Issue #3, Cenário 4: JSON válido que não é lista abre com a lista vazia', () => {
  const armazenamento = new ArmazenamentoMemoria({ [CHAVE]: '{"a":1}' });

  const store = new TodoStore(armazenamento);

  assert.deepEqual(store.listar(), []);
});

test('Issue #3, Cenário 5: após dado corrompido, adicionar e recarregar mantém a tarefa', () => {
  const armazenamento = new ArmazenamentoMemoria({ [CHAVE]: '{abc' });
  const store = new TodoStore(armazenamento);
  store.adicionar('Recuperada');

  const recarregado = new TodoStore(armazenamento);

  assert.equal(recarregado.listar().length, 1);
  assert.equal(recarregado.listar()[0].titulo, 'Recuperada');
});
