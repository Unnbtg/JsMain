var myApp;

myApp = myApp || (function () {
        var pleaseWaitDiv =
            $('<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" style="z-index: 15000">' +
                '<div class="modal-dialog" role="document" style="z-index: 15001">' +
                '<div class="modal-body">' +
                '<button style="margin-left:50%;margin-top: 25% " class="btn btn-lg btn-deafault"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Carregando...</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>');
        return {
            showPleaseWait: function ($id) {
                if ($id != undefined) {
                    $(pleaseWaitDiv, $id).modal();
                    return;
                }
                pleaseWaitDiv.modal();
            },
            hidePleaseWait: function ($id) {

                if ($id != undefined) {
                    $(pleaseWaitDiv, $id).modal('hide');
                    return;
                }

                pleaseWaitDiv.modal('hide');
            },

            procuraCep: function (url, $element, array) {

                var me = $element
                var form = $element.parents('form').first();

                if (array == undefined) {
                    array = ['address', 'neighborhood', 'city', 'uf'];
                }
                myApp.showPleaseWait(form);
                $.ajax({
                    url: url + me.val().replace('.', ''),
                    dataType: 'json',
                    type: 'get',
                    success: function (data) {
                        myApp.hidePleaseWait(form);
                        $("input[name=" + array[0] + ']', form).val(data.street);
                        $("input[name=" + array[1] + ']', form).val(data.neighborhood);
                        $("input[name=" + array[2] + ']', form).val(data.city);
                        $("input[name=" + array[3] + ']', form).val(data.uf);
                    }
                });
            },
            ajaxModalShow: function (titulo, url, onSuccess, size) {
                var modal = $('#emptyModal');
                var body = modal.find('.modal-body').first();

                $(".modal-dialog", modal).css("width", "")

                if (size != undefined) {
                    $(".modal-dialog", modal).css('width', size + '%');
                }

                body.html('<button class="btn btn-lg btn-deafault"><span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span> Loading...</button>');
                $("#emptyModalTitle").text(titulo);

                $.ajax({
                    url: url,
                    success: function (data) {
                        var emptyModal = $("#emptyModalEventHandler");
                        emptyModal.unbind("onSuccess");
                        emptyModal.on('onSuccess', onSuccess);
                        body.html(data);
                    }
                });
                modal.modal('show');
            },
            ajaxModalClose: function () {
                var modal = $('#emptyModal');
                modal.modal('hide');
            },

            deleteElement: function (msg, url, onSuccess, onFail) {
                bootbox.confirm(msg, function (result) {

                    if (!result) {
                        return;
                    }

                    $.ajax({
                        url: url,
                        type: 'delete',
                        data: {_token: $("#hidden_token").val()},
                        success: onSuccess,
                        error: onFail
                    });
                });
            },
            getFormdata: function (form) {
                var formdata = new FormData();
                $("input, select, textarea", form).each(function () {
                    var me = $(this);
                    var value = me.val();

                    if (me.attr('type') == 'file') {
                        value = me[0].files[0];
                    }


                    console.log(me.attr('name'), me.attr('type'), value);
                    formdata.append(me.attr('name'), value);

                });
                return formdata;
            },
            getCep: function (cep, callback) {
                cep = cep.replace(/[^\d]+/g, '');

                var executar = callback

                if (typeof(callback) !== 'function') {
                    console.log('na eh funcao');
                    executar = function (data) {
                        console.log('oi');
                        myApp.populateEndereco(data, callback)
                    }
                }

                $.ajax({
                    url: "/endereco/" + cep,
                    type: 'get',
                    dataType: 'json',
                    success: executar
                });
            },
            populateEndereco: function (data, div) {
                $(".estado", div).val(data.state);
                $(".cidade", div).val(data.city);
                $(".bairro", div).val(data.neighborhood);
                $(".rua", div).val(data.street);
            }

        };
    })();

$(function(){
    $("body").append(
    '<div class="modal fade" id="emptyModal" tabindex="-1" role="dialog" aria-labelledby="emptyModalTitle">'+
        '<div class="modal-dialog" role="document">'+
            '<div class="fade" id="emptyModalEventHandler"></div>'+
            '<div class="modal-content">'+
                '<div class="modal-header">'+
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
                        '<span aria-hidden="true">&times;</span>'+
                    '</button>'+
                    '<h4 class="modal-title" id="emptyModalTitle">Titulo</h4>'+
                '</div>'+
                '<div class="modal-body">' +
                    '<button class="btn btn-lg btn-deafault">' +
                        '<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>Loading...'+
                    '</button>'+
                '</div>'+
            '</div>'+
        '</div>'+
    '</div>');
});