# Perfil de Firefox — 25/09/2026

Arquivo analisado localmente: `Firefox 2026-09-25 00.57 profile.json.gz`. A análise seleciona a thread principal do processo da aba de `joaosantosdev.com.br`. O perfil bruto não é incluído no repositório.

## Evidências

O intervalo amostrado tem aproximadamente 12,06 segundos, com 3,50 segundos de CPU na thread principal. Das 6.030 amostras, 3.750 estão em Idle e 2.280 em atividade. As categorias são obtidas pelo ancestral que define explicitamente a categoria da pilha, evitando atribuir toda função nativa a Other.

| Categoria | Amostras ativas | Parcela das amostras ativas |
| --- | ---: | ---: |
| Graphics | 780 | 34,2% |
| JavaScript | 511 | 22,4% |
| Layout | 342 | 15,0% |

Essas parcelas são amostras de tempo de parede da thread, incluindo possíveis esperas; não representam utilização da GPU nem distribuição exata de CPU. As demais categorias completam o total.

- As pilhas incluem Paint em 727 amostras e WebRender display list em 409. Há trabalho relevante de pintura/composição da interface, além do 3D.
- O renderizador Three aparece em 295 amostras; `getProgramInfoLog`/`PWebGL::Msg_GetLinkResult` aparecem em 225. Isso aponta uma espera síncrona pela preparação dos programas gráficos no primeiro uso.
- Os três marcadores completos de tarefa longa duram 328,38 ms, 106,79 ms e 91,35 ms. O atraso máximo de eventos chega a 329,76 ms.
- Foram registradas 410 transições CSS. Sete grupos concentram 317 transições, das quais 305 foram canceladas: o indicador da navegação e as camadas de conteúdo, título, saudação, canvas e sobreposição do hero. O CSS global interpolava propriedades que Motion/paralaxe já atualizavam, reiniciando transições a cada atualização.

Contagens inclusivas se sobrepõem. Durações de marcadores aninhados ou simultâneos não devem ser somadas como custo independente. O processo gráfico é compartilhado com outras abas; não atribuímos todo o seu custo ao site. Esta captura também não comprova que a aceleração de hardware estava desligada.

## Correções

1. Restringir as transições globais aos controles e conservar as animações declaradas pelos componentes. Isso elimina a segunda interpolação nas camadas animadas pelo JavaScript.
2. Preparar os shaders do BB-8 e das tecnologias antes de mostrar cada modelo, com `compileAsync` e as luzes finais. Quando disponível, `KHR_parallel_shader_compile` permite esperar a compilação sem bloquear a thread principal. Sem essa extensão, o navegador pode continuar bloqueando durante a preparação.
3. Evitar consultas síncronas de logs completos dos shaders em produção. O resultado da compilação ainda é verificado, uma vez, depois da preparação, para tratar falhas.
4. Substituir o SVG do BB-8 por carregamento com novas tentativas e modal traduzido. Uma URL de tentativa nova evita reutilizar a falha armazenada pelo carregador de GLB. Respostas tardias de tentativas abandonadas são ignoradas.

As otimizações anteriores de geometria, resolução adaptativa e pausa fora da tela permanecem. Não há evidência nesta captura de que reduzir novamente o tamanho das imagens seja a prioridade para os engasgos observados.

## Verificação e limites

- 26 testes automatizados, lint e build.
- Carregamento e aparência do BB-8 no navegador local.
- Estilo computado das camadas afetadas sem transição CSS adicional (`transition-duration: 0s`), preservando os efeitos existentes.
- Falta de WebGL e download HTTP 503 tratados sem SVG; três solicitações quando o download falha continuamente; modal em PT/EN e botão de atualização.
- Falha temporária de download recuperada na segunda solicitação, sem modal; modelos do carrossel de tecnologias preparados e animados; contador do BB-8 estável enquanto a seção permanece fora da tela.

Esta rodada não produz um percentual de ganho de FPS: não foi feita uma nova captura no mesmo Firefox, equipamento e sequência de interação. A comparação válida exige repetir esse cenário depois de publicar as alterações.

Para reproduzir a análise sem enviar o perfil a terceiros:

```powershell
node scripts/analyze-firefox-profile.mjs 'C:/caminho/Firefox profile.json.gz'
```

Referência: [WebGLRenderer.compileAsync](https://threejs.org/docs/pages/WebGLRenderer.html#compileAsync).
