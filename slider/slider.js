steal('itkin/list',
  "jquery/event/default",
  'jquery/event/pause',
  'jquery/dom/dimensions')
.then(function($){
  /**
   * @class Carla.Controllers.Applicants.Slider
   */
  Mxui.Util.Selectable.extend('Itkin.SlidesSelectable',{
    defaults:{
      multiActivate: false
    }
  },{
    // prevent deselect when mouse leave
    "{selectOn} mouseleave": function(elt,e){

    },
    "{selectOn} select": function(elt,e){
      this._activate(elt,e)
    },
    "{selectOn} mouseenter": function(el, ev){

    },
    "{selectOn} click":function(el, ev){

    },
    all: function(){
      return this.element.children(this.options.selectOn)
    },
    prev: function(elt){
      if (elt){
        return elt.prev(this.options.selectOn)
      } else if (this._getSelected().length){
        return this._getSelected().prev(this.options.selectOn)
      } else {
        return $([])
      }
    },
    next: function(elt){
      if (elt){
        return elt.next(this.options.selectOn)
      } else if (this._getSelected().length){
        return this._getSelected().next(this.options.selectOn)
      } else {
        return this.all().first()
      }
    }
  })

  Itkin.List.extend('Itkin.Slider',{
  /* @Static */
    "defaults": {
      initTemplate: '//itkin/slider/views/init.ejs',
      rowClassName: 'slide',
      selected: 0,
      loadImmediate: true,
      buffer: 4,
      selectable : function(tbody){ tbody.itkin_slides_selectable({selectOn: "[tabindex].slide"}) },
      refresh: function(tbody, elt, newElt){
        newElt.replaceAll(elt)
        tbody.controller()._select(newElt)
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


    },
    listenTo: ['slide', 'sliding']
  },
  {
    initTemplate: function(){
      this.element.append(this.view(this.options.initTemplate))
      this.$ = {}
      this.$.tbody = $('div.slides', this.element).mxui_layout_fill()
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
      this.slide(this.$.tbody.controller().next(), callback)
    },
    prev: function(callback){
      this.slide(this.$.tbody.controller().prev(), callback)
    },
    slide: function(target, callback){
      var self= this,
          old = this.$.tbody.controller()._getSelected() || $([])
      this.element.triggerAsync('slide',[target], function(){
        self.element.triggerAsync('sliding', [old, target], function(){
          self.$.tbody.controller()._select(target,false);
          callback && callback(target)
        })
      })
    },
   " slide": function(elt,e, target){
      if (this.options.params.attr('updating') && target.index() == this.$.tbody.children('.'+this.options.rowClassName).length -1){
        e.preventDefault()
        this.element.trigger('loading')
      } else if (target.length == 0){
        e.preventDefault()
      }
    },

    ".prev click": function(elt,e){
      this.prev()
    },
    ".next click": function(elt,e){
      this.next()
    },
    " sliding": function(elt,e, old, target){
      if (!this.options.params.attr('updating') &&
          target.index() < this.options.params.count &&
          target.index() + this.options.buffer >= this.options.params.offset + this.options.params.limit )
      {
        this.options.params.next() //attr('offset', this.options.params.attr('offset') + this.options.params.attr('limit'))
      }
    }

  })



})