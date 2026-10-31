# Mercado — adaptação jogável das referências

## Referências assistidas

Os três vídeos enviados foram analisados por quadros ao longo de toda a duração, sem alterar os originais:
- 02/12/2016 14:47:09, cerca de 24 segundos: menu, mapa do morro e Casa da Vó.
- 03/12/2016 12:54:09, cerca de 18 segundos: rua, rivais, corrida, ataques e saltos.
- 02/12/2016 22:15:19, cerca de 58 segundos: acesso ao esgoto, descida e subida por plataformas, retorno à rua.

Os vídeos orientam a navegação e o espaço vertical do esgoto. Carrinho, três chefes e descarga seguem o briefing textual do usuário; não foram apresentados como cenas existentes nos vídeos. Os menus aproveitam as telas originais fornecidas na pasta.

## Sequência implementada

1. **Rua:** plataformas formam uma subida à laje do estilingue. Sacos de lixo atingidos explodem, podem atingir o jogador e os rivais e desencadeiam explosões próximas. Duas bandeiras pequenas ficam na rua.
2. **Esgoto secreto:** E no acesso da rua entra na galeria vertical. Há latinhas, suco e a terceira bandeira. É possível descer e subir pelas plataformas; E perto da escada superior retorna à rua. Coletáveis não reaparecem ao alternar entre as duas áreas.
3. **Porta do Sacolão:** só abre com o estilingue. Sem ele, o aviso orienta voltar à laje. Não há bloqueio para voltar pela rua.
4. **Carrinho:** entrada e saída animadas. Três corredores, obstáculos e latinhas. W/S ou ↑/↓ mudam de corredor; A/D alteram a velocidade. O personagem sai antes da banca de frutas.
5. **Mariana (nome temporário):** aparece em posições aleatórias atrás da banca frontal e atira produtos vencidos. Só recebe dano quando está exposta. Vitória concede a conquista “Validade vencida”, restaura os corações e salva o checkpoint no almoxarifado.
6. **Neymar:** percorre a estante superior de três andares e joga caixas de tamanhos variados. Disparos diretos não o vencem; é preciso destruir os três suportes destacados. Ele cai, concede “Estoque em queda” e salva a entrada da descarga.
7. **Descarga:** primeiro, caminhões avançam verticalmente após avisos nas faixas. Depois, pilhas de caixas deslizam pelos lados. Aos 22 segundos, a passagem para a garagem fica segura; E à direita entra. Esta é uma versão inicial da mecânica a ser elaborada depois.
8. **Maneco:** lança produtos e caixas e convoca caminhões sinalizados. Uma explosão próxima de lixo rompe sua proteção por seis segundos, permitindo acertá-lo com o estilingue. Sacos são repostos quando todos foram usados, evitando ficar sem recurso. A vitória concede “Fim do expediente”, a grande bandeira vermelha e exatamente 20 latinhas de bônus.
9. **Resgate:** a garagem abre, Tuca aparece amarrado, Luketa se aproxima e solta as cordas. Ambos saem correndo. Somente ao terminar essa cena a fase é concluída e Tuca entra na seleção de personagens.

## Decisões para esta versão

- As três bandeiras pequenas são uma conquista opcional; a condição da porta é somente o estilingue, conforme solicitado. A bandeira grande é recompensa de Maneco.
- A mira com mouse considera a câmera, inclusive no esgoto. Clique dispara. X oferece mira assistida quando o mouse está fora do cenário, para permitir jogar também pelo teclado e pelos controles de toque.
- Há pontos de apoio em memória antes dos encontros. Os pontos persistentes começam após Mariana. Reiniciar do zero apaga o checkpoint da tentativa; não apaga conquistas anteriores.
- As latinhas da tentativa ficam no checkpoint e vão para a mochila após o resgate. Retomar uma cutscene não concede o bônus de Maneco novamente.
- O nome Mariana e os valores de vida/velocidade são ajustáveis em `src/market.js`. Colisões e plataformas permanecem separadas da arte PNG/WebP.
- Os novos desenhos são bases editáveis, não uma reprodução final de todas as animações do protótipo. O pulo, a corrida, o deslize e o lançamento preservam os controles da versão HTML.

## Validação

Testes de regras cobrem acesso sem arma, rota até a laje, volta do esgoto, não duplicação de itens, mira, explosões, carrinho, vulnerabilidades dos três chefes, caminhões, checkpoints, recompensa e desbloqueio após a cutscene. Os testes de navegador verificam a interface, um disparo real com mouse nos suportes, recarga do checkpoint e as telas de cada área; resultados de combate são preparados nesses testes de interface e verificados separadamente nos testes de regras.
