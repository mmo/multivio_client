/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
sc_require('views/overview.js');
Multivio.overviewController = SC.ObjectController.create({

  isPaletteVisible: null,
  isPaletteVisibleBinding: 'Multivio.mainPage.overview.isVisibleInWindow',
  contentBinding: 'Multivio.pdfFileController',
  imageWidth: 140,

  /**
    @field
    @type Boolean
  */
  isEnabled: function () {
    return YES;
  }.property(),

  /**
    @field
    @type Boolean
  */
  showPalette: null,

  /**
    @field
    @type String
  */
  // currentUrl: function () {
  //   if (this.get('isContentNode')) {
  //     //pdf check
  //     if (this.get('isPDF') || this.get('isImage')) {
  //       var scaleFactor = this.get('_zoomScale')[this.get('_currentZoomIndex')],
  //         newUrl,
  //         angle = -this.get('rotationAngle');
  //       var url = "%@max_width=%@&max_height=%@&angle=%@&url=%@"
  //         .fmt(this.get('_renderPrefix'), 12 /*this.get('imageWidth')*/, 
  //           12 /*this.get('imageWidth')*/, angle, this.get('url'));
  //       return url;
  //     }
  //   } 
  //   return undefined;
  // }.property('rotationAngle', '_currentUrl'),

  /** @private */
  _showPaletteDidChange: function () {
    var showPalette = this.get('showPalette');
    var ov = Multivio.getPath('mainPage.overview');
    if (ov) {
      if (showPalette) {
        ov.open();
      } else {
        ov.close();
      }
    }
  }.observes('showPalette')
});


