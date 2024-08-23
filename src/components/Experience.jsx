
import React, { useState, useRef, useEffect, useMemo } from "react";
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'
import {
    CameraControls,
    Environment,
    PerspectiveCamera,
    useFBO,
    useGLTF,
  } from "@react-three/drei";

import { MathUtils, Group } from "three";
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
import {Look1} from "./Look1"
import {Look2} from "./Look2"
import {Look3} from "./Look3"
import {LookHolder} from "./LookHolder"


export const Experience = ({ fft }) => {
    
    const [initedScenes, setInitedScenes] = useState(false);
    const [curr1, setCurr1] = useState(0);
    const [curr2, setCurr2] = useState(1);
    
    const looksArr = [Look1,Look2,Look3];
    
    const transitionTimer = useRef(0);
    const transitionVal = useRef(0);
    const sceneIndex = useRef(1);
    const scene1 = useRef();
    const scene2 = useRef();
    

    useFrame(( state, delta ) => {
        
        if(scene1.current != null && scene2.current != null){
            transitionTimer.current += delta;  
            //after 10 seconds transition
            if( transitionTimer.current > 2 ){
                transitionTimer.current = 0;
                const toVal = transitionVal.current == 0 ? 1 : 0;
                gsap.to(transitionVal, { current: toVal, duration: .5, onComplete:function(){ 
                    
                    sceneIndex.current += 1;
                    sceneIndex.current = sceneIndex.current % looksArr.length;
                    
                    if(transitionVal.current == 1){
                        setCurr1(sceneIndex.current);
                    }else{
                        setCurr2(sceneIndex.current); 
                    }
                    
                }});
            
            }
        }
       

    //     looksArr.map(obj=>{
    //         const shouldRender = obj.scene.current == scene1.current || obj.scene.current == scene2.current;
    //         return{
    //             ...obj,
    //             rendering:shouldRender
    //         }
    //     });

           
    })

    useEffect(() => {
        setInitedScenes(true);
    }, [scene1.current, scene2.current]);
    
    // useEffect(() => {
    //     setCurr1(looksArr[lk1.current]);
    // }, [lk1.current]);
    
    // useEffect(() => {
    //     setCurr2(looksArr[lk2.current]);
    // }, [lk2.current]);

    function Post() {
        //if (scene1.current != null && scene2.current != null) {
        if(initedScenes){
            return <CustomEffects scene1={scene2} scene2={scene1} transitionValue={transitionVal} />;
        }
        return;
    }

    
    return(
    <>
        {Post()}
        
        <OrbitControls autoRotate={true}/>

       <LookHolder Look={looksArr[curr1]} fft={fft} scene={scene1} key={0} />
       <LookHolder Look={looksArr[curr2]} fft={fft} scene={scene2} key={1} />
      
    </>
    )
}
