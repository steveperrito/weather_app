$(function(){

    getItYo();

    function getItYo() {
        var stateCity = $('.active').attr('name');
        var ajaxSatUrl = 'http://api.wunderground.com/api/b024db5cff35b4fa/satellite/q/'+stateCity;
        var ajaxCondUrl = 'http://api.wunderground.com/api/b024db5cff35b4fa/conditions/q/'+stateCity;

        $.ajax({
            url: ajaxSatUrl,
            dataType: 'jsonp'
        })
            .done(function (data) {
                var wthrIMG = data.satellite.image_url_vis;
                $('.wthrImg').attr('src', wthrIMG);
            });

        $.ajax({
            url: ajaxCondUrl,
            dataType: 'jsonp'
        })
            .done(function (data) {
                var wthrStr = data.current_observation.weather + ', ';
                var currentTemp = data.current_observation.temperature_string;
                var theCity = data.current_observation.display_location.full;

                $('.cityTitle').text(theCity);
                $('.wthrStr').text(wthrStr);
                $('.currentTemp').text(currentTemp);
            })
    }

    $('.cityOption').click(function(){
        $('.active:eq(0)').removeClass('active');
        $(this).addClass('active');
        var cityBG = $(this).attr('data-bg');
        $('div.panel').fadeOut(500, function(){
            setTimeout(function(){
                $('html').css({'background': 'url('+cityBG +') no-repeat center center fixed',
                    'background-size': 'cover',
                    'transition': '0.5s'});
            }, 500);
            setTimeout(function(){
                $('.progress').toggle(progressBar());
            }, 500);
            $('.cityTitle').text('');
            $('.wthrStr').text('');
            $('.currentTemp').text('');
            getItYo();
            $(this).delay(2000).fadeIn(500);
        });

    });

    function progressBar() {
        var duration = 2000;
        var animationI = duration/100;
        var progBar = $('.progress .progress-bar');
        progBar.progressbar({
            refresh_speed: animationI
            ,done: function(){
            $('.progress').toggle(function(){
                $('.progress .progress-bar').removeAttr('aria-valuenow');
                $('.progress .progress-bar').removeAttr('style');
            });
        }});
    }
});