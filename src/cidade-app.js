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

  // A cidade é desenhada em unidades lógicas e ampliada: o canvas tem resolução da tela, sem borrar.
  visor.hidden = false;
  const rolagem = canvas.parentElement;
  const ampliacao = Math.min(1.8, Math.max(1.25, rolagem.clientWidth / plano.largura));
  const densidade = globalThis.devicePixelRatio || 1;
  const escalaCanvas = ampliacao * densidade;
  canvas.width = Math.round(plano.largura * escalaCanvas);
  canvas.height = Math.round(plano.altura * escalaCanvas);
  canvas.style.width = `${plano.largura * ampliacao}px`;
  canvas.style.height = `${plano.altura * ampliacao}px`;
  rolagem.style.setProperty('--solo', `${(plano.chao) * ampliacao}px`);
  canvas.setAttribute('aria-label', textoAlternativo(plano).split('\n')[0]);

  // com muitos prédios, abre mostrando os mais recentes
  rolagem.scrollLeft = rolagem.scrollWidth;

  const redesenhar = (progresso = 1) => {
    ctx.setTransform(escalaCanvas, 0, 0, escalaCanvas, 0, 0);
    desenharCidade(ctx, plano, { progresso, destaque });
  };

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
    const escala = plano.largura / caixa.width;
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
