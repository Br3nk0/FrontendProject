
$(window).scroll(function() {
    $('#about').each(function(){
        var imagePos = $(this).offset().top;
        var winH = $(window).height();
        var topOfWindow = $(window).scrollTop();
        if (topOfWindow > winH ) {
            console.log("nu slide about in")
            $(this).addClass("pullUp");
        }
        else {
            $(this).removeClass("pullUp");
        }

    });
});

