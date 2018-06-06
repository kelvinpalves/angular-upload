(function () {
    'use strict';

    angular
        .module('app', ['kopp.upload'])
        .config(componenteUploadConfig);

    componenteUploadConfig.$inject = ['componenteUploadConfigProvider', 'componenteUploadPreviewConfigProvider'];

    function componenteUploadConfig(configUpload, configPreview) {
        configUpload.setTemplateUrl('../src/upload.html');
        configPreview.setTemplateUrl('../src/upload-preview.html');
    }

})();