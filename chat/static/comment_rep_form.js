$(document).ready(
    function(){
        const comment_id = JSON.parse(document.getElementById('comment_id').textContent)
        console.log(comment_id)
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
         
         // function to format post creation Date
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
                format = diff <= 1? diff + "sec" : diff + "secs"
            }
           else if (diff >= 60 && diff < hourSeconds){
            format = Math.floor(diff/60) <= 1 ? Math.floor(diff/60) + "min" : Math.floor(diff/60) + "mins"
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

        // Fetch comment and its replies through ajax API
        $.ajax({
            type: "GET",
            url: "http://" + window.location.host + "/api/v1/" + comment_id + "/replies/",
            data: {comment_id : comment_id},

            success: function(data){
                console.log(data)
                
                if (data.replies.length > 0){
                    const reply_cont = `<div class="short-wrapper pt-3 " id="reply-cont">
                                        </div>`
                    const comment =  ` 
                    <div class="wrap-reply mt-2">
                        <div class="img-cont-reply">
                            <img src="${data.user.profile_image}" alt="" class="image">
                        </div>
                        <div class="txt-wrap-reply" style="background-color: rgba(245, 245, 220, .5); border-radius: 10px;">
                            <div class="name-cont-reply">
                                <b><p>${data.user.fullname}</p></b>
                                <p>${data.comments}</p>
                            </div>
                            <div class="some-reply">
                                <span>${formatPostDate(data.created)}</span>
                                <a href="#">like</a>
                                <a href="#">reply</a>
                            </div>
                        </div> 
                    </div>
                    `
                    const replies = 
                    data.replies.map(reply => `
                        <div class="short ml-3">
                            <div class="img-reply" style="width:40px; height: 40px; border-radius: 50%;">
                                <img src="${reply.user.profile_image}" alt="" class="image" style="width: 100%; height: 100%; border-radius: 50%;">
                            </div>
                            <div class="comment-reply p-3 mb-2 ml-3" style="border-radius: 15px; background-color: aliceblue;">
                                <b><p>${reply.user.fullname}</p></b>
                                <p>${reply.comments}</p>
                                <div class="some-reply p-0 pb-3" style="margin-top: 5px">
                                    <span>${formatPostDate(reply.created)}</span>
                                    <a href="#">like</a>
                                    <a href="">reply</a>
                                </div>
                            </div>
                        </div>
                    `)
                    console.log(replies)

                    const all_replies = `
                    <div class="short-wrapper pt-3" id="reply-cont">
                        ${replies}
                    </div>
                    `
                    console.log(comment)
                    
                    $('#comment-box').append(comment, all_replies)
                }
                else{
                    const comment = `
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
                        </div>`

                        $('#comment-box').append(comment)
                }
            },

            error: function(){
                console.log("something went wrong")
            },
        })


        // Handle form submission
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
                                <span>${formatPostDate(data.created)}</span>
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