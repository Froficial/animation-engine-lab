# Checkpoint R1 — SkeletonProof

Prova isolada de esqueleto 2D com **77 juntas**, quadril→coluna→tórax→pescoço (base e ponta)→cabeça, ambas as mãos com cinco dedos, pernas e pés. Usa exatamente o mesmo pacote `packages/character-rig` nas regras, testes e na composição Remotion `SkeletonProof`.

## Critério demonstrado

- Transformações hierárquicas contínuas (FK), juntas pai/filho conectadas e comprimentos invariáveis.
- Tórax inclinando e cabeça reagindo com ajuste separado do pescoço.
- Ombro→cotovelo→punho→dedos herdando transformações.
- Seek determinístico: frame idêntico independente da ordem de acesso.
- Export de 15s, 450 frames a 30 fps pelo GitHub Actions, quando os runners estiverem disponíveis.

**Não inclui:** virada 3/4 ou perfil do rosto, IK de pernas, pés travados no chão, desenho de pele ou integração ao gerador principal. Esses ficam nos próximos gates R2–R6.

## Como visualizar

No projeto de experimentos Remotion, composição `SkeletonProof`. O workflow `render-proof.yml` salvará `out/skeleton-r1-15s.mp4` e três quadros de referência como artefato.

**Status inicial:** implementado na branch experimental; ainda requer testes e inspeção do arquivo renderizado antes de aceite.
