steal('itkin/list',
  "jquery/event/default",
  'jquery/event/pause',
  'jquery/dom/dimensions')
.then(function($){
  /**
   * @class Carla.Controllers.Applicants.Slider
   */
  Mxui.Nav.Selectable.extend('Itkin.SlidesSelectable',{
    defaults:{
      multiActivate: false,
      outsideDeactivate: false
    },
    listenTo: ['slide']
  },{

    // on empeche l'activation sur click d'un slide
    "{selectOn} click":function(el, ev){

    },
    "mouseenter": function(){ },
    "mouseleave": function(){ },
    "{selectOn} mouseenter": function(){ },
    "{selectOn} mouseleave": function(){ },
    "{selectOn} focusin": function(){ },
    "{selectOn} focusout": function(){ },

    "{selectOn} keydown": function(el, ev){
      // we are keying, this means we dont
      // accept mouse select events w/o a move

      // set keying for a brief time.
      // this is to support when keying scrolls.
      var key = ev.key()
      if(/right|left/.test(key)){
        this.slideTo(key)
//        var nextEl = this.moveTo(el, key);
//        this.selected(nextEl, true);
        ev.preventDefault();
        this.keying = true;
        setTimeout(this.proxy(function(){
          this.keying = false;
        }),100)
      }
    },

    // quand on sélectionne on active en meme temps
    "{selectOn} select": function(elt,e){
      this._super.apply(this, arguments)
      if (!this.lastSelected || elt[0] != this.lastSelected[0])
        this.activated(elt,e)
    },
    _getActivated: function(){
      return this.selectable().filter("." + this.options.activatedClassName)
    },
    // avant d'activer on trigger l'evt "slide", handlé au niveau du slider (todo a gérer ici )
    activated : function(el, ev){
      var self = this;
      if (arguments.length == 0){
        return this._getActivated()
      } else{
        self.element.triggerAsync('slide',[this.lastSelected, el], function(){
          self.element.triggerAsync('animate', [self.lastSelected, el], function(){
            self._getActivated().trigger('deactivate');
            el.trigger("activate", el.models ? [el.models()] : [el])
          })
        }, function(){
          alert("io")
        })
      }
    },
    ' slide': function(elt,e, lastSelected, target){
      // si on passe de 1 à -1
      if (lastSelected && lastSelected.index() == 0 && this.selectable().last()[0] == target[0]){
        e.preventDefault()
        // si on passe du dernier au premier
      } else if(lastSelected && this.selectable().length - 1 ==  lastSelected.index() && target.index() == 0 ){
        e.preventDefault()
      }
    },
    // Selectionne le premier slide ou celui de droite / gauche
    slideTo: function(dir){ // right / left
      if (!this.lastSelected){
        return this.selected(this.selectable().first())
      } else {
        return this.selected(this.moveTo(this.lastSelected, dir))
      }
    }
  }) ;

  Itkin.List.extend('Itkin.Slider',{
  /* @Static */
    "defaults": {
      initTemplate: '//itkin/slider/views/init.ejs',
      rowClassName: 'slide',
      slidingDuration: 800,
      selected: 0,
      loadImmediate: true,
      buffer: 4,
      selectable : function(tbody){ tbody.itkin_slides_selectable({selectOn: "[tabindex].slide"}) },
      refresh: function(tbody, elt, newElt){
        newElt.replaceAll(elt)
        tbody.controller().selected(newElt, true)
      },
      remove: function(tbody, elt){
        this.next(function(){
          elt.remove()
        })
      },
      empty: function(tbody,elt){
        tbody.controller()._selected = undefined
        tbody.html('')
      }


    }//,
    //listenTo: ['slide', 'sliding']
  },
  {
    initTemplate: function(){
      this.element.append(this.view(this.options.initTemplate))
      this.$ = {}
      this.$.tbody = $('div.slides', this.element)
      this.$.wrapper = this.$.tbody.parent().mxui_layout_fill()
      this.$.filter = this.element.children('.slider-filter')
    },

    /**
     *
     * @param {Object} clear if this is true, clear the grid and create a new one, else insert
     * @param {Object} items
     */
    list : function(clear, items){
      this._super.apply(this, arguments)
      if (clear){
        this.next()
      }
    },
    next: function(callback){
      this.$.tbody.controller().slideTo('right')
    },
    prev: function(callback){
      this.$.tbody.controller().slideTo('left')
    },

    ".slides-wrapper animate": function(wrapper, e, lastSelected, target){
      var index = target.index(),
           wrapperWidth = wrapper.width(),
           marginLeft =  wrapperWidth * index ;
      e.pause();
      wrapper.children('.slides').animate({marginLeft: "-" + marginLeft}, this.options.slidingDuration, 'easeInOutQuart', function(){
        e.resume();
      })
    },

    " .slides slide": function(elt,e, lastSelected, target){
      // si on n'update pas déja et que ce qui reste a afficher est inférieur au buffer, on lance un update ..
      if (!this.options.params.attr('updating') &&
          target.index() < this.options.params.count &&
          target.index() + this.options.buffer >= this.options.params.offset + this.options.params.limit )
      {
        this.options.params.next() //attr('offset', this.options.params.attr('offset') + this.options.params.attr('limit'))
      }
    },
    // a bien etre sur de passer en second !! apres  " .slides slide"
    ".slides slide": function(elt,e, lastSelected, target){
      // si on est en train d'updater et que l'index est égal au dernier item, on prévient que l'on loade
      if (this.options.params.attr('updating') && target.index() == this.$.tbody.children('.'+this.options.rowClassName).length -1 ){
        e.preventDefault()
        this.element.trigger('loading')
      // si pas de target on stope l'action
      } else if (target.length == 0){
        e.preventDefault()
      }
    },
    ".slide activate": function(elt,e){
      var text = this.find(".slider-buttons .counter").text(),
          index = elt.index() + 1 ;
      this.find(".slider-buttons .counter").text(text.replace(/.*\//, index +'/'))
    },
    ".prev click": function(elt,e){
      e.preventDefault()
      this.prev()
    },
    ".next click": function(elt,e){
      e.preventDefault()
      this.next()
    },
    "{params} updated.attr": function(params, e, attr, val, old){
      this._super.apply(this,arguments)
      if (attr == 'count'){
        var text = this.find(".slider-buttons .counter").text()
        this.find(".slider-buttons .counter").text(text.replace(/\/.*/,'/'+val))
      }
    }


  })



})