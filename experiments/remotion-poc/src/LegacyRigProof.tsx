import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {demoDocument} from '../../../packages/animation-contract/demo.mjs';
import {poseAtFrame, sceneAtFrame} from '../../../packages/animation-contract/index.mjs';

type Pose = ReturnType<typeof poseAtFrame>;
type Side = 'left' | 'right';

// The shoe is placed in STAGE coordinates. While its leg and hip move,
// the planted shoe remains at a fixed world X/Y location.
const GroundedLeg:React.FC<{pose:Pose;side:Side}> = ({pose,side}) => {
  const isLeft=side==='left';
  const hipX=pose.x+(isLeft?-25:25),hipY=pose.y+pose.bodyY-7;
  const ankleX=isLeft?pose.leftFootX:pose.rightFootX;
  const lift=isLeft?pose.leftFootLift:pose.rightFootLift;
  const ankleY=774-lift+(pose.action==='react'?pose.bodyY:0);
  const kneeX=(hipX+ankleX)/2+(isLeft?-9:9);
  const kneeY=(hipY+ankleY)/2-7;
  return <g data-part={side+'-leg'}>
    <path d={'M'+hipX+' '+hipY+' L'+kneeX+' '+kneeY}
      fill="none" stroke="#334a67" strokeWidth="38" strokeLinecap="round"/>
    <path d={'M'+kneeX+' '+kneeY+' L'+ankleX+' '+ankleY}
      fill="none" stroke="#2b425e" strokeWidth="35" strokeLinecap="round"/>
    <path d={'M'+(hipX-11)+' '+(hipY+23)+' L'+(kneeX-10)+' '+(kneeY-11)}
      fill="none" stroke="#486583" strokeWidth="5" strokeLinecap="round" opacity=".58"/>
    <circle cx={kneeX} cy={kneeY} r="13" fill="#334b67" stroke="#2b425e" strokeWidth="1.2"/>
    <g transform={'translate('+ankleX+' '+ankleY+')'}>
      <path d="M-18 -6 Q-19 -17 -6 -19 L10 -19 Q20 -10 24 0 L35 2 Q43 6 42 17 L-23 17 Q-26 3 -18 -6Z"
        fill="#15afe3" stroke="#0b6a9c" strokeWidth="2"/>
      <path d="M-24 12 L43 12 L43 20 Q4 24 -24 20Z" fill="#f7fbff"/>
      <path d="M0 -10 L18 -8 M-2 -3 L20 -2" stroke="#edffff" strokeWidth="3" strokeLinecap="round"/>
    </g>
  </g>;
};

const Hand:React.FC<{gesture:string}> = ({gesture}) =>
 <g transform="translate(0 52)">
  {gesture==='point' ? <g>
    <path d="M-13 -4 Q-16 -13 -5 -15 L9 -15 Q17 -12 16 -3 L16 11 Q9 17 -3 15 L-13 7Z"
      fill="#f0b990" stroke="#c99170" strokeWidth="2"/>
    <path d="M-3 -4 L-3 25 Q-3 32 3 32 Q10 32 10 25 L10 0"
      fill="#f3c49e" stroke="#c99170" strokeWidth="2"/>
    <path d="M-6 7 L-11 19 M1 8 L-2 22" fill="none" stroke="#dba580" strokeWidth="2"/>
   </g> : gesture==='open' ? <g>
    <rect x="-17" y="-3" width="34" height="30" rx="12" fill="#f3c49e" stroke="#c99170" strokeWidth="2"/>
    {[-13,-4,5,14].map((x,i)=><rect key={i} x={x-3} y="-25" width="7" height={28+(i%2)*4}
       rx="3.5" fill="#f3c49e" stroke="#c99170" strokeWidth="1.3"/>)}
    <path d="M-14 4 Q-29 -3 -25 -12 Q-20 -19 -12 -8" fill="#f3c49e" stroke="#c99170" strokeWidth="2"/>
   </g> : <g>
    <path d="M-14 -3 Q-17 -14 -6 -16 L10 -16 Q17 -10 15 4 L12 22 Q7 31 -6 28 Q-20 22 -14 -3Z"
      fill="#f3c49e" stroke="#c99170" strokeWidth="2"/>
    <path d="M-12 3 L8 3 M-11 11 L7 11" stroke="#dda47c" strokeWidth="1.4" opacity=".7"/>
   </g>}
 </g>;

