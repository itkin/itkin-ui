steal(
  'jquery/class',
  'jquery/view',
  'jquery/view/ejs',
  'jquery/view/helpers',
  'itkin/form_helper')
  .then(function(){

    var underscore = $.String.underscore

    $.Class.extend('FormBuilder',{
      form_for: function(modelInstance, options,callback){
        if (!callback){
          callback = options
          options = {}
        }
        var f = this.getFormBuilder(modelInstance, options)
        callback(f)
        //return '<form>'+callback(f)+'</form>'
      },
      getFormBuilder: function(modelInstance, options){
        options = options || {}
        return new FormBuilder({
          model: modelInstance,
          viewContext: this,
          wrapper: options.wrapper,
          basename: options.basename
        })
      }
    },{
      init: function(options){
        this.viewContext= options.viewContext
        this.model = options.model
        this.basename = options.basename ? options.basename : underscore(this.model.Class.shortName)
        this.wrapper = options.wrapper
        return this
      },

      fields_for: function(basename, assoc, proc){
        // cas 1 - on cherche a retrouver le shortname de l'assoc (string ou instance(s))
        if (proc == undefined){
          proc = assoc ;
          assoc = basename ;
          if (typeof assoc == 'string'){
            assoc = this.model.attr(assoc);
            // on garde le basename en l'état
          } else if ($.isArray(assoc) && assoc.length > 0){
            basename = assoc[0].Class.shortName
          } else {
            basename = assoc.Class.shortName
          }
        }
        basename = this.basename + '['+ basename+']';

        if($.isArray(assoc)){
          var self = this;
          for(var i = 0; i < assoc.length; i++){
            this._renderFieldsFor(assoc[i],basename+'['+i+']', proc, i)
          }
        } else {
          return this._renderFieldsFor(assoc,basename, proc)
        }
      },

      // internal render the fields_for proc on the new instance with the basename provided as argument
      _renderFieldsFor: function(instance, basename, proc, index){
        var builder = new FormBuilder({model: instance, basename: basename, viewContext: this.viewContext, wrapper: this.wrapper })
        return proc.call(this.viewContext, builder, index)
      },

      // proxy the attr model function
      attr: function(name){
        return this.model.attr(name)
      }

    })



    $.each(['select', 'collection_select', 'grouped_collection_select', 'hidden_field','check_box','text_field', 'password_field', 'text_area',''], function(i,fn){

      FormBuilder.prototype[fn] = function(){

        var args = $.makeArray(arguments),
            opts = {wrapper: this.wrapper};

        // get some passing variable form the original html_option and remove their keys
        if (args[args.length-1].constructor == Object){
          $.each(['label', 'hint', 'errors', 'wrapper'], function(i,key){
            if (args[args.length-1].hasOwnProperty(key)){
              opts[key] = args[args.length-1][key]
              delete args[args.length-1][key]
            }
          });
        }

        if (opts['wrapper'] && fn != 'hidden_field'){
          opts = $.extend({
            input: this.viewContext[fn].apply(this.viewContext, [this].concat(args)),
            model: this.model,
            basename: this.basename,
            property: args[0],
            label: null,
            hint: null,
            errors: null,
            options: (args[args.length-1].constructor == Object) ? args[args.length-1] : {}
          }, opts)
          return $.View(opts['wrapper'], opts)
        }else{
          return this.viewContext[fn].apply(this.viewContext, [this].concat(args))
        }


      }
    });



    $.extend($.EJS.Helpers.prototype, {form_for: FormBuilder.form_for, getFormBuilder: FormBuilder.getFormBuilder});
  });