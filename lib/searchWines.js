const btSearch = document.getElementById('btSearch');

btSearch.addEventListener('click', searchWines);

/**
 * Recherche un vin entré dans le champ de recherche.
 */
function searchWines(){
    resetErrorMessage();
    
    const frmSearch = document.forms['frmSearchSort'];
    const listTr = document.querySelectorAll('tr');
    let searchValue = frmSearch.search.value;
    let noResult = false;
    const tabDisplayNone = [];

    for (const tr of listTr) {
        tr.style.display = 'block';
    }

    if (searchValue.length != 0) {
        const xhr = new XMLHttpRequest();           
        xhr.onload = function() {
            if (this.status === 200) {
                const wines = JSON.parse(this.responseText);

                if (Object.entries(wines).length > 0) {
                    // Cache tous les tr
                    for (const tr of listTr) {
                        tr.style.display = 'none';
                    }

                    // Affiche uniquement les tr qui correspondent aux vins de la requête ajax
                    for (const wine of Object.entries(wines)) {
                        let wineId = wine[1].id;

                        document.querySelector('tr[data-id="'+ wineId + '"]').style.display = 'block';
                    }

                    // Création du bouton "afficher tous les vins"
                    const btDisplayWines = document.createElement('button');
                    btDisplayWines.setAttribute('id', 'btDisplayWines');
                    btDisplayWines.setAttribute('class', 'btn btn-outline-dark btn-lg');

                    btDisplayWines.addEventListener('click', function() {
                        btDisplayWines.remove();
                        for (const tr of listTr) {
                            tr.style.display = 'block';
                        }
                    });
                    const btText = document.createTextNode('Afficher tous les vins');
                    btDisplayWines.appendChild(btText);

                    const divTabWines = document.querySelector("#col-tabWines");
                    divTabWines.appendChild(btDisplayWines);

                } else {
                    displayErrorMessage();
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
        xhr.open('GET','http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/search?keyword='+searchValue, true);
        xhr.send();
    }  else {
        noResult = true;
    }

    if (noResult) {
        displayErrorMessage();
    }
}

/**
 * Affiche un message en cas de non résultat.
 */
function displayErrorMessage() {
    const divError = document.createElement('div');
    divError.setAttribute('id', 'divError');
    divError.setAttribute('class', 'alert alert-primary');
    divError.setAttribute('role', 'alert');
    
    const errorMessage = document.createTextNode('Aucun résultat!');
    divError.appendChild(errorMessage);
    divError.style.width ='50%';
    divError.style.textAlign ='center';
    divError.style.marginLeft = 'auto';
    divError.style.marginRight = 'auto';

    const div = document.querySelector("#search-sort-wine > div");
    div.appendChild(divError);
}

/**
 * Reset le message de non résultat.
 */
function resetErrorMessage() {
    try {
        document.querySelector("#divError").remove();
    } catch(error) {
        1+1;
    } 

    try {
        document.querySelector("#btDisplayWines").remove();
    } catch(error) {
        1+1;
    } 
}