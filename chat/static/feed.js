$(document).ready(
    function(){
        const sections = document.querySelectorAll('section')
        const navs = document.querySelectorAll('.icons')
        console.log(sections.length, navs.length)

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

        // Api call to fetch user suggestions
        $.get("http://" + window.location.host + "/api/v1/user/friend_suggestion/", function(data){
            console.log(data)
            $('#user_suggestion').append(data.map(user => `
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
                            <div class="bt-cont">
                                <a href="/profile/${user.username}/" class="text-white text-decoration-none btn btn-success p-2">View Profile</a>
                            </div>
                        </div>
                        <hr>
            `))

            $('#request_suggestion').append(data.map(user => `
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
                            <div class="bt-cont">
                                <a href="/profile/${user.username}/" class="text-white text-decoration-none btn btn-success p-2">View Profile</a>
                            </div>
                        </div>
                        <hr>
            `))

            })

        // Api call for buddy list
        $.get("http://" + window.location.host + "/api/v1/user/buddy_list/", function(data){
            console.log(data)
            $('#buddy-list').append(
                data.map(user => `
                <a href="/inbox/${user.username}/" class="text-decoration-none">
                    <div class="single-friend p-3 d-flex" style="width: 80%;">
                        <div class="picture-cont">
                            <img src="${user.profile_image}" alt="" id="pb">
                        </div>
                        <div class="friend-det" style="margin-left: 10%;">
                            <p class="h5 text-dark">${user.fullname.length > 12 ? `${user.fullname.slice(0, 12) + "..."}` : `${user.fullname}`}</p>
                            <p class="last-msg h6 text-dark">Hello world</p>
                        </div>
                    </div>
                </a>
                <hr/>
                `)
            )
            })

    }
)