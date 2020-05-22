let btSearch = document.getElementById("btSearch");
btSearch.addEventListener("click", function (){
    let searchValue = document.getElementById("search").value;     
    if((searchValue != "")){                 
        xhr.onload = function() {
            if (this.status === 200) {
                let wines = JSON.parse(this.responseText);
        
                const tabWines = document.createElement('table');
                tabWines.setAttribute('class', 'table');
        
                for (const wine of Object.entries(wines)) {
                    let wineName = document.createTextNode(wine[1].name);
                    let td = document.createElement('td');
                    td.appendChild(wineName);
        
                    let tr = document.createElement('tr');
                    tr.setAttribute('data-id', wine[1].id);
                    tr.appendChild(td);
        
                    tabWines.appendChild(tr);
                }
        
                const divWinesTable = document.querySelector("#col-tabWines");
                divWinesTable.appendChild(tabWines);
        
                const listTr = document.querySelectorAll('tr');
        
                for (const tr of listTr) {
                    let id = tr.dataset.id;
        
                    tr.addEventListener('click', function() {
                        showWineInfo(id);
                    });
                }
        
                // Rend invisible le compteur de like et l'image coup de coeur
                document.querySelector("#col-imgWine > img").style.display = 'none';
                document.querySelector("#col-imgWine > p").style.display = 'none';
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
       
    
    };
});