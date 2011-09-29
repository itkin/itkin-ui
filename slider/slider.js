steal('mxui/data', 'jquery/controller/view').then(function($){



  /**
   * @class Carla.Controllers.Applicants.Slider
   */
  $.Controller('Itkin.Slider',{
  /* @Static */
    "defaults": {
      "params": new Mxui.Data({limit: 10, buffer: 4 }),
      "model": null,
      "type": null,
      "slide_template": null,
      "slideSelector": 'div',
      "selected": 0
    },
    listenTo: ['sliding','before.sliding', 'slid']

  },
  {
    // init variables
    init : function(){
      this.element.mxui_layout_fill()
      this.element.append(this.view())

      // init the elements
      this.$ = {}
      this.$.slides = this.element.children('.slides').mxui_layout_fill()

      this.$.prev = this.element.children('.prev')
      this.$.next = this.element.children('.next')

      this.newRequest()
    },

    newRequest : function(attr, val){
      var clear = true;
      if(attr == "offset"){
        clear = false;
      }
      this.options.params.attr('updating',true)
      this.options.model.findAll(this.options.params.attrs(), this.callback('list', clear) )
    },

    /**
     *
     * @param {Object} clear if this is true, clear the grid and create a new one, else insert
     * @param {Object} items
     */
    list : function(clear, items){
      //this.currentParams = this.options.params.attrs();

      var slides = $(this.view('list',{
        slide_template : this.options.slide_template,
        type: this.options.type,
        items: items
      }));

      if(clear){
        this.empty();
      }

      slides.css({display:'none', position:'absolute'})

      this.append(slides);

      this.options.params.attr('updating', false);
      this.options.params.attr('count', items.count)

      if (clear){
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
      return this.$.slides.children(this.options.slideSelector).eq(index)
    },
    slide: function(target){
      if (target != -1){
        var self = this,
            evtData = [this.getSlide(this.options.selected),this.getSlide(target)]
        this.element.triggerAsync('before.sliding', target, function(){
          self.element.triggerAsync("sliding", evtData , function(){
            self.options.selected = target
            self.element.trigger("slid", evtData )
          })
        })
      }
    },

//    " default.sliding": function(elt, e, current, next ){
//      if (next && next.length != 0)
//        this.options.selected = next.index()
//      //else {}
//       // e.preventDefault()
//    },
    " before.sliding": function(elt,e, target){
      if (target > this.options.params.offset + this.options.params.limit){
        e.preventDefault()
      }
      if (!this.options.params.attr('updating') && target < this.options.params.count && target + this.options.params.buffer >= this.options.params.offset + this.options.params.limit){
        this.options.params.attr('offset', this.options.params.attr('offset') + this.options.params.attr('limit'))
      }
    },

    "{params} updated.attr" : function(params, ev, attr, val){
      if(attr !== 'count' && attr !== 'updating'){
        //want to throttle for rapid updates
        params.attr('updating', true)
        clearTimeout(this.newRequestTimer)
        this.newRequestTimer = setTimeout(this.callback('newRequest', attr, val), 100)
      }
    },


    append: function( items ) {
      this.$.slides.append(items)
    },
    // remove all content from the grid
    empty: function(){
      this.$.slides.html('')
    },

    ".prev click": function(elt,e){
      this.prev()
    },
    ".next click": function(elt,e){
      this.next()
    }








  })



})