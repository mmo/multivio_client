/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

sc_require('views/pdf_view.js');
sc_require('mixins/image.js');
sc_require('controllers/file.js');



/** @class

  This controll the center view to display a pdf content.

  @author jma
  @extends SC.ObjectController
*/
Multivio.pdfFileController = SC.ObjectController.create(Multivio.DisplayImage, {

  //Bindings 
  //contentBinding: SC.Binding.oneWay('Multivio.currentFileNodeController'),
  currentPage: 1,

  _centerViewWidthBinding: SC.Binding.oneWay('Multivio.mainPage.mainPdfView.pdfScrollView.contentView.visibleWidth'),

  _centerViewHeightBinding: SC.Binding.oneWay('Multivio.mainPage.mainPdfView.pdfScrollView.contentView.visibleHeight'),
  
  centerImageBinding: SC.Binding.oneWay('Multivio.mainPage.mainPdfView.pdfScrollView.contentView.image'),

  _centerImageStatusBinding: SC.Binding.oneWay('Multivio.mainPage.mainPdfView.pdfScrollView.contentView.imageView.status'),

  _appOptionsBinding: SC.Binding.oneWay('Multivio.inputParameters.options'),

  _zoomScale: [0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 4.0],
  _currentZoomIndex: 7,
  mimeRegExp: '.*?/pdf',

  _currentUrl: function () {
    return "page_nr=%@&url=%@".fmt(this.get('currentPage'), this.get('url'));
  }.property('url', 'currentPage').cacheable(),

  infoMessage: function () {
    return "Page: %@/%@".fmt(this.get('currentPage'), this.get('nPages'));
  }.property('currentPage', 'nPages'),

  hundredPercentZoom: function () {
    this.setIfChanged('_currentZoomIndex', 7);
    this.setIfChanged('mode', Multivio.ZOOM_MODE);
  },

  hundredPercentZoomEnabled: function () {
    if (this.get('_currentZoomIndex') !== 7 || 
        this.get('mode') !== Multivio.ZOOM_MODE) {
      return YES;
    }
    return NO;
  }.property('_currentZoomIndex', 'mode').cacheable()
  
});
