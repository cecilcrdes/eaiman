# Guia de medidas do jogo

Checkpoint do código: `checkpoint-mercado-2026-11-01` (commit `21108fe`).
Dimensões de imagens são largura × altura em pixels; medidas de fase e colisão são unidades lógicas do jogo.

## Escala e fases

- Tela lógica: **480 × 270**; canvas renderizado em **960 × 540** (2×).
- Personagem padrão: colisão **14 × 27**; altura visual de referência **29** unidades.
- As três fases fora do Mercado medem **2400 × 270** e têm 14 plataformas: chão em (0,224) com 760×70; (824,224) com 640×70; (1536,224) com 864×70. As 11 plataformas elevadas, todas com altura 12:

| x | y | largura |
|---:|---:|---:|
|185|185|75|
|340|174|130|
|560|169|90|
|720|177|120|
|920|178|100|
|1040|135|100|
|1200|178|100|
|1410|174|170|
|1665|178|100|
|1795|139|90|
|1940|179|80|

## Fase 1 — Mercado

| Trecho | Mundo | Plataformas |
|---|---:|---|
|Rua da Feirinha|4600 × 270|chão (0,190) de 4600×80 + plataformas posicionadas nos telhados e marquises do panorama|
|Esgoto secreto|480 × 620|chão (0,570) de 480×70 + 10 plataformas de 130×10; x alterna entre 80/250, y vai de 525 a 120 em passos de 45|
|Trecho do carrinho|1950 × 270|percurso próprio; obstáculos são entidades, não plataformas elevadas|
|Encontro com Teca|480 × 270|arena plana|
|Depósito / Neymar|480 × 270|arena de estruturas do cenário|
|Descarga|480 × 270|arena de caminhões e caixas|
|Garagem / Seu Maneco|480 × 270|arena plana|

### Plataformas da rua

As casas e o chão usam os panoramas `cenario_fase1_casas.png` e `cenario_fase1_chao.png`, ambos com **4600 × 264 px**. O chão visível começa em y=190 e coincide com o chão de colisão. As **64** plataformas elevadas acompanham telhados, marquises, escadas e bancas; suas posições estão na constante `STREET_LEDGES` em `src/market.js`. Itens da rua são posicionados na superfície mais baixa sob seu x, e o badoque fica na torre amarela perto de x=1036. `packcasas_fase1.png` é somente referência e não é desenhado no jogo. O Sacolão já faz parte do panorama das casas.

## Tamanhos de exibição dos sprites

Valores em unidades lógicas do jogo; a caixa de colisão pode ser diferente.

| Sprite / objeto | Exibição |
|---|---:|
|Saco de lixo|26 × 32|
|Estilingue|28 × 30|
|Carrinho de compras|48 × 40|
|Caminhão de frente|48 × 88|
|Caminhão lateral|90 × 38|
|Produto vencido|12 × 15|
|Teca|32 × 40|
|Neymar|28 × 40|
|Bandeira vermelha|36 × 46|
|Rival de rua|16 × 26|
|Chefe genérico|27 × 44|
|Luketa, Tuca, Lea e Jana|referência visual 29 de altura; colisão 14 × 27|

Folhas de animação são atlas; o tamanho da folha não é o tamanho de cada quadro. Os recortes estão em `assets/jogo/animacoes.js` (personagens) e `src/market-art.js` (arte do Mercado). Ao redesenhar folhas, mantenha a grade e os recortes ou atualize-os no código.

## Inventário de PNGs

Dimensões originais dos PNGs presentes na pasta `assets` neste checkpoint. Referências e imagens de montagem estão identificadas; nem todo arquivo é exibido durante o jogo.

### Cenários do jogo — `assets/jogo/cenarios`

- `alley-ceu.png`, `field-ceu.png`, `market-ceu.png`, `rooftop-ceu.png`, `school-ceu.png`: **960 × 540** cada.
- Correspondentes `*-rua.png`: **4800 × 540** cada.

### Folhas de inimigos — `assets/jogo/inimigos`

- **1536 × 1024:** `alley-boss-sheet.png`, `alley-rival-sheet.png`, `field-boss-sheet.png`, `field-rival-sheet.png`, `rooftop-boss-sheet.png`, `rooftop-rival-sheet.png`, `school-boss-sheet.png`, `school-rival-sheet.png`, `market-rival-sheet.png`.
- **640 × 96:** `alley-chefe.png`, `alley-rival.png`, `field-chefe.png`, `field-rival.png`, `market-chefe.png`, `market-rival.png`, `rooftop-chefe.png`, `rooftop-rival.png`, `school-chefe.png`, `school-rival.png`.

### Interface — `assets/jogo/interface`

