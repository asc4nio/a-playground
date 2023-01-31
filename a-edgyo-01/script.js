import * as THREE from 'three';
import gsap from "gsap"

import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../lib/three.js/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../lib/three.js/examples/jsm/loaders//RGBELoader.js';

let camera, scene, renderer, controls, clock
const raycaster = new THREE.Raycaster();

let loadedModel
// let mixer, clips


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

    clock = new THREE.Clock();

    camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.set(0, 1, 7);
    // camera.lookAt(0, 5, 0);

    scene = new THREE.Scene();

    // const baseCylinder = new THREE.Mesh(
    //     new THREE.CylinderGeometry(0.66, 0.66, 0.01, 32 * 3),
    //     new THREE.MeshPhysicalMaterial({
    //         color: new THREE.Color(0xffffff),

    //         attenuationColor: new THREE.Color(0xffffff),
    //         attenuationDistance: Infinity,
    //         clearcoat: 0.0,
    //         clearcoatMap: null, //texture
    //         clearcoatNormalMap: null, //texture
    //         clearcoatNormalScale: new THREE.Vector2(1, 1),
    //         clearcoatRoughness: 0.0,
    //         clearcoatRoughnessMap: null, //texture
    //         defines: {}, //used by the WebGLRenderer for selecting shaders This models the reflectivity of non-metallic materials. It has no effect when metalness is 1.0
    //         ior: 1.5,
    //         reflectivity: 1, // from 0.0 to 1.0
    //         sheen: 0.0,
    //         sheenRoughness: 1.0,
    //         sheenRoughnessMap: null, //texture
    //         sheenColor: new THREE.Color(0xffffff),
    //         sheenColorMap: null,
    //         specularIntensity: 0.0,
    //         specularIntensityMap: null,
    //         specularColor: new THREE.Color(0xffffff),
    //         specularColorMap: null,
    //         thickness: 0,
    //         thicknessMap: null,
    //         transmission: 0.0,
    //         transmissionMap: null,
    //     })
    // )
    // baseCylinder.castShadow= true
    // baseCylinder.receiveShadow = true
    // baseCylinder.position.y = -0.005
    // scene.add(baseCylinder);

    const hdriIntensity = 0.1

    const hdri = new RGBELoader().load(
        "asset/hdri02.hdr",
        function (texture) {
            console.log("HDRI LOADED");
            document.getElementById("info-hdri").innerHTML = "HDRI Loaded";
            texture.mapping = THREE.EquirectangularReflectionMapping;

            scene.environment = texture;
            scene.background = texture;

            scene.backgroundIntensity = hdriIntensity // only visual 'codio
            scene.backgroundBlurriness = 0.5
        },
        function (xhr) {
            // called while loading is progressing
            console.log("... loading HDRI");
            document.getElementById("info-hdri").innerHTML = "... loading HDRI";
        },
        function (error) {
            // called when loading has errors
            console.log("ERROR loading hdri");
            document.getElementById("info-hdri").innerHTML = "ERROR loading hdri";
        }
    );


    const loader = new GLTFLoader().load(
        "asset/model-textured-high.glb",
        function (gltf) {
            console.log("MODEL LOADED");
            document.getElementById("info-model").innerHTML = "MODEL Loaded";

            // gltf.scene.scale.set(0.2, 0.2, 0.2);
            // gltf.scene.position.set(0, 0, 0);

            loadedModel = gltf
            // console.log('loadedmodel:', loadedModel)

            loadedModel.scene.traverse( child => {
                child.castShadow= true
                child.receiveShadow = true
                if ( child.material ){ child.material.envMapIntensity = hdriIntensity}
            } );

            scene.add(loadedModel.scene);
            // console.log('scene:', scene)

            // mixer = new THREE.AnimationMixer(loadedModel.scene)
            // clips = loadedModel.animations

            // console.log(clips[0])

            // const action = mixer.clipAction(clips[0]);
            // action.play();

            // mixer.clipAction(clips[0])


        },
        function (xhr) {
            // called while loading is progressing
            console.log("... loading MODEL");
            document.getElementById("info-model").innerHTML = "... loading MODEL";
        },
        function (error) {
            // called when loading has errors
            console.log("ERROR loading model");
            document.getElementById("info-model").innerHTML = "ERROR loading model";
        }
    );

    const shadowResK = 1024 * 8

    const ambientLight = new THREE.AmbientLight( 0x404040, 0.2 ); // soft white light
    scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight(0x00b8e6, 0.7);
    directionalLight.position.set(-4, 4, -2.5)
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.set(shadowResK,shadowResK)
    directionalLight.shadow.bias = -0.0001
    scene.add(directionalLight);


    const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.8);
    directionalLight2.position.set(4,2, 3)
    directionalLight2.castShadow = true;
    directionalLight2.shadow.mapSize.set(shadowResK,shadowResK)
    directionalLight2.shadow.bias = -0.0001
    scene.add(directionalLight2);



    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setClearColor(0x111111, 0); // the default
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // renderer.shadowMap.type = THREE.VSMShadowMap

    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);


    addControls()

    scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444));


    const visualHelpers = false
    if(visualHelpers){
        const directionalLighthelper = new THREE.DirectionalLightHelper(directionalLight, 5);
        scene.add(directionalLighthelper)
        const directionalLighthelper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
        scene.add(directionalLighthelper2)
    }
    

}

function addControls(){
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true
    controls.dampingFactor = 0.025
    controls.enablePan = true
    controls.enableZoom = true

    // controls.minDistance = 1;
    // controls.maxDistance = 7;

    // controls.minPolarAngle = Math.PI * 0.25 // fix vertical rotation
    // controls.maxPolarAngle = Math.PI * 0.75
    controls.target.set(0, 1, 0);

    // controls.autoRotate = true
    // controls.autoRotateSpeed = -1

    // var minPan = new THREE.Vector3(-0.5, 0, -0.5);
    // var maxPan = new THREE.Vector3(0.5, 2, 0.5);
    // var _v = new THREE.Vector3();
    // controls.addEventListener("change", function () {
    //     console.log('changing')
    //     _v.copy(controls.target);
    //     controls.target.clamp(minPan, maxPan);
    //     _v.sub(controls.target);
    //     camera.position.sub(_v);
    // })
}



function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
    controls.update();


    // if (mixer) mixer.update(clock.getDelta());



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
