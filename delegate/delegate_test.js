steal('funcunit/qunit','./delegate.js', 'jquery/dom/fixture', function(){
  module("delegate", {
    setup: function(){

      $.Model.extend('User',{
        attributes: {
          name: "string",
          tasks: "Task.models"
        },
        init: function(){
          this.delegate('getTasksNumber', 'tasks.length')
        },
        findAll: function(params,success){
          var items = []
          for(var i = 0; i < 100; i++){
            items.push({id: i, name: 'user '+i, tasks: [{id:i, name: 'task '+i}]})
          }
          return success ? success(this.wrapMany(items)) : this.wrapMany(items)
        }
      },{
        fullName: function(type){
          return type + ' ' + this.attr('name')
        }
      });


      $.Model.extend('Task', {
        attributes:{
          name: "string",
          user: "User.model"
        },
        delegates: {
          'getUserName': 'user.name'
        },
        init: function(){
          this.delegate('userFullName', 'user.fullName')
        },
        findAll:function(params, success,fail){
          var items = []
          for(var i = 0; i < 100; i++){
            items.push({id: i, name: 'task '+i, user: {id: i, name: "user "+i}})
          }
          return success ? success(this.wrapMany(items)) : this.wrapMany(items)
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
    equal(user.attr('tasksNumber'), 1)
  })
  test('provide arguments to last delegated function', function(){
    var task = new Task({name: 'task', user:{name: 'user'}})
    equal(task.userFullName('Mr'), 'Mr user')
  })
});
