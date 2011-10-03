steal('steal/less')
.then('mxui/nav/menu', 'jquery/dom/cur_styles', 'itkin/card_menu/card_menu.less')
.then(
  'jquery-ui/ui/jquery.ui.core.js',
  'jquery-ui/ui/jquery.ui.widget.js')
.then(
  'jquery-ui/ui/jquery.ui.button.js')
.then(function(){
  Mxui.UI.Menu.extend("Itkin.UI.TopRightMenu", {
    defaults: {
      types: [
        Mxui.Layout.Positionable("Mxui.UI.TopRight",{defaults: {my: "right top",at: "left top"}},{}),
        Mxui.UI.Highlight
      ]
    }

  },{
    init: function(){
      this._super.apply(this, arguments)
      this.element.children(this.options.child_selector+':first').addClass('ui-corner-top')
      this.element.children(this.options.child_selector+':last').addClass('ui-corner-bottom')
    },
    "hide" : function(el, ev){
      var self = this;
      if (el.context == this.element.context){
        ev.pause();
        this.element.find("."+this.options.active).triggerAsync("deactivate", function(){
          self.element.find("."+self.options.select).triggerAsync("deselect", function(){
            ev.resume();
          })
        });
      }
    }


  })

  $.Controller('Itkin.CardMenu',{

  },{
    init: function(){

      var uls = this.element.find('ul')
      var opener = $('<button class="opener" type="button">options</button>').button({text: false, icons: {primary: 'ui-icon-cancel'}})

      var buttonsetWidth = 0
      this.element.children('a').wrapAll('<div class="toolbar"></div>').parent().append(opener)
        .buttonset()
        .children()
        .each(function(){
          buttonsetWidth += $(this).width()
        })

      var menu = this.element.children('ul')
//        .width(buttonsetWidth  -5) // correction de 5px
        .itkin_ui_top_right_menu()
        .mxui_layout_positionable({my: 'right top', at: 'right bottom', offset: "-3px 0", of:opener}) // correction de 3 px

      var elts = $.merge(uls,opener)

      var self = this

      this.bind(opener, 'mouseenter', function(){
        clearTimeout(self.timeout)
        menu.trigger('hide').trigger('show').trigger('move')
      })
      this.bind(elts, 'mouseleave', function(){
        self.timeout = setTimeout(function(){
          uls.trigger('hide')
        },300)
      })

      this.bind(uls, 'mouseenter', function(){
        clearTimeout(self.timeout)
      })

    }

  })
})