
$(window).load(function() {

   // Page Preloader
   $('#status').fadeOut();
   $('#preloader').delay(350).fadeOut(function(){
      $('body').delay(350).css({'overflow':'visible'});
   });
});

$(document).ready(function() {



   // Toggle Left Menu
   $('.nav-parent > a').click(function() {

      var parent = $(this).parent();
      var sub = parent.find('> ul');

      // Dropdown works only when leftpanel is not collapsed
      if(!$('body').hasClass('leftpanel-collapsed')) {
         if(sub.is(':visible')) {
            sub.slideUp(200, function(){
               parent.removeClass('nav-active');
               $('.mainpanel').css({height: ''});
               adjustmainpanelheight();
            });
         } else {
            closeVisibleSubMenu();
            parent.addClass('nav-active');
            sub.slideDown(200, function(){
               adjustmainpanelheight();
            });
         }
      }
      return false;
   });

   function closeVisibleSubMenu() {
      $('.nav-parent').each(function() {
         var t = $(this);
         if(t.hasClass('nav-active')) {
            t.find('> ul').slideUp(200, function(){
               t.removeClass('nav-active');
            });
         }
      });
   }

   function adjustmainpanelheight() {
      // Adjust mainpanel height
      var docHeight = $(document).height();
      if(docHeight > $('.mainpanel').height())
         $('.mainpanel').height(docHeight);
   }


   // Tooltip
   $('.tooltips').tooltip({ container: 'body'});

   // Popover
   $('.popovers').popover();

   // Close Button in Panels
   $('.panel .panel-close').click(function(){
      $(this).closest('.panel').fadeOut(200);
      return false;
   });

   // Minimize Button in Panels
   $('.minimize').click(function(){
      var t = $(this);
      var p = t.closest('.panel');
      if(!$(this).hasClass('maximize')) {
         p.find('.panel-body, .panel-footer').slideUp(200);
         t.addClass('maximize');
         t.html('&plus;');
      } else {
         p.find('.panel-body, .panel-footer').slideDown(200);
         t.removeClass('maximize');
         t.html('&minus;');
      }
      return false;
   });


   // Add class everytime a mouse pointer hover over it
   $('.nav-bracket > li').hover(function(){
      $(this).addClass('nav-hover');
   }, function(){
      $(this).removeClass('nav-hover');
   });


   reposition_searchform();

   $(window).resize(function(){

      if($('body').css('position') == 'relative') {

         $('body').removeClass('leftpanel-collapsed chat-view');

      } else {

         $('body').removeClass('chat-relative-view');
         $('body').css({left: '', marginRight: ''});
      }

      reposition_searchform();

   });

   function reposition_searchform() {
      if($('.searchform').css('position') == 'relative') {
         $('.searchform').insertBefore('.leftpanelinner .userlogged');
      } else {
         $('.searchform').insertBefore('.header-right');
      }
   }


   // Sticky Header
   if($.cookie('sticky-header'))
      $('body').addClass('stickyheader');

   // Sticky Left Panel
   if($.cookie('sticky-leftpanel')) {
      $('body').addClass('stickyheader');
      $('.leftpanel').addClass('sticky-leftpanel');
   }

   // Left Panel Collapsed
   if($.cookie('leftpanel-collapsed')) {
      $('body').addClass('leftpanel-collapsed');
      $('.menutoggle').addClass('menu-collapsed');
   }

   // Changing Skin
   var c = $.cookie('change-skin');
   if(c) {
      $('head').append('<link id="skinswitch" rel="stylesheet" href="css/style.'+c+'.css" />');
   }

   


});
