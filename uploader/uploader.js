steal(
  'jquery/controller',
  'jquery/controller/view',
  'jquery/model',
  'jquery/model/list',
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
        maxFileSize: null,
        //overriden triggers
        add: function (e, data) {
          $(this).trigger('add', data)
        },
        send: function (e, data) {
          $(this).trigger('send', data)
        },
        done: function (e, data) {
          $(this).trigger('done', data)
        },
        fail: function (e, data) {
          $(this).trigger('fail', data)
        },
        progress: function (e, data) {
          $(this).trigger('progress', data)
        }
      },
      listenTo: ["add", "send", "done", "fail", "progress"]
    },
    {
      _adjustMaxNumberOfFiles: function (operand) {
          if (typeof this.options.maxNumberOfFiles === 'number') {
              this.options.maxNumberOfFiles += operand;
              if (this.options.maxNumberOfFiles < 1) {
                  this.element.attr('disable',true)//.disable()//_disableFileInputButton();
              } else {
                  this.element.attr('disable',false)// this._enableFileInputButton();
              }
          }
      },
      _formatFileSize: function (size) {
          if (typeof size !== 'number') {
              return '';
          }
          if (size >= 1000000000) {
              return (size / 1000000000).toFixed(2) + ' GB';
          }
          if (size >= 1000000) {
              return (size / 1000000).toFixed(2) + ' MB';
          }
          return (size / 1000).toFixed(2) + ' KB';
      },
      _validate: function (file) {
        file.errors = []
        if (!(this.options.acceptFileTypes.test(file.type) || this.options.acceptFileTypes.test(file.name))) {
          file.errors.push(this.options.acceptFileTypesMessage || "Le fichier n'est pas du bon type");
        }
        if (this.options.maxFileSize && file.size > this.options.maxFileSize) {
          file.errors.push(this.options.maxFileSizeMessage || "Le fichier est trop volumineux");
        }
        return file.errors.length == 0
      },
      _renderTemplate: function(templateType, file){
        return $(this.view(this.options[templateType+'Template'], file, {formatFileSize: this._formatFileSize}))
      },
      setup: function(){
        this._super.apply(this, arguments)
        this.options.modelClass = this.options.model.Class ? this.options.model.Class : this.options.model
      },
      init: function(){
        this.element.html(this.view())
        this.options.list = this.find('ul')
        this.options.form = this.element.find('input:file')

        this.element.fileupload(this.options)
      },
      " add": function(elt, e, data){
        data.isValidated = this._validate(data.files[0]);
        this._adjustMaxNumberOfFiles(-data.files.length);
        data.context = this._renderTemplate('upload',data.files[0])
            .css('display', 'none')
            .appendTo(this.options.list).fadeIn(function () {
                // Fix for IE7 and lower:
                $(this).show();
            }).data('data', data);

        if (data.isValidated) {
          data.jqXHR = data.submit();
        }
      },
      // Callback for successful uploads:
      " done": function (elt, e, data) {
      if (this.options.model instanceof $.Model.List){
        var model = this.options.model.model().newInstance(data.result)
        this.options.model.push(model)
      } else {
        var model = this.options.modelClass.model(data.result)
        this.options.model = model
      }
      var self = this
      data.context.each(function (index) {
        $(this).fadeOut(function () {
          self._renderTemplate('download',model)
            .model(model)
            .css('display', 'none')
            .replaceAll(this)
            .fadeIn(function () {
                // Fix for IE7 and lower:
                $(this).show();
            });
        });
      });

      },
      " fail": function (elt, e, data) {
        this._adjustMaxNumberOfFiles(data.files.length)
        var self = this
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
      " progress": function (elt, e, data) {
        if (data.context) {
          console.log(data)
          data.context.find('.ui-progressbar').progressbar('value',parseInt(data.loaded / data.total * 100, 10));
        }
      },
      "a.remove click": function(elt, e){
        e.preventDefault();
        elt.closest('.template-upload').fadeOut(function(){
          $(this).remove();
        });
      },
      "a.cancel click": function(elt,e){
         e.preventDefault();
         var tmpl = elt.closest('.template-upload');
         tmpl.data('data').jqXHR.abort();
       },
       "a.delete click": function(elt,e){
          e.preventDefault();
          elt.closest('.template-download').fadeOut(function(){
            $(this).model().destroy()
            $(this).remove()
          });
       },



      // Callback for the start of each file upload request:
      // todo : could be removed since we don't handle this case server-side
      " send": function (elt, e, data) {
        if (data.context && data.dataType && data.dataType.substr(0, 6) === 'iframe') {
          // Iframe Transport does not support progress events.
          // In lack of an indeterminate progress bar, we set
          // the progress to 100%, showing the full animated bar:
          data.context.find('.ui-progressbar').progressbar(
              'value',
              parseInt(100, 10)
          );
        }
      }

    });


})