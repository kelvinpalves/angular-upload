(function () {
	'use strict';

	angular
		.module('kopp.upload')
		.factory('UploadGenerator', UploadGenerator);

	UploadGenerator.$inject = ['arquivoUtils', 'Upload', '$q', 'controller']

	function UploadGenerator(arquivoUtils, Upload, $q, controller) {

		function Componente() {

			var vm = this;

			vm.dtoArquivos = [];
			vm.cssColuna = 'col-md-4';
			vm.inicializar = inicializar;
			vm.iniciar = iniciar;
			vm.ler = ler;
			vm.removerComponentes = removerComponentes;

			function criarArrayTipos(tipos) {
				return tipos.split(',');
			}

			function inicializar(arquivos) {
				limpar().then(function () {
					if (!angular.equals(arquivos, {})) {
						for (var componente in arquivos) {
							angular.forEach(vm.dtoArquivos, function(values) {
								if (values['codigoTipo'] === componente) {
									values.componenteUpload.inicializar(arquivos[componente]);
								}
							});
						}
					}
				});
			}

			function iniciar(options) {
				var promises = [];
				var deferred = $q.defer();

				if (options && options.limpar) {
					vm.dtoArquivos = [];
				}

				if (options && options.codCategArquivo) {
					promises.push(lerTipoArquivoAceitos(options.codCategArquivo));
				}

				if (options && options.codTipoArquivo) {
					promises.push(lerTipoArquivoAceito(options.codTipoArquivo));
				}

				if (options && options.cssColuna) {
					vm.cssColuna = options.cssColuna;
				}

				controller.ready(promises).then(function(values) {
					deferred.resolve(true);
				});

				return deferred.promise;
			}

			function ler() {
				var deferred = $q.defer();
				var retorno = {};

				if (vm.dtoArquivos.length > 0) {
					angular.forEach(vm.dtoArquivos, function(value, index) {
						retorno[value.codigoTipo] = value.componenteUpload.ler();

						if (index === (vm.dtoArquivos.length - 1)) {
							deferred.resolve(retorno);
						}
					});
				}

				return deferred.promise.$$state.value;
			}

			function lerTipoArquivoAceito(codTipoArquivo) {
				return arquivoUtils.lerTipoArquivoAceito(codTipoArquivo).then(success).catch(error);

				function error(response) {
					return vm.dtoArquivos = [];
				}

				function success(response) {
					return angular.forEach(response.objeto, function (value) {
						vm.dtoArquivos.push({
							descricao: value.descricao,
							codigoTipo: value.codigoTipo,
							componenteUpload: new Upload({ filtrarArquivos: criarArrayTipos(value.listaMimetypes) })
						});
					});
				}
			}

			function lerTipoArquivoAceitos(codCategArquivo) {
				return arquivoUtils.lerTipoArquivoAceitos(codCategArquivo).then(success).catch(error);

				function error(response) {
					return vm.dtoArquivos = [];
				}

				function success(response) {
					return angular.forEach(response.objeto, function (value) {
						vm.dtoArquivos.push({
							descricao: value.descricao,
							codigoTipo: value.codigoTipo,
							componenteUpload: new Upload({ filtrarArquivos: criarArrayTipos(value.listaMimetypes) })
						});
					});
				}
			}

			function limpar() {
				var deferred = $q.defer();


				angular.forEach(vm.dtoArquivos, function(values, index) {
					values.componenteUpload.inicializar();
					if (index === (vm.dtoArquivos.length - 1)) {
						deferred.resolve(true);
					}
				});

				return deferred.promise;
			}

			function removerComponentes() {
				vm.dtoArquivos = [];
			}
		}

		return Componente;
	}
})();