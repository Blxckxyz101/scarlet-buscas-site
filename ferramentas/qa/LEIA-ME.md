# Verificador anti-bug (rodar ANTES de todo render)
- `qa.js`: checa a cada 0,1 s de cada plano:
  - boneco/objeto atravessando (inclusive peça enterrada inteira);
  - pé flutuando ou enterrado;
  - boneco dentro de outro boneco;
  - câmera dentro de objeto.
- `runqa.js <url> 0.1`: roda tudo e lista por plano. O render só começa com "TOTAL ... 0".
- `determ.js`: o mesmo quadro tem que sair IDÊNTICO em processos diferentes (sorteio fixo). Evita o cenário "pulando" entre partes do render.
- Depois do render: `ffmpeg -vf freezedetect=n=-60dB:d=0.5` (nenhum trecho congelado) + revisão visual de 1 quadro por plano.
