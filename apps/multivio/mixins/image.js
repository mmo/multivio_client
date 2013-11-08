/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

Multivio.ZOOM_MODE_IN_SCALE = 'in-scale';
Multivio.ZOOM_MODE_FIT_WIDTH = 'fit-width';
Multivio.ZOOM_MODE_FIT_ALL = 'fit-all';
Multivio.ZOOM_MODE_100_PERCENT = '100-percent';

Multivio.DisplayImage = {
  _centerViewWidth: 0,
  _centerViewHeight: 0,
  _centerImageStatus: null,
  _appOptions: null,
  rotationAngle: 0,
  zoomMode: Multivio.ZOOM_MODE_FIT_ALL, //fitWidth, zoom, fit, native
  _zoomScale: [],
  _currentZoomIndex: -1,
  centerImage: null,

  /**
    This property stores the URL corresponding to the image that is displayed.
    It is updated whenever the context changes:
    - zoom factor
    - window size
    - rotation angle
  */
  currentUrl: function () {

    if (this.get('isContentNode')) {
      
      //pdf check
      if (this.get('isPDF') || this.get('isImage')) {

        var scaleFactor = this.get('_zoomScale')[this.get('_currentZoomIndex')];
        var newUrl, newWidth, newHeight;
        var angle = -this.get('rotationAngle');
        
        //different zoom mode
        switch (this.get('zoomMode')) {

          case Multivio.ZOOM_MODE_FIT_WIDTH:
            newWidth = parseInt(this.get('_centerViewWidth'), 10);
            if (angle % 180) {
              newUrl =
                "%@max_height=%@&angle=%@&%@".fmt(this.get('_renderPrefix'),
                   newWidth, angle, this.get('_currentUrl'));
            } else {
              newUrl =
                "%@max_width=%@&angle=%@&%@".fmt(this.get('_renderPrefix'),
                  newWidth, angle, this.get('_currentUrl'));
            }
            break;

          case Multivio.ZOOM_MODE_FIT_ALL:
            if (angle % 180) {
              newHeight = parseInt(this.get('_centerViewWidth'), 10);
              newWidth = parseInt(this.get('_centerViewHeight'), 10);
            } else {
              newWidth = parseInt(this.get('_centerViewWidth'), 10);
              newHeight = parseInt(this.get('_centerViewHeight'), 10);
            }
            newUrl = "%@max_width=%@&max_height=%@&angle=%@&%@"
              .fmt(this.get('_renderPrefix'), newWidth, newHeight, angle,
                this.get('_currentUrl'));
            break;

          default:
            newWidth = parseInt(this.get('_defaultWidth') * scaleFactor, 10);
            newHeight = parseInt(this.get('_defaultHeight') * scaleFactor, 10);
            newUrl = "%@max_width=%@&max_height=%@&angle=%@&%@"
              .fmt(this.get('_renderPrefix'), newWidth, newHeight, angle,
                this.get('_currentUrl'));
        }
        return newUrl;
      }
    } else {
      return undefined;
    }
  }.property('rotationAngle', '_currentZoomIndex', '_currentUrl',
     '_centerViewWidth', '_centerViewHeight', 'zoomMode'),

  _renderPrefix: function () {
    var server = Multivio.configurator.get('serverName');
    if (!SC.none(this.get('_appOptions').server)) {
      server = this.get('_appOptions').server; 
    }
    return '/' + server + "/document/render?";
  }.property('_appOptions').cacheable(),

  loadingPage: function () {
    var status = this.get('_centerImageStatus');
    SC.Logger.debug('Multivio.DisplayImage.loadingPage: ' + status);
    return status === SC.IMAGE_STATE_LOADING ? YES : NO;
  }.property('_centerImageStatus').cacheable(),
  
  
  //********************// 
  //        ZOOM        //
  //********************// 

  _defaultWidth: function () {
    return this.getPath('nativeSize.width');
  }.property('nativeSize').cacheable(),
  _defaultHeight: function () {
    return this.getPath('nativeSize.height');
  }.property('nativeSize').cacheable(),

  nativeSize: function () {
    if (!this.get('defaultNativeSize')) {
      return {'width': 0, 'height': 0};
    }
    var nativeSizes = this.get('nativeSizes');
    var currentPage = this.get('currentPage');
    var size;
    if (!SC.none(nativeSizes) && !SC.none(nativeSizes[currentPage])) {
      size = nativeSizes[currentPage];
    } else {
      size = this.get('defaultNativeSize');
    }
    return {'width': size[0], 'height': size[1]};
  }.property('currentPage', 'defaultNativeSize', 'nativeSizes').cacheable(),
  
  hasThumbnails: function () {
    if (this.get('nPages') > 1) {
      return YES;
    }
    return NO;
  }.property('nPages').cacheable(),


  fitWidth: function (key, value) {
    SC.Logger.debug('fitWidth: ' + value);
    if (SC.none(value)) { // function called for reading (getting)
      if (this.get('zoomMode') === Multivio.ZOOM_MODE_FIT_WIDTH) {
        return YES;
      } else {
        return NO;
      }
    } else { // function called for writing (setting)
      if (value) {
        this.set('zoomMode', Multivio.ZOOM_MODE_FIT_WIDTH);
      // } else {
      //   this.set('zoomMode', Multivio.ZOOM_MODE_IN_SCALE);
      }
    }
  }.property('zoomMode').cacheable(),

  fitAll: function (key, value) {
    SC.Logger.debug('fitAll: ' + value);
    if (SC.none(value)) { // function called for reading (getting)
      if (this.get('zoomMode') === Multivio.ZOOM_MODE_FIT_ALL) {
        return YES;
      } else {
        return NO;
      }
    } else { // function called for writing (setting)
      if (value) {
        this.set('zoomMode', Multivio.ZOOM_MODE_FIT_ALL);
      // } else {
      //   this.set('zoomMode', Multivio.ZOOM_MODE_IN_SCALE);
      }
    }
  }.property('zoomMode').cacheable(),

  hundredPercentZoom: function (key, value) {
    SC.Logger.debug('hundredPercentZoom: ' + value);
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

  _getNearestZoomIndex: function (roundedDown) {
    //image with at 100% zoom
    var nativeWidth = this.get('_defaultWidth');
    //current Image Width
    var winWidth = 0;
    if (this.get('centerImage')) {
      winWidth = this.get('centerImage').width;
    }

    var desiredNumber = winWidth / nativeWidth;

    var zooms = this.get('_zoomScale');
    var nearest = -1, i;
    var bestDistanceFoundYet = Number.MAX_VALUE;
    // We iterate on the array...
    for (i = 0; i < zooms.length; i++) {
      // if we found the desired number, we return it.
      if (zooms[i] === desiredNumber) {
        nearest = i;
      } else {
        // else, we consider the difference between the desired number and the current number in the array.
        var d = Math.abs(desiredNumber - zooms[i]);
        //SC.Logger.debug('distance: ' + d + ' desi: ' + desiredNumber + ' actual ' + zooms[i] + " nearest " + nearest);
        if (d < bestDistanceFoundYet) {
          // For the moment, this value is the nearest to the desired number...
          nearest = i;
          bestDistanceFoundYet = d;
        }
      }
    }
    //SC.Logger.debug('Best index: ' + nearest);
    if (roundedDown) {
      if (nearest === 0 || desiredNumber > zooms[nearest]) {
        return nearest;
      } else {
        return nearest - 1;
      }
    } else {
      if (nearest === (zooms.length - 1)  || desiredNumber < zooms[nearest]) {
        return nearest;
      } else {
        return nearest + 1;
      }
    }
  },

  hasNextZoom: function () {
    var currentZoomIndex = this.get('_currentZoomIndex');
    if (this.get('zoomMode') !== Multivio.ZOOM_MODE_IN_SCALE &&
        this.get('zoomMode') !== Multivio.ZOOM_MODE_100_PERCENT) {
      currentZoomIndex = this._getNearestZoomIndex(YES);
    }
    if (currentZoomIndex < (this.get('_zoomScale').length - 2)) {
      return YES;
    }
    return NO;
  }.property('_currentZoomIndex', '_centerImageStatus', 'zoomMode').cacheable(),

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
  }.property('_currentZoomIndex', '_centerImageStatus', 'zoomMode').cacheable(),

  //********************// 
  //        ROTATION   //
  //********************// 
  rotateLeft: function () {
    var currentAngle = this.get('rotationAngle');
    var newAngle = currentAngle - 90;
    if (newAngle < 0) {
      newAngle = 360 + newAngle;
    }
    this.set('rotationAngle', newAngle % 360);
  },

  rotateRight: function () {
    var currentAngle = this.get('rotationAngle');
    var newAngle = currentAngle + 90;
    this.set('rotationAngle', newAngle % 360);
  }

};
