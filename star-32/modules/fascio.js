import * as THREE from 'three';
import {getRandomArbitrary, getRandomInt, chooseStar} from './utility.js'

class Fascio {
    constructor() {
        this.radius = 0.01
        this.height = getRandomInt(10, 50)

        this.material = normalMaterial

        this.xStartPosRange = 15
        this.yStartPosRange = 15

        this.zStartPosMin = -100
        this.zStartPosMax = -75

        this.zBaseSpeed = 2

        this.zScaleSpeed = 0.01

        this.zKillPos = 50


    }
    set(scene) {
        this.geometry = new THREE.CapsuleBufferGeometry(this.radius, this.height, 1, 8);
        this.capsule = new THREE.Mesh(this.geometry, this.material);

        scene.add(this.capsule);

        this.place()

    }
    place() {
        this.capsule.rotation.set(Math.PI * 0.5, 0, 0)
        this.capsule.position.set(
            getRandomArbitrary(-this.xStartPosRange, this.xStartPosRange),
            getRandomArbitrary(-this.yStartPosRange, this.yStartPosRange),
            getRandomArbitrary(this.zStartPosMin, this.zStartPosMax))
        this.capsule.scale.set(1, 0, 1)
    }
    update() {

        this.capsule.position.z += this.zBaseSpeed * starsSpeedIncrement

        this.capsule.scale.y += this.zScaleSpeed * starsSpeedIncrement

        if (this.capsule.position.z > this.zKillPos) {
            this.capsule.position.set(
                getRandomArbitrary(-this.xStartPosRange, this.xStartPosRange),
                getRandomArbitrary(-this.yStartPosRange, this.yStartPosRange),
                getRandomArbitrary(this.zStartPosMin, this.zStartPosMax))
            this.capsule.scale.y = 0
        }

    }
    intersects(star,camera) {
        if (
            this.capsule.position.x < star.starGroup.position.x - star.start.geoBaseSize || this.capsule.position.x > star.starGroup.position.x + star.start.geoBaseSize &&
            this.capsule.position.y < star.starGroup.position.y - star.start.geoBaseSize || this.capsule.position.y > star.starGroup.position.y + star.start.geoBaseSize
        ) {
            return false
        } else if (
            this.capsule.position.x < camera.position.x - camXMoveRange || this.capsule.position.x > camera.position.x + camXMoveRange &&
            this.capsule.position.y < camera.position.y - camYMoveRange || this.capsule.position.y > camera.position.y + camYMoveRange
        ) {

        } else {
            return true
        }
    }
}

export default Fascio