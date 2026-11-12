import React from 'react';
import {Composition} from 'remotion';
import {RigProof} from './RigProof';
import {SkeletonProof} from './SkeletonProof';
import {demoDocument} from '../../../packages/animation-contract/demo.mjs';
export const Root: React.FC = () => (<>
  <Composition id="RigProof" component={RigProof} fps={demoDocument.fps}
    width={demoDocument.width} height={demoDocument.height}
    durationInFrames={demoDocument.totalFrames} />
  <Composition id="SkeletonProof" component={SkeletonProof} fps={demoDocument.fps}
    width={demoDocument.width} height={demoDocument.height}
    durationInFrames={demoDocument.totalFrames} />
</>);
