# Projetos e desempenho

## Portfólio

- Quatro destaques: Centrix, Sprintly, Koda AI e Prisma. Capas SVG compostas com
  as logos originais. A assinatura “Powered by LTK” foi removida apenas da cópia
  da logo do Prisma usada neste portfólio.
- Textos e tecnologias em português e inglês. As tecnologias seguem a lista
  fornecida pelo autor, separadas em desenvolvimento, infraestrutura e foco.
- Centrix e Sprintly têm links públicos; Koda e Prisma são privados.
- Cards e detalhes exibem a URL pública clicável com botão de copiar e confirmação.
  A capa e o título ficam sem setas; “Explorar projeto” usa apenas um chevron.
- Os detalhes apresentam galeria ampliada, miniaturas, demonstração completa,
  visão geral, tecnologias e destaques. Escape fecha o diálogo e devolve o foco.
- “Mostrar mais” revela quatro repositórios públicos selecionados do GitHub:
  GLBlender, pokemon-trainers-life, emf-compat-emotecraft e TicketFlow-front.
  A seleção em `src/data/githubProjects.js` foi verificada em 15/09/2026 e é
  estática; não realiza chamadas à API em cada visita.

## Vídeos e imagens

As capas ficam visíveis até o mouse permanecer por 240 ms no card. Nesse momento,
uma prévia de 20 segundos é carregada, com indicador de carregamento real e
reprodução silenciosa, sem controles nativos. Ao sair do card, o vídeo é removido
e seu carregamento é cancelado. Toque e preferência por movimento reduzido não
disparam essas prévias. A barra antiga de seleção de mídia foi removida.

| Projeto  | Vídeo completo | Prévia de hover |
| -------- | -------------: | --------------: |
| Centrix  |       22,30 MB |         1,62 MB |
| Sprintly |       37,32 MB |         0,22 MB |
| Koda AI  |       29,33 MB |         0,27 MB |
| Prisma   |       11,46 MB |         0,20 MB |

Valores decimais dos arquivos preparados. As quatro prévias somam cerca de
2,31 MB, e não são baixadas no carregamento inicial da página. Foram codificadas
em H.264, largura de 960 px, 24 fps, CRF 23 e sem áudio.

Os vídeos completos só são solicitados ao selecionar a demonstração nos detalhes.
Seus fluxos de vídeo e áudio foram preservados sem recodificação, com hashes
conferidos contra os originais. O contêiner MP4 recebeu `faststart`, permitindo
iniciar a reprodução antes do download completo. No diálogo há pausa/reprodução,
som e uma barra para selecionar o momento por mouse, toque ou teclado,
com indicação de tempo atual e duração. A reprodução pausa quando sai da área
visível ou a aba fica oculta.

Os prints foram convertidos para WebP sem perdas. As versões completas mantêm
1920 × 1080 px; miniaturas usam variantes de 960 px. As mídias originais fornecidas
pelo autor e os arquivos nos repositórios de origem permanecem intactos.

Dados e caminhos ficam em `src/data/portfolioData.js`; arquivos ficam em
`public/assets/projects/<slug>/`. Cada projeto possui capa, imagens completas,
miniaturas, vídeo completo e prévia curta.

## BB-8 e rolagem

- `HeroScene.jsx` carrega o código 3D separadamente da interface principal.
- A cena renderiza continuamente somente com a hero visível e a aba ativa;
  fora disso, renderiza sob demanda. Movimento reduzido mantém o BB-8 parado.
- Os OrbitControls inativos foram removidos. A câmera mantém o enquadramento
  original e o arraste próprio do BB-8 continua disponível no mouse.
- No mobile, o toque atravessa o canvas. Foram removidos `preventDefault` e o
  multiplicador de rolagem 5×; o navegador controla rolagem, inércia e zoom.
- Geometria, texturas, GLBs, iluminação e limites de resolução foram preservados.

O JavaScript principal passou de 1.384,27 kB para aproximadamente 440 kB
(gzip: de 392,71 kB para aproximadamente 137 kB). Isso reduz o pacote inicial,
mas a biblioteca 3D ainda é baixada separadamente. Não foi medido ganho de FPS
ou consumo de bateria.

## Validação

Build de produção e lint sem erros. Conferidos no navegador: capas, reprodução
de prévias, cancelamento ao sair do card, galeria, vídeo completo, pausa, Escape,
retorno do foco, links públicos e expansão dos repositórios. Layouts desktop e
mobile sem transbordamento horizontal. A rolagem automatizada sobre a área do
modelo funcionou; o gesto de dedo com inércia ainda exige um celular físico.

Avisos preexistentes: dependência de `useMemo` em About, imagens `dark.jpg` e
`dark-mobile.jpg` ausentes e tamanho elevado do pacote da biblioteca 3D.
