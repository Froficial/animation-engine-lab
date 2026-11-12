import React from 'react';
import {AbsoluteFill,useCurrentFrame} from 'remotion';
import {createHumanoidRig,evaluateSkeleton} from '../../../packages/character-rig/index.mjs';
import {skeletonPoseAtFrame,TOTAL_FRAMES,FPS} from '../../../packages/character-rig/performance.mjs';

const rig=createHumanoidRig();
type WorldPose=ReturnType<typeof evaluateSkeleton>;
type Joint=WorldPose[string];
const jointColor=(id:string)=>{
 if(/neck|head_root/.test(id))return '#ffdc71';
 if(/thumb|index|middle|ring|pinky|hand|wrist/.test(id))return '#a5ef9b';
 if(/foot|ankle|heel|ball|toe/.test(id))return '#7ab6ff';
 if(/hip|pelvis|thigh|knee|shin/.test(id))return '#94bcff';
 return '#f0b7e3';
};
// Explicit body-part roots and joints. Skeleton is a debug visualization,
// NOT a final skin or IK demonstration.
export const SkeletonProof:React.FC=()=>{
 const frame=useCurrentFrame();
 const control=skeletonPoseAtFrame(frame);
 const world=evaluateSkeleton(rig,control.angles,control.rootOffset);
 const head=world.head_root;
 const isFinger=(id:string)=>/thumb|index|middle|ring|pinky/.test(id);
 return <AbsoluteFill style={{background:'#071c34',fontFamily:'Arial, Helvetica, sans-serif'}}>
  <svg viewBox="0 0 540 960" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
   <defs>
    <linearGradient id="r1-bg" x1="0" y1="0" x2="1" y2="1">
     <stop stopColor="#092742"/><stop offset=".55" stopColor="#143959"/><stop offset="1" stopColor="#145d67"/>
    </linearGradient>
    <radialGradient id="r1-halo"><stop stopColor="#e5fcff" stopOpacity=".19"/><stop offset="1" stopColor="#59adfa" stopOpacity="0"/></radialGradient>
   </defs>
   <rect width="540" height="960" fill="url(#r1-bg)"/>
   <circle cx="300" cy="470" r="295" fill="url(#r1-halo)"/>
   <g opacity=".22" stroke="#dff7ff" strokeWidth="1">
    {[100,200,300,400,500,600,700,800].map(y=><line key={y} x1="0" y1={y} x2="540" y2={y}/>)}
    {[90,180,270,360,450].map(x=><line key={x} x1={x} y1="220" x2={x} y2="840"/>)}
   </g>
   <path d="M55 790 L485 790" stroke="#8ce9d8" strokeWidth="3" strokeDasharray="10 11" opacity=".65"/>
   <g>
    {rig.joints.filter(n=>n.parentId!==null&&n.restLength>0).map(n=>{
      const a=world[n.parentId!],b=world[n.id];
      const color=jointColor(n.id);
      const width=isFinger(n.id)?5:/neck/.test(n.id)?16:/thigh|knee|shin|upper_arm|elbow|forearm/.test(n.id)?15:10;
      return <g key={n.id} data-bone={n.id}>
       <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#0a1831" strokeWidth={width+5} strokeLinecap="round"/>
       <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={width} strokeLinecap="round" opacity=".9"/>
      </g>;
    })}
    <path d={'M'+world.neck_base.x+' '+world.neck_base.y+' Q'+world.neck_tip.x+' '+world.neck_tip.y+' '+head.x+' '+head.y}
      stroke="#ffd76a" strokeWidth="20" strokeLinecap="round" fill="none" opacity=".22"/>
    <g transform={'matrix('+head.matrix[0]+' '+head.matrix[1]+' '+head.matrix[2]+' '+head.matrix[3]+' '+head.matrix[4]+' '+head.matrix[5]+')'}>
      <ellipse cx="0" cy="-34" rx="43" ry="54" fill="#ffd36e" opacity=".16" stroke="#ffdf81" strokeWidth="3"/>
      <circle cx="-18" cy="-41" r="4" fill="#ffe8ae"/><circle cx="18" cy="-41" r="4" fill="#ffe8ae"/>
      <path d="M-12 -15 Q0 -5 12 -15" stroke="#ffe8ae" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </g>
    {rig.joints.filter(n=>!(n.id==='root_motion')).map(n=>{
      const a=world[n.id];
      const radius=isFinger(n.id)?2.5:/neck|head_root|pelvis|chest/.test(n.id)?7:4.5;
      return <g key={'joint-'+n.id} data-joint={n.id}>
        <circle cx={a.x} cy={a.y} r={radius+2} fill="#0a1831"/>
        <circle cx={a.x} cy={a.y} r={radius} fill={jointColor(n.id)} stroke="#f6fdff" strokeWidth=".8"/>
      </g>;
    })}
   </g>
   {(['pelvis','chest','neck_base','neck_tip','head_root'] as const).map((id,i)=>{
      const w=world[id];const dx=id==='neck_tip'?25:35;
      return <g key={id} fontWeight="700" fontSize="14" fill="#fff">
       <line x1={w.x+8} y1={w.y} x2={w.x+dx} y2={w.y-6} stroke="#ffeaac" opacity=".7"/>
       <text x={w.x+dx+4} y={w.y-10}>{id.replace('_',' ').toUpperCase()}</text>
      </g>;
   })}
   <rect x="22" y="28" width="496" height="132" rx="20" fill="#081932" fillOpacity=".9"/>
   <text x="42" y="66" fontSize="19" fontWeight="bold" fill="#91e6d6" letterSpacing="2">SPRINT 02 · ESQUELETO R1</text>
   <text x="42" y="122" fontSize="35" fontWeight="bold" fill="#fff">{control.title}</text>
   <text x="42" y="145" fontSize="16" fill="#d5eafb">77 articulações · pescoço separado da cabeça</text>
   <rect x="22" y="833" width="496" height="99" rx="18" fill="#081932" fillOpacity=".92"/>
   <text x="42" y="870" fontSize="19" fontWeight="bold" fill="#fff">
     {['Quadril move a coluna e o tórax.','Cabeça se ajusta, pescoço permanece ligado.',
       'Punhos e dedos seguem os braços.','Articulações retornam à posição neutra.'][control.section]}
   </text>
   <text x="42" y="905" fontSize="17" fill="#9bdaef">Quadro {frame+1}/{TOTAL_FRAMES} · {(frame/FPS).toFixed(1)}s</text>
   <rect x="22" y="943" width="496" height="7" rx="4" fill="#265373"/>
   <rect x="22" y="943" width={496*(frame+1)/TOTAL_FRAMES} height="7" rx="4" fill="#ffe18b"/>
  </svg>
 </AbsoluteFill>;
};
