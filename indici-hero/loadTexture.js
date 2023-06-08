import * as THREE from 'three';



const manager = new THREE.LoadingManager();
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
// };
manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    // console.log(
    //     "Loading file: " +
    //     url +
    //     ".\nLoaded " +
    //     itemsLoaded +
    //     " of " +
    //     itemsTotal +
    //     " files."
    // );
};
manager.onError = function (url) {
    console.log("There was an error loading " + url);
};

const loader = new THREE.TextureLoader(manager);


let iconsLayersURLS = [
    [
        './asset/icons-layers/icon01-01.png',
        './asset/icons-layers/icon01-02.png',
        './asset/icons-layers/icon01-03.png',
    ],
    [
        './asset/icons-layers/icon02-01.png',
        './asset/icons-layers/icon02-02.png',
        './asset/icons-layers/icon02-03.png',
    ],
    [
        './asset/icons-layers/icon03-01.png',
        './asset/icons-layers/icon03-02.png',
        './asset/icons-layers/icon03-03.png',
    ],
    [
        './asset/icons-layers/icon04-01.png',
        './asset/icons-layers/icon04-02.png',
        './asset/icons-layers/icon04-03.png',
    ],
    [
        './asset/icons-layers/icon05-01.png',
        './asset/icons-layers/icon05-02.png',
        './asset/icons-layers/icon05-03.png',
    ],
]



export const loadIconsMaterials = () => {
    for (let iLayers of iconsLayersURLS) {

        let materialGroup = []


        for (let iTextureURL of iLayers) {


            loader.load(
                iTextureURL,
                function (texture) {
                    texture.colorSpace = THREE.SRGBColorSpace;

                    let iMaterial = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: texture,
                        transparent: true,
                    });

                    materialGroup = [...materialGroup, iMaterial]

                    if (materialGroup.length === iLayers.length) {
                        iconsMaterials = [...iconsMaterials, materialGroup]
                    }



                },
                undefined,
                function (err) {
                    console.error("An error happened.");
                }
            );



        }

    }

    manager.onLoad = function () {
        console.log('IconsMaterials Loading complete!', iconsMaterials);

        threeState.iconsMaterialsLoaded = true

    };

}