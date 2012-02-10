steal('jquery/model', 'jquery/model/list/local')
  .then('jquery_store/jquery.store.js')
  .then(function(){

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
      return this.all.each(function(i,instance){
        self.cacheConstant(property, instance)
      })
    }
    $.Model.prototype.constructor.cacheConstant = function(property, instance){
      this[instance.attr(property)] = instance
    }

    //$.storage = new $.store();

    $.Model.prototype.constructor['cacheAll'] = function(options){
      var self = this,
          options = options || {},
          namespace = $.String.underscore(this.fullName) +'.all',
          def


//      if (!this.hasOwnProperty('setAll')){
//        this.setAll= function(instances){
//          //todo call an empty funct
//          this.all.push(instances)
//        }
//      }



      this.all = new this.List.Local([]);

      if (window.localStorage[namespace]){
        def = $.Deferred()
        def.resolve(this.all.retrieve(namespace))
      } else {
        def = this.findAll({})
        def.then(function(items){
          self.all.push(items)
          self.all.store(namespace)
          //$.storage.set(namespace+'.all', $.toJSON(items.serialize()))
        })
      }
      //def.then(this.callback('setAll'))

      if(options.cacheAllConstantsBy){
        def.pipe(this.callback('cacheConstants', options.cacheAllConstantsBy))
      }
      return def

    }



})