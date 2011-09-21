steal('jquery/model/list', 'mxui/data/grid', 'jquery/dom/form_params')
.then(
  function($){

/**
 * @class Carla.Controllers.FollowUps.List
 */
Mxui.Data.Grid.extend('Itkin.List',
/** @Static */
{
	defaults : {
    rowTemplate: '//itkin/list/views/row.ejs',
    formTemplate: '//itkin/list/views/form.ejs',
    loadingTemplate: '//itkin/list/views/loading',
    listTemplate: '//itkin/list/views/list',
    columns:{},
    loadImmediate: true,
    applicant: null,
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
    nbColumns: 0,
    renderer: {}
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

  init: function(){
    var self = this
    this.element.mxui_layout_fill()
    this._super.apply(this)

    // store the number of column
    $.each(this.options.columns, function(i){ self.options.nbColumns++})


    // list the list passed in option instead of calling findAll on init
    if (this.options.list.length > 0){
      this.list(true,this.options.list)
    }

    // bind scroll on scrollbody (delegation doesn t work)
    if (this.options.offsetEmpties == false){
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

  // adding some drawing function for listing, updating a row and prepending a new instance form
  list: function(clear,items){
    this.curentParams = this.options.params.attrs();

		this.options.params.attr('updating', false);

    var trs = this._getRows('rowTemplate', items)

		if(clear){
			this.empty();
		}

		this.append(trs);
		// update the items
		this.options.params.attr('count',items.count)

    // added by me
    this.options.list.push(items)
    this.element.trigger('listed', [items, this.options.list])
  },

  "new": function(instance){
    var tr = this._getRows('formTemplate', (instance || new this.options.model()))
    this.options.append(this.$.tbody, tr )
  },
  // override created handler to
  "{model} created" : function(model, ev, item){
    if (this.options.instanceBelongsToList.apply(this, [item])){
      this._super.apply(this,arguments)
      this.options.params.attr('count', this.options.params.attr('count') +1)
    }
  },
  "{model} destroyed" : function(model, ev, item){
    if (this.options.instanceBelongsToList.apply(this, [item])){
      this._super.apply(this,arguments)
      this.options.params.attr('count', this.options.params.attr('count') -1)
    }
  },

  // some events stuff
  "form submit": function(elt,e){
    e.preventDefault()
    var tr = elt.closest('tr')
    tr.model().update(elt.formParams()[$.String.camelize(tr.model().Class.shortName)], function(){
      tr.remove()
    })
  },
  ".{deleteClass} click": function(elt, e){
      elt.closest('tr').model().destroy()
  },

  ".{editClass} click": function(elt, e){
    var el = elt.closest('tr'),
        form = this._getRows('formTemplate', el.model())
    this.options.refresh(this.$.tbody, el, form)

  },
  ".{cancelClass} click": function(elt, e){
    var el = elt.closest('tr'),
        newElt = this._getRows('rowTemplate', el.model())

    if (el.model().isNew()){
      this.options.remove(this.$.tbody, el)
    } else {
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
  "{params} updated.attr": function(params, e, attr, val, old){
    this._super.apply(this, arguments)
    if (attr == 'updating' && val && val != old){
      this.append($(this.view(this.options.loadingTemplate, {count: this.options.nbColumns})))
    } else if(attr == 'updating' && !val && val != old){
      this.$.tbody.find('tr.loading').remove()
    }
  }


})

});