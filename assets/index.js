var $holder;

const prepare = function() {
  $holder = $('.holder');

  $('div[animated]').each((_, el) => {
    const $el = $(el);
    let index = 0;
    let animations = [];
    while (true) {
      if ($el.attr(`p${index}`)) {
        animations.push({
          pos: $el.attr(`p${index}`) * 1,
          x: $el.attr(`x${index}`) * 1,
          y: $el.attr(`y${index}`) * 1,
        });
        index += 1;
      }
      else break;
    }

    $el.data('animations', animations);
  });

  $holder.scroll(animate);
  animate();
};

const animate = function() {
  const pos = $holder.scrollTop()/$holder.height();

  $('img[backdrop]').css('transform', `rotate(${pos * 120}deg)`)

  $('div[animated]').each((_, el) => {
    const $el = $(el);
    const animations = $el.data('animations');
    const next = animations.filter(entry => entry.pos > pos);
    const prev = animations.filter(entry => entry.pos <= pos);

    let x = 0;
    let y = 0;
    if (next.length > 0 && prev.length > 0) {
      let start = prev[prev.length - 1];
      let end = next[0];

      let r = (pos - start.pos)/(end.pos - start.pos);
      x = r * (end.x - start.x) + start.x;
      y = r * (end.y - start.y) + start.y;
    }
    else if (next.length > 0) {
      let fixed = next[0];
      x = fixed.x;
      y = fixed.y;
    }
    else if (prev.length > 0) {
      let fixed = prev[prev.length - 1];
      x = fixed.x;
      y = fixed.y;
    }

    $el.css('transform', `translateX(${x}vw) translateY(${y}vh)`);
  })
};

$(window).resize(animate);
$(document).ready(prepare);
