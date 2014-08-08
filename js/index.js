$(function(){
    var stateCity = 'CO/Denver.json';
    var wUnderSat = 'http://api.wunderground.com/api/b024db5cff35b4fa/satellite/q/';
    var wUnderCond = 'http://api.wunderground.com/api/b024db5cff35b4fa/conditions/q/';
    var googURL = 'https://maps.googleapis.com/maps/api/staticmap';
    var googApiOpts = {
        center: 'Denver,CO', //city
        format: "jpg",
        key: "AIzaSyDPap0KQhzUiqFtvPD4u1uArwgL5kKT5rs",
        maptype: "roadmap",
        scale: "2",
        size: "500x250",
        zoom: "6"
    };

    getItYo();

    function getItYo() {
        var ajaxSatUrl = wUnderSat+stateCity;
        var ajaxCondUrl = wUnderCond+stateCity;

        $.ajax({
            url: ajaxSatUrl,
            dataType: 'jsonp',
            type: 'GET'
        })
            .done(function (data) {
                var wthrIMG = data.satellite.image_url_vis;
                $('.wthrImg').attr('src', wthrIMG);
            });

        $.ajax({
            url: ajaxCondUrl,
            dataType: 'jsonp',
            type: 'GET'
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
        googApiOpts.center = nameAPI($(this).attr('name'));
        $('.active:eq(0)').removeClass('active');
        $(this).addClass('active');
        stateCity = $('.active').attr('name');
        $('div.panel').fadeOut(500, function(){
            setTimeout(function(){
                setBackground();
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

    function appendObj(obj, url) {
        var strStart = "?";
        for (key in obj) {
            strStart = strStart.concat(key + '=' + obj[key] + "&");
        }
        strStart = strStart.slice(0, -1);
        return encodeURI(url.concat(strStart));
    }

    function nameAPI (str){
        var ary = str.split('/');
        var noJson = ary[1].slice(0,-5);
        console.log(noJson);
        var finalCity = noJson.replace('_','+');
        return finalCity.concat(',',ary[0]);
    }

        $('.zmPlus').click(function(){
            if(googApiOpts.zoom <17) {
                googApiOpts.zoom = parseFloat(googApiOpts.zoom)+1;
                setTimeout(function(){
                    setBackground();
                }, 50);
            }
            else return 0;
        });

        $('.zmMinus').click(function(){
            //var googURL = 'https://maps.googleapis.com/maps/api/staticmap';
            if(googApiOpts.zoom>0){
                googApiOpts.zoom = parseFloat(googApiOpts.zoom)-1;
                setTimeout(function(){
                    setBackground();
                }, 50);
            }
            else return 0;
        });

    $('.mapType').click(function(e){
        e.preventDefault();
        googApiOpts.maptype = $(this).attr('name');
        setBackground();
        console.log(googApiOpts.maptype);
    });

    function setBackground (){
        $('html').css({'background': 'url('+appendObj(googApiOpts,googURL)+') no-repeat center center fixed','background-size': 'cover','transition': '0.5s'});
    }
});