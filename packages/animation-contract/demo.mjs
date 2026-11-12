export const demoDocument = Object.freeze({
  version: 1,
  id: 'three-motion-rig',
  fps: 30,
  width: 540,
  height: 960,
  totalFrames: 450,
  characterId: 'nico',
  characterRig: 'simple-humanoid-v1',
  scenes: [
    {id:'walk', startFrame:0, durationFrames:120, action:'walk', heading:'CAMINHAR', subtitle:'Pernas e braços em oposição'},
    {id:'point', startFrame:120, durationFrames:135, action:'point', heading:'APONTAR', subtitle:'Braço articulado aponta a descoberta'},
    {id:'react', startFrame:255, durationFrames:120, action:'react', heading:'REAGIR', subtitle:'Cabeça, olhos e corpo expressam surpresa'},
    {id:'wave', startFrame:375, durationFrames:75, action:'wave', heading:'PRONTO!', subtitle:'O mesmo rig, quatro poses na mesma timeline'}
  ]
});