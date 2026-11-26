# Prompt para continuar o canal Roblox do Nhacudo

Copie tudo entre as linhas `=====` e cole numa sessão nova do Claude Code (com o repositório `scarlet-buscas-site` aberto).

=====
Você vai continuar a produção do meu canal de YouTube Shorts **"Nessa cidade…"** em estilo **Roblox**, com o mascote **Nhacudo** (moletom de tubarão azul). Tudo fica em `canal-roblox-nhacudo/` neste repositório. **Não confunda com o meu canal de stickman** (outro repositório, outro kit, outras regras).

## 1. Antes de qualquer coisa
1. Leia, nesta ordem: `canal-roblox-nhacudo/CLAUDE.md`, `README.md`, `REGRAS-E-PADROES.md`, `analise/licoes-skill-roblox-in-this-town.md`, `analise/plano-crescimento-e-temas.md` e o último episódio em `episodios/`.
2. Carregue as skills do repositório quando forem úteis: `roblox-in-this-town` (o que viraliza, medido), `threejs-*`, `game-feel`, `short-form-video`.
3. Prepare o motor: `cd canal-roblox-nhacudo/motor && ./setup.sh`, depois `npx -y http-server -p 8767 -s -c-1 . &` (se o servidor cair com ERR_CONNECTION_REFUSED, suba de novo).
4. Trabalhe numa **cópia de trabalho** do motor fora do repositório se for gerar muitos quadros (os quadros não vão pro git), e copie de volta só o código.

## 2. Como eu trabalho (meus pedidos)
- Responda em **pt-BR, curto e direto** (estilo caveman), sem perder conteúdo.
- Estou no **celular**: título, descrição e qualquer texto longo vão **em arquivo** no chat (SendUserFile), nunca só na mensagem.
- Gancho **sempre** começa com "Nessa cidade…".
- Duração **sempre entre 1:45 e 2:00** (370 a 410 palavras com voz a 1,25x; terror pode ser mais lento, ~310 palavras a 1,1x).
- **Mostre o roteiro pra eu aprovar antes** de eu gerar a narração. Eu gero a voz no ElevenLabs (voz **"Mike"**) e mando o MP3.
- Música: alternar **"Numbers"** (trilha A) e **"Fallen Down"** (trilha B), baixinho e abaixando quando a voz fala. Eu mando os arquivos. Pra terror, dá pra compor uma trilha em código (sem direitos).
- **"Parte 2"** só se eu pedir.
- Entrega final: MP4 1080x1920 + versão leve pro celular + **link do gofile.io** + `legendas.srt` + `thumbnail.jpg` + `titulo-e-descricao.md` (em arquivo).
- Quero **zero bugs**: ninguém atravessando nada, flutuando, andando de costas, deslizando; câmera nunca dentro de parede; rosto nunca tampado. Revise várias vezes. Procure skills e referências quando algo puder ficar melhor.
- Personagens fictícios; não imitar voz de pessoa real; não copiar personagem/arte de outras obras. Meu e-mail e meus dados são privados.

## 3. O estilo (o que funciona, medido nos virais)
- Personagens **R6 Roblox** (6 blocos), andar R6 clássico (pêndulo, sem joelho), rostos desenhados estilo Roblox (`faces2.js`). Captura de movimento (`ual.glb`) **só em momentos específicos** (sentar, levar pancada, interagir).
- **Poucos lugares, revisitados** (2 ou 3 por episódio). Câmera de jogador (lente 50 a 60°, acima da cabeça), sempre se mexendo devagar (avanço 8 a 11%/s), **closes só em 10 a 15%** do tempo (punchline, susto, virada).
- **2 ou mais pessoas no quadro** em 40 a 60% dos planos; figurantes sempre fazendo alguma coisa.
- Gancho: personagem grande e legível com a regra visível no 1º quadro + texto do gancho na tela.
- Rosto de pavor/choque no máximo 2x por vídeo; cada personagem com uma "atitude" fixa.
- Legenda de **1 palavra**, branca com contorno, palavra forte em **amarelo**, "pulando" (50→112→100% em 0,17 s).
- Adesivos cômicos (DING!, "3 DIAS PRO NATAL", "!") um por vez, nunca em cima do rosto.
- Detalhes plantados no começo que voltam no fim. Pergunta final pra comentário.
- Cor: L médio 47 a 52, preto ≤ 10 a 12% (medir com `motor/qa/cor.py`). Sem desfoque de fundo.
- Som: −14 LUFS, pico ≤ −2 dB, música 8 a 12 dB abaixo da voz, efeitos centralizados (mono nos dois lados).