- **1671 × 941:** `casa-da-vo.png`, `ferro-velho.png`.
- **1672 × 941:** `creditos.png`.
- **2172 × 724:** `logo-principal.png`.
- **1333 × 1180:** `mapa-favela.png`.
- **1448 × 1086:** `mapa-fundo.png`.

### Mercado — `assets/jogo/mercado`

- **3900 × 540:** `cart-bg.png`.
- **960 × 1240:** `sewer-bg.png`.
- **960 × 540:** `garage-bg.png`, `garage-yard-bg.png`, `mariana-bg.png`, `unloading-bg.png`, `warehouse-bg.png`.
- **96 × 80:** `cart.png`.
- **24 × 30:** `expired.png`.
- **64 × 80:** `mariana.png`.
- **56 × 80:** `neymar.png`.
- **72 × 92:** `red-banner.png`.
- **56 × 60:** `slingshot.png`.
- **52 × 64:** `trash.png`.
- **180 × 76:** `truck-side.png`.
- **96 × 176:** `truck.png`.

### Objetos comuns — `assets/jogo/objetos`

- **32 × 56:** `bandeira-alley.png`, `bandeira-field.png`, `bandeira-market.png`, `bandeira-rooftop.png`, `bandeira-school.png`.
- **64 × 64:** `caixa.png`; **48 × 140:** `chao.png`; **16 × 16:** `fruta.png`, `sonho.png`; **48 × 48:** `juca.png`; **16 × 24:** `latinha.png`; **40 × 24:** `plataforma.png`; **18 × 32:** `suco.png`.

### Folhas e fontes de arte — `assets/personagens`

- **2158 × 729:** `assets cenario fase1.png`.
- **1536 × 1024:** `assets cenario2 fase1.png`, `assets cenario3 fase1.png`, `assets fase 2.png`.
- **1536 × 1300:** `assets cenario2-1 fase1.png`.
- **1672 × 941:** `assets_chao.png`, `assetsparallax.png`, `assetspostes.png`, `Corredor Escolar em Pixel Art.png`.
- **1024 × 1536:** `Mulher em vestido vermelho pixel art.png`.
- **6000 × 1080:** `packcasas_fase1.png` (referência, não usar como cena).
- **1536 × 1024 cada:** `Atlas de Sprites Pixelados de Frutas.png`; `caixas e sacos de lixo animaçaohorizontal.png`; `caixas e sacos de lixo animaçaovertical.png`; `Folha de sprites do luketa.png`; `Folha de Sprites do Lutador Verde.png`; `Folha de Sprites inimigo fase 1.png`; `Folha de Sprites inimigo fase3.png`; `Folha de sprites inimigo2 fase1.png`; `Folha de Sprites Pixel Art do Garoto Aventureiro.png`; `Folha de Sprites Pixel Art do Garoto Futurista.png`; `Folha de sprites tuca.png`; `Sprite Sheet da lea.png`; `Sprite Sheet de Neymar e Caixas fase1.png`; `Sprite Sheet do Lutador Loiro.png`; `Sprite teca fase1.png`; `Sprite vo lela.png`; `sprites inimigo fase4.png`; `Spritesheet inimigo fase2.png`.

### Referências, conceitos e telas — demais arquivos em `assets`

- **512 × 400 cada:** `assets/jogo/personagens/jana.png`, `lea.png`, `luketa.png`, `tuca.png`.
- **1672 × 941:** `assets/logos/Logo de Pedra EAÍMAN com Chamas.png`; `assets/telas-referencia/Favela Pixelada sob o Sol.png`; `tela creditos.png`.
- **2172 × 724:** `assets/logos/Logo pixelado EAIMAN com vela central.png`; `assets/EAÍMAN na Favela Pixelada.png`; `assets/telas-referencia/Botões de Menu em Grafite Pixelado.png`; `Botões de Pedra Pixel Art_ Iniciar, Créditos e Sair.png`.
- **1671 × 941:** `assets/telas-referencia/Cozinha pixel art aconchegante.png`.
- **1333 × 1180:** `assets/telas-referencia/mapa da Favela.png`; **1448 × 1086:** `tela mapa fundo.png`.
- **1315 × 1197:** `Botão Play Pixelado Laranja.png`.
- **246 × 319:** `assets/cenarios-referencia/imagem-005.png`; **410 × 285:** `imagem-006.png`; **1641 × 1169:** `mapa_eaiman.png`; **425 × 193:** `assets/conceitos/conceito4.png`.
- **413 × 498:** `assets/telas-referencia/imagem-007.png`.
- **425 × 239:** `imagem-009.png`, `imagem-010.png`, `imagem-012.png`; **425 × 240:** `imagem-011.png`.

PSD não está incluído no inventário PNG e não foi alterado para este levantamento. A dimensão de uma folha descreve o arquivo inteiro; consulte os recortes no código para os tamanhos dos quadros individuais.
