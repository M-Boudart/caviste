/**
 * Fichier qui "simule" la base de donnée des utilisateurs ainsi que les intéractions avec celle-ci.
 */

const users = [
    {
        "id": 1,
        "login": "ced",
        "password": "epfc"
    },
    {
        "id": 2,
        "login": "bob",
        "password": "epfc"
    },
    {
        "id": 3,
        "login": "radad",
        "password": "epfc"
    },
    {
        "id": 4,
        "login": "adam",
        "password": "epfc"
    },
    {
        "id": 5,
        "login": "alain",
        "password": "epfc"
    },
    {
        "id": 6,
        "login": "amin",
        "password": "epfc"
    },
    {
        "id": 7,
        "login": "amine",
        "password": "epfc"
    },
    {
        "id": 8,
        "login": "angeline",
        "password": "epfc"
    },
    {
        "id": 9,
        "login": "badreddine",
        "password": "epfc"
    },
    {
        "id": 10,
        "login": "belkacem",
        "password": "epfc"
    },
    {
        "id": 11,
        "login": "gregory",
        "password": "epfc"
    },
    {
        "id": 12,
        "login": "ismail",
        "password": "epfc"
    },
    {
        "id": 13,
        "login": "appolinaire",
        "password": "epfc"
    },
    {
        "id": 14,
        "login": "kwasi",
        "password": "epfc"
    },
    {
        "id": 15,
        "login": "manuel",
        "password": "epfc"
    },
    {
        "id": 16,
        "login": "maxime",
        "password": "epfc"
    },
    {
        "id": 17,
        "login": "myriam",
        "password": "epfc"
    },
    {
        "id": 18,
        "login": "nathalie",
        "password": "epfc"
    },
    {
        "id": 19,
        "login": "mamadou",
        "password": "epfc"
    },
    {
        "id": 20,
        "login": "rachida",
        "password": "epfc"
    },
    {
        "id": 21,
        "login": "simon",
        "password": "epfc"
    },
    {
        "id": 22,
        "login": "thomas",
        "password": "epfc"
    },
    {
        "id": 23,
        "login": "youssef",
        "password": "epfc"
    },
    {
        "id": 24,
        "login": "nathan",
        "password": "epfc"
    }
];

/**
 * Récupère le nom de l'utilisateur à partir d'un id donné.
 * 
 * @param {string} id L'id donné
 * @return Le nom d'utilisateur | false si l'utilisateur n'existe pas
 * @throws {SyntaxError} Si le paramètre id n'est pas défini
 * @throws {TypeError} Si id n'est pas de type string
 */
export function getLogin(id) {
    if (id == null) {
        throw new SyntaxError('Le paramètre id n\'est pas défini!');
    }

    if (typeof(id) != 'string') {
        throw new TypeError('Le paramètre id doit être de type string!');
    }

    let i = 0;
    let found = false;
    let login;

    while(i < users.length && !found) {
        if (users[i].id == id) {
            login = users[i].login;
            found = true;
        }

        i++;
    }

    if (found) {
        return login;
    } else {
        return false;
    }
}

/**
 * Récupère l'id d'utilisateur à partir d'un login donné.
 * 
 * @param {string} login Le login donné 
 * @return L'id d'utilisateur | false si l'utilisateur n'existe pas
 * @throws {SyntaxError} Si le paramètre login n'est pas défini
 * @throws {TypeError} Si login n'est pas de type string
 */
export function getId(login) {
    if (login == null) {
        throw new SyntaxError('Le paramètre id n\'est pas défini!');
    }

    if (typeof(login) != 'string') {
        throw new TypeError('Le paramètre id doit être de type string!');
    }

    let i = 0;
    let id;

    while(i < users.length) {
        if (users[i].login == login) {
            return users[i].id;
        }

        i++;
    }

    return false;
}

/**
 * Vérifie l'existance d'un utilisateur à partir d'un nom donnée.
 * 
 * @param {string} login le login donné
 * @return true si l'utilisateur existe | false si l'utilisateur n'existe pas
 * @throws {SyntaxError} Si le paramètre login n'est pas défini
 * @throws {TypeError} Si le paramètre login n'est pas de type string
 */
export function findLogin(login) {
    if (login == null) {
        throw new SyntaxError('Le paramètre login n\'est pas défini!');
    }

    if (typeof(login) != 'string') {
        throw new TypeError('Le paramètre login doit être de type string!');
    }

    let i = 0;

    while (i < users.length) {
        if (users[i].login == login) {
            return true;
        }

        i++;
    }

    return false;
}

/**
 * Valide une combinaison de login / mot de passe.
 * 
 * @param {string} login le login donné
 * @param {string} password le mot de passe donné
 * @return true si la combinaison est bonne | false si elle ne l'est pas
 * @throws {SyntaxError} Si un des paramètres n'est pas défini
 * @throws {TypeError} Si le paramètre login et/ou password ne sont pas de type string
 */
export function validPassword(login, password) {
    if (login == null || password == null) {
        throw new SyntaxError('Un des paramètres n\est pas défini!');
    }

    if (typeof(login) != 'string') {
        throw new TypeError('Le paramètre login doit être de type string!');
    }

    if (typeof(password) != 'string') {
        throw new TypeError('Le paramètre password doit être de type string!');
    }

    let i = 0;

    while (i < users.length) {
        if (users[i].login == login) {
            if (users[i].password == password) {
                console.log('azeaze');
                return true;
            }
        }

        i++;
    }

    return false;
}