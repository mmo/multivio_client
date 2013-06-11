/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

Multivio.UnsupportedFileView =  SC.View.extend({
  childViews: ['titleView', 'previousButton', 'nextButton'],

  titleView: SC.View.design({
    layout: { top: 0, left: 0, bottom: 0, right: 0 },
    childViews: 'titleLabel'.w(),

    titleLabel: SC.LabelView.design({
      layout: { width: 500, height: 18 },
      value: "Unsupported file type!"
    })
  }),
  previousButton: SC.ButtonView.design({
    layout: {bottom: 10,  left: 10, width: 50, height: 30 },
    action: 'goToPreviousFile',
    title: '<<',
    isEnabledBinding: "Multivio.currentFileNodeController.hasPreviousFile"
  }),

  nextButton: SC.ButtonView.design({
    layout: {bottom: 10,  right: 10, width: 50,  height: 30 },
    action: 'goToNextFile',
    isEnabledBinding: "Multivio.currentFileNodeController.hasNextFile",
    title: '>>'
  })
});
