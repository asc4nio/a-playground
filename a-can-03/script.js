import * as THREE from 'three';
import gsap from "gsap"
import * as dat from 'dat.gui';

import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from '../lib/three.js/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from '../lib/three.js/examples/jsm/loaders//RGBELoader.js';

let camera, scene, renderer, controls
let canObj
const raycaster = new THREE.Raycaster();

const gui = new dat.GUI();


const triggers = [{
    position: new THREE.Vector3(0, 0.4, 0.1),
    element: document.querySelector('#trigger-01'),
    cameraPosition: new THREE.Vector3(-1.5, 1, 0),
}, {
    position: new THREE.Vector3(0, 0, -0.24),
    element: document.querySelector('#trigger-02'),
    cameraPosition: new THREE.Vector3(-3, 0.4, 0),
}]



function init() {

    const container = document.createElement('div');
    container.className = "three-container"
    document.body.appendChild(container);

    container.addEventListener("click", (event) => {
        let allTriggers = document.querySelectorAll('.trigger')
        allTriggers.forEach((element) => {
            element.classList.remove('is--open')
        });
    })

    // CAMERA
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(-2.5, 0.4, 0);
    // camera.lookAt(0, 0, 0);


    // SCENE
    scene = new THREE.Scene();


    // ENVIRONMENT
    const hdri = new RGBELoader()
        .setPath('asset/')
        .load('hdri02.hdr', function (texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            // scene.background = texture;
            scene.environment = texture;

            scene.backgroundIntensity = 0.2
            // scene.backgroundBlurriness = 0.4
        });

    // MODEL
    const loader = new GLTFLoader().setPath('asset/');

    loader.load('can03.glb', function (gltf) {

        canObj = gltf.scene.children[0]

        canObj.scale.set(0.16, 0.16, 0.16);
        canObj.position.set(0, -0.45, 0);

        canObj.children[0].visible = false


        scene.add(canObj);

        setGui()

    });




    // const directionalLight = new THREE.DirectionalLight(0xFff, 0.1);
    // scene.add(directionalLight);


    const pointLight1 = new THREE.PointLight(0xff00ff, 1, 100, 0.5);
    pointLight1.position.set(0, 0.4, -2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0000ff, 1, 100, 0.5);
    pointLight2.position.set(0, 0.4, 2);
    scene.add(pointLight2);


    // helper
    // scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444));


    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0); // the default
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.33;
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

    for (const trigger of triggers) {
        const screenPosition = trigger.position.clone()
        screenPosition.project(camera)

        const translateX = screenPosition.x * innerWidth * 0.5
        const translateY = screenPosition.y * innerHeight * -0.5

        trigger.element.style.transform = `translate( ${translateX}px, ${translateY}px)`

        raycaster.setFromCamera(screenPosition, camera)
        const intersects = raycaster.intersectObjects(scene.children)


        if (intersects.length === 0) {
            trigger.element.classList.add('is--visible')
        } else {
            trigger.element.classList.remove('is--visible')
        }

    }

    renderer.render(scene, camera);

    requestAnimationFrame(animate);

}

function setGui() {
    // let donutMesh = canObj.children[2].children[0]
    // const materialParams = {
    //     donutColor: donutMesh.material.color.getHex()
    // }
    // let capAlt = canObj.children[0]
    // let cap = canObj.children[1]
    // gui.addColor(materialParams,'donutColor').onChange((value)=>donutMesh.material.color.set(value)).name('donut color')
    // gui.add(canObj.rotation,'y',0,Math.PI*2,0.1).name('rotation')
    // gui.add(cap,'visible').name('cap')
    // gui.add(capAlt,'visible').name('capAlt')

    for (const trigger of triggers) {
        trigger.element.addEventListener("click", (event) => {
            event.stopPropagation();
    
            let allTriggers = document.querySelectorAll('.trigger')
            allTriggers.forEach((element) => {
                element.classList.remove('is--open')
            });
    
            trigger.element.classList.add('is--open')
    
            gsap.to(camera.position, {
                x: trigger.cameraPosition.x,
                y: trigger.cameraPosition.y,
                z: trigger.cameraPosition.z,
                duration: 1.6,
                ease: 'Power2.easeInOut'
            })
        })
    }


    let slider = document.querySelector('#rotation-slider') // rotation
    slider.addEventListener("input", function () {
        this.setAttribute('value', this.value);
        canObj.rotation.y = this.value
    })

    let colorTriggers = document.querySelectorAll('.color-trigger')
    for (let trigger of colorTriggers) {
        trigger.addEventListener("click", (event) => {
            let nextColor = trigger.attributes.threecolor.value
            canObj.children[2].children[0].material.color.setHex(nextColor)
        })
    }

    let capTriggers = document.querySelectorAll('.cap-trigger')
    for (let trigger of capTriggers) {
        trigger.addEventListener("click", (event) => {
            let capAlt = canObj.children[0]
            let cap = canObj.children[1]

            switch (trigger.attributes.threeobj.value) {
                case 'noCap':
                    cap.visible = false
                    capAlt.visible = false
                    break;
                case 'cap':
                    cap.visible = true
                    capAlt.visible = false
                    break;
                case 'capAlt':
                    cap.visible = false
                    capAlt.visible = true
                    break;
                default:
                    break;
            }
        })
    }

    function changeColor() {

    }
}







window.addEventListener('resize', onWindowResize);


init();
animate();
