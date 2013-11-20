/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('mixins/interface.js');
sc_require('views/thumbnail.js');
sc_require('controllers/thumbnails.js');

Multivio.ThumbnailsView = SC.PalettePane.extend({
  layout: {left: 45, top: 10, width: 150, bottom: 100},
  classNames: 'mvo-palette-pane'.w(),
  isAnchored: YES,
  canBeClosed: YES,
  contentView: SC.View.design({

    childViews: [
      'thumbnailScrollView',
      'thumbnailListModeButtom',
      'thumbnailGridModeButtom'
    ],

    thumbnailScrollView: SC.ScrollView.design(Multivio.InnerGradientThinTopBottom, {
      layout: { left: 3, top: 3, right: 3, bottom: 44 },
      contentView: SC.GridView.design({
        layerId: 'mvo-thumbnails',
        contentValueKey: 'pageNumber',
        contentIconKey: 'url',
        //contentBinding: 'Multivio.pdfThumbnailsController.arrangedObjects',
        //selectionBinding: 'Multivio.pdfThumbnailsController.selection',
        actOnSelect: YES,
        action: 'userClicked',
        target: 'Multivio.currentThumbnailController',
        exampleView: Multivio.thumbnailView,
        rowHeight: 130,
        rowSpacing: 10,
        columnWidth: 130,

        _selectionDidChange: function () {
          var selection = this.getPath('selection').firstObject();
          if (selection && selection.get('pageNumber') > 0) {
            SC.Logger.debug('selection: changed ' + selection.get('pageNumber')); 
            this.scrollToContentIndex(selection.get('pageNumber') - 1);
          }
        }.observes('selection')
      })
    }),

    thumbnailListModeButtom: SC.ImageButtonView.design({
      layout: { height: 32, bottom: 4, width: 32, left: 4 },
      image: 'thumbnail_list_mode',
      title: 'thumbnailListMode',
      buttonBehavior: SC.TOGGLE_ON_BEHAVIOR,
      toolTip: '_ThumbnailListMode'.loc(),
      valueBinding: 'Multivio.currentThumbnailController.thumbnailMode',
      toggleOnValue: 'list'
    }),

    thumbnailGridModeButtom: SC.ImageButtonView.design({
      layout: { height: 32, bottom: 4, width: 32, left: 40 },
      image: 'thumbnail_grid_mode',
      name: 'thumbnailGridMode',
      toolTip: '_ThumbnailGridMode'.loc(),
      valueBinding: 'Multivio.currentThumbnailController.thumbnailMode',
      buttonBehavior: SC.TOGGLE_ON_BEHAVIOR,
      toggleOnValue: 'grid'
    })

  }),

  modalPaneDidClick: function (evt) {
    return this.get('canBeClosed') ? sc_super() : NO;
  }
});
