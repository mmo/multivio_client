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

  /**
    Overrides SC.View.viewDidResize(). Directly updates the controller, in
    order to avoid unnecessary loops and cross-dependencies (bindings are not
    suitable here)
  */
  containerViewDidResize: function () {
    // sc_super();
    Multivio.currentContentController.set('displayWindowSize', {
        width: this.getPath('containerView.frame.width'),
        height: this.getPath('containerView.frame.height')
      });
    SC.Logger.debug('Multivio.CenterImageView.viewDidResize(): '
       + this.getPath('containerView.frame.width') + 'x'
       + this.getPath('containerView.frame.height'));
  }.observes('containerView.frame'),

  contentView: SC.View.design({

    childViews: ['imageView'/*, 'selectionView'*/, 'infoPanel', 'waitingView'],
    classNames: "mvo-center-image-scroll-content-view".w(),
    // layout: { centerX: 0, centerY: 0, width: 1, height: 1 },

    resize: function () {
      // SC.RunLoop.begin();
      var is = Multivio.getPath('currentContentController.imageCurrentSize');
      var ws = Multivio.getPath('currentContentController.displayWindowSize');
      this.adjust({
          width: Math.max(is.width, ws.width),
          height: Math.max(is.height, ws.height)
        });
      // SC.RunLoop.end();
    }.observes('Multivio.currentContentController.imageCurrentSize'),

    imageView: SC.ImageView.design({
      classNames: "mvo-center-image-view".w(),
      canLoadInBackground: YES,
      useImageQueue: NO,
      scale: SC.SCALE_NONE,
      align: SC.ALIGN_CENTER,
      // valueBinding: SC.Binding.oneWay(
      //     'Multivio.currentContentController.currentUrl'),

      urlDidChange: function () {
        this.set('isVisible', NO);
        this.invokeLater(function () {
            this.set('value', Multivio.getPath('currentContentController.currentUrl'));
          }, 300);
      }.observes('Multivio.currentContentController.currentUrl'),

      transitionShow: SC.View.FADE_IN,
      transitionShowOptions: { delay: 0, duration: 0.6 },
      transitionHide: SC.View.FADE_OUT,
      transitionHideOptions: { delay: 0, duration: 0.2 },

      isLoading: NO,

      statusDidChange: function () {
        if (this.get('status') === SC.IMAGE_STATE_LOADING) {
          this.set('isLoading', YES);
        }
        else {
          this.set('isLoading', NO);
        }
      }.observes('status'),
      
      valueDidChange: function () {
        // SC.run(function () { this.set('isVisible', YES); });
        this.set('isVisible', YES);
      }.observes('value')

    }),

    selectionView: SC.CollectionView.design({
      layout: {left: 0, right: 0, top: 0, bottom: 0},
      classNames: 'mvo-selection-view'.w(),
      contentBinding: 'Multivio.currentSearchResultsController.arrangedObjects',
      selectionBinding: 'Multivio.currentSearchResultsController.selection',
      nativeImageSizeBinding: 'Multivio.currentContentController.nativeImageSize',
      rotationAngleBinding: 'Multivio.currentContentController.rotationAngle',

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
        var factor =
          Multivio.getPath('currentContentController.exactScaleFactor');

        if (current) {
          var angle = this.get('rotationAngle');
          switch (Math.abs(angle % 360)) {
          case 0:
            return {
              top: current.get('y1') * factor,
              left: current.get('x1') * factor,
              height: (current.get('y2') - current.get('y1')) * factor,
              width: (current.get('x2') - current.get('x1')) * factor
            };
          case 90:
            return {
              right: current.get('y1') * factor,
              top: current.get('x1') * factor,
              width: (current.get('y2') - current.get('y1')) * factor,
              height: (current.get('x2') - current.get('x1')) * factor
            };
          case 180:
            return {
              bottom: current.get('y1') * factor,
              right: current.get('x1') * factor,
              height: (current.get('y2') - current.get('y1')) * factor,
              width: (current.get('x2') - current.get('x1')) * factor
            };
          case 270:
            return {
              left: current.get('y1') * factor,
              bottom: current.get('x1') * factor,
              width: (current.get('y2') - current.get('y1')) * factor,
              height: (current.get('x2') - current.get('x1')) * factor
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

      exampleView: SC.View.design(SC.Control, {
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
      layout: { top: 16, right: 16, width: 100, height: 30 },
      childViews: ['textView'],
      textView: SC.LabelView.design({
        layout: { centerY: 0, centerX: 0, width: 80, height: 20 },
        textAlign: 'center',
        value: null,
        valueBinding: 'Multivio.currentContentController.infoMessage'
      })
    }),

    waitingView: SC.ImageView.design({
      classNames: "mvo-waiting".w(),
      layout: { centerX: 0, centerY: 0, width: 36, height: 36 },
      value: static_url('images/progress_wheel_medium.gif'),
      isVisible: NO,
      // isVisibleBinding: SC.Binding.oneWay('.parentView.imageView.isLoading').bool(),
      useCanvas: NO  // canvas does not work with animated gifs
    })
  })
});
