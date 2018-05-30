const neighborhoodsnamesURL = 'https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD';
const neighborhoodTabulationURL = 'https://data.cityofnewyork.us/api/views/q2z5-ai38/rows.json?accessType=DOWNLOAD';
const districtsNYURL = 'http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson';
const dataCrimesURL = 'https://data.cityofnewyork.us/resource/9s4h-37hy.json';
const housingNYURL = 'https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD';

/* Crime var data = $.ajax({
   url: "https://data.cityofnewyork.us/resource/9s4h-37hy.json", //Crimes URL
    //type: "GET", Opcional
    data: {
      "$limit" : 5000,
      "$$app_token" : "YOURAPPTOKENHERE" // Opcional
      "$cmplnt_to_dt" : '2016-0515T00:00:00.000'
    }
}).done(function(data) {
  //alert("Retrieved " + data.length + " records from the dataset!");
  console.log(data);
});
*/

var map;
var ny_coordinates = {lat: 40.720610, lng: -73.995242};
var bro_coordinates = {lat: 40.5002, lng: -73.949997};
var ny_university = {lat: 40.729576, lng: -73.996481};
var nyu_marker;
var bro_marker;
var directionsService;
var directionsRenderer;
var allDistrictMarkersFlag = false;


/*
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        zoom : 10,
        center: ny_coordinates
    });
    ny_marker = new google.maps.Marker({
        position: ny_coordinates,
        map: map
    });
    bro_marker = new google.maps.Marker({
        position: bro_coordinates,
        map: map
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    markerEvents(bro_marker);
}
function markerEvents(marker){
    if(marker != "undefined"){
        marker.addListener("click",function(){
            getRoute();
        });
    }
}
function getRoute(){
    var request = {
        origin: ny_marker.position,
        destination: bro_marker.position,
        travelMode: 'DRIVING'
    };
    directionsRenderer.setMap(map);
    directionsService.route(request,function(result,status){
        if(status == "OK"){
            directionsRenderer.setDirections(result);
        }
    });
} */
/*
var request = new XMLHttpRequest();
request.open('GET', districtsNYURL);
request.responseType = 'json';
request.send();

request.onload = function() {
  var districtsPolygons = request.response;

}*/



var geometry;
var BoroCD;
var APushed = false;
var NYNHNames = [];
var NYNHMarkers = [];
var NYHousing = []
var NYCrimes = [];
var NYDistricts = [];

var NYNHbounds;

$(document).ready( function(){
  $("#getDataButton").on("click", updateAllDatasets);  // Buttons
  $("#startMapButton").on("click", goMarker);
  $("#updateTableButton").on("click", updateTable);
  $("#showAllNeighborhoods").on("click", showAllNeighborhoods);
  $("#showAllMultipolygons").on("click", showAllMultipolygonsProperties);
})



function updateTable(){


  var NYCrimesSorted = NYCrimes.sort(function(a,b) {
      var o1 = a.boro_Id;
      var o2 = b.boro_Id;

      var p1 = a.precinct;
      var p2 = b.precinct;

      if (o1 < o2) return -1;
      if (o1 > o2) return 1;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
      return 0;});
  var NYHousingSorted = NYHousing.sort(function(a,b) {
    var o1 = a.boro_Id;
      var o2 = b.boro_Id;

      var p1 = a.district;
      var p2 = b.district;

      if (o1 < o2) return -1;
      if (o1 > o2) return 1;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
      return 0;});
  var NYDistrictsSorted =  NYDistricts.sort(function(a,b) {
    var o1 = a.boro_Id;
      var o2 = b.boro_Id;

      var p1 = a.district_nm;
      var p2 = b.district_nm;

      if (o1 < o2) return -1;
      if (o1 > o2) return 1;
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
      return 0;});
      console.log(NYCrimesSorted);
      console.log(NYHousingSorted);
  console.log(NYDistrictsSorted);
  safeLevel(NYCrimesSorted,NYDistrictsSorted);

  tableReference = $("#neighboorhoodsTableBody")[0];
  var newRow, state, pos;      // Hacer focus;
  for (var i = 0; i < NYNHNames.length; i++) {
    newRow = tableReference.insertRow(tableReference.rows.length);
    state = newRow.insertCell(0);
    pos = newRow.insertCell(1);
    state.innerHTML = NYNHNames[i].name;
    pos.innerHTML = "Fix";
  }
}
function safeLevel(dataCrimes, districts){
  districts.forEach(function(element){
  //  console.log(element);
    if (element.Coordinates.length!=1) {
      const result = dataCrimes.filter(function(el){
        return el.boro_Id == element.boro_Id});
      result.forEach(function(crime){

        for (var i = 0; i < element.Coordinates.length; i++) {

          //console.log(element.Coordinates[i][0]);
console.log(element.Coordinates[i][0]);
console.log(new google.maps.Polygon({
paths: element.Coordinates[i][0],
}));
google.maps.geometry.poly.containsLocation(new google.maps.Point(crime.lat_lon.coordinates[0],crime.lat_lon.coordinates[1]),element.Coordinates[i][0]);

        }
        console.log(crime.lat_lon.coordinates);
      })


      console.log("MultiPolygon");
    }
    else {
      console.log(element.Coordinates);
      console.log("Polygon");
    }
  })

}

