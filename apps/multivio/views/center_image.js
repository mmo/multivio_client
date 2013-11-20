/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
  License:    See file COPYING
==============================================================================
*/

/** @class

  This is the main visual content displayed by the application. It currently
  supports only image-based content, either image native formats or those
  obtained from PDF page rendering

  @extends SC.ScrollView
*/
Multivio.CenterImageView = SC.ScrollView.extend({
  classNames: "mvo-center-image-scroll-view".w(),
  layout: { top: 0, left: 0, bottom: 0, right: 0},
  // horizontalAlign: SC.ALIGN_RIGHT,
  // verticalAlign: SC.ALIGN_MIDDLE,

  /**
    Overrides SC.View.viewDidResize(). Directly updates the controller, in
    order to avoid unnecessary loops and cross-dependencies (bindings are not
    suitable here)
  */
  viewDidResize: function () {
    sc_super();
    Multivio.currentContentController.set('displayWindowSize', {
        width: this.getPath('frame.width'),
        height: this.getPath('frame.height')
      });
    SC.Logger.debug('Multivio.CenterImageView.viewDidResize(): '
       + this.getPath('frame.width') + 'x'
       + this.getPath('frame.height'));
  },

  contentView: SC.View.design({

    childViews: ['imageView'/*, 'selectionView', 'infoPanel', 'waitingView'*/],
    classNames: "mvo-center-image-scroll-content-view".w(),
    // layout: { centerX: 0, centerY: 0, width: 1, height: 1 },

    resize: function () {
      // TODO set up a binding here?
      var s = Multivio.getPath('currentContentController.imageCurrentSize');
      this.adjust({ width: s.width + 1, height: s.height + 1 });
    }.observes('Multivio.currentContentController.imageCurrentSize'),


    // transitionShow: SC.View.SLIDE_IN,
    // transitionShowOptions: { direction: 'up', delay: 0, duration: 1.0 },
    // transitionIn: SC.View.SLIDE_IN,
    // transitionInOptions: { direction: 'up', delay: 0, duration: 1.0 },
    // 
    // transitionHide: SC.View.SLIDE_OUT,
    // transitionHideOptions: { delay: 0, direction: 'up', duration: 1 },
    // transitionOut: SC.View.SLIDE_OUT,
    // transitionOutOptions: { delay: 0, direction: 'up', duration: 1 },

    imageView: SC.ImageView.design({
      childViews: ['selectionView', 'infoPanel', 'waitingView'],
      classNames: "mvo-center-image-view".w(),
      canLoadInBackground: NO,
      scale: SC.SCALE_NONE,
      align: SC.ALIGN_CENTER,
      valueBinding: SC.Binding.oneWay(
          'Multivio.currentContentController.currentUrl'),

      // transitionShow: SC.View.SLIDE_IN,
      // transitionShowOptions: { direction: 'up', delay: 0, duration: 1.0 },
      // transitionIn: SC.View.SLIDE_IN,
      // transitionInOptions: { direction: 'up', delay: 0, duration: 1.0 },
      // 
      // transitionHide: SC.View.SLIDE_OUT,
      // transitionHideOptions: { delay: 0, direction: 'up', duration: 1 },
      // transitionOut: SC.View.SLIDE_OUT,
      // transitionOutOptions: { delay: 0, direction: 'up', duration: 1 },
      // 
      // transitionAdjust: SC.View.SLIDE_OUT,
      // transitionAdjustOptions: { delay: 0, direction: 'up', duration: 1 },
  
      /**
        Directly update the controller with the image size, in order to avoid
        unnecessary loops and cross-dependencies (bindings not suitable here)
       */
  //     imageInnerFrameDidChange: function () {
  //       var newWidth = 0,
  //           newHeight = 0;
  //       if (this.get('status') === SC.IMAGE_STATE_LOADED) {
  //         newWidth = this.get('innerFrame').width;
  //         newHeight = this.get('innerFrame').height;
  //         Multivio.currentContentController.set('imageCurrentSize',
  //             {width: newWidth, height: newHeight});
  //         this.parentView.adjust(
  //           { width: newWidth,  height: newHeight, centerX: 0 });
  //       }
  // SC.Logger.debug('Multivio.CenterImageView.imageView.imageInnerFrameDidChange(): '
  //      + newWidth + 'x' + newHeight);
  //     }.observes('innerFrame'),

      _statusDidChange: function () {
        var s = this.get('status');
      }.observes('status'),
    }),

    selectionView: SC.CollectionView.design({
      layout: {left: 0, right: 0, top: 0, bottom: 0},
      classNames: 'mvo-selection-view'.w(),
      contentBinding: 'Multivio.currentSearchResultsController.arrangedObjects',
      selectionBinding: 'Multivio.currentSearchResultsController.selection',
      nativeImageSizeBinding: 'Multivio.currentContentController.nativeImageSize',
      rotationAngleBinding: 'Multivio.currentContentController.rotationAngle',

      currentZoomFactor: function () {
        var angle = this.get('rotationAngle');
        if (angle % 180) {
          return this.getPath('frame.height') / this.get('nativeImageSize').width;
        } else {
          return this.getPath('frame.width') / this.get('nativeImageSize').width;
        }
      }.property('nativeImageSize', 'layout', 'rotationAngle'),

      /* TODO: is this necessary? (check with SC.InnerImage.scale) */
      viewDidResize: function () {
        sc_super();
        this.reload(); 
      },

      _selectionDidChange: function () {
        var sel = this.get('selection');
        if (!SC.none(sel) && sel.firstObject()) {
          sel = sel.firstObject();
          var itemView = this.itemViewForContentObject(sel);
          if (itemView) {
            this.scrollToItemView(itemView);
          }
        }
      }.observes('selection'),

      layoutForContentIndex: function (contentIndex) {
        var current = this.get('content').objectAt(contentIndex);
        var zoomFactor = this.get('currentZoomFactor');
        if (current) {
          var angle = this.get('rotationAngle');
          switch (Math.abs(angle % 360)) {
          case 0:
            return {
              top: current.get('y1') * zoomFactor,
              left: current.get('x1') * zoomFactor,
              height: (current.get('y2') - current.get('y1')) * zoomFactor,
              width: (current.get('x2') - current.get('x1')) * zoomFactor
            };
          case 90:
            return {
              right: current.get('y1') * zoomFactor,
              top: current.get('x1') * zoomFactor,
              width: (current.get('y2') - current.get('y1')) * zoomFactor,
              height: (current.get('x2') - current.get('x1')) * zoomFactor
            };
          case 180:
            return {
              bottom: current.get('y1') * zoomFactor,
              right: current.get('x1') * zoomFactor,
              height: (current.get('y2') - current.get('y1')) * zoomFactor,
              width: (current.get('x2') - current.get('x1')) * zoomFactor
            };
          case 270:
            return {
              left: current.get('y1') * zoomFactor,
              bottom: current.get('x1') * zoomFactor,
              width: (current.get('y2') - current.get('y1')) * zoomFactor,
              height: (current.get('x2') - current.get('x1')) * zoomFactor
            };
          }
        }
      },

      mouseDown: function (ev) {
        SC.Logger.debug('Selection: mouseDown');
        sc_super();
        //forward event to parents
        return NO;
        //Multivio.sideToolbarController.closeAll();
      },

      exampleView: SC.View.extend(SC.Control, {
        classNames: "mvo-search-results".w(),
        render: function (context) {
          if (this.get('isSelected')) {
            context.addClass('sel');
          }
        }
      })
    }),

    infoPanel: SC.View.design(Multivio.FadeInOut, {
      classNames: "mvo-info-panel mvo-front-view-transparent".w(),
      layout: { centerX: 0, width: 100, height: 30, top: 16 },
      childViews: ['textView'],
      textView: SC.LabelView.design({
        layout: { centerY: 0, centerX: 0, width: 80, height: 20 },
        textAlign: 'center',
        value: null,
        valueBinding: 'Multivio.currentContentController.infoMessage'
      })
    }),

    waitingView: SC.ImageView.design({
      layout: { centerX: 0, centerY: 0, width: 36, height: 36 },
      isVisible: YES,
      //canvas do not work with animated gifs
      useCanvas: NO,
      value: static_url('images/progress_wheel_medium.gif'),
      classNames: "mvo-waiting".w(),
      isVisible: NO, /*function() {
        // TODO: check if this works
        imageViewStatus =
            this.getPath('parentView.pdfScrollView.contentView.imageView.status');
        return imageViewStatus === SC.IMAGE_STATE_LOADING;
      }.observes('parentView.pdfScrollView.contentView.imageView.status')*/
    })
  })
});
