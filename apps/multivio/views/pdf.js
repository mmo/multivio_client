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


Multivio.PdfView =  SC.View.extend({
  classNames: 'mvo-main-pdf-view'.w(),
  childViews: ['waitingView', 'pdfScrollView'],
  acceptsFirstResponder: YES,
  keyDown: function (evt) {
    SC.Logger.debug('KeyDown: ' + evt.keyCode);
    if (evt.keyCode === 38) {
      // STATECHART EVENT TRIGGER
      Multivio.mainStatechart.sendEvent('goToPreviousIndex');
    }
    if (evt.keyCode === 40) {
      // STATECHART EVENT TRIGGER
      Multivio.mainStatechart.sendEvent('goToNextIndex');
    }
    if (evt.keyCode === 39) {
      // STATECHART EVENT TRIGGER
      Multivio.mainStatechart.sendEvent('goToNextFile');
    }
    if (evt.keyCode === 37) {
      // STATECHART EVENT TRIGGER
      Multivio.mainStatechart.sendEvent('goToPreviousFile');
    }
    return NO;
  }, 

  waitingView: SC.ImageView.design({
    layout: { centerX: 0, centerY: 0, width: 36, height: 36 },
    isVisible: YES,
    //canvas do not work with animated gifs
    useCanvas: NO,
    isVisibleBinding: 'Multivio.pdfFileController.loadingPage',
    value: static_url('images/progress_wheel_medium.gif'),
    classNames: "mvo-waiting".w()
  }),

  pdfScrollView: SC.ScrollView.design({
    classNames: "mvo-pdf-scroll-view".w(),
    layout: { top: 0, left: 0, bottom: 0, right: 0},
    contentView: Multivio.CenterImageView.design({
      layout: { centerX: 0, centerY: 0 },
      init: function () {
        sc_super();
        this.get('imageView').bind('value', 'Multivio.pdfFileController.currentUrl');
        this.get('selectionView').bind('nativeSize', 'Multivio.pdfFileController.nativeSize');
        this.get('selectionView').bind('rotationAngle', 'Multivio.pdfFileController.rotationAngle');
        this.get('selectionView').bind('content', 'Multivio.currentSearchResultsController.arrangedObjects');
        this.get('selectionView').bind('selection', 'Multivio.currentSearchResultsController.selection');
        this.getPath('infoPanel.textView').bind('value', 'Multivio.pdfFileController.infoMessage');
      }
    })
  })
});
