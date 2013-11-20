/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

/** @class

  STATE DEFINITION

  Becomes active when the application is showing content and is ready for user
  interaction on that content. Its different substates handle different kinds
  of content.

  @author maj
  @extends SC.State
  @since 1.0
*/
Multivio.DisplayingContentState = SC.State.extend({
  /** @scope Multivio.DisplayingContentState.prototype */

  /**
    @default SC.State dispatchingContent
  */
  initialSubstate: 'dispatchingContent',

  /**
    STATE EVENT

    Goes fetching the file corresponding to the given record object

    @param {FileRecord} the record of the destination file
  */
  fetchFile: function (node) {
    // STATE TRANSITION
    this.gotoState('fetchingNextContent', node);
  },

  /**
    Sets the current file as the one indicated in the URL

    @param {String} url The URL of the destination file
  */
  goToFile: function (url) {
    var currentUrl = Multivio.getPath('currentFileNodeController.url');
    if (url !== currentUrl) {
      var record = Multivio.store.find(Multivio.FileRecord, url);
      Multivio.currentFileNodeController.set('content', record);
    }
  },

  /**
    STATE EVENT

    Goes to the next file in the document structure
  */
  goToNextFile: function () {
    var next = Multivio.currentFileNodeController.get('nextFile');
    if (next) {
      Multivio.currentFileNodeController.set('currentIndex', 1);
      Multivio.currentFileNodeController.set('treeItemIsExpanded', NO);
      // STATE TRANSITION
      this.gotoState('fetchingNextContent', next);
    }
  },

  /**
    STATE EVENT

    Goes to the previous file in the file structure
  */
  goToPreviousFile: function () {
    var previous = Multivio.currentFileNodeController.get('hasPreviousFile');
    if (previous) {
      Multivio.currentFileNodeController.set('currentIndex', 1);
      Multivio.currentFileNodeController.set('treeItemIsExpanded', NO);
      // STATE TRANSITION
      this.gotoState('fetchingPreviousContent', previous);
    }
  },

  exitState: function () {
    //close the node in the tree
    Multivio.currentFileNodeController.set('treeItemIsExpanded', NO);
  },

  /**
    SUBSTATE DECLARATION (transient)

    Active while choosing the destination state according to the content type
    of the current file
    @type SC.State
  */
  dispatchingContent: SC.State.design({

    /**
      STATE EVENT (transient)
    */
    enterState: function (fileNode) {
      if (fileNode) {
        //open the node in the tree
        fileNode.set('treeItemIsExpanded', YES);

        //set the currentFileNode and the index
        Multivio.currentFileNodeController.set('content', fileNode);
        Multivio.currentFileNodeController.set('currentIndex', 1);

        //update the treeView selection
        var selection = Multivio.getPath('treeController.selection');
        if (!selection || selection.getPath('firstObject.storeKey') !== fileNode.get('storeKey')) {
          Multivio.treeController.selectObject(fileNode);
        }

        //dispatching
        if (fileNode.get('isPDF')) {
          SC.Logger.debug("PDF....");
          // STATE TRANSITION
          this.gotoState('displayingPDF', fileNode);
          return;
        }
        if (fileNode.get('isImage')) {
          SC.Logger.debug("Image....");
          // STATE TRANSITION
          this.gotoState('displayingImage', fileNode);
          return;
        }
        // STATE TRANSITION
        this.gotoState('displayingUnsupported');
      }
    }

  }),

  /**
    SUBSTATE DECLARATION

    Is active while the application is showing PDF content
    @type SC.State
  */
  displayingPDF: SC.State.design({

    /**
      Binds to the currently selected index in currentFileNodeController,
      which means the part of the content (page, image, ...) that is currently
      displayed on screen
      @type Number
    */
    currentPage: null,
    currentPageBinding: 'Multivio.currentFileNodeController.currentIndex',

    /** */
    enterState: function (fileNode) {

      Multivio.set('currentContentController', Multivio.pdfFileController);

      var viewToChange =
          Multivio.getPath('mainPage.mainPane.centerView.mainContentView');

      if (viewToChange.get('nowShowing') !== 'mainPdfView') {
        viewToChange.set('nowShowing', 'mainPdfView');
        Multivio.getPath('mainPage.mainPdfView').becomeFirstResponder();

        var tc = Multivio.pdfThumbnailsController;
        Multivio.set('currentThumbnailController', tc);

        // add bindings only after the current file is determined
        var tv = Multivio.getPath('mainPage.thumbnailsView.contentView.thumbnailScrollView.contentView');
        tv.bind('content', 'Multivio.pdfThumbnailsController.arrangedObjects');
        tv.bind('selection', 'Multivio.pdfThumbnailsController.selection');
        tv.bind('target', 'Multivio.pdfThumbnailsController');
        // TODO: unbind these afterwards

        // display toolbar (it will fade out by itself)
//        Multivio.getPath('mainPage.bottomToolbarView').displayBar();
      }
      Multivio.pdfFileController.set('content', fileNode);
      Multivio.pdfFileController.set('currentPage', 1);
    },

    /** */
    exitState: function () {
      Multivio.pdfFileController.set('content', null);
      Multivio.set('currentThumbnailController', null);
    },

    /**
      STATE EVENT (internal)

      Goes to the next page, image, ... in the current sequence
      @returns Boolean YES if successful
    */
    goToNextIndex: function () {
      if (Multivio.currentFileNodeController.get('hasNextIndex')) {
        Multivio.currentFileNodeController.set('currentIndex',
            Multivio.currentFileNodeController.get('currentIndex') + 1);
        return YES;
      }
      return NO;
    },

    /**
      STATE EVENT (internal)

      Goes to the previous page, image, ... in the current sequence
      @returns Boolean YES if successful
    */
    goToPreviousIndex: function () {
      if (Multivio.currentFileNodeController.get('hasPreviousIndex')) {
        Multivio.currentFileNodeController.set('currentIndex',
            Multivio.currentFileNodeController.get('currentIndex') - 1);
        return YES;
      }
      return NO;
    },

    /**
      Observes changes in the current page and forwards them to the PDF
      controller
      @private
    */
    _currentPageDidChange: function () {
      var currentPage = this.get('currentPage');
      if (currentPage && currentPage !== Multivio.pdfFileController.get('currentPage')) {
        Multivio.pdfFileController.set('currentPage', currentPage);
        // Multivio.getPath('mainPage.mainPdfView.pdfScrollView.contentView.infoPanel').displayBar();
      }
    }.stateObserves('currentPage')
  }),

  /**
    SUBSTATE DECLARATION

    Is active while the application is showing image content
    @type SC.State
  */
  displayingImage: SC.State.design({
    /** @scope Multivio.DisplayingContentState.displayingImage.prototype */

    /** */
    enterState: function (fileNode) {

      Multivio.set('currentContentController', Multivio.imageFileController);

      var viewToChange =
          Multivio.getPath('mainPage.mainPane.centerView.mainContentView');

      if (viewToChange.get('nowShowing') !== 'mainImageView') {
        viewToChange.set('nowShowing', 'mainImageView');
        Multivio.getPath('mainPage.mainImageView').becomeFirstResponder();

        var ic = Multivio.imageThumbnailsController;
        Multivio.set('currentThumbnailController', ic);

        // add bindings only after the current file is determined
        var tv = Multivio.getPath('mainPage.thumbnailsView.contentView.thumbnailScrollView.contentView');
        tv.bind('content', 'Multivio.imageThumbnailsController.arrangedObjects');
        tv.bind('selection', 'Multivio.imageThumbnailsController.selection');
        tv.bind('target', 'Multivio.imageThumbnailsController');

//        Multivio.getPath('mainPage.mainImageView.bottomToolbar').displayBar();
        // Multivio.getPath('mainPage.mainImageView.imageScrollView.contentView.infoPanel').displayBar();
      }
      Multivio.imageFileController.set('content', fileNode);
    },

    /** */
    exitState: function () {
      Multivio.imageFileController.set('content', null);
    }
  }),

  /**
    SUBSTATE DECLARATION

    Is active while the application is showing unsupported content - a message
    error is shown in that case
    @type SC.State
  */
  displayingUnsupported: SC.State.design({
    /** @scope Multivio.DisplayingContentState.displayingUnsupported.prototype */

    /** */
    enterState: function () {
      var viewToChange = Multivio.getPath('mainPage.mainPane.centerView.mainContentView');
      if (viewToChange.get('nowShowing') !== 'unsupportedFileView') {
        viewToChange.set('nowShowing', 'unsupportedFileView');
      }
    }
  })
});
