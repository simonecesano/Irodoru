var camera_pos;
var look_at;
var translate;
var light_pos;

$(function(){
    $('#scene input').on('change', function(e){
	alert($(this).attr("id"));
	console.log($(this).val());
	console.log(obj.rotation);
    })
})
