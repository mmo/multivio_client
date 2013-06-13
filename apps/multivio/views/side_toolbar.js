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
sc_require('views/side_toolbar_item.js');
sc_require('controllers/side_toolbar.js');

//Multivio.SideToolbarView = SC.SourceListView.design({
Multivio.SideToolbarView = SC.ListView.design({
  classNames: 'mvo-side_toolbar'.w(),
  allowDeselectAll: YES,
  useToggleSelection: YES,
  acceptsFirstResponder: NO,
//  selectOnMouseDown: YES,
  layout: { top: 12, left: 4, bottom: 40, width: 32},
  layerId: 'mvo-side-toolbar',
  contentValueKey: 'panel',
  contentIconKey: 'icon',
  selectionBinding: 'Multivio.sideToolbarController.selection',
  contentBinding: 'Multivio.sideToolbarController.content',
  exampleView: Multivio.SideToolbarItemView,
  rowHeight: 32,
  rowSpacing: 8

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

});
