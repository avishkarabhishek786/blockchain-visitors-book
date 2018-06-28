$(document).on('click', '#bc-btn', function() {

  var text = $('#_bdata').val();
  console.log("ok");
  $.ajax({
      url: "/ajax",
      data: {my_text:text},
      type:"post",
      success: function(result){
        console.log(result);
        $("#div1").html('You typed '+result);
      }
  });
});
