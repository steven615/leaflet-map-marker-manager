var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  osm = L.tileLayer(osmUrl, { maxZoom: 19, attribution: osmAttrib });

var map = L.map('map', { rotate: true })
  .setView([55, 10], 2)
  .addLayer(osm);

// Markers layer
var markersLayer = new L.LayerGroup();
markersLayer.addTo(map);

// Custom Icon Class
var LeafIcon = L.Icon.extend({
  options: {
    shadowUrl: './img/leaf-shadow.png',
    iconSize: [38, 95],
    shadowSize: [50, 64],
    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],
    popupAnchor: [-3, -76]
  }
});

// Layers control
var baseLayers = {
  'OpenStreetMap': osm,
  'Kartverket Topo4': L.tileLayer("http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=topo4&zoom={z}&x={x}&y={y}", {
    maxZoom: 20,
    attribution: '&copy; <a href="http://kartverket.no/">Kartverket</a>'
  }),
  'Kartverket Grunnkart': L.tileLayer("http://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}", {
    maxZoom: 20,
    attribution: '&copy; <a href="http://kartverket.no/">Kartverket</a>'
  }),
  'OSM Outdoors': L.tileLayer("https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=6a4b2c7126aa4bc5925a408547563f04", {
    maxZoom: 18,
    attribution: 'Data: <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> Maps: <a href="http://thunderforest.com">Thunderforest</a>'
  })
};

// var gpxLayer = [];
// // Angi GPX-fil:
// gpxLayer[0] = omnivore.gpx('gpx/TK1A TK1B.gpx', null, customLayers[0]);
// gpxLayer[0].bindPopup("SS1");
// gpxLayer[0].addTo(map);

// gpxLayer[1] = omnivore.gpx('gpx/TK2A TK2B.gpx', null, customLayers[1]);
// gpxLayer[1].bindPopup("SS2");
// gpxLayer[1].addTo(map);

// gpxLayer[2] = omnivore.gpx('gpx/TK3A TK3B.gpx', null, customLayers[2]);
// gpxLayer[2].bindPopup("SS3");
// gpxLayer[2].addTo(map);

// gpxLayer[3] = omnivore.gpx('gpx/Start til TK1A.gpx', null, customLayers[3]);
// gpxLayer[3].bindPopup("Transport Start TK1A");
// gpxLayer[3].addTo(map);

var overlays = {
  // "SS1 TK1A TK1B": gpxLayer[0],
  // "SS2 TK2A TK2B": gpxLayer[1],
  // "SS3 TK3A TK3B": gpxLayer[2],
  // "Transport": gpxLayer[3]
};
L.control.layers(baseLayers, overlays).addTo(map);

var markers = [
  { id: 1623775169972, lat: 41.15073112526065, lng: -0.8652851556800202, title: '', icon: '', icon_size: '', zoom: '', rotate_degress: '' },
  { id: 1623775170372, lat: 57.342169235132246, lng: 87.3332029115586, title: '', icon: '', icon_size: '', zoom: '', rotate_degress: '' },
  { id: 1623775170637, lat: 74.94762587670722, lng: 44.71443824176672, title: '', icon: '', icon_size: '', zoom: '', rotate_degress: '' },
  { id: 1623775170892, lat: 75.45902061815798, lng: -16.46102514018512, title: '', icon: '', icon_size: '', zoom: '', rotate_degress: '' },
  { id: 1623775171452, lat: 32.91290821428115, lng: -82.76142872535445, title: '', icon: '', icon_size: '', zoom: '', rotate_degress: '' },
  { id: 1623775171804, lat: 18.491745874330448, lng: -22.616107556876628, title: '', icon: '', icon_size: '', zoom: '', rotate_degress: '' },
  { id: 1623775172140, lat: 10.44521184131364, lng: 45.953201736477055, title: '', icon: '', icon_size: '', zoom: '', rotate_degress: '' },
  { id: 1623775169620, lat: 63.29688735598329, lng: -50.149000943641326, title: 'test', icon: './img/leaf-green.png', icon_size: '38, 95', zoom: '2', rotate_degress: '45' }
];// Array of markers from the database.
var mapMarkers = []; // Array of markers that added to map.
var addable = false; // If true, can add the new marker.
var moveable = false; // If true, can move markers.
var deleteable = false; // If true, can delete markers.
var editable = false; // If true, can update the markers in table.
var editingMarker = { id: 0, name: '' }; // marker id and field name of editing marker.

