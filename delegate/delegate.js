steal('jquery/model').then(function(){

  // override static setup function to pass delegations hash to static delegate function
  var setup = $.Model.prototype.constructor.setup
  $.Model.prototype.constructor.setup = function(superClass , stat, proto){
    setup.apply(this,arguments);

    // do not inherit delegations to stay consistent with the associations behavior
    if (!this['delegations'] || superClass['delegations'] === this['delegations'] ) {
      this['delegations'] = {};
    }
    var self = this
    $.each(this.delegations, function(key,args){
      // allow the possibility to pass a string, an array of string
      // eventually completed by an options object to override default options
      if (!$.isArray(args)){
        args = [args, {to: key}]
      } else if (typeof args[args.length-1] == 'object'){
        $.extend(args[args.length-1],{to: key})
      } else {
        args.push({to: key})
      }
      self.delegate(args)
    });
  }

  // little helpers
  var isAttr = function(context, attr){
    var get = 'get' + $.String.classize(attr);
    return context.Class.attributes.hasOwnProperty(attr) || typeof context[get] == 'function'
  }


  $.Model.prototype.constructor.delegate = function(){

    var Class = this,
        // make arguments and array and flatten it
        attrs = $.map($.makeArray(arguments),function(x){return x}),
        defaultOptions = {prefix: true, attr: true},
        options

    if (typeof attrs[attrs.length-1] == 'object'){
      options = $.extend({},defaultOptions, attrs.pop())
    }

    $.each(attrs, function(i,attr){
      var func;

      func = options['attr'] ? 'get' : ''
      func += $.String[options['attr'] ? 'classize' : 'camelize' ](
        options['prefix'] == true
          ? options['to'] + '_' + attr
          : options['prefix']
            ? options['prefix'] + '_' + attr
            : attr
      )

      Class.prototype[func] = function(){
        var base = (isAttr(this,options['to'])
            ? this.attr(options['to'])
            : typeof this[options['to']] == 'function'
              ? this[options['to']]()
              : this[options['to']]) ,
            isModel = base instanceof $.Model,
            args = arguments

        return base == null
            ? null
            : isModel && isAttr(base, attr)
              ? base.attr(attr)
              : typeof base[attr] == 'function'
                ? base[attr].apply(base,args)
                : ( base[attr] || null )
      }

    })

  }

})