(function($){

  var originalBelongsTo = $.Model.prototype.constructor.belongsTo

  $.Model.prototype.constructor.belongsToCached = function(type, name, foreignKey){
    if(!foreignKey){
      name = foreignKey
      name = null
    }

    name = name || $.String.camelize( type.match(/\w+$/)[0] );
    var cap = $.String.capitalize(name)

    if(!this.prototype.hasOwnProperty('get'+cap)){
      this.prototype['get'+cap] = function(){
        return $.Class.getObject(type).all.get(this[foreignKey])[0]
      }
    }

    this.belongsTo(type, name);

  }

  $.Model.prototype.constructor.hasManyCached = function(type, name, foreignKey){
    if(!foreignKey){
      name = foreignKey
      name = null
    }

    name = name || $.String.camelize( type.match(/\w+$/)[0] );
    var cap = $.String.capitalize(name)

    if(!this.prototype.hasOwnProperty('get'+cap)){
      this.prototype['get'+cap] = function(){
        return $.Class.getObject(type).all.match(foreignKey, this[this.Class.id])
      }
    }

    this.hasMany(type, name);

  }

  $.Model.prototype.constructor['cacheAll'] = function(){
    if (!this.hasOwnProperty('List')){
      $.Model.List.extend(this.fullName+'.List')
    }
    $.extend(this, {
      setAll: function(instances){
        this.all = this.List.newInstance(instances)
      }
    })
    this.findAll({}, this.callback('setAll'))
  }

})(jQuery)