function getDataFromUrl(URL, callback){
  var data = $.get(URL, function(){

  })
  .done(callback(URL))
  .fail( function(error){
    console.error(error);
  })
}
function EstoFunciona(URL){
  console.log(URL);
  //console.log("Funciona");

}

function updateAllDatasets(){
  getDataFromUrl(districtsNYURL,getNYDistricts);
  getDataFromUrl(neighborhoodsnamesURL,getNeighboorhoodsName);
  getDataFromUrl(dataCrimesURL,getDataCrimes);
  getDataFromUrl(districtsNYURL,drawCityFocus);
  getDataFromUrl(housingNYURL,getHousingData);
//  getDataFromUrl(dataCrimesURL,EstoFunciona);

}

function initMap() {
//  google.maps.event.addDomListener(map, 'click', initMap);
         map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: ny_coordinates,
        styles: [   //Blue essence
    {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#e0efef"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "hue": "#1900ff"
            },
            {
                "color": "#c0e8e8"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": 100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "lightness": 700
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#7dcdcd"
            }
        ]
    }
],

        noClear: true,
        clickableIcons: false,
        disableDoubleClickZoom: true,
        fullscreenControl:false,
        draggable: false,
        disableDefaultUI: true,
        keyboardShortcuts: false,
      });


      nyu_marker = new google.maps.Marker({
        position: ny_university,
        animation: google.maps.Animation.DROP,
        title:"NYU",

      });

}
  function Start(){
updateAllDatasets();
  var i = 0;
  function intro(){
    if (i<50){

      document.getElementById("floating-panel").style.opacity=1-(i/50);
      document.getElementById("map").style.opacity= i/50;
      $(".buttons-nav").css("opacity",i/25);
      $(".head-text").css("opacity",i/100);

      i++;
      setTimeout(intro,20);

    }
    else {
      document.getElementById("floating-panel").innerHTML='';
      setTimeout(goMarker,900);
    }



  }
  intro();
  }

  function showAllNeighborhoods(){
      var i = 0, to =  NYNHNames.length;
      if(!allDistrictMarkersFlag){
        allDistrictMarkersFlag=true;
      if(to!=0){
    //  map.data.loadGeoJson(neighborhoodTabulationURL);  // NOTE:
      smoothMarkers();
      }

    }
    function smoothMarkers(){
      if(i!=to-i-1){
        NYNHMarkers[i].setMap(map);
        NYNHMarkers[to-i-1].setMap(map);
      }
      else {
          NYNHMarkers[i].setMap(map);

      }
        i++;
        if(i < to/2){
           setTimeout(smoothMarkers,10);
        }
        else return;
    }
  }

  function goMarker(){   //zoom

    if(APushed){
  map = nyu_marker.getMap();
  map.setCenter(nyu_marker.getPosition());
  smoothZoom(map, 14, map.getZoom());

    } else {
        APushed = true;
        nyu_marker.setMap(map)

        showAllBoroughts();         //Pintar Los 5 Borughts

        map = nyu_marker.getMap();
        map.setCenter(nyu_marker.getPosition());
        smoothZoom(map, 12, map.getZoom());
    }
      }

      function smoothZoom (map, max, cnt) {
    if (cnt >= max) {
        nyu_marker.setAnimation(null);
        nyu_marker.setLabel("NYU");
        map.setOptions({
          clickableIcons: true,
          disableDoubleClickZoom: false,
          fullscreenControl:true,
          draggable: true,
          disableDefaultUI: false,
          keyboardShortcuts: true ,
        });
        return;
    }
    else {
    nyu_marker.setAnimation(google.maps.Animation.BOUNCE);
    map = nyu_marker.getMap();
    map.setCenter(nyu_marker.getPosition());
        z = google.maps.event.addListener(map, 'zoom_changed', function(event){
            google.maps.event.removeListener(z);
            smoothZoom(map, max, cnt + 0.2);
        });

        setTimeout(function(){map.setZoom(cnt)}, 100);
    }
}


