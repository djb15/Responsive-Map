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

var markers = [];
var map;
var infoWindow;

var initMap = function() {
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
    center: {lat: 51.507, lng: -0.128},
    zoom: 12
  });

  for (var i = 0; i < locations.length; i++){
    var marker = new google.maps.Marker({position: locations[i].position,
    map: map,
    //label: locations[i].label,
    title: locations[i].title});
    marker.metadata = i;
    markers.push(marker);
    add_animation(marker);
  }
  infoWindow =  new google.maps.InfoWindow({
       content: ""
   });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
    var pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    var my_location_icon = {
      url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
      scaledSize: new google.maps.Size(20, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 32)
    };
    var marker = new google.maps.Marker({position: pos,
      map: map,
      icon: my_location_icon});
    });
  } 

  ko.applyBindings(new ViewModel());
};

function add_animation(marker){
  marker.addListener('click', function() {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 700);
    showInfo(marker);
    $(".places").removeClass("clicked");
    $("#" + marker.metadata).addClass("clicked");
  });
}


function googleError() {
  console.log("Not loaded properly");
}

function showInfo(marker){
  infoWindow.setContent(marker.title);
  infoWindow.open(map, marker);
  google.maps.event.addListener(infoWindow,'closeclick',function(){
    $(".places").removeClass("clicked");
    //removes the marker
   // then, remove the infowindows name from the array
});
}

function closeInfo(){
  infoWindow.close();
}

function selectMarker(marker){
  if ($("#" + marker.metadata).hasClass("clicked")){
    $("#" + marker.metadata).toggleClass("clicked");
    closeInfo();
  }
  else{
    google.maps.event.trigger(marker, 'click');
    $(".places").removeClass("clicked");
    $("#" + marker.metadata).toggleClass("clicked");
  }
}

var ViewModel = function(){
  var self = this;
  self.inputText = ko.observable('');
  self.ko_markers = ko.observableArray();

  self.selectMarker = function(marker){
    selectMarker(marker);
  };


  var all_markers = function(){
    for (var x = 0; x < markers.length; x++){
      self.ko_markers.push(markers[x]);
      markers[x].setVisible(true);
    }
  };

  all_markers();

  var search = function (){
    if (!self.inputText()){
      self.ko_markers.removeAll();
      all_markers();
    }
    else {
      self.ko_markers.removeAll();
      for (var x = 0; x < markers.length; x++){
        if(markers[x].title.toLowerCase().indexOf(self.inputText().toLowerCase()) >= 0) {
          self.ko_markers.push(markers[x]);
          markers[x].setVisible(true);
        }
        else{
          markers[x].setVisible(false);
        }
      }
    }
  };

  self.inputText.subscribe(search);
};


$(function () {
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
      $("#menu-toggle").toggleClass("toggled");
  });
});
