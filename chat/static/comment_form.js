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

         //function to format post creation Date
         function formatPostDate(created){
            let format;
            const today = new Date()
            const todaySeconds = today.getTime()
            const passDate = new Date(created)
            const passDateSeconds = passDate.getTime()
            const milliDiff = todaySeconds-passDateSeconds
            const hourSeconds = 60 * 60
            const k = 1000
            const diff = Math.floor(milliDiff/k)
        
            if (diff < 20){
                format = "just now"
            }
            else if (diff > 20 && diff < 60){
                format = diff > 1? diff + "secs" : diff + "sec"
            }
           else if (diff >= 60 && diff < hourSeconds){
            format = Math.floor(diff/60) > 1? Math.floor(diff/60) + "mins" : Math.floor(diff/60) + "min"
           }
           else if (diff >= hourSeconds && diff < (24 * hourSeconds)){
           format = Math.floor(diff/(60 * 60)) + "h"
           }
           else if (diff >= (24 * hourSeconds) && diff < (7 * 24 * hourSeconds)){
            format = Math.floor(diff/(24 * hourSeconds)) + "d"
           }
           else{
            let dateString = passDate.toDateString().split(" ")
            format = dateString[2] + " " + dateString[1] + ", " + dateString[3]
           }
           return format
        }

        const form = $('#comment')
        console.log($('.post-comments'))

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
                    $('.post-comments').append(`
                    <div class="only-comment mt-2 d-flex pl-3">
                        <div class="img-comment" style="width: 60px; height: 60px; border-radius: 50%;">
                            <img src="${data.user.profile_image}" alt="" style="width: 100%; height: 100%; border-radius: 50%;">
                        </div>
                        <div class="cmt-details ml-3 p-3" style="width: 70%; border-radius: 15px; background-color: aliceblue;">
                            <div class="cmt-name">
                                <b><p>${data.user.fullname}</p></b>
                                <p>${data.comments}</p>
                            </div>
                            <div class="some">
                                <span>${formatPostDate(data.created)}</span>
                                <a href="#">like</a>
                                <a href="">reply</a>
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