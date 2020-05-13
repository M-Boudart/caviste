window.onload = function() {
    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (this.status === 200) {
            let wines = JSON.parse(this.responseText);
            let str = '<table class="table">';
            
            for (const wine of Object.entries(wines)) {
                str += '<tr data-id="'+wine[1].id+'">';
                str += '<td>'+wine[1].name+'</td>';
                str += '</tr>';
            }

            str +='</table>';

            const divWinesTable = document.querySelector("#col-tabWines");
            divWinesTable.innerHTML = str;

            const listTr = document.querySelectorAll('tr');

            for (const tr of listTr) {
                let id = tr.dataset.id;

                tr.addEventListener('click', function() {
                    showWineInfo(id);
                });
            }
        }
    };

    xhr.onerror = function() {
        if (this.status === 404) {
            console.log('Ressource non trouvée');
        } else if (this.status === 500) {
            console.log('Erreur interne au serveur');
        }
    };

    xhr.open('GET', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines', true);
    xhr.send();
};

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
        divImg.innerHTML = '<img src="http://cruth.phpnet.org/epfc/caviste/public/pics/'+wine.picture+'" alt="Bouteille de '+wine.name+'">';
    };

    xhr.onerror = function() {
        if (this.status === 404) {
            console.log('Ressource non trouvée');
        } else if (this.status === 500) {
            console.log('Erreur interne au serveur');
        }
    };

    xhr.open('GET', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+id, true);
    xhr.send();
}