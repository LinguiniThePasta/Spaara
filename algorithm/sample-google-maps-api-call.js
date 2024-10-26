/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

function initMap() {
	var pyrmont = new google.maps.LatLng(45.745995, -73.987842);
	infowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 15
    });


  var request = {
    location: pyrmont,
    radius: '32093',
    type: ['supermarket']
  };

	let arr = []
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, (results, status) => callback(results, status, arr));

  console.log(arr);



}
function callback(results, status, arr) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
      arr.push(`${results[i].geometry.location}`)
    }
  }
  console.log(arr);
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  const marker = new google.maps.Marker({
    map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", () => {
    infowindow.setContent(place.name || "");
    infowindow.open(map);
  });
}
window.initMap = initMap;
