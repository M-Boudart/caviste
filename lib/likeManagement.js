window.onload = function() {
    // Vérifie si un utilisateur est connecté
    if (sessionStorage.length > 0) {
        const httpRequest = new XMLHttpRequest();

        httpRequest.onload = function() {
            if (this.status === 200) {
                let likedWines = [];
                let data = JSON.parse(this.responseText);
        
                for (const wine of data) {
                    likedWines.push(wine.id);
                }
                
                // Code mis dans une minuterie car sinon il n'est pas exécuté 100% du temps (Maxime)
                let listTr;
                setTimeout(function() {
                    listTr = document.querySelectorAll('tr');
                    
                    for (const tr of listTr) {
                        let id = tr.dataset.id;
    
                        tr.addEventListener('click', function() {
                            checkIfLikedWine(id, likedWines);
                        });
                    }
                }, 500);
            }
        };
        
        httpRequest.onerror = function() {
            if (this.status === 404) {
                console.log('Ressource non trouvée');
            } else if (this.status === 500) {
                console.log('Erreur interne au serveur');
            }
        };
        
        httpRequest.open('GET', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/users/' + sessionStorage.getItem('userId') + '/likes/wines', true);
        httpRequest.send();
    }
}

/**
 * Affiche l'image "coup de coeur" si l'utilisateur aime le vin sélectionné.
 * 
 * @param {Number} wineId l'id du vin sélectionné
 * @param {Array} likedWines Les vins aimés par l'utilisateur
 */
function checkIfLikedWine(wineId, likedWines) {
    if (wineId == null || likedWines == null) {
        throw new SyntaxError('Un des paramètres n\'est pas définit!');
    }

    if (typeof(wineId) != 'string') {
        throw new TypeError('Le paramètre wineId doit être un string!');
    }

    if (!(likedWines instanceof Array)) {
        throw new TypeError('Le paramètre likedWine doit être un tableau!');
    }

    const likeImg = document.querySelector("#col-imgWine > img");
    
    if (likedWines.indexOf(wineId) != -1) {
        likeImg.style.display = 'inline';
    } else {
        likeImg.style.display = 'none';
    }
}