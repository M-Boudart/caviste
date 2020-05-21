setTimeout(function() {
    const listTr = document.querySelectorAll('tr');

    let wineSelect = document.querySelector('#btSendComment');

    for (const tr of listTr) {
        let wineId = tr.dataset.id;

        tr.addEventListener('click', function() {
            //let wineId = document.querySelector("#id").value;
            ShowAllComment(wineId);   //Affichage des commentaires liés au vin
        });
    }


    let btCom = document.getElementById("btSendComment");
    btCom.addEventListener('click', function() {

        sendComment(wineId);
        
    });


},1500);

/**
 * Fonction qui affiche les articles de commentaires.
 * 
 * @param {int} id L'id du vin sélectionné
 */
function ShowAllComment(wineId){

        const ajax = new XMLHttpRequest();

        ajax.onload = function(){
            if(this.status === 200){
                let cpt = 0;
                let comments = JSON.parse(this.responseText);
                const divComment = document.querySelector("#commentaires");
                if(document.querySelectorAll('.comment').length >0){
                    divComment.innerHTML = "";
                }
                     while(cpt<3 && cpt<comments.length){

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
                                if(sessionStorage.length>0){
                                    let bt = document.createElement('button');
                                    let btTexte = document.createTextNode('supprimer');
                                    bt.appendChild(btTexte);
                                    bt.dataset.commentid = comments[cpt].id;
                                    div2.appendChild(bt);
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
};