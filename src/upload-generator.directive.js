(function () {
	'use strict';

	angular
		.module('kopp.upload')
		.directive('uploadGenerator', uploadGenerator);

	uploadGenerator.$inject = ['$compile', '$q']

	function uploadGenerator($compile, $q) {
		var directive = {
			restrict: 'E',
			templateUrl: 'src/upload-generator.html',
			link: link,
			scope: true
		};

		return directive;

		function link(scope, element, attr) {
			scope.componente = scope.$eval(attr.uploader);
		}
	}
})();