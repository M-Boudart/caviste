window.onload = function() {
    const divConnectedUser = document.querySelector('#divConnectedUser');
    const frmLogIn = document.forms['frmLogIn'];

    if (sessionStorage.length == 0) { // Utilisateur déconnecté
        divConnectedUser.style.display = 'none';

        // Gestion de la connexion
        frmLogIn.addEventListener('submit', function(event) {
            if (checkLogIn(frmLogIn)) {
                divConnectedUser.style.display = 'inline';
                frmLogIn.style.display = 'none';
                return true;
            } else {
                event.preventDefault();
                return false;
            }
        });
    } else { // Utilisateur connecté
        frmLogIn.style.display = 'none';
        document.querySelector("#divConnectedUser > p").innerHTML = 'Bienvenue ' + sessionStorage.getItem('login');
        
        const btLogOut = document.querySelector('#btLogOut');
        // Gestion de la déconnexion
        btLogOut.addEventListener('click', function() {
            sessionStorage.clear();
            divConnectedUser.style.display = 'none';
            frmLogIn.style.display = 'block';
        });
    }
};

/**
 * Vérifie si la connexion est valide et affiche un message d'erreur en cas de non validité.
 * 
 * @param {HTMLFormElement} frmLogIn Le formulaire à valider.
 * @return True : si la connexion est valide | False si la connexion n'est pas valide.
 */
function checkLogIn(frmLogIn) {
    let message = '';
    let userIndex;
    const tabUsers = [
        'ced',
        'bob',
        'radad',
        'adam',
        'alain',
        'amin',
        'amine',
        'angeline',
        'badreddine',
        'belkacem',
        'gregory',
        'ismail',
        'appolinaire',
        'kwasi',
        'manuel',
        'maxime',
        'myriam',
        'nathalie',
        'mamadou',
        'rachida',
        'simon',
        'thomas',
        'youssef',
        'nathan',
    ];
    const login = frmLogIn.login.value;
    const pwd = frmLogIn.pwd.value;

    // Validation des champs
    if (login.length == 0 || pwd.length == 0) {
        message = 'Veuillez remplir les champs obligatoires !';
    } else if (pwd != 'epfc') {
        message = 'Login / Mot de passe incorrect !';
    } else if (tabUsers.indexOf(login) == -1) {
        message = 'Login / Mot de passe incorrect !';
    } else {
        userIndex = tabUsers.indexOf(login) + 1;
    }
 
    if (message.length > 0) {
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