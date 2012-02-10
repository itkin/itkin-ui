steal('funcunit').then(function(){

module("Itkin.inlineEdit", { 
	setup: function(){
		S.open("//itkin/inline_edit/inline_edit.html");
	}
});

test("Text Test", function(){
	equals(S("h1").text(), "Itkin.inlineEdit Demo","demo text");
});


});