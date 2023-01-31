import * as THREE from 'three';
import gsap from "gsap"

import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../lib/three.js/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../lib/three.js/examples/jsm/loaders//RGBELoader.js';

let camera, scene, renderer, controls
const raycaster = new THREE.Raycaster();

let loadedModel


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

    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 2, 10);
    // camera.lookAt(0, 5, 0);

    scene = new THREE.Scene();

    // scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444)); // helper

    const baseCylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1, 0.1, 32*3), 
        new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(0xffffff),

            attenuationColor : new THREE.Color(0xffffff),
            attenuationDistance: Infinity,
            clearcoat: 0.0,
            clearcoatMap: null, //texture
            clearcoatNormalMap: null, //texture
            clearcoatNormalScale: new THREE.Vector2(1,1),
            clearcoatRoughness: 0.0,
            clearcoatRoughnessMap: null, //texture
            defines: {}, //used by the WebGLRenderer for selecting shaders This models the reflectivity of non-metallic materials. It has no effect when metalness is 1.0
            ior: 1.5,
            reflectivity: 1, // from 0.0 to 1.0
            sheen: 0.0,
            sheenRoughness: 1.0,
            sheenRoughnessMap: null, //texture
            sheenColor : new THREE.Color(0xffffff),
            sheenColorMap: null,
            specularIntensity: 0.0,
            specularIntensityMap: null,
            specularColor:new THREE.Color(0xffffff),
            specularColorMap: null,
            thickness: 0,
            thicknessMap: null,
            transmission: 0.0,
            transmissionMap: null,
        })
    )
    baseCylinder.position.y=-0.05
    scene.add(baseCylinder);


    const hdri = new RGBELoader().load(
        "asset/hdri01.hdr",
        function (texture) {
            console.log("HDRI LOADED");
            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.environment = texture;
            scene.background = texture;

            scene.backgroundIntensity = 0.1 // only visual 'codio
            // scene.backgroundBlurriness = 0.4
        },
        function (xhr) {
            // called while loading is progressing
            console.log("... loading HDRI");
        },
        function (error) {
            // called when loading has errors
            console.log("ERROR loading hdri");
        }
    );


    const loader = new GLTFLoader().load(
        "asset/new_female_body.glb",
        function (gltf) {
            console.log("MODEL LOADED");
            // gltf.scene.scale.set(0.2, 0.2, 0.2);
            // gltf.scene.position.set(0, 0, 0);

            loadedModel = gltf
            console.log('loadedmodel:', loadedModel)

            scene.add(loadedModel.scene);
            console.log('scene:', scene)
        },
        function (xhr) {
            // called while loading is progressing
            console.log("... loading MODEL");
        },
        function (error) {
            // called when loading has errors
            console.log("ERROR loading model");
        }
    );

    const directionalLight = new THREE.DirectionalLight(0xFF0000, 0.1);
    directionalLight.position.set(1,5,0)
    const directionalLighthelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
    scene.add(directionalLight);
    scene.add( directionalLighthelper )

    // const pointLight1 = new THREE.PointLight( 0xff00ff, 1, 100, 0.5 );
    // pointLight1.position.set( 0, 0.4, -2 );
    // scene.add( pointLight1 );

    // const pointLight2 = new THREE.PointLight( 0x0000ff, 1, 100, 0.5 );
    // pointLight2.position.set( 0, 0.4, 2 );
    // scene.add( pointLight2 );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(0x111111, 0); // the default
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true
    controls.dampingFactor = 0.025
    controls.enablePan = true
    controls.enableZoom = true
    // controls.minDistance = 0.75;
    // controls.maxDistance = 5;
    // controls.minPolarAngle = Math.PI * 0.25 // fix vertical rotation
    // controls.maxPolarAngle = Math.PI * 0.75
    controls.target.set(0, 1.5, 0);
    // controls.autoRotate = true
    // controls.autoRotateSpeed = 1


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
