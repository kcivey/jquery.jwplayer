/*! jquery.swfobject.license.txt *//*

jQuery SWFObject Plugin v1.0.6 <http://jquery.thewikies.com/swfobject/>
Copyright (c) 2009 Jonathan Neal
This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
This software is released under the GPL License <http://www.opensource.org/licenses/gpl-2.0.php>

SWFObject v2.2 <http://code.google.com/p/swfobject/>
Copyright (c) 2007-2009 Geoff Stearns, Michael Williams, and Bobby van der Sluis
This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>

jQuery v1.3.2 <http://jquery.com/>
Copyright (c) 2009 John Resig
This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
This software is released under the GPL License <http://www.opensource.org/licenses/gpl-2.0.php>

*/

(function($) {
	var doc = document,
	extend = 'extend',
	fn = function() {},
	join = 'join',
	object = 'object',
	verticalAlign = 'style="vertical-align:bottom;',
	x = '';

	/* $.flashPlayerVersion */
	$.flashPlayerVersion = (function() {
		var flashVersion,
		activeX,
		errorA,
		errorB,
		fp6Crash = false,
		shockwaveFlash = 'ShockwaveFlash.ShockwaveFlash';

		/* If Internet Explorer */
		if (!(flashVersion = navigator.plugins['Shockwave Flash'])) {
			try {
				activeX = new ActiveXObject(shockwaveFlash + '.7');
			}
			catch (errorA) {
				try {
					activeX = new ActiveXObject(shockwaveFlash + '.6');
					flashVersion = [6, 0, 21];
					activeX.AllowScriptAccess = 'always';
				}
				catch (errorB) {
					if (flashVersion && flashVersion[0] == 6) {
						fp6Crash = true;
					}
				}
				if (!fp6Crash) {
					try {
						activeX = new ActiveXObject(shockwaveFlash);
					}
					catch (errorC) {
						flashVersion = 'X 0,0,0';
					}
				}
			}
			if (!fp6Crash && activeX) {
				try {
					/* Will crash fp6.0.21/23/29 */
					flashVersion = activeX.GetVariable('$version');
				} catch (errorD) {}
			}
		}

		/* If NOT Internet Explorer */
		else {
			flashVersion = flashVersion.description;
		}

		/* Return flash version */
		flashVersion = flashVersion.match(/^[A-Za-z\s]*?(\d+)(\.|,)(\d+)(\s+r|,)(\d+)/);
		return [flashVersion[1] * 1, flashVersion[3] * 1, flashVersion[5] * 1];
	}());

	/* $.flashExpressInstaller */
	$.flashExpressInstaller = 'expressInstall.swf';

	/* $.hasFlashPlayer */
	$.hasFlashPlayer = ($.flashPlayerVersion[0] != 0);

	/* $.hasFlashPlayerVersion */
	$.hasFlashPlayerVersion = function(options) {
		var flashVersion = $.flashPlayerVersion;
		options = (/string|number/.test(typeof options)) ? options.toString().split('.') : options;
		options = [options.major || options[0] || flashVersion[0], options.minor || options[1] || flashVersion[1], options.release || options[2] || flashVersion[2]];

		/* Return true or false */
		return ($.hasFlashPlayer && (options[0] < flashVersion[0] || (options[0] == flashVersion[0] && (options[1] < flashVersion[1] || (options[1] == flashVersion[1] && options[2] <= flashVersion[2])))));
	};

	/* $.flash */
	$.flash = function(options) {
		/* Check if Flash is installed, return false if it isn't */
		if (!$.hasFlashPlayer) {
			return false;
		}

		var movieFilename = options.swf || x,
		paramAttributes = options.params || {},
		buildDOM = doc.createElement('body'),
		aArr,
		bArr,
		cArr,
		dArr,
		a,
		b;

		/* Set the default height and width if not already set */
		options.height = options.height || 180;
		options.width = options.width || 320;

		/* Inject ExpressInstall if "hasVersion" is requested and the version requirement is not met */
		if (options.hasVersion && !$.hasFlashPlayerVersion(options.hasVersion)) {
			$[extend](options, {
				id: 'SWFObjectExprInst',
				height: Math.max(options.height, 137),
				width: Math.max(options.width, 214)
			});
			movieFilename = options.expressInstaller || $.flashExpressInstaller;
			paramAttributes = {
				flashvars: {
					MMredirectURL: location.href,
					MMplayerType: ($.browser.msie && $.browser.win) ? 'ActiveX': 'PlugIn',
					MMdoctitle: doc.title.slice(0, 47) + ' - Flash Player Installation'
				}
			};
		}

		/* Append as a param if specified separately */
		if (typeof paramAttributes == object) {
			/* flashvars */
			if (options.flashvars) {
				paramAttributes.flashvars = options.flashvars;
			}

			/* wmode */
			if (options.wmode) {
				paramAttributes.wmode = options.wmode;
			}
		}

		/* Delete the reformatted constructors */
		for (a in (b = ['expressInstall', 'flashvars', 'hasVersion', 'params', 'swf', 'wmode'])) {
			delete options[b[a]];
		}

		/* Create the OBJECT tag attributes */
		aArr = [];
		for (a in options) {
			if (typeof options[a] == object) {
				bArr = [];
				for (b in options[a]) {
					bArr.push(b.replace(/([A-Z])/, '-$1').toLowerCase() + ':' + options[a][b] + ';');
				}
				options[a] = bArr[join](x);
			}
			aArr.push(a + '="' + options[a] + '"');
		}
		options = aArr[join](' ');

		/* Create the PARAM tags */
		if (typeof paramAttributes == object) {
			aArr = [];
			for (a in paramAttributes) {
				if (typeof paramAttributes[a] == object) {
					bArr = [];
					for (b in paramAttributes[a]) {
						bArr.push([b, '=', encodeURIComponent(paramAttributes[a][b])][join](x));
					}
					paramAttributes[a] = bArr[join]('&amp;');
				}
				aArr.push(['<PARAM NAME="', a, '" VALUE="', paramAttributes[a], '">'][join](x));
			}
			paramAttributes = aArr[join](x);
		}

		/* Unify the visual display between all browsers */
		if (!(/style=/.test(options))) {
			options += ' ' + verticalAlign + '"';
		}
		if (!(/style=(.*?)vertical-align/.test(options))) {
			options = options.replace(/style="/, verticalAlign);
		}

		/* Specify the object and param tags between browsers */
		if ($.browser.msie) {
			options += ' classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"';
			paramAttributes = '<PARAM NAME="movie" VALUE="' + movieFilename + '">' + paramAttributes;
		} else {
			options += ' type="application/x-shockwave-flash" data="' + movieFilename + '"';
		}

		/* Return the jQuery'd flash OBJECT */
		buildDOM.innerHTML = ['<OBJECT ', options, '>', paramAttributes, '</OBJECT>'][join](x);
		return $(buildDOM.firstChild);
	};

	/* $.fn.flash */
	$.fn.flash = function(options) {
		/* Check if Flash is installed, return the jQuery node if it isn't */
		if (!$.hasFlashPlayer) {
			return this;
		}

		var each = 0,
		eachOptions,
		$each;

		/* Each */
		while (($each = this.eq(each++))[0]) {
			eachOptions = $[extend](
				{
					beforeEach: fn,
					afterEach: fn
				},
				options
			);
			eachOptions.beforeEach.apply($each[0], [options]);
			$each.html($.flash(eachOptions));
			if (doc.getElementById('SWFObjectExprInst')) {
				each = this.length;
			}
			eachOptions.afterEach.apply($each[0], [options]);
		}

		/* Return the jQuery node */
		return this;
	};
}(jQuery));