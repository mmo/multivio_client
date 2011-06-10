// ==========================================================================
// Project:   Multivio.TreeView
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Multivio */

/** @class

(Document Your View Here)

@extends SC.View
*/
sc_require('controllers/tree.js');
Multivio.TreeViewItem = SC.ListItemView.extend(SC.AutoResize,{

  // TODO: Add your own code here.
  classNames: ['mvo-toc-entry'],
  supportsAutoResize: YES,
  displayProperties: ['title', 'icon'],
  contentIconKey: 'icon',
  contentValueKey: 'title',
  iconWidth: 32,
  hasContentIcon: function() {
    var content = this.get('content');
    return content.get('icon') ? YES: NO;
  }.property('content.icon'),


  autoResizeText: function() {
    return this.getPath('content.title');
  }.property('content'),

  autoResizeLayer: function() {
      return this.get('layer');
  }.property(),

  autoResizePadding: function() {
    var width = 0;
    width = this.get('iconWidth') + (this.get('outlineLevel') + 1) * this.get('outlineIndent');
    return {width: width, height: 0};
  }.property('outlineLevel', 'outlineIndent', 'iconWidth').cacheable(),

  _measureSizeDidChange: function () {
    var contentWidth = this.get('measuredSize').width;
    var parentView = this.get('parentView');
    if(contentWidth > parentView.get('frame').width) {
      parentView.adjust('width', contentWidth);
    }
  }.observes('measuredSize')
});

Multivio.TreeView = SC.PickerPane.design({
  isAnchored: YES,
  isModal: NO,
  layout: { width: 314, bottom: 100},
  layerId: 'mvo-tree-view',
  canBeClosed: YES,
  contentView: SC.ScrollView.design({
    contentView: SC.SourceListView.design({
      rowHeight: 18,
      rowSpacing: 4,
      contentValueKey: 'title',
      contentBinding: 'Multivio.treeController.arrangedObjects',
      selectionBinding: 'Multivio.treeController.selection',
      exampleView: Multivio.TreeViewItem

    })
  }),

  modalPaneDidClick: function(evt) {
    if(this.get('canBeClosed'))
      {
        return sc_super();
      } else {
        return NO ;
      }
  }

});
