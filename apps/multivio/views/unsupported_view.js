Multivio.unsupportedDocumentView =  SC.View.design({
  childViews: ['titleView', 'previousButton', 'nextButton'],

  titleView: SC.View.design({
    layout: { top: 0, left: 0, bottom: 0 , right: 0 },
    childViews: 'titleLabel'.w(),

    titleLabel: SC.LabelView.design({
      layout: { width: 500, height: 18 },
      value: "Unsupported document!"
    })
  }),
  previousButton: SC.ButtonView.design({
    layout: {bottom: 10,  left: 10, width: 50, height: 30 },
    action: 'previousFile',
    title: '<<',
    isEnabledBinding: "Multivio.filesController.hasPreviousFile"
  }),

  nextButton: SC.ButtonView.design({
    layout: {bottom: 10,  right: 10, width: 50,  height: 30 },
    action: 'nextFile',
    isEnabledBinding: "Multivio.filesController.hasNextFile",
    title: '>>'
  })
});