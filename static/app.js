var markers = [{
  position: {lat: 51.512305, lng: -0.133842},
  title: "Snog"
},
{
  position: {lat: 51.511373, lng: -0.125712},
  title: "Snog"
},
{
  position: {lat: 51.494821, lng: -0.174168},
  title: "Snog"
},
{
  position: {lat: 51.518170, lng: -0.151208},
  title: "Snog"
},
{
  position: {lat: 51.507797, lng: -0.221578},
  title: "Snog"
},
];


function initMap() {
      var mapDiv = document.getElementById('map');
      var map = new google.maps.Map(mapDiv, {
          center: {lat: 51.507, lng: -0.128},
          zoom: 12
      });

      for (var i = 0; i < markers.length; i++){
        var marker = new google.maps.Marker({position: markers[i].position,
        map: map,
        title: markers[i].title});
      }


    }

function googleError() {
  console.log("Not loaded properly");
}
