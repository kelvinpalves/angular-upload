(function () {
	'use strict';

	angular
		.module('kopp.upload')
		.directive('componenteUploadPreview', componenteUploadPreview)
		.provider('componenteUploadPreviewConfig', componenteUploadPreviewConfig);

	function componenteUploadPreview(componenteUploadPreviewConfig) {
		var config = componenteUploadPreviewConfig.config;
		var templateUrl = angular.isDefined(config.templateUrl) ? config.templateUrl : '../src/upload-preview.html';

		var directive = {
			restrict: 'E',
			templateUrl: templateUrl
		};

		return directive;
	}

	function componenteUploadPreviewConfig() {
        var config = {
        	templateUrl: undefined
        };

        var componenteUpload = {
            config: config
        };

        this.setTemplateUrl = function (url) {
        	config.templateUrl = url;
        };

        this.$get = function () {
            return componenteUpload;
        };
    }
})();