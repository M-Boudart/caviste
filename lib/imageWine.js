const login = sessionStorage.getItem('login');
const pwd = sessionStorage.getItem('password');

setTimeout(function() {
    const listTr = document.querySelectorAll('tr');
    let btImg = document.getElementById("btSendImg");
    let btDelImg = document.getElementById("btDeleteImg");


    for (const tr of listTr) {
        let wineId = tr.dataset.id;
           
        tr.addEventListener('click', function() {
            showImage(wineId);
        });

        btImg.addEventListener('click', function() {
            sendImg(wineId);
        });

        btDelImg.addEventListener('click', function() {
            deleteImg(wineId);
        });
    }
},1500);



/**
 * Fonction qui supprime une image de vin
 * 
 * @param {int} wineId L'id du vin sélectionné
 */
function deleteImg(wineId) {

    let pictId = document.getElementsByTagName('carousel-item active');  //L'image visionnée au moment du clic (1,2,3)

    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ? Ce changement est irréversible.')) {
        login = sessionStorage.getItem('login');
        pwd = sessionStorage.getItem('password');

        const httpRequest = new XMLHttpRequest();

        httpRequest.onload = function() {

            if (this.status === 200) {
                for (const tr of listTr) {
                    wineId = tr.dataset.id;
                    showImage(wineId)
                }
            }
        }

        httpRequest.onerror = function() {
            if (this.status === 404) {
                console.log('Ressource non trouvée!');
            } else if (this.status === 500) {
                console.log('Erreur interne au serveur!');
            }
        }

        xhr.open("DELETE", "http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/"+wineId+"/pictures/"+ pictId + "", true);
        xhr.setRequestHeader("Authorization", "Basic " + btoa(login + ":" + pwd));
        xhr.send(data);
    }
}


/**
 * Fonction qui permet l'envois des images vers l'API (nb === 3 && max 100ko && one by one only)
 * 
 * @param {int} wineId L'id du vin sélectionné
 * @param {file} img L'image uploadée par l'utilisateur
 */
function sendImg(wineId){

    const xhr = new XMLHttpRequest();

    xhr.onload = function() { 
            if(this.status === 200) {

                const frm = document.forms['frmUpload'];
                const file = frm.value;
                const data = new FormData;	 
                data.append('file', file);
                const photoFile = data.get('file');
        };

        xhr.open('POST', "http://cruth.phpnet.org/epfc/caviste/public/index.php/api/wines/"+wineId+"/pictures", true);
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(login + ':' + pwd));
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
}


/**
 * Fonction qui permet l'affichages des images
 * 
 * @param {int} wineId L'id du vin sélectionné
 */
function showImage(wineId){

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

                            let div = document.createElement('div');
                            div.setAttribute('class', 'carousel-item active');
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