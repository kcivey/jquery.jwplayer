Name
====

jQuery.JWPlayer - jQuery plugin for using JW Player

Usage
=====

Constructor
-----------

    $('#container').jwPlayer(options);

where _options_ is an object containing various properties used in constructing
the Flash player.  Possible properties include

* _swf:_ the URL for the JW Player (defaults to "player.swf", so you'll almost
  certainly want to change it)
* _id:_ the id for the JW Player object (defaults to "jwPlayer")
* _height:_ height for JW Player object (treated as pixels if a number;
  defaults to 240)
* _width:_ width for JW Player object (treated as pixels if a number;
  defaults to 320)
* _playerready:_ function (or name of function) to be called when the player
  has loaded and is ready
* _flashvars:_ object containing [flashvars for JW Player](http://developer.longtailvideo.com/trac/wiki/Player5FlashVars).

Other properties are used to set up listeners, with a value that can be either
a function or the name of a function:

* _bufferlistener:_ sets up Model listener for BUFFER event
* _errorlistener:_ sets up Model listener for ERROR event
* _fullscreenlistener:_ sets up View listener for FULLSCREEN event
* _itemlistener:_ sets up Controller listener for ITEM event
* _linklistener:_ sets up View listener for LINK event
* _loadedlistener:_ sets up Model listener for LOADED event
* _loadlistener:_ sets up View listener for LOAD event
* _metalistener:_ sets up Model listener for META event
* _mutelistener:_ sets up Controller listener for MUTE event
* _nextlistener:_ sets up View listener for NEXT event
* _playlistener:_ sets up Controller listener for PLAY event
* _playlistlistener:_ sets up Controller listener for PLAYLIST event
* _prevlistener:_ sets up View listener for PREV event
* _redrawlistener:_ sets up View listener for REDRAW event
* _resizelistener:_ sets up Controller listener for RESIZE event
* _seeklistener:_ sets up Controller listener for SEEK event
* _statelistener:_ sets up Model listener for STATE event
* _stoplistener:_ sets up Controller listener for STOP event
* _timelistener:_ sets up Model listener for TIME event
* _volumelistener:_ sets up Controller listener for VOLUME event


The following will be recognized as flashvars and moved into the _flashvars_
object if they occur directly in _options_ -- so you can write
`{file: 'video.flv'}` instead of `{flashvars: {file: 'video.flv'}}`:

* _author_
* _autostart_
* _backcolor_
* _bufferlength_
* _config_
* _controlbar_
* _date_
* _debug_
* _description_
* _displaytitle_
* _dock_
* _duration_
* _file_
* _frontcolor_
* _fullscreen_
* _icons_
* _image_
* _item_
* _lightcolor_
* _mute_
* _playerready_
* _playlist_
* _playlistfile_
* _playlistsize_
* _plugins_
* _provider_
* _repeat_
* _screencolor_
* _shuffle_
* _skin_
* _smoothing_
* _start_
* _streamer_
* _stretching_
* _tags_
* _title_
* _volume_

Note that _height_ and _width_ are not included, because those are the names of
properties for the Flash object.  If you want to include _height_ and _width_
flashvars, you must include them in the _flashvars_ sub-object.


get
---

    $('#container').jwPlayer('get', property);

Get value of a property out of the jQuery.jwPlayer object data.  Properties
include

* _obj:_ the DOM object corresponding to the Flash object
* _duration:_ the duration of the media, in seconds
* _item:_ current playlist item (starting with 0) _(may not be necessary, since
  `.jwPlayer('getConfig', 'item')` should give the same)_
* _state:_ current playback state ((IDLE, BUFFERING, PLAYING, PAUSED, COMPLETED)
* _position:_ current position, in seconds
* _volume:_ current volume level, on scale of 0 to 100 _(may not be necessary,
  since `.jwPlayer('getConfig', 'volume')` should give the same)_

item
----

    $('#container').jwPlayer('item', itemNumber);

Select an item from the playlist, with itemNumber starting from 0.

load
----

    $('#container').jwPlayer('load', filename);

Load a new file or playlist.

mute
----

    $('#container').jwPlayer('mute');

Toggle mute state _(probably need to change to mute/unmute/toggleMute)_.

next
----

    $('#container').jwPlayer('next');

Move to the next playlist item.

pause
-----

    $('#container').jwPlayer('pause');

Pause playing.

play
----

    $('#container').jwPlayer('play');

Start playing from current position.

togglePlay
----------

    $('#container').jwPlayer('togglePlay');

If paused, start playing from current position.  If playing, pause.

prev
----

    $('#container').jwPlayer('prev');

Move to the previous playlist item.

redraw
------

    $('#container').jwPlayer('redraw');

Redraw the player.

seek
----

    $('#container').jwPlayer('seek', position);

Seek to a particular position in seconds.  The plugin uses a state listener
to handle seek commands sent when the player is not in a state in which it
can do seeking.

stop
----

    $('#container').jwPlayer('stop');

Stop playing and set state to IDLE and position to 0.

volume
------

    $('#container').jwPlayer('volume', level);

Set the volume.  Level is on a scale of 0 to 100.

getConfig
---------

    $('#container').jwPlayer('getConfig');
    $('#container').jwPlayer('getConfig', property);

Get the config data (flashvars) -- either all of it as an object (if no
argument is passed) or the value of one property (if the property name is
passed).

getPlaylist
-----------

    $('#container').jwPlayer('getPlaylist');
    $('#container').jwPlayer('getPlaylist', itemNumber);

Get the playlist data as an array of objects (if no argument is passed) or as
an object corresponding to a single playlist item (if itemNumber is
passed).  The item number is 0-based.

destroy
-------

    $('#container').jwPlayer('destroy');

Removes the Flash object from the container, along with the associated data.

Demo
====

See [http://kcivey.github.com/jquery.jwplayer/demo.html](http://kcivey.github.com/jquery.jwplayer/demo.html).

Author
======

Keith C. Ivey, keith@iveys.org (written for Smokescreen LLC)

License
=======

Copyright 2010, Smokescreen LLC.
Dual licensed under the MIT and GPL licenses:

* [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)
* [http://www.gnu.org/licenses/gpl.html](http://www.gnu.org/licenses/gpl.html)
