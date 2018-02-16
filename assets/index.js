scrollToSection = function($section) {
  $('body,html').animate({ scrollTop: $section.offset().top }, 500);
};

var initialize = function() {
  $('.sticky-contacts .sticky-contact').each(function(_, el) {
    $(el).attr('orig-x', $(el).offset().left);
    $(el).attr('orig-y', $(el).offset().top);
  });
}

var justCorrected = false;
var correct = function() {
  if (justCorrected) { setTimeout(correct, 800); return; }
  justCorrected = true;
  setTimeout(function(){justCorrected = false;}, 10);

  var $win = $(window);
  if ($win.width() < 768) return;
  var total = $('.sticky-contacts .sticky-contact').length;
  var $anchor = $('.sticky-contacts .anchor');
  $('.sticky-contacts .sticky-contact').each(function(index, el) {
    var $el = $(el);

    if ($win.scrollTop() < $(document).height() - $win.height() * 1.5) {
      $el.css("transition", "all .3s, transform .1s linear");
      $el.css("-webkit-transition", "all .3s, transform .1s linear");
    }

    if ($win.scrollTop() >= $(document).height() - $win.height() * 1.1) {
      $el.css("transition", "all .3s, transform .3s linear");
      $el.css("-webkit-transition", "all .3s, transform .3s linear");
    }

    if ($win.scrollTop() >= $(document).height() - $win.height() - 16) {
      setTimeout(function() {
        if ($win.scrollTop() >= $(document).height() - $win.height() - 16) {
          $el.css("transform", "translate(0, 0)");
          $el.css("-webkit-transform", "translate(0, 0)");
        }
      }, (total-index)/total*300);
    }
    else {
      var targety = $win.scrollTop() + $win.height()/2 - (19 * 3) * ((total - index) - total/2);
      var actualy = parseFloat($el.attr('orig-y'));
      var dy = targety - actualy;

      var targetx = $win.width() - 2 * 38;
      var actualx = parseFloat($el.attr('orig-x'));
      var dx = targetx - actualx;

      $el.css("transform", "translateY(" + dy + "px) translateX("+ dx +"px)");
      $el.css("-webkit-transform", "translateY(" + dy + "px) translateX("+ dx +"px)");
    }
  })
};
$(window).scroll(correct);
$(window).resize(correct);
$(document).ready(function(){
  initialize();
  setTimeout(correct, 10);
});
