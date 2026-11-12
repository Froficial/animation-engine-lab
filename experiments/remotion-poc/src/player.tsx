import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {RigProof} from './RigProof';
import {SkeletonProof} from './SkeletonProof';
import {demoDocument} from '../../../packages/animation-contract/demo.mjs';

function App(){
  const [which,setWhich]=React.useState<'skeleton'|'character'>('skeleton');
  const View=which==='skeleton'?SkeletonProof:RigProof;
  return <main style={{fontFamily:'system-ui',color:'#fff',background:'#091b30',minHeight:'100vh',padding:24}}>
    <h1>Animation Studio AI — Sprint 02 (experimento isolado)</h1>
    <p>O mesmo componente React/SVG usado para a prévia e o MP4. A composição R1 mostra a conexão entre cabeça, pescoço, tronco e membros.</p>
    <div role="group" aria-label="Selecione a demonstração" style={{display:'flex',gap:12,justifyContent:'center',marginBottom:18}}>
      <button type="button" onClick={()=>setWhich('skeleton')} aria-pressed={which==='skeleton'} style={{padding:'10px 16px',cursor:'pointer'}}>Esqueleto R1</button>
      <button type="button" onClick={()=>setWhich('character')} aria-pressed={which==='character'} style={{padding:'10px 16px',cursor:'pointer'}}>Personagem anterior</button>
    </div>
    <div style={{maxWidth:360,margin:'0 auto',boxShadow:'0 12px 35px #0008'}}>
      <Player key={which} component={View} compositionWidth={demoDocument.width}
        compositionHeight={demoDocument.height} durationInFrames={demoDocument.totalFrames}
        fps={demoDocument.fps} controls autoPlay loop style={{width:'100%'}}/>
    </div>
    <p>Use os controles para pausar e avançar. Este experimento não altera o gerador ou a Biblioteca atuais.</p>
  </main>;
}
createRoot(document.getElementById('root')!).render(<App/>);
