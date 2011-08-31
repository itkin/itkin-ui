steal.plugins('mxui/nav/tabs').then(function($){

  Mxui.UI.Tabs('Itkin.ClosableTabs', {

  },
  {
    init : function(){
			var selected = this.find(this.options.child_selector+"."+this.options.active)
			selected = selected.length ? selected : this.find(this.options.child_selector+":first")
			var self = this;
			//make sure everything is deactivated ...
			this.find(this.options.child_selector).each(function(){
				var sub = self.sub($(this).addClass(self.options.button_class_names))
        self._initSub(sub)
        if(!$(this).hasClass(self.options.active) && ! sub.triggerHandled("hide")){
          $(sub).hide();
        }
			})
			selected.trigger("activate");
			this.element.addClass(this.options.class_names)
			this.element.parent().addClass(this.options.tabs_container_class)
			return this.element;
		},
    _initSub: function(sub){
      $.each(this.options.types,function(){
        sub[this]();
      })

      this.bind(sub, 'show', 'show')
      this.bind(sub, 'hide', 'hide')

      return sub.addClass(this.options.tab_class_names);
    },
    add: function(label, index, callback){
      if (typeof index == 'function'){
        callback = index
        index = null
      }
      var tab = $('<li><a><span>'+(label || "&nbsp;")+'</span></a><span class="ui-icon ui-icon-close"></span></li>').addClass(this.options.button_class_names),

          panel = this._initSub($('<div></div>').hide()),

          targetTab, insert ;

      if (index == 0){
        insert = 'before'
        targetTab = this.element.find(this.options.child_selector+':first')
      } else {
        insert = 'after'
        targetTab = index != null
          ? this.element.find(this.options.child_selector).eq(index-1)
          : this.element.find(this.options.child_selector).last()
      }
      // pas nécessaire mais quand meme
      if (targetTab.length == 0){
        return
      }

      if(callback){
        callback(tab,panel)
      }
      this.element.nextAll(':eq('+targetTab.index()+ ')')[insert](panel)
      targetTab[insert](tab)
      $.each([tab, panel], function(i,elt){
        elt.attr('tabindex', '')
      })

      this.element.trigger('add', [tab, panel])
    },
    show: function(elt, e){
      elt.show()
    },
    hide: function(elt, e){
      elt.hide()
    },
    "{child_selector} span.ui-icon-close click": function(elt,e){
      var tab = elt.closest(this.options.child_selector)
      if (this.element.children(this.options.child_selector).length == 0){
        return
      }
      if(tab.hasClass(this.options.active))
        ( tab.prev().length ? tab.prev() : tab.next() ) . trigger('activate');

      this.sub(tab).remove()
      tab.remove()
    }

  })
});