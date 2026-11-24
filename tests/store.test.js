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

test('Issue #1, Cenário 1: texto válido cria a tarefa', () => {
  const store = new TodoStore(new ArmazenamentoMemoria());

  const tarefa = store.adicionar('Estudar QA');

  assert.ok(tarefa, 'Deveria retornar a tarefa criada');
  assert.equal(tarefa.titulo, 'Estudar QA');
  assert.equal(store.listar().length, 1);
});

test('Issue #1, Cenário 2: campo vazio não cria tarefa', () => {
  const store = new TodoStore(new ArmazenamentoMemoria());

  assert.equal(store.adicionar(''), null);
  assert.equal(store.listar().length, 0);
});

test('Issue #1, Cenário 3: só espaços ou tabulações não cria tarefa', () => {
  const store = new TodoStore(new ArmazenamentoMemoria());

  for (const entrada of ['   ', '\t', ' \t ']) {
    assert.equal(store.adicionar(entrada), null, `Entrada rejeitada: ${JSON.stringify(entrada)}`);
  }

  assert.equal(store.listar().length, 0);
});

test('Issue #1, Cenário 4: espaços nas pontas são removidos do título', () => {
  const store = new TodoStore(new ArmazenamentoMemoria());

  const tarefa = store.adicionar('  Estudar QA  ');

  assert.ok(tarefa, 'Deveria criar a tarefa');
  assert.equal(tarefa.titulo, 'Estudar QA');
});

test('Issue #1, Cenário 5: entrada inválida não altera tarefas nem armazenamento', () => {
  const armazenamento = new ArmazenamentoMemoria();
  const store = new TodoStore(armazenamento);
  store.adicionar('Estudar QA');
  const antes = armazenamento.getItem(CHAVE);

  assert.equal(store.adicionar(''), null);
  assert.equal(store.adicionar('   '), null);

  assert.equal(store.listar().length, 1);
  assert.equal(armazenamento.getItem(CHAVE), antes);
});