import * as THREE from 'three';
import gsap from "gsap"

import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../lib/three.js/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../lib/three.js/examples/jsm/loaders//RGBELoader.js';

let camera, scene, renderer, controls
const raycaster = new THREE.Raycaster();

// const triggers = [{
//     position: new THREE.Vector3(0, 0.4, 0.1),
//     element: document.querySelector('#trigger-01'),
//     cameraPosition: new THREE.Vector3(-1.5, 1, 0),
// }, {
//     position: new THREE.Vector3(0, 0, -0.24),
//     element: document.querySelector('#trigger-02'),
//     cameraPosition: new THREE.Vector3(-3, 0.4, 0),
// }]



function init() {

    const container = document.createElement('div');
    container.className = "three-container"
    document.body.appendChild(container);

    // CAMERA
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(-2, 0.4, 0);
    // camera.lookAt(0, 0, 0);


    // SCENE
    scene = new THREE.Scene();


    // ENVIRONMENT
    const hdri = new RGBELoader()
    .setPath( 'asset/')
    .load( 'hdri01.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping;


        scene.background = texture;
        scene.environment = texture;

        // scene.lightMapIntensity = 1
        
        scene.backgroundIntensity = 1
        // scene.backgroundBlurriness = 0.4

    } );

    // MODEL
    const loader = new GLTFLoader().setPath('asset/');
    loader.load('can-05.glb', function (gltf) {
        console.log(gltf)

        gltf.scene.scale.set(0.4, 0.4, 0.4);
        gltf.scene.position.set(0, -0.45, 0);

        // gltf.scene.traverse( child => {

        //     if ( child.material ) child.material.metalness = 0;
        
        // } );

        scene.add(gltf.scene);
        // console.log(scene)
    });

    // const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.1 );
    // hemiLight.color.setHSL( 0.6, 1, 0.6 );
    // hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    // hemiLight.position.set( 0, 0, 0 );
    // scene.add( hemiLight );

    // const directionalLight = new THREE.DirectionalLight(0xFff, 0.1);
    // scene.add(directionalLight);


    // const pointLight1 = new THREE.PointLight( 0xff00ff, 1, 100, 0.5 );
    // pointLight1.position.set( 0, 0.4, -2 );
    // scene.add( pointLight1 );

    // const pointLight2 = new THREE.PointLight( 0x0000ff, 1, 100, 0.5 );
    // pointLight2.position.set( 0, 0.4, 2 );
    // scene.add( pointLight2 );


    // helper
    // scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444));


    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor( 0x000000, 0 ); // the default
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.75;
    controls.maxDistance = 5;

    // controls.enablePan = false
    // controls.enableZoom = false

    // fix vertical rotation
    controls.minPolarAngle = Math.PI * 0.25
    controls.maxPolarAngle = Math.PI * 0.75

    controls.enableDamping = true
    controls.dampingFactor = 0.025

    // controls.target.set( 0, 0, - 0.2 );

    // controls.autoRotate = true
    // controls.autoRotateSpeed = 1

    controls.update();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    controls.update();

    // for (const trigger of triggers) {
    //     const screenPosition = trigger.position.clone()
    //     screenPosition.project(camera)

    //     const translateX = screenPosition.x * innerWidth * 0.5
    //     const translateY = screenPosition.y * innerHeight * -0.5

    //     trigger.element.style.transform = `translate( ${translateX}px, ${translateY}px)`

    //     raycaster.setFromCamera(screenPosition, camera)
    //     const intersects = raycaster.intersectObjects(scene.children)


    //     if (intersects.length === 0) {
    //         trigger.element.classList.add('is--visible')
    //     } else {
    //         trigger.element.classList.remove('is--visible')
    //     }

    // }

    renderer.render(scene, camera);

    requestAnimationFrame(animate);

}


// for (const trigger of triggers) {
//     trigger.element.addEventListener("click", (event) => {
//         event.stopPropagation();

//         let allTriggers = document.querySelectorAll('.trigger')
//         allTriggers.forEach((element) => {
//             element.classList.remove('is--open')
//         });

//         trigger.element.classList.add('is--open')

//         gsap.to(camera.position, {
//             x: trigger.cameraPosition.x,
//             y: trigger.cameraPosition.y,
//             z: trigger.cameraPosition.z,
//             duration: 1.6,
//             ease: 'Power2.easeInOut'
//         })

//     }
//     )
// }


window.addEventListener('resize', onWindowResize);


init();
animate();
