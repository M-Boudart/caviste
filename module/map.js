export function map(region,wine_name, wine_country) {

    function coord(){

        switch (region) {
            case 'Southern Rhones/Gigondas':
                return [44.166, 5.005]
                break;
            case 'Rioja':
                return [42.467, -2.561]
                break;
            case 'California Central Cosat':
                return [34.613, -120.193]
                break;
            case 'Washington':
                    return [46.601, -120.510]
                    break;
            case 'Oregon':
                    return [45.313, -122.919]
                    break;
            case 'Tuscany':
                    return [43.590, 11.312]
                    break;
            case 'Bordeaux':
                    return [44.755, -0.448]
                    break;
            case 'Bordeaux':
                    return [44.959, -0.399]
                    break;
            case 'California':
                    return [40.590, -122.401]
                    break;
            case 'Oregon':
                    return [45.274, -123.066]
                    break;
            case 'Mendoza':
                    return [-33.650, -69.154]
                    break;

            case 'Burgondy':
                    return [ 46.309, 4.801 ]
                    break;
            default:
                    return [44.166, 5.005]
                    break;
        }

    }
    document.getElementById('map_container').innerHTML = "<div id='mapid'></div>";

    var mymap = L.map('mapid').setView(coord(), 6);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibWFudXB1bHBvIiwiYSI6ImNrYWswb3V1eTBmeW4yeWp1YzBhY2F1YTkifQ.WnjiguH0efq3LulJT6q0yg'
    }).addTo(mymap);

    var marker = L.marker(coord()).addTo(mymap);
    marker.bindPopup("<b>" + wine_name + "</b><br>"+ wine_country +' - ' + region).openPopup();

}