/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Multivio.TitleView = SC.View.extend({

  layout: {bottom: 0, left: 36, height: 36, right: 10},
  classNames: 'mvo-title-view'.w(),
  childViews: 'titleLabel'.w(),

  titleLabel: SC.LabelView.design({
    layout: { top: 5, left: 5, right: 5 },
    classNames: 'mvo-title-label metadata'.w(),
    value: "Welcome on pdfView",
    contentBinding: 'Multivio.rootNodeController',
    contentValueKey: 'title'
  })

});
