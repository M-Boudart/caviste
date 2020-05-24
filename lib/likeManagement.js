window.onload = function() {
    let listTr;

    // Code mis dans une minuterie car sinon il n'est pas exécuté 100% du temps (Permet d'assurer le chargement du tableau des vins)
    setTimeout(function() {
        listTr = document.querySelectorAll('tr');
        
        for (const tr of listTr) {
            let id = tr.dataset.id;

            tr.addEventListener('click', function() {
                likeCounter(id);
            });
        }
    }, 1500);

    // Fonctionnalités liées à la connexion de l'utilisateur
    if (typeof(sessionStorage.login) != 'undefined') {
        const btLikeWine = document.querySelector('#btLike');
        let likedWines = [];
        const httpRequest = new XMLHttpRequest();

        httpRequest.onload = function() {
            if (this.status === 200) {
                let data = JSON.parse(this.responseText);
                
                for (const wine of data) {
                    likedWines.push(wine.id);
                }

                setTimeout(function() {
                    for (const tr of listTr) {
                        let id = tr.dataset.id;
                        
                        displayLikeImageEvent = function() {
                            displayLikeImage(id, likedWines);
                            btLikeWine.dataset.wineid = id;
                        };

                        tr.addEventListener('click', displayLikeImageEvent);
                    }
                }, 1500);
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
        
        // Ajout et suppression du like d'un vin
        btLikeWine.addEventListener('click', function() {
            wineId = this.dataset.wineid;
            likeWine(wineId, likedWines);
        });
    }
}

/**
 * Affiche le nombre de like du vin sélectionné.
 * 
 * @param {String} wineId l'id du vin sélectionné
 * @throws {SyntaxError} Si le paramètre wineId n'est pas défini
 * @throws {TypeError} Si wineId n'est pas de type string
 */
function likeCounter(wineId) {
    if (wineId == null) {
        throw new SyntaxError('Le paramètre wineId n\'est pas défini!');
    }

    if (typeof(wineId) != 'string') {
        throw new TypeError('Le paramètre wineId doit être un string!');
    }

    const httpRequest = new XMLHttpRequest();

    httpRequest.onload = function() {
        if (this.status === 200) {
            const likeCounter = JSON.parse(this.responseText).total;
            
            // Affichage du compteur
            const divLikeCounter = document.querySelector("#col-imgWine > p");
            divLikeCounter.innerHTML = '<span class="fas fa-heart"></span> ' + likeCounter;
            divLikeCounter.style.display = 'block';
        }
    }; 

    httpRequest.onerror = function() {
        if (this.status === 404) {
            console.log('Ressource non trouvée');
        } else if (this.status === 500) {
            console.log('Erreur interne au serveur');
        }
    };

    httpRequest.open('GET', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + wineId + '/likes-count', true);
    httpRequest.send();
}

/**
 * Affiche l'image "coup de coeur" si l'utilisateur aime le vin sélectionné.
 * 
 * @param {String} wineId l'id du vin sélectionné
 * @param {Array} likedWines Les vins aimés par l'utilisateur
 * @throws {SyntaxError} Si un des paramètres n'est pas défini
 * @throws {TypeError} Si wineId n'est pas de type string ou si likedWines n'est pas un array
 */
function displayLikeImage(wineId, likedWines) {
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
    const heartIcon = document.querySelector("#btLike > span");
    
    if (likedWines.indexOf(wineId) != -1) {
        likeImg.style.display = 'inline';
        heartIcon.setAttribute('class', 'fas fa-heart');
    } else {
        likeImg.style.display = 'none';
        heartIcon.setAttribute('class', 'far fa-heart');
    }
}

/**
 * Like un vin ou unlike le vin s'il est déjà aimé.
 * 
 * @param {String} wineId l'id du vin sélectionné
 * @param {Array} likedWines Les vins aimés par l'utilisateur
 * @throws {SyntaxError} Si un des paramètres n'est pas défini
 * @throws {TypeError} Si wineId n'est pas de type string ou si likedWines n'est pas un array
 */
function likeWine(wineId, likedWines) {
    if (wineId == null || likedWines == null) {
        throw new SyntaxError('Un des paramètres n\'est pas définit!');
    }

    if (typeof(wineId) != 'string') {
        throw new TypeError('Le paramètre wineId doit être un string!');
    }

    if (!(likedWines instanceof Array)) {
        throw new TypeError('Le paramètre likedWine doit être un tableau!');
    }

    const login = sessionStorage.getItem('login');
    const pwd = sessionStorage.getItem('password');
    const likeStatus = (likedWines.indexOf(wineId) == -1) ? true : false; // Permet de savoir si le vin a déjà été liké
    let jsonLikeContent;

    if (likeStatus) {
        jsonLikeContent = '{"like": true}';
    } else {
        jsonLikeContent = '{"like": false}';
    }

    const httpRequest = new XMLHttpRequest();
    
    httpRequest.onload = function() {
        if (this.status === 200) {
            if (likeStatus) { // Ajoute le vin aux vins likés
                likedWines.push(wineId);
                // displayLikeImage(wineId, likedWines);
            } else { // Retire le vin des vins likés
                const deleteIndex = likedWines.indexOf(wineId);
                likedWines.splice(deleteIndex, 1);
                // displayLikeImage(wineId, likedWines);
            }

            likeCounter(wineId);
            displayLikeImage(wineId, likedWines);
        }
    }

    httpRequest.onerror = function() {
        if (this.status === 404) {
            console.log('Ressource non trouvée!');
        } else if (this.status === 500) {
            console.log('Erreur interne au serveur!');
        }
    }

    httpRequest.open('PUT', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + wineId + '/like', true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + pwd));
    httpRequest.send(jsonLikeContent);
}