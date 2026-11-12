// Two fixed-length bones. Angles are radians measured from the downward axis.
export function solveLeg(hip, ankle, upperLength, lowerLength, bend = 1) {
  const dx=ankle.x-hip.x, dy=ankle.y-hip.y, distance=Math.hypot(dx,dy);
  if (![hip.x,hip.y,ankle.x,ankle.y,upperLength,lowerLength].every(Number.isFinite)||upperLength<=0||lowerLength<=0||Math.abs(bend)!==1)
    throw Error('IK: invalid input');
  if(distance<1e-6||distance>upperLength+lowerLength+1e-6||distance<Math.abs(upperLength-lowerLength)-1e-6)
    throw Error('IK: unreachable ankle');
  const clamp=n=>Math.max(-1,Math.min(1,n));
  const direction=Math.atan2(-dx,dy);
  const upper=direction-bend*Math.acos(clamp((upperLength**2+distance**2-lowerLength**2)/(2*upperLength*distance)));
  const kneeAngle=bend*(Math.PI-Math.acos(clamp((upperLength**2+lowerLength**2-distance**2)/(2*upperLength*lowerLength))));
  return {upper,kneeAngle,knee:{x:hip.x-Math.sin(upper)*upperLength,y:hip.y+Math.cos(upper)*upperLength}};
}
