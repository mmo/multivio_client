/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/
/*globals Multivio */

sc_require('resources/main_page.js');
sc_require('controllers/files.js');

/**
@class

  One of the application states: becomes active when the application is ready
  for user interaction

@author maj
@extends Ki.State
  @since 1.0
*/
Multivio.ApplicationReadyState = Ki.State.extend({

  initialSubstate: 'contentReady',

  enterState: function() {
    Multivio.getPath('mainPage.mainPane').append();
    //Multivio.filesController.fetchFile(Multivio.inputParameters.get('url'));
    //Multivio.getPath('mainPage.mainPane').becomeKeyPane();
  },
  loadApp: function() {
    this.gotoState('initializing'); 
  },

  exitState: function() {
    Multivio.getPath('mainPage.mainPane').remove();
  },

  applicationError: function(){
    this.gotoState('error');
  },
  

  loadingContentFile: Ki.State.design({

    initialSubstate: 'receivedFile',
    //for substate
    rootNode: undefined,
    first: YES,

    enterState: function() {
      if(SC.none(this.get('rootNode'))) {
        this.gotoState('contentReady');
        return;
      }
      var pdfView = Multivio.getPath('mainPage.mainPdfView.waitingView');
      pdfView.set('isVisible', YES);
    },

    exitState: function() {
      var pdfView = Multivio.getPath('mainPage.mainPdfView.waitingView');
      pdfView.set('isVisible', NO);
    },
    
    serverError: function() {
      SC.Logger.debug("InitializationError called");
      this.gotoState('error');  
    },

    loadingFile: Ki.State.design({
      fileLoaded:function() {
        this.gotoState('receivedFile');
      }
    }),

    receivedFile: Ki.State.design({
      enterState: function() {
        var currentRootNode = this.get('parentState').get('rootNode');
        SC.Logger.debug("Enter received with: " + currentRootNode.url);
        var currentNode = Multivio.filesController.find(currentRootNode.url);
        //rootNode not loaded
        if(SC.none(currentNode)) {
          this.gotoState('loadingFile');
          Multivio.filesController.fetchFile(currentRootNode.url, currentRootNode.parent);
          return;
        }
        //Multivio.treeController.updateContent();

        //isContent file: display it!
        Multivio.filesController.selectObject(currentNode);
        if(currentNode.get('isContentFile')) {
          Multivio.filesController.selectObject(currentNode);
          this.gotoState('contentReady');
          return;
        }

        //logical Node
        var currentPhys = currentNode.get('physicalStructure');
        var nextNodeUrl;
        //expand first child
        if (this.get('parentState').get('first')) {
          nextNodeUrl = currentPhys[0].url;
        }else{
          //expand last child
          nextNodeUrl = currentPhys[currentPhys.length - 1].url;
        }

        //store current as parent and call child
        this.get('parentState').set('rootNode', {'url': nextNodeUrl, 'parent':currentNode});
        this.gotoState('loadingFile');
        Multivio.filesController.fetchFile(nextNodeUrl, currentNode);
      }
    })

  }),

  contentReady: Ki.State.design({


    enterState: function() {
      //loading root
      if(Multivio.filesController.length() < 1) {
        var rootUrl = Multivio.filesController.get('referer');
        var loadingState = this.get('parentState').get('loadingContentFile');
        loadingState.set('rootNode', {'url':rootUrl, 'parent':undefined});
        loadingState.set('first', YES);
        this.gotoState('loadingContentFile'); 
        return;
      }

      var currentFile = Multivio.filesController.get('currentSelection');
      var viewToChange = Multivio.getPath('mainPage.mainPane.centerView');
      SC.Logger.debug('------> ' + viewToChange);
      if(!SC.none(currentFile) && 
         !SC.none(currentFile.metadata) &&
             currentFile.metadata.mime === 'application/pdf') {
        if(viewToChange.get('nowShowing') !== 'mainPdfView') {
        viewToChange.set('nowShowing', 'mainPdfView');
      Multivio.getPath('mainPage.mainPdfView').becomeFirstResponder();
      Multivio.getPath('mainPage.mainPdfView.bottomToolbar').displayBar();
        }
      this.set('searchInNext', YES);
      }else{
          viewToChange.set('nowShowing', 'unsupportedDocumentView');
      }
    },

    nextFile: function(){
      var predecessorNode = Multivio.filesController.get('hasNextFile');

      if(predecessorNode) {
        var loadingState = this.get('parentState').get('loadingContentFile');
        loadingState.set('rootNode', predecessorNode);
        loadingState.set('first', YES);
        this.gotoState('loadingContentFile'); 
      }
    },

    previousFile: function(){
      var predecessorNode = Multivio.filesController.get('hasPreviousFile');
      if(predecessorNode) {
        var loadingState = this.get('parentState').get('loadingContentFile');
        loadingState.set('rootNode', predecessorNode);
        loadingState.set('first', NO);
        this.gotoState('loadingContentFile'); 
      }
    },

    fetchFile: function(){
        var loadingState = this.get('parentState').get('loadingContentFile');
        var currentUrl = Multivio.filesController.get('currentUrl');
        var currentParent = Multivio.filesController.get('currentParent');
        loadingState.set('rootNode', {'url': currentUrl, 'parent': currentParent});
        loadingState.set('first', YES);
        this.gotoState('loadingContentFile'); 
    }


  })
});
