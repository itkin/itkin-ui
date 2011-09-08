steal('jquery/model', 'jquery/model/list').then(function(){

  (function($){
    $.Model.prototype.constructor.belongsToCached = function(name, type, foreignKey){
      this.attributes[foreignKey] = 'number';
      var cap = $.String.classize(name)

      if(!this.prototype.hasOwnProperty('get'+cap)){
        this.prototype['get'+cap] = function(){
          return this[foreignKey] ? $.Class.getObject(type).all.get(this[foreignKey])[0] : undefined
        }
      }
      if(!this.prototype.hasOwnProperty('set'+cap)){
        this.prototype['set'+cap] = function(value, _updateProperty, errorCallback){
          //a voir pour la transmission des callbacks
          this.attr(foreignKey, value[$.Class.getObject(type).id],_updateProperty, errorCallback)
        }
      }

    }

    $.Model.prototype.constructor.hasManyCached = function(name, type, foreignKey){
      var cap = $.String.capitalize(name)

      if(!this.prototype.hasOwnProperty('get'+cap)){
        this.prototype['get'+cap] = function(){
          return $.Class.getObject(type).all.match(foreignKey, this[this.Class.id])
        }
      }
    }

    $.Model.prototype.constructor['cacheAll'] = function(){
      if (!this.hasOwnProperty('listType')){
        this.listType = $.Model.List
      }
      this.all = new this.listType([]);
      if (!this.hasOwnProperty('setAll')){
        this.setAll= function(instances){
          //todo call an empty funct
          this.all.push(instances)
        }
      }
      this.findAll({}, this.callback('setAll'))
    }

  })(jQuery)

})