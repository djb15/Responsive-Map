var locations = [{
  position: {lat: 51.512305, lng: -0.133842},
  title: "Snog: Soho",
  label: "S"
},
{
  position: {lat: 51.511373, lng: -0.125712},
  title: "Snog: Covent Garden",
  label: "S"
},
{
  position: {lat: 51.494821, lng: -0.174168},
  title: "Snog: South Kensington",
  label: "S"
},
{
  position: {lat: 51.507797, lng: -0.221578},
  title: "Snog: Westfield",
  label: "S"
},
{
  position: {lat: 51.492152, lng: -0.177915},
  title: "GBK: South Kensington",
  label: "GBK"
},
{
  position: {lat: 51.492654, lng: -0.193637},
  title: "GBK: Earls Court",
  label: "GBK"
},
{
  position: {lat: 51.480274, lng: -0.196030},
  title: "GBK: Fulham Broadway",
  label: "GBK"
},
{
  position: {lat: 51.510679, lng: -0.123120},
  title: "GBK: Covent Garden",
  label: "GBK"
},
{
  position: {lat: 51.513789, lng: -0.131502},
  title: "GBK: Soho",
  label: "GBK"
},
{
  position: {lat: 51.520703, lng: -0.156691},
  title: "GBK: Baker Street",
  label: "GBK"
},
{
  position: {lat: 51.524472, lng: -0.124266},
  title: "GBK: Russel Square",
  label: "GBK"
},
{
  position: {lat: 51.513245, lng: -0.099407},
  title: "GBK: St Pauls",
  label: "GBK"
},
{
  position: {lat: 51.502681, lng: -0.110183},
  title: "GBK: Waterloo",
  label: "GBK"
},
{
  position: {lat: 51.506998, lng: -0.092016},
  title: "GBK: Southbank",
  label: "GBK"
},
{
  position: {lat: 51.508991, lng: -0.080209},
  title: "GBK: Tower of London",
  label: "GBK"
},
{
  position: {lat: 51.519583, lng: -0.075810},
  title: "GBK: Spitalfields",
  label: "GBK"
},
];

var markers = ko.observableArray();

function initMap() {
  var mapDiv = document.getElementById('map');
  var map = new google.maps.Map(mapDiv, {
    center: {lat: 51.507, lng: -0.128},
    zoom: 12
  });

  for (var i = 0; i < locations.length; i++){
    var marker = new google.maps.Marker({position: locations[i].position,
    map: map,
    label: locations[i].label,
    title: locations[i].title});
    markers.push(marker);
  }
}

function googleError() {
  console.log("Not loaded properly");
}

function toggleBounce() {
       if (marker.getAnimation() !== null) {
         marker.setAnimation(null);
       } else {
         marker.setAnimation(google.maps.Animation.BOUNCE);
       }
     }

var ViewModel = function(markers){
  this.markers = markers;
  return this.markers;
};

$(function () {
  ko.applyBindings(new ViewModel(markers));

  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
      $("#menu-toggle").toggleClass("toggled");
  });
});
