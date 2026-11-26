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

---
# Lições do blocky-shorts (documento do Google + skill grátis, MIT)
Motor parecido com o nosso (three.js), com regras medidas em 58 shorts de 13 canais.

## Medição de cor (minha ferramenta `ferramentas/qa/cor.py`)
| Vídeo | L médio | % quase preto | croma |
|---|---|---|---|
| Nosso EP02 | 38 | **29%** | 28 |
| Nosso EP01 | 45 | 26% | 22 |
| Virais (4 medidos) | 42-62 | **2-14%** | 15-31 |
| Alvo da skill | 47-52 | 4-10% | 26-32 |
**Nosso maior erro visual mensurável: escuro demais (preto esmagado).** EP03: levantar as sombras, sem fundo preto puro, menos vinheta. Meta ≤ 10% de preto.

## O que adotar no nosso motor
- **`alive()` em todo mundo:** respiração, balanço lento, cabeça à deriva, braços que nunca congelam. Ninguém fica parado.
- **`pop()` em movimento grande (≥ 0,7 s):** antecipação de -14% e depois exagero, e acomoda.
- **Andar:** pernas ±28-30°, ~2,3 passos/s, braço oposto balançando, corpo desce 2 cm a cada passo, sola levemente afundada na grama com uma sombra de contato.
- **Luz premium por plano:** luz principal da frente-esquerda, preenchimento da frente-direita em cor complementar e **contorno forte por trás** (intensidade 4,5-5,5). Brilho só no que emite luz (limiar 0,7-0,8). Vinheta 0,2-0,5. Um clima por cena.
- **Sombra falsa** em cantos e sob móveis + manchas de contato sob todo personagem e objeto.
- **Borrão de movimento:** 4 sub-quadros por quadro (obturador de 126°; 72° em quedas).
- **Câmera:** sempre um avanço lento de 8-11% da distância por segundo; menos de 6% de quadros parados; leve giro de 1-2°.
- **Legendas que "pulam":** 50% → 112% → 100% em 0,17 s, brancas com contorno fino, margem de 12%, no máximo 2 linhas.
- **Novas checagens no verificador:**
  - **BLOCKED:** nada entre a câmera e o personagem.
  - **FACING:** em plano de rosto, o rosto virado pra câmera.
  - Personagem cortado na borda.
  - Poste "saindo" da cabeça.
  - Corpo em primeiro plano ocupando no máximo 30% da largura.
  - Três quadros quase iguais seguidos dentro de um plano.
- **Apontar ou acenar com o braço longe da câmera**, pro braço não tampar o rosto.
- **Universo de regras:** "cada regra é sobre algo que todo mundo tem, tem efeito visível e põe um amigo em risco".

## Duas escolas medidas (escolher uma por vídeo)
- **Estilo Roblox Studio** (roblox-in-this-town): câmera de jogador, poucos closes (10-15%), muita gente no quadro, câmera viajando.
- **Estilo blocky "soft render"** (blocky-shorts): corte a cada 1,25-1,5 s, ~50% closes de rosto, avanço constante.
Nosso motor é mais próximo do 2º. Recomendo um meio-termo: corte a cada ~1,5 s, closes só nos momentos-chave, sempre com gente e cenário no quadro.
