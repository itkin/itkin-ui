steal('funcunit/qunit','./associations.js', 'jquery/dom/fixture', function(){

  module("associations", {
    setup: function(){

      $.Model.extend('User',{
        attributes: {
          name: "string"
        },
        listType: $.Model.List,

        init: function(){
          this.hasMany('tasks', 'Task')
        },
        findAll: function(params,success){
          var items = []
          for(var i = 0; i < 100; i++){
            items.push({id: i, name: 'user '+i, tasks: [{id:i, name: 'task '+i}]})
          }
          return success ? success(this.wrapMany(items)) : this.wrapMany(items)
        }
      },{});

      $.Model.extend('Task', {
        attributes:{
          name: "string"
        },
        listType: $.Model.List,
        init: function(){
          this.belongsTo('user', 'User', 'user_id')
        },
        findAll:function(params, success,fail){
          var items = []
          for(var i = 0; i < 100; i++){
            items.push({id: i, name: 'task '+i, user: {id: i, name: "user "+i}})
          }
          return success ? success(this.wrapMany(items)) : this.wrapMany(items)
        }
      },{});


//
//      $.Model('OtherUser', {
//        attributes: {
//          name: "string"
//        },
//        init: function(){
//          this.hasMany('tasks')
//        }
//      },{
//        getTasks: function(){
//          return 'test'
//        }
//      })

    }
  });

  test("belongsTo and HasMany are static methods", function(){
    var users = User.findAll()
    var tasks = Task.findAll()

    var task =  tasks[0]
    equal(task.attr('user'), User.list.get(task.attr('user_id'))[0])
    task.attr('user', users[1])
    equal(task.attr('user'), User.list.get(1)[0])
    equal(task.attr('user_id'), users[1].id)

    task.attr('user_id', users[2])
    equal(task.attr('user'), User.list.get(2)[0])
    equal(task.attr('user_id'), users[2].id)

  })


})