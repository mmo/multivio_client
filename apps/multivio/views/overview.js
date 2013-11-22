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
sc_require('controllers/overview.js');

Multivio.overview = SC.PalettePane.create({
  classNames: 'mvo-overview-view'.w(),
  layout: {bottom: 124, right: 30, width: 155, height: 155},
  // TODO: add transitions
  isAnchored: YES,
  
  isShowing: NO,
  isShowingBinding: 'Multivio.overviewController.isShowing',

  // TODO remove any 'overview' observers when possible, to avoid useless overhead

  isShowingDidChange: function () {
    if (this.get('isShowing')) {
      this.append();
    }
    else {
      this.remove();
    }
    console.warn('Multivio.Overview.isShowing=' + this.get('isShowing'))
  }.observes('isShowing'),

  contentView: SC.View.design({
    layout: { top: 5, right: 5, bottom: 5, left: 5 },
    childViews: 'imageView markerView'.w(),
    classNames: 'mvo-overview-content-view'.w(),

    imageView: SC.ImageView.design({
      layout: { top: 0, right: 0, bottom: 0, left: 0 },
      classNames: 'mvo-overview-content-image-view'.w(),
      scale: SC.BEST_FIT,
      //valueBinding: 'Multivio.currentContentController.currentUrl'
    }),
    
    markerView: SC.View.design({
      layout: { top: 0, left: 0, width: 0, height: 0 },
      classNames: 'mvo-overview-content-marker-view'.w(),
      imageDidChange: function () {
        var os = { width: 145, height: 145 }, // overview size
            newLayout = {},
            ws = Multivio.getPath('currentContentController.displayWindowSize'),
            is = Multivio.getPath('currentContentController.imageCurrentSize'),
            mr = { // marker ratio
              width: is.width / Math.max(is.width, is.height),
              height: is.height / Math.max(is.width, is.height)
            };

        newLayout.width =
            Math.floor(os.width * Math.min(ws.width, is.width) / is.width * mr.width);
        newLayout.height =
            Math.floor(os.height * Math.min(ws.height, is.height) / is.height * mr.height);

        this.adjust(newLayout);

console.warn('Multivio.overview.contentView.markerView.newLayout='
+ newLayout.width/os.width + ' x ' + newLayout.height/os.height);

      }//.observes('.parentView.imageView.value')
    })
  })

  // contentView: SC.View.extend({
  //   layout: {top: 5, right: 5, bottom: 5, left: 5},
  //   childViews: ['imageView'],
  //   classNames: "mvo-center-image".w(),
  //   image: null,
  //   imageBinding: "*imageView.image",
  // 
  //   imageDidLoad: function () {
  //     var img_height = this.get('image').height,
  //       img_width = this.get('image').width,
  //       _layout = {};
  // 
  //     if (img_height > 1 && img_width > 1) {
  //       _layout.width = img_width;
  //       _layout.height = img_height;
  //       _layout.centerX = 0;
  //       _layout.centerY = 0;
  //       this.set('layout', _layout);
  //       this.notifyPropertyChange("layer");
  //       SC.Logger.debug('ImageView updated');
  //     }
  //   }.observes('image'),
  // 
  //   imageView: SC.ImageView.extend({
  //     classNames: "mvo-page".w(),
  //     valueBinding: 'Multivio.overviewController.currentUrl',
  //     canLoadInBackground: YES,
  //     imageDidLoad: function (url, imageOrError) {
  //       //TODO: why do I have to adjust width/height as the layout is defined to
  //       //take all the stuffs!
  //       this.adjust('width', this.get('image').width);
  //       this.adjust('height', this.get('image').height);
  //     }.observes('image'),
  // 
  //     //redifined this default method in order remove the defaultBlankImage
  //     _image_valueDidChange: function () {
  //       var value = this.get('imageValue'),
  //         type = this.get('type');
  // 
  //       // check to see if our value has changed
  //       if (value !== this._iv_value) {
  //         this._iv_value = value;
  // 
  //         //this.set('image', SC.BLANK_IMAGE);
  // 
  //         if (type !== SC.IMAGE_TYPE_CSS_CLASS) {
  //           // While the new image is loading use SC.BLANK_IMAGE as a placeholder
  //           this.set('status', SC.IMAGE_STATE_LOADING);
  // 
  //           // order: image cache, normal load
  //           if (!this._loadImageUsingCache()) {
  //             this._loadImage();
  //           }
  //         }
  //       }
  //     }.observes('imageValue').cacheable()
  //   })
  // }),

  // /** @private */
  // show: function () {
  //   this.append();
  // },
  // 
  // hide: function () {
  //   this.remove();
  // }

});
