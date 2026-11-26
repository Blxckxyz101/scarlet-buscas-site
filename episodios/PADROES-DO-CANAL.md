# Padrões do canal Nhacudo (seguir em todo episódio)

## Pedidos do dono
- **Duração:** sempre entre **1:45 e 2:00**. Roteiro com cerca de 370 a 410 palavras, com voz acelerada 1,25x.
- **Título, descrição e textos:** sempre mandar **em arquivo** no chat (o dono usa o celular).
- **Roteiro aprovado antes** de gerar narração.
- **Voz:** ElevenLabs "Mike", narrador único, acelerar **1,25x** (atempo).
- **Música:** alternar "Numbers" (A) e "Fallen Down" (B), mixada no vídeo em volume baixo, abaixando quando a voz fala.
- **"Parte 2 em breve"** só se o dono pedir.

## Visual (aprendido com os virais)
- Boneco e **andar estilo Roblox clássico (R6)**: braços e pernas retos, balanço de pêndulo, sem joelho/cotovelo, sem pé deslizando, sempre de frente pra onde anda.
- **Legenda de 1 palavra por vez**, amarelo-limão com contorno preto.
- **Uma imagem pra cada frase** da narração. Multidão grande nos clímax.
- Luz de evento em toda cena (janelas acesas, holofotes, faíscas, chuva, sirene, brilho).
- Primeiro quadro já mostra a regra da cidade.

## Checklist de detalhes antes do render final
- [ ] **Rodar `ferramentas/qa/runqa.js` (passo 0,1 s) até dar 0 problemas.** Incluir TODO objeto que se move (cachorro, carro, etc.) no verificador.
- [ ] Rodar `determ.js` (quadros idênticos entre processos). Proibido `Math.random` sem semente.
- [ ] Revisão visual: 1 quadro por plano + conferir se nada tampa o personagem.
- [ ] Áudio: -14 LUFS, pico ≤ -2 dB, música baixa.
- [ ] Nenhum boneco atravessando objeto (bancos, cercas, postes, outros bonecos). Conferir de frente E de lado.
- [ ] Ninguém andando de costas ou de lado; velocidade do passo bate com o deslocamento.
- [ ] Efeitos simétricos: linhas de vento/velocidade dos **dois lados** da tela.
- [ ] Áudio: todo efeito centralizado/equilibrado nos dois lados (medir L/R).
- [ ] Câmera não entra dentro de parede, boneco ou objeto.
- [ ] Piso de interiores sem "piscar" grama (elevar o piso 0,04).
- [ ] Legenda com nomes corrigidos (Nhacudo etc.).
- [ ] Duração entre 1:45 e 2:00.
