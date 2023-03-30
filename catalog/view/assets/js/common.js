$(document).ready(function(){
    wow = new WOW(
		{
			boxClass:     'wow',      
			animateClass: 'animated', 
			offset:       0,          
			mobile:       true,       
			live:         true        
		}
	)
    wow.init();
    if($(window).width()<1200){
      $('.navbar-nav .has_submenu>a').on('click', function(e) {
          e.preventDefault();
          $(this).toggleClass('opened');
          $(this).next().slideToggle();
      });
    }
    if($(window).width()<768){
        $('.toggleopen').on('click', function(e) {
            e.preventDefault();
            $(this).toggleClass('opened');
            $(this).next().slideToggle();
        });
    }else{
        var topbottomh = $('.headerwrap').height() + $('.footer').height();
        $('.pagecont').css('min-height','calc(100vh - '+ topbottomh +'px)');
    }
    $('.searchtoggle>a,.searchwrap .close').on('click',function(){
       $('.searchwrap').toggleClass('open'); 
    });
    $('.mainslider').slick({
        dots: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        fade:true,
        adaptiveHeight: true
    });
    $('.relatedslider').slick({
        dots: false,
        arrows: true,
        infinite: false,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true
    });
  
    var num = $('.timelineslider>div').length -1;
    
    $('.timelineslider').slick({
        dots: true,
        customPaging: function(slider, i) {
          return '<button type="button"><span>' + $(slider.$slides[i]).find('[data-time]').data('time') + '</span></button>';
        },
        arrows: true,
        infinite: false,
        speed: 300,
        initialSlide: num,
        slidesToShow: 1,
        adaptiveHeight: true
    });
    
      var album = $('.gallery');
      var pager = $('.thumbs');
      var picPopup = $('.popup');

      album.slick({
        mobileFirst: true,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        arrows: false,
        draggable: false,
        swipe: false,
        cssEase: 'cubic-bezier(0,.4,.4,1)',
        asNavFor: pager
      });

      pager.slick({
        mobileFirst: true,
        dots: false,
        arrows: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        focusOnSelect: true,
        asNavFor: album,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 5,
            }
          }
        ]
      });

      picPopup.magnificPopup({
        type: 'image',
        tLoading: 'Loading image',
        gallery: {
          enabled: true,
          navigateByImgClick: true,
          preload: [0,1] // Will preload 0 - before current, and 1 after the current image
        }
      });
    var menuh = $('header').height();
    $(window).on('scroll',function(){
        if ($(window).scrollTop() > menuh) {
            $('.headerwrap').addClass('fixed');
            $('.headerwrap').css('padding-top',menuh);
        }else{
            $('.headerwrap').removeClass('fixed');
            $('.headerwrap').css('padding-top',0);
        }
        if ($(window).scrollTop() > 300) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });
    $('.scrollToTop').on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
});
