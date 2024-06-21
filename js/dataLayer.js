import { ServiceProxy } from "./serviceProxy.js";
import { LocalRepository } from "./localRepository.js";

if (typeof BASE_API_URL === 'undefined' || typeof ajaxService === 'undefined') {
    // var BASE_API_URL = 'http://acarreosapi.local/api/';
    // var BASE_API_URL = 'https://localhost:7065/api/'; 
    var BASE_API_URL = 'https://acarreosmobileapi.azurewebsites.net/api/';
}

export class AuthProxy {
    constructor() {
        this.service = 'auth/';
        this.ajaxService = new ServiceProxy(BASE_API_URL);

        // login service
        this.loginService = async function (username, password) {
            // your callback down here
            var loginResult;

            this.ajaxService.callPostService(
                this.service + 'login',
                { 'userKey': username, 'userPassword': password },
                async (model) => {
                    if (model) {
                        var parameters = new Parameters();
                        await parameters.store("userData", model);
                        console.log('userName', username);
                        console.log('userPassword', password);

                        //$("body").load("menu.html").hide().fadeIn(1500).delay(6000);
                        window.location.href = "unit-profile.html?p=" + $("#plates").val();
                    }
                    else {
                        $('#loginForm').shake();
                        $("#btnLogin").val('Iniciar sesi&oacute;n');
                        $("#error").html("<span style='color:#cc0000'>Error:</span> Usuario y contraseña inválidos.");
                    }
                },
                (jqXhr, textStatus, errorMessage) => {
                    $("#error").html(`Error${errorMessage}`);
                }
            );
        };

        // login service
        this.closeSession = async function () {
            var parameters = new Parameters();

            await parameters.delete("userData");
        };

        // sync job places
        this.getJobPLaces = function (successCallBack) {
            let action = 'jobplaces';

            this.ajaxService.callGetService(
                this.service + action,
                null,
                successCallBack,
                (jqXhr, textStatus, errorMessage) => {
                    $("#error").html(`Error${errorMessage}`);
                }
            );
        };
    }
}

export class CatalogsProxy {
    constructor() {
        this.service = 'catalogs/';
        this.ajaxService = new ServiceProxy(BASE_API_URL);

        // catalogs recovery
        this.getData = function (catalogName, successCallBack) {
            this.ajaxService.callGetService(
                this.service + catalogName,
                null,
                successCallBack,
                (jqXhr, textStatus, errorMessage) => {
                    $("#error").html(`Error${errorMessage}`);
                }
            );
        };

        // entity recovery
        this.getData = function (catalogName, catalogId, successCallBack) {
            this.ajaxService.callGetService(
                this.service + catalogName + '/' + catalogId,
                null,
                successCallBack,
                (jqXhr, textStatus, errorMessage) => {
                    $("#error").html(`Error${errorMessage}`);
                }
            );
        };

        // entity recovery
        this.getUnitInfo = function (plates, successCallBack) {
            this.ajaxService.callGetService(
                this.service + catalogName + '/' + catalogId,
                null,
                successCallBack,
                (jqXhr, textStatus, errorMessage) => {
                    $("#error").html(`Error${errorMessage}`);
                }
            );
        };
    }
}

export class QrsProxy {
    constructor() {
        this.service = 'qrcodes/';
        this.ajaxService = new ServiceProxy(BASE_API_URL);

        // entity recovery
        this.getUnitInfo = function (plates, successCallBack) {
            this.ajaxService.callGetService(
                this.service + 'unitinfo/' + plates,
                null,
                successCallBack,
                (jqXhr, textStatus, errorMessage) => {
                    $("#error").html(`Error${errorMessage}`);
                }
            );
        };

        this.getHaulingInfo = function(plates, successCallBack) {
            this.ajaxService.callGetService(
                this.service + 'lastHauling/' + plates,
                null,
                successCallBack,
                (jqXhr, textStatus, errorMessage) => {
                    $("#error").html(`Error${errorMessage}`);
                }
            );
        }
    }
}

export class Parameters {
    constructor() {
        this.localRepository = new LocalRepository();

        this.store = async function (name, value) {
            await this.localRepository.parameters.storeParameter(name, value);
        };

        this.get = async function (name) {
            return await this.localRepository.parameters.getParameter(name);
        };

        this.delete = async function (name) {
            return await this.localRepository.parameters.deleteParameter(name);
        };
    }
}

export class LogEntriesProxy {
    constructor() {
        this.service = 'logentries/storeEntry';
        this.ajaxService = new ServiceProxy(BASE_API_URL);

        this.storeLogEntry = function (logEntry, userId, logDateTime) {
            this.ajaxService.callPostService(
                this.service,
                {
                    "logEntry": logEntry,
                    "userId": userId,
                    "logDateTime": logDateTime
                },
                successCallBack,
                (jqXhr, textStatus, errorMessage) => {
                    $("#error").html(`Error${errorMessage}`);
                }
            );
        };
    }
}
