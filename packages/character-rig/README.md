# Character Rig v1 — R0 full-body skeletal base

Pure JavaScript / TypeScript declarations with no dependency on Remotion, React or paid services. Defines the anatomical hierarchy and runs FK from parent transforms down to attached joints. This is the **engineering skeleton**, not the final character artwork.

## Implemented in R0
- Single root, pelvis, lumbar, chest, separate neck base and neck tip, head, face.
- Both sides: clavicle, shoulder, upper arm, elbow, forearm, wrist, hand.
- Five articulated digit chains per hand (three joints per digit).
- Both legs: hip, thigh, knee, shin, ankle, foot, heel, ball and toe.
- Local pivots, radians, rest lengths, angle limits, draw layers and five view slots.
- Rig schema validation: missing parents, cycles, length mismatch, unknown joints, bounds.
- FK world transforms: same pose produces same world coordinates independent of evaluation order.

## Next gates (not implemented yet)
- R1: SkeletonProof implemented; visual acceptance remains pending.
- R2: front/three-quarter/profile artwork and body/head facing.
- R3: IK two-bone for arms/legs and world-locked feet during stance.
- R4: functional finger curling and grabbing, object attachments.
- R5: performance layers / animation blending; R6: A/B rendered MP4 and Mac approval.

Test: \`node --test packages/character-rig/*.test.mjs\`.

Existing rig v2.1 renderer is unchanged; no main-app integration yet.
