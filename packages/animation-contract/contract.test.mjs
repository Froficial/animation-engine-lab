import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {validateDocument,sceneAtFrame,poseAtFrame} from './index.mjs';
import {demoDocument} from './demo.mjs';
const copy=()=>JSON.parse(JSON.stringify(demoDocument));
test('450 contiguous frames and valid document',()=>{
 assert.equal(validateDocument(copy()).totalFrames,450);
 assert.equal(demoDocument.scenes.reduce((n,s)=>n+s.durationFrames,0),450);
 assert.deepEqual(demoDocument.scenes.map(s=>s.startFrame),[0,120,255,375]);
});
test('walk, point, react and wave at key frames',()=>{
 assert.deepEqual([0,119,120,254,255,374,375,449].map(f=>sceneAtFrame(demoDocument,f).scene.action),
 ['walk','walk','point','point','react','react','wave','wave']);
 assert.notEqual(poseAtFrame(demoDocument,14).leftLeg,poseAtFrame(demoDocument,22).leftLeg);
 assert.ok(poseAtFrame(demoDocument,160).rightUpperArm<-65);
 assert.equal(poseAtFrame(demoDocument,285).mouth,'open');
 assert.notEqual(poseAtFrame(demoDocument,408).rightForearm,poseAtFrame(demoDocument,425).rightForearm);
});
test('random access and backward scrubbing is deterministic',()=>{
 for(const f of [0,15,45,119,120,143,254,255,274,374,375,445,449]){
  const a=JSON.stringify(poseAtFrame(demoDocument,f));
  poseAtFrame(demoDocument,448);
  assert.equal(JSON.stringify(poseAtFrame(demoDocument,f)),a);
 }
});
test('reject invalid timelines, actions, and untrusted markup',()=>{
 const bad=[x=>x.scenes[1].startFrame=111,x=>x.scenes[1].action='teleport',x=>x.scenes[0].heading='<script>',x=>x.scenes[3].durationFrames=70,x=>x.characterRig='code'];
 for(const corrupt of bad){const doc=copy();corrupt(doc);assert.throws(()=>validateDocument(doc),/AnimationDocument:/);}
});
test('reject out-of-range and fractional frame numbers',()=>{
 for(const f of [-1,450,1.2,NaN])assert.throws(()=>poseAtFrame(demoDocument,f),/frame outside timeline/);
});
test('stance foot remains planted while the other swings',()=>{
 for(let f=31;f<40;f++)assert.equal(poseAtFrame(demoDocument,f).rightFootX,241);
 assert.equal(poseAtFrame(demoDocument,50).rightFootX,241);
 assert.ok(poseAtFrame(demoDocument,50).leftFootLift>0);
 for(let f=62;f<69;f++)assert.equal(poseAtFrame(demoDocument,f).leftFootX,212);
 for(let f=0;f<120;f++){
  const p=poseAtFrame(demoDocument,f);
  assert.ok(p.leftFootX < p.rightFootX, 'crossed feet at '+f);
 }
});
test('scene boundaries blend positions and joint rotations',()=>{
 for(const boundary of [120,255,375]){
  const prev=poseAtFrame(demoDocument,boundary-1);
  const next=poseAtFrame(demoDocument,boundary);
  for(const field of ['x','bodyY','headAngle','rightUpperArm','rightForearm','leftUpperArm','cameraZoom','leftFootX','rightFootX']){
   assert.ok(Math.abs(prev[field]-next[field])<.001,boundary+': '+field+' jumped');
  }
 }
});
test('blink, gaze and pointing hand are scheduled',()=>{
 assert.ok(poseAtFrame(demoDocument,53).eyeOpen<=.15);
 assert.ok(poseAtFrame(demoDocument,57).eyeOpen>.99);
 assert.equal(poseAtFrame(demoDocument,170).rightHand,'point');
 assert.ok(poseAtFrame(demoDocument,290).mouthOpen>.7);
});
test('every frame has finite, bounded numeric properties',()=>{
 for(let f=0;f<450;f++)for(const [name,value] of Object.entries(poseAtFrame(demoDocument,f))){
  if(typeof value==='number')assert.ok(Number.isFinite(value)&&Math.abs(value)<2000,name+' at '+f);
 }
});
