var map = L.map('map', {
    center: [38.97, -5.80],
    zoom: 4,
    minZoom: 4,
    maxZoom: 15
});

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