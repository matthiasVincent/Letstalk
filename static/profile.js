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
                    var btn_text = $('.btn-info');
                    btn_text = $(btn_text)
                    console.log(btn_text)
                    console.log(response.btn_text)
                    btn_text.attr("value", `${response.btn_text}`)
                },
                error: function(data){
                    console.log("something went wrong")
                }
            })
        })
    })