## 4. O motor (`canal-roblox-nhacudo/motor/`)
three.js r160 renderizado sem tela por Playwright (SwiftShader). Cada episódio é **uma página** `epN.html` com `window.renderAt(t)` determinístico.
- `kit.js`: personagens R6 (`r15()`, `randomNPC(scene,seed)`, preset `NHACUDO`, cabelos, capuz de tubarão).
- `r6anim.js`: poses procedurais `R6.pose(c, pose, t)` → idle, walk, run, talk, point, cheer, shock, sit, lay, jump, fall, climb, crouch, sneak, aim; `R6.stepWalker(c, path, t, {t0,d0,gait,y,loop})` pra andar num caminho.
- `retarget.js`: `loadMocap('ual.glb')` (Quaternius, CC0). Clipes usados: `Sitting_Idle_Loop`, `Sitting_Talking_Loop`, `Hit_Head`, `Interact`…
- `faces2.js`: rostos (smile, grin, happy, joy, laugh, neutral, talk, talk2, shock, scared, terrified, angry, shout, sad, cry, determined, smug, smirk, nervous, confused, sleep, wow, relief, evil, bored, wink, brace). Detalhes de rosto (bigode etc.) vão **desenhados na textura** via `c.faceExtra`, nunca como bloco 3D na frente da boca.
- `assets.js` + `kits/`: prédios, casas, natureza e móveis Kenney (`A.place(grupo,'suburban','building-type-a',x,y,z,rot)`).
- `city.js`, `sets.js` (subúrbio, sala, escola…), `sets2.js` (lava, ônibus, casinha de cachorro…), `sets3.js` (EP03: contador, trenó, renas, sala, beco), `crowd.js` (caminhos), `world.js`.
- `qa.js`: verificador ligado dentro da página.

**Formato de um plano** (ver `ep3.html`, a referência mais completa):
```js
['nomeDoPlano', W('palavraDaNarracao'), 'SU', (k,t,lt)=>{   // k=0..1 no plano, t=tempo global, lt=tempo no plano
  env('day'); aimSun(x,z); showStreet();
  put(hero, x, z, rotY, 'idle', t, 'sad', y);              // pose + rosto + respiração automática (alive)
  mo(granny, x, z, rotY, 'Sitting_Idle_Loop', t, 'happy', y); // captura de movimento
  walk(t);                                                  // figurantes nas faixas da calçada
  sticker('DING!', x, y, kk); tag('texto', cor, y, kk);
  return {cp:V(...), ct:V(...), f:50, subj:hero, face:true}; // câmera, alvo, lente; subj/face alimentam o verificador
}],
```
`W('palavra', n)` = início da n-ésima ocorrência da palavra na narração (de `epNwords.js`). `pc(x,y,z,{yaw,dist,h,fov,lt,push})` = câmera de jogador.

