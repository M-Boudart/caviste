setTimeout(function() {
    const listTr = document.querySelectorAll('tr');
    let btCom = document.getElementById("btSendComment");

    for (const tr of listTr) {
        let wineId = tr.dataset.id;

        tr.addEventListener('click', function() {
            ShowAllComment(wineId);   //Affichage des commentaires liés au vin

            btCom.addEventListener('click', function() {
                sendComment(wineId);
                
            });
        });
    }

},1500);

/**
 * Affiche les commentaires d'un vin.
 * 
 * @param {int} wineId L'id du vin sélectionné
 * @param {boolean} allWine Permet de savoir si on affiche tous les commentaires du vin
 * @throws {SyntaxError} Si l'attribut wineId n'est pas défini
 * @throws {TypeError} Si les attributs ne sont pas du bon type
 */
function ShowAllComment(wineId, allWines = false){
    if (wineId == null) {
        throw new SyntaxError('Le paramètre wineId n\'est pas défini!');
    }

    if (typeof(wineId) != 'string') {
        throw new TypeError('Le paramètre wineId n\'est pas de type string!');
    }

    if (typeof(allWines) != 'boolean') {
        throw new TypeError('Le paramètre allWines n\'est pas un booléen!');
    }

    const userId = sessionStorage.getItem('userId');
    const ajax = new XMLHttpRequest();

    ajax.onload = function(){
        if (this.status === 200) {
            let cpt;
            let comments = JSON.parse(this.responseText);
            const divComment = document.querySelector("#commentaires");

            // Netoyage des commentaires précédents
            if (document.querySelectorAll('.comment').length >0) {
                divComment.innerHTML = "";
            }

            if (comments.length > 0) {
                // Affichage des 3 derniers commentaires
                cpt = comments.length-1;
                while ((allWines && cpt > 0) || (cpt > 0 && cpt > comments.length - 4)) {
                    // Création du formulaire
                    let frmComment = document.createElement('form');
                    frmComment.setAttribute('action', 'http://localhost/caviste/index.html');
                    frmComment.setAttribute('method', 'POST');

                    // création du textarea
                    let textArea = document.createElement('textarea');
                    textArea.setAttribute('name', 'comment');
                    textArea.style.width = '80%';
                    let commentContent = document.createTextNode(comments[cpt].content);
                    textArea.appendChild(commentContent);

                    // Création des boutons
                    let btDeleteComment;
                    let btModifyComment;

                    // Fonctionnalités dans le cas où le user connecté est l'auteur du commentaire
                    if ((sessionStorage.length > 0) && (comments[cpt].user_id === userId)) {
                            btDeleteComment = document.createElement('button');
                            btModifyComment = document.createElement('button');
                            btDeleteComment.setAttribute('class', 'btn btn-outline-dark btn-md');
                            btModifyComment.setAttribute('class', 'btn btn-outline-dark btn-md');
                            let deleteText = document.createTextNode('supprimer');
                            let modifyText = document.createTextNode('modifier');
                            btDeleteComment.appendChild(deleteText);
                            btModifyComment.appendChild(modifyText);
                            btDeleteComment.dataset.commentid = comments[cpt].id;
                            btDeleteComment.dataset.wineid = comments[cpt].wine_id;
                            btModifyComment.dataset.commentid = comments[cpt].id;
                            btModifyComment.dataset.wineid = comments[cpt].wine_id;
                            

                            btDeleteComment.addEventListener('click', function() {
                                deleteComment(this.dataset.commentid, this.dataset.wineid);
                            });

                            btModifyComment.addEventListener('click', function() {
                                modifyComment(this.commentid);
                            });
                    } else {
                        textArea.readOnly = true;
                    }

                    // Création de l'auteur
                    let authorP = document.createElement('p');
                    let textAuthor;
                    
                    if (userId == comments[cpt].user_id) {
                        textAuthor = document.createTextNode('Vous avez écrit ce commentaire');
                    } else {
                        textAuthor = document.createTextNode('Ecrit par le membre '+ comments[cpt].user_id);
                    }

                    authorP.appendChild(textAuthor);

                    //Création de la div englobant l'autre div
                    let div2 = document.createElement('div');
                    div2.setAttribute('class', 'comment-body');
                    frmComment.appendChild(textArea);
                    frmComment.appendChild(authorP);

                    if ((sessionStorage.length > 0) && (comments[cpt].user_id === userId)) {
                        frmComment.appendChild(btModifyComment);
                    }

                    div2.appendChild(frmComment);

                    if ((sessionStorage.length > 0) && (comments[cpt].user_id === userId)) {
                        div2.appendChild(btDeleteComment);
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
                    cpt--;
                }

                // Affichage d'un bouton en cas de commentaires supplémentaires (+ que 3)
                if (cpt != 0) {
                    const btDisplayMoreComs = document.createElement('button');
                    btDisplayMoreComs.innerHTML = 'Afficher les commentaires supplémentaires';
                    btDisplayMoreComs.setAttribute('class', 'btn btn-outline-dark btn-md');
                    btDisplayMoreComs.dataset.wineid = wineId;
                    divComment.appendChild(btDisplayMoreComs);

                    btDisplayMoreComs.addEventListener('click', function() {
                        ShowAllComment(this.dataset.wineid, true);
                    });
                }
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

    httpRequest.open('POST', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + wineId + '/comments', true);
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
 * Modifie le commentaire d'un vin. 
 * 
 * @param {String} commentId Le commentaire à modifier
 * @param {String} wineId Le vin du commentaire
 * @throws {SyntaxError} Si le paramètre commentId n'est pas défini
 * @throws {TypeError} Si commentId n'est pas de type string
 */
function modifyComment(commentId, wineId) {
    if (commentId == null || wineId == null) {
        throw new SyntaxError('Un des deux paramètres n\'est pas défini !');
    }

    if (typeof(commentId) != 'string') {
        throw new TypeError('Le paramêtre commentId doit être de type string !');
    }

    if (typeof(wineId) != 'string') {
        throw new TypeError('Le paramêtre wineId doit être de type string !');
    }
}