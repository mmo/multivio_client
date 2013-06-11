/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('mixins/fadeinout.js');
sc_require('views/center_image.js');
sc_require('controllers/pdf.js');

Multivio.mainPdfView =  SC.View.design({
  classNames: 'mvo-main-pdf-view'.w(),
  childViews: ['waitingView', 'pdfScrollView', 'bottomToolbar'], 
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
    contentView: Multivio.CenterImage.design({
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
  }),


  bottomToolbar: SC.NavigationBarView.design(SC.Animatable, Multivio.FadeInOut, {
    childViews: [
      'overviewButton',
      'rotateLeftButton', 'rotateRightButton',
      'previousDocButton', 'previousPageButton',
      'pageEntry',
      'nextPageButton', 'nextDocButton',
      'previousZoomButton', 'nextZoomButton',
      'fitWidthButton', 'fitAllButton', 'hundredPercentButton'],
    classNames: "mvo-front-view-transparent".w(),
    layout: { centerX: 0, width: 660, height: 48, bottom: 20 },
    acceptsFirstResponder: NO,
    
    /**
      Button centerX positions (from left to right), with a first 50-gap and 32-intervals
      afterwards:
      -306, -274, -242, -210, -178, -146, -114, -82, -50,
      0,
      50, 82, 114, 146, 178, 210, 242, 274, 306
    */
    
    overviewButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: -230, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-overview',
      buttonBehavior: SC.TOGGLE_BEHAVIOR,
      toggleOffValue: NO,
      toggleOnValue: YES,
      //value: null,
      valueBinding: 'Multivio.overviewController.showPalette',
      title: 'overview'
    }),

    rotateLeftButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: -170, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-rotate-left',
      target: 'Multivio.pdfFileController',
      action: 'rotateLeft',
      title: '-'
    }),
    rotateRightButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: -140, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-rotate-right',
      target: 'Multivio.pdfFileController',
      action: 'rotateRight',
      title: '+'
    }),

    previousDocButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: -80, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-previous-doc',
      action: 'goToPreviousFile',
      title: '<<',
      isEnabledBinding: "Multivio.pdfFileController.hasPreviousFile"
    }),
    previousPageButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  centerX: -50, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-previous-page',
      //target: 'Multivio.pdfFileController',
      action: 'goToPreviousIndex',
      isEnabledBinding: 'Multivio.pdfFileController.hasPreviousIndex',
      title: '<'
    }),

    pageEntry: SC.TextFieldView.design({
      layout: {centerY: 0, centerX: 0, width: 50, height: 24 },
      acceptsFirstResponder: NO,
      isTextArea: NO,
      applyImmediately: NO,
      contentBinding: 'Multivio.pdfFileController', 
      contentValueKey: 'currentPage',
      classNames: "mvo-pagenr".w(),
      validator: SC.Validator.PositiveInteger.create({
        validateKeyDown: function (form, field, charStr) {
          var isPositiveInt = sc_super(),
            text = field.$input().val(),
            value = parseInt(text, 0);

          if (isPositiveInt) {
            if (!text) {
              text = '';
            }
            text += charStr;
            if (value > 0 && value <= Multivio.getPath('pdfFileController.nPages')) {
              return YES;
            }
          }
          return NO;
        }
      })
    }),

    nextPageButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 50, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-next-page',
      //target: 'Multivio.pdfFileController',
      action: 'goToNextIndex',
      isEnabledBinding: 'Multivio.pdfFileController.hasNextIndex',
      title: '>'
    }),
    nextDocButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  centerX: 82, width: 32,  height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-next-doc',
      action: 'goToNextFile',
      isEnabledBinding: "Multivio.pdfFileController.hasNextFile",
      title: '>>'
    }),

    previousZoomButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 146, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-zoom-minus',
      target: 'Multivio.pdfFileController',
      action: 'previousZoom',
      keyEquivalent: 'a',
      isKeyResponder: YES,
      isEnabledBinding: 'Multivio.pdfFileController.hasPreviousZoom',
      title: 'z-'
    }),
    nextZoomButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 178, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-zoom-plus',
      target: 'Multivio.pdfFileController',
      action: 'nextZoom',
      keyEquivalent: '+',
      isEnabledBinding: 'Multivio.pdfFileController.hasNextZoom',
      title: 'z+'
    }),

    fitAllButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 242, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-fit-all',
      buttonBehavior: SC.TOGGLE_BEHAVIOR,
      toggleOffValue: NO,
      toggleOnValue: YES,
      valueBinding: 'Multivio.pdfFileController.fitAll',
      title: 'all'
    }),
    fitWidthButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 274, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-fit-width',
      buttonBehavior: SC.TOGGLE_BEHAVIOR,
      toggleOffValue: NO,
      toggleOnValue: YES,
      valueBinding: 'Multivio.pdfFileController.fitWidth',
      title: 'width'
    }),
    hundredPercentButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 306, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-hundred-percent',
      target: 'Multivio.pdfFileController',
      action: 'hundredPercentZoom',
      keyEquivalent: '=',
      isEnabledBinding: 'Multivio.pdfFileController.hundredPercentZoomEnabled',
      title: 'hundred'
    })
  })
});
