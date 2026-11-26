# Canal Roblox do Nhacudo — "Nessa cidade…"

Shorts verticais (9:16, 1:45 a 2:00) em estilo Roblox R6, feitos 100% em código com three.js.
Mascote: **Nhacudo** (moletom de tubarão azul).

> ⚠️ Este é o canal **Roblox**. O canal de **stickman** ("E se…") é outro projeto, em outro repositório (`stickman`), com outro kit (p5.js). Não misture os dois.

## Pastas
| Pasta | O que tem |
|---|---|
| `PROMPT-PARA-CONTINUAR.md` | Prompt pra colar numa sessão nova do Claude e continuar sem perder nada |
| `CLAUDE.md` | Instruções que o Claude lê sozinho ao trabalhar nesta pasta |
| `REGRAS-E-PADROES.md` | Pedidos do dono, padrões visuais e checklist antes do render |
| `analise/` | Pesquisa de virais, lições medidas, temas em alta, plano de crescimento |
| `episodios/epNN-nome/` | Roteiro, narração, legendas, título/descrição, thumbnail, vídeo leve (celular) |
| `motor/` | O motor de animação (three.js) + cenas de cada episódio (`epN.html`) |
| `motor/qa/` | Verificador de bugs (gente atravessando, flutuando, câmera em parede, cabeça cortada…) e medidor de cor |
| `motor/ferramentas/` | Render, quadros de teste, montagem, determinismo, mixagem de áudio |
| `motor/kits/` | Modelos 3D Kenney (CC0) em zip — `setup.sh` descompacta |
| `motor/testes/` | Páginas de teste (rostos, elenco, captura de movimento) |

## Começar numa máquina nova
```bash
cd canal-roblox-nhacudo/motor
./setup.sh                                   # instala three.js, descompacta kits, copia fontes
npx -y http-server -p 8767 -s -c-1 . &       # servidor local
node ferramentas/multi2.js "http://localhost:8767/ep3.html" quadro "45.8"   # quadro de teste
```
Precisa de Node 22 e Playwright + Chromium (já vêm no ambiente do Claude Code na nuvem).

## Episódios
| Ep | Tema | Status |
|---|---|---|
| 01 | Lanterna | publicado |
| 02 | Chão de lava | publicado (~2 mil views) |
| 03 | Papai Noel e o contador de mentiras | pronto (link no `LEIA-ME.txt`) |
| 04 | A cidade muda (terror) | roteiro esperando aprovação |

## Licenças dos recursos
- Modelos: Kenney (CC0). Animações: Quaternius Universal Animation Library (`ual.glb`, CC0).
- Fontes das legendas: Inter (OFL).
- Personagens, rostos e cenários: originais, feitos em código.
- Músicas "Numbers" e "Fallen Down": de terceiros, escolha do dono (podem gerar Content ID). Os arquivos não ficam no repositório.
