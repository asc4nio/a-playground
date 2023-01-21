import * as THREE from 'three';

import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../three.js/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../three.js/examples/jsm/loaders//RGBELoader.js';

let camera, scene, renderer, controls
const raycaster = new THREE.Raycaster();

const triggers = [{
    position: new THREE.Vector3(0,0.4,0.1),
    element: document.querySelector('#trigger-01')
},{
    position: new THREE.Vector3(0,0,-0.25),
    element: document.querySelector('#trigger-02')
}]



function init() {

    const container = document.createElement('div');
    container.className = "three-container"
    document.body.appendChild(container);

    // CAMERA
    camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 0.25, 20 );
    camera.position.set( -2, 0.5, 0 );
    // camera.lookAt(0, 0, 0);


    // SCENE
    scene = new THREE.Scene();

    new RGBELoader()
    .setPath( 'asset/' )
    .load( 'hdri01.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;

        // model
        const loader = new GLTFLoader().setPath( 'asset/' );
        loader.load( 'can01.glb', function ( gltf ) {
            gltf.scene.scale.set(0.01, 0.01, 0.01); 
            gltf.scene.position.set(0,-0.45,0); 

            scene.add( gltf.scene );
        } );

    } );

    // helper
    // scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444));


    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 0.75;
    controls.maxDistance = 5;
    
    // controls.enablePan = false
    // controls.enableZoom = false

    // fix vertical rotation
    controls.minPolarAngle = Math.PI*0.25
    controls.maxPolarAngle = Math.PI*0.75

    controls.enableDamping = true
    controls.dampingFactor = 0.025

    // controls.target.set( 0, 0, - 0.2 );
    controls.update();

    // triggers = [{
    //     position: new THREE.Vector3(0,0.4,0.1),
    //     element: document.querySelector('#trigger-01')
    // },{
    //     position: new THREE.Vector3(0,0,-0.15),
    //     element: document.querySelector('#trigger-02')
    // }]

    // raycaster = new Raycaster()
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    controls.update();


    // group.rotation.y = performance.now() / 3000;

    for(const trigger of triggers){
        const screenPosition = trigger.position.clone()
        screenPosition.project(camera)

        const translateX = screenPosition.x* innerWidth * 0.5
        const translateY = screenPosition.y* innerHeight * -0.5

        // console.log(trigger.element.style)

        trigger.element.style.transform = `translate( ${translateX}px, ${translateY}px)`

        raycaster.setFromCamera(screenPosition,camera)
        const intersects = raycaster.intersectObjects(scene.children)


        if(intersects.length === 0){
            trigger.element.classList.add('is--visible')
        } else {
            trigger.element.classList.remove('is--visible')
        }

    }

    renderer.render(scene, camera);

    requestAnimationFrame(animate);

}

window.addEventListener('resize', onWindowResize);


init();
animate();
