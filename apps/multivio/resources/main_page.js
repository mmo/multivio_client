/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

/**
  @namespace

  Defines the main user interface of Multivio.
  
  @since 0.1.0
*/

sc_require('views/unsupported_file.js');
sc_require('views/thumbnails.js');
sc_require('views/pdf.js');
sc_require('views/image.js');
sc_require('views/side_toolbar.js');
sc_require('views/title.js');
sc_require('views/help.js');
sc_require('views/tree.js');
sc_require('views/search.js');
sc_require('views/overview.js');

/**
  "A Page object is used to store a set of views that can be lazily configured as
  needed...", in SC Guides http://guides.sproutcore.com/views.html

  The 'mainPage' contains references to all the top-level views that are employed
  throughout the application
*/
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

    centerView: SC.View.design(Multivio.innerGradient, {
      layout: { top: 5, left: 40, bottom: 40, right: 5 },
      classNames: 'mvo-center-view'.w(),
      childViews: 'mainContentView'.w(),
      
      mainContentView: SC.ContainerView.design({
        classNames: 'mvo-container-view'.w(),
        layout: { top: 5, left: 5, bottom: 5, right: 5 }
      }),
    }),

    leftView: Multivio.SideToolbarView,

    mouseDown: function (ev) {
      SC.Logger.debug('MainPane: mouseDown');
      Multivio.sideToolbarController.closeAll();
    }
  }),

  // All these other views are employed on request, according to the app's workflow;
  // they are each declared in their own source file (in the "views" folder)
  mainPdfView: Multivio.PdfView,
  mainImageView: Multivio.ImageView,
  unsupportedFileView: Multivio.UnsupportedFileView,
  thumbnailsView: Multivio.ThumbnailsView,
  sideToolbar: Multivio.SideToolbarView,
  helpPane: Multivio.HelpPane,
  titleView: Multivio.TitleView,
  treeView: Multivio.TreeView,
  searchView: Multivio.SearchView,
  overview: Multivio.Overview,
  bottomToolbarView: Multivio.NavigationToolbarView

});
