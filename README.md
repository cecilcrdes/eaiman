# E Aí Man! — Os Canários

Jogo de plataforma em HTML5, CSS e JavaScript, sem instalação de bibliotecas. As imagens originais foram preservadas e organizadas na pasta `assets/`. Consulte `assets/LEIA-ME.md` para editar retratos, referências e os PNGs usados na partida.

## Jogar

Abra **cecilcrdes.github.io/eaiman.** no navegador. Para um endereço local estável, execute `npm start` nesta pasta e abra http://127.0.0.1:4173. Não é necessária conexão com a internet.

## Controles

- A/D ou setas: andar.
- Espaço, W ou seta para cima: pular.
- Mouse: mirar e clicar para disparar o badogue (liberado ao concluir o Mercado).
- X ou J: lançar; com badogue, usar mira assistida quando o mouse está fora do cenário.
- E: entrar no esgoto, voltar à rua e atravessar as portas.
- No carrinho: W/S ou setas para cima/baixo mudam o corredor; A/D freiam/aceleram.
- Na descarga: WASD ou setas movem nas quatro direções.
- Z, K ou Shift: deslizar.
- Esc ou P: pausar.
- Celulares/tablets: controles de toque na tela.



## Campanha

1. O Mercado — Seu Maneco; libera Tuca, que corre mais rápido.
2. Beco das Valeskas — Juju Chiclete; libera Jana, que tem pulo duplo.
3. O Campinho — Talinho; libera Lea, que pula mais alto.
4. A Escola — Chumbinho.
5. Topo do Morro — Vadinho; encerra a história.



## Organização

- `index.html` e `styles.css`: interface responsiva e telas.
- `src/engine.js`: física, combate, colisões, personagens e fases.
- `assets/jogo/`: cenários, objetos, rivais e interface editáveis.
- `assets/personagens/`: folhas originais novas de Luketa, Tuca e Lea.
- `assets/jogo/animacoes.js`: recortes e alinhamento das folhas novas.
- `assets/jogo/config.js`: caminhos dos PNG/WebP e suavização para arte artesanal.
- `src/assets.js`: carregamento das imagens.
- `src/art.js`: composição das imagens e desenhos de reserva.
- `src/market.js`: regras e checkpoints das áreas do Mercado.
- `src/market-art.js`: composição dos novos cenários e objetos.
- `docs/mercado.md`: sequência, decisões de adaptação e referências dos vídeos.
- `src/game.js`: menus, entrada, áudio sintetizado e persistência.
- `server.cjs`: servidor local opcional, limitado a 127.0.0.1.
- `tests/engine.test.cjs` e `tests/market.test.cjs`: 24 testes de mecânicas (`npm test`).
- `tests/browser.cjs`, `tests/market-browser.cjs` e `tests/assets-browser.cjs`: verificações opcionais de interface, exigem Playwright e Chrome.

O projeto é uma adaptação jogável do material fornecido, e não uma reprodução integral de todas as mecânicas do GDD. A ordem dos resgates e os talentos foram definidos para atender à seleção dos quatro personagens. Escalada de paredes, caixas empurráveis, fabricação por receitas e fases com layouts finais de produção não fazem parte desta versão. O Mercado usa áreas e encontros próprios. As quatro fases seguintes ainda compartilham a base de plataformas da primeira versão. A descarga tem uma primeira implementação de caminhões e caixas deslizantes, aberta a refinamento conforme o briefing.

## Créditos

Conceito/GDD: Cecília Rodrigues, Geisa França e Tiana Duarte. Personagens e referências: acervo original E Aí Man fornecido na pasta. Retratos e arte da equipe aparecem na história, resgates e créditos. Os novos sprites de Luketa, Tuca e Lea, os botões, o logo e o fundo inicial usam o acervo fornecido. Os demais cenários e sprites permanecem como bases em PNG editável, sem dependências externas. Consulte `assets/LEIA-ME.md` para substituir a arte por desenhos artesanais.

Na batalha de Maneco, use as quatro setas (ou WASD) para circular pelo pátio. Os caminhões cruzam horizontalmente pelas laterais, com aviso de buzina na faixa antes de passar. Maneco e os sacos de lixo ficam junto à garagem, ao fundo; mire com o mouse para atacar.
