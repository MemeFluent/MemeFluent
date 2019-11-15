var user = "user1";

function sendtext(){
		$('#screen').append("<br>"+user+": "+$('#textbox').val());
		$('#textbox').val('');
};


$(document).ready(function(){
    $('img[class=preview]').each(function() {
        $(this).click(function(){
        	$('#screen').append("<br> <img src='"+$(this).attr('src')+"'>");
        });
    });
});

$(document).ready(function () {
    $.get("images/.", function(data) {
        $("imagesinner").append(data);
    });
})