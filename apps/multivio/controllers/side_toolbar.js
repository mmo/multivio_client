/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
sc_require('views/help.js');
sc_require('views/thumbnails.js');
sc_require('views/tree.js');
sc_require('views/search.js');

Multivio.sideToolbarController = SC.ArrayController.create({

  allowsMultipleSelection: YES,

  /**
    Some of the tools in the sidebar are mutually exclusive: the search, tree, thumbnail
    and help panels. Only one of them can be open at the same time.
  */
  currentExclusivePanel: null,

  content: [
    SC.Object.create({
      panel: 'mainPage.searchView',
      icon: static_url("images/icons/24x24/search_light_24x24.png"),
      isExclusive: YES
    }),
    
    SC.Object.create({
      panel: 'mainPage.treeView',
      icon: static_url("images/icons/24x24/tree_light_24x24.png"),
      isExclusive: YES
    }),

    SC.Object.create({
      panel: 'mainPage.thumbnailsView',
      icon: static_url("images/icons/24x24/thumbnails_light_24x24.png"),
      isExclusive: YES
    }),

    SC.Object.create({
      panel: 'download',
      icon: static_url("images/icons/24x24/download_light_24x24.png"),
      action: 'download',
      isExclusive: NO
    }),
    
    SC.Object.create({
      panel: 'mainPage.bottomToolbarView',
      icon: static_url("images/icons/24x24/show_toolbar_light_24x24.png"),
      //action: 'showBottomToolbar',
      isExclusive: NO
    }),

    SC.Object.create({
      panel: 'mainPage.helpPane',
      icon: static_url("images/icons/24x24/help_light_24x24.png"),
      isExclusive: YES
    })
  ],

  _selectionDidChange: function () {
    var panelName;
    var sel = this.get('selection');
    SC.Logger.debug('sideToolbar: selection changed! nb of items: ' + sel.length());
    if (!SC.none(sel) && sel.length() > 0) {
      var panelName = sel.firstObject().get('panel');
      var action = sel.firstObject().get('action');
      var previousExclusivePanel = this.get('currentExclusivePanel');
      if (!SC.none(previousExclusivePanel) && panelName !== previousExclusivePanel) {
        if (Multivio.getPath(previousExclusivePanel).remove) {
          Multivio.getPath(previousExclusivePanel).remove();
        }
      }
      this.set('currentExclusivePanel', panelName);
      SC.Logger.debug('New excluisve panel: ' + panelName);
      if (Multivio.getPath(panelName)) {
        Multivio.getPath(panelName).append();
      } else {
        eval("this." + action + "()");
      }
    }
    if (sel.length() === 0) {
      panelName = this.get('currentExclusivePanel');
      if (!SC.none(panelName)) {
        if (Multivio.getPath(panelName)) {
          Multivio.getPath(panelName).remove();
        }
      }
      this.set('currentExclusivePanel', undefined);
    }
  }.observes('selection'),

  /**
    Close all palettes
  */
  closeAll: function () {
    this.deselectObjects(this.get('selection'));
  },

  performDownload: function () {
    var url = Multivio.getPath('currentFileNodeController.url');
    if (parseInt(SC.browser.msie, 0) === 7) {
      window.location.href = url;
    } else {
      window.open(url);
    }
  },

  download: function () {
    this.deselectObject(this.findProperty('panel', 'download'));
    SC.AlertPane.info({
      message: "Download current File",
      description: "File size is: %@"
        .fmt(Multivio.getPath('currentFileNodeController.humanReadableFileSize')),
      caption: "It will open it in a new window",
      buttons: [
        { 
          title: "Continue",
          action: Multivio.sideToolbarController.performDownload
        },
        { 
          title: "Cancel"
        }
      ]
    });
  }

});
