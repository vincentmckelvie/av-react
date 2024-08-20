import { MotionPathControls } from '@react-three/drei';
import { 
    Object3D,
	SphereGeometry,
	MeshStandardMaterial,
    MeshBasicMaterial,
    BoxGeometry,
	Mesh,
	Vector3,
	Quaternion,
	Sphere,
	IcosahedronGeometry
 } from 'three';
 import gsap from 'gsap';
 import { useGSAP } from '@gsap/react';
 import { CustomEase } from "gsap/CustomEase";
 gsap.registerPlugin(CustomEase);
 gsap.registerPlugin(useGSAP);
 

//import { Particle } from './Particle.js';

const percGeo = new IcosahedronGeometry( .4, 1);
const percMat = new MeshBasicMaterial({color:0xffffff});
const percMesh = new Mesh(percGeo, percMat);

class Particle{

	constructor(OBJ, EMIT){

		const self = this;
		this.scene = OBJ.scene;
		
		this.mesh = percMesh.clone();
        const clone = this.mesh.material.clone();   
        this.mesh.material = clone;
		this.mesh.visible = false;
		this.killed = false;
	    
        this.inc = 0;
		this.fftIndex = Math.floor(Math.random()*1000);
		this.scene.add(this.mesh);
		
		this.fftFnl = 0;
        this.speed = 10+Math.random()*10;
		self.init(OBJ, EMIT);    
		
	}	

	init(OBJ, EMIT) {

		const self = this;
        
		this.mesh.material.color.setHSL(EMIT.hue,1,.5);

        this.startPos = new Vector3().set(-.5+Math.random(), -.5+Math.random(), -.5+Math.random() ).multiplyScalar(.1);
        this.toPos = new Vector3().set(-.5+Math.random(), -.5+Math.random(), -.5+Math.random() ).multiplyScalar(5);

		this.mesh.position.copy(this.startPos);
        
		this.mesh.visible = true;
		
		const pos = {val:0};
		const dur = .5+Math.random()*.4;
		gsap.to(pos, { val: 1, duration: dur, ease: "power1.out",
			onUpdate:function(){ 
				const fnlPos = new Vector3().lerpVectors(self.startPos, self.toPos, pos.val);
				self.mesh.position.copy(fnlPos);
			},
			onComplete:function(){ 
				self.hide();
			}
		});

		const scl = {val:0};
		gsap.to(scl, { val: 1, duration: dur, ease: CustomEase.create("custom", "M0,0 C0.122,0.063 0.018,0.957 0.171,0.981 0.377,0.981 0.544,0.322 1,0 "),
			onUpdate:function(){ 
				const s = scl.val;
				self.mesh.scale.set(s,s,s);
			}
		});

	}

	
  
	update(OBJ){
        
      

	}

	kill(){
		this.killed = true;
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
		this.scene.remove(this.mesh);
	}

	hide(){
		this.mesh.visible = false;
		if(this.tween)this.tween.stop();
	}
}


export { Particle };




class ParticleEmitter {
	//{aliveTime:aliveTime, bullet:bullet};
	constructor(OBJ) {

		this.arrFull = false;
		this.index = 0;
		this.arr = [];
		this.max = OBJ.max;
		this.obj;
		this.particleClass = OBJ.particleClass;
		
		this.limitInc = 0;
		this.shouldEmit = false;
		this.limit = 20;
		this.emitInc = 0;
		this.canEmit = true;
		this.special = {};
		this.freq = OBJ.freq == null ? .01 : OBJ.freq;
		//this.obj = {spline}
	    //this.mesh = MESH;

	}
	
	update(OBJ){
        
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].update(OBJ);	
		}

		this.emitInc += OBJ.delta;
        
		if(this.shouldEmit){
            if(this.canEmit){
                this.canEmit = false;
				this.special.index = this.index;
                this.emit(this.special);
            }
            if(this.emitInc > this.freq){  
                this.canEmit = true;
                this.emitInc = 0;
            }
        }
    
	}

	toggleEmit(SHOULDEMIT, OBJ){
		this.shouldEmit = SHOULDEMIT;
		if(this.shouldEmit){
			this.special = OBJ; 
		}
	}

	emit(EMIT){

        if(this.arrFull){
			this.arr[this.index].hide();	
		}
		
		if(this.arr.length<=this.index){
			this.arr[this.index] = new this.particleClass(this.obj, EMIT);
		}else{
			this.arr[this.index].init(this.obj, EMIT);
		}

		this.index++;

		if(this.index == this.max){
			this.index = 0;
			this.arrFull = true;	
		}
	}

	hideParticles(){
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].mesh.visible = false;	
		}
	}

	showParticles(){
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].mesh.visible = true;	
		}
	}


	kill(){
		for(let i = 0; i < this.arr.length; i++){
			this.arr[i].kill();	
		}
		this.arr = [];
        this.index=0;
        this.arrFull = false;	
	}

}

export { ParticleEmitter };

