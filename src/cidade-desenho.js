// Desenho da Cidade do Processo no canvas. A lógica de posição e cor fica em cidade.js (testada).
// O céu e o chão são pintados pelo CSS; aqui só entram prédios e obras.

const JANELA_ACESA = '#ffd36b';
const JANELA_APAGADA = 'rgb(10 14 30 / 55%)';
const ANDAIME = '#ff8a3d';
const CLARO = '#f1ece1';

function misturar(hex, alvo, quantidade) {
  const partes = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
  const mistura = partes.map((valor) => Math.round(valor + (alvo - valor) * quantidade));
  return `rgb(${mistura.join(' ')})`;
}

// Sorteio fixo por prédio e janela: a mesma cidade sempre tem as mesmas luzes acesas.
function acesa(numero, linha, coluna) {
  const semente = (numero * 73856093) ^ (linha * 19349663) ^ (coluna * 83492791);
  return (semente >>> 0) % 100 < 58;
}

function desenharTopo(ctx, predio, topo) {
  const meio = predio.x + predio.w / 2;
  ctx.fillStyle = misturar(predio.cor, 0, 0.45);
  if (predio.tipo === 'feat') {
    ctx.fillRect(meio - 1, topo - 20, 2, 20);
    ctx.fillStyle = '#ff5a4d';
    ctx.beginPath();
    ctx.arc(meio, topo - 21, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (predio.tipo === 'docs') {
    ctx.fillRect(meio - 10, topo - 12, 20, 12);
    ctx.fillRect(meio - 12, topo - 14, 24, 3);
  } else if (predio.tipo === 'ci') {
    ctx.fillRect(predio.x + 8, topo - 7, 14, 7);
    ctx.fillRect(predio.x + 30, topo - 5, 18, 5);
  } else if (predio.tipo === 'test') {
    ctx.beginPath();
    ctx.moveTo(predio.x, topo);
    ctx.lineTo(meio, topo - 16);
    ctx.lineTo(predio.x + predio.w, topo);
    ctx.closePath();
    ctx.fill();
  } else if (predio.tipo === 'fix') {
    ctx.fillRect(predio.x + 36, topo - 14, 8, 14);
  } else {
    ctx.fillRect(predio.x - 2, topo - 3, predio.w + 4, 3);
  }
}

function desenharJanelas(ctx, predio) {
  const linhas = Math.floor((predio.h - 34) / 16);
  for (let linha = 0; linha < linhas; linha += 1) {
    for (let coluna = 0; coluna < 3; coluna += 1) {
      const ligada = acesa(predio.numero, linha, coluna);
      ctx.fillStyle = ligada ? JANELA_ACESA : JANELA_APAGADA;
      ctx.shadowColor = ligada ? JANELA_ACESA : 'transparent';
      ctx.shadowBlur = ligada ? 6 : 0;
      ctx.fillRect(predio.x + 8 + coluna * 16, predio.y + 12 + linha * 16, 8, 9);
    }
  }
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgb(10 14 30 / 80%)';
  ctx.fillRect(predio.x + predio.w / 2 - 5, predio.y + predio.h - 14, 10, 14);
}

function desenharPredio(ctx, predio, progresso, destacado) {
  const altura = predio.h * progresso;
  const topo = predio.y + (predio.h - altura);

  ctx.fillStyle = 'rgb(0 0 0 / 28%)';
  ctx.fillRect(predio.x + 5, predio.y + predio.h, predio.w, 4);

  const corpo = ctx.createLinearGradient(predio.x, 0, predio.x + predio.w, 0);
  corpo.addColorStop(0, misturar(predio.cor, 255, 0.18));
  corpo.addColorStop(0.55, predio.cor);
  corpo.addColorStop(1, misturar(predio.cor, 0, 0.38));
  ctx.fillStyle = corpo;
  ctx.fillRect(predio.x, topo, predio.w, altura);

  ctx.fillStyle = 'rgb(255 255 255 / 22%)';
  ctx.fillRect(predio.x, topo, predio.w, 2);

  if (progresso >= 1) {
    desenharTopo(ctx, predio, topo);
    desenharJanelas(ctx, predio);
  }

  if (destacado) {
    ctx.strokeStyle = CLARO;
    ctx.lineWidth = 2;
    ctx.shadowColor = CLARO;
    ctx.shadowBlur = 12;
    ctx.strokeRect(predio.x - 1, topo - 1, predio.w + 2, altura + 2);
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }
}

function desenharObra(ctx, obra, destacado) {
  const fundo = obra.y + obra.h;

  // guindaste: torre, lança, cabo e gancho
  const torre = obra.x + obra.w - 8;
  ctx.strokeStyle = ANDAIME;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(torre, fundo);
  ctx.lineTo(torre, obra.y - 38);
  ctx.moveTo(torre + 10, obra.y - 38);
  ctx.lineTo(obra.x - 6, obra.y - 38);
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(obra.x + 8, obra.y - 38);
  ctx.lineTo(obra.x + 8, obra.y - 14);
  ctx.stroke();
  ctx.fillStyle = ANDAIME;
  ctx.fillRect(obra.x + 4, obra.y - 14, 8, 5);

  // andaime: contorno tracejado, montantes e diagonais
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(obra.x, obra.y, obra.w, obra.h);
  ctx.setLineDash([]);
  ctx.lineWidth = 1;
  for (let x = obra.x + 14; x < obra.x + obra.w; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, obra.y);
    ctx.lineTo(x, fundo);
    ctx.stroke();
  }
  for (let y = obra.y + 16; y < fundo; y += 16) {
    ctx.beginPath();
    ctx.moveTo(obra.x, y);
    ctx.lineTo(obra.x + 14, y - 16);
    ctx.stroke();
  }

  // faixa de alerta no pé da obra
  for (let x = obra.x; x < obra.x + obra.w; x += 10) {
    ctx.fillStyle = (x - obra.x) % 20 === 0 ? ANDAIME : '#1c2547';
    ctx.fillRect(x, fundo - 5, Math.min(10, obra.x + obra.w - x), 5);
  }

  if (destacado) {
    ctx.strokeStyle = CLARO;
    ctx.lineWidth = 2;
    ctx.strokeRect(obra.x - 1, obra.y - 1, obra.w + 2, obra.h + 2);
  }
}

// progresso: 0 a 1, usado só na animação de subida dos prédios.
export function desenharCidade(ctx, plano, { progresso = 1, destaque = null } = {}) {
  ctx.clearRect(0, 0, plano.largura, plano.altura);

  plano.predios.forEach((predio, indice) => {
    // cada prédio começa um pouco depois do anterior
    const atraso = indice / Math.max(plano.predios.length, 1) * 0.5;
    const local = Math.min(Math.max((progresso - atraso) / 0.5, 0), 1);
    desenharPredio(ctx, predio, local, destaque?.numero === predio.numero && destaque.tipo !== 'obra');
  });
  plano.obras.forEach((obra) => {
    desenharObra(ctx, obra, destaque?.numero === obra.numero && destaque.tipo === 'obra');
  });
}
