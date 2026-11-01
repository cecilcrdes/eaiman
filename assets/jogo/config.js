// Edite este arquivo para trocar PNG por WebP ou usar outros nomes de arquivo.
// Os caminhos abaixo são relativos a assets/jogo/.
window.EaiAssetConfig = {
  // Use true para desenhos artesanais com curvas suaves; false para pixel art.
  smooth: false,
  resolution: 2,
  characters: {
    luketa: {src:'../personagens/Folha de sprites do luketa.png',atlas:'luketa'},
    tuca: {src:'../personagens/Folha de sprites tuca.png',atlas:'tuca'},
    jana: 'personagens/jana.png',
    lea: {src:'../personagens/Sprite Sheet da lea.png',atlas:'lea'},
    teca: {src:'../personagens/Sprite teca fase1.png',atlas:'teca'}
  },
  ui: {
    logo:'interface/logo-principal.png',
    background:'../telas-referencia/Favela Pixelada sob o Sol.png',
    buttons:'../telas-referencia/Botões de Menu em Grafite Pixelado.png',
    screens:{
      mapBackground:'interface/mapa-fundo.png',mapArt:'interface/mapa-favela.png',
      shop:'interface/ferro-velho.png',collection:'interface/casa-da-vo.png',credits:'interface/creditos.png'
    }
  },
  scenes: {
    market: {sky:'cenarios/market-ceu.png',street:'cenarios/market-rua.png',rival:'inimigos/market-rival-sheet.png',boss:'inimigos/market-chefe.png',flag:'objetos/bandeira-market.png'},
    field: {sky:'cenarios/field-ceu.png',street:'cenarios/field-rua.png',rival:'inimigos/field-rival-sheet.png',boss:'inimigos/field-boss-sheet.png',flag:'objetos/bandeira-field.png'},
    school: {sky:'cenarios/school-ceu.png',street:'cenarios/school-rua.png',rival:'inimigos/school-rival-sheet.png',boss:'inimigos/school-boss-sheet.png',flag:'objetos/bandeira-school.png'},
    rooftop: {sky:'cenarios/rooftop-ceu.png',street:'cenarios/rooftop-rua.png',rival:'inimigos/rooftop-rival-sheet.png',boss:'inimigos/rooftop-boss-sheet.png',flag:'objetos/bandeira-rooftop.png'}
  },
  objects: {ground:'objetos/chao.png',platform:'objetos/plataforma.png',crate:'objetos/caixa.png',can:'objetos/latinha.png',juice:'objetos/suco.png',bread:'objetos/sonho.png',fruit:'objetos/fruta.png',cat:'objetos/juca.png'}
};
window.EaiAssetConfig.scenery = {
  marketLayout:'../personagens/packcasas_fase1.png',
  marketParallax:'../personagens/assetsparallax.png',
  marketGround:'../personagens/assets_chao.png',
  schoolInterior:'../personagens/assets fase 2.png'
};
// Novas áreas do Mercado. PNG e WebP podem ser usados nesses mesmos caminhos.
window.EaiAssetConfig.market = {
  'sewer-bg':'mercado/sewer-bg.png', 'cart-bg':'mercado/cart-bg.png',
  'mariana-bg':'mercado/mariana-bg.png', 'warehouse-bg':'mercado/warehouse-bg.png',
  'unloading-bg':'mercado/unloading-bg.png', 'garage-bg':'mercado/garage-bg.png',
  trash:'mercado/trash.png', slingshot:'mercado/slingshot.png', cart:'mercado/cart.png',
  'garage-yard-bg':'mercado/garage-yard-bg.png', 'truck-side':'mercado/truck-side.png',
  truck:'mercado/truck.png', expired:'mercado/expired.png', mariana:'mercado/mariana.png',
  neymar:'mercado/neymar.png', 'red-banner':'mercado/red-banner.png'
};
