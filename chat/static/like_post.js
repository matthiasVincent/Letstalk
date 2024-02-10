$(document).ready(
    function(){
        console.log("Loaded")
        bd = $("body")
        wrapper = $('.wrapper')
        wrapper.scrollTop(wrapper.prop("scrollHeight"))
        //console.log(bd.prop("scrollHeight"))
        window.scrollTo(0, bd.prop("scrollHeight"))

        $('.likebutton').click(
            function(ev)
                {
                ev.preventDefault();
                const n = $(this);
                //console.log(n)
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
                                // $(`.i-like${data_id}`).css("color", "blue")
                                }
                                else if (user_in == false && likes == 1)
                                {
                                $(`.like_count${data_id}`).html(`${likes} like`)
                                $(`.i-like${data_id}`).children('i').removeClass('text-primary')
                                $(`.i-like${data_id}`).children('i').addClass('text-dark')
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                                //$(`.i-like${data_id}`).css("color", "black")
                            }
                                else if (user_in == false && likes >= 2)
                                {
                                $(`.like_count${data_id}`).html(`${likes} likes`)
                                $(`.i-like${data_id}`).children('i').removeClass('text-primary')
                                $(`.i-like${data_id}`).children('i').addClass('text-dark')
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                                //$(`.i-like${data_id}`).css("color", "black")
                                }
                                else if (user_in == false && likes < 1)
                                {
                                $(`.like_count${data_id}`).html(``)
                                $(`.i-like${data_id}`).children('i').removeClass('text-primary')
                                $(`.i-like${data_id}`).children('i').addClass('text-dark')
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                                //$(`.i-like${data_id}`).css("color", "black")
                            }
                                else if (user_in == true && likes == 1)
                                {
                                $(`.like_count${data_id}`).html(`You Liked this`)
                                $(`.i-like${data_id}`).children('i').removeClass('text-dark')
                                $(`.i-like${data_id}`).children('i').addClass('text-primary')
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                                //$(`.i-like${data_id}`).css("color", "blue")
                            }
                                else if (user_in == true && likes == 2)
                                {
                                $(`.like_count${data_id}`).html(`You, and ${likes - 1} other`)
                                $(`.i-like${data_id}`).children('i').removeClass('text-dark')
                                $(`.i-like${data_id}`).children('i').addClass('text-primary')
                                
                                $(`.i-like${data_id}`).children('span').html(`${likes}`)
                                //$(`.i-like${data_id}`).css("color", "blue")
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
    }
)