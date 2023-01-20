

import * as THREE from 'three';

import { OrbitControls } from '../three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../three.js/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../three.js/examples/jsm/loaders//RGBELoader.js';

let camera, scene, renderer;
let group, cubes;

init();
animate();


function init() {

    const container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    // camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    // camera.position.set(0, 0, 5);
    // camera.lookAt(0, 0, 0);
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
    camera.position.set( 0,1,-2 );

    // SCENE

    scene = new THREE.Scene();

    new RGBELoader()
    .setPath( 'asset/' )
    .load( 'hdri01.hdr', function ( texture ) {

        texture.mapping = THREE.EquirectangularReflectionMapping;

        scene.background = texture;
        scene.environment = texture;

        // render();

        // model

        const loader = new GLTFLoader().setPath( 'asset/' );
        loader.load( 'can01.glb', function ( gltf ) {

            // scene.add( gltf.scene );

            gltf.scene.scale.set(0.01, 0.01, 0.01); 
            gltf.scene.position.set(0,-0.45,0); 
        const root = gltf.scene;
        scene.add(root);

            // render();

        } );

    } );

    //

    // group = new THREE.Group();
    // scene.add(group);

    // scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444));

    // const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    // const plane = new THREE.Mesh(geometry, material);

    // plane.position.set(0, 0, 0)

    // scene.add(plane);

    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls( camera, renderer.domElement );
    // controls.addEventListener( 'change', render ); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    // controls.target.set( 0, 0, - 0.2 );
    controls.update();

    // EVENTS

    

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    // group.rotation.y = performance.now() / 3000;

    renderer.render(scene, camera);

    requestAnimationFrame(animate);

}

window.addEventListener('resize', onWindowResize);
