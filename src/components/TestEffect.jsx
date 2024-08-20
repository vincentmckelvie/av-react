import React, { forwardRef, useMemo } from 'react'
import TestEffectShader from "./TestEffectShader"
// Effect component
export default forwardRef (function TestEffect(props, ref){
  const effect = new TestEffectShader(props);
  return <primitive ref={ref} object={effect} />
});