const Arm:React.FC<{side:Side;upper:number;forearm:number;gesture:string}> = ({side,upper,forearm,gesture}) => {
 const sign=side==='left'?-1:1;
 return <g data-part={side+'-arm'} transform={'translate('+(sign*47)+' -150) rotate('+upper+')'}>
  <path d="M-19 12 Q-20 -5 -7 -7 L9 -7 Q22 -2 18 17 L15 45 Q0 58 -15 44Z"
    fill="#287ad8" stroke="#17518e" strokeWidth="2.4"/>
  <path d="M-14 42 Q0 49 14 42 L13 77 Q11 90 0 90 Q-12 90 -13 77Z"
    fill="#edb68d"/>
  <circle cx="0" cy="81" r="13.5" fill="#f1bd96"/>
  <g transform={'translate(0 81) rotate('+forearm+')'}>
   <rect x="-13" y="-4" width="26" height="56" rx="12" fill="#f3c49e" stroke="#d9a17c" strokeWidth="1.5"/>
   <Hand gesture={gesture}/>
  </g>
 </g>;
};

const Head:React.FC<{pose:Pose}> = ({pose}) =>
 <g transform={'translate(0 -197) rotate('+pose.headAngle+')'}>
  <rect x="-15" y="-3" width="30" height="35" rx="12" fill="#e9b389"/>
  <ellipse cx="0" cy="-36" rx="56" ry="67" fill="#f1c19a" stroke="#cb9477" strokeWidth="2"/>
  <ellipse cx="-55" cy="-33" rx="9" ry="15" fill="#eab28c"/>
  <ellipse cx="55" cy="-33" rx="9" ry="15" fill="#eab28c"/>
  <path d="M-53 -61 Q-58 -94 -28 -106 Q-7 -123 18 -114 Q51 -113 55 -82 L53 -52
     Q40 -67 35 -82 Q8 -74 -17 -85 Q-35 -76 -53 -61Z"
    fill="#624336" stroke="#483022" strokeWidth="2"/>
  <path d="M-46 -80 Q-25 -119 -5 -100 Q3 -124 31 -104 Q42 -104 46 -92"
    fill="none" stroke="#8a6250" strokeWidth="8" strokeLinecap="round" opacity=".65"/>
  <path d={'M-31 '+(-58-pose.browRaise)+' Q-18 '+(-64-pose.browRaise)+' -8 '+(-58-pose.browRaise)}
    stroke="#533729" strokeWidth="4" strokeLinecap="round" fill="none"/>
  <path d={'M12 '+(-58-pose.browRaise)+' Q25 '+(-64-pose.browRaise)+' 36 '+(-58-pose.browRaise)}
    stroke="#533729" strokeWidth="4" strokeLinecap="round" fill="none"/>
  {[-19,21].map((cx,i)=><g key={cx}>
    <ellipse cx={cx} cy="-38" rx="10" ry={Math.max(1,11*pose.eyeScale*pose.eyeOpen)} fill="white"/>
    {pose.eyeOpen>.25&&<g>
      <circle cx={cx+pose.pupilX} cy="-36" r="5" fill="#22324c"/>
      <circle cx={cx+pose.pupilX+1.4} cy="-38" r="1.9" fill="white"/>
    </g>}
  </g>)}
  <path d="M1 -34 Q-2 -19 5 -18" stroke="#ce8d71" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
  <path d="M-18 0 Q0 14 18 -1" stroke="#914c4e" strokeWidth="4" fill="none"
    strokeLinecap="round" opacity={1-pose.mouthOpen}/>
  <ellipse cx="1" cy="0" rx={12+3*pose.mouthOpen} ry={Math.max(.01,18*pose.mouthOpen)}
    fill="#793147" opacity={pose.mouthOpen}/>
  <ellipse cx="1" cy={5*pose.mouthOpen} rx="8" ry={Math.max(.01,5*pose.mouthOpen)}
    fill="#fc929d" opacity={pose.mouthOpen}/>
  <ellipse cx="-33" cy="-5" rx="12" ry="6" fill="#ef977f" opacity=".3"/>
  <ellipse cx="33" cy="-5" rx="12" ry="6" fill="#ef977f" opacity=".3"/>
 </g>;

