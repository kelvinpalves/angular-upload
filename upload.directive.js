(function () {
	'use strict';

	angular
		.module('componentes.upload')
		.directive('componenteUpload', componenteUpload);

	componenteUpload.$inject = ['$compile', '$q']

	function componenteUpload($compile, $q) {
		var directive = {
			restrict: 'E',
			templateUrl: 'src/app/componentes/upload/upload.html',
			link: link,
			scope: true
		};

		return directive;

		function link(scope, element, attr) {
			scope.componente = scope.$eval(attr.uploader);
		}
	}
})();