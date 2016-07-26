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

//Some global variables being defined
var markers = [];
var map;
var infoWindow;
var mypos;
var xhr = null;

var initMap = function() {
  //Initialise the google map and add all the markers to the map
  var mapDiv = document.getElementById('map');
  map = new google.maps.Map(mapDiv, {
    center: {lat: 51.507, lng: -0.128},
    zoom: 12
  });

  for (var i = 0; i < locations.length; i++){
    var marker = new google.maps.Marker({position: locations[i].position,
    map: map,
    title: locations[i].title});
    marker.metadata = i;
    markers.push(marker);
    add_animation(marker);
  }
  //Initialise the info window for use later
  infoWindow =  new google.maps.InfoWindow({
       content: ""
   });

  if (navigator.geolocation) {
    //Get the users current location and add a marker to the map
    navigator.geolocation.getCurrentPosition(function(position) {
    my_pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
      //Check to see if the user's location is supported by citymapper
      $.ajax({url: "https://developer.citymapper.com/api/1/singlepointcoverage/?coord=" + my_pos.lat + "%2C" + my_pos.lng + "&key=c71aa0158f72d9c3a84be9070cf45427",
              dataType: 'jsonp',
              success: function(data){
                within_bounds(data);
              },
              error: function(data){
                alert("Your location could not be checked by citymapper.  Please reload your page and try again");
              }
              });

    }, function (error) {
      if (error.code == error.PERMISSION_DENIED)
        alert("You need location enabled for this website to work.  Please reload this website and enable location services.  Your location has been set to London so you can view the functionality of the website");
        my_pos = {lat: 51.578973, lng: -0.124147};
        set_location();
      }
    );
  }

  else {
    alert("You need a location enabled device for this website to work.  Your location has been set to London for you to view the functionality of the website.");
    my_pos = {lat: 51.578973, lng: -0.124147};
    set_location();
  }
  //Apply bindings only after map has been initialsed
  ko.applyBindings(new ViewModel());
};

function within_bounds(data){
  //Handling for the citymapper API coverage checker
  if (data.error_message) {
    alert("Your location could not be checked by citymapper.  Please reload the page and try again");
  }

  else if (data.points[0].covered === false){
    alert("You do not lie within the citymapper API coverage area.  As such your location has been set to London so you can view the functionality of the website");
    my_pos = {lat: 51.578973, lng: -0.124147};
    set_location();
  }
  else {
    set_location();
  }

}

function set_location(){
  //Sets the user's location on the map after checking with citymapper
  var my_location_icon = {
    url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    scaledSize: new google.maps.Size(20, 32),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(0, 32)
  };

  var marker = new google.maps.Marker({position: my_pos,
    map: map,
    icon: my_location_icon});
}

function googleError(){
  //Pop up alert if google map script could not be loaded
  alert("The google map API could not be reached");
}

function add_animation(marker){
  //Function adds the bounce animation to markers and links with list view
  marker.addListener('click', function() {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function(){ marker.setAnimation(null); }, 700);
    showInfo(marker);
    $(".places").removeClass("clicked");
    $("#" + marker.metadata).addClass("clicked");
  });
}

function call_citymapper(marker, callback){
  //Make an async ajax request to citymapper
  if (xhr !== null){
    xhr.abort();
  }
  var latlng = locations[marker.metadata].position;
  var end_location = latlng.lat + "%2C" + latlng.lng;
  var start_location = my_pos.lat + "%2C" + my_pos.lng;
  var directions = "https://citymapper.com/directions?startcoord=" + start_location + "&endcoord=" + end_location + "&endname=" + escape(marker.title);

  xhr = $.ajax({url: "https://developer.citymapper.com/api/1/traveltime/?startcoord=" + start_location + "&endcoord=" + end_location + "&key=c71aa0158f72d9c3a84be9070cf45427",
    //headers: {"Access-Control-Allow-Origin": "*"},
    //crossDomain: true,
    dataType: "jsonp",
    //contentType: "text/plain",
  //  xhrFields: {
      //withCredentials: false
    //},
    success: function(data){
      callback(data, marker, directions);
    },
    error: function(xhr){
      if (!userAborted(xhr)){
        setTimeout(function(){citymapper_error(marker);}, 100);
      }
    }
  });
}

function userAborted(xhr) {
  //Checks to see if the user has aborted the ajax request to handle errors
  return !xhr.getAllResponseHeaders();
}

function citymapper_callback(data, marker, directions){
  //The callback from citymapper to update the info window
  var travel_time = data.travel_time_minutes;
  var window_content = "<h4 align='center'>" + marker.title + "</h4><p align='center'><a href="+ directions + "><button type='button' class='btn btn-default'>" + travel_time + " minutes to destination</button></a></p>";
  infoWindow.setContent(window_content);
}

function citymapper_error(marker){
  //Update the info window if ajax call to citymapper returns error
  infoWindow.setContent("<h4 align='center'>"+ marker.title + "</h4><p align='center'>Citymapper could not be loaded</p>");
}

function showInfo(marker){
  //Opens the info window with basic data before ajax call succeeds
  call_citymapper(marker, citymapper_callback);
  infoWindow.setContent("<h4 align='center'>" + marker.title + "</h4><p align='center'>Loading...</p>");
  infoWindow.open(map, marker);
  google.maps.event.addListener(infoWindow,'closeclick',function(){
      $(".places").removeClass("clicked");
  });

}

function closeInfo(){
  infoWindow.close();
}

function selectMarker(marker){
  //Handles the list elements and their styling
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
  //The knockout viewmodel
  var self = this;
  self.inputText = ko.observable('');
  self.ko_markers = ko.observableArray();

  self.selectMarker = function(marker){
    selectMarker(marker);
  };


  var all_markers = function(){
    //Adds all the markers to the ko_markers observable array and shows all markers on map
    for (var x = 0; x < markers.length; x++){
      self.ko_markers.push(markers[x]);
      markers[x].setVisible(true);
    }
  };

  all_markers();

  var search = function (){
    //Search function used to filter the list and show/hide the corresponding markers on map
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
  //Handles the menu button on page load
  $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
      $("#menu-toggle").toggleClass("toggled");
  });
});
