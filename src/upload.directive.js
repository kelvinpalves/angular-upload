(function () {
	'use strict';

	angular
	.module('kopp.upload')
	.directive('componenteUpload', componenteUpload)
	.provider('componenteUploadConfig', componenteUploadConfig);

	function componenteUpload(componenteUploadConfig) {
		var config = componenteUploadConfig.config;
		var templateUrl = angular.isDefined(config.templateUrl) ? config.templateUrl : '../src/upload.html';

		var directive = {
			restrict: 'E',
			templateUrl: templateUrl,
			link: link,
			scope: true
		};

		return directive;

		function link(scope, element, attr) {
			scope.componente = scope.$eval(attr.uploader);
		}
	}

	function componenteUploadConfig() {
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