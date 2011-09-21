steal('jquery/model', 'jquery/model/list').then(function(){

  $.Model.prototype.constructor.belongsTo = function(name, type, foreignKey){
    // set the assoc
    this.attributes[name] = type +'.model'
    // prevent the assoc to be sent back
    if (this.hasOwnProperty('backendSerialize')){
      this.backendSerialize[name] = false
    }
    this.attributes[foreignKey]= 'number'

    var cap = $.String.classize(name)

    if(!this.prototype.hasOwnProperty('set'+cap)){
      this.prototype['set'+cap] = function(value, _updateProperty, errorCallback){
        var childIdName = $.String.getObject(type).id
        this[foreignKey] = value.hasOwnProperty(childIdName) ? value[childIdName] : null
        _updateProperty()
      }
    }

//    cap = $.String.classize(foreignKey)
//
//    if(!this.prototype.hasOwnProperty('set'+cap)){
//      this.prototype['set'+cap] = function(value, _updateProperty, errorCallback){
//        this.attr(name, $.String.getObject(type).list.get(value)[0])
//      }
//    }

  }
  $.Model.prototype.constructor.hasMany= function(name, type, foreignKey){
    this.attributes[name] = type +'.models'
  }
  $.Model.prototype.constructor.hasOne= function(name, type, foreignKey){
    this.attributes[name] = type +'.model'
  }

})