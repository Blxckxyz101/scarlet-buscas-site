# Curso "E se..." — site de vendas + área do aluno

Site estático (HTML/CSS/JS, sem build) com Supabase para login, banco e a função de Pix.

| Página | O que faz |
|---|---|
| `index.html` | página de vendas, com a cena animada em canvas (`js/hero.js`) |
| `entrar.html` | criar conta / entrar (e-mail e senha), esqueci a senha |
| `senha.html` | definir nova senha pelo link do e-mail |
| `comprar.html` | gera o Pix, mostra QR + copia e cola, confere sozinho a cada 5 s |
| `aluno.html` | progresso e lista de aulas |
| `aula.html?id=...` | aula em Markdown, vídeo opcional, marcar como concluída |

## Como o pagamento libera o acesso

1. `comprar.html` chama a Edge Function `pix` (`supabase/functions/pix`) com `action: "create"`.
2. A função chama `GET /create_payment` no promstgateway (o `user_id` do gateway fica no servidor) e grava o pedido em `orders`.
3. A página chama `action: "status"` a cada 5 s; a função consulta `GET /verify_payment` e, se vier `CONCLUIDA` com valor ≥ preço, cria a linha em `enrollments`.
4. O conteúdo das aulas (`lesson_content`) só é lido por quem tem matrícula (RLS). Aulas com `is_preview = true` são abertas.

Preço: `COURSE_PRICE` (padrão 47.00) nas secrets da função, e `js/config.js` para o texto.

## Editar aulas

As aulas estão no Supabase, tabela `lesson_content` (coluna `body_md`, Markdown) e `lessons` (título, ordem, duração, prévia).
Para gravar vídeo numa aula, preencha `video_url` com um link do YouTube (não listado) ou Vimeo.

Os arquivos `conteudo/*.md` das aulas pagas **não** vão para o Git porque o repositório é público.
Com os arquivos locais: `node scripts/build-seed.mjs` gera `supabase/seed.sql`, que pode ser colado no SQL Editor.

## Rodar local

```bash
cd curso && python3 -m http.server 5055
```
