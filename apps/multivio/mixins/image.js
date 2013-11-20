/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

//sc_require('controllers/current_file_node.js');


Multivio.ZOOM_MODE_IN_SCALE = 'in-scale';
Multivio.ZOOM_MODE_FIT_WIDTH = 'fit-width';
Multivio.ZOOM_MODE_FIT_ALL = 'fit-all';
Multivio.ZOOM_MODE_100_PERCENT = '100-percent';

/** @class

  This controlls a file record of static image type (PDF, image...) and allows
  the center view to display its content.

  @author jma, mmo
  @extends SC.ObjectController
*/

Multivio.CenterImageController = SC.ObjectController.extend({
    /** @scope Multivio.CenterImageController.prototype */

  content: null,
  
  /**
    @property
    @type String
   */
  infoMessage: null,

  /**
    @type String
   */
  //mimeRegExp: '',

  /**
    Size of the view where the content is displayed (the available canvas)
    @type Object
   */
  displayWindowSize: { width: 1, height: 1 },

  /**
    Size of the image as it is curently displayed
    @type Object
   */
  imageCurrentSize: { width: 1, height: 1 },
  
  /**
    Native width*height of the image
    @property
    @type Object
   */
  imageNativeSize: function () {
    if (!this.get('defaultNativeSize')) {
      return { width: 1, height: 1};
    }
    var sizeExceptions = this.get('sizeExceptions');
    var currentPage = this.get('currentPage');
    var size;
    if (!SC.none(sizeExceptions) && !SC.none(sizeExceptions[currentPage])) {
      size = sizeExceptions[currentPage];
    } else {
      size = this.get('defaultNativeSize');
    }



    // // adjust according to angle
    // var rAngle = -this.get('rotationAngle'),
    //     result = { width: 1, height: 1};
    // if (rAngle % 180 == 0) {
    //   // vertical orientation
    //   result = { width: parseInt(size[0]), height: parseInt(size[1])}
    // }
    // else {
    //   // horizontal orientation
    //   result = { width: parseInt(size[1]), height: parseInt(size[0])}
    // }




    return { width: parseInt(size[0]), height: parseInt(size[1]) };
  }.property('currentPage', 'defaultNativeSize', 'sizeExceptions'
      /*, 'rotationAngle'*/).cacheable(),

  /**
    variable used to say if the toolbar has been actived by the user.
    If the button is active the toolbar is permanently visible
    @type Boolean
  */
  isHorizontalToolbarActive: YES,


  // DEBUGGING................
  //
  // imageSizeDidChange: function () {
  //   SC.Logger.debug(
  //     'Multivio.CenterImageController.imageSizeDidChange: width = '
  //     + this.get('imageWidth') + ', height = ' + this.get('imageHeight')
  //   );
  // }.observes('imageWidth', 'imageHeight'),


  /**
    TODO
    @type Number
   */
  // TODO: remove? (the status is used for presenting the waiting view,
  // but thie should be handled within the CenterImageView itself and itls children)
  //imageStatus: null,

  /**
    Current zoom mode
    @type String
   */
  zoomMode: Multivio.ZOOM_MODE_FIT_ALL, //fitWidth, zoom, fit, native

  /**
    A content-specific URL suffix. This allows to customize the URL that is
    actually requested from the server, depending on the kind of content being
    presented (see property 'currentUrl'). Ex: the suffix for requesting a native
    image differs from the one used for requesting the rendering of a PDF page.
    @type String
  */
  _urlSuffix: null,



  updateImageCurrentSizeValue: function () {
    var zScale = this._zoomScale,
        zIndex = this.get('_currentZoomIndex');
    var scaleFactor = zScale[zIndex],
        nativew = this.get('imageNativeSize').width,
        nativeh = this.get('imageNativeSize').height,
        windoww = this.get('displayWindowSize').width,
        windowh = this.get('displayWindowSize').height,
        newFactor = 1.0;

    // adjust w,h info according to angle
    var rAngle = -this.get('rotationAngle');
    if (rAngle % 180 != 0) {
      // horizontal orientation
      var _tmp = nativew;
      nativew = nativeh;
      nativeh = _tmp;
    }

    switch (this.get('zoomMode')) {
      case Multivio.ZOOM_MODE_IN_SCALE:
        newFactor = scaleFactor;
        break;
      case Multivio.ZOOM_MODE_FIT_WIDTH:
        newFactor = windoww/nativew;
        break;
      case Multivio.ZOOM_MODE_FIT_ALL:
        newFactor = (windoww/nativew < windowh/nativeh) ?
            windoww/nativew : windowh/nativeh;
        break;
      case Multivio.ZOOM_MODE_100_PERCENT:
      default:
        newFactor = 1.0;
    }

    this.set('imageCurrentSize', {
        width: Math.floor(nativew * newFactor) - 1,
        height: Math.floor(nativeh * newFactor) - 1
      });

    SC.Logger.debug('Multivio.CenterImageController.updateImageCurrentSizeValue: '
      + this.get('imageCurrentSize').width + ' x '
      + this.get('imageCurrentSize').height);
  },

  /**
    The URL of the content being displayed, taking into account:
    - window size
    - zoom factor
    - rotation angle
    This is the URL of the content that is actually requested from the server
    to be displayed.
    @property
    @type String
  */
  currentUrl: function () {
    var newUrl = undefined;
    if (this.get('isContentNode')) {
      var rAngle = -this.get('rotationAngle');

      // before requesting the image from the server, recalculate the required
      // size according to the new context
      this.updateImageCurrentSizeValue();

      //different zoom modes
      switch (this.get('zoomMode')) {
        case Multivio.ZOOM_MODE_FIT_WIDTH:
          if (rAngle % 180 == 0) {
            // vertical orientation
            newUrl = "%@max_width=%@&angle=%@&%@".fmt(
                this.get('_renderPrefix'),
                this.get('imageCurrentSize').width,
                rAngle,
                this.get('_urlSuffix'));
          }
          else {
            // horizontal orientation
            newUrl = "%@max_height=%@&angle=%@&%@".fmt(
                this.get('_renderPrefix'),
                this.get('imageCurrentSize').width,
                rAngle,
                this.get('_urlSuffix'));
          }
          break;
        case Multivio.ZOOM_MODE_IN_SCALE:
        case Multivio.ZOOM_MODE_FIT_ALL:
        case Multivio.ZOOM_MODE_100_PERCENT:
        default:
          if (rAngle % 180 == 0) {
            // vertical orientation
            newUrl = "%@max_width=%@&max_height=%@&angle=%@&%@".fmt(
                this.get('_renderPrefix'),
                this.get('imageCurrentSize').width,
                this.get('imageCurrentSize').height,
                rAngle,
                this.get('_urlSuffix')
              );
          }
          else {
            // horizontal orientation
            newUrl = "%@max_width=%@&max_height=%@&angle=%@&%@".fmt(
                this.get('_renderPrefix'),
                this.get('imageCurrentSize').height,
                this.get('imageCurrentSize').width,
                rAngle,
                this.get('_urlSuffix')
              );
          }
      }
    }
    return newUrl;
  }.property('_urlSuffix', 'rotationAngle', '_currentZoomIndex', 'zoomMode',
      'displayWindowSize'),

  /**
    Rotation angle
    @type Number
   */
  rotationAngle: 0,

  /**
    Complete allowed zoom scale
    @type Array
   */
  _zoomScale: [1.0],

  /**
    Current zoom index (within _zoomScale)
    @type Number
   */
  _currentZoomIndex: 0,

  /**
    Render URL prefix
    @property
    @type String
   */
  _renderPrefix: function () {
    var server = Multivio.configurator.get('serverName');
    return '/' + server + "/document/render?";
  }.property('Multivio.configurator.serverName'),

  /**
    @type Boolean
   */
  /*
  isLoadingPage: function () {
    var status = this.get('_centerImageStatus');
    SC.Logger.debug('Multivio.DisplayImage.isLoadingPage: ' + status);
    return status === SC.IMAGE_STATE_LOADING ? YES : NO;
  }.property('_centerImageStatus').cacheable(),
  */
  
  
  //********************//
  //    ZOOM            //
  //********************//

  /**
    Default width
    @property
    @type Number
   */
  // _defaultWidth: function () {
  //   return this.getPath('nativeImageSize.width');
  // }.property('nativeImageSize').cacheable(),
  
  /**
    Default height
    @property
    @type Number
   */
  // _defaultHeight: function () {
  //   return this.getPath('nativeImageSize.height');
  // }.property('nativeImageSize').cacheable(),

  // hasThumbnails: function () {
  //   if (this.get('nPages') > 1) {
  //     return YES;
  //   }
  //   return NO;
  // }.property('nPages').cacheable(),

  /**
    Checks or sets fit-width zoom mode
    @property
    @type Boolean
   */
  fitWidth: function (key, value) {
    if (SC.none(value)) { // function called for reading (getting)
      if (this.get('zoomMode') === Multivio.ZOOM_MODE_FIT_WIDTH) {
        return YES;
      } else {
        return NO;
      }
    } else { // function called for writing (setting)
      if (value) {
        this.set('zoomMode', Multivio.ZOOM_MODE_FIT_WIDTH);
      }
    }
  }.property('zoomMode').cacheable(),

  /**
    Checks or sets fit-all zoom mode
    @property
    @type Boolean
   */
  fitAll: function (key, value) {
    if (SC.none(value)) { // function called for reading (getting)
      if (this.get('zoomMode') === Multivio.ZOOM_MODE_FIT_ALL) {
        return YES;
      } else {
        return NO;
      }
    } else { // function called for writing (setting)
      if (value) {
        this.set('zoomMode', Multivio.ZOOM_MODE_FIT_ALL);
      }
    }
  }.property('zoomMode').cacheable(),

  /**
    Checks or sets 100-percent zoom mode
    @property
    @type Boolean
   */
  hundredPercentZoom: function (key, value) {
    if (SC.none(value)) { // function called for reading (getting)
      if (this.get('zoomMode') === Multivio.ZOOM_MODE_100_PERCENT) {
        return YES;
      } else {
        return NO;
      }
    } else { // function called for writing (setting)
      if (value) {
        this.set('zoomMode', Multivio.ZOOM_MODE_100_PERCENT);
        this.set('_currentZoomIndex', this._nativeZoomIndex);
      }
    }
  }.property('zoomMode').cacheable(),
  
  /**
    Increase current zoom by 1 stop
    @returns {void}
   */
  nextZoom: function () {
    if (this.get('zoomMode') !== Multivio.ZOOM_MODE_IN_SCALE) {
      var correspondingZoom = this._getNearestZoomIndex(NO);
      this.set('_currentZoomIndex', correspondingZoom);
      this.set('zoomMode', Multivio.ZOOM_MODE_IN_SCALE);
      return;
    }
    else {
      if (this.get('hasNextZoom')) {
        this.set('_currentZoomIndex', this.get('_currentZoomIndex') + 1);
      }
    }
  },

  /**
    Decrease current zoom by 1 stop
    @returns {void}
   */
  previousZoom: function () {
    if (this.get('zoomMode') !== Multivio.ZOOM_MODE_IN_SCALE) {
      var correspondingZoom = this._getNearestZoomIndex(YES);
      this.set('_currentZoomIndex', correspondingZoom);
      this.set('zoomMode', Multivio.ZOOM_MODE_IN_SCALE);
      return;
    }
    else {
      if (this.get('hasPreviousZoom')) {
        this.set('_currentZoomIndex', this.get('_currentZoomIndex') - 1);
      }
    }
  },

  /**
    Returns the zoom index in the scale that is closest to the current zoom
    value. This is useful for gracefully switching from predefined zoom modes
    (fit-width, fit-all...) to the closest stop in the zoom scale
    @param Boolean roundedDown
    @returns Number
   */
  _getNearestZoomIndex: function (roundedDown) {
    var nativeWidth = this.get('imageNativeSize').width,
        currentWidth = this.get('imageCurrentSize').width;

    // adjust width info according to angle
    var rAngle = -this.get('rotationAngle');
    if (rAngle % 180 != 0) {
      // horizontal orientation
      currentWidth = this.get('imageCurrentSize').height;
    }

    var currentZoomValue = currentWidth / nativeWidth;

    var zooms = this._zoomScale;
    var nearest = -1, i;
    var bestDistanceFoundYet = Number.MAX_VALUE;
    // We iterate on the array...
    for (i = 0; i < zooms.length; i++) {
      // if we found the desired number, we return it.
      if (zooms[i] === currentZoomValue) {
        nearest = i;
      } else {
        // else, we consider the difference between the desired number and the
        // current number in the array.
        var d = Math.abs(currentZoomValue - zooms[i]);
        if (d < bestDistanceFoundYet) {
          // For the moment, this value is the nearest to the desired number...
          nearest = i;
          bestDistanceFoundYet = d;
        }
      }
    }
    if (roundedDown) {
      if (nearest === 0 || currentZoomValue > zooms[nearest]) {
        return nearest;
      } else {
        return nearest - 1;
      }
    } else {
      if (nearest === (zooms.length - 1)  || currentZoomValue < zooms[nearest]) {
        return nearest;
      } else {
        return nearest + 1;
      }
    }
  },

  /**
    @property
    @type Boolean
   */
  hasNextZoom: function () {
    var currentZoomIndex = this.get('_currentZoomIndex');
    if (this.get('zoomMode') !== Multivio.ZOOM_MODE_IN_SCALE &&
        this.get('zoomMode') !== Multivio.ZOOM_MODE_100_PERCENT) {
      currentZoomIndex = this._getNearestZoomIndex(YES);
    }
    if (currentZoomIndex < (this._zoomScale.length - 2)) {
      return YES;
    }
    return NO;
  }.property('_currentZoomIndex' /*, '_centerImageStatus'*/, 'zoomMode').cacheable(),

  /**
    @property
    @type Boolean
   */
  hasPreviousZoom: function () {
    var currentZoomIndex = this.get('_currentZoomIndex');
    if (this.get('zoomMode') !== Multivio.ZOOM_MODE_IN_SCALE &&
        this.get('zoomMode') !== Multivio.ZOOM_MODE_100_PERCENT) {
      currentZoomIndex = this._getNearestZoomIndex(NO);
    }
    if (currentZoomIndex > 0) {
      return YES;
    }
    return NO;
  }.property('_currentZoomIndex' /*, '_centerImageStatus'*/, 'zoomMode').cacheable(),

  //********************// 
  //    ROTATION        //
  //********************//
  
  /**
    @returns {void}
   */
  rotateLeft: function () {
    var currentAngle = this.get('rotationAngle');
    var newAngle = currentAngle - 90;
    if (newAngle < 0) {
      newAngle = 360 + newAngle;
    }
    this.set('rotationAngle', newAngle % 360);
  },

  /**
    @returns {void}
   */
  rotateRight: function () {
    var currentAngle = this.get('rotationAngle');
    var newAngle = currentAngle + 90;
    this.set('rotationAngle', newAngle % 360);
  }

});
