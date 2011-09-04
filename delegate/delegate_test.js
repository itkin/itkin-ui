steal('funcunit/qunit','./delegate.js', 'jquery/dom/fixture', function(){

  module("delegate", {

    setup: function(){

      $.Model.extend('User',{
        attributes: {
          rank: "number",
          name: "string",
          tasks: "Task.models"
        },
        init: function(){
          this.delegate('length', {to: 'tasks'})
        }
      },{
        fullName: function(type){
          return type + ' ' + this.attr('name')
        }
      });


      $.Model.extend('Task', {
        attributes:{
          name: "string",
          user: "User.model",
          otherUser: "User.model"
        },
        delegations: {
          user: 'name',
          otherUser: ['name', {prefix: 'test'}]
        },
        init: function(){
          this.delegate('fullName', { to: 'user', attr: false } )
          this.delegate('rank', { to: 'otherUser', prefix: false } )

        }
      },{});


    }
  });

  test('model delegation', function(){
    var task = new Task({name: 'task', user:{name: 'user'}})
    equal(task.attr('userName'), 'user')
  })
  test('breaks if null', function(){
    var task = new Task({name: 'task'})
    equal(task.attr('userName'), null)
  })
  test('delegate to function', function(){
    var user = new User({name: 'user', tasks:[{name: 'task'}]})
    equal(user.attr('tasksLength'), 1)
  })
  test('provide arguments to last delegated function', function(){
    var task = new Task({name: 'task', user:{name: 'user'}})
    equal(task.userFullName('Mr'), 'Mr user')
  })
  test('custom delegation name', function(){
    var task = new Task({name: 'task', otherUser:{rank:2, name: 'user'}})
    equal(task.attr('rank'), 2)
    equal(task.attr('testName'), "user")
  })

});
