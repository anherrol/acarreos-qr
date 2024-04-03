import { AuthProxy, CatalogsProxy } from "./dataLayer.js";

if (!previousLoading) {
    var previousLoading = true;

    $(document).ready(function () {
        // login button
        $('#btnLogin').click(function () {
            var username = $("#account").val();
            var password = $("#password").val();
            var plates = $("#plates").val();

            console.log("placas", plates);
            
            if ($.trim(username).length > 0 && $.trim(password).length > 0) {
                var authDL = new AuthProxy();

                authDL.loginService(username, password);
            }

            return false;
        });

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        if (urlParams.has('p')) {
            $("#plates").val(urlParams.get('p'));
            
            $("#div-placas").hide();
            
            $("#data-placas").text(urlParams.get('p'));

            loadData();
        } else {
            console.log('No hay una placa a identificar.');

            $("#data-placas").show();
        }
    });
            
    function limpiarLista(lista) {
        lista.value = '';
    }

    async function loadData() {


        /*
        var catalogsProxy = new CatalogsProxy();

        catalogsProxy.getData()
        */
    }
}
