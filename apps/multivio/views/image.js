/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('mixins/fadeinout.js');
sc_require('controllers/image_file.js');
sc_require('views/center_image.js');

Multivio.ImageView =  SC.View.extend({
  classNames: 'mvo-main-image-view'.w(),
  childViews: ['waitingView', 'imageScrollView', 'bottomToolbar'],
  classNames: 'mvo-main-image-view'.w(),

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
  }),

  bottomToolbar: SC.NavigationBarView.design(SC.Animatable, Multivio.FadeInOut, {
    childViews: ['previousButton', 'nextButton', 'rotateRightButton', 'rotateLeftButton', 'nextZoomButton', 'previousZoomButton', 'nextPageButton', 'previousPageButton', 'fitWidthButton', 'fitAllButton'],
    classNames: "mvo-bottom-toolbar mvo-front-view-transparent".w(),
    layout: { centerX: 0, width: 410, height: 48, bottom: 20 },
    //acceptsFirstResponder: NO,
    
    previousButton: SC.ImageButtonView.design({
      image: 'image-button-previous-doc',
      layout: {centerY: 0,  left: 10, width: 32, height: 32 },
      action: 'goToPreviousFile',
      title: '<<',
      isEnabledBinding: "Multivio.currentFileNodeController.hasPreviousFile"
    }),

    nextButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  left: 40, width: 32,  height: 32 },
      image: 'image-button-next-doc',
      action: 'goToNextFile',
      isEnabledBinding: "Multivio.currentFileNodeController.hasNextFile",
      title: '>>'
    }),
    
    rotateLeftButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  left: 100, width: 32, height: 32 },
      image: 'image-button-rotate-left',
      target: 'Multivio.imageFileController',
      action: 'rotateLeft',
      title: '-'
    }),
    rotateRightButton: SC.ImageButtonView.design({
      image: 'image-button-rotate-right',
      layout: {centerY: 0,  left: 130, width: 32, height: 32 },
      target: 'Multivio.imageFileController',
      action: 'rotateRight',
      title: '+'
    }),
    
    previousPageButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  left: 180, width: 32, height: 32 },
      image: 'image-button-previous-page',
      action: 'goToPreviousIndex',
      isEnabledBinding: 'Multivio.currentFileNodeController.hasPreviousIndex',
      title: '<'
    }),

    nextPageButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  left: 210, width: 32, height: 32 },
      image: 'image-button-next-page',
      action: 'goToNextIndex',
      isEnabledBinding: 'Multivio.currentFileNodeController.hasNextIndex',
      title: '>'
    }),


    previousZoomButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  left: 260, width: 32, height: 32 },
      image: 'image-button-zoom-minus',
      target: 'Multivio.imageFileController',
      action: 'previousZoom',
      keyEquivalent: 'a',
      isKeyResponder: YES,
      isEnabledBinding: 'Multivio.imageFileController.hasPreviousZoom',
      title: 'z-'
    }),
    

    nextZoomButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  left: 290, width: 32, height: 32 },
      image: 'image-button-zoom-plus',
      target: 'Multivio.imageFileController',
      action: 'nextZoom',
      keyEquivalent: '+',
      isEnabledBinding: 'Multivio.imageFileController.hasNextZoom',
      title: 'z+'
    }),

    fitAllButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  left: 340, width: 32, height: 32 },
      image: 'image-button-fit-all',
      buttonBehavior: SC.TOGGLE_BEHAVIOR,
      toggleOffValue: NO,
      toggleOnValue: YES,
      valueBinding: 'Multivio.imageFileController.fitAll',
      title: 'all'
    }),

    fitWidthButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  left: 370, width: 32, height: 32 },
      image: 'image-button-fit-width',
      buttonBehavior: SC.TOGGLE_BEHAVIOR,
      toggleOffValue: NO,
      toggleOnValue: YES,
      valueBinding: 'Multivio.imageFileController.fitWidth',
      title: 'width'
    })
  })
});
