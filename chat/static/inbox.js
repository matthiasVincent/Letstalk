$(document).ready(
    function(){
        const friendUser= JSON.parse(document.getElementById('friend-user').textContent);
        const authUser = JSON.parse(document.getElementById('auth-user').textContent);
        const authUserLastName = JSON.parse(document.getElementById('auth-user-last-name').textContent);
        const friendLastName = JSON.parse(document.getElementById('friend-last-name').textContent);
        const editFriendLastName = friendLastName.split(' ').join('')
        const editAuthLastName = authUserLastName.split(' ').join('')
        const fullNameAuth = authUser + editAuthLastName
        const fullNameFriend = friendUser + editFriendLastName
        const name_array_sort = [fullNameAuth, fullNameFriend].sort()
        const roomName = name_array_sort[0].slice(0, 15) + "_" + name_array_sort[1].slice(0, 15) + "-" + friendUser;
        console.log(roomName)

    document.querySelector('#msg').focus()

    //Date formatting function
    function formatMessageDate(created){
        let format;
        const today = new Date()
        const todaySeconds = today.getTime()
        const passDate = new Date(created)
        const passDateSeconds = passDate.getTime()
        const diff = todaySeconds-passDateSeconds
        const secondsInDay = 24 * 60 * 60 * 1000
        const secondsInWeek = 7 * secondsInDay
        const meridian = passDate.toLocaleTimeString().split(' ')[1]
        const timeFormat = passDate.toLocaleTimeString().split(":").slice(0, 2).join(":") + " " + meridian
        console.log(timeFormat, meridian)
    
        if (diff < secondsInDay){
            let dayOfWeekName = passDate.toDateString().split(" ")[0]
            format = today.getDay() < passDate.getDay() ? `${dayOfWeekName}, ${timeFormat}` : timeFormat
        }
        else if (diff >= secondsInDay && diff < secondsInWeek){
            let dayOfWeekName = passDate.toDateString().split(" ")[0]
            format = `${dayOfWeekName}, ${timeFormat}`
        }
        else{
            let shortDate = passDate.toDateString().split(" ")
            console.log(shortDate)
            format = `${shortDate[0]}, ${shortDate[2]} ${shortDate[1]}, ${shortDate[3]} ${timeFormat}` 
        }
    return format
    }


    //Creating a websocket request object
    const chatSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/'
    + roomName
    + '/'
    );

//callback for messages
        chatSocket.onmessage = function(e){
        const json_data = JSON.parse(e.data);
        console.log("all_msg", json_data)
        var msg_div = $('#msg_div')
        switch (json_data.type){
            case "welcome_message":
                console.log("I got the message daphne")
                break;
            case "chat_message":
                var mesg = json_data.message
                var sender = mesg.sender.username
                var receiver = mesg.receiver.username
                var created = mesg.created
                var text = mesg.text_message
                console.log(mesg)
                console.log(sender, receiver, created, text)
                var friend = friendUser
                if (sender === friend)
                    {
                        const p = `<div class="d-flex justify-content-center my-2 text-dark"><span><small style="font-size:12px;">${formatMessageDate(created)}</small><span></div>
                        <div class="profile-cont p-3 mb-3 d-flex">
                        <a href="/profile/${sender}/" class="text-decoration-none text-white">
                            <div class="chat-buddy" style="width: 30px; height: 30px; border-radius: 50%;">
                                <img src="${mesg.receiver.profile_image}" alt="" style="width: 100%; height: 100%; border-radius: 50%;" class="bg-dark">
                                    </div></a>
                            <div class="ml-2 text-justify p-2" style="border-radius:10px; background-color: whitesmoke">
                            <p class="text-dark" style="font-size: 12px;">${text}</p>
                                </div>
                                    </div> 
                                        `
                                        $('#msg_div').append(p)
                                        msg_div.scrollTop(msg_div.prop("scrollHeight"))
                                        }
                else{
                        const p = `<div class="d-flex justify-content-center my-2 text-dark align-items-center"><small style="font-size:12px;">${formatMessageDate(created)}</small></div>
                                <div class="chat-wrap" style="display:flex; justify-content:flex-end;">
                                <div class="login-cont bg-success mb-3 p-2"><p class="text-white" style="font-size: 12px; color:black">${text}</p></div>
                                    </div> `
                                $('#msg_div').append(p)
                        msg_div.scrollTop(msg_div.prop("scrollHeight"))
                        break;
                    }
            case "previous_message":
                var mesg = json_data.message.reverse()
                console.log(mesg)
                //console.log(sender, receiver, created, text)
                var friend = friendUser
                //console.log(json_data.message);
                $.each(json_data.message, function(index, value)
                {
                    console.log(value.sender.username, friend)
                    if (value.sender.username === friend)
                    {
                        const p = `<div class="d-flex justify-content-center my-2 text-dark"><small style="font-size:12px;">${formatMessageDate(value.created)}</small></div>
                        <div class="profile-cont p-3 mb-3 d-flex">
                        <a href="/profile/${friend}/" class="text-decoration-none text-white">
                            <div class="chat-buddy" style="width: 30px; height: 30px; border-radius: 50%;">
                                <img src="${value.receiver.profile_image}" alt="" style="width: 100%; height: 100%; border-radius: 50%;" class="bg-dark">
                                    </div></a>
                            <div class="l-2 text-justify p-2" style="border-radius:10px; background-color: whitesmoke">
                            <p class="text-dark p-0" style="font-size: 12px;">${value.text_message}</p>
                                </div>
                                    </div> 
                                        `
                                        $('#msg_div').append(p)
                    }
                    else{
                        const p = `<div class="d-flex justify-content-center my-2 text-dark align-items-center"><small style="font-size:12px;">${formatMessageDate(value.created)}</small></div>
                                <div class="chat-wrap" style="display:flex; justify-content:flex-end;">
                                <div class=" login-cont bg-success mb-3 p-2 text-justify"><p class="text-white p-0" style="font-size: 12px; color:black">${value.text_message}</p></div>
                                        </div>`
                                $('#msg_div').append(p)
                    }
                })
                //msg_div.scrollTop(msg_div.prop("scrollHeight"))
                break;
            default:
                console.log("not what I wanted");
                break;
                                }
            msg_div.scrollTop(msg_div.prop("scrollHeight"))
        }


    //callback for websocket disconnection
    chatSocket.onclose = function(e){
    console.log("Unexpected event occurs!")
    }

    //function to handle scaling of textarea on input
    function handle(e){
        this.style.maxHeight = 80 + "px"
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + "px"
        //wrapper.scrollTop(wrapper.prop("scrollHeight"))
        //  this.parent.style.marginTop += this.parent.style.marginTop + "px"
    }
    document.querySelector('#msg').addEventListener("input", handle, true)

    document.querySelector('#sub').onclick = function(e){
    msg_in = document.querySelector('#msg')
    message = msg_in.value;
 
    //send message to backend server(consumer)
    chatSocket.send(
        JSON.stringify({'type': 'chat_message', 'message': message})
    )
    msg_in.value = ""
    document.querySelector('#msg').setAttribute("rows", "1")
    document.querySelector("#msg_div").style.paddingBottom = `70px`
    document.querySelector(".lb").style.display = "block"

}
    }
)