// When the page full loaded, draw markers.
var tid = setInterval(function () {
  if (document.readyState !== 'complete') return;
  clearInterval(tid);

  init();
}, 100);

// Toggle marker add mode.
document.querySelector('#add_marker').onclick = function () {
  addable = !addable;
  setInitVal('addable');
  // Default cursor and the text of the button.
  var cursor = '';
  this.innerHTML = 'Add Marker';

  if (addable) {
    cursor = 'pointer';
    this.innerHTML += '(active)';
  }

  document.querySelector('.leaflet-container').style.cursor = cursor;
};

// Toggle marker move mode.
document.querySelector('#move_marker').onclick = function () {
  moveable = !moveable;
  setInitVal('moveable');
  if (moveable) {
    this.innerHTML += '(active)';
    mapMarkers.forEach(function (m) {
      m.dragging.enable();
    });
  } else {
    this.innerHTML = 'Move Marker';
    mapMarkers.forEach(function (m) {
      m.dragging.disable();
    });
  }
};

// Toggle marker delete mode
document.querySelector('#delete_marker').onclick = function () {
  deleteable = !deleteable;
  setInitVal('deleteable');

  this.innerHTML = 'Delete Marker';
  if (deleteable) {
    this.innerHTML += '(active)';
  }
};

// Toggle edit marker in the table.
document.querySelector('#edit_marker').onclick = function () {
  editable = !editable;
  setInitVal('editable');

  this.innerHTML = 'Edit Marker';
  if (editable) {
    this.innerHTML += '(active)';
  }
};

map.on('click', function (e) {
  // if addable marker, add marker
  if (addable) {
    addMarker(e);
  }
});

document.querySelector('#markers_tbl').onclick = function (e) {
  var target = e.target;
  if (target.localName !== 'td' || !editable) return;

  editingMarker.id = target.parentNode.dataset.id;
  editingMarker.name = target.dataset.name;

  // Add the input tag to the selected td.
  var input = document.createElement('input');

  if (editingMarker.name === 'title' || editingMarker.name === 'icon' || editingMarker.name === 'icon_size') {
    input.type = 'text';
  } else {
    input.type = 'number';
  }
  if (editingMarker.name === 'icon_size') {
    input.maxLength = 8;
  }

  input.value = target.innerText;
  target.innerHTML = '';
  target.appendChild(input);
  input.focus();

  // end editing, update markers and table.
  input.onblur = function () {
    var index = getIndexOfMarkers(editingMarker.id);
    var value = input.value.trim();
    markers[index][editingMarker.name] = value;
    target.innerHTML = value;
    // markersLayer.clearLayers();
    var mapMarkerIndex = getIndexOfMapMarkers(editingMarker.id);
    var marker = { ...mapMarkers[mapMarkerIndex] };
    markersLayer.removeLayer(marker);
    mapMarkers[index] = drawMarker(markers[index]);
  };
};

function init() {
  // Draw markers.
  markers.forEach(function (m) {
    var newMarker = drawMarker(m);
    mapMarkers.push(newMarker);
  });
  drawTable();
}

// initiallize
function setInitVal(type) {
  if (type !== 'addable') {
    addable = false;
    document.querySelector('#add_marker').innerHTML = 'Add Marker';
    document.querySelector('.leaflet-container').style.cursor = '';
  }
  if (type !== 'moveable') {
    moveable = false;
    document.querySelector('#move_marker').innerHTML = 'Move Marker';
    mapMarkers.forEach(function (m) {
      m.dragging.disable();
    });
  }
  if (type !== 'deleteable') {
    deleteable = false;
    document.querySelector('#delete_marker').innerHTML = 'Delete Marker';
  }
  if (type !== 'editable') {
    editable = false;
    document.querySelector('#edit_marker').innerHTML = 'Edit Marker';
  }
  editingMarker = { id: 0, name: '' };
}

