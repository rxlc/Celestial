import * as THREE from 'three';
import Experience from "../Experience";

import axios from 'axios';

import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

import gsap from 'gsap';

import Helper from './Helpers';

import Sun from './Masses/Sun';
import Planet from './Masses/Planet';

import { MeshLine, MeshLineMaterial } from 'three.meshline';

export default class World {
    constructor() {
        this.experience = new Experience();
        //this.helper = new Helper();

        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera;

        this.canvasReady = false;
        this.velocityHelper = null;

        this.planets = [];

        this.currentId = 0;

        this.updatePlanetsEvent = new CustomEvent('updatePlanets')

        this.initialize();

        this.keepTargetT = null;
        this.keepTargetB = false;
    }

    initialize() {
        this.initSkyBox();
        this.initTransform();

        this.sun = new Sun(1000, 0.1);
        this.initLight();

        //this.sendMsg();
    }

    initLight() {
        this.light = new THREE.PointLight(0xffffff, 1.5);
        this.light.position.set(0,0,0);
        this.scene.add(this.light);
        this.scene.add(new THREE.AmbientLight(0xbbbbbb, 0.2));
    }

    sendMsg() {
        const sentence = 'Hello';

        axios.get('/openai', {
        params: {
            sentence: sentence
        }
        })
        .then(response => {
            console.log(response.data);
            // Handle the response data
        })
        .catch(error => {
            console.error(error);
            // Handle the error
        });
    }

    initTransform() {
        this.transformControls = new TransformControls(this.experience.camera.instance, this.experience.containerRef.current);
        this.transformControls.setSize(1)

        this.transformControls.addEventListener('mouseDown', () => {
            this.experience.camera.controls.enabled = false;
        });
        
        this.transformControls.addEventListener('mouseUp', () => {
            this.experience.camera.controls.enabled = true;
        });

        this.transformControls.enabled = false;
        this.scene.add(this.transformControls)
    }

    preparePlanetPos() {
        this.currentPlanet = new Planet();
    
        this.transformControls.enabled = true;
        this.transformControls.attach(this.currentPlanet.instance)

        this.focus(this.currentPlanet.instance, 8)
    }

    preparePlanetAt() {
        if (this.currentPlanet) {
            this.transformControls.enabled = false;
            this.camera.controls.autoRotate = true;
            this.transformControls.detach(this.currentPlanet.instance)

            this.focus(this.currentPlanet.instance, 2)
        }
    }

    updateVelocityLine() {
        const endpoints = [this.currentPlanet.instance.position.x, this.currentPlanet.instance.position.y, this.currentPlanet.instance.position.z, this.velocityHelper.position.x, this.velocityHelper.position.y, this.velocityHelper.position.z]
        this.velocityLine.geometry.setPoints(endpoints);
    }

    preparePlanetVel() {
        if (this.currentPlanet) {
            this.transformControls.setSize(0.5)
            this.transformControls.enabled = true;
            this.camera.controls.autoRotate = false;

            this.focus(this.currentPlanet.instance, 5)
        
            this.velocityHelper = new THREE.Mesh();
            this.scene.add(this.velocityHelper)
            this.velocityHelper.position.copy(this.currentPlanet.instance.position);
            this.velocityHelper.position.x += 0.2;

            this.transformControls.enabled = true;
            this.transformControls.attach(this.velocityHelper);

            const pathGeom = new MeshLine();
            const endpoints = [this.currentPlanet.instance.position.x, this.currentPlanet.instance.position.y, this.currentPlanet.instance.position.z, this.velocityHelper.position.x, this.velocityHelper.position.y, this.velocityHelper.position.z]
            pathGeom.setPoints(endpoints);

            const material = new MeshLineMaterial({lineWidth: 0.01, color: 0xE7622F});

            this.velocityLine = new THREE.Mesh(pathGeom, material);
            this.scene.add(this.velocityLine);
        }
    }

    createPlanet() {
        if (this.currentPlanet) {
            this.transformControls.enabled = false;

            let vel = this.velocityHelper.position.clone().sub(this.currentPlanet.instance.position);
            vel.multiplyScalar(0.05);

            this.currentPlanet.initInstance(vel, this.currentId++);

            this.planets.push(this.currentPlanet);

            document.dispatchEvent(this.updatePlanetsEvent);

            this.focusOrigin();

            this.transformControls.detach(this.velocityHelper);
            this.scene.remove(this.velocityHelper);
            this.scene.remove(this.velocityLine);
            this.velocityHelper = null;
            this.velocityLine = null;
            this.currentPlanet = null;
        }
    }

    focusOrigin() {
        this.focus(this.sun.instance, 16)
    }

    initSkyBox() {
        const envMapTexture = new THREE.CubeTextureLoader().load([
            'textures/skybox/right.png', 'textures/skybox/left.png',
            'textures/skybox/top.png', 'textures/skybox/bottom.png',
            'textures/skybox/front.png', 'textures/skybox/back.png'
        ]);

        this.scene.background = envMapTexture

    }

    update() {
        if (this.experience.instance && this.canvasReady == false) {
            this.canvasReady = true
        }

        for (let i=0; i<this.planets.length; i++) {
            this.sun.applyGravity(this.planets[i]);
            this.planets[i].update();

            if (this.planets[i].instance.position.distanceTo(this.sun.instance.position) < 0.08) {
                this.scene.remove(this.planets[i].instance);
                this.scene.remove(this.planets[i].path)
                this.planets.splice(i, 1);
                i--;
                document.dispatchEvent(this.updatePlanetsEvent);
            }
        }

        if (this.velocityHelper) {
            this.updateVelocityLine();
        }

        if (this.keepTargetB) {
            this.focus(this.keepTargetT, 4)
        }
    }

    keepTarget(planet) {
        if (this.keepTargetB) {
            this.focusOrigin();
        } else {
            this.keepTargetT = planet;
        }   

        this.keepTargetB = !this.keepTargetB;
    }

    focus(targetInstance, offsetInput) {
        let def = this;

        let aabb = new THREE.Box3().setFromObject(targetInstance);
        let center = aabb.getCenter(new THREE.Vector3());
        let size = aabb.getSize(new THREE.Vector3());
        let camPosition = this.camera.instance.position.clone();
        let targPosition = targetInstance.position.clone();
        let distance = camPosition.sub(targPosition);
        let direction = distance.normalize();

        let offset;
        let offsetY;

        offset = distance.clone().sub(direction.multiplyScalar(offsetInput));  
        offsetY = offsetInput/3

        let newPos = targetInstance.position.clone().sub(offset);
        newPos.y = this.camera.instance.position.y;

        let rotDuration = 1;

        let pl = gsap.timeline();

        pl.to(this.camera.instance.position, {
            duration: rotDuration,
            ease: "power4.out",
            x: newPos.x,
            y: center.y + offsetY,
            z: newPos.z,
            onUpdate: function() {
                def.camera.controls.update();
            },
        },0);

        pl.to(this.camera.controls.target, {
            duration: rotDuration,
            x: center.x,
            y: center.y,
            z: center.z,
            ease: "power4.out",
            onUpdate: function() {
                def.camera.controls.update();
            },
        },0);

        pl.play(0);
    }
}