/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('controllers/center_image.js');

/** @class

  This controlls a PDF file record and allows the center view to display
  PDF content.

  @author jma
  @author mmo
*/
Multivio.pdfFileController = Multivio.CenterImageController.create({

  currentPage: 1,

  _zoomScale: [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0],

  _nativeZoomIndex: 7,

  _currentZoomIndex: 7,

  _urlSuffix: function () {
    return "page_nr=%@&url=%@".fmt(this.get('currentPage'), this.get('url'));
  }.property('url', 'currentPage').cacheable(),

  /**
    @property
    @type String
   */
  infoMessage: function () {
    return "Page: %@/%@".fmt(this.get('currentPage'), this.get('nPages'));
  }.property('currentPage', '_nPages')
});
