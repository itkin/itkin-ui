steal('jquery/model').then(function(){

  $.Model.prototype.constructor.delegates = {}
  var setup = $.Model.prototype.constructor.setup
  $.Model.prototype.constructor.setup = function(superClass , stat, proto){
    setup.apply(this,arguments);

    // do not inherit delegates to say consistent with the associations behavior
    if (!this['delegates'] || superClass['delegates'] === this['delegates'] ) {
      this['delegates'] = {};
    }

    for(name in this.delegates){
      this.delegate(name, this.delegates[name])
    }
  }

  $.Model.prototype.constructor.delegate = function(name, str){
    this.prototype[name] = function(){
      var base = this,
          arr = str.split('.'),
          args = arguments
      for(var i=0; i < arr.length; i++){
        var isModel = base instanceof $.Model,
            attr = arr[i],
            get = 'get' + $.String.classize(attr)
        if(isModel && (base.Class.attributes.hasOwnProperty(attr) || base.Class.hasOwnProperty(get)) ){
          base = base.attr(attr)
        } else if(typeof base[attr] == 'function'){
          base = (i == arr.length - 1) ? base[attr].apply(base,args) : base[attr]()
        } else {
          base = base[attr]
        }
        if (base == null){
          break
        }
      }
      return base
    }
  }
})