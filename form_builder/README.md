# FormBuilder

FormBuilder aims to port ruby on rails form builder helper methods to JSMC

Rely on [form_helper](https://github.com/itkin/form_helper) which adds some rails like form helper methods (you would need to steel that last plugin before this one)

You can also have a look at [formBinder](https://github.com/retro/FormBinder) which emulate RoR simple_form plugin logic

Basically given 3 models like that:

    $.Model.extend("BlogPost",{
      attributes : {
        title : 'string',
        lead   : 'text',
      },
      init: function(){
        this.hasMany('Comment', 'comments')
      }
    }, {});

    $.Model.extend("Comment",{
      attributes : {
        text : 'text'
      },
      init: function(){
        this.hasOne('User', 'user')
      }
    }, {});

    $.Model.extend("User",{
      attributes : {
        name : 'string'
      }
    }, {});

You can build your form like this:

    <form>
      <% fields_for(modelInstance, function(f){ %>
      <%= f.text_field('title') %>
      <%= f.text_area('lead') %>
      <% fields_for('comments', function(c,index){ %>
        <%= c.text_area('text') %>
        <% c.fields_for('user',function(u){
          <%= u.text_field('name') %>
        <% }) %>
      <% }) %>
      <input type="submit" value="Submit form" />
    </form>

It will create fields all the expected fields, setting the attributes and values consistently through the associations chains

## Customization

FormBuilder allow to wrap each element into custom templates. Simply pass wrapper option to the helper method or when you instanciate the builder

    <% var f = fields_for(model_instance,{wrapper: '//myApp/views/wrapper.ejs'}) %>

    <%= f.text_field('title',{wrapper: '//myApp/views/specific_wrapper.ejs'}) %>

As expected specifying a wrapper option on builder has an effect on every helper methods handled by the builder.
Passing a wrapper option to a specific function override the wrapper for this field, and passing false prevent the wrapper to be output

Inside a wrapper template , you have access to the following variables :
* model : the instance model on which is applied the method
* property :
* options : the options passed to the helper function
* builder : the builder instance

## Supported helpers functions

* text_field
* text_area
* password_field
* hidden_field
* check_box
* select

## TODO

* initialize the form builder in a proper form_for function which should also create a form tag
* allow custom wrapper defined on fields_for
* nested hasMany associations helper functions should increment an index in the id of the generated fields
* code clean-up
* datetime helpers