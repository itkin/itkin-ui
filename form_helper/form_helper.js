steal('jquery/class',
	'jquery/view',
	'jquery/view/ejs'

  ).then('jquery/view/helpers', function($){

    var underscore = $.String.underscore,
        formHelperFn = {}

    defaultInputName = function(model, property, array){
      array = (array == true) ? '[]' : ''
      var basename  = (model.hasOwnProperty('basename')) ? model.basename : underscore(model.Class.shortName)
      return basename +'['+property+']' + array;
    }

    defaultInputId = function(inputName, append){
      append = (append == null ) ? '' : ''+ append;
      return $.String.underscore(inputName.replace(/\]/g,'').replace(/\[/g,'_') + append)
    }

    $.each(['text_field', 'password_field', 'hidden_field', 'text_area'],function(i, fnName){

      formHelperFn[fnName] = function(model, property, html_options){

        html_options = html_options || {};
        var inputName = html_options.name || defaultInputName(model,property);
        var inputValue = (html_options.hasOwnProperty('value'))
          ? (model.attr(property) != null && $.trim(model.attr(property)) != '')
            ? model.attr(property)
            : html_options['value']
          : model.attr(property)
        delete html_options['value']
        delete html_options['name']
        html_options['id'] = html_options['id'] || defaultInputId(inputName)

        return this[fnName+'_tag'].call(this, inputName, inputValue, html_options)
      }

    });



    // unique checkbox field (value = true/false)
    // normalize the helper function prototype (html_options as last argument
    formHelperFn['check_box']= function( model, property, html_options ){

      html_options = html_options || {};



      var inputName = html_options.name || defaultInputName(model,property, html_options['multiple']);
      var inputValue = (html_options.hasOwnProperty('value'))
        ? html_options['value']
        : 1
      var checked = html_options.hasOwnProperty('checked')
        ? html_options['checked']
        : (model.attr(property) === true)
          ? true
          : false

      html_options['id'] = html_options['id'] || defaultInputId(inputName, (html_options['multiple'] && html_options.hasOwnProperty('value')) ? inputValue : null)

      delete html_options['checked']
      delete html_options['multiple']
      delete html_options['value']
      delete html_options['name']

      return this['check_box_tag'].call(this, inputName, inputValue, html_options, checked)
    }

    formHelperFn['select']= function( model, property, choices, html_options){
      html_options = html_options || {};
      var inputName = html_options.name || defaultInputName(model,property, html_options['multiple']);
      var inputValue = (html_options.hasOwnProperty('value'))
        ? (model.attr(property) != null && $.trim(model.attr(property)) != '')
          ? model.attr(property)
          : html_options['value']
        : model.attr(property)

      delete html_options['value']
      delete html_options['name']

      html_options['id'] = html_options['id'] || defaultInputId(inputName)
      return this['select_tag']( inputName, inputValue, choices, html_options )
    }




    formHelperFn['collection_select']= function(model, property, collection, value, text, html_options){
      var choices = $.map(collection, function(item){
        return { value: item.attr(value), text: item.attr(text) }
      })
      return this['select'](model, property, choices, html_options)
    }

    var flatten = function(array){
      return $.map(array, function(i) {return i})
    }

    formHelperFn['grouped_collection_select']= function(model, property, groupCollection, groupMethod, groupLabelMethod,  value, text, html_options){
      var choices = flatten($.map(groupCollection, function(item){
        var options = (typeof item[groupMethod] == 'function') ? item[groupMethod] : item.attr(groupMethod)
        var item = item
        return $.map(options, function(option){
          return { groupLabel: item.attr(groupLabelMethod), groupOn: item.attr(groupLabelMethod), value: option.attr(value), text: option.attr(text) }
        })
      }))
      return this['select'](model, property, choices, html_options)
    }


    $.extend($.EJS.Helpers.prototype, formHelperFn);
});