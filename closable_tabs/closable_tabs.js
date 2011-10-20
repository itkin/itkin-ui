steal('steal/less').then('mxui/nav/tabs', 'itkin/closable_tabs/closable_tabs.less').then(function($){

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
      sub.data('tabsMenu', this.element)
      this.bind(sub, 'show', 'show')
      this.bind(sub, 'hide', 'hide')

      return sub.addClass(this.options.tab_class_names).addClass('ui-closable-tabs-panel '+this.element.id+'-panel');
    },
    add: function(label, index, callback, panel){
      if (typeof index == 'function'){
        callback = index
        index = null
      }
      var tab = $('<li><a><span>'+(label || "&nbsp;")+'</span></a><span class="ui-icon ui-icon-close"></span></li>').addClass(this.options.button_class_names),

          panel = this._initSub($(panel || '<div></div>').hide()),

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


      this.element.nextAll(':eq('+targetTab.index()+ ')')[insert](panel)
      targetTab[insert](tab)
      $.each([tab, panel], function(i,elt){
        elt.attr('tabindex', '')
      })

      if(callback){
        callback(tab,panel)
      }
      this.element.trigger('add', [tab, panel])
    },
    show: function(elt, e){
      if ($(e.target).data('tabsMenu') == this.element)
        elt.show()
    },
    hide: function(elt, e){
      if ($(e.target).data('tabsMenu') == this.element)
        elt.hide()
    },
    "{child_selector} span.ui-icon-close click": function(elt,e){
      var tab = elt.closest(this.options.child_selector)
      if (this.element.children(this.options.child_selector).length == 0){
        return
      }
      if(tab.hasClass(this.options.active))
        ( tab.prev().length ? tab.prev() : tab.next() ) . trigger('activate');

      var sub = this.sub(tab)
      sub.remove()
      tab.remove()
    }

  })
});