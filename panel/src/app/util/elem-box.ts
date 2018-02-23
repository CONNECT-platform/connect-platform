function getOffsetSum(elem) {
    var top = 0,
        left = 0,
        bottom = 0,
        right = 0

     var width = elem.offsetWidth;
     var height = elem.offsetHeight;

    while (elem) {
        top += elem.offsetTop;
        left += elem.offsetLeft;
        elem = elem.offsetParent;
    }

     right = left + width;
     bottom = top + height;

    return {
        top: top,
        left: left,
        bottom: bottom,
        right: right,
    }
}

function getOffsetRect(elem) {
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docElem = document.documentElement;

    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

    var clientTop = docElem.clientTop;
    var clientLeft = docElem.clientLeft;


    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    var bottom = top + (box.bottom - box.top);
    var right = left + (box.right - box.left);

    return {
        top: top,
        left: left,
        bottom: bottom,
        right: right,
    }
}

export function elementBox(elem) {
    if (elem) {
        if (elem.getBoundingClientRect) {
            return getOffsetRect(elem);
        } else { // old browser
            return getOffsetSum(elem);
        }
    } else
        return null;
}
