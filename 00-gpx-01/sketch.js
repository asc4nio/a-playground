

/**https://docs.maptiler.com/maplibre-gl-js/tutorials/ */


// const key = 'jjhmmhhmzukLlOvf7UrF';

// var bounds = [
//   [11.4560, 44.4035], // Southwest coordinates
//   [11.2294, 44.5204] // Northeast coordinates
// ];



// const map2 = new maplibregl.Map({
//   container: 'map', // container's id or the HTML element in which MapLibre GL JS will render the map
//   style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`, // style URL
//   bounds: bounds,
//   offset: [0,0],

// });



///////////////////////////////////////////////////////////////

var gpx = new gpxParser();

let parsedData

fetch('asset/percorso.gpx')
  .then(response => 
    response.text())
  .then((data) => {
    // console.log(data)
    gpx.parse(data)
    console.log(gpx)

    let geoJSON = gpx.toGeoJSON();
    console.log(geoJSON)

    var totalDistance = gpx.tracks[0].distance.total;
    console.log(totalDistance)
  })

  let mapImage
  function preload(){
    mapImage = loadImage('asset/map3.jpg')
  }
function setup() {
  createCanvas(800, 800);
  clear()

  image(mapImage,0,0,width,height)

}

function draw() {
  beginShape()
  noFill()
  for(let i=0; i<gpx.tracks[0].points.length; i++){
    let lat= gpx.tracks[0].points[i].lat
    let lon = gpx.tracks[0].points[i].lon

    // let mapLat = map(lat,44.41,44.44,0,width)
    // let mapLon = map(lon,11.37,11.43,0,height)

    let mapLat = map(lat,44.4426,44.3849,0,width)
    let mapLon = map(lon,11.3569,11.4382,0,height)

    vertex(mapLon,mapLat)
    // push()
    //   noStroke()
    //   fill(255)
    //   circle(mapLat,mapLon,4)
    // pop()
  }
  endShape()

}


function windowResized() {
  console.log('resized')
  resizeCanvas(windowWidth, windowHeight);
}

