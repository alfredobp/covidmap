var cities = L.layerGroup();

// L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities),
//     L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities),
//     L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities),
//     L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);


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
    "Grayscale": grayscale,
    "Streets": streets
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
    fillColor: "#FF4000",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.Datos: Universidad Johns Hopkins (JHU)',
}).addTo(map);




let geojson_url = "https://wuhan-coronavirus-api.laeyoung.endpoint.ainize.ai/jhu-edu/latest";

fetch(geojson_url)
    .then(function(response) {
        console.log(response)
        return response.json();
    })
    .then(
        data => {
            console.log(data)
            L.geoJson(data, {
                pointToLayer: function(feature, latlng) {
                    return L.circleMarker(MarkerOptions);
                },
                onEachFeature: popup_covid
            }).addTo(map)
            for (let index = 0; index < data.length; index++) {
                L.marker([data[index].location.lat, data[index].location.lng]).bindPopup("<div class='' style=text-align:center><h3> País: " + data[index].countryregion + "</div>" +
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