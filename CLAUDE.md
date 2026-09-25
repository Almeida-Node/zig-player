# Laboratório da Zig — notas para o Claude

- Jogo web (Vite + TypeScript, sem framework) para crianças de 6 a 9 anos, ligado à série Professora Zig.
- **Nunca desenhe ou imite a Zig em código.** Toda arte, movimento e voz dela vem de arquivos oficiais
  listados em `src/content/assets.ts` (prompts em `docs/prompts-artes-jogo.md`). O código só anima a
  "camada da descoberta" em ciano `#22D3EE`.
- Textos na tela: MAIÚSCULAS com acentos, nada de letras ou números dentro de telas, mapas ou cenários.
- Sem derrota, sem cronômetro, sem ranking, sem anúncios, sem coleta de dados, sem chamar a criança para redes sociais.
- Materiais da série: pasta PROFESSORA-ZIG no Google Drive (README.md, CONTEXTO-ZIG.md, guias dos episódios).
- Antes de commitar: `npm run typecheck && npm test && npm run build`.
