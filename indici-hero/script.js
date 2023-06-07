/**
 * https://jsfiddle.net/f486o0sn/4/
 * https://www.shadertoy.com/view/MscSDf
 * https://www.shadertoy.com/view/4dBSRK
 * https://www.shadertoy.com/view/wstGz4
 */

import * as THREE from 'three';
// import gsap from "gsap"
import * as dat from 'dat.gui';

// import VertexShader from './shader/vertex.glsl'
// import FragmentShader from './shader/fragment.glsl'

import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';

// import { EffectComposer } from '../lib/three.js/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from '../lib/three.js/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from '../lib/three.js/examples/jsm/postprocessing/ShaderPass.js';

let container, camera, scene, renderer, controls, clock
const gui = new dat.GUI();
let contRatio


let shaderMaterial

var isMobile = false;
var antialias = true;
const isOrbitControl = true


const planeAspectRatio = 1
const fov = 35

const params = {
    camYpos: 1.75
};


let bgTextureURL = './asset/bg.jpg';

let icons = []
let iconsTextures = [
    './asset/icon-01.png',
    './asset/icon-02.png',
    './asset/icon-03.png',
    './asset/icon-04.png',
    './asset/icon-05.png',
]
let iconsMaterials = []
class Icon {
    constructor(i) {
        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.mesh = new THREE.Mesh(this.geometry, iconsMaterials[i]);

        this.pivot = new THREE.Group();

        this.rotation = (Math.PI / iconsTextures.length) * i

        this.mesh.position.set(-2, 0, 0)
        this.mesh.rotation.z = this.rotation

        this.pivot.add(this.mesh);
        this.pivot.rotation.z = -this.rotation

        this.rotationSpeed = 0.001

        scene.add(this.pivot);
    }
    rotate() {
        this.rotation = this.rotation + this.rotationSpeed

        let maxRot = Math.PI

        let xRepos = Math.sin(this.rotation) - 3

        this.mesh.position.set(xRepos, 0, 0)

        this.mesh.rotation.z = this.rotation
        this.pivot.rotation.z = -this.rotation

        if (this.rotation > maxRot) {
            this.rotation = 0
        }
    }

}


let decos = []
let decoTextureURL = './asset/deco.png';
const decoQuantity = 4;
let decoMaterial
class Deco {
    constructor() {
        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.material = decoMaterial;
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane.position.z = Math.random() * -3 -0.5
        this.plane.position.x = (Math.random() - 0.5) * 4
        this.plane.position.y = 1 - (Math.random() - 0.5) * 4
        this.plane.scale.set(0.75, 0.75, 1)

        this.direction = Math.round(Math.random())
        this.inverseDirection = false

        scene.add(this.plane);
    }
    animate() {
        this.speed = this.direction > 0 ? 0.001 : -0.001


        if (this.plane.position.x > 3) {
            this.plane.position.x = 2.9
            // console.log('out')
            this.inverseDirection = !this.inverseDirection
        } else if  (this.plane.position.x < -3) {
            this.plane.position.x = -2.9
            this.inverseDirection = !this.inverseDirection
        }


         if(!this.inverseDirection){
            this.speed = this.speed*-1
        } 


        this.plane.position.x += this.speed
    }
}


