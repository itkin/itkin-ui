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
  './jquery_file_upload/jquery.fileupload-ui.js',
   function(){

    $.extend($.blueimpUI.fileupload.prototype, {
      _renderUploadTemplate: function (files) {
          var that = this;
          return $.View(
            this.options.uploadTemplate,
            $.map(files, function (file) {
                  return that._uploadTemplateHelper(file);
            })[0]
          );
      },
      _downloadTemplateHelper: function (file) {
          file.name= file.binaryFileName;
          file.size= file.binaryFileSize;
          file.contentType= file.binaryContentType
          file.sizef= this._formatFileSize(file);
          return file;
      },
      _renderDownloadTemplate: function (files) {
          var that = this;
          return $.View(
            this.options.downloadTemplate,
            $.map(files, function (file) {
                  return that._downloadTemplateHelper(file);
            })[0]
          );
      }
    })

})