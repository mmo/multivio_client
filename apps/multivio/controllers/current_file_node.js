/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

/** @class

  This is the controller is the single selection of the Multivio.filesController.

  @author jma
  @extends SC.ObjectController
*/

Multivio.currentFileNodeController = SC.ObjectController.create({
  currentIndex: null,

/*********************************************************************************/
  hasNextIndex: function () {
    var nPages = this.get('nPages');
    var ci = this.get('currentIndex');

    if (nPages && ci >= 0) {
      return ci < nPages ? YES : NO;
    }
    return NO;
  }.property('nPages', 'currentIndex').cacheable(),

  hasPreviousIndex: function () {
    var nPages = this.get('nPages'),
      ci = this.get('currentIndex');
    if (nPages && ci > 0) {
      return ci > 1 ? YES : NO;
    }
    return NO;
  }.property('nPages', 'currentIndex').cacheable(),

  treeItemChildrenObserves: function () {
    if (this.get('isContentNode')) {
      Multivio.treeController.update();
    }
    this.set('treeItemIsExpanded', YES);
  }.observes('treeItemChildren')

});

Multivio.rootNodeController = SC.ObjectController.create({

  _childrenDidChange: function () {
    if (this.get('children')) {
      this.set('treeItemIsExpanded', YES);
    }
  }.observes('children')

});
