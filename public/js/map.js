let mapToken = maptoken;
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // Use the correct container id
  style: "mapbox://styles/mapbox/streets-v12",
  center: coordinates, //[longitude and altitude]
  zoom: 9,
});

console.log(coordinates);
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>Exact location after booking</h5>`
    )
  )
  .addTo(map);
