(function () {
    'use strict';

    var label = {
        LB0001: 'Nome do Arquivo',
        LB0002: 'Ações',
        LB0003: 'Confirmação',
        LB0004: 'Tem certeza que deseja remover?',
        LB0005: 'Sim',
        LB0006: 'Não',
        LB0007: 'Tipo de Arquivo'
    };

    var mensagem = {
        MG001: { type: "error", msg:"Ocorreu um error ao efetuar o upload"},
        MG002: { type: "error", msg:"Não é possível efetuar o download de um arquivo não registrado"},
        MG003: { type: "error", msg:"Não é possível visualizar um arquivo não registrado"}
    };

    angular
        .module('kopp.upload')
        .constant('toastr', toastr)
        .constant('uploadGlobal', label)
        .constant('mensagemGlobal', mensagem);

})();