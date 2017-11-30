var $ = require("jquery");
global.jQuery = $;
require('slick');

$(document).ready(function(){
  $(".homepage-slider").slick({
    mobileFirst: true,
    slidesToShow: 1,
    dots: true,
    infinite: true,
    centerMode: true,
    centerPadding: '0px',
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          centerPadding: '100px'
        }
      }
    ]
  });
});
