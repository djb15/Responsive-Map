function initMap() {
      var mapDiv = document.getElementById('map');
      var map = new google.maps.Map(mapDiv, {
          center: {lat: 51.507, lng: -0.128},
          zoom: 12
      });
    }
