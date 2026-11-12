import React from 'react';
import {Composition} from 'remotion';
import {RigProof} from './RigProof';
import {LegacyRigProof} from './LegacyRigProof';
import {SkeletonProof} from './SkeletonProof';
import {demoDocument} from '../../../packages/animation-contract/demo.mjs';
export const Root: React.FC = () => (<>
  <Composition id="RigProof" component={RigProof} fps={demoDocument.fps}
    width={demoDocument.width} height={demoDocument.height}
    durationInFrames={demoDocument.totalFrames} />
  <Composition id="SkeletonProof" component={SkeletonProof} fps={demoDocument.fps}
    width={demoDocument.width} height={demoDocument.height}
    durationInFrames={demoDocument.totalFrames} />
  <Composition id="LegacyRigProof" component={LegacyRigProof} fps={30} width={540} height={960} durationInFrames={450} />
</>);

