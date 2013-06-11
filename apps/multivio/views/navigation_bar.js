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
sc_require('views/navigation_item.js');
sc_require('controllers/navigation.js');

Multivio.NavigationBarView = SC.SourceListView.design({
  classNames: 'mvo-navigation-bar'.w(),
  allowDeselectAll: YES,
  useToggleSelection: NO,
  acceptsFirstResponder: NO,
  selectOnMouseDown: YES,
  layout: { top: 12, left: 4, bottom: 40, width: 32},
  layerId: 'mvo-navigation-bar',
  contentValueKey: 'panel',
  contentIconKey: 'icon',
  selectionBinding: 'Multivio.navigationController.selection',
  contentBinding: 'Multivio.navigationController.content',
  exampleView: Multivio.NavigationItemView,
  rowHeight: 32,
  rowSpacing: 8,

  _hello: function () {
    SC.Logger.debug('hello');
  },

  //bug correction
  // mouseDown: function (ev) {
  //   var status = sc_super();
  //   var itemView      = this.itemViewForEvent(ev);
  //   SC.Logger.debug('hello');
  //   // recieved a mouseDown on the collection element, but not on one of the 
  //   // childItems... unless we do not allow empty selections, set it to empty.
  //   // Toggle the selection if selectOnMouseDown is true
  //   if (this.get('useToggleSelection')) {
  //     if (this.get('selectOnMouseDown')) {
  //       if (!itemView) {
  //         if (this.get('allowDeselectAll')) {
  //           this.select(null, false);
  //         }
  //         return YES;
  //       }
  //     }
  //   }
  //   return status;
  // },

  _didChange: function () {
    SC.Logger.debug('itemView: changed'); 
  }.observes('selection')

});
