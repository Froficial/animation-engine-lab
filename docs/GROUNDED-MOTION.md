# Apoio dos pés e personagem articulado

RigProof e SkeletonProof agora usam a mesma pose e hierarquia: a pele acompanha as juntas em vez de executar uma animação independente. LegacyRigProof preserva a versão anterior para comparação.

A demonstração contém passos laterais, olhar/apontar, pequeno salto e aceno. Não é uma caminhada frontal ou um sistema geral de locomoção.

- Cinemática inversa de duas juntas preserva coxa (94) e canela (88).
- O alvo de cada pé permanece fixo durante o apoio. A sola fica horizontal no chão (y=772).
- O quadril se desloca entre apoios; o salto possui agachamento, voo e amortecimento.
- Olhar, piscadas, sobrancelhas e boca respondem à atuação.
- Pele e diagnóstico usam enquadramento idêntico e alvos de contato visíveis no diagnóstico.

Validação local: 28 testes Node aprovados, incluindo os 450 quadros, intervalos de apoio e deslocamento entre quadros. Build TypeScript/Vite aprovado. A renderização e a inspeção artística são verificações separadas: testes não aprovam qualidade artística.

Limites: atuação procedural, vista frontal com deslocamento lateral, sem virada 3D, colisões ou transferência de peso fisicamente simulada. A demonstração não conecta automaticamente desenhos SVG arbitrários ao rig. O salto e os gestos ainda exigem avaliação visual do MP4.