// Draw table from markers data.
function drawTable() {
  var str = '';

  markers.forEach(function (m) {
    str += `
      <tr data-id="${m.id}">
        <td data-name="lat">${m.lat}</td>
        <td data-name="lng">${m.lng}</td>
        <td data-name="title">${m.title}</td>
        <td data-name="icon">${m.icon}</td>
        <td data-name="icon_size">${m.icon_size}</td>
        <td data-name="zoom">${m.zoom}</td>
        <td data-name="rotate_degress">${m.rotate_degress}</td>
      </tr>
    `;

    document.querySelector('#markers_tbl').innerHTML = str;
  });
}

// Add new marker.
function addMarker(e) {
  var marker = {
    id: new Date().getTime(),
    lat: e.latlng.lat,
    lng: e.latlng.lng,
    title: '',
    icon: '',
    icon_size: '',
    zoom: '',
    rotate_degress: ''
  };

  // Add marker to map at click location; add popup window
  var newMarker = drawMarker(marker);

  mapMarkers.push(newMarker);
  markers.push(marker);
  drawTable();
}

// Draw the marker to the map.
function drawMarker(marker) {
  var markerOptions = { id: marker.id, title: marker.title };
  // Custom icon
  var iconSize = [];
  marker.icon_size.split(',').forEach(function (item, i) {
    if (i > 1) return;
    iconSize.push(parseInt(item));
  });

  var shadowSize = [iconSize[0] * 1.31, iconSize[1] * 0.673];
  var icon = new LeafIcon({ iconUrl: marker.icon, iconSize, shadowSize });
  if (icon.options.iconUrl !== '') markerOptions['icon'] = icon;

  var newMarker = new L.marker([marker.lat, marker.lng], markerOptions);
  markersLayer.addLayer(newMarker);

  // map zoom
  if (editingMarker.name === 'zoom') {
    map.setView([marker.lat, marker.lng], marker.zoom);
  }
  // map rotate
  if (editingMarker.name === 'rotate_degress') {
    // get center of rotation
    var transformStr = newMarker.getElement().style.transform;
    var values = transformStr.split(/\w+\(|\);?/);
    var translate = values[1].split(/,\s?/g).map(function (v) { return parseInt(v); });
    translate = translate.splice(0, 2);
    map.setBearing(marker.rotate_degress, translate);
  }

  newMarker.on('click', function (e) {
    var target = e.target;
    var position = target.getLatLng();
    var index = getIndexOfMarkers(target.options.id);

    if (!deleteable) {
      newMarker.bindPopup(`lat: ${position.lat}, lng: ${position.lng}, ${target.options.title}`);
      return;
    }

    document.querySelector(`tr[data-id="${markers[index].id}"]`).remove();
    map.removeLayer(target);
    markers.splice(index, 1);

    index = getIndexOfMapMarkers(target.options.id);
    mapMarkers.splice(index, 1);
  });

  newMarker.on('dragend', function (e) {
    var target = e.target;
    var index = getIndexOfMarkers(target.options.id);
    var position = target.getLatLng();

    markers[index] = { ...markers[index], lat: position.lat, lng: position.lng };
    var marker = markers[index];
    document.querySelector(`tr[data-id="${marker.id}"]`).innerHTML = `
      <td data-name="lat">${position.lat}</td>
      <td data-name="lng">${position.lng}</td>
      <td data-name="title">${target.options.title}</td>
      <td data-name="icon">${marker.icon}</td>
      <td data-name="icon_size">${marker.icon_size}</td>
      <td data-name="zoom">${marker.zoom}</td>
      <td data-name="rotate_degress">${marker.rotate_degress}</td>`;
  });

  return newMarker;
}

// Get the index of marker by id from the markers array.
function getIndexOfMarkers(id) {
  var i = markers.findIndex(function (m) {
    return parseInt(m.id) === parseInt(id);
  });

  return i;
}

// Get the index of marker by id from the map markers array.
function getIndexOfMapMarkers(id) {
  var i = mapMarkers.findIndex(function (m) {
    return parseInt(m.options.id) === parseInt(id);
  });

  return i;
}