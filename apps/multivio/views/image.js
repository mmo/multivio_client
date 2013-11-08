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

Multivio.ImageView =  SC.View.extend({
  classNames: 'mvo-main-image-view'.w(),
  childViews: ['waitingView', 'imageScrollView'],

  //acceptsFirstResponder: YES,
  keyDown: function (evt) {
    SC.Logger.debug('KeyDown: ' + evt.keyCode);
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
    classNames: 'mvo-waiting-view mvo-waiting'.w(),
    isVisible: YES,
    //canvas do not work with animated gifs
    useCanvas: NO,
    isVisibleBinding: 'Multivio.imageFileController.loadingPage',
    value: static_url('images/progress_wheel_medium.gif')
  }),

  imageScrollView: SC.ScrollView.design({
    classNames: "mvo-image-scroll-view".w(),
    layout: { top: 0, left: 0, bottom: 0, right: 0},
    contentView: Multivio.CenterImageView.design({
      layout: { centerX: 0, centerY: 0 },
      init: function () {
        sc_super();
        this.get('imageView').bind('value', 'Multivio.imageFileController.currentUrl');
        this.get('selectionView').bind('nativeSize', 'Multivio.imageFileController.nativeSize');
        this.get('selectionView').bind('rotationAngle', 'Multivio.imageFileController.rotationAngle');
        this.getPath('infoPanel.textView').bind('value', 'Multivio.imageFileController.infoMessage');
      }
    })
  })
});
