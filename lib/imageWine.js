const login = sessionStorage.getItem('login');
const pwd = sessionStorage.getItem('password');

setTimeout(function() {
    const listTr = document.querySelectorAll('tr');
    let btImg = document.getElementById("btSendImg");
    let btDelImg = document.getElementById("btDeleteImg");
    let btUpload = document.querySelector('#upload-button');
    const btAddPicture = document.querySelector("#btAddImg");
    const frm = document.forms['frmUpload'];
    let wineId;


    for (const tr of listTr) {
        wineId = tr.dataset.id;

        tr.addEventListener('click', function() {
            btDelImg.dataset.wineid = this.dataset.id;
            btUpload.dataset.wineid = this.dataset.id;
            showImage(this.dataset.id);
        });
    }

    frm.addEventListener('submit', function(event) {
        sendImg(btUpload.dataset.wineid);
        event.preventDefault();
    });

    btDelImg.addEventListener('click', function() {
        const wineId = this.dataset.wineid;
        const imgActive = document.querySelector(".carousel-item active");
        imgId = imgActive.dataset.picid;
        deleteImg(wineId, imgId);
    });

    btAddPicture.addEventListener('click', resetModalBox);
},1500);

/**
 * Fonction qui permet l'envois des images vers l'API (nb === 3 && max 100ko && one by one only)
 * 
 * @param {int} wineId L'id du vin sélectionné
 */
// function sendImg(wineId){
function sendImg(wineId){
    resetModalBox();

    const frm = document.forms['frmUpload'];

    if (frm.MAX_FILE_SIZE.value >= frm.picture.size) {
        const data = new FormData(frm);
        const request = new XMLHttpRequest();

        request.onload = function() {

            if (this.status === 200) {
                // Création du message d'envoi
                const divSuccess = document.createElement('div');
                divSuccess.setAttribute('id', 'divSuccess');
                divSuccess.setAttribute('class', 'alert alert-success');
                divSuccess.setAttribute('role', 'alert');

                const successMessage = document.createTextNode('Image ajoutée avec succès');
                divSuccess.appendChild(successMessage);

                const modalBody = document.querySelector("#frmUpload");
                modalBody.appendChild(divSuccess);
            }
        };


        request.onerror = function() {
            if (this.status === 404) {
                console.log('Ressource non trouvée!');
            } else if (this.status === 500) {
                console.log('Erreur interne au serveur!');
            }
        };


        // Envois de l'image
        request.open('POST', "http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/"+wineId+"/pictures", true);
        request.setRequestHeader('Authorization', 'Basic ' + btoa(sessionStorage.login + ':' + sessionStorage.password));
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send(data);
    } else {
        const divError = document.createElement('div');
        divError.setAttribute('id', 'divError');
        divError.setAttribute('class', 'alert alert-danger');
        divError.setAttribute('role', 'alert');

        const errorMessage = document.createTextNode('Fichier trop volumineux!');
        divError.appendChild(errorMessage);

        const modalBody = document.querySelector("#frmUpload");
        modalBody.appendChild(divError);
    }
}

/**
 * Fonction qui permet l'affichages des images
 * 
 * @param {int} wineId L'id du vin sélectionné
 */
