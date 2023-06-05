import * as THREE from 'three';
import { getRandomArbitrary, getRandomInt, chooseStar } from './utility.js'


class Star {
    constructor() {
        this.state = {
            isFaded: true, // è trasparente
            isFading: true, // si sta animando
            isColliding: false, // collisione in corso
            isDying: false, // ultimo fadeOut
            isRaycasting: false // selezione in corso
        }
        this.start = {
            geoBaseSize: 3,
            xPosRange: 5,
            yPosRange: 5,
            zPosMin: -25,
            zPosMax: -75,
        }
        this.end = {
            zDeadPos: -3, // last fadeOut z Position
            zKillPos: -1,
        }

        this.layers = {
            quantity: null, // calcolato successivamente
            MinOffset: 0.01,
            MaxOffset: this.start.geoBaseSize,
            zEndPos: -7,
            eachStartOffset: null, // calcolato successivamente
        }

        this.destroyRadius

        this.zSpeed = getRandomArbitrary(0.01, 0.025)*3

        this.debug = {
            debugCollision: false,
            watchCamera: true,
            midPanel: false,
            matBBColor: 0xFFFF00,
            matSphereColor: 0xFF00FF,
            matDeadColor: 0x000000,
            matFadeColor: 0xFFFFFF
        }

        this.materialOpacity = 0

        this.starGroup = new THREE.Group();
        this.xGroupSpawnPos
        this.yGroupSpawnPos
        this.zGroupSpawnPos
        this.zGroupPos


        // COLLISION & DEBUG
        this.panelObject
        this.sphereObject

        this.bBoxes = []
        this.helpers = []

        this.panelMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            color: 0x0000FF,
            wireframe: true,
        })
        this.helpMaterial = new THREE.MeshBasicMaterial({
            color: this.debug.matSphereColor,
            wireframe: true,
            visible: this.debug.debugCollision,
        })

        //TEMPSTORAGE
        this.starTextureUrls = []
        this.starTextures = []
        this.starMaterials = []
        this.starGeometries = []
        this.starObjects = []


    };
    set(scene) {
        this.state.isDying = false
        // this.index = 0
        this.index = chooseStar()
        this.layers.quantity = starContent[this.index].layers.length

        // this.sizeRatio = 1
        this.sizeRatio = starContent[this.index].ratio
        this.destroyRadius = this.start.geoBaseSize / 2// * this.sizeRatio

        for (let i = 0; i < this.layers.quantity; i++) {
            this.starTextureUrls[i] = starContent[this.index].layers[i]

            this.starTextures[i] = textureLoader.load(
                this.starTextureUrls[i],
                function (self) { }, // onLoad
                undefined, // onProgress
                function (err) {  // onError
                    console.error('tex load fail');
                }
            );
            this.starTextures[i].premultiplyAlpha = true
            this.starTextures[i].magFilter = THREE.NearestFilter
            this.starTextures[i].minFilter = THREE.NearestFilter
            this.starTextures[i].minFilter = THREE.LinearMipmapLinearFilter
            this.starTextures[i].anisotropy = 16

            this.starMaterials[i] = new THREE.MeshBasicMaterial({
                map: this.starTextures[i],
                transparent: true,
            })

            if (this.sizeRatio > 1) {
                // this.destroyRadius = (this.geoBaseSize * this.sizeRatio) / 2
                this.starGeometries[i] = new THREE.PlaneBufferGeometry(this.start.geoBaseSize, this.start.geoBaseSize / this.sizeRatio, 1, 1);
            } else {
                // this.destroyRadius = (this.geoBaseSize) / 2
                this.starGeometries[i] = new THREE.PlaneBufferGeometry(this.start.geoBaseSize, this.start.geoBaseSize, 1, 1);
            }

            this.starObjects[i] = new THREE.Mesh(this.starGeometries[i], this.starMaterials[i]);

            this.starGroup.add(this.starObjects[i]);
        }


        // COLLISION
        this.bBoxes[0] = new THREE.Box3();

        this.sphereGeometry = new THREE.SphereBufferGeometry(this.destroyRadius, 4, 4);
        this.sphereObject = new THREE.Mesh(this.sphereGeometry, this.helpMaterial);
        this.sphereObject.position.set(0, 0, 0)
        this.sphereObject.geometry.computeBoundingBox();


        //DEBUG
        if (this.debug.midPanel){
            this.panelGeometry = new THREE.PlaneBufferGeometry(this.destroyRadius * 2, this.destroyRadius * 2, 1, 1);
            this.panelObject = new THREE.Mesh(this.panelGeometry, this.panelMaterial);
            this.panelObject.position.set(0, 0, 0)
            this.panelObject.geometry.computeBoundingBox();

            this.starGroup.add(this.panelObject);
        }

        if (this.debug.debugCollision) {
            this.helpers[0] = new THREE.Box3Helper(this.bBoxes[0], this.debug.matBBColor);
            this.helpMaterial.visible = true

        }




        //NEXT
        this.place(scene)
    }
    place(scene) {

        // this.starGroup.add(this.panelObject);
        this.starGroup.add(this.sphereObject);

        this.layers.eachStartOffset = this.layers.MaxOffset / this.layers.quantity

        for (let i = 0; i < this.layers.quantity; i++) {
            this.startLayersOffset = this.layers.eachStartOffset * i - this.layers.MaxOffset / 2 // bilancia lo spazio per la quantità di vivelli e posiziona al  centro
            this.starObjects[i].position.z = this.startLayersOffset
        }

        this.xGroupSpawnPos = getRandomArbitrary(-this.start.xPosRange, this.start.xPosRange)
        this.yGroupSpawnPos = getRandomArbitrary(-this.start.yPosRange, this.start.yPosRange)
        this.zGroupSpawnPos = getRandomArbitrary(this.start.zPosMin, this.start.zPosMax)

        this.zGroupPos = this.zGroupSpawnPos

        this.starGroup.position.set(this.xGroupSpawnPos, this.yGroupSpawnPos, this.zGroupSpawnPos)

        scene.add(this.starGroup);

        if (this.debug.debugCollision) {
            this.helpMaterial.color.set(this.debug.matSphereColor)
            this.helpers[0].material.color.set(this.debug.matBBColor)
            scene.add(this.helpers[0]);
        }
    }
    move(camera, speed) {
        this.zGroupPos += this.zSpeed * speed
        this.starGroup.position.z = this.zGroupPos

        if (this.debug.watchCamera) {

            this.starGroup.lookAt(camera.position)
        }

        this.currentLayersOffset = THREE.MathUtils.clamp( // layers offset aggiornato al frame
            THREE.MathUtils.mapLinear(
                this.starGroup.position.z, // mappa la posizione del gruppo z
                this.zGroupSpawnPos, // dalla posizione di spawn
                this.layers.zEndPos, // alla posizione di fine offset
                this.layers.eachStartOffset, // corrisponde il massimo relativo                 this.layers.MaxOffset, // corrisponde il massimo offset
                0), // che diventa 0
            this.layers.MinOffset, // valore minimo limitato
            this.layers.eachStartOffset // valore massimo limitato
        )

        this.currentLayersScale = THREE.MathUtils.clamp( // layers offset aggiornato al frame
            THREE.MathUtils.mapLinear(
                this.starGroup.position.z, // mappa la posizione del gruppo z
                this.zGroupSpawnPos, // dalla posizione di spawn
                this.layers.zEndPos, // alla posizione di fine offset
                0, // corrisponde il massimo relativo                 this.layers.MaxOffset, // corrisponde il massimo offset
                1), // che diventa 0
            0, // valore minimo limitato
            1 // valore massimo limitato
        )


        for (let i = 0; i < this.layers.quantity; i++) {
            this.starObjects[i].position.z = this.currentLayersOffset * i - this.layers.MaxOffset / 2
            // this.starObjects[i].scale.x = this.currentLayersScale
            // this.starObjects[i].scale.y = this.currentLayersScale
        }

    }
    fadeIn() {
        // this.materialOpacity = 1
        if (this.materialOpacity < 1 && !this.state.isDying) {

            gsap.to(this, {
                materialOpacity: 1,
                duration: 0.5,
                onStart: function () { },
                onComplete: function () { }
            })
            this.state.isFaded = false
        }

        if (this.debug.debugCollision && !this.state.isFaded) {
            this.helpMaterial.color.set(this.debug.matSphereColor)
            this.helpers[0].material.color.set(this.debug.matBBColor)
        }
    }
    fadeOut() {
        // this.materialOpacity = 0
        gsap.to(this, {
            materialOpacity: 0,
            duration: 0.25,
            onComplete: function () { }
        })
        this.state.isFaded = true


        if (this.debug.debugCollision) {
            if (!this.state.isDying) {
                this.helpMaterial.color.set(this.debug.matFadeColor)
                this.helpers[0].material.color.set(this.debug.matFadeColor)
            } else {
                this.helpMaterial.color.set(this.debug.matDeadColor)
                this.helpers[0].material.color.set(this.debug.matDeadColor)
            }

        }
    }
    destroy(scene) {
        scene.remove(this.helpers[0]);
        scene.remove(this.starGroup);

        this.starGroup.clear()
        // this.objects = []

        this.starTextureUrls = []
        this.starTextures = []
        this.starMaterials = []
        this.starGeometries = []
        this.starObjects = []

        this.materialOpacity = 0

        this.set(scene)
    }
    intersects(other) {
        this.collision = this.bBoxes[0].intersectsBox(other.bBoxes[0])

        if (this.collision && !other.state.isFaded && !other.state.isDying) {
            this.state.isColliding = true
            return true
        } else {
            this.state.isColliding = false
            return false
        }
    }
    raycasting() {
        if (!this.state.isFaded && !this.state.isDying) {
            this.raycasteds = raycaster.intersectObjects(this.starObjects, true);
            this.selected = this.raycasteds.length > 0
        }

        if (this.selected) {
            this.state.isRaycasting = true
            gsap.to(this.starGroup.scale, { x: 1.1, y: 1.1, z: 1, duration: 0.5 })
            // this.zSpeed = 0
            // console.log(this)
        } else {
            this.state.isRaycasting = false
            // this.zSpeed = getRandomArbitrary(0.01, 0.025)
            gsap.to(this.starGroup.scale, { x: 1, y: 1, z: 1, duration: 0.2 })
        }
    }
    update(camera, scene) {
        this.bBoxes[0].copy(this.sphereObject.geometry.boundingBox).applyMatrix4(this.sphereObject.matrixWorld);

        this.move(camera, window.starsSpeedIncrement)
        this.raycasting()

        // this.material.opacity = this.materialOpacity


        for (let i = 0; i < this.layers.quantity; i++) {
            this.starMaterials[i].opacity = this.materialOpacity

            if(this.materialOpacity>0){ // dovrebbe risolvere il glitch di sovrapposizione se la stella più vicina è in fade
                this.starObjects[i].visible = true
            } else {
                this.starObjects[i].visible = false
            }
        }

        if (this.zGroupPos > this.end.zKillPos) {
            this.destroy(scene)
        } else if (this.zGroupPos > this.end.zDeadPos) {
            this.state.isDying = true
            this.fadeOut()
        }

    }


}


export default Star