import { acharPorPonto, carregarCidade, textoAlternativo } from './cidade.js';
import { desenharCidade } from './cidade-desenho.js';

const REPOSITORIO = 'Danilo-4397/todolab-gestao-qualidade';
const total = document.querySelector('#cidade-total');
const mensagem = document.querySelector('#cidade-mensagem');
const canvas = document.querySelector('#cidade-canvas');
const lista = document.querySelector('#cidade-lista');
const dica = document.querySelector('#cidade-dica');
const visor = document.querySelector('#cidade-visor');

const resultado = await carregarCidade(globalThis.fetch.bind(globalThis), REPOSITORIO);
total.textContent = resultado.total;
mensagem.textContent = resultado.mensagem;

if (resultado.plano) {
  const plano = resultado.plano;
  const ctx = canvas.getContext('2d');
  let destaque = null;

  canvas.width = plano.largura;
  canvas.height = plano.altura;
  canvas.setAttribute('aria-label', textoAlternativo(plano).split('\n')[0]);
  visor.hidden = false;

  const redesenhar = (progresso = 1) => desenharCidade(ctx, plano, { progresso, destaque });

  const destacar = (item) => {
    destaque = item;
    dica.textContent = item ? `#${item.numero} ${item.titulo}` : '';
    redesenhar();
  };

  // lista só para leitores de tela e teclado: cada item é focável e destaca o prédio
  for (const item of [...plano.predios, ...plano.obras]) {
    const linha = document.createElement('li');
    linha.tabIndex = 0;
    linha.textContent = `${item.tipo === 'obra' ? 'Obra' : 'Prédio'}: #${item.numero} ${item.titulo}`;
    linha.addEventListener('focus', () => destacar(item));
    linha.addEventListener('blur', () => destacar(null));
    lista.append(linha);
  }

  canvas.addEventListener('mousemove', (evento) => {
    const caixa = canvas.getBoundingClientRect();
    const escala = canvas.width / caixa.width;
    const item = acharPorPonto(plano, (evento.clientX - caixa.left) * escala, (evento.clientY - caixa.top) * escala);
    if (item?.numero !== destaque?.numero) destacar(item);
  });
  canvas.addEventListener('mouseleave', () => destacar(null));

  // animação de subida dos prédios (pulada para quem prefere menos movimento)
  const reduzido = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduzido) {
    redesenhar();
  } else {
    const inicio = performance.now();
    const passo = (agora) => {
      const progresso = Math.min((agora - inicio) / 900, 1);
      redesenhar(progresso);
      if (progresso < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }
}
