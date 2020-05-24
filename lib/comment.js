import {getLogin} from '../module/users.js';

setTimeout(function() {
    const listTr = document.querySelectorAll('tr');
    let btAddComment = document.getElementById("btSendComment");
    let btOpenModalComment = document.querySelector('#btOpenModalComment');
    let eventAddComment;

    // Suppression du message d'erreur d'un ajout de commentaire
    if (sessionStorage.length > 0) {
        btOpenModalComment.addEventListener('click', function() {
            resetModalBox(true);
        });
    }

    for (const tr of listTr) {
        let wineId = tr.dataset.id;
        tr.addEventListener('click', function() {
            ShowAllComment(wineId);   //Affichage des commentaires liés au vin

            // Fix du bug 'Multipilcation des commentaires'
                btAddComment.removeEventListener('click', eventAddComment);

                eventAddComment = function () {
                    resetModalBox();
                    sendComment(wineId);
                }

            btAddComment.addEventListener('click', eventAddComment);
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
            const divNoComment = document.querySelector("#noComment");

            // Netoyage des commentaires précédents
            if (document.querySelectorAll('.comment').length > 0) {
                divComment.innerHTML = "";
            }

            // Netoyage du text 'Aucun commentaire'
            if (comments.length > 0) {
                divNoComment.innerHTML = "";
            }

            if (comments.length > 0) {
                // Affichage des 3 derniers commentaires
                cpt = comments.length-1;
                while ((allWines && cpt >= 0) || (cpt > 0 && cpt > comments.length - 4)) {
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
                                const commentId = this.dataset.commentid;
                                const wineId = this.dataset.wineid;

                                modifyComment(commentId, wineId, this);
                            });
                    } else {
                        textArea.readOnly = true;
                    }

                    // Création de l'auteur
                    let authorP = document.createElement('p');
                    
                    if (userId == comments[cpt].user_id) {
                        authorP.innerHTML = '<span class="greenColor">Vous</span> avez écrit ce commentaire.'
                    } else {
                        authorP.innerHTML = 'Commentaire écrit par<span class="greenColor"> ' + getLogin(comments[cpt].user_id) + '</span>.'
                    }

                    //Création de la div le commentaire et les boutons
                    let div2 = document.createElement('div');
                    div2.setAttribute('class', 'comment-body');
                    div2.appendChild(textArea);
                    div2.appendChild(authorP);

                    if ((sessionStorage.length > 0) && (comments[cpt].user_id === userId)) {
                        div2.appendChild(btModifyComment);
                    }

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
                if (cpt != 0 && !allWines) {
                    const btDisplayMoreComs = document.createElement('button');
                    btDisplayMoreComs.innerHTML = 'Afficher les commentaires supplémentaires';
                    btDisplayMoreComs.setAttribute('class', 'btn btn-outline-dark btn-md');
                    btDisplayMoreComs.setAttribute('id', 'btDisplayMoreComments');
                    btDisplayMoreComs.dataset.wineid = wineId;
                    divComment.appendChild(btDisplayMoreComs);

                    btDisplayMoreComs.addEventListener('click', function() {
                        ShowAllComment(this.dataset.wineid, true);
                    });
                }
            } else {
                const noCOmmentTitle = document.createElement('h2');
                noCOmmentTitle.innerHTML = 'Ce vin ne possède <span class="redColor">pas encore</span> de commentaire !';

                divNoComment.appendChild(noCOmmentTitle);


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
 * @throws {SyntaxError} Si le paramètre wineId n'est pas défini
 * @throws {TypeError} Si wineId n'est pas de type string
 */
function sendComment(wineId) {
    if (wineId == null) {
        throw new SyntaxError('Le paramètre wineId n\'est pas défini !');
    }

    if (typeof(wineId) != 'string') {
        throw new TypeError('Le paramêtre wineId doit être de type string !');
    }

    let comment = document.querySelector('#message-text').value;
    console.log(comment);
    // Validation du commentaire
    if (comment.length >= 5 && comment.length <= 50) {
        const login = sessionStorage.getItem('login');
        const pwd = sessionStorage.getItem('password');
        let jsonComment = '{ "content" : "' + comment + '"}';

        const httpRequest = new XMLHttpRequest();

        httpRequest.onload = function() {
            if (this.status === 200) {
                // Création du message d'envoi
                const divSuccess = document.createElement('div');
                divSuccess.setAttribute('id', 'divSuccess');
                divSuccess.setAttribute('class', 'alert alert-success');
                divSuccess.setAttribute('role', 'alert');

                const successMessage = document.createTextNode('Votre commentaire a bien été ajouté aux autres commentaires!');
                divSuccess.appendChild(successMessage);

                const modalBody = document.querySelector("#newComment > div > div > div.modal-body");
                modalBody.appendChild(divSuccess);

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
    } else { // Message d'erreur
        const divError = document.createElement('div');
        divError.setAttribute('id', 'divError');
        divError.setAttribute('class', 'alert alert-danger');
        divError.setAttribute('role', 'alert');

        const errorMessage = document.createTextNode('Votre commentaire doit faire entre 5 et 50 caractères!');
        divError.appendChild(errorMessage);

        const modalBody = document.querySelector("#newComment > div > div > div.modal-body");
        modalBody.appendChild(divError);
    }
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
        httpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(sessionStorage.login + ':' + sessionStorage.password));
        httpRequest.send();
    }
}

/**
 * Modifie le commentaire d'un vin. 
 * 
 * @param {String} commentId Le commentaire à modifier
 * @param {String} wineId Le vin du commentaire
 * @param {HTMLButtonElement} button Le bouton sur lequel on a cliqué
 * @throws {SyntaxError} Si un des paramètres n'est pas défini
 * @throws {TypeError} Si commentId n'est pas de type string
 */
function modifyComment(commentId, wineId, button) {
    if (commentId == null || wineId == null || button == null) {
        throw new SyntaxError('Un des deux paramètres n\'est pas défini !');
    }

    if (typeof(commentId) != 'string') {
        throw new TypeError('Le paramêtre commentId doit être de type string !');
    }

    if (typeof(wineId) != 'string') {
        throw new TypeError('Le paramêtre wineId doit être de type string !');
    }
    
    // Récupération du commentaire
    const div = button.parentNode;
    const textarea = div.firstChild;
    const textComment = textarea.value;

    if (textComment.length == 0) {
        deleteComment(commentId, wineId);
    } else {
        const jsonComment = '{ "content" : "' + textComment + '"}';
        const xhr = new XMLHttpRequest();

        xhr.onload = function() {
            if (this.status === 200) {
                ShowAllComment(wineId);
            }
        };

        xhr.onerror = function(){
            if (this.status === 404) {
                console.log('Ressource non trouvée!');
            }

            if (this.status === 500) {
                console.log('Erreur interne au serveur');
            }
        };

        xhr.open('PUT', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/' + wineId + '/comments/' + commentId + '', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(sessionStorage.login + ':' + sessionStorage.password));
        xhr.send(jsonComment);
    }
}

/**
 * Reset le modal d'ajout de commentaire.
 */
function resetModalBox(resetTextarea = false) {
    try {
        document.querySelector("#divError").remove();
    } catch(error) {
        1+1;
    } 

    try {
        document.querySelector("#divSuccess").remove();
    } catch(error) {
        1+1;
    } 

    if (resetTextarea) {
        document.querySelector("#message-text").value = '';
    }
}