/*function drawPolygon(polygon,stColor,fllColor){
    var shape = new google.maps.Polygon({
          paths: polygon,
          strokeColor: stColor,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: fllColor,
          fillOpacity: 0.35
        });
    shape.setMap(map);
}*/
function getDataCrimes(URL){

   var data = $.ajax({
       url: URL+"?cmplnt_to_dt=2015-12-31T00:00:00.000&$where=lat_lon IS NOT NULL", //Crimes URL

    }).done(function(data) {
      //alert("Retrieved " + data.length + " records from the dataset!");
     // console.log(data);

        var boro_nm;
        var addr_pct_cd;
        var lat_lon;
        var cmplnt_fr_dt;
        var year;
        var description;
      $.each(data,function(key, val){
        boro_nm = val.boro_nm;
        addr_pct_cd = val.addr_pct_cd;
        lat_lon = val.lat_lon;
        cmplnt_fr_dt = val.cmplnt_fr_dt.slice(0,10);
        year = cmplnt_fr_dt.slice(0,4);
        description = val.ofns_desc;


        switch (boro_nm) {
          case 'MANHATTAN':
            NYCrimes.push({"boro_Id":1,"boro_nm": boro_nm, "precinct": addr_pct_cd, "lat_lon": lat_lon, "date": cmplnt_fr_dt, "year": year, "description":description});

            //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'}); // Manhattan
            break;
          case 'BRONX':
          NYCrimes.push({"boro_Id":2,"boro_nm": boro_nm, "precinct": addr_pct_cd, "lat_lon": lat_lon, "date": cmplnt_fr_dt, "year": year, "description":description});

            //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});     //The Bronx
            break;
          case 'BROOKLYN':
          NYCrimes.push({"boro_Id":3,"boro_nm": boro_nm, "precinct": addr_pct_cd, "lat_lon": lat_lon, "date": cmplnt_fr_dt, "year": year, "description":description});

          //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});//Brooklyn
            break;
          case 'QUEENS':
          NYCrimes.push({"boro_Id":4,"boro_nm": boro_nm, "precinct": addr_pct_cd, "lat_lon": lat_lon, "date": cmplnt_fr_dt, "year": year, "description":description});

          //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});//Queens
            break;
          case 'STATEN ISLAND':
          NYCrimes.push({"boro_Id":5,"boro_nm": boro_nm, "precinct": addr_pct_cd, "lat_lon": lat_lon, "date": cmplnt_fr_dt, "year": year, "description":description});

          //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});//Staten Island
            break;

          }


      })
    });

}
function getHousingData(URL){

  $.getJSON(URL, function (data) {
    //console.log(data);

    var subDistrict;
    var coordinates;
    $.each(data.data, function(key, val){
    subDistrict = val[19].slice(-2);
    coordinates = [val[23],+val[24]];
    switch (val[15]) {
      case 'Manhattan':
        NYHousing.push({"boro_Id":1,"boro_nm":val[15], "lat_lon":coordinates, "extremely low income units": val[31], "district":subDistrict });

        //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'}); // Manhattan
        break;
      case 'Bronx':
      NYHousing.push({"boro_Id":2,"boro_nm":val[15], "lat_lon":coordinates, "extremely low income units": val[31], "district":subDistrict });

        //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});     //The Bronx
        break;
      case 'Brooklyn':
NYHousing.push({"boro_Id":3,"boro_nm":val[15], "lat_lon":coordinates, "extremely low income units": val[31], "district":subDistrict });

      //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});//Brooklyn
        break;
      case 'Queens':
NYHousing.push({"boro_Id":4,"boro_nm":val[15], "lat_lon":coordinates, "extremely low income units": val[31], "district":subDistrict });

      //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});//Queens
        break;
      case 'Staten Island':
NYHousing.push({"boro_Id":5,"boro_nm":val[15], "lat_lon":coordinates, "extremely low income units": val[31], "district":subDistrict });

      //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});//Staten Island
        break;

      }

    //BLLELIU  = val[15]+', '+val[23]+', '+val[24]+', '+val[31]+', '+val[20]+', '+subDistrict;   //31 Extremely low income units, 20 Council, 19 district number

    })
  });
}
function getNYDistricts(URL){
  //var Polygon = [];
  var boro_nm;

      $.getJSON(URL, function(data){
          //console.log(data);
        $.each(data.features, function (key, val) {
             //BRonx 2, Brooklyn 3, Queens 4, Staten Island 5


            boro_nm = val.properties.BoroCD.toString().slice(0,1);
          //  console.log(boro_nm);
          var points = [];
          var multiPoints = [];
          if(val.geometry.type=='Polygon'){
            for (var i = 0; i < val.geometry.coordinates[0].length; i++) {
                points.push(new google.maps.LatLng(val.geometry.coordinates[0][i][1],val.geometry.coordinates[0][i][0]));
            }
            multiPoints.push(points);
          } else {
            for (var i = 0; i < val.geometry.coordinates[0].length; i++) {
              for (var j = 0; j < val.geometry.coordinates[i][0].length; j++) {
                points.push(new google.maps.LatLng(val.geometry.coordinates[i][0][j][1],val.geometry.coordinates[i][0][j][0]));
              }
              multiPoints.push(points);
            }

          }
          console.log(multiPoints);
          switch (boro_nm) {
              case '1':
              boro_nm = 'Manhattan';
        if(val.properties.BoroCD.toString().slice(1)<=12) {
            NYDistricts.push({"boro_Id": 1,"boro_nm": 'Manhattan',"district_nm":val.properties.BoroCD.toString().slice(1), "Coordinates":points});
        }
                break;
              case '2':
                boro_nm = 'Bronx';
        if(val.properties.BoroCD.toString().slice(1)<=12) {
            NYDistricts.push({"boro_Id": 2,"boro_nm": 'Bronx',"district_nm":val.properties.BoroCD.toString().slice(1), "Coordinates":val.geometry.coordinates});
        }
                break;
              case '3':
                boro_nm = 'Brooklyn';
        if(val.properties.BoroCD.toString().slice(1)<=18) {
            NYDistricts.push({"boro_Id": 3,"boro_nm": 'Brooklyn',"district_nm":val.properties.BoroCD.toString().slice(1), "Coordinates":val.geometry.coordinates});
        }
                break;
              case '4':
                boro_nm = 'Queens';
        if(val.properties.BoroCD.toString().slice(1)<=14) {
            NYDistricts.push({"boro_Id": 4,"boro_nm": 'Queens',"district_nm":val.properties.BoroCD.toString().slice(1), "Coordinates":val.geometry.coordinates});
        }
                break;
              case '5':
                boro_nm = 'Staten Island';
        if(val.properties.BoroCD.toString().slice(1)<=3) {
            NYDistricts.push({"boro_Id": 5,"boro_nm": 'Staten Island',"district_nm":val.properties.BoroCD.toString().slice(1), "Coordinates":val.geometry.coordinates});
        }
                break;
            }
          //  console.log(val.properties.BoroCD);

          //  Polygon.push(val.geometry);
          //  console.log(val.geometry);
});
        //NYDistricts.push({"polygons": Polygon})

      })
}

