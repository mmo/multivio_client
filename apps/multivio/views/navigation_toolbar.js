/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('mixins/fadeinout.js');

Multivio.NavigationToolbarView = SC.PalettePane.extend({
  layout: {centerX: 17, bottom: 60, width: 680, height: 48},
  classNames: 'mvo-palette-pane'.w(),
  isAnchored: YES,
  canBeClosed: YES,

  contentView: SC.View.design({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    classNames: 'mvo-front-view-transparent'.w(),
    acceptsFirstResponder: NO,

    childViews: [
      'overviewButton',
      'rotateLeftButton', 'rotateRightButton',
      'previousDocButton', 'previousPageButton',
      'pageEntry',
      'nextPageButton', 'nextDocButton',
      'previousZoomButton', 'nextZoomButton',
      'fitWidthButton', 'fitAllButton', 'hundredPercentButton'],
  
    /**
      Button centerX positions (from left to right), with a first 50-gap and
      32-intervals afterwards:
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
      target: 'Multivio.navigationTarget',
      action: 'rotateLeft',
      title: '-'
    }),
    rotateRightButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: -140, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-rotate-right',
      target: 'Multivio.navigationTarget',
      action: 'rotateRight',
      title: '+'
    }),

    previousDocButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: -80, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-previous-doc',
      target: 'Multivio.mainStatechart',
      action: 'goToPreviousFile',
      title: '<<',
      isEnabledBinding: 'Multivio.navigationTarget.hasPreviousFile'
    }),
    previousPageButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  centerX: -50, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-previous-page',
      action: 'goToPreviousIndex',
      isEnabledBinding: 'Multivio.navigationTarget.hasPreviousIndex',
      title: '<'
    }),

    pageEntry: SC.TextFieldView.design({
      layout: {centerY: 0, centerX: 0, width: 50, height: 24 },
      acceptsFirstResponder: NO,
      isTextArea: NO,
      applyImmediately: NO,
      contentBinding: 'Multivio.currentFileNodeController', 
      contentValueKey: 'currentIndex',
      classNames: 'mvo-pagenr'.w(),
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
            if (value > 0 &&
              value <= Multivio.getPath('navigationTarget.nPages')) {
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
      action: 'goToNextIndex',
      isEnabledBinding: 'Multivio.navigationTarget.hasNextIndex',
      title: '>'
    }),
    nextDocButton: SC.ImageButtonView.design({
      layout: {centerY: 0,  centerX: 82, width: 32,  height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-next-doc',
      target: 'Multivio.mainStatechart',
      action: 'goToNextFile',
      isEnabledBinding: 'Multivio.navigationTarget.hasNextFile',
      title: '>>'
    }),

    previousZoomButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 146, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-zoom-minus',
      target: 'Multivio.navigationTarget',
      action: 'previousZoom',
      keyEquivalent: 'a',
      isKeyResponder: YES,
      isEnabledBinding: 'Multivio.navigationTarget.hasPreviousZoom',
      title: 'z-'
    }),
    nextZoomButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 178, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-zoom-plus',
      target: 'Multivio.navigationTarget',
      action: 'nextZoom',
      keyEquivalent: '+',
      isEnabledBinding: 'Multivio.navigationTarget.hasNextZoom',
      title: 'z+'
    }),

    fitAllButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 242, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-fit-all',
      buttonBehavior: SC.TOGGLE_BEHAVIOR,
      toggleOffValue: NO,
      toggleOnValue: YES,
      valueBinding: 'Multivio.navigationTarget.fitAll',
      title: 'all'
    }),
    fitWidthButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 274, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-fit-width',
      buttonBehavior: SC.TOGGLE_BEHAVIOR,
      toggleOffValue: NO,
      toggleOnValue: YES,
      valueBinding: 'Multivio.navigationTarget.fitWidth',
      title: 'width'
    }),
    hundredPercentButton: SC.ImageButtonView.design({
      layout: {centerY: 0, centerX: 306, width: 32, height: 32 },
      classNames: 'mvo-button-view'.w(),
      image: 'image-button-hundred-percent',
      buttonBehavior: SC.TOGGLE_BEHAVIOR,
      toggleOffValue: NO,
      toggleOnValue: YES,
      valueBinding: 'Multivio.navigationTarget.hundredPercentZoom',
      title: 'hundred'
    })
  })
});
