const $win = $(window);

const correct = function() {
  const margin = $win.height() * .5;
  let $target = null;

  $('.section').each((_, el) => {
    const $el = $(el);

    const top = $el.offset().top;
    const height = $el.height();
    const wintop = $win.scrollTop();

    if (wintop > top - margin && wintop < top + height - margin)
      $target = $el;
  });

  if ($target && $target.is('.white')) $('body').addClass('white');
  else $('body').removeClass('white');
};

$win.scroll(correct);
$win.resize(correct);

$(document).ready(correct);