function getNeighboorhoodsName(URL){    // get the names of every neighborhood, a similar method will get centroid

 //NYNHbounds = new google.maps.LatLngBounds();
 if(NYNHNames.length==0){
   $.getJSON(URL, function (data) {
     console.log(data);
     $.each(data.data, function (key, val) {
       var MarkerPosition = {lat: parseFloat(val[9].slice(7).replace(")","").split(" ")[1]), lng:parseFloat(val[9].slice(7).replace(")","").split(" ")[0])},
       NBH_marker =  new google.maps.Marker({
       label:val[10].charAt(0),
       position: MarkerPosition,

       animation: google.maps.Animation.DROP,
       icon: {
      path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
      scale: 1,
      labelOrigin: new google.maps.Point(0, -10),
  //    anchor: new google.maps.Point(0, 32)

    },
       title:val[10]
     });
     //console.log({lat: parseFloat(val[9].slice(7).replace(")","").split(" ")[1]), lng:parseFloat(val[9].slice(7).replace(")","").split(" ")[0])});

      var parseName = JSON.parse('{"name":"'+val[10]+'"}');
     //  var name = {name: , val[10], point:, val[9].slice(7).replace(")","").split(" ")+'"}';
       NYNHNames.push(parseName);
       NYNHMarkers.push(NBH_marker);
       var infowindow = new google.maps.InfoWindow({
             content: val[10]
           });
           NBH_marker.addListener('mouseover', function() {
            infowindow.open(map, NBH_marker);

          });
          NBH_marker.addListener('mouseout', function() {
            infowindow.close();

});

   })

 });
 }
}
function drawCityFocus(URL){
  map.data.loadGeoJson(districtsNYURL);
  // Set the global styles.
  //console.log(map.data);
  map.data.setStyle({
    fillColor: '#87cefa',
    strokeColor: '#800000',
    strokeWeight: 3,
    strokeOpacity: 0.4,
    fillOpacity: 0.3
  }  );


  map.data.addListener('click', function(event) {

  var color = getRandomColor();
  map.data.overrideStyle(event.feature, {fillColor: color});
  });

//drawPolygon(triangleCoords);

//console.log(items[0]);

  function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
    for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
    }
  return color;
  }
}

