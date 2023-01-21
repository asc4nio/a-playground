import * as THREE from 'three';
// import Stats from '../three.js/addons/libs/stats.module.js';

import { OrbitControls } from '../three.js/examples/jsm//controls/OrbitControls.js';
import { OBJLoader } from '../three.js/examples/jsm//loaders/OBJLoader.js';

import Star from './modules/star.js'
import Star2 from './modules/star2.js'
import Fascio from './modules/fascio.js'
import Deco from './modules/deco.js'

import addSkyGradient from './modules/skyGradient.js'

import {backgroundGrid, polarGrid, getRandomArbitrary, getRandomInt, chooseStar} from './modules/utility.js'

// import * as dat from '../../external/dat.gui-master/build/dat.gui.module.js'
// const gui = new dat.GUI()



/////////////////////////////////////////////////////////////////////////////////
//  GLOBAL VARIABLES
/////////////////////////////////////////////////////////////////////////////////

window.starsSpeedIncrement = 1

window.camXMoveRange = 1.25
window.camYMoveRange = 1.25


//  CONTENT
window.starContent = []

starContent[0] = {
    label: 'cerindustria',
    layers: ['images/c01.png', 'images/c02.png', 'images/c03.png'],
    ratio: 1920 / 980,
    text: 'BRANDING'
};
starContent[1] = {
    label: 'orop',
    layers: ['images/d03.png', 'images/d02.png', 'images/d01.png'],
    ratio: 1920 / 1450,
    text: 'INTERACTION'
}



/////////////////////////////////////////////////////////////////////////////////
//  LOCAL TWEAKS
/////////////////////////////////////////////////////////////////////////////////

const starsQuantity = 6

var debugFunctions = {
    isOrbitControl : true,
    isPointerCameraControl : false
}
// gui.add(debugFunctions, 'isPointerCameraControl')


/////////////////////////////////////////////////////////////////////////////////
//  THREE MAIN
/////////////////////////////////////////////////////////////////////////////////

let camera, scene, renderer, stats, pointer, controls
let aModel

let decos = []


// STORAGE
let stars = []
let fasci = []



function init() {
    console.log('init()')

    // VAR INIT

    const container = document.createElement('div');
    document.body.appendChild(container);

    pointer = new THREE.Vector2();
    window.raycaster = new THREE.Raycaster();

    window.normalMaterial = new THREE.MeshNormalMaterial({});


    // CAMERA

    camera = new THREE.PerspectiveCamera(110, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    camera.zoom = 8
    camera.updateProjectionMatrix();


    // SCENE

    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x8E8E8E);
    // scene.fog = new THREE.FogExp2(0x000000, 0.01);

    // addSkyGradient(scene)


    // HELPER

    // stats = new Stats();
    // container.appendChild(stats.dom);

    backgroundGrid(scene)
    // polarGrid(scene)

    if (debugFunctions.isOrbitControl) {
        controls = new OrbitControls(camera, container);
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
    }


    // MATERIALS

    // OBJECTS

    //LOADER

    window.textureLoader = new THREE.TextureLoader();
    window.threeObjLoader = new OBJLoader();


    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // EVENTS

    for (let i = 0; i < starsQuantity; i++) {
        stars[i] = new Star(scene,camera)
        stars[i].set(scene)

        console.log(stars[i])
    }

    for (let i = 0; i < 10; i++) {
        fasci[i] = new Fascio()
        fasci[i].set(scene)
    }


    // decos[0] = new Deco('images/decoObj01.obj')
    // decos[1] = new Deco('images/new-a.obj')
    // decos[2] = new Deco('images/decoObj01.obj')
    // decos[3] = new Deco('images/new-a.obj')


    // for (let deco of decos){
    //     scene.add(deco)
    // }

 



}


/////////////////////////////////////////////////////////////////////////////////
//  LOOP
/////////////////////////////////////////////////////////////////////////////////



function tick() {
    // stats.update();

    if (debugFunctions.isOrbitControl) {
        controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    }


    raycaster.setFromCamera(pointer, camera);

        for (let star of stars) {
        star.update(camera,scene)
    }


    for (let star of stars) {
        star.update(camera,scene)
    }

    for (let fascio of fasci) {
        fascio.update()

        let overlapping = false
        for (let star of stars) {
            if (fascio.intersects(star,camera)) {
                overlapping = true
            }
        }
        if (overlapping) {
            fascio.place()
        }

    }



    for (let deco of decos){
        deco.update()
    }


    renderer.render(scene, camera);
    requestAnimationFrame(tick);
}

function collisionTick() {

    for (let star of stars) {
        let overlapping = false
        for (let other of stars) {
            if (star !== other && star.intersects(other)){
                 overlapping = true
            }
        }
        if (overlapping) {
            console.log('overlapping')
            star.fadeOut()

        } 
        else{
            star.fadeIn()
            starsSpeedIncrement = 1
        }
    }


    setTimeout(() => {
        requestAnimationFrame(collisionTick);
    }, 250);
}





/////////////////////////////////////////////////////////////////////////////////
//  EVENT LISTENERS
/////////////////////////////////////////////////////////////////////////////////

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('pointermove', onPointerMove);
function onPointerMove(event) {

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

    if(debugFunctions.isPointerCameraControl){
        camera.position.x = THREE.MathUtils.lerp(-camXMoveRange, camXMoveRange, event.x / window.innerWidth)
        camera.position.y = THREE.MathUtils.lerp(camYMoveRange, -camYMoveRange, event.y / window.innerHeight)
    }

}

// window.addEventListener('wheel', onMouseWheel)
// function onMouseWheel(event) {
//     let newStarsSpeedIncrement = starsSpeedIncrement + event.deltaY / 500
//     starsSpeedIncrement = THREE.MathUtils.clamp(newStarsSpeedIncrement, 0.0, 2.5)
// }



/////////////////////////////////////////////////////////////////////////////////
//  GESTIONE PAGINA
/////////////////////////////////////////////////////////////////////////////////


init();


// wait until DOM is ready
document.addEventListener("DOMContentLoaded", function (event) {
    console.log('DOMContentLoaded')


    // wait until window is loaded - all images, styles-sheets, fonts, links, and other media assets
    // you could also use addEventListener() instead
    window.onload = function () {
        console.log('window.onload')

        tick();
        collisionTick()

        console.log('tick()')

        // OPTIONAL - waits til next tick render to run code (prevents running in the middle of render tick)
        window.requestAnimationFrame(function () {
            console.log('window.requestAnimationFrame')

            // GSAP custom code goes here     

        });

    };

});
