/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('mixins/fadeinout.js');
sc_require('views/center_image.js');
sc_require('controllers/pdf_file.js');
//sc_require('views/navigation_toolbar.js');


Multivio.pdfView = SC.View.design({
  childViews: ['pdfScrollView'],
  classNames: 'mvo-main-pdf-view'.w(),
  acceptsFirstResponder: YES,

  pdfScrollView: Multivio.CenterImageView.design({
    classNames: "mvo-pdf-scroll-view".w(),
    layout: { top: 0, left: 0, bottom: 0, right: 0},
  }),

  keyDown: function (evt) {
    SC.Logger.debug('KeyDown: ' + evt.keyCode);

    try {

      if (evt.keyCode === Multivio.KEYCODES.LEFT_ARROW) {
        // STATECHART EVENT TRIGGER
        Multivio.mainStatechart.sendEvent('goToPreviousIndex');
      }
      if (evt.keyCode === Multivio.KEYCODES.RIGHT_ARROW) {
        // STATECHART EVENT TRIGGER
        Multivio.mainStatechart.sendEvent('goToNextIndex');
      }
      if (evt.keyCode === Multivio.KEYCODES.PAGE_DOWN) {
        // STATECHART EVENT TRIGGER
        Multivio.mainStatechart.sendEvent('goToNextFile');
      }
      if (evt.keyCode === Multivio.KEYCODES.PAGE_UP) {
        // STATECHART EVENT TRIGGER
        Multivio.mainStatechart.sendEvent('goToPreviousFile');
      }

      if (evt.keyCode === Multivio.KEYCODES.LOWERCASE_O ||
          evt.keyCode === Multivio.KEYCODES.UPPERCASE_O) {
        Multivio.overviewController.togglePalette();
      }

      if (evt.keyCode === Multivio.KEYCODES.UPPERCASE_R ||
          evt.keyCode === Multivio.KEYCODES.LOWERCASE_R) {
        Multivio.currentContentController.rotateRight();
      }    
      if (evt.keyCode === Multivio.KEYCODES.UPPERCASE_L ||
          evt.keyCode === Multivio.KEYCODES.LOWERCASE_L) {
        Multivio.currentContentController.rotateLeft();
      }    

      if (evt.keyCode === Multivio.KEYCODES.PLUS) {
        Multivio.currentContentController.nextZoom();
      }
      if (evt.keyCode === Multivio.KEYCODES.MINUS) {
        Multivio.currentContentController.previousZoom();
      }

      if (evt.keyCode === Multivio.KEYCODES.LOWERCASE_F ||
          evt.keyCode === Multivio.KEYCODES.UPPERCASE_F) {
        Multivio.currentContentController.fitAll({},{});
      }
      if (evt.keyCode === Multivio.KEYCODES.LOWERCASE_N ||
          evt.keyCode === Multivio.KEYCODES.UPPERCASE_N) {
        Multivio.currentContentController.hundredPercentZoom({},{});
      }
      if (evt.keyCode === Multivio.KEYCODES.LOWERCASE_W ||
          evt.keyCode === Multivio.KEYCODES.UPPERCASE_W) {
        Multivio.currentContentController.fitWidth({},{});
      }

    }
    catch (e) {
      SC.Logger.error('Multivio.PdfView: error trying to handle zoom keyboard event');
    }

    return NO;
  }

});