function init() {
    clock = new THREE.Clock()
    const loader = new THREE.TextureLoader();

    var n = navigator.userAgent;
    if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) { isMobile = true; antialias = false; }
    console.log('isMobile', isMobile)

    container = document.querySelector('#threejs')
    console.log(container.offsetWidth, container.offsetHeight)
    contRatio = container.offsetWidth / container.offsetHeight

    // CAMERA
    camera = new THREE.PerspectiveCamera(fov, container.offsetWidth / container.offsetHeight, 0.25, 50);
    camera.position.set(0, params.camYpos, 5);
    fitCamera(camera, container.offsetWidth, container.offsetHeight);

    // SCENE
    scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444)); //helper

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: antialias });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    // renderer.setClearColor(0xff00ff, 1);

    container.appendChild(renderer.domElement);


    if (isOrbitControl) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 0.75;
        controls.maxDistance = 10;

        // controls.enablePan = false
        // controls.enableZoom = false

        // controls.minPolarAngle = Math.PI * 0.25 // fix vertical rotation
        // controls.maxPolarAngle = Math.PI * 0.75 // fix vertical rotation

        controls.enableDamping = true
        controls.dampingFactor = 0.025

        controls.target = new THREE.Vector3(0, 5, 0);
        controls.target.set(camera.position.x, camera.position.y, 0);

        controls.update();
    }


    let bgTexture = loader.load(bgTextureURL);

    shaderMaterial = new THREE.RawShaderMaterial({
        vertexShader: `
            uniform mat4 projectionMatrix;
            uniform mat4 viewMatrix;
            uniform mat4 modelMatrix;

            attribute vec3 position;
            attribute vec2 uv;

            varying vec2 vUv;


            void main()
            {
                //gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;

                gl_Position = projectedPosition;

                vUv = uv;

            }
            `,
        fragmentShader: `
            precision mediump float;

            //uniform float uTime;
            uniform vec3 colorA;

            uniform sampler2D uTexture;

            varying vec2 vUv;


            void main()
            {
                //vec4 textureColor = texture2D(uTexture, vUv);
                
                //gl_FragColor = textureColor;
                //gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);

                vec3 colorRed = vec3(0.725,0.016,0.42);
                vec3 colorBlue = vec3(0.506,0.012,0.89);


                float gridWidth = 0.9;
                float gridSize = 20.0;
                float grid = step(gridWidth, mod(vUv.y*gridSize, 1.0));
                grid += step(gridWidth, mod(vUv.x*gridSize, 1.0));

                grid = clamp(grid, 0.0, 1.0);

                vec2 wavedUv = vec2(vUv.x, vUv.y + sin(vUv.x*5.0)*0.1);


                // float bgGradient = vUv.y;

                float bgGradient = sin(wavedUv.y*10.0) +1.0 /2.0;

                vec3 mixedColors = mix(colorRed, colorBlue, bgGradient);

                vec3 result = mixedColors + grid*0.5 ;


                gl_FragColor = vec4(result, 1.0);


            }
        
            `,
        uniforms: {
            uTime: { value: 0 },
            uTexture: { value: bgTexture },
            colorB: { value: new THREE.Color(0x0000FF) },
            colorA: { value: new THREE.Color(0xFF00FF) }

        }
    })

    let bgSize = 20
    const bgGeometry = new THREE.PlaneGeometry(bgSize, bgSize);
    const bgPlane = new THREE.Mesh(bgGeometry, shaderMaterial);
    bgPlane.position.set(0, camera.position.y, -20)
    scene.add(bgPlane);



    // const bgHelper = new THREE.GridHelper(5, 2, 0x888888, 0x444444)
    // bgHelper.position.set(0, camera.position.y, -5)
    // bgHelper.rotation.x = Math.PI / 2
    // scene.add(bgHelper);



    // init objects
    for (let i = 0; i < iconsTextures.length; i++) {

        loader.load(
            // resource URL
            iconsTextures[i],
            // onLoad callback
            function (texture) {
                // in this example we create the material when the texture is loaded
                iconsMaterials[i] = new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                });
                icons[i] = new Icon(i)
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            function (err) {
                console.error('An error happened.');
            }
        );


    }


    const decoTexture = loader.load(
        // resource URL
        decoTextureURL,
        // onLoad callback
        function (texture) {
            // in this example we create the material when the texture is loaded
            decoMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
            });

            for (let i = 0; i < decoQuantity; i++) {
                decos[i] = new Deco
            }
        },
        // onProgress callback currently not supported
        undefined,
        // onError callback
        function (err) {
            console.error('An error happened.');
        }
    );





    // gui
    gui.add(params, 'camYpos', 0, 1.75, 0.0001);
    gui.open();


    //     const composer = new EffectComposer(renderer);
    //     composer.addPass(new RenderPass(scene, camera));

    //     const pass = new ShaderPass(drawShader);
    //     pass.renderToScreen = true;
    //     composer.addPass(pass);

}




function animate() {
    if (isOrbitControl) {
        controls.update();
        controls.target.y = camera.position.y
    }

    const elapsedTime = clock.getElapsedTime()
    shaderMaterial.uniforms.uTime = elapsedTime
    // console.log(shaderMaterial.uniforms.uTime)


    renderer.render(scene, camera);


    for (let icon of icons) {
        icon.rotate()
    }
    for (let deco of decos) {
        deco.animate()
    }

    //gui update
    camera.position.y = params.camYpos

    requestAnimationFrame(animate);

}

function fitCamera(camera, contWidth, contHeight) {
    console.log('fitCamera')
    camera.aspect = contWidth / contHeight;

    if (camera.aspect > planeAspectRatio) {
        // window too large
        const cameraHeight = Math.tan(THREE.MathUtils.degToRad(fov / 2));
        const ratio = camera.aspect / planeAspectRatio;
        const newCameraHeight = cameraHeight / ratio;
        camera.fov = THREE.MathUtils.radToDeg(Math.atan(newCameraHeight)) * 2;
    } else {
        // window too narrow
        camera.fov = fov;
    }
    camera.updateProjectionMatrix();
};

function onWindowResize() {
    // camera.aspect = container.offsetWidth / container.offsetHeight;
    // camera.updateProjectionMatrix();

    fitCamera(camera, container.offsetWidth, container.offsetHeight);

    renderer.setSize(container.offsetWidth, container.offsetHeight);
}
window.addEventListener('resize', onWindowResize);


init();
animate();
