
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

export const LookHolder = ({ fft, scene, Look }) => {
    
    return(
    <> 
        <group ref={scene} >
            <Look fft={fft} scene={scene} />
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