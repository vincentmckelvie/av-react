
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import {
    CameraControls,
    Environment,
    PerspectiveCamera,
    useFBO,
    useGLTF,
  } from "@react-three/drei";

import { MathUtils } from "three";
import { DEG2RAD } from "three/src/math/MathUtils";

import { OrbitControls, ContactShadows } from "@react-three/drei"
import TestEffect from './TestEffect'
import { useFrame } from '@react-three/fiber'
import { Pixelation } from "./Pixelation";
import CustomEffects from "./CustomEffects";
import TestEffectShader from "./TestEffectShader";
import Particles from './Particles'
import Sparks from './Sparks'
import {Particle, ParticleEmitter} from './ParticleEmitter'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);

//const emitter = new ParticleEmitter({max:500, particleClass:Particle});

export const Look3 = ({ fft, scene }) => {
    const myMesh = useRef();
    const smooth = useRef();
    
    useFrame(( state,delta ) => {
        
      
        //gsap.to(transitionVal, { current: toVal, duration: .5 });
         

        const audioVal = ( 90 + (fft.getValue()[20]) ) * .1 ;
        const max = audioVal < .2 ? .2 : audioVal;
        
        smooth.current+=(max-smooth.current)*.05;
        myMesh.current.scale.x = max;


       
        // emitter.obj = {scene:scene, TWEEN:TWEEN}; 
        // //console.log(max)
        // if(max>3.5){

        //     const hue = .2+Math.random()*.3;
        //     const amt = 10+Math.floor(Math.random()*20);
        //     for(let i = 0; i<amt; i++){
        //         emitter.emit({hue:hue});
        //     }
        // }else{

        // }
        
        // emitter.update({delta:clock.getDelta()})
        
        
        //console.log(a) // the value will be 0 at scene initialization and grow each frame
        //console.log(tone)
    })

  

    return(
    <> 
        <group ref={scene}>
            <hemisphereLight color="white" groundColor="grey" intensity={0.75} />
            <spotLight position={[10 , 10, 2]} angle={2.25} penumbra={1} intensity={100} />
            <mesh position-x={0} ref={myMesh}>
                <cylinderGeometry args={[1 ,1, .5, 20]} />
                <meshStandardMaterial color="green" />
            </mesh>
        </group>
        
    </>
    )
}

/*
<Particles count={1000} mouse={mouse} />
<mesh ref={myMesh} scale={[ 1 , 1, 1]}>
            <boxGeometry/>
            <meshStandardMaterial />
        </mesh>

 <Particles count={10000} mouse={mouse} />

        

<!--<Sparks count={20} mouse={mouse} colors={['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue']} />
        
 <EffectComposer>
          
          <TestEffect amplitude={.2} frequency={.1} />
           
        </EffectComposer>

<Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
<Noise opacity={0.2} />
<Pixelation granularity={20}/>

<TestEffect param={.5} />
<Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />
<Noise opacity={0.2} />
<Vignette eskil={false} offset={0.1} darkness={1.1} />
*/