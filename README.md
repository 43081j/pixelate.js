pixelate.js
===

**pixelate.js** is a simple library and jQuery plugin to pixelate any set of images and optionally reveal them on hover.

[Demo here](http://43081j.github.io/pixelate/)

Usage
===

**pixelate.js** can be used with or without jQuery.

```javascript
// Following two lines are near identical
$('img').pixelate();
document.querySelector('img').pixelate();
```

Or via HTML data attributes:

```html
<img src="test.jpg" width="200" height="200" data-pixelate>
```

Options
===

* `value` The percentage of pixelation to perform, a value between `0` and `1`
* `reveal` Reveal the image on hover and remain revealed if clicked
* `revealonclick` Reveal the image on click. When combined with `reveal`, it will remain revealed after being clicked.

These options may be specified by data tags, like so:

```html
<img src="img.jpg" data-pixelate data-value="0.5" data-reveal="false">
```

or by jQuery/JavaScript:

```javascript
$('img#myimage').pixelate({ value: 0.5, reveal: false });
```

License
===

MIT
