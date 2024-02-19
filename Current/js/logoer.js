


handDrawnLogoVariationOnHover("insta_1", "insta_2", "instagram_button_logo")
handDrawnLogoVariationOnHover("twitter_1", "twitter_2", "twitter_button_logo")


function handDrawnLogoVariationOnHover(logo1_id, logo2_id, container){
    const logo1 = document.getElementById(logo1_id)
    const logo2 = document.getElementById(logo2_id)
    const socialsDiv = document.getElementById(container)
    logo1.style.display = "none"

    socialsDiv.addEventListener("mouseenter", function(){swap(logo2, logo1)})
    socialsDiv.addEventListener("focusin", function(){swap(logo2, logo1)})
    
    
    socialsDiv.addEventListener("mouseleave", function(){swap(logo1, logo2)})
    socialsDiv.addEventListener("focusout", function(){swap(logo1, logo2)})
}

function swap(display, hide){
    display.style.display = 'block'
    hide.style.display = 'none'
}

