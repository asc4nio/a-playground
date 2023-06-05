import * as THREE from 'three';
import { getRandomArbitrary, getRandomInt, chooseStar } from './utility.js'

export default class Star2 {
    constructor() {
        this.state = {
            isDebug : true,
            isWatchingCamera: true,
            isFaded: true,
            isFading: true,
            isColliding: false,
            isDying: false,
            isRaycasting: false,

            currentOpacity: 0,
            zSpeed : getRandomArbitrary(0.01, 0.025),
            contentIndex : null
        }

        this.start = {
            xPosRange: 5,
            yPosRange: 5,
            zPosMin: -25,
            zPosMax: 50
        }
        this.spawn = {
            xPos: null,
            yPos: null,
            zPos: null,
        }
        this.death = {
            zPosDead: -3,
            zPosKill: -1
        }
        this.layers = {
            boxSize: 3,
            sizeRatio: null,
            quantity: null,

            minSizeOffset: 0.01,
            maxSizeOffset: this.boxSize,
            zPosEndOffset: -7,
            eachOffsetSize: null,

            ulrs: [],
            textures: [],
            materials: [],
            geometries: [],
            objects:[]
        }

        this.collider = {
            radius: this.layers.boxSize / 2,
            sphereGeometry: new THREE.SphereBufferGeometry(this.radius, 4, 4),
            sphereObject: null,
            boundingBox: new THREE.Box3()
        }

        this.debug = {
            matBBColor: 0xFFFF00,
            matSphereColor: 0xFF00FF,
            matDeadColor: 0x000000,
            matFadeColor: 0xFFFFFF,

            collisionHelper: null,
            helpMaterial : new THREE.MeshBasicMaterial({
                // color: this.matSphereColor,
                color: 0x000000,
                wireframe: true,
                // visible: this.debugCollision
                visible: true

            })
        }

        this.starGroup = new THREE.Group();
    }
    set(scene){
        this.state.isDying = false
        this.state.contentIndex = chooseStar()

        this.layers.quantity = starContent[this.state.contentIndex].layers.length
        
        this.layers.sizeRatio = starContent[this.state.contentIndex].ratio

        for (let i = 0; i < this.layers.quantity; i++) {
            this.layers.ulrs[i] = starContent[this.state.contentIndex].layers[i]

            this.layers.textures[i] = textureLoader.load(
                this.layers.ulrs[i],
                function (self) { }, // onLoad
                undefined, // onProgress
                function (err) {  // onError
                    console.error('tex load fail');
                }
            );

            this.layers.textures[i].premultiplyAlpha = true
            this.layers.textures[i].magFilter = THREE.NearestFilter
            this.layers.textures[i].minFilter = THREE.NearestFilter
            this.layers.textures[i].minFilter = THREE.LinearMipmapLinearFilter
            this.layers.textures[i].anisotropy = 16

            this.layers.materials[i] = new THREE.MeshBasicMaterial({
                map:  this.layers.textures[i],
                transparent: true,
            })

            if (this.layers.sizeRatio > 1) {
                this.layers.geometries[i] = new THREE.PlaneBufferGeometry(this.layers.boxSize, this.layers.boxSize / this.layers.sizeRatio, 1, 1);
            } else {
                this.layers.geometries[i] = new THREE.PlaneBufferGeometry(this.layers.boxSize, this.layers.boxSize, 1, 1);
            }

            this.layers.objects[i] = new THREE.Mesh(this.layers.geometries[i], this.layers.textures[i]);

            this.starGroup.add(this.layers.objects[i]);
        }

 
        this.collider.sphereObject = new THREE.Mesh(this.sphereGeometry, this.helpMaterial);

        this.collider.sphereObject.position.set(0, 0, 0)
        this.collider.sphereObject.geometry.computeBoundingBox();

        // if (this.state.isDebug) {
            this.debug.collisionHelper = new THREE.Box3Helper(this.collider.boundingBox, this.debug.matBBColor);
            this.debug.helpMaterial.visible = true
        // }


        // NEXT
        this.place(scene)
    }
    place(scene){
        this.starGroup.add(this.collider.sphereObject);

        this.layers.eachOffsetSize = this.layers.maxSizeOffset/ this.layers.quantity
        for (let i = 0; i < this.layers.quantity; i++) {
            this.currentLayerOffset = this.layers.eachOffsetSize *i - this.layers.maxSizeOffset/2
            this.layers.objects[i].position.z = this.currentLayerOffset
        }

        this.spawn.xPos = getRandomArbitrary(-this.start.xPosRange,this.start.xPosRange)
        this.spawn.yPos = getRandomArbitrary(-this.start.yPosRange,this.start.yPosRange)
        this.spawn.zPos = getRandomArbitrary(-this.start.zPosMin, this.start.zPosMax)

        this.starGroup.position.set(this.spawn.xPos, this.spawn.yPos, this.spawn.zPos)

        scene.add(this.starGroup);

        // if(this.state.isDebug){
            this.debug.helpMaterial.color.set(this.debug.matSphereColor)
            this.debug.collisionHelper.material.color.set(this.debug.matBBColor)
            scene.add(this.debug.collisionHelper)
        // }
    }
    move(_camera, _speedMultiplier){
        this.starGroup.position.z += this.state.zSpeed * _speedMultiplier
        if(this.state.isWatchingCamera){
            this.starGroup.lookAt(_camera.position)
        }

        //////////////////////////////////////////////////////////

    }
    update(camera,scene){
        this.collider.boundingBox.copy(this.collider.sphereObject.geometry.boundingBox).applyMatrix4(this.collider.sphereObject.matrixWorld)
        this.move(camera, window.starsSpeedIncrement)
    }
}