# Lições da skill roblox-in-this-town (dados medidos, nov/2026)

Comparação de virais (0,2 a 5,6 mi de likes) com vídeos fracos do mesmo nicho (2 a 40 mil likes).

## Onde o nosso EP02 erra, segundo os dados
| Regra medida nos virais | EP02 | Muda no EP03 |
|---|---|---|
| **Poucos lugares, revisitados**: 49 a 83% dos cortes ficam no mesmo lugar | 5 lugares, pulando entre eles | 2 a 3 lugares (rua natalina, loja Apaga-Mentira, casa do Nhacudo), sempre voltando a eles |
| **Câmera de jogador**: lente aberta (55 a 70°), acima da cabeça, olhando pra baixo, com o lugar e as pessoas na imagem; câmera se movendo 82 a 96% do tempo | muito close, gente sozinha no quadro | câmera passeia pelo lugar como um drone, indo de "estação" em estação |
| **Close só em 10 a 15% do tempo** (punchline, susto, virada) | ~40% close | no máximo 15% |
| **2 ou mais pessoas no quadro em 40 a 60%** | ~25% | cada lugar com o pessoal dele fazendo a sua atividade (fila, balcão, gente decorando) |
| **Gancho**: personagem grande e legível até 1,5 s, com a regra visível nele (11 de 12 virais) | começou com vista aérea (é o que fazem os vídeos fracos) | 1º quadro: o Nhacudo de perto com o contador "1" brilhando acima da cabeça, depois a câmera se afasta |
| **Sem desfoque de profundidade** ("parece amador") | usamos desfoque | remover |
| **Rosto de susto no máximo 2x por vídeo**; o resto calmo, cada um com uma "atitude" | muito susto e pavor | rosto padrão por personagem (padeiro convencido, professora entediada, avó doce) |
| **Reação 6 a 8 quadros depois do evento**, primeiro a cabeça e depois o corpo | instantâneo | atraso + cabeça primeiro |
| **Pose a pose**: antecipação de 4 a 8 quadros, exagero de 10 a 20%, acomodar e "pausa viva" (nunca congelado) | poses fixas | aplicar |
| **Figurantes fazendo atividade** (comendo, varrendo, no celular), nunca parados à toa | maioria andando ou parada | loops de atividade |
| **Adesivos cômicos**: "???", "ZZZ", "!", relógio, "3 DIAS DEPOIS", linhas de velocidade | poucos | 1 por vez, 0,5 a 2 s, nunca sobre o rosto |
| **Legenda**: 1 a 3 palavras em negrito no terço de baixo, palavra forte em amarelo (estilo atual dos virais) | 1 palavra grande no meio (estilo "soft render", também válido) | testar o estilo do terço de baixo |
| **Detalhes plantados no começo que voltam no fim** | nenhum | EP03: a meia de lã da avó e a placa "100% honesta" voltam no final |
| Música 8 a 12 dB abaixo da voz, -14 a -16 LUFS | ✓ | manter |
| Narração com 3,5 a 4,7 palavras/s | ✓ (~3,75) | manter |

## Animações de captura de movimento "em momentos específicos" (a skill confirma)
- Base: andar R6 do Roblox. Animações grandes (dançar, cair, comemorar) **entram exatamente no corte**, e uma caminhada termina antes da próxima virada.
- "Não use loops padrão pra tudo; personagens deslizando e figurantes dançando ao fundo = amador."

## Opção de salto de qualidade: Roblox Studio de verdade
A skill foi feita para o Claude controlar o **Roblox Studio** (MCP oficial do Roblox) e renderizar dentro do Roblox. Isso dá o visual 100% Roblox, com kits da Creator Store e animações oficiais do R6.
- Precisa: um PC Windows ou Mac com Roblox Studio + o MCP do Studio conectado ao Claude (no próprio computador, via Claude Code / Remote Control).
- Aqui na nuvem não roda. Se você tiver esse PC, dá pra migrar o pipeline.
