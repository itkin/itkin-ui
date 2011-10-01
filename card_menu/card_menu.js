steal('mxui/nav/menu')
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

      this.element.children('a').wrapAll('<div class="toolbar"></div>').parent().append(opener)
        .buttonset()

      var menu = this.element.children('ul')
        .itkin_ui_top_right_menu()
        .mxui_layout_positionable({my: 'right top', at: 'right bottom', offset: "-3px 0", of:opener})

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