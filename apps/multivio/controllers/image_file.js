/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('mixins/image.js');



/** @class

  This controlls the center view to display a pdf content.

  @author jma/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('mixins/image.js');


/** @class

  This controlls the center view to display a pdf content.

  @author jma
  @extends SC.ObjectController
*/
Multivio.imageFileController = Multivio.CenterImageController.create({

  _zoomScale: [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.75, 1.0],
  _nativeZoomIndex: 2,
  _currentZoomIndex: 2,
  _urls: [],

  _urlSuffix: function () {
    this.set('_urls', [this.get('url')]);
    this.set('currentPage', 1);
    return "url=%@".fmt(this.get('url'));
  }.property('url'),
  
  infoMessage: function () {
    return "Image";
  }.property('currentPage', '_nPages'),
  
  _nPages: function () {
    if (!SC.none(this.get('_urls'))) {
      return this.get('_urls').length;
    }
    return 0;
  }.property('_urls').cacheable()

});
