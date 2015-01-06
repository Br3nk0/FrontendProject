
$(window).scroll(function() {
    $('#about').each(function(){
        var imagePos = $(this).offset().top;
        var winH = $(window).height();
        var topOfWindow = $(window).scrollTop();
        if (topOfWindow > winH ) {
            console.log("nu slide about in")
            $(this).addClass("pullUp");
            $('#aboutli').addClass("active")
        }
        else {
            $(this).removeClass("pullUp");
            $('#aboutli').removeClass("active")
        }

    });
});

$(window).scroll(function() {
    $('.naam').each(function(){
        var imagePos = $(this).offset().top;
        var winH = $(window).height();
        var topOfWindow = $(window).scrollTop();
        if (topOfWindow > winH ) {
            console.log("nu slide about in")
            $(this).addClass("fadeIn");
        }
        else {
            $(this).removeClass("fadeIn");
        }

    });
});
