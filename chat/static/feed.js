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
            }
            )