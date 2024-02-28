$(document).ready(
    function(){
        const form = $('#dm-form')
        console.log(form)
        $(form).on('submit', function(ev){
            ev.preventDefault()
            const formD = new FormData(this)
            //const box = $('.comment-cont')
            console.log(formD)
            $.ajax(
                {
                url: $(form).attr('action'),
                type: "POST",
                data: formD,
                contentType: false,
                processData: false,
                success: function(response){
                    const data = response.status
                    console.log(response.msg)
                    $('#dm-feedback').html(response.status)
                },
                error: function(){
                    console.log("something went wrong")
                }
            }
            )
            document.querySelector('#dm-input').value = ""
        })
    }
)