var $ = require("jquery");
global.jQuery = $;
require('slick');
require('smooth-scroll');

$(document).ready(function(){
  $(".js-nav-toggler").click(function(e){
    e.preventDefault;
    $(".canvas__overlay").show();
  });
  $(".js-nav-close").click(function(e){
    e.preventDefault;
    $(".canvas__overlay").hide();
  });
  $(".js-products-toggler").click(function(e){
    e.preventDefault;
    $(this).toggleClass('is-subnav-visible')
  });

  $(".single-slider").slick({
    mobileFirst: true,
    slidesToShow: 1,
    dots: true,
    infinite: true,
    centerMode: true,
    centerPadding: '0',
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
