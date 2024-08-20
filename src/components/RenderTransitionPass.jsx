import {
	HalfFloatType,
	ShaderMaterial,
	WebGLRenderTarget
} from 'three';

import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
class RenderTransitionPass extends Pass {

	constructor( sceneA, cameraA, sceneB, cameraB ) {
	//constructor( scenes, camera ) {

		super();
	
		this.material = this.createMaterial();
		this.fsQuad = new FullScreenQuad( this.material );
		//this.scenesAll = scenes;
		this.sceneA = sceneA;
		this.cameraA = cameraA;
		this.sceneB = sceneB;
		this.cameraB = cameraB;
		this.curr = 0;

		this.renderTargetA = new WebGLRenderTarget();
		this.renderTargetA.texture.type = HalfFloatType;
		this.renderTargetB = new WebGLRenderTarget();
		this.renderTargetB.texture.type = HalfFloatType;

	}

	setTransition( value ) {

		this.material.uniforms.mixRatio.value = value;

	}

	useTexture( value ) {

		this.material.uniforms.useTexture.value = value ? 1 : 0;

	}

	setTexture( value ) {

		this.material.uniforms.tMixTexture.value = value;

	}

	setTextureThreshold( value ) {
		this.material.uniforms.threshold.value = value;
	}

	setScenes(sceneA, sceneB){
		this.sceneA = sceneA;
		this.sceneB = sceneB;
	}
	
	setSize( width, height ) {

		this.renderTargetA.setSize( width, height );
		this.renderTargetB.setSize( width, height );

	}

	render( renderer, writeBuffer ) {
		if(this.cameraA != null && this.cameraB != null){
		renderer.setRenderTarget( this.renderTargetA );
		renderer.render( this.sceneA, this.cameraA );
		renderer.setRenderTarget( this.renderTargetB );
		renderer.render( this.sceneB, this.cameraB );

		const uniforms = this.fsQuad.material.uniforms;
		uniforms.tDiffuse1.value = this.renderTargetA.texture;
		uniforms.tDiffuse2.value = this.renderTargetB.texture;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			renderer.clear();

		} else {

			renderer.setRenderTarget( writeBuffer );
			if ( this.clear ) renderer.clear();

		}

		this.fsQuad.render( renderer );
		}

	}

	dispose() {

		this.renderTargetA.dispose();
		this.renderTargetB.dispose();
		this.material.dispose();
		this.fsQuad.dispose();

	}

	createMaterial() {

		return new ShaderMaterial( {
			uniforms: {
				tDiffuse1: {
					value: null
				},
				tDiffuse2: {
					value: null
				},
				mixRatio: {
					value: 0.0
				},
				threshold: {
					value: 0.1
				},
				useTexture: {
					value: 1
				},
				tMixTexture: {
					value: null
				}
			},
			vertexShader: /* glsl */`
				varying vec2 vUv;

				void main() {

					vUv = vec2( uv.x, uv.y );
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,
			fragmentShader: /* glsl */`
				uniform float mixRatio;

				uniform sampler2D tDiffuse1;
				uniform sampler2D tDiffuse2;
				uniform sampler2D tMixTexture;

				uniform int useTexture;
				uniform float threshold;

				varying vec2 vUv;

				void main() {

					vec4 texel1 = texture2D( tDiffuse1, vUv );
					vec4 texel2 = texture2D( tDiffuse2, vUv );

					if (useTexture == 1) {

						vec4 transitionTexel = texture2D( tMixTexture, vUv );
						float r = mixRatio * ( 1.0 + threshold * 2.0 ) - threshold;
						float mixf = clamp( ( transitionTexel.r - r ) * ( 1.0 / threshold ), 0.0, 1.0 );

						gl_FragColor = mix( texel1, texel2, mixf );

					} else {

						gl_FragColor = mix( texel2, texel1, mixRatio );

					}

				}
			`
		} );

	}

}

export { RenderTransitionPass };
