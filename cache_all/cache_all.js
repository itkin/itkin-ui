steal('jquery/model', 'jquery/dom/fixture', 'jquery/model/list').then(function(){

  (function($){



    $.Model.prototype.constructor.belongsToCached = function(name, foreignKey){
      var type = this.attributes[name].substring(0, this.attributes[name].lastIndexOf("."))
      var cap = $.String.classize(name)

      if(!this.prototype.hasOwnProperty('get'+cap)){
        this.prototype['get'+cap] = function(){
          return $.Class.getObject(type).all.get(this[foreignKey])[0]
        }
      }

    }

    $.Model.prototype.constructor.hasManyCached = function(name, foreignKey){
      var type = this.attributes[name].substring(0, this.attributes[name].lastIndexOf("."))
      var cap = $.String.capitalize(name)

      if(!this.prototype.hasOwnProperty('get'+cap)){
        this.prototype['get'+cap] = function(){
          return $.Class.getObject(type).all.match(foreignKey, this[this.Class.id])
        }
      }
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

})