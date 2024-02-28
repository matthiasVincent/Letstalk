$(document).ready(
    function(){
        const sections = document.querySelectorAll('section')
        const navs = document.querySelectorAll('.icons')
        console.log(sections.length, navs.length)
        const logged_in_user = JSON.parse(document.getElementById('logged_in').textContent)
        console.log(logged_in_user)

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
            const diff = milliDiff/k
        
            if (diff < 20){
                format = "just now"
            }
            else if (diff > 20 && diff < 60){
                format = diff + " secs"
            }
           else if (diff >= 60 && diff < hourSeconds){
            format = Math.floor(diff/60) + " mins"
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
        
        // function to check whether a post is liked by authenticated user
        function checkLikes(user,  all_likes){
            for (let likes of all_likes){
                if (user===likes){
                    return true
                }
            }
            return false
        }

        for (let i = 0; i < navs.length; i++){
            navs[i].addEventListener('click', function(){
                    console.log(this)
                    for (let i = 0; i < sections.length; i++){
                        sections[i].classList.remove('active')
                        navs[i].classList.remove('active')
                    }
                    this.classList.add('active')
                    sections[i].classList.add('active')
                })
            }

        //Ajax request to fetch random posts for display in the feed
         $.ajax({
            type: "GET",
            url: "http://" + window.location.host + "/api/v1/random_posts/",
            success: function(data){
                console.log(data)
                data.map((post) => {
                    const header = `
                    <div class="d-flex justify-content-between mb-2 p-2" >
                    <a href="/profile/${post.poster.username}/" class="text-decoration-none text-dark pl-0">
                        <div class="lf">
                            <div class="img-cont m-0">
                                <img src="${post.poster.profile_image}" alt="hi" style="width: 100%; height: 100%; border-radius: 50%;">
                            </div>
                            <div class="ml-4 d-flex flex-column">
                            <span class="h5 text-dark">${post.poster.fullname.length > 12 ? `${post.poster.fullname.slice(0, 12) + "..."}` : `${post.poster.fullname}`}</span>
                            <span class="ml-2"><span><code class="text-dark">${formatPostDate(post.created)} &nbsp;</code></span>
                               <small>${post.poster.followers && post.poster.followers > 1? `${post.poster.followers + " followers"}`
                               : 
                               `${post.poster.followers < 1?  "" : `${post.poster.followers + " follower"}`}`}</small></span>
                            </div>
                        </div>
                    </a>
                    <p>
                        <a href="#" class="text-decoration-none" style="font-size: 20px; font-weight: 600; margin-right: 20px;">
                            <i class="fa fa-ellipsis-h text-dark"></i>
                        </a>
                    </p>
                </div>
                
                    `
                    const sp = `<span class="text-primary showfull" onclick="$(this).parent().hide(); $(this).parent().siblings().show()" style="cursor: pointer;">See more</span>`
                    const post_words = `
                    <div class="p-3 text-justify">
                         <p class="post-words" style="display:none; cursor:pointer;" onclick="$(this).hide(); $(this).siblings().show()">
                              ${post.words}
                          </p>
                        <p class="post-words">
                            ${post.words.length > 40 ? (`${post.words.slice(0, 40) + `...` + sp }`): `${post.words}`}
                        </p>
                </div>
                    `
                    const pictures = post.post_pictures
                    switch (pictures.length){
                        case 1:
                            var one = pictures[0]
                            var pics = `
                                    <div class='row'>
                                        <div class="col">
                                            <img src="${one.image}" alt="" width="100%" height="100%">
                                        </div>
                                    </div>
                            `
                            $('#posts-container').append(header, post_words, pics)
                            break
                        case 2:
                            var one = pictures[0]
                            var two = pictures[1]
                            var pics = `
                                    <div class='row p-0' style="display:grid; grid-template-columns:repeat(2, 1fr);">
                                        <div class="col">
                                            <img src="${one.image}" alt="" width="100%" height="100%">
                                        </div>
                                        <div class="col">
                                            <img src="${two.image}" alt="" width="100%" height="100%">
                                        </div>
                                    </div>
                            `
                            $('#posts-container').append(header, post_words, pics)

                            break
                        case 3:
                            console.log("Three")
                            var one = pictures[0]
                            var two = pictures[1]
                            var three = pictures[2]
                            var user = logged_in_user in post.all_likers
                            console.log(user)
                            var pics = `
                                    <div class="container">
                                    <div class="row bg-success">
                                        <div class="col-8  table-primary p-0"><img src="${one.image}" alt="" width="100%" height="100%"></div>
                                        <div class="col-4  table-danger p-0" style="display:grid; grid-template-rows:repeat(2, 1fr);">
                                            <div class="ro">
                                            <img src="${two.image}" alt="" width="100%" height="100%">
                                            </div>
                                            <div class="ro flex-grow">
                                            <img src="${three.image}" alt="" width="100%" height="100%">
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                            `
                            $('#posts-container').append(header, post_words, pics)
                            break
                        case 4:
                            var one = pictures[0]
                            var two = pictures[1]
                            var three = pictures[2]
                            var four = pictures[3]
                            var pics = `
                                    <div class="container">
                                    <div class="row bg-success">
                                        <div class="col-8  table-primary p-0"><img src="${one.image}" alt="" width="100%" height="100%"></div>
                                        <div class="col-4  table-danger p-0" style="display:grid; grid-template-rows:repeat(2, 1fr);">
                                            <div class="ro">
                                            <img src="${two.image}" alt="" width="100%" height="100%">
                                            </div>
                                            <div class="ro">
                                            <img src="${three.image}" alt="" width="100%" height="100%">
                                            </div>
                                            <div class="ro">
                                            <img src="${four.image}" alt="" width="100%" height="100%">
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                            `
                            $('#posts-container').append(header, post_words, pics)
                            break
                        case 5:
                            var one = pictures[0]
                            var two = pictures[1]
                            var three = pictures[2]
                            var four = pictures[3]
                            var five = pictures[4]
                            var pics = `
                                        <div class="container p-0">
                                        <div class="row p-0">
                                            <div class="col p-0" style="height: 250px"><img src="${one.image}" alt="" width="100%" height="100%"></div>
                                            <div class="col p-0" style="height: 250px">
                                                <img src="${two.image}" alt="" width="100%" height="100%">
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col p-0" style="height: 200px"><img src="${three.image}" alt="" width="100%" height="100%"></div>
                                            <div class="col p-0" style="height: 200px"><img src="${four.image}" alt="" width="100%" height="100%"></div>
                                            <div class="col p-0" style="height: 200px"><img src="${five.image}" alt="" width="100%" height="100%"></div>
                                        </div>
                                    </div>
                            `
                            $('#posts-container').append(header, post_words, pics)
                            break
                        default:
                            $('#posts-container').append(header, post_words)
                            break
                    }
                    var iLike = checkLikes(logged_in_user, post.all_likers)
                            console.log("auth_user " + iLike)
                    const rxn = `
                            <div class="rxn p-3">
                            <div class="d-flex flex-column">
                                    ${post.all_likes && iLike? 
                                    `
                                    <p class="like_count${post.post_id}" style="color: green;">You
                                        <span>${post.all_likes - 1 > 1 ? `and ${post.all_likes - 1 + "  others"}` : `${post.all_likes - 1 == 0 ?  " liked this" : `and ${post.all_likes - 1 + " other"}`}`}</span>
                                    </p>
                                    `:
                                    `
                                    <p>
                                        <span class="like_count${post.post_id}" 
                                        style="color:green">${post.all_likes  > 1 ? `${post.all_likes + " likes"}` : `${post.all_likes == 0? "" : `${post.all_likes + " like"}`}`} 
                                        </span>
                                    </p>
                                    `
                                    }
                            </div>
                            
                            <div class="d-flex p-2 justify-content-between">
                                <div style="position: relative;">
                                 ${post.all_likes && iLike? 
                                    `<a href="#"
                                        class="text-decoration-none likebutton p-2  i-like${post.post_id}"
                                        id="${post.post_id}" style="background-color: beige; border-radius: 5px;">
                                        <i class="fa fa-thumbs-up text-primary" aria-hidden="true"></i>
                                        <span class="ml-2 text-dark">${post.all_likes}</span>
                                    </a>`
                                    :
                                    `<a href="#"
                                        class="text-decoration-none likebutton p-2 i-like${post.post_id}"
                                        id="${post.post_id}" style="background-color: beige; border-radius: 5px;"><i class="fa fa-thumbs-up text-dark" aria-hidden="true"></i>
                                        <span class="ml-2 text-dark">${post.all_likes}</span>
                                    </a>
                                    `}
                                </div>
                        
                                <div>
                                    <a href="/post_comment/${post.post_id}/"
                                    class="text-decoration-none p-2" style="background-color: beige; border-radius: 5px;">
                                    <i class="fa fa-comment text-secondary"></i>
                                    <span class="ml-2 text-dark">${post.all_comments}</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    `
                    $('#posts-container').append(rxn, `<hr/>`)
                })
                 },

                 complete: function(){
                
                    // Post Liking ajax call, executed immediately after initial ajax call

             $('.likebutton').click(
                function(ev)
                    {
                        ev.preventDefault();
                        const n = $(this);
                        console.log(n)
                        const data_id = $(this).attr("id")
                        console.log(data_id)
                        $.ajax(
                    {
                        type: "GET",
                        url: "/likepost/",
                        data: {post: data_id},
                        success: function(data)
                            {

                             const user_in = data.I_liked
                             const likes = data.count
                             if (user_in === true && likes > 2)
                             {
                                $(`.like_count${data_id}`).html(`You, and ${likes - 1} others`)
                                $(`.i-like${data_id}`).children('i').removeClass('text-dark')
                                $(`.i-like${data_id}`).children('i').addClass('text-primary')
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                             }
                             else if (user_in == false && likes == 1)
                             {
                                $(`.like_count${data_id}`).html(`${likes} like`)
                                $(`.i-like${data_id}`).children('i').removeClass('text-primary')
                                $(`.i-like${data_id}`).children('i').addClass('text-dark')
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                            }
                             else if (user_in == false && likes >= 2)
                             {
                                $(`.like_count${data_id}`).html(`${likes} likes`)
                                $(`.i-like${data_id}`).children('i').removeClass('text-primary')
                                $(`.i-like${data_id}`).children('i').addClass('text-dark')
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                             }
                             else if (user_in == false && likes < 1)
                             {
                                $(`.like_count${data_id}`).html(``)
                                $(`.i-like${data_id}`).children('i').removeClass('text-primary')
                                $(`.i-like${data_id}`).children('i').addClass('text-dark')
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                            }
                             else if (user_in == true && likes == 1)
                             {
                                $(`.like_count${data_id}`).html(`You Liked this`)
                                $(`.i-like${data_id}`).children('i').removeClass('text-dark')
                                $(`.i-like${data_id}`).children('i').addClass('text-primary')
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                            }
                             else if (user_in == true && likes == 2)
                             {
                                $(`.like_count${data_id}`).html(`You, and ${likes - 1} other`)
                                $(`.i-like${data_id}`).children('i').removeClass('text-dark')
                                $(`.i-like${data_id}`).children('i').addClass('text-primary')

                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                                }
                                console.log(data)
                            },
                        error: function(data)
                            {
                             console.log("something went wrong")
                            }

                    }
                            );

    }
)
                 },
                })


        //Websocket to handle message notification, runs immediately a user is authenticated
         const socket = new WebSocket("ws://" + window.location.host + "/notifications/")
            socket.onopen = function(e){
                console.log("Connected!")
            }
            socket.onclose = function(e){
                console.log("Disconnected")
            }
            socket.onmessage = function(e){
                //console.log(JSON.parse(e.data))
            const message = JSON.parse(e.data)
            const messageWithTransformedDate = message.welcome.map(user => {
                return {...user, created: new Date(user.created)}
            })
            console.log(messageWithTransformedDate)
            const sorted_message = messageWithTransformedDate.sort((a, b) => Number(b.created) - Number(a.created))
            console.log(sorted_message)
            // const logged_in_user = JSON.parse(document.getElementById('logged_in').textContent)
            // console.log(logged_in_user)
            console.log(message)
            switch (message.type){
                case "previous_conv":
                    {
                        $('#buddy-list').append(
                            sorted_message.map(user => `
                            ${user.sender.username===logged_in_user? 
                            ` <a href="/inbox/${user.receiver.username}/" class="text-decoration-none" id="${user.room_name}">
                            <div class="single-friend p-3 d-flex" style="width: 80%;">
                                <div class="picture-cont">
                                    <img src="${user.receiver.profile_image}" alt="" id="pb">
                                </div>
                                <div class="friend-det" style="margin-left: 10%;">
                                    <p class="h5 text-dark">${user.receiver.fullname.length > 12 ? `${user.receiver.fullname.slice(0, 12) + "..."}` : `${user.receiver.fullname}`}</p>
                                    <p class="last-msg h6 text-dark">${user.text_message.length > 12 ? `${user.text_message.slice(0, 12) + "..."}` : `${user.text_message}`}</p>
                                </div>
                            </div>
                        </a>
                        <hr/>` :`
                        <a href="/inbox/${user.sender.username}/" class="text-decoration-none" id="${user.room_name}">
                        <div class="single-friend p-3 d-flex" style="width: 80%;">
                            <div class="picture-cont">
                                <img src="${user.sender.profile_image}" alt="" id="pb">
                            </div>
                            <div class="friend-det" style="margin-left: 10%;">
                                <p class="h5 text-dark">${user.sender.fullname.length > 12 ? `${user.sender.fullname.slice(0, 12) + "..."}` : `${user.sender.fullname}`}</p>
                                <p class="last-msg h6 text-dark">${user.text_message.length > 12 ? `${user.text_message.slice(0, 12) + "..."}` : `${user.text_message}`}</p>
                            </div>
                        </div>
                    </a>
                    <hr/>
                        `
                            }
                            
                            `)
                        )
                        break;
                    }
                case "new_message":
                    {
                        console.log($(`#${sorted_message[0].room_name}`).find('p.last-msg'))
                        const msg = sorted_message[0]
                       const targ = $(`#${sorted_message[0].room_name}`)
                       const new_msg_top = `
                       ${msg.sender.username===logged_in_user? 
                        ` 
                        <a href="/inbox/${msg.receiver.username}/" class="text-decoration-none" id="${msg.room_name}">
                            <div class="single-friend p-3 d-flex" style="width: 80%;">
                                <div class="picture-cont">
                                    <img src="${msg.receiver.profile_image}" alt="" id="pb">
                                </div>
                                <div class="friend-det" style="margin-left: 10%;">
                                    <p class="h5 text-dark">${msg.receiver.fullname.length > 12 ? `${msg.receiver.fullname.slice(0, 12) + "..."}` : `${msg.receiver.fullname}`}</p>
                                    <p class="last-msg h6 text-dark">${msg.text_message.length > 12 ? `${msg.text_message.slice(0, 12) + "..."}` : `${msg.text_message}`}</p>
                                </div>
                            </div>
                         </a>
                        `
                         :
                         
                         `
                        <a href="/inbox/${msg.sender.username}/" class="text-decoration-none" id="${msg.room_name}">
                            <div class="single-friend p-3 d-flex" style="width: 80%;">
                                <div class="picture-cont">
                                    <img src="${msg.sender.profile_image}" alt="" id="pb">
                                </div>
                                <div class="friend-det" style="margin-left: 10%;">
                                    <p class="h5 text-dark">${msg.sender.fullname.length > 12 ? `${msg.sender.fullname.slice(0, 12) + "..."}` : `${msg.sender.fullname}`}</p>
                                    <p class="last-msg h6 text-dark">${msg.text_message.length > 12 ? `${msg.text_message.slice(0, 12) + "..."}` : `${msg.text_message}`}</p>
                                </div>
                            </div>
                        </a>
                       
                    `
                        }
                       `
                       
                       $(`#${sorted_message[0].room_name}`).remove()
                       console.log(targ)
                       $('#buddy-list').prepend(new_msg_top)
                      //console.log(prev)
                        //$(`#${message.welcome[0].room_name}`).find('p.ast-msg').hide()
                       
                        break
                    }
                default: console.log("something wrong")
            }
           
            }


    }
)
