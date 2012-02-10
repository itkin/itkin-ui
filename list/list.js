steal('jquery/model/list',
'jquery/dom/form_params',
'mxui/layout/table_scroll',
'mxui/data',
'jquery/controller/view',
'jquery/view/ejs',
'mxui/data/order',
'mxui/nav/selectable')
.then('jquery-ui/ui/jquery.effects.core.js')
.then('jquery-ui/ui/jquery.effects.slide.js')
.then(
  function($){

/**
 * @class Carla.Controllers.FollowUps.List
 */
$.Controller('Itkin.List',
/** @Static */
{
	defaults : {
    initTemplate: '//itkin/list/views/init.ejs',
    rowTemplate: '//itkin/list/views/row.ejs',
    formTemplate: '//itkin/list/views/form.ejs',
    loadingTemplate: '//itkin/list/views/loading',
    listTemplate: '//itkin/list/views/list',
    rowClassName: 'row',
    columns:{},
    nbColumns: 0,
    loadImmediate: true,
    model: null,
    listType: null,
    offsetEmpties: false,
    multiSort: false,
		canUnsort: false,
    buffer: 30,
    params: {limit: 10},
    editClass: "edit",
    cancelClass: "cancel",
    deleteClass: "delete",
    instanceBelongsToList: function(){return true},
    renderer: function(item){ return item.toString() },
		noItems : "No Items",
		offsetEmpties: false,
		// set to false to turn off the filler
		filler: true,
		// immediately uses the  model to request items for the grid
		loadImmediate: true,
		selectable : function(tbody){ tbody.mxui_nav_selectable() } ,
    refresh: function(tbody, elt, newElt){
      elt.replaceWith(newElt)
      tbody.resize()
    },
    prepend: function(tbody, newElt){
      tbody.prepend(newElt)
      tbody.resize()
    },
    append: function(tbody, newElt){
      tbody.append(newElt)
      //tbody.resize()
    },
    remove: function(tbody, elt){
      elt.remove()
      tbody.resize()
    },
    empty: function(tbody){
      tbody.html('')
      //tbody.resize()
    }

  },
  listensTo : ["select","deselect"],

  models:function(models){
    var self = this
    $($.makeArray(arguments)).each(function(i, model){
      $(["created", "updated", "destroyed"]).each(function(j,event){
        self.prototype["{"+model.fullName+"} "+event] = self.prototype["{model} "+event]
      })
    })
  }


},
/** @Prototype */
{

  setup: function(elt,options){
    options = options || {}

    options.model = options.model || options.list.Class.namespace

    if (options.list){
      options.loadImmediate = false
    } else {
      options.list = new options.model.List([])
    }

    // set default params before it got bound
    options.params = new Mxui.Data($.extend({},
      this.Class.defaults.params,
      {offset: options.list.length, count: options.list.length},
      (options.params ||{})
    ))

    this._super.apply(this,arguments)

  },
  update: function(options){
    if (options['params']){
      this.options.params.attrs(options['params'])
      delete options['params']
    }
    this._super(options)
    return this
  },
  initTemplate: function(){
    this.element.append(this.view(this.options.initTemplate))
    this.$ = {}
    this.$.tbody = this.element.children('div:first')
    this.$.scrollBody = this.$.tbody.wrap("<div class='scrollBody' style=\"overflow-y: auto\"></div>").parent().mxui_layout_fill()

  },
  init: function(){
    if (this.options.filler){
      this.element.mxui_layout_fill()
    }

		for(var name in this.options.columns){
			this.options.nbColumns++;
		}

		this.initTemplate()


    this.options.selectable && this.options.selectable.apply(this, [this.$.tbody]);
		this.element.addClass('ui-corner-all')


		if(this.options.loadImmediate){
			this.makeRequest(true)
		}

    // list the list passed in option instead of calling findAll on init
    if (this.options.list.length > 0){
      this.list(true,this.options.list)
    }

    // bind scroll on scrollbody for list and grid (delegation doesn t work)
    if (this.options.offsetEmpties == false && this.$.scrollBody){
      this.bind(this.$.scrollBody, 'scroll', 'scroll')
    }

  },

  refresh: function(attrs){
    if (!this.options.params.updating){
      //clear the list without triggering any remove event
      this.options.list.length = 0
      this.options.params.attrs($.extend({},(attrs || {}),{'offset': 0, 'updating': true}))
      clearTimeout(this.newRequestTimer)
      this.newRequestTimer = setTimeout(this.callback('newRequest'), 100)
    }
    return this
  },
  newRequest : function(attr, val){
		var clear = true;
		if(!this.options.offsetEmpties && attr == "offset"){ // if offset changes and we have offsetEmpties false
			clear = false;
		}
	  this.makeRequest(clear)
	},

  makeRequest: function(clear){
    var self = this;
    this.options.model.findAll(this.options.params.attrs(), function(items){
      if (clear){
        self.options.list = items
      } else {
        self.options.list.push(items)
      }
      self.list(clear, items)
    })
  },
  _getRows: function(viewTemplateOption, items){
    items = ( $.isArray(items) || items instanceof $.Model.List ) ? items : [items]
    return $(this.view(this.options.listTemplate, {
      viewTemplate : this.options[viewTemplateOption],
      items: items
    }, this.options));
  },

  // adding some drawing function for listing, updating a row and prepending a new instance form
  list: function(clear,items){
    this.curentParams = this.options.params.attrs();

		this.options.params.attr('updating', false);

    var trs = this._getRows('rowTemplate', items).filter("." + this.options.rowClassName)

		if(clear){
			this.options.empty(this.$.tbody);
      if (this.$.scrollBody)
        this.$.scrollBody.scrollTop(0);
		}

		this.options.append(this.$.tbody, trs);
		// update the items
		this.options.params.attr('count',items.count)

    // added by me
    this.element.trigger('listed', [items, this.options.list, trs])
  },

  "new": function(instance){
    var tr = this._getRows('formTemplate', (instance || new this.options.model())).addClass("form new"),
        oldForm = this.$.tbody.children('.row.form.new:first')
    if (oldForm.length == 0){
      this.options.prepend.apply(this,[this.$.tbody, tr ])
    } else {
      this.options.refresh.apply(this,[this.$.tbody, oldForm, tr ])
    }
  },

  "{model} updated" : function(model, ev, item){
    var el = item.elements(this.element)
    if (el.length > 0){
      var newElt= this._getRows('rowTemplate', item)
      this.options.refresh.apply(this,[this.$.tbody, el, newElt])
    }
  },

  // override created handler to
  "{model} created" : function(model, ev, item){
    if (this.options.instanceBelongsToList.apply(this, [item])){
      var newEl = this._getRows('rowTemplate', item)
      this.options.refresh.apply(this,[this.$.tbody, this.$.tbody.children('.row.form.new:first'), newEl])
      this.options.params.attr('count', this.options.params.attr('count') +1)
    }
  },

  "{model} destroyed" : function(model, ev, item){
    if (this.options.instanceBelongsToList.apply(this, [item])){
      var el = item.elements(this.element)
      this.options.remove.apply(this,[this.$.tbody, el])
      this.options.params.attr('count', this.options.params.attr('count') -1)
    }
  },

  // some events stuff
  "form submit": function(elt,e){
    e.preventDefault()
    e.stopPropagation()
    var tr = elt.closest('.'+this.options.rowClassName)
    tr.model().attrs(elt.formParams()[$.String.camelize(tr.model().Class.shortName)])
    tr.model().save()
  },

  ".{deleteClass} click": function(elt, e){
      e.stopPropagation()
      elt.closest('.'+this.options.rowClassName).model().destroy()
  },

  ".{editClass} click": function(elt, e){
    e.stopPropagation()
    var el = elt.closest('.'+this.options.rowClassName),
        form = this._getRows('formTemplate', el.model())

    this.options.refresh.apply(this,[this.$.tbody, el, form])

  },
  ".{cancelClass} click": function(elt, e){
    e.stopPropagation()
    var el = elt.closest('.'+this.options.rowClassName)

    if (el.model().isNew()){
      this.options.remove.apply(this,[this.$.tbody, el])
    } else {
      var newElt = this._getRows('rowTemplate', el.model())
      this.options.refresh.apply(this,[this.$.tbody, el, newElt])
    }

  },
  "scroll": function(){
    // partie passée par l'utilisateur > total loadé - buffer && pas d'update en cours && offset < count
    if(
        this.$.scrollBody.scrollTop() + this.$.scrollBody.height() > this.$.tbody.height() - this.options.buffer
        && !this.options.params.updating
        && this.options.params.offset < this.options.params.count
      ){
      this.options.params.next() //attr('offset', this.options.params.offset + this.options.params.limit)
    }
  },
  //todo a nettoyer
  "{params} updated.attr": function(params, e, attr, val, old){
    if(attr !== 'count' && attr !== 'updating'){
      //want to throttle for rapid updates
      params.attr('updating', true)
      clearTimeout(this.newRequestTimer)
      this.newRequestTimer = setTimeout(this.callback('newRequest', attr, val), 100)
    }
    // count is updated
    if (attr == 'updating' && val && val != old){
      this.options.append.apply(this,[this.$.tbody, this.view(this.options.loadingTemplate,{rowClassName: this.options.rowClassName, nbColumns: this.options.nbColumns})])
    } else if(attr == 'updating' && !val && val != old){
      this.$.tbody.find('.'+this.options.rowClassName+'.loading').remove()
    }
  },

  // helpers
//  refresh: function(elt, newElt){
//    this.options.refresh.apply(this, [this.$.tbody, elt, newElt])
//  },
//  prepend: function(newElt){
//    this.options.prepend.apply(this,[this.$.tbody, newElt])
//  },
//  append: function(tbody, newElt){
//    this.options.append.apply(this, [this.$.tbody, newElt])
//  },
//  remove: function(elt){
//    this.options.remove.apply(this, [this.$.tbody, elt])
//  },
//  empty: function(tbody){
//    this.options.empty.apply(this, [this.$.tbody])
//  },
  _closestRow: function(elt){
    return elt.closest('.'+this.options.rowClassName)
  },
  model: function(){
    return this.options.model
  }



})

});