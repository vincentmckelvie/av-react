import * as THREE from 'three'
import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'


export default function AVLines({ count, fft }) {
  const mesh = useRef()
  
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      //const t = Math.random() * 100
      //const factor = 20 + Math.random() * 100
      //const speed = 0.01 + Math.random() / 200
      const xPos = -2 + ((i/count) * 4);
      const yPos = 0;//-10 + Math.random() * 20
      const zPos = 0
      temp.push({ x:xPos, y:yPos, z:zPos })
    }
    return temp
  }, [count])
  // The innards of this hook will run every frame
  useFrame((state) => {
        // Makes the light follow the mouse
        //light.current.position.set(mouse.current[0] / aspect, -mouse.current[1] / aspect, 0)
        // Run through the randomized data to calculate some movement
        
        particles.forEach((particle, i) => {
          
            dummy.position.set(particle.x, particle.y, particle.z)
            const index = Math.floor( (i/count) * (fft.getValue().length/4) );
            //console.log(index)
            const audioVal = ( 90 + (fft.getValue()[index]) ) * .1 ;
            const max = audioVal < .1 ? .1 : audioVal;
            dummy.scale.set(1, max, 1);
            
            //dummy.rotation.set(s * 5, s * 5, s * 5)
            dummy.updateMatrix();
            // And apply the matrix to the instanced item
            mesh.current.setMatrixAt(i, dummy.matrix)
        })

        mesh.current.instanceMatrix.needsUpdate = true
  
    })
  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <boxGeometry args={[.1, 1, .1]} />
        <meshBasicMaterial color="red" />
      </instancedMesh>
    </>
  )
}

/*
<pointLight ref={light} distance={40} intensity={8} color="lightblue" />
      
*/