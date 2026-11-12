import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {createHumanoidRig,evaluateSkeleton} from '../../../packages/character-rig/index.mjs';
import {skeletonPoseAtFrame} from '../../../packages/character-rig/performance.mjs';
const rig=createHumanoidRig();
type World=ReturnType<typeof evaluateSkeleton>;
const matrix=(n:World[string])=>'matrix('+n.matrix.join(' ')+')';
const line=(a:World[string],b:World[string])=>`M${a.x} ${a.y}L${b.x} ${b.y}`;
export const GroundedCharacter:React.FC<{debug?:boolean}>=({debug=false})=>{
 const frame=useCurrentFrame(),p=skeletonPoseAtFrame(frame),w=evaluateSkeleton(rig,p.angles,p.rootOffset);
 const path=(ids:string[])=>ids.map((id,i)=>`${i?'L':'M'}${w[id].x} ${w[id].y}`).join(' ')+'Z';
 const finger=(side:string,name:string)=>[0,1,2].map(n=>w[`${side}_${name}_${n}`]);
 const art=<>
  <ellipse cx={p.rootOffset.x} cy={780} rx={p.flight?42:55} ry={7} fill="#123a44" opacity={p.flight?.13:.25}/>
  {(['left','right'] as const).map(side=><g key={side}>
    <path d={line(w[side+'_hip'],w[side+'_knee'])} stroke="#28445d" strokeWidth="33" strokeLinecap="round"/>
    <path d={line(w[side+'_knee'],w[side+'_ankle'])} stroke="#35546d" strokeWidth="29" strokeLinecap="round"/>
    <path d={line(w[side+'_hip'],w[side+'_knee'])} stroke="#51748d" strokeWidth="3" strokeLinecap="round"/>
    <g transform={matrix(w[side+'_ankle'])}>
      <path d="M-17 -14Q-7 -22 12 -13L18 0Q36 0 36 11L-20 11Z" fill="#22add0" stroke="#14728f" strokeWidth="2"/>
      <path d="M-20 10H36V16H-20Z" fill="#f7fcff"/><path d="M-5 -9L12 -7M-5 -3L15 -1" stroke="white" strokeWidth="3"/>
    </g>
  </g>)}
  <path d={path(['neck_base','right_shoulder','right_hip','left_hip','left_shoulder'])} fill="#258bc7" stroke="#17608d" strokeWidth="4" strokeLinejoin="round"/>
  <path d={line(w.left_hip,w.right_hip)} stroke="#1e384e" strokeWidth="14" strokeLinecap="round"/>
  <path d={line(w.neck_base,w.head_root)} stroke="#edb58c" strokeWidth="24" strokeLinecap="round"/>
  {(['left','right'] as const).map(side=><g key={side}>
    <path d={line(w[side+'_shoulder'],w[side+'_elbow'])} stroke="#efbd96" strokeWidth="23" strokeLinecap="round"/>
    <path d={line(w[side+'_shoulder'],{...w[side+'_elbow'],x:(w[side+'_shoulder'].x+w[side+'_elbow'].x)/2,y:(w[side+'_shoulder'].y+w[side+'_elbow'].y)/2})} stroke="#217eb7" strokeWidth="30" strokeLinecap="round"/>
    <path d={line(w[side+'_elbow'],w[side+'_wrist'])} stroke="#f4c6a1" strokeWidth="21" strokeLinecap="round"/>
    <ellipse transform={matrix(w[side+'_hand'])} cx="0" cy="6" rx="15" ry="18" fill="#f4c6a1"/>
    {['thumb','index','middle','ring','pinky'].map(name=>{const f=finger(side,name);return <path key={name} d={`M${w[side+'_hand'].x} ${w[side+'_hand'].y}L${f.map(n=>`${n.x} ${n.y}`).join('L')}`} fill="none" stroke="#efbd96" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>;})}
  </g>)}
  <g transform={matrix(w.head_root)}>
    <ellipse cx="0" cy="-36" rx="48" ry="57" fill="#f2c29b" stroke="#ca9271" strokeWidth="2"/>
    <path d="M-46 -52Q-58 -91 -19 -99Q5 -115 34 -92Q53 -80 46 -48L28 -75Q0 -63 -17 -81Q-29 -61 -46 -52Z" fill="#624337"/>
    {[-18,18].map(x=><g key={x}><ellipse cx={x} cy="-38" rx="9" ry={(10+3*p.face.surprise)*p.face.blink} fill="white"/>{p.face.blink>.3&&<><circle cx={x+p.face.gaze} cy="-37" r="4.8" fill="#24364d"/><circle cx={x+p.face.gaze+1} cy="-39" r="1.5" fill="white"/></>}<path d={`M${x-9} ${-56-8*p.face.surprise}q9 -5 18 0`} stroke="#624337" strokeWidth="3" fill="none" strokeLinecap="round"/></g>)}
    <path d="M0 -35q-4 12 3 15" stroke="#cc9575" fill="none" strokeWidth="2"/>
    {p.face.mouthOpen>.25?<ellipse cx="0" cy="-4" rx="10" ry={5+9*p.face.mouthOpen} fill="#7e3346"/>:<path d="M-15 -5Q0 9 15 -5" fill="none" stroke="#95494e" strokeWidth="3" strokeLinecap="round"/>}
  </g>
 </>;
 const bones=<>{rig.joints.filter(n=>n.parentId&&n.restLength>0).map(n=><path key={n.id} d={line(w[n.parentId!],w[n.id])} stroke={/neck|head/.test(n.id)?'#ffd064':'#8ce2d4'} strokeWidth={/thumb|index|middle|ring|pinky/.test(n.id)?3:7} strokeLinecap="round"/>)}{rig.joints.map(n=><circle key={n.id} cx={w[n.id].x} cy={w[n.id].y} r="3" fill="white"/>)}<ellipse transform={matrix(w.head_root)} cx="0" cy="-36" rx="48" ry="57" stroke="#ffd064" strokeWidth="2" fill="#ffd06422"/></>;
 return <AbsoluteFill style={{background:'#102c40',fontFamily:'Arial, sans-serif'}}><svg viewBox="0 0 540 960" width="100%" height="100%">
  <defs><linearGradient id="scene" x2="0" y2="1"><stop stopColor="#173b54"/><stop offset="1" stopColor="#367e85"/></linearGradient></defs>
  <rect width="540" height="960" fill="url(#scene)"/>
  <text x="30" y="47" fill="#aee9e2" fontSize="17" letterSpacing="2">{debug?'ESQUELETO · MESMA POSE':'ANIMATION ENGINE LAB'}</text>
  <text x="30" y="90" fill="white" fontSize="28" fontWeight="bold">{p.title}</text>
  <g transform="translate(-15 60) scale(0.96)">
    <path d="M40 772H500" stroke="#a9dcd3" strokeWidth="2"/>
    {[120,180,240,300,360,420].map(x=><path key={x} d={`M${x} 772v10`} stroke="#a9dcd3"/>)}
    {p.pointing>.02&&<g opacity={p.pointing}><circle cx="500" cy="340" r="27" fill="#ffcf61"/><path d="M489 340h22m-11 -11v22" stroke="#fff8dc" strokeWidth="4"/></g>}
    {debug?bones:art}
    {debug&&(['left','right'] as const).map(side=><g key={side}><circle cx={p.feet[side].x} cy={p.feet[side].y} r="9" fill="none" stroke={p.feet[side].contact?'#84ff9d':'#ffd064'} strokeWidth="2"/><text x={p.feet[side].x-20} y="810" fill="white" fontSize="12">{p.feet[side].contact?'APOIO':'LIVRE'}</text></g>)}
  </g>
  <rect x="24" y="849" width="492" height="79" rx="14" fill="#102c40"/>
  <text x="40" y="880" fill="white" fontSize="19">{['Passos laterais com apoio alternado','O olhar acompanha o gesto','Preparação, impulso e amortecimento','Cabeça, braço e mão articulados'][p.section]}</text>
  <text x="40" y="909" fill="#aee9e2" fontSize="16">{debug?'Alvos verdes: pés fixos durante o apoio':'Pele e esqueleto compartilham 77 juntas'}</text>
  <rect x="24" y="943" width={492*(frame+1)/450} height="5" rx="2" fill="#ffcf61"/>
 </svg></AbsoluteFill>;
};
