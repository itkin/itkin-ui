steal('jquery/model/list',
'jquery/dom/form_params',
'mxui/layout/table_scroll',
'mxui/data',
'jquery/controller/view',
'jquery/view/ejs',
'mxui/data/order',
'mxui/util/selectable')
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
		selectable : true ,
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
      tbody.resize()
    },
    remove: function(tbody, elt){
      elt.remove()
      tbody.resize()
    },
    empty: function(tbody){
      tbody.html('')
      tbody.resize()
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
  initTemplate: function(){
    this.element.append(this.view(this.options.initTemplate))
    this.$ = {}
    this.$.tbody = this.element.children('div:first')
    this.$.scrollBody = this.$.tbody.wrap("<div class='scrollBody' style=\"overflow-y: auto\"></div>").parent().mxui_layout_fill()
  },
  init: function(){

    this.element.mxui_layout_fill()

		for(var name in this.options.columns){
			this.options.nbColumns++;
		}

//    //create the scrollable table
//		var count = 0;
//		for(var name in this.options.columns){
//			count++;
//		}

		this.initTemplate()


		this.options.selectable && this.element.mxui_util_selectable();
		this.element.addClass('ui-corner-all')


		if(this.options.loadImmediate){
			this.options.model.findAll(this.options.params.attrs(), this.callback('list', true))
		}

    // list the list passed in option instead of calling findAll on init
    if (this.options.list.length > 0){
      this.list(true,this.options.list)
    }

    // bind scroll on scrollbody (delegation doesn t work)
    if (this.options.offsetEmpties == false && this.$.scrollBody){
      this.bind(this.$.scrollBody, 'scroll', 'scroll')
    }

  },

  refresh: function(attrs){
    if (!this.options.params.updating){
      this.$.scrollBody.scroll(0)
      //clear the list without triggering any remove event
      this.options.list.length = 0
      this.options.params.attrs($.extend({},(attrs || {}),{'offset': 0, 'updating': true}))
      clearTimeout(this.newRequestTimer)
      this.newRequestTimer = setTimeout(this.callback('newRequest'), 100)
    }
  },
  newRequest : function(attr, val){
		var clear = true;
		if(!this.options.offsetEmpties && attr == "offset"){ // if offset changes and we have offsetEmpties false
			clear = false;
		}
	  this.makeRequest(clear)
	},
  makeRequest: function(clear){
    this.options.model.findAll(this.options.params.attrs(), this.callback('list', clear))
  },
  _getRows: function(viewTemplateOption, items){
    items = ( $.isArray(items) || items instanceof $.Model.List ) ? items : [items]
    return $(this.view(this.options.listTemplate,{
      rowTemplate : this.options[viewTemplateOption],
      items: items
    }, { columns: this.options.columns,
         renderer: this.options.renderer,
         rowClassName: this.options.rowClassName,
         count: this.options.nbColumns
    }));
  },

  // adding some drawing function for listing, updating a row and prepending a new instance form
  list: function(clear,items){
    this.curentParams = this.options.params.attrs();

		this.options.params.attr('updating', false);

    var trs = this._getRows('rowTemplate', items)

		if(clear){
			this.options.empty(this.$.tbody);
		}

		this.options.append(this.$.tbody, trs);
		// update the items
		this.options.params.attr('count',items.count)

    // added by me
    this.options.list.push(items)
    this.element.trigger('listed', [items, this.options.list, trs])
  },

  "new": function(instance){
    var tr = this._getRows('formTemplate', (instance || new this.options.model()))
    this.options.prepend(this.$.tbody, tr )
  },

  "{model} updated" : function(model, ev, item){
      var el = item.elements(this.element)
      if (el.length > 0){
        var newElt= this._getRows('rowTemplate', item)
        this.options.refresh(this.$.tbody, el, newElt)
      }
  },
  // override created handler to
  "{model} created" : function(model, ev, item){
    if (this.options.instanceBelongsToList.apply(this, [item])){
      var newEl = this._getRows('rowTemplate', item)
      this.options.prepend(this.$.tbody, newEl)
      this.options.params.attr('count', this.options.params.attr('count') +1)
    }
  },
  "{model} destroyed" : function(model, ev, item){
    if (this.options.instanceBelongsToList.apply(this, [item])){
      var el = item.elements(this.element)
      this.options.remove(this.$.tbody, el)
      this.options.params.attr('count', this.options.params.attr('count') -1)
    }
  },

  // some events stuff
  "form submit": function(elt,e){
    e.preventDefault()
    var tr = elt.closest('.'+this.options.rowClassName)
    tr.model().update(elt.formParams()[$.String.camelize(tr.model().Class.shortName)], function(){
      tr.remove()
    })
  },
  ".{deleteClass} click": function(elt, e){
      elt.closest('.'+this.options.rowClassName).model().destroy()
  },

  ".{editClass} click": function(elt, e){
    var el = elt.closest('.'+this.options.rowClassName),
        form = this._getRows('formTemplate', el.model())
    this.options.refresh(this.$.tbody, el, form)

  },
  ".{cancelClass} click": function(elt, e){
    var el = elt.closest('.'+this.options.rowClassName)

    if (el.model().isNew()){
      this.options.remove(this.$.tbody, el)
    } else {
      var newElt = this._getRows('rowTemplate', el.model())
      this.options.refresh(this.$.tbody, el, newElt)
    }

  },
  "scroll": function(){
    // partie passée par l'utilisateur > total loadé - buffer && pas d'update en cours && offset < count
    if(
        this.$.scrollBody.scrollTop() + this.$.scrollBody.height() > this.$.tbody.height() - this.options.buffer
        && !this.options.params.updating
        && this.options.params.offset < this.options.params.count
      ){
      this.options.params.attr('offset', this.options.params.offset + this.options.params.limit)
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
      this.options.append(this.$.tbody, this.view(this.options.loadingTemplate,{rowClassName: this.options.rowClassName, count: this.options.nbColumns}))
    } else if(attr == 'updating' && !val && val != old){
      this.$.tbody.find('.'+this.options.rowClassName+'.loading').remove()
    }
  }



})

});