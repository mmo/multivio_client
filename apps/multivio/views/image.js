/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('mixins/fadeinout.js');
sc_require('controllers/image_file.js');
sc_require('views/center_image.js');

Multivio.imageView =  SC.View.design({
  childViews: ['imageScrollView'],
  classNames: 'mvo-main-image-view'.w(),
  acceptsFirstResponder: YES,

  imageScrollView: Multivio.CenterImageView.design({
    classNames: "mvo-image-scroll-view".w(),
    layout: { top: 0, left: 0, bottom: 0, right: 0},
  }),

  keyDown: function (evt) {
    SC.Logger.debug('KeyDown: ' + evt.keyCode);

    if (evt.keyCode === Multivio.KEYCODES.RIGHT_ARROW ||
        evt.keyCode === Multivio.KEYCODES.PAGE_DOWN) {
      // STATECHART EVENT TRIGGER
      Multivio.mainStatechart.sendEvent('goToNextFile');
    }
    if (evt.keyCode === Multivio.KEYCODES.LEFT_ARROW ||
        evt.keyCode === Multivio.KEYCODES.PAGE_UP) {
      // STATECHART EVENT TRIGGER
      Multivio.mainStatechart.sendEvent('goToPreviousFile');
    }

    try {
      if (evt.keyCode === Multivio.KEYCODES.PLUS) {
        Multivio.currentContentController.nextZoom();
      }
      if (evt.keyCode === Multivio.KEYCODES.MINUS) {
        Multivio.currentContentController.previousZoom();
      }
    }
    catch (e) {
      SC.Logger.error('Multivio.PdfView: error trying to handle zoom keyboard event');
    }

    return NO;
  }

});
