/*
 * pixelate.js
 * 43081j
 * Pixelate images with ease
 * License: MIT
 */
(function (window, $) {
  var pixelate = function() {
    var defaults = {
      value: 0.05,
      reveal: true,
      revealonclick: false
    };

    var options = arguments[0] || {};
    var element = this;
    var elementParent = element.parentNode;

    if (typeof options !== 'object') {
      options = { value: parseInt(arguments[0]) };
    }

    options = (function() {
      var opts = {};

      for (var k in defaults) {
        if (element.hasAttribute('data-' + k)) {
          opts[k] = element.getAttribute('data-' + k);
          continue;
        }

        if (k in options) {
          opts[k] = options[k];
          continue;
        }

        opts[k] = defaults[k];
      }
      return opts;
    })();

    var imgWidth = element.width;
    var imgHeight = element.height;
    var revealed = false;

    var canv = document.createElement('canvas');
    canv.width = imgWidth;
    canv.height = imgHeight;

    var ctx = canv.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    var width = imgWidth * options.value;
    var height = imgHeight * options.value;

    ctx.drawImage(element, 0, 0, width, height);
    ctx.drawImage(canv, 0, 0, width, height, 0, 0, canv.width, canv.height);

    element.style.display = 'none';

    elementParent.insertBefore(canv, element);

    if (options.revealonclick !== false && options.revealonclick !== 'false') {
      /*
       * Reveal on click
       */
      canv.addEventListener('click', function () {
        revealed = !revealed;

        if (revealed) {
          ctx.drawImage(element, 0, 0, imgWidth, imgHeight);
        } else {
          ctx.drawImage(element, 0, 0, width, height);
          ctx.drawImage(canv, 0, 0, width, height, 0, 0, canv.width, canv.height);
        }
      });
    }

    if (options.reveal !== false && options.reveal !== 'false') {
      /*
       * Reveal on hover
       */
      canv.addEventListener('mouseenter', function () {
        if (revealed) {
          return;
        }

        ctx.drawImage(element, 0, 0, imgWidth, imgHeight);
      });

      canv.addEventListener('mouseleave', function () {
        if (revealed) {
          return;
        }

        ctx.drawImage(element, 0, 0, width, height);
        ctx.drawImage(canv, 0, 0, width, height, 0, 0, canv.width, canv.height);
      });
    }
  };

  if (typeof $ === 'function') {
    $.fn.extend({
      pixelate: function() {
        var args = arguments;
        return this.each(function () {
          pixelate.apply(this, args);
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var img = document.querySelectorAll('img[data-pixelate]');

    for (var i = 0; i < img.length; i++) {
      img[i].addEventListener('load', function () {
        pixelate.apply(this);
      });
    }
  });
})(window, typeof jQuery === 'undefined' ? null : jQuery);
