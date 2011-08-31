steal('jquery/model', 'jquery/model/list').then(function(){

//    var serialize = $.Model.prototype.serialize;
//    $.Model.prototype.serialize =  function(){
//      var data = serialize.apply(this)
//      for (key in data){
//        if ($.inArray(this.Class.association,key)){
//          data[key+'_attributes'] = data[key]
//          delete data[key]
//        }
//      }
//      return data
//    }

    $.Model.prototype.constructor.belongsTo = function(name, type, foreignKey){
      this.attributes[name] = type +'.model'
      this.attributes[foreignKey]= 'number'

      var cap = $.String.classize(name)

      if(!this.prototype.hasOwnProperty('set'+cap)){
        this.prototype['set'+cap] = function(value, _updateProperty, errorCallback){
          var childIdName = $.Class.getObject(type).id
          this[foreignKey] = value.hasOwnProperty(childIdName) ? value[childIdName] : null
          _updateProperty()
        }
      }

      cap = $.String.classize(foreignKey)

      if(!this.prototype.hasOwnProperty('set'+cap)){
        this.prototype['set'+cap] = function(value, _updateProperty, errorCallback){
          this.attr(name, $.Class.getObject(type).list.get(value)[0])
        }
      }
    }
    $.Model.prototype.constructor.hasMany= function(name, type, foreignKey){
      this.attributes[name] = type +'.models'
    }
    $.Model.prototype.constructor.hasOne= function(name, type, foreignKey){
      this.attributes[name] = type +'.model'
    }


})