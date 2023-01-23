import * as THREE from 'three';

export function backgroundGrid(scene) {
    let gridSize = 50
    let gridSub = 50
    let compZPos = 0

    let gridColor = 0x9e9e9e

    // front
    const gridHelper1 = new THREE.GridHelper(gridSize, gridSub, gridColor, gridColor);
    gridHelper1.rotation.x = Math.PI / 2
    gridHelper1.position.z = compZPos - gridSize
    scene.add(gridHelper1)

    // bottom
    const gridHelper2 = new THREE.GridHelper(gridSize, gridSub, gridColor, gridColor);
    gridHelper2.rotation.y = Math.PI / 2
    gridHelper2.position.set(0, -gridSize / 2, compZPos - gridSize / 2)
    scene.add(gridHelper2)
    // top
    const gridHelper3 = new THREE.GridHelper(gridSize, gridSub, gridColor, gridColor);
    gridHelper3.rotation.y = Math.PI / 2
    gridHelper3.position.set(0, gridSize / 2, compZPos - gridSize / 2)
    scene.add(gridHelper3)
    // left
    const gridHelper4 = new THREE.GridHelper(gridSize, gridSub, gridColor, gridColor);
    gridHelper4.rotation.z = Math.PI / 2
    gridHelper4.position.set(-gridSize / 2, 0, compZPos - gridSize / 2)
    scene.add(gridHelper4)
    // right
    const gridHelper5 = new THREE.GridHelper(gridSize, gridSub, gridColor, gridColor);
    gridHelper5.rotation.z = Math.PI / 2
    gridHelper5.position.set(gridSize / 2, 0, compZPos - gridSize / 2)
    scene.add(gridHelper5)
}

export function polarGrid(scene) {
    const polarGridHelper = new THREE.PolarGridHelper( 1000, 8, 16, 64, 0x000000, 0x00000 );
    polarGridHelper.position.y = 0;
    polarGridHelper.position.x = 0;
    polarGridHelper.position.z = -1450;
    polarGridHelper.rotation.x = Math.PI*0.5
    scene.add( polarGridHelper );
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export function chooseStar() {
    let maxNumber = starContent.length
    let randomGenerated = Math.floor(Math.random() * maxNumber);
    console.log('choosed star',randomGenerated)
    return randomGenerated
}