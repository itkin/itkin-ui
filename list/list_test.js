steal('funcunit').then(function(){

module("Carla.Controllers.FollowUps.List", { 
	setup: function(){
		S.open("//carla/controllers/follow_ups/list/list.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Carla.Controllers.FollowUps.List Demo","demo text");
});


});