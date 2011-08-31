module("cache_all", {
  setup: function(){
    $.Model.extend('Task', {
      init: function(){
        this.cacheAll()
        this.belongsToCached('User', 'user', 'user_id')
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
      init: function(){
        this.cacheAll()
        this.hasManyCached('Task', 'tasks', 'user_id')
      },
      findAll: function(params,success){
        var items = []
        for(var i = 0; i < 100; i++){
          items.push({id: i, name: 'todo'+i})
        }
        return success(this.wrapMany(items))
      }
    },{})
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
  $.Model('OtherUser', {
    init: function(){
      this.hasManyCached('Task', 'tasks')
    }
  },{
    getTasks: function(){
      return 'test'
    }
  })
  equals(new OtherUser().getTasks(),'test')
})

