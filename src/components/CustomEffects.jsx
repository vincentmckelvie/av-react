import { useMemo, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { CustomAfterimagePass } from "./CustomAfterimagePass";

import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { RenderTransitionPass } from './RenderTransitionPass';

const effect1 = new ShaderPass( DotScreenShader );

//const afterimagePass = new CustomAfterimagePass();
//const effect1 = new ShaderPass( DotScreenShader );
//effect1.uniforms[ 'scale' ].value = 4;

export default function CustomEffects({scene1, scene2, transitionValue}) {
  
  const { gl, scene, camera } = useThree();
  const trans = useRef();
  const feedback = useRef();
  
  const composer = useMemo(() => {
    const composer = new EffectComposer(gl);
    //composer.addPass(new RenderPass(scene, camera));
    //afterimagePass.damp = .94;
    const afterimagePass = new CustomAfterimagePass();
    feedback.current = afterimagePass;
    const transition = new RenderTransitionPass(scene1.current, camera, scene2.current, camera);
    trans.current = transition;
    
    composer.addPass( transition );
    composer.addPass( afterimagePass );

    return composer;
  }, []);



  return useFrame((_, delta) => {
    feedback.current.damp = .99;
    
    //tv.current = transitionValue;
    //console.log(tv.current);
    trans.current.setTransition(transitionValue.current);
    trans.current.setScenes(scene1.current, scene2.current);

    composer.render(delta);
  }, 1);
}
