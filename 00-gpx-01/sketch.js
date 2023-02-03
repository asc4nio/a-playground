var gpx = new gpxParser();

let parsedData

fetch('asset/percorso.gpx')
  .then(response => 
    response.text())
  .then((data) => {
    // console.log(data)
    gpx.parse(data)
    console.log(gpx)

    var totalDistance = gpx.tracks[0].distance.total;
    console.log(totalDistance)
  })

function setup() {
  createCanvas(innerWidth, innerHeight);


}

function draw() {
  for(let i=0; i<gpx.tracks[0].points.length; i++){
    let lat= gpx.tracks[0].points[i].lat
    let lon = gpx.tracks[0].points[i].lon

    let mapLat = map(lat,44.4,44.5,0,width)
    let mapLon = map(lon,11.3,11.5,0,height)

    circle(mapLat,mapLon,4)
  }

}


function windowResized() {
  console.log('resized')
  resizeCanvas(windowWidth, windowHeight);
}