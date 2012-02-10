steal('steal/less')
.then('mxui/nav/menu', 'jquery/dom/cur_styles', 'itkin/card_menu/card_menu.less')
.then(
  'jquery-ui/ui/jquery.ui.core.js',
  'jquery-ui/ui/jquery.ui.widget.js')
.then(
  'jquery-ui/ui/jquery.ui.button.js')
.then(function(){

  Mxui.UI.Menu.extend("Itkin.menu", {},
  {
  "mouseleave": function(el,e){
    if(this.options.level == 0){
      this.element.children('.'+this.options.select).trigger('deactivate')
    }
  },
  ">show" : function(el, ev){
     if(ev.target == this.element[0]){
      this.element.show();
      // prevent the event to trigger the positionable "show" handler
      ev.stopPropagation()
      this.element.children('.'+this.options.active+":first").trigger('deactivate')
     }
  }

  })

  Mxui.UI.Menu.extend("Itkin.TopRightMenu", {
    defaults: {
      types: [
        Mxui.Layout.Positionable("Mxui.UI.TopRight",{defaults: {my: "right top",at: "left top", keep: true}},{}),
        Mxui.UI.Highlight
      ],
      active : "ui-state-active"
    }

  },{
    init: function(){
      this._super.apply(this, arguments)
      this.element.children(this.options.child_selector+':first').addClass('ui-corner-top')
      this.element.children(this.options.child_selector+':last').addClass('ui-corner-bottom')
    }
  })

  $.Controller('Itkin.CardMenu',{

  },{
    init: function(){
      // genere le bouton de trigger
      var trigger = $('<button class="card-menu-trigger" type="button">options</button>').button({text: false, icons: {primary: 'ui-icon-cancel'}})

      // genere une toolbar avec les liens
      var toolbar = this.element.children('a').wrapAll('<div class="itkin-card-menu-toolbar"></div>').parent().append(trigger)
        .buttonset()

      // calcule la largeur des éléments contenus dans la toolbar
      var buttonsetWidth = 0
      toolbar.children().each(function(){
        buttonsetWidth += $(this).width()
      })

      // instancie un menu itkin et le positionne sous le trigger
      this.element.children('ul')
        .itkin_top_right_menu()
        .mxui_layout_positionable({my: 'right top', at: 'right bottom',  offset: '-3px 0', of: trigger, keep: true}) // correction de 3 px

    },
    ".card-menu-trigger mouseenter": function(elt,e){
//      clearTimeout(this.timeout)
      //why these 3 events ?
      this.element.children('ul').trigger('show')
    },
    "show": function(elt,e){
      elt.trigger('move')
    }
//    "ul, .card-menu-trigger mouseleave": function(elt,e){
//      var self = this
//      this.timeout = setTimeout(function(){
//        self.element.find('ul').trigger('hide')
//      },300)
//    },
//    "ul mouseenter": function(elt,e){
//      clearTimeout(this.timeout)
//    }

  })



})