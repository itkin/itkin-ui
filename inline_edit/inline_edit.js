steal( 'jquery/controller','jquery/view/ejs' )
	.then( './views/init.ejs', function($){

  /**
   * @class Itkin.inlineEdit
   */
  $.fn.itkin_inline_edit = function(opt){

    var options = $.extend({}, {
      triggerLink: null,
      triggerEventType: 'click',
      cardSelector: null,
      targetSelector: null,
      formClassName:"inlineEdit",
      cancelClassName:'inlineCancel',
      onEdit: function(){},
      onSubmit: function(){}
    },opt)

    return this.each(function(){
      var $this = $(this);
      $this.delegate(options.triggerLink, options.triggerEventType, function(e){
        var card = $(this).closest(options.cardSelector),
            form = $('<form class="'+options.formClassName+'"></form>'),
            target = card.find(options.targetSelector)
        form.hide().insertAfter(target)
        options.onEdit(form, card.model(), options)
        form.append($.View('//itkin/inline_edit/views/buttons.ejs'))
        target.slideUp(function(){
          form.slideDown()
        })
      });

      $this.delegate("form."+options.formClassName+" input."+options.cancelClassName, 'click', function(e){
        var form = $(this).closest('.'+options.formClassName),
            target = form.prev()
        form.slideUp(function(){
          $(this).remove()
          target.slideDown()
        })
      });

      $this.delegate("form."+options.formClassName+" input[type='submit']","click", function(e){
        e.preventDefault()
        e.stopPropagation()
        var form = $(this).closest('.'+options.formClassName)
        form.slideUp(function(){
          options.onSubmit(form,e)
        })
      })
    })
  }

})