steal('itkin/list')
.then(
  function($){

/**
 * @class Carla.Controllers.FollowUps.List
 */
Itkin.List.extend('Itkin.Grid',
/** @Static */
{
	defaults : {
    rowTemplate: '//itkin/grid/views/row.ejs',
    formTemplate: '//itkin/grid/views/form.ejs',
    loadingTemplate: '//itkin/grid/views/loading',
    listTemplate: '//itkin/grid/views/list',
    initTemplate: '//itkin/grid/views/init',
    titleTemplate: '//itkin/grid/views/th',
    columns:{},
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
    nbColumns: 0,
    renderer: {}
  },

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
  initTemplate: function(){

    this.element.append( this.view(this.options.initTemplate,{titleTemplate: this.options.titleTemplate, columns: this.options.columns }) )

    this.element.children('table').mxui_layout_table_scroll({
      filler: this.options.filler
    });
    this.$ = this.element.children(":first").controller(Mxui.Layout.TableScroll).elements()


    this.$.thead.mxui_data_order({
      params: this.options.params,
      multiSort: this.options.multiSort,
      canUnsort: this.options.canUnsort
    })

    //this.scrollable.cache.thead.mxui_layout_resizer({selector: "th"});
    this.element.addClass("grid");
    if (this.options.filler) {
      this.element.mxui_layout_fill();
    }
    //this.setFixedAndColumns()

    // add jQuery UI stuff ...
    this.element.find(".header table").attr('cellSpacing', '0').attr('cellPadding', '0');

    var ths = this.$.thead.find('th').addClass("ui-helper-reset ui-state-default");

    ths.eq(0).addClass('ui-corner-left')
    ths.eq(-1).addClass('ui-corner-right')
  }



})

});