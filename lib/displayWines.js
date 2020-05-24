
const xhr = new XMLHttpRequest();

xhr.onload = function () {
    if (this.status === 200) {
        let wines = JSON.parse(this.responseText);

        const tabWines = document.createElement('table');
        tabWines.setAttribute('class', 'table');

        for (const wine of Object.entries(wines)) {
            let wineName = document.createTextNode(wine[1].name);
            let td = document.createElement('td');
            td.appendChild(wineName);

            let tr = document.createElement('tr');
            tr.setAttribute('data-id', wine[1].id);
            tr.appendChild(td);

            tabWines.appendChild(tr);
        }

        const divWinesTable = document.querySelector("#col-tabWines");
        divWinesTable.appendChild(tabWines);

        const listTr = document.querySelectorAll('tr');

        for (const tr of listTr) {
            let id = tr.dataset.id;

            tr.addEventListener('click', function () {
                showWineInfo(id);

            });
        }
    }
};

xhr.onerror = function () {
    if (this.status === 404) {
        console.log('Ressource non trouvée');
    } else if (this.status === 500) {
        console.log('Erreur interne au serveur');
    }
};

xhr.open('GET', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines', true);
xhr.send();


/**
 * Affiche les informations d'un vin lors du click de ce dernier dans le tableau des vins.
 * 
 * @param {int} id L'id du vin sélectionné
 */
function showWineInfo(id) {
    const frmInfo = document.forms['frmInfos'];
    const divImg = document.getElementById('col-img');
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
        const data = JSON.parse(this.responseText);
        console.log(data)
        const wine = data[0];

        frmInfo['id'].value = wine.id;
        frmInfo['name'].value = wine.name;
        frmInfo['grapes'].value = wine.grapes;
        frmInfo['country'].value = wine.country;
        frmInfo['region'].value = wine.region;
        frmInfo['year'].value = wine.year;
        frmInfo['price'].value = wine.price;
        frmInfo['capacity'].value = wine.capacity;
        frmInfo['description'].value = wine.description;
        divImg.innerHTML = '<img src="http://cruth.phpnet.org/epfc/caviste/public/pics/' + wine.picture + '" alt="Bouteille de ' + wine.name + '">';
// Fonction carte 
        map(wine.region, wine.name, wine.country)
    };

    xhr.onerror = function () {
        if (this.status === 404) {
            console.log('Ressource non trouvée');
        } else if (this.status === 500) {
            console.log('Erreur interne au serveur');
        }
    };

    xhr.open('GET', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + id, true);
    xhr.send();
}

function map(region,wine_name, wine_country) {

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