# Otimização de desempenho

## Diagnóstico

O BB-8 original do desktop continha 96.973 triângulos, e a versão móvel ainda continha 50.227. O canvas ocupava toda a primeira tela e continuava invalidando a cena 30–60 vezes por segundo mesmo fora do viewport. A seleção de qualidade considerava apenas tamanho da tela, memória, núcleos e economia de dados, sem acompanhar o desempenho real.

Os vídeos de projetos já eram carregados apenas após interação, e as fotos já usavam carregamento tardio/variantes responsivas. Arquivos grandes presentes em `public` não significam, por si, que sejam baixados na abertura da página.

## Resultados nos arquivos

| Recurso | Antes | Depois | Redução |
| --- | ---: | ---: | ---: |
| Triângulos do BB-8 desktop | 96.973 | 41.038 | 57,7% |
| Triângulos do BB-8 leve | 50.227 | 21.115 | 58,0% |
| Arquivo BB-8 desktop | 4.284.600 bytes | 2.866.632 bytes | 33,1% |
| Arquivo BB-8 leve | 2.178.340 bytes | 1.319.812 bytes | 39,4% |
| Fundo desktop | 575.882 bytes | 157.688 bytes | 72,6% |
| Fundo móvel | 238.694 bytes | 72.152 bytes | 69,8% |

Também foram simplificados os modelos de tecnologias onde a tolerância visual permitiu. O relatório completo está em [asset-optimization.json](./asset-optimization.json). Os originais foram preservados em `asset-sources/`, fora da pasta publicada; o aplicativo carrega `/models/optimized/`. O processamento acontece antes da publicação, sem decodificador extra de geometria no navegador.

## Comportamento em execução

- Renderização sob demanda, coordenada com a atualização da tela e limitada a 60 FPS no desktop ou 30 FPS no modo leve/tecnologias.
- O loop dorme quando o canvas sai da tela, quando a aba fica oculta ou quando o painel está inativo. A preferência de movimento reduzido é respeitada.
- A resolução acompanha os quadros efetivamente renderizados. Há aquecimento, confirmação de lentidão e recuperação mais lenta para evitar mudanças por um travamento isolado. Oscilações repetidas limitam futuras tentativas de aumentar qualidade.
- O buffer de desenho fica limitado a aproximadamente 1,5 milhão de pixels, inclusive em monitores 4K. A redução afeta apenas o canvas 3D; o texto e a interface mantêm sua resolução.
- Sob pressão persistente, o desktop passa ao modelo leve. Se necessário, a resolução pode cair até DPR 0,5 (ou o limite inferior exigido pelo orçamento de pixels) e a meta de atualização até 20 FPS. Essas são metas, não uma garantia em todo equipamento.
- O BB-8 não avança pelo tempo em que ficou oculto; o delta da animação é limitado ao retomar. As tecnologias continuam animadas também em modo leve.
- O paralaxe e as palavras alternadas param fora da tela. As atualizações de paralaxe ficam restritas às camadas envolvidas, evitando alterações de variáveis herdadas por toda a seção.
- O BB-8 mantém o indicador de carregamento e faz até três tentativas. Erros de download, criação/perda de WebGL e preparação do modelo iniciam outra tentativa, com espera de 1,5 e 3 segundos. Cada carregamento pode aguardar até 20 segundos enquanto a seção está ativa; o prazo reinicia ao voltar à seção/aba. Após três falhas consecutivas, um modal em PT/EN oferece atualizar a página. O SVG substituto foi removido. Nas tecnologias, os ícones existentes continuam disponíveis em caso de falha.
- Os shaders são preparados com `compileAsync` antes de exibir o modelo, usando a iluminação da cena final. A compilação paralela depende de suporte do navegador. A versão publicada verifica o resultado após a preparação, sem buscar logs completos dos shaders; os diagnósticos completos ficam no desenvolvimento.
- Transições globais ficam restritas aos controles. As animações explícitas de cada componente e do Motion continuam funcionando, sem uma segunda transição CSS tentando acompanhar cada atualização de transformação/opacidade.

A análise do perfil de Firefox de 25/09/2026 e as evidências destas últimas correções estão em [firefox-performance.md](./firefox-performance.md).

Sem aceleração gráfica, o navegador pode usar renderização por software ou não disponibilizar WebGL. O site reage ao desempenho e às falhas, sem tentar inferir a configuração do navegador. Não é possível garantir a mesma fidelidade 3D e 60 FPS em hardware arbitrariamente limitado.

## Verificação

`npm test` verifica 26 casos, incluindo nomes e hierarquia dos modelos, materiais, alvos e amostras interpoladas da animação, orçamento dos arquivos, limites de resolução, quedas sustentadas, recuperação da qualidade e estados das novas tentativas de carregamento. `npm run lint` e `npm run build` verificam o código e a compilação.

Verificações locais no navegador:

- Aparência desktop e viewport de 390 × 844, sem overflow horizontal.
- Modelo móvel próximo de 30 FPS no ambiente de teste, e tecnologias animadas no modo leve.
- Contagem de chamadas de desenho do BB-8 estável após sair da tela; a cena das tecnologias continuou desenhando.
- Carga artificial de CPU acionando a redução de resolução até DPR 0,5.
- Ausência de WebGL acionando novas tentativas e depois o modal, sem loader permanente e mantendo o restante da página.

Esses testes não representam um benchmark comparativo em um PC fraco real nem uma medição com aceleração de hardware desativada no sistema. As reduções de tamanho e triângulos são medidas diretamente dos arquivos; não devem ser apresentadas como percentuais de ganho de FPS.

Para reproduzir, rode `npm run dev` e abra `/tests/browser-lab.html`. Essa página local instrumenta chamadas de desenho e não faz parte da entrada de produção. Modos opcionais:

- `?mode=slow`: adiciona contenção artificial de CPU durante 45 segundos.
- `?mode=no-webgl`: simula falha ao obter contexto WebGL.
- `?mode=context-loss`: força a perda do contexto oito segundos após sua criação.
- `?mode=model-retry`: a primeira solicitação do BB-8 recebe HTTP 503; a seguinte pode carregar normalmente.
- `?mode=model-fail`: todas as solicitações do BB-8 recebem HTTP 503. `data-test-model-requests` no `body` conta as tentativas.

Os atributos `data-render-*` aparecem nos canvases apenas em desenvolvimento. `data-test-draws` pertence somente ao laboratório. Para conferir a pausa, aguarde a rolagem terminar e compare duas leituras do contador; um último quadro pendente durante a transição é normal. Não altere arquivos durante essa medição: o recarregamento automático reinicia as cenas e os contadores.

Para regenerar os recursos a partir dos originais: `npm run optimize:assets`.

Referências técnicas: [desempenho no React Three Fiber](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [custo da resolução no Three.js](https://threejs.org/manual/pages/responsive.html), [glTF Transform](https://gltf-transform.dev/) e [composição gráfica no Chromium](https://www.chromium.org/developers/design-documents/gpu-accelerated-compositing-in-chrome/).
