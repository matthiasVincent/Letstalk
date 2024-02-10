$(document).ready(
    function(){
        console.log("Loaded")
        function handle(e){
            this.style.maxHeight = 80 + "px"
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + "px"
            // wrapper.scrollTop(wrapper.prop("scrollHeight"))
            //  this.parent.style.marginTop += this.parent.style.marginTop + "px"
        }
        document.querySelector('#msg').addEventListener("input", handle, true)

        const form = $('#comment')

        $(form).on('submit', function(ev){
            ev.preventDefault()
            const formD = new FormData(this)
            const box = $('#reply-cont')
            console.log(box)
            $.ajax({
                url: $(form).attr('action'),
                type: "POST",
                data: formD,
                contentType: false,
                processData: false,
                success: function(response){
                    const data = response.msg
                    console.log(data)
                    $(box).append(`
                    <div class="short ml-3">
                        <div class="img-reply" style="width:40px; height: 40px; border-radius: 50%;">
                            <img src="${data.user.profile_image}" alt="" class="image" style="width: 100%; height: 100%; border-radius: 50%;">
                        </div>
                        <div class="comment-reply p-3 mb-2 ml-3" style="border-radius: 15px; background-color: aliceblue;">
                            <b><p>${data.user.fullname}</p></b>
                            <p>${data.comments}</p>
                        <div class="some-reply p-0 pb-3" style="margin-top: 5px">
                            <span>13 mins</span>
                            <a href="#">like</a>
                            <a href="">reply</a>
                        </div>
                        </div>
                    </div> 
                    `)
                },
                error: function(data){
                    console.log("something went wrong")
                }
            })
            document.querySelector('#msg').value = ""
            
        })
    }
)