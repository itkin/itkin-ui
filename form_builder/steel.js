steal
  .plugins(
	"jquery/class",
	'jquery/controller',
	'jquery/model',
  'jquery/model/associations',
  'jquery/dom/form_params',
	'jquery/view',
  'form_builder')
  .then(function(){

    $.Controller.extend('Cntrlr', {
      init : function(){
        this.element.html($.View('views/form', {blog: blog}))
      }
    });

    $.Model.extend("BlogPost",{
      attributes : {
        title        : 'string',
        lead         : 'text',
        body         : 'text',
        is_published : 'boolean',
        status       : 'string',
        tags         : 'array',
        author       : 'string'
      },
      init: function(){
        this.hasMany('Comment', 'comments')
      }

    }, {});
    $.Model.extend('Comment',{
      attributes: {
        text: "text"
      },
      init: function(){
        this.belongsTo('User', 'user')
      }
    },{});

    $.Model.extend('User', {
      attributes: {
        name: 'string'
      }
    },{})

    blog = new BlogPost({
      title:'my title',
      lead: 'myLead',
      password:"MyPassord",
      is_published: true,
      comments: [{id:1, text:"myComment", user: {name: 'nicolas'} }]
    });
});