## 5. Passo a passo de um episódio
1. **Tema**: 3 opções com gancho "Nessa cidade…", recomendar uma (regra absurda + perigo no 1º segundo + herói excluído + virada + pergunta final).
2. **Roteiro** em `episodios/epNN-nome/roteiro-para-aprovar.md` + `narracao-para-elevenlabs.txt` → mandar em arquivo e **esperar aprovação**.
3. Recebo o MP3 → `python3 motor/ferramentas/narracao.py narr_raw.mp3 narracao.txt PASTA 1.25` (corta pausas, acelera, Whisper + alinhamento ao roteiro) → `--js words.json epNwords.js`. Revisar quais palavras ficam amarelas.
4. **Cenas**: copiar `ep3.html` como base → cenários novos num `setsN.js` → 1 plano por frase.
5. **Quadros de revisão**: `node ferramentas/shots.js URL` (lista os planos) → `node ferramentas/multi2.js URL prefixo "t1,t2,…"` (1 quadro no meio de cada plano) → `python3 ferramentas/mont.py saida.jpg quadros…` → **olhar todos**: enquadramento, rosto, luz, adesivos, cabeça cortada, nada tampando.
6. **Verificador**: `node qa/runqa.js URL 0.1` até **"TOTAL shots with problems: 0"** (pra testar só alguns planos: `ALL=1 node qa/runqa.js URL 0.1 plano1,plano2`). Todo objeto que se move entra no verificador.
7. **Determinismo**: `node ferramentas/determ3.js` (trocar o ep) → tudo **IDENTICO**.
8. **Cor**: `python3 qa/cor.py quadros*.jpg`.
9. **Render**: 4 processos `node ferramentas/render_ep3.js pasta inicio fim` (trocar o ep; 30 fps, 1080x1920; ~45 min por 2 min de vídeo).
10. **Áudio**: `ferramentas/mix_modelo.py` (voz + música com ducking + efeitos de `/home/user/stickman/kit/sfx` ou equivalentes, loudnorm −14 LUFS, TP −2).
11. **Montagem**: ffmpeg (crf 17) + versão celular (720x1280, crf 26) → `freezedetect` (nenhum trecho parado ≥ 0,5 s) → `ebur128`.
12. **Thumbnail** (render a 1,5x + texto Inter Black com contorno; nunca tampar o rosto do Nhacudo), **legendas.srt**, **titulo-e-descricao.md**, upload gofile (`GET api.gofile.io/servers` → `POST https://SERVIDOR.gofile.io/contents/uploadfile`; 2º arquivo com `folderId` + `Authorization: Bearer guestToken`).
13. Copiar código pro repositório (`motor/`), entregáveis pra `episodios/epNN-nome/`, **commit e push**.

## 6. Armadilhas já resolvidas (não repetir)
- `Math.random` sem semente ou luz/sol que um plano não define → quadros diferentes entre processos. Todo plano sem `aimSun` mira o sol no alvo da câmera; tudo que um plano muda é resetado em `hideAll()`.
- `S.updateMatrixWorld(true)` antes de medir caixas no plano; `cam.updateMatrixWorld()` antes de checar a câmera no verificador.
- Calçada tem que ser maior que o caminho dos figurantes; objetos da calçada fora das faixas de caminhada.
- Altura do chão sempre por raycast (`surfY`), nunca chutada (degraus, calçada de 0,32 m, telhados).
- Câmera de rosto a 4–5 m (colada demais corta a cabeça e, dentro de sala, pode sair da parede e mostrar o fundo).
- Luz forte perto do rosto + bloom = rosto lavado; em finais de noite: exposição ~0,8, bloom ~0,2.
- Plano com câmera parada vira "quadro congelado": sempre um leve avanço.
- Barba/bigode/óculos: nunca bloco 3D na frente da boca; barba no queixo, bigode desenhado no rosto.

## 7. Onde parou
- EP01 a EP03 entregues (EP02 ~2 mil views, 20 inscritos; meta 10 a 50 mil por vídeo).
- **EP04 — "A cidade muda" (terror)**: roteiro em `episodios/ep04-cidade-muda/`, **esperando minha aprovação**. Monstro original "O Calado" (alto, sem rosto, aparece só em pedaços), sinal = poste pisca 3 vezes, virada = ele usa as vozes roubadas (a voz da mãe na porta). Música sugerida: trilha de terror composta em código.

Comece me dizendo em 3 linhas o que entendeu e qual é o próximo passo.
=====
