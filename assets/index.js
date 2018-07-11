const $win = $(window);

let jc = false;
const correct = function() {
  if (jc) return;
  jc = true;
  setTimeout(() => jc=false, 200);

  const margin_default = $win.height() * .5;
  let $target = null;

  $('.section').each((_, el) => {
    const $el = $(el);

    const top = $el.offset().top;
    const height = $el.height();
    const wintop = $win.scrollTop();
    const winheight = $win.height();

    let margin = margin_default;

    if ($el.attr('switch-margin')) {
      let factor = $el.attr('switch-margin');
      margin = $win.height() * factor;
    }

    if (wintop > top - margin) {
      $target = $el;
    }

    if (wintop > top) $el.addClass('active');
    else $el.removeClass('active');

    if (wintop > top + height || wintop + winheight < top) $el.removeClass('in');
    else $el.addClass('in');
  });

  if ($target && $target.is('.white')) $('body').addClass('white');
  else $('body').removeClass('white');
};

$win.scroll(correct);
$win.resize(correct);

$(document).ready(correct);
