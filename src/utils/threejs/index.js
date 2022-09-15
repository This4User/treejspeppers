import {fragmentShader, vertexShader} from "./shaders";
import * as THREE from "three";
import {TWEEN} from "three/addons/libs/tween.module.min";
import {gsap} from "gsap";

class BoxScene {

	initGame(targetElement) {
		this.initCanvas(targetElement);
		this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
		this.initCamera(75, this.canvas.width / this.canvas.height, 10, 100);
		this.initScene();
		this.initCustomBox();
		this.initInteraction();
		this.initGSAP();
		this.initOnResize();
	}


	initCanvas(targetElement) {
		this.targetElement = targetElement;
		this.canvas = document.createElement("canvas");
		this.canvas.width = targetElement.clientWidth;
		this.canvas.height = targetElement.clientHeight;
		targetElement.appendChild(this.canvas);
	}

	initInteraction() {
		this.raycaster = new THREE.Raycaster();
		this.pointer = new THREE.Vector2();

		this.canvas.addEventListener("click", this.canvasEvent);
	}

	initGSAP() {
		this.animationsTimeline = gsap.timeline();
		this.animationsTimeline.smoothChildTiming = true;
	}

	canvasEvent = (event) => {
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

		this.raycaster.setFromCamera(this.pointer, this.camera);
		this.intersects = this.raycaster.intersectObjects(this.scene.children);

		if (this.intersects[0] && this.intersects[0].object === this.box) {
			const axis = ["x", "y", "z"][Math.floor(Math.random() * 3)];
			const rotation = {};
			rotation[axis] = Math.random() * Math.PI * 2;
			rotation.duration = 1;

			this.animationsTimeline.to(this.box.rotation, rotation, this.animationsTimeline.time());
		}
	};

	initCamera(fov = 75, aspect = 2, near = 10, far = 100) {
		this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		this.camera.position.z = 30;
	}

	initScene() {
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xAEC09A);
		this.fog = new THREE.Fog(0xAEC09A, 5, 25);
		this.scene.fog = this.fog;
	}

	initOnResize() {
		this.onWindowResize = () => {
			this.canvas.width = this.targetElement.clientWidth;
			this.canvas.height = this.targetElement.clientHeight;
			this.camera.aspect = this.targetElement.clientWidth / this.targetElement.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(this.targetElement.clientWidth, this.targetElement.clientHeight);
		};

		window.addEventListener("resize", this.onWindowResize);
	}

	initCustomBox(boxSize = 15) {
		let uniforms = {
			colorB: {type: "vec3", value: new THREE.Color(0xACB344)},
			colorA: {type: "vec3", value: new THREE.Color(0x244244)},
			time: {type: "float", value: 0},
			fogColor: {type: "vec3", value: this.scene.fog.color},
			fogNear: {type: "float", value: this.scene.fog.near},
			fogFar: {type: "float", value: this.scene.fog.far},
		};

		let geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
		let material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			fragmentShader: fragmentShader(),
			vertexShader: vertexShader(),
			fog: true
		});
		this.box = new THREE.Mesh(geometry, material);

		this.scene.add(this.box);
	}

	destroyScene() {
		this.canvas.removeEventListener("click", this.canvasEvent);
		this.canvas.remove();
		window.removeEventListener("resize", this.onWindowResize);
		cancelAnimationFrame(this.animationId);
		this.scene = null;
		this.camera = null;
		this.box = null;
		this.renderer = null;
	}

	render = (time) => {
		time *= 0.001;

		this.box.material.uniforms.time.value = time * 10;
		this.renderer.render(this.scene, this.camera);
		TWEEN.update();
		this.animationId = requestAnimationFrame(this.render);
	};

	renderScene() {
		this.animationId = requestAnimationFrame(this.render);
	};
}

export const boxScene = new BoxScene();