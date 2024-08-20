
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

const emitter = new ParticleEmitter({max:500, particleClass:Particle});

export const Experience = ({ fft }) => {
    const [initedScenes, setInitedScenes] = useState(false);
    const info = [
        {
            look: Look1,
            scene:useRef()
        },
        {
            look: Look2,
            scene:useRef()
        },
        {
            look: Look3,
            scene:useRef()
        },
    ]
    //const looks = useRef([<Look1 fft={fft}/>, <Look2 fft={fft}/>, <Look2 fft={fft}/> ])
    const transitionTimer = useRef(0);
    const transitionVal = useRef(0);
    const sceneIndex = useRef(1);
    const scene1 = useRef();
    const scene2 = useRef();
    
    const looksArr = useMemo(() => {
        const temp = []
        info.forEach((obj, i) => {
            temp.push({ render:<obj.look key={i} fft={fft} scene={obj.scene} />, scene:obj.scene, index:i, rendering:(i==0||i==1) ? true : false})
            //temp.push({ render:<obj.look key={i} fft={fft} scene={obj.scene} />, scene:obj.scene, index:i, rendering:true })
        });
        return temp
    }, [info.length])

    
    useFrame(( state, delta ) => {
        
        if(scene1.current == null){
            scene1.current = looksArr[0].scene.current;
        }
        if(scene2.current == null){
            scene2.current = looksArr[1].scene.current;
        }
        if(scene1.current != null && scene2.current != null){
            transitionTimer.current += delta;  
            //after 10 seconds transition
            if( transitionTimer.current > 10 ){
                transitionTimer.current = 0;
                const toVal = transitionVal.current == 0 ? 1 : 0;
                gsap.to(transitionVal, { current: toVal, duration: .4, onComplete:function(){ 
                    
                    sceneIndex.current += 1;
                    sceneIndex.current = sceneIndex.current % looksArr.length;
                    console.log(sceneIndex.current);
                    
                    if(transitionVal.current == 1){
                        scene1.current = looksArr[sceneIndex.current].scene.current;
                    }else{
                        scene2.current = looksArr[sceneIndex.current].scene.current;
                        //scene2.current = allScenes.current[sceneIndex.current].current; 
                    }

                    looksArr.forEach((obj, i)=> {
                        const shouldRender = obj.scene.current == scene1.current || obj.scene.current == scene2.current;
                        //    if()
                        looksArr[i].rendering = shouldRender;// = {render:obj.render, scene:obj.scene, index:i, rendering:shouldRender}
                        //console.log("should render const = "+shouldRender);
                        //console.log("arr value = "+looksArr[i].rendering);
                    });

                
                }});
            
            }
        }
        
          

            /*
         

        // const audioVal = ( 90 + (fft.getValue()[20]) ) * .1 ;
        // const max = audioVal < .2 ? .2 : audioVal;
        
        //smooth+=(max-smooth)*.05;
       // myMesh.current.scale.x = max;


       /*
        emitter.obj = {scene:scene, TWEEN:TWEEN}; 
        //console.log(max)
        if(max>3.5){

            const hue = .2+Math.random()*.3;
            const amt = 10+Math.floor(Math.random()*20);
            for(let i = 0; i<amt; i++){
                emitter.emit({hue:hue});
            }
        }else{

        }
        
        emitter.update({delta:clock.getDelta()})
        */
        
        //console.log(a) // the value will be 0 at scene initialization and grow each frame
        //console.log(tone)
    })

    useEffect(() => {
        setInitedScenes(true);
    }, [scene1.current, scene2.current]);

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

        {looksArr.map(item => {
            //if(item.rendering)
                return item.render
            //return;
        })}
      
        
        
        
    </>
    )
}

/*


  <group ref={scene1}>
            <hemisphereLight color="white" groundColor="grey" intensity={0.75} />
            <spotLight position={[10 , 10, 2]} angle={2.25} penumbra={1} intensity={100} />
            <mesh position-x={1}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color="red" />
            </mesh>
            
        </group>
        <group ref={scene2}>
            <hemisphereLight color="white" groundColor="grey" intensity={0.75} />
            <spotLight position={[10 , 10, 2]} angle={2.25} penumbra={1} intensity={100} />
            <mesh position-x={-1}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </group>
        





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