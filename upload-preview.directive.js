(function () {
	'use strict';

	angular
		.module('componentes.upload')
		.directive('componenteUploadPreview', componenteUploadPreview);

	componenteUploadPreview.$inject = ['$compile', '$q']

	function componenteUploadPreview($compile, $q) {
		var directive = {
			restrict: 'E',
			templateUrl: 'src/app/componentes/upload/upload-preview.html?v=2'
		};

		return directive;
	}
})();