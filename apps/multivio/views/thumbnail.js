/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Multivio.thumbnailView = SC.ListItemView.extend({

  displayProperties: ['url', 'pageNumber'],
  //contentIconKey: 'url',
  //contentRightIconKey: 'url'
  //renderDelegateName: 'thumbnailRenderDelegate',

  //layout: { height: 130, width: 130 },

  mouseEntered: function () {
    var jquery = this.$();
    jquery.css('cursor', 'pointer');
    jquery.css('color', '#356aa0');
    return YES;
  },
  mouseExited: function () {
    var jquery = this.$();
    jquery.css('cursor', 'normal');
    jquery.css('color', '#000');
    return YES;
  },
  render: function (context) {
    var content = this.get('content');

    context.push('<img src="', content.get('url'), '"/>');
    context.push('<p>', content.get('pageNumber'), '</p>');
  },
  update: function (jquery) {
    jquery.find('h1').text(this.get('url'));
  }
});
