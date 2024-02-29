$(document).ready(
    function(){
        const allforms = $('form');
	const profile_pic = document.querySelector('#prp')
	const cover_pic = document.querySelector('#cp')
	const prp_select = $('#prp-select')
	const cp_select = $('#cp-select')
	console.log(profile_pic, cover_pic)
	$(profile_pic).on('change', function(){
		let prp = this
		console.log(prp.files[0].name)
	        $(prp_select).html(prp.files[0].name.slice(0,10))})
	$(cover_pic).on('change', function(){
		let cp = this
		console.log(cp.files[0].name)
		console.log($('#cp-select'))
	        $(cp_select).html(cp.files[0].name.slice(0,10))})
        console.log(allforms.length)
        allforms.each(function(index, elem){
            $(elem).submit(function(ev){
                console.log("begin")
                ev.preventDefault();
                var formD = new FormData(this)
		var target = $(this)
		console.log(target)
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
		    beforeSend: function(){
			    $(elem).find('button').html('updating...')
		    },
                    success: function(response){
                        var fdbck = $(elem).attr('form-id')
                        console.log(fdbck)
                        const data = response.data
                        switch (fdbck){
                            case "profile_pic":
                                $('#profile_pic').attr('src', `${data.profile_image}`)
				$(prp_select).hide()
				target.find('button').html('Save Photo')
				break;
                            case "cover_pic":
                                $('#cover_pic').attr('src', `${data.cover_image}`)
				$(cp_select).hide()
				target.find('button').html('Save Photo')
                                break;
                            case "name":
                                $('#fn').attr('value', `${data.first_name}`)
                                $('#ln').attr('value', `${data.last_name}`)
				target.find('button').html('Save')
                                break;
                            case "quote":
                                $('#fn').html(`${data.favorite_quote}`)
				target.find('button').html('Save')
				break;
                            case 'dob':
                                $('#dob').attr('value', `${data.dob}`)
				target.find('button').html('Save')
				break;
                            case "location":
                                $('#loc').attr('value', `${data.location}`)
				target.find('button').html('Save')
				break;
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
