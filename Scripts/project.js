/**
 * Created by BrenkoD on 3/12/2014.
 */
$(document).ready(function () {
    $(document).on("scroll", onScroll);

    //smoothscroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");

        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = this.hash,
            menu = target;
        $target = $(target);
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top+2
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
});
var scrollPos = $(document).scrollTop(),
    showPacman = document.getElementById("myCanvas"),
    script = document.createElement('script'),
    toonKaart = document.getElementById("locatie"),
    printen = document.getElementById("printen"),
    blad = document.getElementsByClassName("blad"),
    tekst = document.getElementById("tekst"),
    bold = document.getElementById("bold"),
    italic= document.getElementById("italic"),
    line = document.getElementById("line"),
    verwerker = document.getElementById("verwerker"),
    print = document.getElementById("print");

function onScroll(event){

    $('#jaartallen a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#jaartallen li a').removeClass("active");
            currLink.addClass("active");
        }
        else{
            currLink.removeClass("active");
        }
    });
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("image", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("image");
    ev.target.appendChild(document.getElementById(data));
    showPacman.style.display="block";
    window.location.hash = '#myCanvas';
}
bold.addEventListener("click",function(){
    verwerker.className="bold";
})
italic.addEventListener("click",function(){
    verwerker.className="italic";
})
line.addEventListener("click",function(){
    verwerker.className="line";
})
toonKaart.addEventListener("click",function(){
    script.setAttribute('src', 'Scripts/googlemaps.js');
    document.body.appendChild(script);
})
printen.addEventListener("click",function(){
    blad[0].className="bladGeprint";
    print.id="printGeprint";
    document.getElementsByClassName("bladGeprint")[0].innerHTML= tekst.value;
})