import * as THREE from 'three';
import gsap from "gsap"
import * as dat from 'dat.gui';

import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';


let container, camera, scene, renderer, controls

const gui = new dat.GUI();



function init() {

    // const container = document.createElement('div');
    // container.className = "three-container"
    // document.body.appendChild(container);

    container = document.querySelector('#threejs')

    console.log(container.offsetWidth )
    console.log(container.offsetHeight )




    // CAMERA
    camera = new THREE.PerspectiveCamera(30, container.offsetWidth / container.offsetHeight, 0.25, 20);
    camera.position.set(-2.5, 0.4, 0);

    // SCENE
    scene = new THREE.Scene();
    
    scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444)); //helper


    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.75;
    controls.maxDistance = 5;

    // controls.enablePan = false
    // controls.enableZoom = false
    
    // controls.minPolarAngle = Math.PI * 0.25 // fix vertical rotation
    // controls.maxPolarAngle = Math.PI * 0.75 // fix vertical rotation

    controls.enableDamping = true
    controls.dampingFactor = 0.025

    // controls.target.set( 0, 0, - 0.2 );
    // controls.autoRotate = true
    // controls.autoRotateSpeed = 1

    controls.update();

}

function animate() {
    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.offsetWidth, container.offsetHeight);
}
window.addEventListener('resize', onWindowResize);



init();
animate();
