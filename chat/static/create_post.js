$(document).ready(
    function() {
        console.log("yeah loaded")
        $('.sub1').on('click',function() {
            console.log('was clicked')
            $('.sub2').click()
        })
        const inp = document.querySelector('.file_in');
            console.log(inp)
            console.log( $('.sub2'))
            const cont = $('#show')
            console.log(cont)
            const inp_j = $(inp)

            function addImage(){
                const inp_file = inp.files
                for (const file of inp_file){
                    let file_name = file.name
                    const img_url = URL.createObjectURL(file)
                    const app = `<div class="d-flex flex-column 
                                    justify-content-center align-items-center table-light  pt-2 px-2 " style="width: 270px; border-radius:5px;">
                                    <img src=${img_url} alt="" width="100%" height="90%" class="bg-dark">
                                    <p class="px-3">${file_name.slice(0, 10)}</p>
                                </div>`
                cont.append(app)
                    console.log(file_name)
                }
            }
        
            inp_j.on("change", addImage)
    }
)