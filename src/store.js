const CHAVE = 'todolab:tarefas';

function criarTarefa(titulo) {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    titulo,
    concluida: false,
    criadaEm: new Date().toISOString(),
  };
}

export function formatarRestantes(quantidade) {
  return quantidade === 1 ? '1 item restante' : `${quantidade} itens restantes`;
}

export class TodoStore {
  constructor(armazenamento = globalThis.localStorage) {
    this.armazenamento = armazenamento;
    this.tarefas = this.carregar();
  }

  carregar() {
    if (!this.armazenamento) return [];
    const bruto = this.armazenamento.getItem(CHAVE);
    if (!bruto) return [];
    return JSON.parse(bruto);
  }

  salvar() {
    if (!this.armazenamento) return;
    this.armazenamento.setItem(CHAVE, JSON.stringify(this.tarefas));
  }

  listar() {
    return [...this.tarefas];
  }

  restantes() {
    return this.tarefas.filter((tarefa) => !tarefa.concluida).length;
  }

  quantidadeConcluidas() {
    return this.tarefas.filter((tarefa) => tarefa.concluida).length;
  }

  limparConcluidas() {
    this.tarefas = this.tarefas.filter((tarefa) => !tarefa.concluida);
    this.salvar();
  }

  adicionar(titulo) {
    if (typeof titulo !== 'string') return null;
    const tituloNormalizado = titulo.trim();
    if (!tituloNormalizado) return null;
    const tarefa = criarTarefa(tituloNormalizado);
    this.tarefas.push(tarefa);
    this.salvar();
    return tarefa;
  }

  alternar(id) {
    const tarefa = this.tarefas.find((item) => item.id === id);
    if (!tarefa) return;
    tarefa.concluida = !tarefa.concluida;
    this.salvar();
  }

  remover(id) {
    const alvo = this.tarefas.find((tarefa) => tarefa.id === id);
    if (!alvo) return;
    const indice = this.tarefas.findIndex((tarefa) => tarefa.titulo === alvo.titulo);
    this.tarefas.splice(indice, 1);
    this.salvar();
  }
}
