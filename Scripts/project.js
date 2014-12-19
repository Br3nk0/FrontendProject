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
            ul.find('a[ng-click="gotoAnchor'+$(this).attr('id')+'"]').addClass('active');
        }
    });
});
