setTimeout(function() {
    const listTr = document.querySelectorAll('tr');
    let btCom = document.getElementById("btSendComment");
    let wineSelect = document.querySelector('#btSendComment');

    for (const tr of listTr) {
        let wineId = tr.dataset.id;

        tr.addEventListener('click', function() {
            //let wineId = document.querySelector("#id").value;
            ShowAllComment(wineId);   //Affichage des commentaires liés au vin

            btCom.addEventListener('click', function() {
                sendComment(wineId);
                
            });
        });
    }

},1500);





/**
 * Fonction qui affiche les articles de commentaires.
 * 
 * @param {int} id L'id du vin sélectionné
 */
function ShowAllComment(wineId){
    const userId = sessionStorage.getItem('userId');
    const ajax = new XMLHttpRequest();

    ajax.onload = function(){
        if (this.status === 200) {
            let cpt = 0;
            let comments = JSON.parse(this.responseText);
            const divComment = document.querySelector("#commentaires");

            // Netoyage des commentaires précédents
            if (document.querySelectorAll('.comment').length >0) {
                divComment.innerHTML = "";
            }

            while (cpt<3 && cpt<comments.length) {
                // création du paragraphe
                let p = document.createElement('p');
                let textCom = document.createTextNode(comments[cpt].content);
                p.appendChild(textCom);

                //Création de la div
                let div = document.createElement('div');
                div.setAttribute('class', 'text');
                div.appendChild(p);
                let p2 = document.createElement('p');
                let textCom2 = document.createTextNode('Ecrit par le membre '+comments[cpt].user_id);
                                                                //AJOUTER DATE DE COMMENTAIRE OU NOM UTILISATEUR
                p2.appendChild(textCom2);
                //p2.appendChild(dateComment);


                //Création de la div englobant l'autre div
                let div2 = document.createElement('div');
                div2.setAttribute('class', 'comment-body');
                div2.appendChild(div);
                div2.appendChild(p2);

                // Fonctionnalités dans le cas où le user connecté est l'auteur du commentaire
                if (sessionStorage.length>0) {
                    if (comments[cpt].user_id === userId) {
                        let btDeleteComment = document.createElement('button');
                        let btModifyComment = document.createElement('button');
                        let deleteText = document.createTextNode('supprimer');
                        let modifyText = document.createTextNode('modifier');
                        btDeleteComment.appendChild(deleteText);
                        btModifyComment.appendChild(modifyText);
                        btDeleteComment.dataset.commentid = comments[cpt].id;
                        btDeleteComment.dataset.wineid = comments[cpt].wine_id;
                        btModifyComment.dataset.commentid = comments[cpt].id;
                        btModifyComment.dataset.wineid = comments[cpt].wine_id;
                        div2.appendChild(btDeleteComment);
                        div2.appendChild(btModifyComment);

                        btDeleteComment.addEventListener('click', function() {
                            deleteComment(this.dataset.commentid, this.dataset.wineid);
                        });

                        btModifyComment.addEventListener('click', function() {
                            modifyComment(this.commentid);
                        });
                    }
                }

                //Création du logo 
                let img = document.createElement('img');
                img.setAttribute('src', 'images/caviste_logo_white.png');
                img.setAttribute('alt', 'logo du site');

                let a = document.createElement('a');
                a.setAttribute('class', 'comment-img');
                a.appendChild(img);

                //Création de l'article qui va englober le tout
                let article = document.createElement('article');
                article.setAttribute('class', 'comment');
                article.appendChild(a);
                article.appendChild(div2);

                divComment.appendChild(article);
                cpt++;
            }
        }
    }

    ajax.onerror = function() {
        if (this.status === 404) {
            console.log('Ressource non trouvée');
        } else if (this.status === 500) {
            console.log('Erreur interne au serveur');
        }
    }

    ajax.open("GET", "https://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/"+wineId+"/comments", true);
    ajax.send();
}
    
/**
 * Envoyer des commentaires.
 * 
 * @param {int} wineId L'id du vin sélectionné
 */
function sendComment(wineId){

    const login = sessionStorage.getItem('login');
    const pwd = sessionStorage.getItem('password');
    let message = document.getElementById("message-text").value;
    let jsonComment = '{ "content" : "'+message+'"}';

    const httpRequest = new XMLHttpRequest();

    httpRequest.onload = function() {
    if (this.status === 200) {
        ShowAllComment(wineId);
    }
    }


    httpRequest.onerror = function() {
        if (this.status === 404) {
            console.log('Ressource non trouvée!');
        } else if (this.status === 500) {
            console.log('Erreur interne au serveur!');
        }
    }

    httpRequest.open('POST', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + wineId + '/comments', true);       //wineId
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + pwd));
    httpRequest.send(jsonComment);
}

/**
 * Supprime le commentaire d'un vin.
 * 
 * @param {String} commentId Le commenaire à supprimer
 * @param {String} wineId Le vin du commentaire
 * @throws {SyntaxError} Si le paramètre commentId n'est pas défini
 * @throws {TypeError} Si commentId n'est pas de type string
 */
function deleteComment(commentId, wineId) {
    if (commentId == null || wineId == null) {
        throw new SyntaxError('Un des deux paramètres n\'est pas défini !');
    }

    if (typeof(commentId) != 'string') {
        throw new TypeError('Le paramêtre commentId doit être de type string !');
    }

    if (typeof(wineId) != 'string') {
        throw new TypeError('Le paramêtre wineId doit être de type string !');
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ? Ce changement est irréversible.')) {
        login = sessionStorage.getItem('login');
        pwd = sessionStorage.getItem('password');
        const httpRequest = new XMLHttpRequest();

        httpRequest.onload = function() {
            if (this.status === 200) {
                ShowAllComment(wineId);
            }
        }

        httpRequest.onerror = function() {
            if (this.status === 404) {
                console.log('Ressource non trouvée!');
            } else if (this.status === 500) {
                console.log('Erreur interne au serveur!');
            }
        }

        httpRequest.open('DELETE', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + wineId + '/comments/'+ commentId + '', true);
        httpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + pwd));
        httpRequest.send();
    }
}

/**
 * Modifie un commentaire. 
 * 
 * @param {String} commentId Le commentaire à modifier
 * @throws {SyntaxError} Si le paramètre commentId n'est pas défini
 * @throws {TypeError} Si commentId n'est pas de type string
 */
function modifyComment(commentId) {
    if (commentId == null) {
        throw new SyntaxError('Le paramêtre commentId n\'est pas défini !');
    }

    if (typeof(commentId) != 'string') {
        throw new TypeError('Le paramêtre commentId doit être de type string !');
    }
}