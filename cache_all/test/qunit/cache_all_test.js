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
  equal(User.all.length,100)
  equal(Task.all.length,100)
});

test('cached association getter', function(){
  equals(User.all[0].attr('tasks')[0], Task.all.get(0)[0])
  equals(Task.all[2].attr('user'), User.all.get(2)[0])
})

test('getters can be overriden', function(){
  equals(new OtherUser().attr('tasks'),'test')
})

test('cacheConstants', function(){
 $.Model.extend('Action',{
    attributes: {
      name: 'string'
    },
    init: function(){
      this.cacheAll({cacheAllConstantsBy: 'name'})
    },
    findAll: function(params, success){
      var items = [{name: 'todo'},{name: 'forecasted'}]
      return success ? success(this.wrapMany(items)) : this.wrapMany(items)
    }
  },{})

  ok(Action.todo instanceof Action)
  equal(Action.forecasted.name, 'forecasted')
})



