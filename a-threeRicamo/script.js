import * as THREE from 'three';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import { OrbitControls } from '../lib/three.js/examples/jsm/controls/OrbitControls.js';

import gsap from "gsap"
import * as dat from 'dat.gui';




let container, camera, scene, renderer, controls
const gui = new dat.GUI();


let mesh;
let raycaster;
let line;

const intersection = {
    intersects: false,
    point: new THREE.Vector3(),
    normal: new THREE.Vector3()
};
const mouse = new THREE.Vector2();
const intersects = [];

const textureLoader = new THREE.TextureLoader();
const decalDiffuse = textureLoader.load('./asset/decal-diffuse.png');
decalDiffuse.colorSpace = THREE.SRGBColorSpace;
const decalNormal = textureLoader.load('./asset/decal-normal.jpg');

const decalMaterial = new THREE.MeshPhongMaterial({
    specular: 0x444444,
    map: decalDiffuse,
    normalMap: decalNormal,
    normalScale: new THREE.Vector2(1, 1),
    shininess: 30,
    transparent: true,
    depthTest: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: - 4,
    wireframe: false
});


const decals = [];
let mouseHelper;
const position = new THREE.Vector3();
const orientation = new THREE.Euler();
const size = new THREE.Vector3(10, 10, 10);

const params = {
    minScale: 0.2,
    maxScale: 0.2,
    rotate: true,
    clear: function () {
        removeDecals();
    }
};



function init() {
    container = document.querySelector('#threejs')
    // console.log(container.offsetWidth)
    // console.log(container.offsetHeight)

    // CAMERA
    camera = new THREE.PerspectiveCamera(30, container.offsetWidth / container.offsetHeight, 0.25, 20);
    // camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );

    camera.position.set(0, 0, 5);


    let dist = camera.position.z - 0;
    let height = 1 // desired height to fit
    camera.fov = 2 * Math.atan(height / (2 * dist)) * (180 / Math.PI);
    camera.updateProjectionMatrix();


    // SCENE
    scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(4, 12, 0x888888, 0x444444)); //helper

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    //CONTROLS
    // controls = new OrbitControls(camera, renderer.domElement);
    /*
    // controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 0.75;
    controls.maxDistance = 5;
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


    //LIGHTS
    scene.add(new THREE.AmbientLight(0x443333));

    const dirLight1 = new THREE.DirectionalLight(0xffddcc, 1);
    dirLight1.position.set(1, 0.75, 0.5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xccccff, 1);
    dirLight2.position.set(- 1, 0.75, - 0.5);
    scene.add(dirLight2);

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);

    line = new THREE.Line(geometry, new THREE.LineBasicMaterial());
    scene.add(line);


    //PLANE
    const planeGeometry = new THREE.PlaneGeometry(1 *(container.offsetWidth / container.offsetHeight), 1);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    mesh = new THREE.Mesh(planeGeometry, planeMaterial);
    mesh.scale.set(0.9,0.9,1)
    scene.add(mesh);




    // loadLeePerrySmith();

    raycaster = new THREE.Raycaster();

    mouseHelper = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 10), new THREE.MeshNormalMaterial());
    mouseHelper.visible = false;
    scene.add(mouseHelper);




    window.addEventListener('pointerdown', function () {
        console.log('pointerdown')
    });

    window.addEventListener('pointerup', function (event) {
        console.log('pointerup')
        // if (moved === false) {
        // console.log('pointerup moved === false')
        checkIntersection(event.clientX, event.clientY);
        if (intersection.intersects) shoot();
        // }

    });

    window.addEventListener('pointermove', onPointerMove);

    function onPointerMove(event) {
        console.log('onPointerMove')

        if (event.isPrimary) {
            console.log('onPointerMove event.isPrimary')

            checkIntersection(event.clientX, event.clientY);
        }
    }

    function checkIntersection(x, y) {
        console.log('checkIntersection', x, y)

        if (mesh === undefined) return;

        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = - (y / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        raycaster.intersectObject(mesh, false, intersects);

        if (intersects.length > 0) {
            console.log(intersects)

            const p = intersects[0].point;
            mouseHelper.position.copy(p);
            intersection.point.copy(p);

            const n = intersects[0].face.normal.clone();
            n.transformDirection(mesh.matrixWorld);
            n.multiplyScalar(10);
            n.add(intersects[0].point);

            intersection.normal.copy(intersects[0].face.normal);
            mouseHelper.lookAt(n);

            const positions = line.geometry.attributes.position;
            positions.setXYZ(0, p.x, p.y, p.z);
            positions.setXYZ(1, n.x, n.y, n.z);
            positions.needsUpdate = true;

            intersection.intersects = true;

            intersects.length = 0;

        } else {
            console.log(intersects)
            intersection.intersects = false;

        }

    }



    gui.add(params, 'minScale', 1, 30);
    gui.add(params, 'maxScale', 1, 30);
    gui.add(params, 'rotate');
    gui.add(params, 'clear');
    gui.open();




}


function shoot() {

    position.copy(intersection.point);
    orientation.copy(mouseHelper.rotation);

    if (params.rotate) orientation.z = Math.random() * 2 * Math.PI;

    const scale = params.minScale + Math.random() * (params.maxScale - params.minScale);
    size.set(scale, scale, scale);

    const material = decalMaterial.clone();
    material.color.setHex(Math.random() * 0xffffff);

    const m = new THREE.Mesh(new DecalGeometry(mesh, position, orientation, size), material);

    decals.push(m);
    scene.add(m);

}

function removeDecals() {

    decals.forEach(function (d) {

        scene.remove(d);

    });

    decals.length = 0;

}



function animate() {
    // controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}

function onWindowResize() {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.offsetWidth, container.offsetHeight);
}
window.addEventListener('resize', onWindowResize);



init();
animate();