const RigCharacter:React.FC<{pose:Pose}> = ({pose}) =>
 <g data-character-id="nico">
  <ellipse cx={pose.x} cy="795" rx={76+5*(1-pose.bodyY/36)} ry="11" fill="#041b34"
    opacity={Math.max(.07,.27+pose.bodyY/180)}/>
  <GroundedLeg pose={pose} side="left"/>
  <GroundedLeg pose={pose} side="right"/>
  <g transform={'translate('+pose.x+' '+(pose.y+pose.bodyY)+')'}>
   <g transform={'rotate('+pose.torsoAngle+' 0 -80)'}>
    <Arm side="left" upper={pose.leftUpperArm} forearm={pose.leftForearm} gesture={pose.leftHand}/>
    <path d="M-50 -154 Q-39 -170 -22 -168 L22 -168 Q39 -170 50 -154
     L48 -18 Q35 -5 -35 -5 L-49 -18Z"
      fill="url(#shirt)" stroke="#174e8d" strokeWidth="3"/>
    <path d="M-32 -165 Q0 -143 31 -165" fill="none" stroke="#145293" strokeWidth="5"/>
    <path d="M-47 -90 Q-30 -79 -18 -82" fill="none" stroke="#65b6ed" strokeWidth="3" opacity=".3"/>
    <path d="M-46 -24 Q0 -15 45 -24 L44 0 Q0 10 -43 0Z" fill="#1e3957"/>
    <Head pose={pose}/>
    <Arm side="right" upper={pose.rightUpperArm} forearm={pose.rightForearm} gesture={pose.rightHand}/>
   </g>
  </g>
 </g>;

export const LegacyRigProof:React.FC=()=>{
 const frame=useCurrentFrame();
 const {scene}=sceneAtFrame(demoDocument,frame);
 const pose=poseAtFrame(demoDocument,frame);
 const index=demoDocument.scenes.indexOf(scene)+1;
 const second=(frame/demoDocument.fps).toFixed(1);
 return <AbsoluteFill style={{backgroundColor:'#081b37',fontFamily:'Arial, Helvetica, sans-serif'}}>
  <svg viewBox="0 0 540 960" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
   <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
     <stop stopColor="#12324f"/><stop offset=".55" stopColor="#186383"/><stop offset="1" stopColor="#54a6a3"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#0b3e57"/><stop offset="1" stopColor="#061d33"/></linearGradient>
    <linearGradient id="shirt" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#4aa3e8"/><stop offset="1" stopColor="#1664b3"/></linearGradient>
    <radialGradient id="orb"><stop stopColor="#fffbc4"/><stop offset=".55" stopColor="#ffcf62"/><stop offset="1" stopColor="#ffb443" stopOpacity=".1"/></radialGradient>
   </defs>
   <rect width="540" height="960" fill="url(#bg)"/>
   <circle cx="448" cy="196" r="133" fill="#d0f6ff" opacity=".07"/>
   <circle cx="52" cy="470" r="95" fill="#c6ffff" opacity=".06"/>
   <path d="M0 792 Q280 778 540 792 V960 H0Z" fill="url(#floor)"/>
   <g transform={'translate(270 510) scale('+pose.cameraZoom+') translate(-270 -510)'}>
    <path d="M25 793 L515 793" stroke="#b9e5e9" strokeWidth="2" opacity=".23" strokeDasharray="9 13"/>
    <g opacity={pose.spotlight}>
     <circle cx="445" cy="519" r="87" fill="url(#orb)" opacity=".7"/>
     <circle cx="445" cy="519" r="42" fill="#f7c65c" stroke="#fff2b1" strokeWidth="4"/>
     <path d="M430 519 h30 m-15 -15 v30" stroke="#fff3d5" strokeWidth="8" strokeLinecap="round"/>
    </g>
    <RigCharacter pose={pose}/>
   </g>
   <rect x="25" y="30" width="490" height="116" rx="26" fill="#091b36" opacity=".87"/>
   <text x="48" y="68" fontSize="19" fontWeight="bold" fill="#b6eaf9" letterSpacing="3">ANIMATION STUDIO • RIG V2.1</text>
   <text x="48" y="121" fontSize="49" fontWeight="900" fill="white">{scene.heading}</text>
   <rect x="25" y="155" width="120" height="45" rx="20" fill="#ffe087"/>
   <text x="85" y="184" fill="#153a52" textAnchor="middle" fontWeight="bold" fontSize="22">{index}/4</text>
   <text x="510" y="185" textAnchor="end" fontWeight="bold" fill="#d4f7f8" fontSize="20">{second}s / 15s</text>
   <rect x="27" y="832" width="486" height="92" rx="24" fill="#071c38" opacity=".86"/>
   <text x="270" y="867" textAnchor="middle" fill="white" fontWeight="bold" fontSize="23">{scene.subtitle}</text>
   <text x="270" y="895" textAnchor="middle" fill="#aee4f3" fontWeight="bold" fontSize="18">
    {scene.action==='wave'?'PRÓXIMO: ANIMAÇÃO DE CENAS':'Movimento calculado por quadro'}
   </text>
   <rect x="27" y="937" width="486" height="8" rx="4" fill="#305e76"/>
   <rect x="27" y="937" width={Math.max(1,486*(frame+1)/450)} height="8" rx="4" fill="#ffe188"/>
   <circle cx={27+486*(frame+1)/450} cy="941" r="5" fill="white"/>
  </svg>
 </AbsoluteFill>;
};

