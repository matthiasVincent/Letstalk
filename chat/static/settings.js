$(document).ready(
    function(){
        const allforms = $('form');
        console.log(allforms.length)
        allforms.each(function(index, elem){
            console.log(elem)
            $(elem).find('<input type="file"/>').on('change', function(){
                console.log(this.value)
            })
            $(elem).submit(function(ev){
                console.log("begin")
                ev.preventDefault();
                var formD = new FormData(this)
                for (const [k,v] of formD){
                    console.log(k,v)
                }
                $('#fn').html('')
                $.ajax({
                    url: $(elem).attr('action'),
                    type: "POST",
                    data: formD,
                    contentType: false,
                    processData: false,
                    success: function(response){
                        var fdbck = $(elem).attr('form-id')
                        console.log(fdbck)
                        const data = response.data
                        switch (fdbck){
                            case "profile_pic":
                                $('#profile_pic').attr('src', `${data.profile_image}`)
                            case "cover_pic":
                                $('#cover_pic').attr('src', `${data.cover_image}`)
                            case "name":
                                $('#fn').attr('value', `${data.first_name}`)
                                $('#ln').attr('value', `${data.last_name}`)
                            case "quote":
                                $('#fn').html(`${data.favorite_quote}`)
                            case 'dob':
                                $('#dob').attr('value', `${data.dob}`)
                            case "location":
                                $('#loc').attr('value', `${data.location}`)
                        }
                    },
                    error: function(data){
                        console.log("something went wrong")
                    }
                })
            })
        })
    }
)