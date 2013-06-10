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
Multivio.NavigationItem = SC.ListItemView.extend({

  displayProperties: ['icon', 'panel'],
  classNames: 'mvo-navigation-item mvo-button-view'.w(),
  layout: {height: 32, centerX: 0, centerY: 0, width: 32},
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
    var style = 'margin: 4px;';
    context.push('<img style="', style,'" src="', content.get('icon'), '"/>');
  },
  update: function (jquery) {
    jquery.find('h1').text(this.get('url'));
  }

});
