/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

/**
  @namespace

  Creates the main the main user interface of Multivio.
  
  @since 0.1.0
*/

sc_require('views/unsupported_view.js');
sc_require('views/thumbnails.js');
sc_require('views/pdf_view.js');
sc_require('views/image.js');
sc_require('views/navigation_bar.js');
sc_require('views/title.js');
sc_require('views/help.js');
sc_require('views/tree.js');
sc_require('views/search.js');
sc_require('views/overview.js');

Multivio.mainPage = SC.Page.design({

  // The main pane is made visible on screen at application startup, invoked by
  // the statechart. The child views of this pane are displayed immediately
  // with the pane. Views can be added and removed later.
  // See: http://groups.google.com/group/sproutcore/msg/9f59c491b9c27464
  // and
  // http://groups.google.com/group/sproutcore/browse_thread/thread/914c2c6c0558fcbc/9cc1bb65f0adcd0d
  //
  mainPane: SC.MainPane.design({
    childViews: 'bottomView centerView leftView'.w(),
    classNames: 'mvo-main-pane'.w(),
    defaultResponder: 'Multivio.mainStatechart',

    bottomView: Multivio.TitleView,
    centerView: SC.ContainerView.design(Multivio.innerGradient, {
      layout: { top: 5, left: 40, bottom: 40, right: 5 },
      classNames: 'mvo-container-view'.w()
    }),
    leftView: Multivio.NavigationBar,

    mouseDown: function (ev) {
      SC.Logger.debug('MainPane: mouseDown');
      Multivio.navigationController.closeAll();
    }
  }),

  // All these other views are employed on request, according to the
  // app's workflow; they are each decalred in their own source file (inside
  // the "views" folder)
  mainPdfView: Multivio.mainPdfView,
  mainImageView: Multivio.mainImageView,
  unsupportedFileView: Multivio.unsupportedFileView,
  thumbnailsView: Multivio.thumbnailsView,
  navigationBar: Multivio.NavigationBar,
  helpPane: Multivio.HelpPane,
  titleView: Multivio.TitleView,
  treeView: Multivio.TreeView,
  searchView: Multivio.SearchView,
  overview: Multivio.Overview
});
