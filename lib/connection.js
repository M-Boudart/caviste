import {findLogin, validPassword, getId} from '../module/users.js';

if (sessionStorage.length == 0) { // Utilisateur déconnecté
    displayDisconnectedInterface();

    const frmLogIn = document.forms['frmLogIn'];
    
    frmLogIn.addEventListener('submit', function(event) {
        if (checkLogIn(frmLogIn)) {
            displayConnectedInterface();
        } else {
            event.preventDefault();
        }
    });
} else { // Utilisateur connecté
    displayConnectedInterface();

    const btLogOut = document.querySelector('#btLogOut');

    btLogOut.addEventListener('click', function() {
        sessionStorage.clear();

        // displayDisconnectedInterface();

        window.location.href = 'http://localhost/caviste/'; // Solution "rustine" à la ligne 25 car l'évenement ne veut pas s'enlever donc l'image du like s'affiche encore après déconnexion

        // Tentative de remplacement de la redirection
        /* const listTr = document.querySelectorAll('tr');
        console.log(listTr);
        for (const tr of listTr) {
            tr.removeEventListener('click', displayLikeImageEvent);
        }*/ 
    });
}


/**
 * Vérifie si la connexion est valide et affiche un message d'erreur en cas de non validité.
 * 
 * @param {HTMLFormElement} frmLogIn Le formulaire à valider.
 * @return True : si la connexion est valide | False si la connexion n'est pas valide.
 */
function checkLogIn(frmLogIn) {
    let message = '';
    let userIndex;
    let validConnection;
    const login = frmLogIn.login.value;
    const pwd = frmLogIn.pwd.value;

    // Validation des champs
    if (login.length == 0 || pwd.length == 0) {
        message = 'Veuillez remplir les champs obligatoires !';
    } else if (!findLogin(login)) {
        message = 'Login / Mot de passe incorrect !';
    } else if (!validPassword(login, pwd)) {
        message = 'Login / Mot de passe incorrect !';
    } else {
        userIndex = getId(login);
        validConnection = true;
    }
 
    if (!validConnection) {
        resetErrorMessage();

        //Création et affichage du message d'erreur
        const divError = document.createElement('div');
        divError.setAttribute('id', 'divError');
        divError.setAttribute('class', 'alert alert-danger');
        divError.setAttribute('role', 'alert');

        const errorMessage = document.createTextNode(message);
        divError.appendChild(errorMessage);

        frmLogIn.appendChild(divError);

        return false;
    }

    sessionStorage.setItem('userId', userIndex);
    sessionStorage.setItem('login', login);
    sessionStorage.setItem('password', pwd);

    return true;
}

/**
 * Affiche l'interface de l'utilisateur connecté.
 */
function displayConnectedInterface() {
    document.forms['frmLogIn'].style.display = 'none';
    document.querySelector("#col-imgWine > p").style.display = 'none';
    document.querySelector("#col-imgWine > img").style.display = 'none';

    document.querySelector("#divConnectedUser > p").innerHTML = 'Bienvenue ' + sessionStorage.getItem('login');
    document.querySelector("#btLike").style.display = 'inline';
    document.querySelector("#btOpenModalComment").style.display = 'inline';
}

/**
 * Affiche l'interface de l'utilisateur déconnecté.
 */
function displayDisconnectedInterface() {
    document.querySelector('#divConnectedUser').style.display = 'none';
    document.querySelector("#btLike").style.display = 'none';
    document.querySelector("#col-imgWine > img").style.display = 'none';
    document.querySelector("#col-imgWine > p").style.display = 'none';
    document.querySelector("#btOpenModalComment").style.display = 'none';

    document.forms['frmLogIn'].style.display = 'block';
}

/**
 * Reset le message d'erreur lors de la connexion.
 */
function resetErrorMessage() {
    try {
        document.querySelector("#divError").remove();
    } catch(error) {
        1+1;
    } 
}