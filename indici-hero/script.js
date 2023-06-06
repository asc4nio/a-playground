import * as THREE from 'three';
import gsap from "gsap"
// import * as dat from 'dat.gui';
// import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';

let container, camera, scene, renderer, controls

let icons = []
let textures = [
    './asset/icon-01.png',
    './asset/icon-02.png',
    './asset/icon-03.png',
    './asset/icon-04.png',
    './asset/icon-05.png',
    './asset/icon-06.png',
]
let iconsQuantity = textures.length
let materials = []

// const gui = new dat.GUI();

let fitCamera
const planeAspectRatio = 1
const fov = 35

class Icon {
    constructor(i) {
        this.geometry = new THREE.PlaneGeometry(1, 1);
        this.mesh = new THREE.Mesh(this.geometry, materials[i]);

        this.pivot = new THREE.Group();

        this.rotation = (Math.PI / iconsQuantity) * i

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

        let xRepos = Math.sin(this.rotation)-3
        
        this.mesh.position.set(xRepos, 0, 0)

        this.mesh.rotation.z = this.rotation
        this.pivot.rotation.z = -this.rotation

        if (this.rotation > maxRot) {
            this.rotation = 0
        }
    }

}




function init() {
    container = document.querySelector('#threejs')

    console.log(container.offsetWidth, container.offsetHeight)


    // CAMERA
    camera = new THREE.PerspectiveCamera(fov, container.offsetWidth / container.offsetHeight, 0.25, 20);
    camera.position.set(0, 1.5, 5);
    fitCamera = (camera, contWidth, contHeight) => {
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
    fitCamera(camera, container.offsetWidth, container.offsetHeight);


    // SCENE
    scene = new THREE.Scene();

    scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444)); //helper


    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setClearColor( 0xff00ff, 1);



    container.appendChild(renderer.domElement);

    /*

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.75;
    controls.maxDistance = 5;
    // controls.target = new THREE.Vector3(0, 5, 0);


    // controls.enablePan = false
    // controls.enableZoom = false

    // controls.minPolarAngle = Math.PI * 0.25 // fix vertical rotation
    // controls.maxPolarAngle = Math.PI * 0.75 // fix vertical rotation

    controls.enableDamping = true
    controls.dampingFactor = 0.025

    // controls.target.set( 0, 0, - 0.2 );
    // controls.autoRotate = true
    // controls.autoRotateSpeed = 1

    controls.update();
*/




    for (let i = 0; i < iconsQuantity; i++) {
        const loader = new THREE.TextureLoader();
        loader.load(
            // resource URL
            textures[i],

            // onLoad callback
            function (texture) {
                // in this example we create the material when the texture is loaded
                materials[i] = new THREE.MeshBasicMaterial({
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


        // icons[i] = new Icon(i)
        // icons[i].place(i)

    }

    // icons[0] = new Icon
    // icons[0].place()


}

function animate() {
    // controls.update();

    renderer.render(scene, camera);


    for (let item of icons) {
        item.rotate()
    }

    requestAnimationFrame(animate);

}

function onWindowResize() {
    // camera.aspect = container.offsetWidth / container.offsetHeight;
    // camera.updateProjectionMatrix();

    fitCamera(camera, container.offsetWidth, container.offsetHeight);

    renderer.setSize(container.offsetWidth, container.offsetHeight);
}
window.addEventListener('resize', onWindowResize);



init();
animate();
