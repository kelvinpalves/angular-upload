(function () {

    'use strict';

    angular
            .module('kopp.upload')
            .factory('Upload', Upload)
            .provider('UploadConfig', UploadConfig);

    Upload.$inject       = ['FileUploader', 'UploadConfig', '$q', '$window', 'Lightbox', 'mensagem', 'mensagemGlobal'];
    UploadConfig.$inject = ['uploadGlobal'];

    function Upload(FileUploader, config, $q, $window, Lightbox, mensagem, mensagemGlobal) {

        function ComponenteUpload(options) {
            var LIMITE_EXCEDIDO = 'queueLimit';
            var MIME_TYPE_FILTER = 'mimeTypeFilter';

            var vm = this;

            var configuracaoREST = config.configREST;

            vm.arquivos           = [];
            vm.barraProgresso     = 0;
            vm.envioMultiplo      = false;
            vm.inicializar        = inicializar;
            vm.ler                = ler;
            vm.label              = config.label;
            vm.possuiArquivoUnico = false;
            vm.remover            = remover;
            vm.restaurarArquivo   = restaurarArquivo;
            vm.visualizar         = visualizar;

            var msg     = mensagemGlobal;
            var msgAttr = mensagem.msgAttr;

            var controller = {
                feed: mensagem.feed,
                feedMessage: mensagem.feedMessage,
                messageType: mensagem.type
            };

            iniciar(options);

            function adicionarFiltro(array) {
                vm.uploader.filters.push({
                    name: 'mimeTypeFilter',
                    fn: function (item, options) {
                        options = array;
                        var deferred = $q.defer();

                        angular.forEach(array, function (value, index) {
                            if (value == item.type) {
                                deferred.resolve(true);
                            }

                            if (index === (array.length - 1)) {
                                deferred.resolve(false);
                            }
                        });

                        return (deferred.promise).$$state.value
                    }
                });
            }

            function atualizarProgresso(progresso) {
                vm.barraProgresso = progresso;
            }

            function criarDTO() {
                vm.dto = [];

                if (vm.arquivos.length === 0) {
                    return vm.dto.length === 0 ? null : vm.dto;
                }

                for (var i = 0; i < vm.arquivos.length; i++) {
                    var novo = {};

                    for (var key in vm.arquivos[i]) {
                        if (key !== 'fileItem' && key !== 'nomeExibicao') {
                            novo[key] = vm.arquivos[i][key];
                        }
                    }

                    vm.dto.push(novo);

                    if (i === (vm.arquivos.length - 1)) {
                        return vm.dto.length === 0 ? null : vm.dto;
                    }
                }
            }

            function erroAoAdcionarArquivo(item, filter, options) {
                if (filter.name === MIME_TYPE_FILTER) {
                    controller.feed(msg.MG001); // TODO: Ver algum dia.
                } else {
                    controller.feed(msg.MG001);
                }
            }

            function gerarUrlDownload(objeto) {
                var deferred = $q.defer();

                if (objeto.id) {
                    deferred.resolve(configuracaoREST.url + configuracaoREST.arquivo.base + '/' + objeto.id + '/' + configuracaoREST.arquivo.download);
                } else {
                    deferred.reject();
                }

                return deferred.promise;
            }

            function gerarUrlImagem(objeto) {
                var deferred = $q.defer();

                if (objeto.id) {
                    deferred.resolve(configuracaoREST.url + configuracaoREST.arquivo.base + '/' + objeto.id + '/' + configuracaoREST.arquivo.preview);
                } else {
                    var reader = new FileReader();
                    reader.readAsDataURL(objeto.fileItem._file);
                    reader.onload = leituraEfetuada;
                }

                function leituraEfetuada(e) {
                    deferred.resolve(e.target.result);
                }

                return deferred.promise;
            }

            function gerarUrlPdf(objeto) {
                var deferred = $q.defer();

                if (objeto.id) {
                    deferred.resolve(configuracaoREST.url + configuracaoREST.arquivo.base + '/' + objeto.id + '/' + configuracaoREST.arquivo.preview);
                } else {
                    deferred.reject();
                }

                return deferred.promise;
            }

            function inicializar(arquivos) {
                vm.arquivos = [];
                angular.forEach(arquivos, function (value) {
                    value.nomeExibicao = value.nome;
                    vm.arquivos.push(value);
                });
            }

            function iniciar(options) {
                vm.uploader = new FileUploader();

                vm.uploader.onWhenAddingFileFailed = erroAoAdcionarArquivo;
                vm.uploader.onSuccessItem          = sucessoAoAdicionarItem;
                vm.uploader.onProgressAll          = atualizarProgresso;
                vm.uploader.onCompleteAll          = uploadFinalizado;
                vm.uploader.onErrorItem            = uploadErro;

                vm.uploader.autoUpload = true;
                vm.uploader.url = configuracaoREST.url + configuracaoREST.upload;


                if (options && options.autoUpload && options.autoUpload === false) {
                    vm.uploader.autoUpload = false;
                }

                if (options && options.url) {
                    vm.uploader.url = options.url;
                }

                if (options && options.multiple) {
                    vm.envioMultiplo = true;

                    if (options.max) {
                        vm.max = options.max;
                        vm.uploader.queueLimit = options.max;
                    }
                } else {
                    vm.envioMultiplo = false;
                }

                if (options && options.filtrarArquivos) {
                    adicionarFiltro(options.filtrarArquivos);
                }
            }

            function ler() {
                return criarDTO();
            }

            function remover(index) {
                if (vm.arquivos[0].id) {
                    vm.arquivos[index].removido = true;
                } else {
                    vm.arquivos.splice(index, 1);
                    vm.uploader.queue.splice(index, 1);
                }
            }

            function restaurarArquivo(index) {
                vm.arquivos[index].removido = false;
            }

            function sucessoAoAdicionarItem(fileItem, response, status, headers) {
                if (response.status === 'true') {
                    if (vm.envioMultiplo === true) {
                        vm.arquivos.push({nomeExibicao: fileItem.file.name, nome: response.data.file, removido: false, fileItem: fileItem});
                    } else {

                        if (vm.arquivos[0] && vm.arquivos[0].id) {
                            vm.arquivos[0].removido = true;
                            if (vm.arquivos.length === 2) {
                                vm.arquivos[1] = {nomeExibicao: fileItem.file.name, nome: response.data.file, removido: false, fileItem: fileItem};
                            } else {
                                vm.arquivos.push({nomeExibicao: fileItem.file.name, nome: response.data.file, removido: false, fileItem: fileItem});
                            }
                        } else {
                            vm.arquivos[0] = {nomeExibicao: fileItem.file.name, nome: response.data.file, removido: false, fileItem: fileItem};
                        }
                    }
                } else {
                    controller.feed(msg.MG001);
                }
            }

            function uploadErro() {
                vm.barraProgresso = 0;
                controller.feed(msg.MG001);
            }

            function uploadFinalizado() {
                vm.barraProgresso = 0;
            }

            function verificarTipoArquivo(arquivo, tipo) {
                var mimetype;

                if (arquivo.id) {
                    mimetype = arquivo.mimetype;
                } else {
                    mimetype = arquivo.fileItem._file.type;
                }

                var type = '|' + mimetype.slice(mimetype.lastIndexOf('/') + 1) + '|';
                return tipo.indexOf(type) !== -1;
            }

            function visualizar(key) {
                if (verificarTipoArquivo(vm.arquivos[key], '|jpg|png|jpeg|bmp|gif|')) {
                    gerarUrlImagem(vm.arquivos[key]).then(sucessoAoCarregarImagem);
                } else if (verificarTipoArquivo(vm.arquivos[key], '|pdf|')) {
                    gerarUrlPdf(vm.arquivos[key]).then(efetuarDownloadOuVisualizacao).catch(erroAoCarregarUrlParaVisualizacao);
                } else {
                    gerarUrlDownload(vm.arquivos[key]).then(efetuarDownloadOuVisualizacao).catch(erroAoCarregarUrlParaDownload);
                }

                function erroAoCarregarUrlParaDownload(response) {
                    controller.feed(msg.MG002);
                }

                function erroAoCarregarUrlParaVisualizacao(response) {
                    controller.feed(msg.MG003);
                }

                function efetuarDownloadOuVisualizacao(response) {
                    $window.open(response);
                }

                function sucessoAoCarregarImagem(response) {
                    Lightbox.openModal([{url: response}], 0, {backdrop: 'static', keyboard: false, animation: false});
                }
            }
        }

        return ComponenteUpload;
    }

    function UploadConfig(uploadGlobal) {
        var config = {
            configREST: {
                url: null,
                arquivo: {
                    base: null,
                    download: null,
                    preview: null
                },
                upload: null
            },
            label: uploadGlobal
        };

        var upload = this;
        upload.setConfig = setConfig;
        upload.$get      = get;

        function setConfig (input) {
            if (angular.isDefined(input.configREST)) {
                angular.merge(config.configREST, input.configREST);
            }

            if (angular.isDefined(input.label)) {
                config.label = input.label;
            }
        }

        function get() {
            return config;
        }
    }
})();
