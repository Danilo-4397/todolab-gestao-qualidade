// Desenho da Cidade do Processo no canvas. A lógica de posição e cor fica em cidade.js (testada).

const CEU = '#101210';
const CHAO_COR = '#343a34';
const JANELA = '#f4f0e8';
const ANDAIME = '#ff6b35';

function desenharPredio(ctx, predio, progresso, destacado) {
  const altura = predio.h * progresso;
  const topo = predio.y + (predio.h - altura);

  ctx.fillStyle = predio.cor;
  ctx.fillRect(predio.x, topo, predio.w, altura);

  // janelas: aparecem só depois que o prédio termina de subir
  if (progresso >= 1) {
    ctx.fillStyle = JANELA;
    for (let linha = 0; linha < Math.floor((predio.h - 14) / 22); linha += 1) {
      for (let coluna = 0; coluna < 3; coluna += 1) {
        ctx.globalAlpha = 0.55;
        ctx.fillRect(predio.x + 9 + coluna * 15, predio.y + 10 + linha * 22, 8, 12);
      }
    }
    ctx.globalAlpha = 1;
  }

  if (destacado) {
    ctx.strokeStyle = '#f4f0e8';
    ctx.lineWidth = 2;
    ctx.strokeRect(predio.x - 1, topo - 1, predio.w + 2, altura + 2);
  }
}

function desenharObra(ctx, obra, destacado) {
  ctx.strokeStyle = ANDAIME;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(obra.x, obra.y, obra.w, obra.h);
  ctx.setLineDash([]);

  // andaime: montantes e travessas
  ctx.lineWidth = 1;
  for (let x = obra.x + 14; x < obra.x + obra.w; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, obra.y);
    ctx.lineTo(x, obra.y + obra.h);
    ctx.stroke();
  }
  for (let y = obra.y + 16; y < obra.y + obra.h; y += 16) {
    ctx.beginPath();
    ctx.moveTo(obra.x, y);
    ctx.lineTo(obra.x + obra.w, y);
    ctx.stroke();
  }

  if (destacado) {
    ctx.strokeStyle = '#f4f0e8';
    ctx.lineWidth = 2;
    ctx.strokeRect(obra.x - 1, obra.y - 1, obra.w + 2, obra.h + 2);
  }
}

// progresso: 0 a 1, usado só na animação de subida dos prédios.
export function desenharCidade(ctx, plano, { progresso = 1, destaque = null } = {}) {
  ctx.clearRect(0, 0, plano.largura, plano.altura);
  ctx.fillStyle = CEU;
  ctx.fillRect(0, 0, plano.largura, plano.altura);

  ctx.fillStyle = CHAO_COR;
  ctx.fillRect(0, plano.chao, plano.largura, plano.altura - plano.chao);

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
