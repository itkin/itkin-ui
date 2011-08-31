module("cache_all", {
  setup: function(){
    $.Model.extend('Task', {
      attributes:{
      },
      init: function(){
        this.cacheAll()
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

      init: function(){
        this.cacheAll()
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
  equal(User.list.length,100)
  equal(Task.list.length,100)
});

test('cached association getter', function(){
  equals(User.list[0].attr('tasks')[0], Task.list.get(0)[0])
  equals(Task.list[2].attr('user'), User.list.get(2)[0])
})

test('getters can be overriden', function(){
  equals(new OtherUser().attr('tasks'),'test')
})



