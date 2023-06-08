import * as THREE from 'three';
const manager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(manager);

let iconsTexturesURL = [
    './asset/icon-01.png',
    './asset/icon-02.png',
    './asset/icon-03.png',
    './asset/icon-04.png',
    './asset/icon-05.png',
]



manager.onStart = function (url, itemsLoaded, itemsTotal) {
    console.log(
        "Started loading file: " +
        url +
        ".\nLoaded " +
        itemsLoaded +
        " of " +
        itemsTotal +
        " files."
    );
};
// manager.onLoad = function () {
//     console.log("Loading complete!");
//     setPanels();
// };
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    console.log(
        "Loading file: " +
        url +
        ".\nLoaded " +
        itemsLoaded +
        " of " +
        itemsTotal +
        " files."
    );
};
manager.onError = function (url) {
    console.log("There was an error loading " + url);
};



export const loadIconsMaterial = () => {
    let materials = []

    for (let i = 0; i < iconsTexturesURL.length; i++) {
        loader.load(
            iconsTexturesURL[i],
            function (texture) {
                texture.colorSpace = THREE.SRGBColorSpace;
                    
                materials[i] = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    map: texture,
                    transparent: true,
                });
            },
            undefined,
            function (err) {
                console.error("An error happened.");
            }
        );
    }

    manager.onLoad = function () {
        console.log("Loading complete!");
        
        return materials
    };

}


