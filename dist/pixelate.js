/*
 * pixelate.js
 * 43081j
 * Pixelate images with ease
 * v0.5
 * License: MIT
 */
(function(window, $) {
	var pixelate = function(args) {
        // Parameters
		var defaults = {
			value: 0.05, // pixelation "density" (1 = no pixelation, 0 = all pixelated into 1 pixel)
			reveal: true, // reveal on hover
			revealonclick: false // reveal on click
		};
        // Get the current object (img)
		var element = this, //arguments[0],
			elementParent = element.parentNode;
        // Input arguments
        var input_options = args || {};
		if(typeof input_options !== 'object') {
			input_options = { value: parseInt(arguments[1]) };
		}
        // Function/object that will merge and store all options (priority to html attributes, then to user-specified arguments, then to defaults
		options = (function() {
			var opts = {};
			for(var k in defaults) {
                // HTML attribute
				if(element.hasAttribute('data-' + k)) {
					opts[k] = element.getAttribute('data-' + k);
                // User-specified argument
				} else if (k in input_options) {
					opts[k] = input_options[k];
                // Defaults (fallback if there is nothing else)
				} else {
                    opts[k] = defaults[k];
                }
			}
			return opts;
		})();
        // Get image size
		var display = element.style.display,
			imgWidth = element.width,
			imgHeight = element.height,
			revealed = false;
        // Create two canvas (one temporary to downscale, and one final to upscale)
		var canvtmp = document.createElement('canvas'); // temporary downscaling canvas
		canvtmp.width = imgWidth;
		canvtmp.height = imgHeight;
        var canvpix = document.createElement('canvas'); // final upscaling canvas
		canvpix.width = imgWidth;
		canvpix.height = imgHeight;
		var contexttmp = canvtmp.getContext('2d');
		contexttmp.mozImageSmoothingEnabled = false;
		contexttmp.webkitImageSmoothingEnabled = false;
		contexttmp.imageSmoothingEnabled = false;
        var contextpix = canvpix.getContext('2d');
		contextpix.mozImageSmoothingEnabled = false;
		contextpix.webkitImageSmoothingEnabled = false;
		contextpix.imageSmoothingEnabled = false;
        // Compute the downsampling width and height
		var width = imgWidth * options.value,
			height = imgHeight * options.value;
        // Downsampling (reduce image size, to create the pixels)
        contextpix.clearRect(0, 0, canvpix.width, canvpix.height); // clear temporary canvas to avoid overlapping multiple times the same downsampled image, blurrying the contours
		contexttmp.drawImage(element, 0, 0, width, height);
        // Upsample back to original size (using another canvas to avoid issues with transparent images, which will leave the temporary canvas as a small icon in the upper left corner)
        contextpix.clearRect(0, 0, canvpix.width, canvpix.height); // clear the canvas to avoid overlapping multiple times same image (particularly when using reveal option)
		contextpix.drawImage(canvtmp, 0, 0, width, height, 0, 0, canvpix.width, canvpix.height);
        // Reinsert image back in place (we hide the old and place a new one instead)
		element.style.display = 'none';
		elementParent.insertBefore(canvpix, element);
        // Manage user interaction: reveal on hover or on click
		if(options.revealonclick !== false && options.revealonclick !== 'false') {
			/*
			 * Reveal on click
			 */
			canvpix.addEventListener('click', function(e) {
				revealed = !revealed;
				if(revealed) {
                    // On reveal, show the original image
                    contextpix.clearRect(0, 0, canvpix.width, canvpix.height); // clear
					contextpix.drawImage(element, 0, 0, imgWidth, imgHeight);
				} else {
                    // On unreveal, recompute the pixelation
                    contexttmp.clearRect(0, 0, canvpix.width, canvpix.height); // clear
                    contexttmp.drawImage(element, 0, 0, width, height); // downsample using temporary canvas
                    contextpix.clearRect(0, 0, canvpix.width, canvpix.height); // clear
                    contextpix.drawImage(canvtmp, 0, 0, width, height, 0, 0, canvpix.width, canvpix.height); // upsample
				}
			});
		}
		if(options.reveal !== false && options.reveal !== 'false') {
			/*
			 * Reveal on hover
			 */
			canvpix.addEventListener('mouseenter', function(e) {
				if(revealed) return;
                // On reveal, show the original image
                contextpix.clearRect(0, 0, canvpix.width, canvpix.height); // clear
				contextpix.drawImage(element, 0, 0, imgWidth, imgHeight);
			});
			canvpix.addEventListener('mouseleave', function(e) {
				if(revealed) return;
                // On unreveal, recompute the pixelation
                contexttmp.clearRect(0, 0, canvpix.width, canvpix.height); // clear
                contexttmp.drawImage(element, 0, 0, width, height); // downsample using temporary canvas
                contextpix.clearRect(0, 0, canvpix.width, canvpix.height); // clear
                contextpix.drawImage(canvtmp, 0, 0, width, height, 0, 0, canvpix.width, canvpix.height); // upsample
			});
		}
	};
    // Add prototype function to all objects (so that we can call img.pixelate())
	window.HTMLImageElement.prototype.pixelate = pixelate;
	if(typeof $ === 'function') {
		$.fn.extend({
			pixelate: function() {
				return this.each(function() {
					pixelate.apply(this, arguments);
				});
			}
		});
	}
    // Add HTML attribute callback
	document.addEventListener('DOMContentLoaded', function(e) {
		var img = document.querySelectorAll('img[data-pixelate]');
		for(var i = 0; i < img.length; i++) {
			img[i].addEventListener('load', function() {
				this.pixelate();
			});
		};
	});
})(window, typeof jQuery === 'undefined' ? null : jQuery);
