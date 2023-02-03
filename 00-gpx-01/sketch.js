/**https://docs.maptiler.com/maplibre-gl-js/tutorials/ */

/*
const key = 'cSp27W2Q0Ud3EyJfNsz2';

var bounds = [
  [11.32, 44.48], // Southwest coordinates
  [11.28, 44.52] // Northeast coordinates
];

const map2 = new maplibregl.Map({
  container: 'map', // container's id or the HTML element in which MapLibre GL JS will render the map
  style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${key}`, // style URL
  center: [11.342976, 44.496441], // starting position [lng, lat]
  zoom: 14, // starting zoom
  maxBounds: bounds // Sets bounds as max
});

map.fitBounds(bounds);
*/
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
    mapImage = loadImage('asset/map.png')
  }
function setup() {
  createCanvas(innerWidth, innerHeight);
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

    let mapLat = map(lat,44.4102,44.44,0,width)
    let mapLon = map(lon,11.3700,11.4297,0,height)

    vertex(mapLat,mapLon)
    push()
      noStroke()
      fill(255)
      circle(mapLat,mapLon,4)
    pop()
  }
  endShape()

}


function windowResized() {
  console.log('resized')
  resizeCanvas(windowWidth, windowHeight);
}