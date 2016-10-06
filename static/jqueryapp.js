function changeCard(){
    var text = document.getElementById("cardNumber").value;
    text = text.replace(/\s/g, '');
    text = text.replace(/[A-z]/g, '');
    text = text.replace(/[\+\_\-\)\(\*\&\^\%\$\#\@\!\|\}\{\~\`\"\'\;\:\>\<\/\?\.\,\=]/g, '');
    text = text.replace(/([0-9]{4})/g,'$1 ');
    document.getElementById('cardNumber').value = text;
}
$("#cardNumber").on('keyup', function(e){
    if(!(e.keyCode==8 || e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40 || e.keyCode==17)){
        changeCard();
    }
    if($(this).val().length>=19){
        $("#expiryMonth").focus();
    }
});
$("#cardNumber").blur(function(){
    changeCard();
});
$("#expiryMonth").on("keyup", function(e){
     var expiry= $("#expiryMonth").val();
    if(!(e.keyCode==8 || e.keyCode==37 || e.keyCode==38 || e.keyCode==39 || e.keyCode==40)){ 
        if(expiry.charAt(0)>1){
            document.getElementById("expiryMonth").value="0"+expiry;
        }
    }   
    if($(this).val().length>=2){
        $("#expiryYear").focus();
    }
});

$("#expiryYear").on("keyup", function(e){
    if($(this).val().length>=2){
        $("#cvv").focus();
    }
});
