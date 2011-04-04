// ==========================================================================
// Project:   Multivio.navigationController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Multivio */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
sc_require('views/help.js');
sc_require('views/thumbnails.js');
Multivio.navigationController = SC.ArrayController.create(
/** @scope Multivio.navigationController.prototype */ {

  // TODO: Add your own code here.
  content: [
    SC.Object.create({
      panel: Multivio.HelpPane.create({}),
      icon: static_url("images/icons/24x24/help_dark_24x24.png")
    }),

    SC.Object.create({
      panel: Multivio.thumbnailsView.create({}),
      icon: static_url("images/icons/24x24/thumbnails_dark_24x24.png")
    })

  ],

  _selectionDidChange: function() {
    var sel = this.get('selection');
      SC.Logger.debug('navigationBar: selection changed!');
      if(!SC.none(sel))  {
        sel.firstObject().get('panel').popup(Multivio.getPath('mainPage.mainPane.workspaceView.bottomRightView'));
    }
  }.observes('selection')

}) ;
