/**
 * https://jsfiddle.net/f486o0sn/4/
 * https://www.shadertoy.com/view/MscSDf
 * https://www.shadertoy.com/view/4dBSRK
 * https://www.shadertoy.com/view/wstGz4
 */

import * as THREE from 'three';
import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';
// import { EffectComposer } from '../lib/three.js/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from '../lib/three.js/examples/jsm/postprocessing/RenderPass.js';
// import { ShaderPass } from '../lib/three.js/examples/jsm/postprocessing/ShaderPass.js';

import gsap from "gsap"
import * as dat from 'dat.gui';

window.threeState = {
    iconsMaterialsLoaded: false
}


let container, contRatio, camera, scene, renderer, controls, clock
const gui = new dat.GUI();

var isMobile = false;
var antialias = true;
const isOrbitControl = true


let shaderMaterial

const fitCameraAspectRatio = 1
const fov = 35

let depth = 20


const params = {
    camYpos: 1.75,
    animateCamera: () => { gsap.to(params, { camYpos: 0, duration: 4 }) }
};


let bgPlane


let icons = []
window.iconsMaterials = []
class Icon {
    constructor(i) {
        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.rotation = (Math.PI / iconsMaterials.length) * i
        this.pivot = new THREE.Group();
        this.meshes = []

        this.startOffset= 0.001
        this.meshesZpos = [this.startOffset*0, this.startOffset*1, this.startOffset*2]


        for (let j = 0; j < iconsMaterials[i].length; j++) {
            
            let mesh = new THREE.Mesh(this.geometry, iconsMaterials[i][j]);
            mesh.position.set(-2, 0, this.meshesZpos[j])
            mesh.rotation.z = this.rotation

            this.meshes = [...this.meshes, mesh]
            this.pivot.add(mesh)
        }

        this.pivot.rotation.z = -this.rotation

        this.pivot.position.z = -1
        this.rotationSpeed = 0.001

        scene.add(this.pivot);
    }
    rotate() {
        this.rotation = this.rotation + this.rotationSpeed

        let maxRot = Math.PI

        let xRepos = Math.sin(this.rotation) - 3

        for (let mesh of this.meshes) {
            mesh.lookAt(camera.position)
            mesh.position.x= xRepos
            // mesh.position.set(xRepos, 0, 0)
            mesh.rotation.z = this.rotation
        }
        this.pivot.rotation.z = -this.rotation

        if (this.rotation > maxRot) {
            this.rotation = 0
        }
    }

    animate(_progress){
        let animDistance = Math.abs(Math.sin(_progress*1.5))*0.25
        // console.log(animDistance)

        for (let i = 0; i < this.meshes.length; i++) {
            this.meshes[i].position.z = this.meshesZpos[i] + animDistance*(i+1) * 0.5

            this.meshes[i].rotation.z += + Math.sin(_progress*1.5 + i)*0.2
        }

    }

}


let decos = []
let decoTextureURL = './asset/deco.png';
const decoQuantity = 8;
let decoMaterial
class Deco {
    constructor() {
        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.material = decoMaterial;
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane.position.z = Math.random() * -3 - 1
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
        } else if (this.plane.position.x < -3) {
            this.plane.position.x = -2.9
            this.inverseDirection = !this.inverseDirection
        }


        if (!this.inverseDirection) {
            this.speed = this.speed * -1
        }


        this.plane.position.x += this.speed
    }
}


let bgSphere

///////////////////////////////////////////////////////////////////////////////////


import { loadIconsMaterials } from './loadTexture.js'


///////////////////////////////////////////////////////////////////////////////////






