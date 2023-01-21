import * as THREE from 'three';
import {getRandomArbitrary, getRandomInt, chooseStar} from './utility.js'


class Deco extends THREE.Group {
    constructor(_url) {
      super();
        this.modelUrl = _url;
        this.onCreate();

        this.scaleSize = 0.01

        this.speed = getRandomArbitrary(0.1,0.2)

        this.xSpawnPos
        this.ySpawnPos
        this.zSpawnPos

        this.pivot = new THREE.Group();
        this.getRotationDirection = getRandomInt(0,2)
        this.rotationDirection
    }

    onCreate() {
        threeObjLoader.load(
            this.modelUrl,
            obj => {
                obj.children[0].material = normalMaterial
                obj.children[0].position.y = getRandomArbitrary(7, 15)
                obj.children[0].scale.set(0.01,0.01,0.01)
                // console.log(obj)

                this.add(obj);

                this.xSpawnPos = 0
                this.ySpawnPos = 0
                this.zSpawnPos = getRandomArbitrary(-100,-75)
                this.position.set(this.xSpawnPos, this.ySpawnPos, this.zSpawnPos)

                this.rotation.z = getRandomArbitrary(0,Math.PI*2)
                if(this.getRotationDirection > 0){
                    this.rotationDirection = -1
                } else {
                    this.rotationDirection = 1
                }

                // console.log(this)
            }
        );
    }

    update() {

        this.rotation.z += Math.PI * 0.001 * starsSpeedIncrement * this.rotationDirection

        this.position.z += this.speed * starsSpeedIncrement

        this.newScale = THREE.MathUtils.clamp(
            THREE.MathUtils.mapLinear(
                this.position.z,
                this.zSpawnPos,
                0,
                0,
                0.5
            ),
            0,
            0.5)

        this.scale.set(this.newScale, this.newScale, this.newScale)

        if (this.position.z > 0)
            this.placeAgain()
    }

    placeAgain() {
        this.position.z = getRandomArbitrary(-100, -75)
        // this.scale.set(0, 0, 0)

        // this.position.set(0,0,-75)
    }
}

export default Deco