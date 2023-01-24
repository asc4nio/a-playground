import * as THREE from 'three';
import gsap from "gsap"
import * as dat from 'dat.gui';

import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';


let container, camera, scene, renderer, controls

const gui = new dat.GUI();

const _VS = `
varying vec3 v_Normal;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_Normal = normal;
}
`;

const _FS = `
varying vec3 v_Normal;

void main() {
    gl_FragColor = vec4(v_Normal, 1.0);
}
`



function init() {

    container = document.querySelector('#threejs')

    // CAMERA
    camera = new THREE.PerspectiveCamera(30, container.offsetWidth / container.offsetHeight, 0.25, 20);
    camera.position.set(-2.5, 0.4, 0);

    // SCENE
    scene = new THREE.Scene();

    // scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444)); //helper
    scene.add(new THREE.AxesHelper(2)); //helper



    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // renderer.shadowMap.type = THREE.BasicShadowMap
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.75;
    controls.maxDistance = 5;
    controls.update();


    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            // time: { value: 1.0 }
        },
        vertexShader: _VS,
        fragmentShader: _FS,
        // wireframe: false
    })


    const object = new THREE.Mesh(
        new THREE.SphereGeometry(1, 8,8),
        shaderMaterial
    )
    object.scale.set(0.25,0.25,0.25)
    object.position.set(0,0.25,0)
    object.castShadow= true
    object.receiveShadow = true
    scene.add(object);


    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10,10,10),
        new THREE.MeshToonMaterial({color:'#444'})
        // new THREE.MeshStandardMaterial({color:'#444'})
    )
    ground.rotation.set(-Math.PI/2, 0, 0)
    ground.castShadow=false
    ground.receiveShadow=true
    scene.add(ground);


    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)


    const directionalLight = new THREE.DirectionalLight('#ffffff',2);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.mapSize.set(1024,1024)
    directionalLight.position.set(-4, 4, 4);
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);

    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
    scene.add(directionalLightHelper);


}

function animate() {
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
