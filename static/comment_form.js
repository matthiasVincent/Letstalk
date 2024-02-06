$(document).ready(
    function(){
        console.log("Loaded")
        bd = $("body")
        wrapper = $('.wrapper')
        wrapper.scrollTop(wrapper.prop("scrollHeight"))
        //console.log(bd.prop("scrollHeight"))
        window.scrollTo(0, bd.prop("scrollHeight"))
        document.querySelector('#msg').focus();
        document.querySelector('#msg').style.maxHeight = 
        prev = 70;
        row = 1
        console.log(prev, row)

        function handle(e){
            this.style.maxHeight = 80 + "px"
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + "px"
            wrapper.scrollTop(wrapper.prop("scrollHeight"))
            //  this.parent.style.marginTop += this.parent.style.marginTop + "px"
        }
        document.querySelector('#msg').addEventListener("input", handle, true)

        const form = $('#comment')

        $(form).on('submit', function(ev){
            ev.preventDefault()
            const formD = new FormData(this)
            const box = $('.comment-cont')
            console.log(box)
            $.ajax({
                url: $(form).attr('action'),
                type: "POST",
                data: formD,
                contentType: false,
                processData: false,
                success: function(response){
                    const data = response.msg
                    console.log(response.msg)
                    $('.comment-cont').append(`
                    <div class="wrapper-cmt">
                        <div class="img-cont">
                            <img src="${data.user.profile_image}" alt="" class="image">
                        </div>
                        <div class="txt-wrap">
                            <div class="name-cont" style="background-color: beige; border-radius: 15px;">
                                <b><p>${data.user.fullname}</p></b>
                                <p>${data.comments}</p>
                            </div>
                            <div class="some">
                                <span>13 mins</span>
                                <a href="#">like</a>
                                <a href="/replies/${data.comment_id}/">reply</a>
                            </div>
                        </div>
                    </div>
                    <hr>
                    `)
                    // console.log(document.querySelector('.wrapper'))
                    $('.wrapper').scrollTop($('.wrapper').prop("scrollHeight"))
                },
                error: function(data){
                    console.log("something went wrong")
                }
            })
            document.querySelector('#msg').value = ""
            //var t = $('.wrapper')
            //console.log()
            // console.log(document.querySelector('.wrapper'))
            //$('.wrapper').scrollTop($('.wrapper').prop("scrollHeight"))
            
        })
    }
)