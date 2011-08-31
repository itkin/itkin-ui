steal('jquery/model', 'jquery/model/list').then(function(){

  (function($){



    $.Model.prototype.constructor.belongsToCached = function(name, type, foreignKey){
      this.attributes[foreignKey] = 'number';
      var cap = $.String.classize(name)

      if(!this.prototype.hasOwnProperty('get'+cap)){
        this.prototype['get'+cap] = function(){
          return $.Class.getObject(type).list.get(this[foreignKey])[0]
        }
      }

    }

    $.Model.prototype.constructor.hasManyCached = function(name, type, foreignKey){
      var cap = $.String.capitalize(name)

      if(!this.prototype.hasOwnProperty('get'+cap)){
        this.prototype['get'+cap] = function(){
          return $.Class.getObject(type).list.match(foreignKey, this[this.Class.id])
        }
      }
    }


  })(jQuery)

})