module("cache_all", {
  setup: function(){
    $.Model.extend('Task', {
      attributes:{
        user: 'User.model'
      },
      init: function(){
        this.cacheAll()
        this.belongsToCached('user', 'user_id')
      },
      findAll:function(params,success,fail){
        var items = []
        for(var i = 0; i < 100; i++){
          items.push({id: i, name: 'todo'+i, user_id: i})
        }
        return success(this.wrapMany(items))
      }
    },{});

    $.Model.extend('User',{
      attributes: {
        tasks: 'Task.models'
      },
      init: function(){
        this.cacheAll()
        this.hasManyCached('tasks', 'user_id')
      },
      findAll: function(params,success){
        var items = []
        for(var i = 0; i < 100; i++){
          items.push({id: i, name: 'todo'+i})
        }
        return success(this.wrapMany(items))
      }
    },{})

    $.Model('OtherUser', {
      attributes: {
        tasks: 'Task.models'
      },
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
  equals(Task.all.Class.shortName, 'List')
});

test('cached model association', function(){
  equals(User.all[0].getTasks()[0], Task.all[0])
  equals(Task.all[2].getUser(), User.all[2])
})

test('can be overriden', function(){
  equals(new OtherUser().getTasks(),'test')
})

