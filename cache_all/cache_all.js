steal('jquery/model', 'jquery/model/list').then(function(){

  (function($){
    $.Model.prototype.constructor.belongsToCached = function(name, type, foreignKey){
      this.attributes[foreignKey] = 'number';
      var cap = $.String.classize(name)

      if(!this.prototype.hasOwnProperty('get'+cap)){
        this.prototype['get'+cap] = function(){
          return this[foreignKey] ? $.String.getObject(type).all.get(this[foreignKey])[0] : undefined
        }
      }
      if(!this.prototype.hasOwnProperty('set'+cap)){
        this.prototype['set'+cap] = function(value, _updateProperty, errorCallback){
          //a voir pour la transmission des callbacks
          this.attr(foreignKey, value[$.String.getObject(type).id],_updateProperty, errorCallback)
        }
      }

    }

    $.Model.prototype.constructor.hasManyCached = function(name, type, foreignKey){
      var cap = $.String.capitalize(name)

      if(!this.prototype.hasOwnProperty('get'+cap)){
        this.prototype['get'+cap] = function(){
          return $.String.getObject(type).all.match(foreignKey, this[this.Class.id])
        }
      }
    }


    // allow to cache model instance as property of their class
    // ex : Action.cacheConsant('name', new Action({name: 'forecasted'}))
    // Action.forecasted -> new Action({name: 'forecasted'})
    $.Model.prototype.constructor.cacheConstants = function(property){
      var self = this;
      this.all.each(function(i,instance){
        self.cacheConstant(property, instance)
      })
    }
    $.Model.prototype.constructor.cacheConstant = function(property, instance){
      this[instance.attr(property)] = instance
    }


    $.Model.prototype.constructor['cacheAll'] = function(options){
      var options = options || {}

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
      if(options.cacheAllConstantsBy){
        this.findAll({}, this.callback(['setAll', function(){ return options.cacheAllConstantsBy }, 'cacheConstants']))
      } else {
        this.findAll({}, this.callback('setAll'))
      }

    }

  })(jQuery)

})