# Animation Engine Lab

Laboratório público independente para desenvolver e testar animação 2D determinística com JavaScript, React, SVG e Remotion.

## Executar

Na raiz:

```bash
node --test packages/animation-contract/*.test.mjs packages/character-rig/*.test.mjs
cd experiments/remotion-poc
npm ci
npm run build:player
npm run dev
```

Para gerar MP4: `npm run render`. Para esqueleto: `npx remotion render src/index.tsx SkeletonProof out/skeleton-r1-15s.mp4 --concurrency=2`.

## Testes no GitHub

[Actions](https://github.com/Froficial/animation-engine-lab/actions): a cada alteração no motor, o workflow executa testes, compila a prévia e renderiza duas provas de 15 segundos (540×960, 30 fps, 450 quadros). Também compara frames repetidos e valida os MP4s com FFprobe.

Abra uma execução concluída e baixe **animation-engine-proof** em Artifacts. Contém MP4s, PNGs, storyboard e metadados. Os artefatos expiram após 3 dias; uma nova execução os recria.

Usa exclusivamente runner padrão `ubuntu-24.04`, sem API paga, credenciais ou checkout de projeto privado. O job não executa se este repositório se tornar privado. Runners padrão em repositórios públicos são gratuitos conforme a [documentação GitHub](https://docs.github.com/en/actions/how-tos/write-workflows/choose-where-workflows-run/choose-the-runner-for-a-job). Licença do Remotion: [condições do fornecedor](https://www.remotion.dev/docs/license/pricing).

## O que esta prova demonstra

- Contrato de animação e poses determinísticas por quadro.
- Personagem SVG com caminhada, apontar, reação e aceno.
- Esqueleto FK de 77 juntas, pescoço separado e cinco dedos em cada mão.
- Mesmos componentes de composição na prévia e no render.

Ainda não entrega Character Studio completo, IK anatômico, rotação 3D, fala sincronizada nem integração ao produto principal. Aprovação técnica do arquivo não equivale a aprovação artística do movimento.

Veja [auditoria do recorte](docs/PUBLICATION-AUDIT.md). Nenhum histórico Git, banco, upload, voz ou configuração privada foi importado.
