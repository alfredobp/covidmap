var cities = L.layerGroup();

// L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities),
//     L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities),
//     L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities),
//     L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);


function getRadius(r) {
    return r >= 100000 ? 25 :
        r >= 10000 ? 15 :
            r >= 5000 ? 7 :
                r >= 1000 ? 3 :
                    3;
};

var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale = L.tileLayer(mbUrl, { id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr }),
    streets = L.tileLayer(mbUrl, { id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr });

var map = L.map('map', {
    center: [38.97, -5.80],
    zoom: 4,
    minZoom: 4,
    maxZoom: 15,
    layers: [grayscale]
});

var baseLayers = {
    "Streets": streets,
    "Grayscale": grayscale
    
};

var overlays = {
    "Datos covid-19": cities
};

L.control.layers(baseLayers, overlays).addTo(map);

function popup_covid(feature, layer) {
    layer.bindPopup("<div style=text-align:center><h3>" + feature.properties.denominacion +
        "<h3></div><hr><table><tr><td>Tipo de equipamiento: " + feature.properties.tipo_equipamiento +
        "</td></tr><tr><td>Dirección: " + feature.properties.ubicacion +
        "</td></tr><tr><td>Recovered: " + feature.properties.id +
        "</td></tr></table>", {
        minWidth: 150,
        maxWidth: 200
    });
};

var MarkerOptions = {
    fillColor: "#blue",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.Datos: Universidad Johns Hopkins (JHU)',
}).addTo(map);

var customIcon = new L.Icon({
    iconUrl: 'https://image.flaticon.com/icons/svg/2904/2904131.svg',
    iconSize: [25, 20],
    iconAnchor: [25, 50]
});
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    var grades = [1000, 5000, 10000, 100000];
    var labels = ['<strong>Número de afectados</strong>'];
    var categories = ['< 5000', '5000-10000', '10000-100000', '>100000'];

    for (var i = 0; i < grades.length; i++) {
        var grade = grades[i];//*0.5;
        labels.push(
            '<i class="circlepadding" style="width: ' + Math.max(8, (7 - 2.2 * getRadius(grade))) + 'px;"></i> <i style="background: #FF4000; width: ' + getRadius(grade) * 2 + 'px; height: ' + getRadius(grade) * 2 + 'px; border-radius: 50%; margin-top: ' + Math.max(0, (9 - getRadius(grade))) + 'px;"></i><i class="circlepadding" style="width: ' + Math.max(2, (25 - 2 * getRadius(grade))) + 'px;"></i> ' + categories[i]);
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);

let geojson_url = "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest";

fetch(geojson_url)
    .then(function (response) {
        console.log(response)
        return response.json();
    })
    .then(
        data => {
            console.log(data)
            L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(MarkerOptions, { icon: customIcon }, { icon: customIcon });
                },
                onEachFeature: popup_covid
            }).addTo(map)
            for (let index = 0; index < data.length; index++) {
                L.marker([data[index].location.lat, data[index].location.lng], { icon: customIcon }, { MarkerOptions: MarkerOptions }).bindPopup("<div class='' style=text-align:center><h3> País: " + data[index].countryregion + "</div>" +
                    "<hr><table><tr><td>Infectados: " + data[index].confirmed +
                    "<tr><td>Fallecidos: " + data[index].deaths +
                    "</td></tr><tr><td>Recuperados: " + data[index].recovered +
                    "</td></tr><tr><td>Actualizado el: " + data[index].lastupdate +
                    "</td></tr></table>", {
                    minWidth: 150,
                    maxWidth: 200
                }).addTo(map);


            }

            map.fitBund
        }
    )
    var title = L.control();
	 
	title.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'info');
		    div.innerHTML +=
		    '<h2>COVID-19</h2>Grado de incidencia por país.';
		 return div;
	};
	 
    title.addTo(map);
    