steal('jquery/controller', 'jquery/model/backup', 'jquery/model/validations','jquery/dom/form_params').then(function(){

$.Controller.extend('Itkin.Form',{
  defaults: {
    basename: null,
    model: null
  }
},{
  init: function(){
    this.options.model.backup()
  },
  propertyNameFromElt: function(elt){
    return elt.attr('name').replace(/^\w+/,'').replace(/\]\[/g,'.').replace(/\[|\]/g,'')
  },
  eltFromPropertyName: function(propName){
    var eltName = this.basename() +'['+ propName.replace(/\./g,'][') + ']'
    return $('[name="'+eltName+'"]', this.element)
  },
  appendError: function(elt, errors){
    errors = $.makeArray(errors)
    elt.after('<span class="error">'+errors.join(',')+'</span>')
  },
  removeError: function(elt){
    if (elt)
      elt.next('.error').remove()
    else
      this.element.find('.error').remove()
  },
  basename: function(){
    return this.options.basename || $.String.camelize(this.options.model.Class.shortName)
  },


  updateObject: function(elt){
    this.options.model.attrs(this.element.formParams()[this.basename()])
    this.removeError(elt)
    var errors = this.options.model.errors(elt ? this.propertyNameFromElt(elt) : undefined)
    if (errors){
      for (prop in errors){
        this.appendError(this.eltFromPropertyName(prop), errors[prop])
      }
    }
  },
  "input, textarea, select change": function(elt, e){
    this.updateObject(elt)
  },
  "submit": function(elt,e){
    e.preventDefault();
    this.updateObject()
  },
  ".cancel click": function(elt,e){
    e.preventDefault();
    this.options.model.restore(true)
    this.element.trigger('cancel')
  }



})
})