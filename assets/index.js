var $holder;

const prepare = function() {
  $holder = $('.holder');

  $('[animated]').each((_, el) => {
    const $el = $(el);
    let index = 0;
    let animation = {
      keys: [],
      frames: [],
    };

    let lastValues = {};

    if ($el.attr('x0')) lastValues.x = $el.attr('x0') * 1;
    if ($el.attr('y0')) lastValues.y = $el.attr('y0') * 1;
    if ($el.attr('r0')) lastValues.r = $el.attr('r0') * 1;
    if ($el.attr('o0')) lastValues.o = $el.attr('o0') * 1;
    if ($el.attr('do0')) lastValues.do = $el.attr('do0') * 1;

    animation.keys = Object.keys(lastValues);

    while (true) {
      if ($el.attr(`p${index}`)) {
        let frame = {
          pos: $el.attr(`p${index}`) * 1
        };

        for (let key of animation.keys) {
          if ($el.attr(`${key}${index}`)) {
            frame[key] = $el.attr(`${key}${index}`) * 1;
            lastValues[key] = frame[key];
          }
          else {
            frame[key] = lastValues[key];
          }
        }

        animation.frames.push(frame);
        index += 1;
      }
      else break;
    }

    $el.data('animation', animation);
  });

  //$holder.scroll(() => setTimeout(animate, 10));
  $holder.scroll(animate);
  animate();
};

animateLock = false;
animateRequested = false;

const animate = function() {
  if (animateLock) {
    animateRequested = true;
    return;
  }
  animateLock = true;
  setTimeout(() => {
    animateLock = false;
    if (animateRequested) {
      animateRequested = false;
      animate();
    }
  }, 1);

  const pos = $holder.scrollTop()/$holder.height();

  $('[animated]').each((_, el) => {
    const $el = $(el);
    const animation = $el.data('animation');
    const next = animation.frames.filter(entry => entry.pos > pos);
    const prev = animation.frames.filter(entry => entry.pos <= pos);

    let values = {};

    if (next.length > 0 && prev.length > 0) {
      let start = prev[prev.length - 1];
      let end = next[0];

      let a = (pos - start.pos)/(end.pos - start.pos);

      for (let key of animation.keys)
        values[key] = a * (end[key] - start[key]) + start[key];
    }
    else if (next.length > 0) {
      values = next[0];
    }
    else if (prev.length > 0) {
      values = prev[prev.length - 1];
    }

    let animateX = animation.keys.includes('x');
    let animateY = animation.keys.includes('y');
    let animateR = animation.keys.includes('r');
    let animateO = animation.keys.includes('o');
    let animateDO = animation.keys.includes('do');

    if (animateX || animateY || animateR) {
      let transformString = '';
      if (animateX) transformString += ` translateX(${values.x}vw)`;
      if (animateY) transformString += ` translateY(${values.y}vh)`;
      if (animateR) transformString += ` rotate(${values.r}deg)`;

      $el.css('transform', transformString);
    }

    if (animateO) {
      $el.css('opacity', values.o);
    }

    if (animateDO) {
      $el.css('stroke-dashoffset', `${values.do}px`);
    }
  })
};

$(window).resize(animate);
$(document).ready(prepare);

$(document).ready(() => {
  let is_opera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
  let is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  let is_chrome = !!window.chrome && !is_opera;

  if (is_safari) $('body').addClass('safari');
  else $('body').addClass('not-safari');

  if (is_chrome) $('body').addClass('chrome');
  else $('body').addClass('not-chrome');
})
