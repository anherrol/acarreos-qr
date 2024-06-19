import { AuthProxy, QrsProxy } from "./dataLayer.js";

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

            loadData($("#data-placas").text());
        } else {
            console.log('No hay una placa a identificar.');

            $("#data-placas").show();
        }
    });
            
    function limpiarLista(lista) {
        lista.value = '';
    }

    async function loadData(plates) {
        var qrsProxy = new QrsProxy();

        qrsProxy.getUnitInfo(
            plates, 
            (data) => {
                console.log(data);
                $("#data-placas").text(data.plates);
                $("#data-economical").text(data.economicalNumber);
                $("#data-transportista").text(data.carrier);
                $('#truck-image').attr('src','https://acarreosmobileapi.azurewebsites.net/api/files/download?fileName=' + data.plates + '.JPEG');
            });

        qrsProxy.getHaulingInfo(
            plates, 
            (data) => {
                console.log(data);

                if (data.ticketId > 0) {
                    $("#hauling-data-div").show();
                    $("#data-ticket-id").text(data.ticketId);

                    const event = new Date(data.departureDate);
                    const options = {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    };
                    $("#data-departure-date").text(event.toLocaleDateString('es-MX', options));

                    $('#gondola-one-image').attr('src','https://acarreosmobileapi.azurewebsites.net/api/files/download?fileName=' + data.gondolaOne + '.JPEG');
                    $("#data-placas-gondola-one").text(data.gondolaOne);

                    $('#gondola-two-image').attr('src','https://acarreosmobileapi.azurewebsites.net/api/files/download?fileName=' + data.gondolaTwo + '.JPEG');
                    $("#data-placas-gondola-two").text(data.gondolaTwo);
                } else {
                    $("#hauling-data-div").hide();
                }
            }
        )
    }
}
