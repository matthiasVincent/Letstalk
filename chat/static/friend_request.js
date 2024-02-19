$(document).ready(
    function(){
        $.ajax({
            url: "http://" + window.location.host + "/api/v1/user/friend_request/",
            type: "GET",
            success: function(response){
                $('#follower-request').append(response.map(user => `
                            <div class="user">
                                <div class="lf">
                                    <div class="img-cont">
                                        <img src="${user.profile_image}" alt="hi" style="width: 100%; height: 100%; border-radius: 50%;">
                                    </div>
                                    <div class="some-text">
                                        <span>${user.fullname.length > 12 ? `${user.fullname.slice(0, 12) + "..."}` : `${user.fullname}`}</span>
                                        ${user.favorite_quote? `
                                        <span>${(user.favorite_quote).slice(0, 12) + "..."}</span>`: ""}
                                </div>
                            </div>
                            <div class="bt-cont" id="btn-confirm-cont">
                                <form action="{% url 'editprofile' %}" method="post" id="follow_form">
                                    {% csrf_token %}
                                    <input type="hidden" class="form-control" value="{{logged_in.username}}" name="follower">
                                    <input type="hidden" class="form-control" value="${user.username}" name="following">
                                    <input type="hidden" name="follow">
                                    <button class="btn btn-success p-2">Confirm</button>
                                </form>
                            </div>
                        </div>
                        <hr>
                `))
            },
            error: function(data){
                console.log("something went wrong")
            },
            complete: function(){
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
                            $('#btn-confirm-cont').html("You are now friends");
                        },
                        error: function(data){
                            console.log("something went wrong")
                        }
                    })
                })
            }
        })
    })
