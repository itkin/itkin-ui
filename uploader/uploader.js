steal(
  'jquery/controller',
  'jquery/controller/view',
  'jquery/model',
  'jquery/view/ejs',
  'jquery/dom/form_params')
.then(
  'jquery-ui/ui/jquery.ui.widget.js',
  'jquery-ui/ui/jquery.ui.core.js',
  'jquery-ui/ui/jquery.effects.core.js')
.then(
  'jquery-ui/ui/jquery.effects.fade.js',
  'jquery-ui/ui/jquery.ui.button.js',
  'jquery-ui/ui/jquery.ui.progressbar.js',
  './jquery_file_upload/jquery.fileupload.js',
  './jquery_file_upload/jquery.iframe-transport.js')
.then(
   function(){

    $.Controller('Itkin.Uploader', {
      defaults: {
        forceIframeTransport: false,
        dropZone: $([]),
        paramName: 'binary',
        dataType: 'json',
        url: '/resumes',
        downloadTemplate: '//itkin/uploader/views/download.ejs',
        uploadTemplate: '//itkin/uploader/views/upload.ejs',
        acceptFileTypes: /.*/,
        maxFileSize: null
      }
    },{
      _formatFileSize: function (file) {
          if (typeof file.size !== 'number') {
              return '';
          }
          if (file.size >= 1000000000) {
              return (file.size / 1000000000).toFixed(2) + ' GB';
          }
          if (file.size >= 1000000) {
              return (file.size / 1000000).toFixed(2) + ' MB';
          }
          return (file.size / 1000).toFixed(2) + ' KB';
      },
      _validate: function (file) {
          file.errors = []
          if (!(this.options.acceptFileTypes.test(file.type) || this.options.acceptFileTypes.test(file.name))) {
              file.errors.push(this.options.acceptFileTypesMessage || "Le fichier n'est pas du bon type");
          }
          if (this.options.maxFileSize && file.size > self.options.maxFileSize) {
              file.errors.push(this.options.maxFileSizeMessage || "Le fichier est trop volumineux");
          }
          return file.errors.length == 0
      },
      _renderTemplate: function(templateType, file){
        return $(this.view(this.options[templateType+'Template'], file, {formatFileSize: this._formatFileSize}))
      },
      init: function(){
        if ($(this.options.list).length == 0){
          this.options.list = $('<ul></ul>').insertAfter(this.element)
        }
        var self = this ;
        this.element.fileupload($.extend({}, this.options,{
            add: function (e, data) {
              data.isValidated = self._validate(data.files[0]);
              data.context = self._renderTemplate('upload',data.files[0])
                  .css('display', 'none')
                  .appendTo(self.options.list).fadeIn(function () {
                      // Fix for IE7 and lower:
                      $(this).show();
                  }).data('data', data);
              if (data.isValidated) {
                  data.jqXHR = data.submit();
              }
            },
            // Callback for the start of each file upload request:
            send: function (e, data) {
              if (data.context && data.dataType && data.dataType.substr(0, 6) === 'iframe') {
                // Iframe Transport does not support progress events.
                // In lack of an indeterminate progress bar, we set
                // the progress to 100%, showing the full animated bar:
                data.context.find('.ui-progressbar').progressbar(
                    'value',
                    parseInt(100, 10)
                );
              }
            },
            // Callback for successful uploads:
            done: function (e, data) {
              var model = self.options.model.model(data.result);
              data.context.each(function (index) {
                $(this).fadeOut(function () {
                  self._renderTemplate('download',model)
                    .css('display', 'none')
                    .replaceAll(this)
                    .fadeIn(function () {
                        // Fix for IE7 and lower:
                        $(this).show();
                    });
                });
              });

            },
            fail: function (e, data) {
              data.context.each(function (index) {
                if (data.errorThrown !== 'abort') {
                  var file = data.files[index];
                  file.errors = $.parseJSON(data.jqXHR.responseText)
                  self._renderTemplate('upload',file)
                    .css('display', 'none')
                    .replaceAll(this)
                    .fadeIn(function () {
                        // Fix for IE7 and lower:
                        $(this).show();
                    });
                } else {
                  data.context.remove();
                }
              });
            },
            // Callback for upload progress events:
            progress: function (e, data) {
                if (data.context) {
                    data.context.find('.ui-progressbar').progressbar(
                        'value',
                        parseInt(data.loaded / data.total * 100, 10)
                    );
                }
            }
          }
        ))
        this.delegate(this.options.list, 'a.cancel','click', '_cancelHandler')
      },
      _cancelHandler: function (elt, e) {
        e.preventDefault();
        var tmpl = elt.closest('.template-upload');
        tmpl.data('data').jqXHR.abort();
      }

    });


})