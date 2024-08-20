
import {Uniform} from "three"
import { Effect } from 'postprocessing'

const fragmentShader = `
uniform float frequency;
uniform float amplitude;
uniform float offset;

void mainUv(inout vec2 uv){
    uv.y += sin(uv.x * frequency + offset)*amplitude;
}
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(inputColor);
}
`

// Effect implementation
export default class TestEffectShader extends Effect {
  constructor({ frequency, amplitude }) {
    super('TestEffectShader', fragmentShader, {
      uniforms: new Map([
            ['frequency', new Uniform(frequency)],
            ['amplitude', new Uniform(amplitude)],
        
            ['offset', new Uniform(0)]
        ]),
    })
    
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('offset').value += deltaTime;
  }

}
