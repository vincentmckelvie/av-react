
import './App.css'
import React, { useState, useRef, useEffect, useMemo } from "react";

import { Canvas } from "@react-three/fiber" 
import { Experience } from './components/Experience'

import * as Tone from 'tone';

const  FFT = new Tone.FFT()
FFT.smoothing = .8;
//navigator.requestMIDIAccess().then(requestMIDIAccessSuccess);

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [input, setInput] = useState(null)
  const [synth, setSynth] = useState(null)

  useEffect(() => {
    // Initialize Tone.js components
    const newSynth = new Tone.Synth().toDestination()
    newSynth.volume.value = -100;
    setSynth(newSynth)

    return () => {
      // Clean up Tone.js components
      newSynth.dispose()
    }
  }, [])

  useEffect(() => {
    // Initialize Tone.js components
    const newInput = new Tone.UserMedia().toDestination()
    setInput(newInput)
    
    return () => {
      // Clean up Tone.js components
      //newInput.dispose()
    }
  }, [])

  const handlePlay = () => {
    setIsPlaying(true);
    synth.triggerAttackRelease('C4', '8n')
    input.open();  
    input.connect(FFT);
  }
 

  return (  
    <>
    {!isPlaying ?
      <div className='init-holder'>
        <button className='init-center' onClick={handlePlay} >
          Initiate
        </button>
      </div>
      :
      <div className='kill-holder'></div>
    }
    <Canvas >
      <color attach="background" args={["#101010"]} />
      <Experience fft = {FFT}/>
    </Canvas>
    </>
  )
}

export default App

/*
 <button onClick={openInput}>
        Open Input
    </button>
*/