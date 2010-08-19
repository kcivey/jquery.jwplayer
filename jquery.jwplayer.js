;(function ($) {
/*!
jQuery.jwPlayer
by Keith C. Ivey, keith@iveys.org
Copyright 2010, Smokescreen Corporation
Dual licensed under the MIT and GPL licenses
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
Version 0.115 (2010-08-18)
*/

var pluginName = 'jwPlayer';

if (!window.console) { console = {}; } // prevent errors from console.log calls
if (!console.log) { console.log = $.noop; }

var eventType = {
    ITEM: 'Controller',
    MUTE: 'Controller',
    PLAY: 'Controller',
    PLAYLIST: 'Controller',
    RESIZE: 'Controller',
    SEEK: 'Controller',
    STOP: 'Controller',
    VOLUME: 'Controller',
    BUFFER: 'Model',
    ERROR: 'Model',
    LOADED: 'Model',
    META: 'Model',
    STATE: 'Model',
    TIME: 'Model',
    FULLSCREEN: 'View',
    LINK: 'View',
    LOAD: 'View',
    NEXT: 'View',
    PREV: 'View',
    REDRAW: 'View'
};

// Properties to be set in object data when listeners are fired
var listenerProperties = {
    ITEM: {index: 'item'},
    STATE: {newstate: 'state'},
    TIME: {position: 'position', duration: 'duration'},
    VOLUME: {volume: 'volume'}
};

var flashvarNames = [
    'author',
    'autostart',
    'backcolor',
    'bufferlength',
    'config',
    'controlbar',
    'date',
    'debug',
    'description',
    'displaytitle',
    'dock',
    'duration',
    'file',
    'frontcolor',
    'fullscreen',
    'icons',
    'image',
    'item',
    'lightcolor',
    'mute',
    'playerready',
    'playlist',
    'playlistfile',
    'playlistsize',
    'plugins',
    'provider',
    'repeat',
    'screencolor',
    'shuffle',
    'skin',
    'smoothing',
    'start',
    'streamer',
    'stretching',
    'tags',
    'title',
    'volume'
];

// Return global function name that's not being used
function getFunctionName(base) {
    var name, i = 0;
    while (true) {
        name = pluginName + '_' + base;
        if (i) {
            name += i;
        }
        if (!window[name]) {
            return name;
        }
        i++;
    }
}

$.fn[pluginName] = function (opts) {
    var fn, args, data, prop;
    if (typeof opts == 'string') { // it's a method name
        fn = $.fn[pluginName][opts];
        if (!fn) {
            throw('No such method: ' + pluginName + '.' + opts);
        }
        args = $.makeArray(arguments).slice(1);
        data = this.data(pluginName);
        if (!data) {
            throw('Constructor not called: ' + pluginName + '.' + opts);
        }
        args.unshift(data);
        return fn.apply(this, args);
    }
    opts = $.extend({}, $.fn[pluginName].defaults, opts);
    // put flashvars into subobject
    for (prop in opts) {
        if ($.inArray(prop, flashvarNames) != -1) {
            opts.flashvars[prop] = opts[prop];
            delete opts[prop]; 
        }
    }
    // Convert integers to pixels
    if (opts.height.toString().match(/^[0-9]+$/)) {
        opts.height += 'px';
    }
    if (opts.width.toString().match(/^[0-9]+$/)) {
        opts.width += 'px';
    }
    return this.each( function (index) {
        var id = opts.id,
            $this = $(this);
        if (index) {
            id += '-' + index;
        }
        if ($('#' + id).length) {
            $.error('id "' + id + '" already exists in document');
        }

        function makeListener(propMap, listenerName) {
            return function (obj) {
                var n, seek;
                for (n in propMap) {
                    $this[pluginName]('set', propMap[n], obj[n]);
                }
                if (listenerName == 'statelistener') {
                    seek = $this[pluginName]('get', 'seek');
                    if ((obj.newstate == 'PAUSED' ||
                        obj.newstate == 'PLAYING') && seek !== false) {
                        $this[pluginName]('set', 'seek', false);
                        $this[pluginName]('seek', seek);
                    }
                }
                if (opts[listenerName]) {
                    opts[listenerName](obj);
                }
            };
        }

        // Set up array of listeners to be added in playerReady.
        var eventName, listenerName, propMap,
            listeners = {};
        for (eventName in eventType) {
            listenerName = eventName.toLowerCase() + 'listener';
            if (listenerProperties[eventName]) {
                propMap = listenerProperties[eventName];
                listeners[eventName] = makeListener(propMap, listenerName);
            }
            else if (opts[listenerName]) {
                listeners[eventName] = opts[listenerName];
            }
        }
        console.log('listeners', listeners);

        // Create global function for playerReady that stores data,
        // adds listeners, and then runs the playerready callback 
        // that was passed in the options, if there is one.
        var fnName = getFunctionName('playerReady');
        var extraPlayerready = opts.flashvars.playerready;
        window[fnName] = function (obj) {
            console.log(fnName + '()', arguments);
            // Store player object (DOM node) in data() of jQuery object
            var data = {
                obj: $('#' + id)[0],
                duration: null,
                item: 0,
                state: 'IDLE',
                position: 0,
                seek: false, // queued seek position
                volume: null
            };
            $this.data(pluginName, data);
            var eventName;
            for (eventName in listeners) {
                $this[pluginName]('addListener', eventName, listeners[eventName]);
            }
            $this.addClass(pluginName); // to signal it's finished
            if (extraPlayerready) {
                extraPlayerready(obj);
            }
        };
        opts.flashvars.playerready = fnName;
        $this.empty().flash( {
            swf: opts.swf,
            id: id,
            name: id,
            height: opts.height,
            width: opts.width,
            wmode: opts.wmode,
            params: {
                allowfullscreen: 'true',
                allowscriptaccess: 'always',
                enablejs: 'true',
                flashvars: opts.flashvars
            }
        } );
        return this;
    } );
};

$.extend($.fn[pluginName], {
    defaults: {
        flashvars: {},
        height: 240,
        width: 320,
        id: pluginName,
        swf: 'player.swf',
        wmode: 'opaque'
    },

    set: function (data, property, value) {
        data[property] = value;
    },

    get: function (data, property) {
        return data[property];
    },

    item: function (data, itemNumber) {
        itemNumber = parseInt(itemNumber, 10);
        console.log('jwPlayer.item', itemNumber);
        data.obj.sendEvent('ITEM', itemNumber);
        return this;
    },

    load: function(data, filename) {
        console.log('jwPlayer.load: setting filename to ', filename);
        data.obj.sendEvent('LOAD', filename);
        return this;
    },

    mute: function (data) {
        console.log('jwPlayer.mute');
        data.obj.sendEvent('MUTE');
        return this;
    },

    next: function (data) {
        console.log('jwPlayer.next');
        data.obj.sendEvent('NEXT');
        return this;
    },

    pause: function (data) {
        console.log('jwPlayer.pause');
        data.obj.sendEvent('PLAY', 'false');
        return this;
    },

    play: function (data) {
        console.log('jwPlayer.play');
        data.obj.sendEvent('PLAY', 'true');
        return this;
    },

    resume: function (data) { // same as play
        console.log('jwPlayer.resume');
        data.obj.sendEvent('PLAY', 'true');
        return this;
    },

    start: function (data) { // same as play
        console.log('jwPlayer.start');
        data.obj.sendEvent('PLAY', 'true');
        return this;
    },

    togglePlay: function (data) {
        console.log('jwPlayer.togglePlay');
        data.obj.sendEvent('PLAY');
        return this;
    },

    prev: function (data) {
        console.log('jwPlayer.prev');
        data.obj.sendEvent('PREV');
        return this;
    },

    redraw: function (data) {
        console.log('jwPlayer.redraw');
        data.obj.sendEvent('REDRAW');
        return this;
    },

    seek: function (data, position) {
        var state;
        console.log('jwPlayer.seek', position);
        position = parseFloat(position);
        if (!position) {
            position = 0.001; // weird bug when seeking to 0
        }
        state = this[pluginName]('get', 'state');
        console.log('state', state);
        if (state == 'PLAYING' || state == 'PAUSED') {
            data.obj.sendEvent('SEEK', position);
            data.seek = false;
        }
        else {
            if (state == 'IDLE') {
                // Play and pause to get media loading
                data.obj.sendEvent('PLAY', 'true');
                data.obj.sendEvent('PLAY', 'false');
            }
            data.seek = position;
        }
        return this;
    },

    stop: function (data) {
        console.log('jwPlayer.stop');
        data.obj.sendEvent('STOP');
        return this;
    },

    volume: function (data, volume) {
        volume = parseInt(volume, 10);
        data.obj.sendEvent('VOLUME', volume);
        return this;
    },

    getConfig: function (data, property) {
        var config = data.obj.getConfig();
        return property ? config[property] : config;
    },

    getPlaylist: function (data, itemNumber) {
        var playlist = data.obj.getPlaylist();
        return itemNumber || itemNumber === 0 ? playlist[itemNumber] : playlist;
    },

    addListener: function (data, eventName, callback) {
        console.log('jwPlayer.addListener', eventName, callback);
        var fnName,
            method = 'add' + eventType[eventName] + 'Listener';
        if ($.isFunction(callback)) {
            fnName = getFunctionName(eventName.toLowerCase() + 'Listener');
            window[fnName] = callback;
            callback = fnName;
        }
        return data.obj[method](eventName, callback);
    },

    destroy: function () {
        console.log('jwPlayer.destroy');
        $(this).removeData(pluginName).empty();
    }

});

})(jQuery);
