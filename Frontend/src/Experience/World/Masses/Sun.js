import * as THREE from 'three';
import Experience from "../../Experience.js";

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default class Sun {
    constructor(mass, radius) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.renderer = this.experience.renderer
        this.camera = this.experience.camera

        this.mass = mass;
        this.radius = radius;

        
        this.GCONSTANT = 1e-6;

        this.initInstance()
    }

    initInstance() {
        /*
        const renderScene = new RenderPass(this.scene, this.camera);
        const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0.4,
            0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 2;
        bloomPass.radius = 0;
        const bloomComposer = new EffectComposer(this.renderer);
        bloomComposer.setSize(window.innerWidth, window.innerHeight);
        bloomComposer.renderToScreen = true;
        bloomComposer.addPass(renderScene);
        bloomComposer.addPass(bloomPass);

        */
        this.instance = new THREE.Mesh(
            new THREE.SphereBufferGeometry(this.radius, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );

        this.scene.add(this.instance);
    }

    constrain(val, min, max) {
        return val > max ? max : val < min ? min : val;
    }

    applyGravity(planet) {
        let distanceApart = this.instance.position.distanceTo(planet.instance.position);

        let gravAcc = -this.GCONSTANT * this.mass / this.constrain(Math.pow(distanceApart, 2), 0.1, 10);

        let angleXZ = Math.atan2(planet.instance.position.z - this.instance.position.z, planet.instance.position.x - this.instance.position.x);
        let angleYZ = Math.atan2(planet.instance.position.y - this.instance.position.y, planet.instance.position.z - this.instance.position.z);

        planet.setAcceleration(new THREE.Vector3(gravAcc * Math.cos(angleXZ), gravAcc * Math.sin(angleYZ), gravAcc * Math.sin(angleXZ)));
    }
}