function init() {

    loadIconsMaterials()


    clock = new THREE.Clock()
    const checkIfMobile = (() => {
        var n = navigator.userAgent;
        if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) { isMobile = true; antialias = false; }
        console.log('isMobile', isMobile)
    })()
    const loader = new THREE.TextureLoader();

    // SCENE
    scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444)); //helper

    container = document.querySelector('#threejs')
    console.log(container.offsetWidth, container.offsetHeight)
    contRatio = container.offsetWidth / container.offsetHeight

    // CAMERA
    camera = new THREE.PerspectiveCamera(fov, container.offsetWidth / container.offsetHeight, 0.25, 50);
    camera.position.set(0, params.camYpos, 5);
    fitCamera(camera, container.offsetWidth, container.offsetHeight);
    scene.add(camera)


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

        /*
        let bgTextureURL = './asset/bg.jpg';
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
    
                uniform float uTime;
                uniform vec3 colorA;
    
                uniform sampler2D uTexture;
    
                varying vec2 vUv;
    
    
                //
                //	Classic Perlin 2D Noise 
                //	by Stefan Gustavson
                //
                vec4 permute(vec4 x)
                {
                    return mod(((x*34.0)+1.0)*x, 289.0);
                }
    
                vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    
                float cnoise(vec2 P){
                    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
                    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
                    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
                    vec4 ix = Pi.xzxz;
                    vec4 iy = Pi.yyww;
                    vec4 fx = Pf.xzxz;
                    vec4 fy = Pf.yyww;
                    vec4 i = permute(permute(ix) + iy);
                    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
                    vec4 gy = abs(gx) - 0.5;
                    vec4 tx = floor(gx + 0.5);
                    gx = gx - tx;
                    vec2 g00 = vec2(gx.x,gy.x);
                    vec2 g10 = vec2(gx.y,gy.y);
                    vec2 g01 = vec2(gx.z,gy.z);
                    vec2 g11 = vec2(gx.w,gy.w);
                    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
                        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
                    g00 *= norm.x;
                    g01 *= norm.y;
                    g10 *= norm.z;
                    g11 *= norm.w;
                    float n00 = dot(g00, vec2(fx.x, fy.x));
                    float n10 = dot(g10, vec2(fx.y, fy.y));
                    float n01 = dot(g01, vec2(fx.z, fy.z));
                    float n11 = dot(g11, vec2(fx.w, fy.w));
                    vec2 fade_xy = fade(Pf.xy);
                    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
                    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
                    return 2.3 * n_xy;
                }
                //
    
    
                void main()
                {
                    //vec4 textureColor = texture2D(uTexture, vUv);
                    
                    //gl_FragColor = textureColor;
                    //gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
    
                    vec3 colorRed = vec3(0.725,0.016,0.42);
                    vec3 colorBlue = vec3(0.506,0.012,0.89);
    
    
                    float gridWidth = 0.97;
                    float gridSize = 20.0;
                    float grid = step(gridWidth, mod(vUv.y*gridSize, 1.0));
                    grid += step(gridWidth, mod(vUv.x*gridSize, 1.0));
    
                    float noise = cnoise(vUv*50.0);
                    grid *= noise+0.5;
                    grid = clamp(grid, 0.0, 1.0);
    
    
                    vec2 wavedUv = vec2(vUv.x, vUv.y + sin(vUv.x*5.0)*0.1);
    
                    // float bgGradient = vUv.y;
                    float bgGradient = sin(wavedUv.y*5.0) +1.0 /2.0;
    
                    vec3 mixedColors = mix(colorRed, colorBlue, bgGradient);
    
                    vec3 result = mixedColors + grid*0.3 ;
    
    
                    gl_FragColor = vec4(result, 1.0);
                    // gl_FragColor = vec4(noise,noise,noise, 1.0);
    
    
    
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
        */
        // let bgTextureURL = './asset/bg.jpg';
        // let bgTexture = loader.load(bgTextureURL);

        // let overlayGeometry = new THREE.PlaneGeometry(2,2,1,1)



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

                    // gl_Position = vec4(position.x,position.y, 1.0, 1.0);
    
                    vUv = uv;
    
                }
                `,
            fragmentShader: `
                precision mediump float;
    
                uniform float uTime;
                uniform vec3 colorA;

                uniform float uRatio;
    
                uniform sampler2D uTexture;
    
                varying vec2 vUv;
    
    
                //
                //	Classic Perlin 2D Noise 
                //	by Stefan Gustavson
                //
                vec4 permute(vec4 x)
                {
                    return mod(((x*34.0)+1.0)*x, 289.0);
                }
    
                vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
    
                float cnoise(vec2 P){
                    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
                    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
                    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
                    vec4 ix = Pi.xzxz;
                    vec4 iy = Pi.yyww;
                    vec4 fx = Pf.xzxz;
                    vec4 fy = Pf.yyww;
                    vec4 i = permute(permute(ix) + iy);
                    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
                    vec4 gy = abs(gx) - 0.5;
                    vec4 tx = floor(gx + 0.5);
                    gx = gx - tx;
                    vec2 g00 = vec2(gx.x,gy.x);
                    vec2 g10 = vec2(gx.y,gy.y);
                    vec2 g01 = vec2(gx.z,gy.z);
                    vec2 g11 = vec2(gx.w,gy.w);
                    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
                        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
                    g00 *= norm.x;
                    g01 *= norm.y;
                    g10 *= norm.z;
                    g11 *= norm.w;
                    float n00 = dot(g00, vec2(fx.x, fy.x));
                    float n10 = dot(g10, vec2(fx.y, fy.y));
                    float n01 = dot(g01, vec2(fx.z, fy.z));
                    float n11 = dot(g11, vec2(fx.w, fy.w));
                    vec2 fade_xy = fade(Pf.xy);
                    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
                    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
                    return 2.3 * n_xy;
                }
                //
    
    
                void main()
                {
                    //vec4 textureColor = texture2D(uTexture, vUv);
                    
                    //gl_FragColor = textureColor;
                    //gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
    
                    vec3 colorRed = vec3(0.725,0.016,0.42);
                    vec3 colorBlue = vec3(0.506,0.012,0.89);
    
    
                    float gridWidth = 0.97;
                    float gridSize = 80.0;
                    float grid = step(gridWidth, mod(vUv.y*gridSize, 1.0));
                    grid += step(gridWidth, mod(vUv.x*gridSize*uRatio, 1.0));
    
                    float noise = cnoise(vUv*50.0);
                    grid *= noise+0.5;
                    grid = clamp(grid, 0.0, 1.0);
    
    
                    vec2 wavedUv = vec2(vUv.x, vUv.y + sin(vUv.x*5.0)*0.1);
    
                    // float bgGradient = vUv.y;
                    float bgGradient = sin(wavedUv.y*5.0) +1.0 /2.0;
    
                    vec3 mixedColors = mix(colorRed, colorBlue, bgGradient);
    
                    vec3 result = mixedColors + grid*0.3 ;
    
    
                    gl_FragColor = vec4(result, 1.0);
                    // gl_FragColor = vec4(noise,noise,noise, 1.0);
    
    
    
                }
            
                `,
            uniforms: {
                uRatio : {value: contRatio},
                uTime: { value: 0 },
                // uTexture: { value: bgTexture },
                colorB: { value: new THREE.Color(0x0000FF) },
                colorA: { value: new THREE.Color(0xFF00FF) }

            },
            side: THREE.DoubleSide
        })

        // let overlayGeometry = new THREE.PlaneGeometry(8,8,1,1)

        //  bgPlane = new THREE.Mesh(overlayGeometry, shaderMaterial);
        //  bgPlane.scale.set(1*contRatio,1*contRatio,1)
        // bgPlane.position.set(0, 0, -depth)
        // camera.add(bgPlane);

        let bgRes = 4
        const bgSphereGeometry = new THREE.IcosahedronGeometry( 6, 5*bgRes ); 
        bgSphere = new THREE.Mesh( bgSphereGeometry, shaderMaterial ); 
        scene.add( bgSphere );


    const setObjects = (() => {
        // init icons
        // for (let i = 0; i < iconsTextures.length; i++) {

        //     loader.load(
        //         iconsTextures[i],
        //         // onLoad callback
        //         function (texture) {
        //             iconsMaterials[i] = new THREE.MeshBasicMaterial({
        //                 map: texture,
        //                 transparent: true,
        //             });
        //             icons[i] = new Icon(i)
        //         },
        //         // onProgress callback currently not supported
        //         undefined,
        //         // onError callback
        //         function (err) {
        //             console.error('An error happened.');
        //         }
        //     );

        // }


        // init decos
        const decoTexture = loader.load(
            decoTextureURL,
            // onLoad callback
            function (texture) {
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

    })()


    // gui
    gui.add(params, 'camYpos', 0, 1.75, 0.0001);
    gui.add(params, 'animateCamera');
    gui.open();


    // const composer = new EffectComposer(renderer);
    // composer.addPass(new RenderPass(scene, camera));

    // const pass = new ShaderPass(shaderMaterial);
    // pass.renderToScreen = true;
    // composer.addPass(pass);

    animate();
}



function animate() {

    // bgSphere.rotation.y = bgSphere.rotation.y + 0.00001


    if(!threeState.iconsMaterialsLoaded){
        console.log('threeState.iconsMaterialsLoaded', threeState.iconsMaterialsLoaded)
    }

    if (threeState.iconsMaterialsLoaded && icons.length === 0) {
        placeIcons()
    }


    if (isOrbitControl) {
        controls.update();
        controls.target.y = camera.position.y
    }


    const elapsedTime = clock.getElapsedTime()
    shaderMaterial.uniforms.uTime = elapsedTime
    // console.log(shaderMaterial.uniforms.uTime)


    for (let icon of icons) {
        icon.rotate()
        icon.animate(elapsedTime)
    }
    for (let deco of decos) {
        deco.animate()
    }

    //gui update
    camera.position.y = params.camYpos


    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


const placeIcons = () => {
    for (let i = 0; i < window.iconsMaterials.length; i++) {
        icons[i] = new Icon(i)
    }
    console.log('placedIcons', icons)
}
///////////////////////////////////////////////////////////////////////////////////

function fitCamera(camera, contWidth, contHeight) {
    console.log('fitCamera')
    camera.aspect = contWidth / contHeight;

    if (camera.aspect > fitCameraAspectRatio) {
        // window too large
        const cameraHeight = Math.tan(THREE.MathUtils.degToRad(fov / 2));
        const ratio = camera.aspect / fitCameraAspectRatio;
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


///////////////////////////////////////////////////////////////////////////////////


init();
