/**
 * Afterimage shader
 * I created this effect inspired by a demo on codepen:
 * https://codepen.io/brunoimbrizi/pen/MoRJaN?page=1&
 */

const CustomAfterimageShader = {

	name: 'CustomAfterimageShader',

	uniforms: {

		'damp': { value: 0.96 },
		'tOld': { value: null },
		'tNew': { value: null },
		'time': {value :0},
        'rippleSize' : {value:1.84},
        'rippleSpeed' : {value:.45},
        'rippleIntensity' : {value:.1},
        'rippleSpec' : {value:2.401},
        'complexity' : {value:.2},
        'contrast' : {value:.2},
        'diffAmt' : {value:40}
	
	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`
		float hash12(vec2 p)
		{
			vec3 p3  = fract(vec3(p.xyx) * .1031);
			p3 += dot(p3, p3.yzx + 19.19);
			return fract((p3.x + p3.y) * p3.z);
		}
		
		vec2 hash22(vec2 p)
		{
			vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
			p3 += dot(p3, p3.yzx+19.19);
			return fract((p3.xx+p3.yz)*p3.zy);
		}
		uniform float damp;

		uniform sampler2D tOld;
		uniform sampler2D tNew;

		uniform float time;
        uniform float rippleSize;
        uniform float rippleSpeed;
        uniform float rippleIntensity;
        uniform float rippleSpec;
        uniform float complexity;
        uniform float contrast;
        uniform float diffAmt;

		varying vec2 vUv;

		vec4 when_gt( vec4 x, float y ) {
			return max( sign( x - y ), 0.0 );
		}

		void main() {
			float scl = 1.0111;
			scl = 0.99;
			float off = (1.0-scl)*.5;
			//vec4 texelOld = texture2D( tOld, vec2( off+vUv.x*scl, off+vUv.y*scl) );
			vec4 texelOld = texture2D( tOld, vec2( off+vUv.x*scl, off+vUv.y*scl) );
			vec4 texelNew = texture2D( tNew, vUv );

			//vec4 texelOld = texture2D( tOld, vUv );
			//vec4 texelNew = texture2D( tNew, vUv );
			//texelOld *= damp * when_gt( texelOld, 0.1 );
			texelOld *= damp * when_gt( texelOld, 0.1 );
			
			//texelOld /= .8 / when_gt( texelOld,- 0.4 );
			vec3 fb =  (1.0-min(1.0-texelNew.rgb, (1.0 / texelOld.r) / .91025));
			vec3 diffT = texelNew.rgb - texelOld.rgb*.99;
			//gl_FragColor = (1.0-min(1.0-texelNew, (1.0 / texelOld.r) / .91025));
			
			//diffT /= max(texelNew.rgb, texelOld.rgb-fb);
			
			float resolution = rippleSize * exp2( 1.0 );
            vec2 uv = vUv / 1.0 * resolution;
            vec2 p0 = floor(uv);
        
            //vec3 diffT = texture2D(tNew, uv/resolution).rgb;
			vec2 circles = vec2(0.0);
          	
            for (int j = -2; j <= 2; ++j)
            {
                for (int i = -2; i <= 2; ++i)
                {
                    vec2 pi = p0 + vec2(i, j);
                    vec2 hsh = hash22(pi);
                    
                    vec2 p = pi + hash22(hsh);
        
                    float t = fract(0.3 * (time*rippleSpeed) + hash12(hsh));
                    vec2 v = p - uv;
                    float d = length(v) - (float(2.0) + 1.)*t;
        
                    float h = 1e-3;
                    float d1 = d - h;
                    float d2 = d + h;
                    float p1 = sin(complexity*d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);
                    float p2 = sin(complexity*d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);
                    circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * ((contrast - t)*diffT.r) * ((contrast - t)*diffT.r));
                }
            }
            
            circles /= float((2.0*2.0+1.0)*(2.0*2.0+1.0));
        
            float intensity =  (.15 * rippleIntensity)+(diffT.r * diffAmt);
            
            vec3 n = vec3(circles, sqrt(1. - dot(circles, circles))) * (rippleSpec*diffT.r);
            vec3 color = texture2D(tNew, (uv/resolution) - (intensity * n.xy)).rgb + 5.0*pow(clamp(dot(n, normalize(vec3(1., 0.7, .5))), 0., 1.), 6.);
			color += (max(texelNew.rgb, texelOld.rgb)*.9);
			
			gl_FragColor = vec4(color.rgb, 1.);
			//gl_FragColor = max(texelNew, texelOld);

		}`

};

export { CustomAfterimageShader };
//gl_FragColor = max(texelNew, texelOld);