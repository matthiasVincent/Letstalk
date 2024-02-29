$(document).ready(
    function(){
        const post_id = JSON.parse(document.getElementById('post_id').textContent)
        const logged_in_user = JSON.parse(document.getElementById('logged_in').textContent)
        console.log(post_id)
        // Handles user following and unfollowing
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


         // function to check whether a post is liked by authenticated user
         function checkLikes(user,  all_likes){
            for (let likes of all_likes){
                if (user===likes){
                    return true
                }
            }
            return false
        }

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
        //console.log($('#user-posts'))
        // Handles user posts fetching
        $.ajax({
            type: "GET",
            url: "http://" + window.location.host + "/api/v1/" + post_id + "/comments/",
            data: {post_id : post_id},
            success: function(data){
                let post = data
                console.log(data)
                    const header = `
                    <div class="d-flex justify-content-between mb-2 pt-3" >
                    <a href="/profile/${post.poster.username}/" class="text-decoration-none text-dark pl-0">
                        <div class="d-flex justify-content-between">
                            <div class="img-cont bg-warning" style="width: 60px; height:60px; border-radius:50%;">
                                <img src="${post.poster.profile_image}" alt="hi">
                            </div>
                            <div class="ml-2 d-flex flex-column">
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
                    <div class="pt-3 px-2 text-justify">
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
                            $('#post-detail').append(header, post_words, pics)
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
                            $('#post-detail').append(header, post_words, pics)

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
                            $('#post-detail').append(header, post_words, pics)
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
                            $('#post-detail').append(header, post_words, pics)
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
                            $('#post-detail').append(header, post_words, pics)
                            break
                        default:
                            $('#post-detail').append(header, post_words)
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
                    $('#post-detail').append(rxn, `<hr/>`)

                    if (post.comments){
                        console.log(post.comments)
                        for (let i = 0; i < post.comments.length; i++){
                            console.log(post.comments[i])
                            if (post.comments[i].reply){
                                continue
                            }
                            else if (post.comments[i].replies.length > 0){
                                let links;
                                let cmt;
                                let numberOfReplies;
                                let repliesToComment;
                                cmt = `
                                    <div class="only-comment mt-2 d-flex pl-3">
                                        <div class="img-comment" style="width: 60px; height: 60px; border-radius: 50%;">
                                            <img src="${post.comments[i].user.profile_image}" alt="" style="width: 100%; height: 100%; border-radius: 50%;">
                                        </div>
                                        <div class="cmt-details ml-3 p-3" style="width: 70%; border-radius: 15px; background-color: aliceblue;">
                                            <div class="cmt-name">
                                                <b><p>${post.comments[i].user.fullname}</p></b>
                                                <p>${post.comments[i].comments}</p>
                                            </div>
                                            <div class="some">
                                                <span>${formatPostDate(post.comments[i].created)}</span>
                                                <a href="#">like</a>
                                                <a href="/replies/${post.comments[i].comment_id}/">reply</a>
                                            </div>
                                        </div>
                                    </div>

                                    `
                                if (post.comments[i].replies.length > 2){
                                    console.log("year greater than 2")
                                    numberOfReplies = post.comments[i].replies.slice(0, 2)
                                    repliesToComment = numberOfReplies.map(reply => `
                                    <div class="short">
                                        <div class="img-top">
                                            <img src="${reply.user.profile_image}" alt="" class="image">
                                        </div>
                        
                                        <div class="reply-txt p-2 mb-2">
                                            <p><span class="mr-2"><b>${reply.user.fullname.slice(0, 12) + "..."}</b></span>${reply.comments.slice(0, 13) + "..."}</p>
                                        </div>
                                    </div>
                                    `)
                                    links = `
                                        <a href="/replies/${post.comments[i].comment_id}/" class="text-decoration-none text-dark">
                                            <div class="short-wrapper">
                                                <p class="h5 p-2">View more replies...</p>
                                                ${repliesToComment.join('')}
                                            </div>
                                        </a>
                                    `
                                }

                                else {
                                    console.log("Less or eaqual 2")
                                    numberOfReplies = post.comments[i].replies
                                    repliesToComment = numberOfReplies.map(reply => `
                                    <div class="short">
                                        <div class="img-top">
                                            <img src="${reply.user.profile_image}" alt="" class="image">
                                        </div>
                        
                                        <div class="reply-txt p-2 mb-2">
                                            <p><span class="mr-2"><b>${reply.user.fullname.slice(0, 12) + "..."}</b></span>${reply.comments.slice(0, 13) + "..."}</p>
                                        </div>
                                    </div>
                                    `)
                                    links = `
                                        <a href="/replies/${post.comments[i].comment_id}/" class="text-decoration-none text-dark">
                                            <div class="short-wrapper">
                                            ${repliesToComment.join('')}
                                            </div>
                                        </a>
                                    `
                                    console.log(cmt, links)
                                }
                                $('.post-comments').append(cmt, links)
                                }
                            else {
                                    cmt = `
                                        <div class="only-comment mt-2 d-flex pl-3">
                                            <div class="img-comment" style="width: 60px; height: 60px; border-radius: 50%;">
                                                <img src="${post.comments[i].user.profile_image}" alt="" style="width: 100%; height: 100%; border-radius: 50%;">
                                            </div>
                                            <div class="cmt-details ml-3 p-3" style="width: 70%; border-radius: 15px; background-color: aliceblue;">
                                                <div class="cmt-name">
                                                    <b><p>${post.comments[i].user.fullname}</p></b>
                                                    <p>${post.comments[i].comments}</p>
                                                </div>
                                                <div class="some">
                                                    <span>${formatPostDate(post.comments[i].created)}</span>
                                                    <a href="#">like</a>
                                                    <a href="/replies/${post.comments[i].comment_id}/">reply</a>
                                                </div>
                                            </div>
                                        </div>
                                `
                                $('.post-comments').append(cmt)
                                }
                            }
                        }
            },
            complete: function()
            {

            // Post Liking ajax call
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
                        })
                 },
                })
    })
