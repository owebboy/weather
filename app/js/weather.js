// get current location

function get_location() {
  if (Modernizr.geolocation) {
    navigator.geolocation.getCurrentPosition(show_weather);
    document.querySelector('.no').style.display = 'none';
    NProgress.start();
  } else {
    document.querySelector('.no').innerHTML = 'This device is not supported, yet'
;  }
}

// do something with location

function show_weather(position) {

  // jsonp

  function jsonp(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      callback(data);
    };

    var script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
  }

  // get position

  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  // change background for different temperatures

  function changeColor(weather) {
    function oc(a) {
      var o = {};
      for(var i=0;i<a.length;i++) {
        o[a[i]]='';
      }
      return o;
    }

    if(weather in oc([15, 49, 41, 23, 43])) {
      document.querySelector('html').setAttribute('style', 'background: #FF007A; color: #fff');
    } else if (weather === 46) {
      document.querySelector('html').setAttribute('style', 'background: #FF63A2; color: #fff');
    } else if(weather in oc([13, 14, 16, 42])) {
      document.querySelector('html').setAttribute('style', 'background: #FFA6CA; color: #fff');
    } else if(weather in oc([31, 44, 33, 34])) {
      document.querySelector('html').setAttribute('style', 'background: #fff; color: #64645A');
    } else if(weather === 32) {
      document.querySelector('html').setAttribute('style', 'background: #F3E750; color: #fff');
    } else if(weather in oc([9, 11, 12])) {
      document.querySelector('html').setAttribute('style', 'background: #5FC1F3; color: #fff');
    } else if(weather in oc([40, 37, 47])) {
      document.querySelector('html').setAttribute('style', 'background: #00A9ED; color: #fff');
    } else if(weather in oc([4, 38, 39, 45])) {
      document.querySelector('html').setAttribute('style', 'background: #0083E1; color: #fff');
    } else if(weather in oc([17, 18, 10])) {
      document.querySelector('html').setAttribute('style', 'background: #555; color: #fff');
    } else if(weather in oc([35, 8, 5, 6, 7, 27, 28, 19, 20, 21, 22, 24, 26])) {
      document.querySelector('html').setAttribute('style', 'background: #999; color: #fff');
    } else if(weather in oc([29, 30, 3200])) {
      document.querySelector('html').setAttribute('style', 'background: #ccc; color: #555');
    } else if(weather in oc([0, 1, 2, 3])) {
      document.querySelector('html').setAttribute('style', 'background: #00C58A; color: #fff');
    } else if(weathe === 36) {
      document.querySelector('html').setAttribute('style', 'background: #FF2B00; color: #fff');
    } else if(weathe === 25) {
      document.querySelector('html').setAttribute('style', 'background: #00D7E5; color: #fff');
    }
  }


  function get_api() {

    // current postalcode

    jsonp('//api.geonames.org/findNearestAddressJSON?lat=' + latitude + '&lng=' + longitude + '&username=owebboy', function(data) {
      NProgress.set(0.5); 

      // return postalcode
      var zip = data.address.postalcode;

      // get yql data

      YUI().use('yql', function(Y) {

        Y.YQL('select * from weather.forecast where woeid in (SELECT woeid FROM geo.placefinder WHERE text=' + zip + ')', function(r) {
          console.log(r);
          
          NProgress.done();
          document.querySelector('.content').style.display = 'block';

          var data = r.query.results.channel

          // temperature

          document.querySelector('.temperature').innerHTML = data.item.condition.temp + '<sup>&deg;</sup>';

          // location

          document.querySelector('.location').innerHTML = data.location.city;

          // weather

          document.querySelector('.weather').innerHTML = data.item.condition.text;

          // wind

          document.querySelector('.wind').innerHTML = data.wind.speed + ' ' + data.units.speed;

          // humidity

          document.querySelector('.humidity').innerHTML = data.atmosphere.humidity + '%';

          // pressure

          document.querySelector('.pressure').innerHTML = data.atmosphere.pressure + ' ' + data.units.pressure;

          // visibility

          document.querySelector('.visibility').innerHTML = data.atmosphere.visibility;

          // sunrise/sunset

          document.querySelector('.sunrise').innerHTML = data.astronomy.sunrise;
          document.querySelector('.sunset').innerHTML = data.astronomy.sunset;

          // forecast

          function forecast(number) {

            var forecast = data.item.forecast[number];
            document.querySelector('.day-' + number).innerHTML = moment(forecast.date).format('dddd');
            document.querySelector('.high-' + number).innerHTML = forecast.high;
            document.querySelector('.low-' + number).innerHTML = forecast.low;
            if (document.querySelector('.text-' + number)) {
              document.querySelector('.text-' + number).innerHTML = forecast.text;
            }
          }

          forecast(1);
          forecast(2);
          forecast(3);
          forecast(4);
          forecast(0);

          // change color
          changeColor(data.item.condition.code);
        });

      });

    });

  }

  // get API

  get_api();

  // reload every 2 minutes

  setInterval(get_api, 120000);

}
