/**
 * Created by BrenkoD on 3/12/2014.
 */
var divs = $('div')
    , ul = $('ul')
    , ul_height = ul.outerHeight();


$(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();

    divs.each(function() {
        var top = $(this).offset().top - ul_height,
            bottom = top + $(this).outerHeight();

        if (cur_pos >= top && cur_pos <= bottom) {
            ul.find('a').removeClass('active');
            divs.removeClass('active');

            $(this).addClass('active');
            ul.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
        }
    });
});
(function(){
    var info = document.getElementsByClassName("info");
    var Info = document.getElementsByClassName('info')[0];
    var element = document.getElementsByTagName('p')[0];
    var j = info.length;
    for(var i= 0;i<j;i++){
        info[i].addEventListener("mouseover", function(){
            element.className="tekstShow"
        });
        info[i].addEventListener("mouseout", function(){
            element.style.display='none'
        });
    }
})();