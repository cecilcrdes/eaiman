# Arte editável em PNG e WebP

A pasta **jogo/** guarda cenários, rivais, chefes e objetos. As novas folhas de Luketa, Tuca e Lea são carregadas diretamente da pasta **personagens/**. Edite as imagens no seu editor, salve no mesmo caminho e recarregue com Ctrl+F5.

Os PNGs são a exportação da arte pixelada anterior, como base para edição. Ainda não são novas ilustrações artesanais. Preserve o tamanho, o alinhamento e a transparência.

## Folhas novas de Luketa, Tuca e Lea

Os personagens usam as folhas originais em **personagens/**: `Folha de sprites do luketa.png`, `Folha de sprites tuca.png` (Tuca), `Sprite Sheet da lea.png` e `Sprite teca fase1.png` (Teca, chefe da banca). Tuca continua sendo a personagem jogável resgatada; Teca é uma chefe e não aparece na seleção. Os originais não foram alterados. Os recortes e pontos de apoio ficam em **jogo/animacoes.js**; o mapa de recortes editável está em **tools/map-character-atlases.py**.

Para retocar a arte, preserve o posicionamento dos quadros. Se mudar o layout, ajuste os recortes em `tools/map-character-atlases.py` e gere novamente `animacoes.js`. Não é necessário gerar uma nova imagem: o jogo lê a folha original.

Jana continua usando a folha anterior, até receber uma nova. Os antigos PNGs de Luketa, Tuca e Lea em **jogo/personagens/** foram preservados, mas não são mais selecionados pela configuração.

## Folhas anteriores / Jana

Em **jogo/personagens/**, cada folha tem **512 × 400 px**, com **8 colunas e 5 linhas**. Cada quadro ocupa **64 × 80 px**.

Linhas, de cima para baixo:
1. Parado.
2. Correndo.
3. Lançando.
4. Deslizando.
5. Pulando.

Desenhe voltado para a direita; o jogo espelha a imagem para a esquerda. O centro horizontal do corpo fica em x=32 e o topo em y=10, dentro de cada quadro. Os pés em repouso ficam perto de y=68. A colisão ocupa 28 × 54 px a partir de x=18, y=10; alterar a imagem não altera essa área. Repouso e pulo começam com quadros repetidos, prontos para redesenhar.

## Inimigos e chefes

Em **jogo/inimigos/**, as folhas `*-rival-sheet.png` e `*-boss-sheet.png` foram copiadas das referências originais para facilitar a edição. Cada folha detalhada tem **1536 × 1024 px**, organizada em **16 colunas × 4 linhas** (quadros de 96 × 256 px); o jogo usa a segunda linha para animar a corrida. Maneco usa `market-chefe.png`, a folha menor de **640 × 96 px**, organizada em 8 quadros horizontais. As folhas antigas também foram preservadas. Substitua os arquivos mantendo o nome, as dimensões e a grade para atualizar os inimigos no jogo.

Os vínculos seguem as cores das equipes descritas no GDD: vermelho no Mercado, rosa no Beco, azul no Campinho, verde na Escola e roxo no Topo do Morro. Algumas folhas de origem são duplicatas exatas, e não há artes identificadas por nome para Juju, Talinho, Chumbinho ou Vadinho; os chefes dessas fases usam sprites da equipe correspondente. Maneco ainda usa o sprite de reserva do projeto, pois não foi encontrada uma folha exclusiva dele. O Topo usa a folha roxa disponível como base; o acervo não tem uma folha marcada especificamente como fase 5.

## Cenários

Em **jogo/cenarios/** há duas camadas por fase:

- `*-ceu.png`: **960 × 540 px**. Fundo distante, fixo na tela.
- `*-rua.png`: **4800 × 540 px**, com transparência. Fachadas e decoração que acompanham a câmera. A superfície do chão fica em y=448.

Nomes: market = Mercado; alley = Beco; field = Campinho; school = Escola; rooftop = Topo do Morro.

A primeira fase usa uma rua de 4.600 unidades de largura, quase dez telas até o Sacolão. O esgoto, as lajes, as bandeiras e as fachadas são distribuídos ao longo dela. As pranchas `assets cenario fase1.png`, `assets cenario2-1 fase1.png` e `assets cenario3 fase1.png` são usadas como cenários sobrepostos. As casas de `cenario2-1` formam as plataformas visíveis; suas colisões correspondentes ficam em `src/market.js`. Edite o PNG/PSD original ou ajuste os recortes em `src/market-art.js`.

As camadas exportadas são estáticas: o fundo distante não tem o movimento de profundidade da versão anterior. Plataformas e objetos continuam separados, sobre essas imagens. Pintar uma plataforma no cenário não cria colisão; a geometria permanece em `src/engine.js`, função `createLevel()`.

## Objetos

Em **jogo/objetos/** estão latinha, suco, bandeiras, Juca, projéteis, caixa, chão e plataforma. Preserve o tamanho de cada arquivo. Chão e plataforma são repetidos horizontalmente; cuide da continuidade das bordas. Caixas são ajustadas ao tamanho do obstáculo.

## WebP e traços artesanais

PNG foi escolhido para edição, transparência e ausência de perdas. WebP também funciona: exporte de preferência sem perdas e altere o caminho em **jogo/config.js**, por exemplo `personagens/luketa.webp`. Trocar somente a extensão não converte o arquivo.

Nesse arquivo, mude **smooth: false** para **smooth: true** para ativar suavização e maior resolução interna, adequada a traços desenhados à mão. A física não muda. As imagens podem ser ampliadas proporcionalmente, preservando a quantidade de linhas, colunas e o alinhamento.

Se uma imagem falhar, o jogo usa o desenho por código como reserva. O console do navegador indica o arquivo ausente.

## Referências originais

- **personagens/**: retratos usados na história, resgates e créditos, nos formatos originais.
- **sprites-referencia/**: animações originais de referência.
- **cenarios-referencia/**: conceitos dos cenários e mapa.
- **telas-referencia/**: telas originais e fluxo de navegação.
- **logos/**: logo original.
- **conceitos/**: estudos do gato.

O GDD continua na raiz do projeto. As referências originais foram preservadas.

## Novas áreas do Mercado

A pasta **jogo/mercado/** contém PNGs editáveis, com caminhos configuráveis na seção `market` de **jogo/config.js**. Os fundos incluem esgoto (960 × 1240 px), corredor do carrinho (3900 × 540 px), banca de Teca, almoxarifado, pátio de descarga, garagem e pátio da batalha. Há ainda imagens transparentes do carrinho, badogue, sacos de lixo, caminhões, produtos vencidos, Teca, Neymar e grande bandeira vermelha. Preserve as dimensões ao substituir. Os volumes de colisão ficam em `src/market.js`.

Os menus usam cópias PNG editáveis em **jogo/interface/**: `mapa-fundo.png` e `mapa-favela.png` para o mapa, `ferro-velho.png` para upgrades, `casa-da-vo.png` para conquistas e `creditos.png` para os créditos. Os originais em **telas-referencia/** foram preservados. As áreas interativas continuam como botões HTML sobre as imagens.

Ao concluir o Mercado, o badogue passa a acompanhar o grupo em todas as fases. Seus lançamentos podem ser aprimorados no ferro velho com as melhorias de dano. A configuração guarda essa liberação em `badogue` junto do progresso.

## Logo, botões e tela inicial novos

Os caminhos estão na seção `ui` de **jogo/config.js**. O fundo usa **telas-referencia/Favela Pixelada sob o Sol.png**, com o logo separado por cima. O arquivo **logos/Logo principal** foi copiado sem alterar o conteúdo para **jogo/interface/logo-principal.png**, dando uma extensão reconhecida pelos navegadores; substitua essa cópia para editar o logo usado no jogo.

Os três botões usam **telas-referencia/Botões de Menu em Grafite Pixelado.png**, na ordem Iniciar, Créditos e Sair. Para usar a versão de pedra, troque apenas `ui.buttons` pelo caminho de **Botões de Pedra Pixel Art_ Iniciar, Créditos e Sair.png**. O botão Sair abre uma tela de despedida; fechar a aba continua sob controle do navegador. O mapa permanece acessível pelo botão abaixo.

O logo alternativo e a imagem composta **EAÍMAN na Favela Pixelada.png** continuam preservados como opções. A resolução interna do jogo foi ampliada para manter mais detalhes das novas folhas; a física e as áreas de colisão não mudaram.

O combate de Maneco usa o fundo adicional jogo/mercado/garage-yard-bg.png (960 × 540 px) e o caminhão lateral jogo/mercado/truck-side.png (180 × 76 px, transparente). A parede termina em y=125 na escala lógica de 480 × 270; o tráfego fica abaixo dela. garage-bg.png continua reservado ao resgate.

## Pranchas de cenário novas

As pranchas `personagens/assets cenario fase1.png`, `personagens/assets cenario2-1 fase1.png` e `personagens/assets cenario3 fase1.png` permanecem originais e alimentam as fachadas da rua longa. A composição por recortes está em `src/market-art.js`, na função `streetLandmarks()`; as plataformas físicas das casas são ajustadas em `src/market.js`. `personagens/Folha de sprites tuca.png` alimenta a personagem jogável Tuca; `personagens/Sprite teca fase1.png` alimenta a chefe Teca. Os recortes editáveis ficam em `jogo/animacoes.js` e `tools/map-character-atlases.py`.
