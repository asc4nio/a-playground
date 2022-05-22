gsap.registerPlugin(ScrollTrigger);

/*
const parameters = {
  color: 0xff0000,
  spin: () => {
    gsap.to(mesh.rotation, 1, { y: mesh.rotation.y + Math.PI * 2 });

  }
};
*/


// DOM //
const threeCont = document.querySelector(".three-container");
var threeContBound = threeCont.getBoundingClientRect();

var threeContSize = {
  w: Math.floor(threeContBound.width),
  h: Math.floor(threeContBound.height)
};

// DOM DRIVEN ANIMATIONS //
document.addEventListener("DOMContentLoaded", function (event) {

  window.onload = function () {

    window.requestAnimationFrame(function () {

      var tl01 = gsap.timeline({});
      var tl02 = gsap.timeline({});

      gsap.set(torusA.position, { y: -3 });
      gsap.set(sphereA.position, { y: -3 });

      tl01.to(torusA.position, {
        y: 0, ease: "power1.inOut",
        scrollTrigger: {
          markers: false,
          trigger: "#section-b",
          scrub: 1,
          start: 'top bottom',
          // endTrigger: ".section-four",
          end: "bottom bottom"
        }
      })

      tl02.to(sphereA.position, {
        y: 0, ease: "power1.inOut",
        scrollTrigger: {
          markers: false,
          trigger: "#section-c",
          scrub: 1,
          start: 'top bottom',
          // endTrigger: ".section-four",
          end: "bottom bottom"
        }
      })


    });

  };

});


//function threeJS() {
// Canvas //
const canvas = document.querySelector("canvas.threecanvas");

// Scene //
const scene = new THREE.Scene();

//Materials //
const normalMaterial = new THREE.MeshNormalMaterial({});
const metalMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x828282,
  roughness: 0.2,
  metalness: 1,
  reflectivity: 0
});

// Objects //
const geometryTorus = new THREE.TorusGeometry(0.8, 0.05, 16, 100);
const geometrySphere = new THREE.SphereGeometry(0.5, 16, 16);


const torusA = new THREE.Mesh(geometryTorus, normalMaterial);
scene.add(torusA);
const sphereA = new THREE.Mesh(geometrySphere, normalMaterial);
scene.add(sphereA);

const starGroup = new THREE.Group();
var geometryStar = new THREE.SphereBufferGeometry(0.01, 4, 4)
  for (var i=0; i<150; i++) {
    star = new THREE.Mesh(geometryStar, metalMaterial);
    star.position.x = Math.random() * 8 - 4;
    star.position.y = Math.random() * 8 - 4;
    star.position.z = Math.random() * 8 - 4;
    starGroup.add( star );
  }
scene.add(starGroup);

torusA.rotation.z = 3.14 / 2;
//torusA.position.y = -3


// Lights //
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0x828282); // soft white light
scene.add(ambientLight);

// Sizes //

// Camera //
const camera = new THREE.PerspectiveCamera(
  75,
  threeContSize.w / threeContSize.h,
  0.1,
  100
);
camera.position.z = 2.1;
scene.add(camera);

// Renderer ///
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(threeContSize.w, threeContSize.h);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls //
/*
const controls = new THREE.TrackballControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.1;
*/

// Debug //
// scene.add(new THREE.AxesHelper(1));


// Responsiveness ///
window.addEventListener("resize", () => {
  //console.log("resized");

  function sizeUpdate() {
    let newBound = threeCont.getBoundingClientRect();
    let newBoundSize = {
      w: Math.floor(newBound.width),
      h: Math.floor(newBound.height)
    };
    threeContSize = newBoundSize;
  }
  sizeUpdate();

  //console.log(threeContSize);

  // Update camera
  camera.aspect = threeContSize.w / threeContSize.h;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(threeContSize.w, threeContSize.h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Animate //
const clock = new THREE.Clock();
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Calcs
  torusA.rotation.x += -0.002;
  torusA.rotation.y += -0.002;
  torusA.rotation.z += -0.002;
  starGroup.rotation.y += 0.001;

  // Update controls
  //controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};
tick();
//}

// SWITCH ON //
//threeJS();