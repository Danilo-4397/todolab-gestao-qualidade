import { carregarResumoCidade } from './cidade.js';

const REPOSITORIO = 'Danilo-4397/todolab-gestao-qualidade';
const total = document.querySelector('#cidade-total');
const mensagem = document.querySelector('#cidade-mensagem');

const resumo = await carregarResumoCidade(globalThis.fetch.bind(globalThis), REPOSITORIO);
total.textContent = resumo.total;
mensagem.textContent = resumo.mensagem;
