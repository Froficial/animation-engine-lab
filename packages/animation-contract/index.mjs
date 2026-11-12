// Deterministic AnimationDocument v1: no clock, randomness, network or state.
export const ACTIONS=Object.freeze(['walk','point','react','wave']);
const check=(ok,msg)=>{if(!ok)throw new Error('AnimationDocument: '+msg);};
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{const n=clamp(x);return n*n*(3-2*n)};
const mix=(a,b,t)=>a+(b-a)*t;
const round=x=>Math.round(x*1e4)/1e4;
export function validateDocument(doc){
 check(doc&&typeof doc==='object'&&!Array.isArray(doc),'invalid root');
 check(doc.version===1,'unsupported version');
 check(Number.isInteger(doc.fps)&&doc.fps>0&&doc.fps<=120,'invalid fps');
 check(Number.isInteger(doc.width)&&doc.width>=240&&doc.width<=3840,'invalid width');
 check(Number.isInteger(doc.height)&&doc.height>=240&&doc.height<=3840,'invalid height');
 check(Number.isInteger(doc.totalFrames)&&doc.totalFrames>=1&&doc.totalFrames<=36000,'invalid frame count');
 check(typeof doc.characterId==='string'&&doc.characterId.length>0,'missing character');
 check(doc.characterRig==='simple-humanoid-v1','unsupported rig');
 check(Array.isArray(doc.scenes)&&doc.scenes.length>0&&doc.scenes.length<=100,'invalid scenes');
 let cursor=0;const seen=new Set();
 for(const sc of doc.scenes){
  check(sc&&typeof sc==='object','invalid scene');
  check(typeof sc.id==='string'&&/^[a-z][a-z0-9-]*$/.test(sc.id)&&!seen.has(sc.id),'duplicate/invalid scene ID');seen.add(sc.id);
  check(Number.isInteger(sc.startFrame)&&sc.startFrame===cursor,'gap/overlap in scenes');
  check(Number.isInteger(sc.durationFrames)&&sc.durationFrames>0,'invalid scene duration');
  check(ACTIONS.includes(sc.action),'unknown action');
  check(typeof sc.heading==='string'&&sc.heading.length<=45,'invalid heading');
  check(typeof sc.subtitle==='string'&&sc.subtitle.length<=110,'invalid subtitle');
  check(!/[<>]/.test(sc.heading+sc.subtitle),'markup forbidden');
  cursor+=sc.durationFrames;check(cursor<=doc.totalFrames,'scene exceeds totalFrames');
 }
 check(cursor===doc.totalFrames,'scenes must fill timeline exactly');return doc;
}
export function sceneAtFrame(doc,frame){
 validateDocument(doc);
 check(Number.isInteger(frame)&&frame>=0&&frame<doc.totalFrames,'frame outside timeline');
 const scene=doc.scenes.find(sc=>frame>=sc.startFrame&&frame<sc.startFrame+sc.durationFrames);
 check(Boolean(scene),'scene not found');
 return {scene,localFrame:frame-scene.startFrame};
}
// Feet are held in world coordinates during stance and only travel in swing.
function foot(frame,origin,steps){
 let x=origin;
 for(const step of steps){
  if(frame<step[0])return {x,lift:0};
  if(frame<=step[1]){
   const u=(frame-step[0])/(step[1]-step[0]);
   return {x:mix(x,step[2],ease(u)),lift:23*Math.sin(Math.PI*u)};
  }
  x=step[2];
 }
 return {x,lift:0};
}
const leftSteps=[[41,61,212],[98,117,278]];
const rightSteps=[[10,30,241],[70,90,324]];
function blink(frame){
 for(const f of [53,185,309,412]){const d=Math.abs(frame-f);if(d<=3)return .1+.9*ease(d/3);}
 return 1;
}
function rawPose(scene,t,frame){
 const p=t/scene.durationFrames,phase=2*Math.PI*t/42;
 const s={action:scene.action,x:300,y:655,bodyY:0,torsoAngle:0,
  leftUpperArm:3,rightUpperArm:-3,leftForearm:3,rightForearm:3,
  leftLeg:0,rightLeg:0,leftFootX:276,rightFootX:325,leftFootLift:0,rightFootLift:0,
  headAngle:0,eyeScale:1,eyeOpen:blink(frame),pupilX:0,
  mouth:'smile',mouthOpen:0,browRaise:0,cameraZoom:1.025,spotlight:0,
  leftHand:'relaxed',rightHand:'relaxed'};
 if(scene.action==='walk'){
  s.x=160+140*ease(p);
  const a=foot(t,132,leftSteps),b=foot(t,176,rightSteps);
  s.leftFootX=a.x;s.rightFootX=b.x;s.leftFootLift=a.lift;s.rightFootLift=b.lift;
  s.leftLeg=13*Math.sin(phase);s.rightLeg=-s.leftLeg;
  s.leftUpperArm=18*Math.sin(phase);s.rightUpperArm=-18*Math.sin(phase);
  s.leftForearm=10;s.rightForearm=10;s.bodyY=1.5*Math.cos(2*phase);
  s.torsoAngle=1.3*Math.sin(phase);s.headAngle=-2*Math.sin(phase);
 }else if(scene.action==='point'){
  s.x=285;
  const m=ease(t/28);
  s.rightUpperArm=-73*m;s.rightForearm=-13*m;
  s.leftUpperArm=8;s.leftForearm=6;s.headAngle=-6*m;s.torsoAngle=1.5*m;
  s.pupilX=4*m;s.spotlight=m;s.rightHand=t>=15?'point':'relaxed';
  s.cameraZoom=1.025+.04*m;s.bodyY=Math.sin(t*.09)*1.1;
 }else if(scene.action==='react'){
  const m=ease(t/24),hop=t<=48?Math.sin(Math.PI*t/48):0;
  s.bodyY=-36*hop;s.leftFootLift=s.rightFootLift=12*hop;
  s.leftUpperArm=57*m;s.rightUpperArm=-56*m;s.leftForearm=-14*m;s.rightForearm=-16*m;
  s.headAngle=-8*m+1.5*Math.sin(t*.05);s.browRaise=10*m;
  s.eyeScale=1+.28*m;s.pupilX=-3*m;
  s.mouthOpen=.9*m*(t<68?1:Math.max(.25,1-(t-68)/65));
  s.mouth=s.mouthOpen>.5?'open':'smile';
  s.spotlight=1;s.cameraZoom=1.065+.03*hop;
  s.leftHand=s.rightHand=t>17?'open':'relaxed';
 }else{
  const m=ease(t/22);
  s.rightUpperArm=-56*m;s.rightForearm=-32*m+18*m*Math.sin(t*.18);
  s.rightHand=t>16?'open':'relaxed';
  s.headAngle=3.5*Math.sin(t*.075);s.leftUpperArm=9*m;
  s.pupilX=2;s.mouthOpen=.12*m;s.spotlight=1;s.cameraZoom=1.035;
 }
 return s;
}
export function poseAtFrame(doc,frame){
 const {scene,localFrame}=sceneAtFrame(doc,frame);
 const pose=rawPose(scene,localFrame,frame);
 if(scene.startFrame>0&&localFrame<14){
  const idx=doc.scenes.findIndex(sc=>sc.id===scene.id);
  const previous=doc.scenes[idx-1];
  const last=rawPose(previous,previous.durationFrames-1,scene.startFrame-1);
  const k=ease(localFrame/14);
  for(const key of Object.keys(pose)){
   if(key==='action')continue;
   if(typeof pose[key]==='number'&&typeof last[key]==='number')pose[key]=mix(last[key],pose[key],k);
   else if(k<.5)pose[key]=last[key];
  }
 }
 return Object.fromEntries(Object.entries(pose).map(([key,value])=>[key,typeof value==='number'?round(value):value]));
}
