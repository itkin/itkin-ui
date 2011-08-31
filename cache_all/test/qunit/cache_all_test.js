module("cache_all", {
  setup: function(){
    $.Model.extend('Task', {
      attributes:{
      },
      listType: $.Model.List,
      init: function(){
        this.belongsToCached('user', 'User', 'user_id')
      },
      findAll:function(params,success,fail){
        var items = []
        for(var i = 0; i < 100; i++){
          items.push({id: i, name: 'todo'+i, user_id: i})
        }
        return success ? success(this.wrapMany(items)) : this.wrapMany(items)
      }
    },{});

    $.Model.extend('User',{
      attributes: {

      },
      listType: $.Model.List,
      init: function(){
        this.hasManyCached('tasks', 'Task', 'user_id')
      },
      findAll: function(params,success){
        var items = []
        for(var i = 0; i < 100; i++){
          items.push({id: i, name: 'todo'+i})
        }
        return success ? success(this.wrapMany(items)) : this.wrapMany(items)
      }
    },{})

    $.Model('OtherUser', {
      attributes: {

      },
      listType: $.Model.List,
      init: function(){
        this.hasManyCached('tasks')
      }
    },{
      getTasks: function(){
        return 'test'
      }
    })

  }
});

test("List is initialized and its methods available", function(){
	ok(Task.hasOwnProperty('List'));
});

test('cached association getter', function(){
  var users = User.findAll()
  var tasks = Task.findAll()
  equals(users[0].attr('tasks')[0], Task.list.get(0)[0])
  equals(tasks[2].attr('user'), User.list.get(2)[0])
})

test('getters can be overriden', function(){
  equals(new OtherUser().attr('tasks'),'test')
})

test('cached association setter', function(){
  var users = User.findAll()
  var tasks = Task.findAll()
  users[0]

})

