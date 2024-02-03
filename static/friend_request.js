$(document).ready(
    function(){
        const form = $('#follow_form');
        console.log(form)
        form.submit(function(ev){
            console.log("begin")
            ev.preventDefault();
            var formD = new FormData(this)
            for (const [k,v] of formD){
                console.log(k,v)
            }
            $.ajax({
                url: form.attr('action'),
                type: "POST",
                data: formD,
                contentType: false,
                processData: false,
                success: function(response){
                    $('.btn-confirm-cont').html("You are now friends");
                },
                error: function(data){
                    console.log("something went wrong")
                }
            })
        })
    })