function drawMultipolygons(URL){      // Mas Tarde
  var coordinatesBorder = map.getBounds();
  var items = [];

  $.getJSON(URL, function (data) {// QUESTION: How to get and DRAW de multypoligons in a right way?
               $.each(data.features, function (key, val) {

                 var coords = [];

                 $.each(val.geometry.coordinates, function(first,second){
                   if (val.geometry.type=="Polygon") {
                     for (var i = 0; i < second.length; i++) {
                      // console.log("{lat: "+j[i][1]+" lng: "+j[i][0]+"}");
                      //console.log(jsonCoords);

                       coords.push(JSON.parse(JSON.stringify({lat: +second[i][1], lng: +second[i][0]})));
                     }

                   } else {

                     for (var i = 0; i < second[0].length; i++) {
                      //console.log("{lat: "+j[0][i][1]+" lng: "+j[0][i][0]+"}");
                    //  coords.push("{lat: "+j[0][i][1]+" lng: "+j[0][i][0]+"}");

                      coords.push(JSON.parse(JSON.stringify({lat: +second[0][i][1], lng: +second[0][i][0]})));
                     }
                   }

                 })

items.push(val.geometry.type,coords);
});
//drawPolygon(BoundsCoords,'#1a0d00','#87CEFA');

for (var i = 0; i < (items.length/2)-1; i++) {

 if (items[2*i]=="Polygon"){

   map.data.add({geometry: new google.maps.Data.Polygon([items[2*i+1]])});
 }
 else {
// Can´t draw the multipoligons in a right way..

 }
}
});
}

function showAllMultipolygonsProperties(){
console.log(map.data);
  map.data.forEach(function(feature) {
console.log(feature.f.BoroCD);
    if (feature.getGeometry().getType() == "MultiPolygon"){
        //console.log("Funciona");
        map.data.overrideStyle(feature, {fillColor: 'red'});
    }


});
}
function showAllBoroughts(){

  map.data.forEach(function(feature) {
    var BoroughtNumber = Math.floor(feature.f.BoroCD/100);
  //  console.log(BoroughtNumber);
  switch (BoroughtNumber) {
    case 1:

      if(feature.f.BoroCD.toString().slice(1)<=12)  map.data.overrideStyle(feature, {fillColor: '#364a9e'});
      //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'}); // Manhattan
      break;
    case 2:

      if(feature.f.BoroCD.toString().slice(1)<=12) map.data.overrideStyle(feature, {fillColor: '#de4135' });
      //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});     //The Bronx
      break;
    case 3:

    if(feature.f.BoroCD.toString().slice(1)<=18)  map.data.overrideStyle(feature, {fillColor: '#fadc3b'});
    //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});//Brooklyn
      break;
    case 4:

    if(feature.f.BoroCD.toString().slice(1)<=14)  map.data.overrideStyle(feature, {fillColor: '#f5893b'});
    //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});//Queens
      break;
    case 5:

    if(feature.f.BoroCD.toString().slice(1)<=3) map.data.overrideStyle(feature, {fillColor: '#954291'});
    //map.data.overrideStyle(feature, {fillColor: '#a9a9a9'});//Staten Island
      break;

    }



  });
}