function showImage(wineId) {

    const xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (this.status === 200) {
            let images = JSON.parse(this.responseText);

            const affichage = document.querySelector('#wineCarousel');
            const affichageButton = document.querySelector("#circle");
            //Vider le carrousel en cas de nouveau vin et ensuite afficher les suivants
            affichage.innerHTML = "";
            affichageButton.innerHTML = "";

            if(images.lenght = 0){
                    //Vider le carrousel en cas de nouveau vin et ensuite afficher les suivants
                    affichage.innerHTML = "";
                    affichageButton.innerHTML = "";
                    let img = document.createElement('img');

                    img.setAttribute('src', 'images/vin.png');
                    img.setAttribute('alt', 'bouteille de vin ');
                    img.setAttribute('class', 'd-block w-100');

                    let div = document.createElement('div');
                    div.setAttribute('class', 'carousel-item active');
                    div.appendChild(img);

                    affichage.appendChild(div);

            } else {
                for(let i=0 ; i<images.length ; i++){
                    if(i === 0){
                        if(images[0].url){
                            let image0 = images[0].url;
                            let img = document.createElement('img');
                            img.setAttribute('src', "http://cruth.phpnet.org/epfc/caviste/public/uploads/"+image0);
                            img.setAttribute('alt', 'bouteille de vin 1');
                            img.setAttribute('class', 'd-block w-100');
                            img.dataset.imgid = images[0].id;
                            img.dataset.wineid = images[0].id;

                            let div = document.createElement('div');
                            div.setAttribute('class', 'carousel-item active');
                            div.dataset.picid = images[0].id;
                            div.appendChild(img);

                            affichage.appendChild(div);

                            let li = document.createElement('li');
                            li.setAttribute('data-target', '#vin');
                            li.setAttribute('data-slide-to', '0');
                            li.setAttribute('class', 'active');
        
                            affichageButton.appendChild(li);
                        }

                    } else if(i === 1){
                        if(images[1].url){
                            let image1 = images[1].url;
                            let img = document.createElement('img');
                            img.setAttribute('src', "http://cruth.phpnet.org/epfc/caviste/public/uploads/"+image1);
                            img.setAttribute('alt', 'bouteille de vin 2');
                            img.setAttribute('class', 'd-block w-100');
        
                            let div = document.createElement('div');
                            div.setAttribute('class', 'carousel-item');
                            div.setAttribute('data-wineid', images[0].id);
                            div.appendChild(img);
        
                            affichage.appendChild(div);

                            let li = document.createElement('li');
                            li.setAttribute('data-target', '#vin');
                            li.setAttribute('data-slide-to', '1');
        
                            affichageButton.appendChild(li);
                        }

                    } else if(i === 2){
                        if(images[2].url){
                            let image2 = images[2].url;
                            let img = document.createElement('img');
                            img.setAttribute('src', "http://cruth.phpnet.org/epfc/caviste/public/uploads/"+image2);
                            img.setAttribute('alt', 'bouteille de vin 3');
                            img.setAttribute('class', 'd-block w-100');
        
                            let div = document.createElement('div');
                            div.setAttribute('class', 'carousel-item');
                            div.setAttribute('data-wineid', images[0].id);
                            div.appendChild(img);
        
                            affichage.appendChild(div);

                            let li = document.createElement('li');
                            li.setAttribute('data-target', '#vin');
                            li.setAttribute('data-slide-to', '2');
        
                            affichageButton.appendChild(li);
                        }
                    }
                }
            }
         }
     }
    xhr.onerror = function() {
        if (this.status === 404) {
            console.log('Ressource non trouvée');
        } else if (this.status === 500) {
            console.log('Erreur interne au serveur');
        }
    }
    xhr.open("GET", "http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/"+wineId+"/pictures", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + pwd));
    xhr.send();
}

/**
 * Supprime l'image d'un vin.
 * 
 * @param {string} wineId L'id du vin
 * @param {string} imgId L'id de l'image
 * @throws {SyntaxError} Si un des paramètre n'est pas défini
 * @throws {TypeError} Si wineId n'est pas de type string
 * @throws {TypeError} Si imgId n'est pas de type string
 */
function deleteImg(wineId, imgId) {
    console.log(wineId);
    console.log(imgId);
    if (wineId == null || imgId == null) {
        throw new SyntaxError('Un des paramètres n\'est pas défini!');
    }

    if (typeof(wineId) != 'string') {
        throw new TypeError('Le paramètre wineId doit être de type string!');
    }

    if (typeof(imgId) != 'string') {
        throw new TypeError('Le paramètre wineId doit être de type string!');
    }

    if (confirm('Voullez vous vraiment supprimez l\'image ? Ce changement est irréversible!')) {
        const imgId = document.getElementsByTagName('carousel-item active');
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
            if (this.status === 200) {
                console.log('ajax ok');
            }
        };

        xhr.onerror = function (){
            if (this.status === 404) {
                console.log('Ressource non trouvée!');
            }

            if (this.status === 500) {
                console.log('Erreur interne au serveur!');
            }
        };

        xhr.open('DELETE', 'http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/'+ wineId + '/pictures/' + imgId + '', true);
        httpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(sessionStorage.login + ':' + sessionStorage.password));
        xhr.send();
    }
}

/**
 * Reset le modal d'ajout de commentaire.
 */
function resetModalBox(resetTextarea = false) {
    console.log('salut');
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