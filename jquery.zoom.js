/*!
	Zoom 1.7.13
	license: MIT
	http://www.jacklmoore.com/zoom
*/
(function ($) {
	// Core Zoom Logic, independent of event listeners.
	$.zoom = function(target, source, img) {
		var targetHeight,
			targetWidth,
			sourceHeight,
			sourceWidth,
			xRatio,
			yRatio,
			offset,
			position = $("#productZoom").css('position'),
			$source = $(source);

		$("#productZoom").css('position', /(absolute|fixed)/.test(position) ? position : 'relative');
		$("#productZoom").css('overflow', 'hidden');

		$('img[product-zoom]').css('width', '');
		$('img[product-zoom]').css('height', '');

		$(img)
			.addClass('zoomImg')
			.css({
				width: $(img).width,
				height: $(img).height,
			})
			.appendTo($("#productZoom"));

		return {
			init: function() {
				targetWidth = $("#productZoom").outerWidth();
				targetHeight = $("#productZoom").outerHeight();

				if (source === target) {
					sourceWidth = targetWidth;
					sourceHeight = targetHeight;
				} else {
					sourceWidth = $source.outerWidth();
					sourceHeight = $source.outerHeight();
				}

				xRatio = (img.width - targetWidth) / sourceWidth;
				yRatio = (img.height - targetHeight) / sourceHeight;

				offset = $source.offset();
			},
			move: function (e) {
				var left = (e.pageX - offset.left),
						top = (e.pageY - offset.top);
				top = Math.max(Math.min(top, sourceHeight), 0);
				left = Math.max(Math.min(left, sourceWidth), 0);
				img.style.left = (left * -xRatio) + 'px';
				img.style.top = (top * -yRatio) + 'px';
			}
		};
	};

	$.fn.zoom = function () {
		return this.each(function () {
			var
			//target will display the zoomed image
			target = $("#productZoom"),
			//source will provide zoom location info (thumbnail)
			source = this,
			$source = $("#productZoom"),
			img = document.createElement('img'),
			$img = $(img),
			mousemove = 'mousemove.zoom',
			clicked = false,
			$urlElement;

			img.onload = function () {
				var zoom = $.zoom(target, source, img, 1);

				function start(e) {
					zoom.init();
					zoom.move(e);
					// Skip the fade-in for IE8
					$img.stop()
					.fadeTo($.support.opacity ? 120 : 0, 1);
				}
				function stop() {
					$img.stop()
					.fadeTo(120, 0, false);
				}
				// Mouse events
				$source.on('click.zoom',
					function (e) {
						if (clicked) {
							// bubble the event up to the document to trigger the unbind.
							return;
						} else {
							clicked = true;
							start(e);
							$(document).on(mousemove, zoom.move);
							$(document).one('click.zoom',
								function () {
									stop();
									clicked = false;
									$(document).off(mousemove, zoom.move);
								}
							);
							return false;
						}
					}
				);
			};

			img.src = $('img[product-zoom]').attr('product-zoom');
		});
	};
}(window.jQuery));