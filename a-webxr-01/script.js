import * as THREE from "three";

import { BoxLineGeometry } from "../lib/three.js/examples/jsm/geometries/BoxLineGeometry.js";
import { OBJLoader } from "../lib/three.js/examples/jsm/loaders/OBJLoader.js";

import { VRButton } from "../lib/three.js/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "../lib/three.js/examples/jsm/webxr/XRControllerModelFactory.js";

let camera, scene, raycaster, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;

let room, marker, floor;

let torusA;

let INTERSECTION;
const tempMatrix = new THREE.Matrix4();

const clock = new THREE.Clock();

init();
animate();

function init() {
  //Scena
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x505050);

  //Camera
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    10
  );
  camera.position.set(0, 1, 3);

  //Materials /////////////////////////////
  //const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const normalMaterial = new THREE.MeshNormalMaterial({});
  const metalMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x828282,
    roughness: 0.2,
    metalness: 1,
    reflectivity: 0
  });

  // Geometries
  room = new THREE.LineSegments(
    new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
    new THREE.LineBasicMaterial({ color: 0x808080 })
  );
  scene.add(room);

  // Objects /////////////////////////////
  const group = new THREE.Group();

  group.scale.set(0.75, 0.75, 0.75);
  group.position.y = 1;

  const geometryA = new THREE.TorusGeometry(1.2, 0.02, 16, 100);
  torusA = new THREE.Mesh(geometryA, metalMaterial);
  // scene.add(torusA);
  group.add(torusA);

  torusA.rotation.z = 3.14 / 2;

  // Manager /////////////////////////////
  function loadModel() {
    object.traverse(function (child) {
      //if (child.isMesh) child.material.map = texture;
      if (child.isMesh) child.material = normalMaterial;
    });
  }
  const manager = new THREE.LoadingManager(loadModel);

  // Texture /////////////////////////////
  const textureLoader = new THREE.TextureLoader(manager);
  const texture = textureLoader.load(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/627fbd22e4aac6644def9928_placeholder01.jpg"
  );

  // Mesh /////////////////////////////
  var object;

  const loader = new OBJLoader(manager);
  loader.load(
    "https://uploads-ssl.webflow.com/62375dc2e80a27fa66d86b61/6283c7660f1eb3f16cc56c8f_new-a.txt",
    function (obj) {
      object = obj;
      object.scale.x = 0.01;
      object.scale.y = 0.01;
      object.scale.z = 0.01;
      object.position.y = 0.1;
      object.name = "aletter";
      // scene.add(object);
      group.add(object);
    },
    onProgress,
    onError
  );

  function onProgress(xhr) {
    if (xhr.lengthComputable) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
    }
  }
  function onError() {}

  scene.add(group);

  // Environment
  // Lights
  scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1).normalize();
  scene.add(light);

  // Marker-controller
  marker = new THREE.Mesh(
    new THREE.CircleGeometry(0.25, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({ color: 0x808080 })
  );
  scene.add(marker);

  floor = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 4.8, 2, 2).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial({
      color: 0x808080,
      transparent: true,
      opacity: 0.25
    })
  );
  scene.add(floor);

  // Raycaster
  raycaster = new THREE.Raycaster();

  // Render
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.xr.enabled = true;

  // Dom placement
  document.body.appendChild(renderer.domElement);
  document.body.appendChild(VRButton.createButton(renderer));

  /////////////////////////////////////////////////////////////////
  // Controllers setup
  function onSelectStart() {
    this.userData.isSelecting = true;
  }
  function onSelectEnd() {
    this.userData.isSelecting = false;

    if (INTERSECTION) {
      const baseReferenceSpace = renderer.xr.getReferenceSpace();
      const offsetPosition = {
        x: -INTERSECTION.x,
        y: -INTERSECTION.y,
        z: -INTERSECTION.z,
        w: 1
      };
      const offsetRotation = new THREE.Quaternion();
      const transform = new XRRigidTransform(offsetPosition, offsetRotation);
      const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace(
        transform
      );

      renderer.xr.setReferenceSpace(teleportSpaceOffset);
    }
  }

  controller1 = renderer.xr.getController(0);
  controller1.addEventListener("selectstart", onSelectStart);
  controller1.addEventListener("selectend", onSelectEnd);
  controller1.addEventListener("connected", function (event) {
    this.add(buildController(event.data));
  });
  controller1.addEventListener("disconnected", function () {
    this.remove(this.children[0]);
  });
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  controller2.addEventListener("selectstart", onSelectStart);
  controller2.addEventListener("selectend", onSelectEnd);
  controller2.addEventListener("connected", function (event) {
    this.add(buildController(event.data));
  });
  controller2.addEventListener("disconnected", function () {
    this.remove(this.children[0]);
  });
  scene.add(controller2);

  // The XRControllerModelFactory will automatically fetch controller models
  // that match what the user is holding as closely as possible. The models
  // should be attached to the object returned from getControllerGrip in
  // order to match the orientation of the held device.

  const controllerModelFactory = new XRControllerModelFactory();

  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(
    controllerModelFactory.createControllerModel(controllerGrip1)
  );
  scene.add(controllerGrip1);

  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(
    controllerModelFactory.createControllerModel(controllerGrip2)
  );
  scene.add(controllerGrip2);

  ///////////

  window.addEventListener("resize", onWindowResize, false);
}

function render() {
  // Calcs
  const letterA = scene.getObjectByName("aletter");
  if (letterA) {
    letterA.rotation.y += 0.005;
  }
  torusA.rotation.x += -0.001;

  INTERSECTION = undefined;

  if (controller1.userData.isSelecting === true) {
    tempMatrix.identity().extractRotation(controller1.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller1.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    const intersects = raycaster.intersectObjects([floor]);

    if (intersects.length > 0) {
      INTERSECTION = intersects[0].point;
    }
  } else if (controller2.userData.isSelecting === true) {
    tempMatrix.identity().extractRotation(controller2.matrixWorld);

    raycaster.ray.origin.setFromMatrixPosition(controller2.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    const intersects = raycaster.intersectObjects([floor]);

    if (intersects.length > 0) {
      INTERSECTION = intersects[0].point;
    }
  }

  if (INTERSECTION) marker.position.copy(INTERSECTION);

  marker.visible = INTERSECTION !== undefined;

  renderer.render(scene, camera);
}

function animate() {
  renderer.setAnimationLoop(render);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function buildController(data) {
  let geometry, material;

  switch (data.targetRayMode) {
    case "tracked-pointer":
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
      );
      geometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3)
      );

      material = new THREE.LineBasicMaterial({
        vertexColors: true,
        blending: THREE.AdditiveBlending
      });

      return new THREE.Line(geometry, material);

    case "gaze":
      geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, -1);
      material = new THREE.MeshBasicMaterial({
        opacity: 0.5,
        transparent: true
      });
      return new THREE.Mesh(geometry, material);
  }
}
function handleController(controller) {
  if (controller.userData.isSelecting) {
    const object = room.children[count++];

    object.position.copy(controller.position);
    object.userData.velocity.x = (Math.random() - 0.5) * 3;
    object.userData.velocity.y = (Math.random() - 0.5) * 3;
    object.userData.velocity.z = Math.random() - 9;
    object.userData.velocity.applyQuaternion(controller.quaternion);

    if (count === room.children.length) count = 0;
  }
}
