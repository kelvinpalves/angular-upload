(function () {
    'use strict';

    var label = {
        LB0001: 'Nome do Arquivo',
        LB0002: 'Ações',
        LB0003: 'Confirmação',
        LB0004: 'Tem certeza que deseja remover?',
        LB0005: 'Sim',
        LB0006: 'Não'
    };

    angular
        .module('kopp.upload')
        .constant('uploadGlobal', label);

})();