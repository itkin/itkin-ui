steal('itkin/list',
  "jquery/event/default",
  'jquery/event/pause',
  'jquery/dom/dimensions')
.then(function($){
  /**
   * @class Carla.Controllers.Applicants.Slider
   */
  Itkin.List.extend('Itkin.Slider',{
  /* @Static */
    "defaults": {
      initTemplate: '//itkin/slider/views/init.ejs',
//      rowTemplate: '//itkin/slider/views/row.ejs',
//      formTemplate: '//itkin/slider/views/form.ejs',
//      loadingTemplate: '//itkin/slider/views/loading',
//      listTemplate: '//itkin/slider/views/list',
      rowClassName: 'slide',
      selected: 0,
      loadImmediate: true,
      buffer: 4
    },
    listenTo: ['sliding','before.sliding', 'slid']
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
        this.options.selected = 0
        this.slide(this.options.selected)
      }
    },
    next: function(){
      this.slide(this.options.selected + 1)
    },
    prev: function(){
      this.slide(this.options.selected - 1)
    },
    getSlide: function(index){
      return this.$.tbody.children('.'+this.options.rowClassName).eq(index)
    },
    slide: function(target){
      if (target != -1){
        var self = this,
            evtData = [this.getSlide(this.options.selected), this.getSlide(target)]
        this.element.triggerAsync('before.sliding', target, function(){
          self.element.triggerAsync("sliding", evtData , function(){
            self.options.selected = target
            self.element.trigger("slid", evtData )
          })
        })
      }
    },
    " sliding": function(elt,e, prev,next){
      prev.hide()
      next.show().resize()
    },
   " before.sliding": function(elt,e, target){
      if (target > this.options.params.offset + this.options.params.limit){
        e.preventDefault()
      }
      if (!this.options.params.attr('updating') && target < this.options.params.count && target + this.options.buffer >= this.options.params.offset + this.options.params.limit){
        this.options.params.attr('offset', this.options.params.attr('offset') + this.options.params.attr('limit'))
      }
    },
    ".prev click": function(elt,e){
      e.preventDefault()
      this.prev()
    },
    ".next click": function(elt,e){
      e.preventDefault()
      this.next()
    },
    " listed" :function(elt,e, newItems,list, trs){
      trs.hide().mxui_layout_fill()
    }








  })



})