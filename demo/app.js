(function () {
    'use strict';

    angular
        .module('app', ['kopp.upload'])
        .config(componenteUploadConfig)
        .controller('ExemploCtrl', ExemploCtrl);

    componenteUploadConfig.$inject = ['componenteUploadConfigProvider', 'componenteUploadPreviewConfigProvider', 'UploadConfigProvider'];

    function componenteUploadConfig(configUpload, configPreview, upload) {
        configUpload.setTemplateUrl('../src/upload.html');
        configPreview.setTemplateUrl('../src/upload-preview.html');

        var config = {
            configREST: {
                url: 'http://10.2.0.61:8081/sistrak-base-rest/rs/',
                upload: 'core/file/upload',
                arquivo: {
                    base: 'basico/arquivo/arquivo',
                    download: 'download',
                    preview: 'view'
                }      
            }
        };

        upload.setConfig(config);
    
    }

    ExemploCtrl.$inject = ['Upload'];

    function ExemploCtrl(Upload) {
        var vm = this;

        vm.arquivo = new Upload();
    }

})();