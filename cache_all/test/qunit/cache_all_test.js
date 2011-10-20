module("cache_all", {
  setup: function(){

    $.storage.flush()

    $.fixture.make('task', 100, function(i){
      return {id: i, name: 'task '+i, user_id: i}
    })

    $.fixture.make('user', 100, function(i){
      return {id: i, name: 'user '+i }
    })

    $.Model.extend('Task', {
      attributes:{
      },
      init: function(){
        this.cacheAll()
        this.belongsToCached('user', 'User', 'user_id')
      },
      findAll: 'tasks'

    },{});

    $.Model.extend('User',{
      attributes: {

      },

      init: function(){
        this.cacheAll()
        this.hasManyCached('tasks', 'Task', 'user_id')
      },
      findAll: 'users'

    },{})

    $.Model('OtherUser', {
      attributes: {

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

  setTimeout(function(){
    equal(User.all.length,100)
    equal(Task.all.length,100)
  },1000)

});

test('cached association getter', function(){
  setTimeout(function(){
    equals(User.all[0].attr('tasks')[0], Task.all.get(0)[0])
    equals(Task.all[2].attr('user'), User.all.get(2)[0])
  },1000)
})

//test('getters can be overriden', function(){
//  equals(new OtherUser().attr('tasks'),'test')
//})
//
test('cacheConstants', function(){

  $.Model.extend('Action',{
    attributes: {
      name: 'string'
    },
    init: function(){
      this.cacheAll({cacheAllConstantsBy: 'name'})
    },
    findAll: function(params, success){
      var items = [{name: 'todo'},{name: 'forecasted'}], self = this
      return $.Deferred(function(def){
        success ? def.resolve(success(self.models(items))) : def.resolve(self.models(items))
      })
    }
  },{})

  ok(Action.todo instanceof Action)
  equal(Action.forecasted.name, 'forecasted')
})
//
//
//
