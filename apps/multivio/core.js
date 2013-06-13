/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/


// This file defines the APPLICATION'S NAMESPACE together with its GLOBAL
// CONSTANTS and SINGLETON OBJECTS.

/** @namespace
  @extends SC.Object
*/
Multivio = SC.Application.create({

  NAMESPACE: 'Multivio',
  VERSION: '1.0.0',

  /**
    The application store. Used to access all model data at the backend server.
    It is initialized in the `main` state of the statechart.
  */
  store: null,

  /**
    The thumbnail controller must be updated according to the type of the
    current file
  */
  currentThumbnailController: null,

  /**
    The name of the active theme
  */
  currentTheme: null,

  /**
    TODO: check usefulness
  
    Change the graphical theme that is currently selected. The name of the
    theme to be applied must be a property called 'newTheme' of the object
    given as input. This object is usually a view that calls this method
    through a target/action binding. In that case the view must contain the
    newTheme property.

    @param {SC.Object} caller the object that called this method (usually an
    SC.View);
  */
  changeTheme: function (caller) {
    var currentTheme = Multivio.get('currentTheme'),
      newTheme = caller.get('newTheme');
    if (!SC.none(caller)) {
      if (!SC.none(newTheme) && newTheme !== currentTheme) {
        SC.Logger.debug(
          'Changing theme from %@ to %@'.fmt(currentTheme, newTheme));
        SC.$('body')
          .addClass('mvo-%@-theme'.fmt(newTheme))
          .removeClass('mvo-%@-theme'.fmt(currentTheme));
      }
      Multivio.set('currentTheme', newTheme);
    }
  },

  /**
    Stores the app's input parameters, read from the entry URL
  */
  inputParameters: SC.Object.create({

    options: {},

    read: function () {
      this.beginPropertyChanges();
      this.set('options', {});
      var inputUrl = !SC.none(location.hash) ? location.hash.slice(1) : null;
      SC.Logger.debug("Read input args: " + inputUrl);
      if (!SC.none(inputUrl)) {
        var inputRegExp = /(.*?)url=(.*)/;
        var inputParts = inputRegExp.exec(inputUrl);

        //get input url argument
        var referer = inputParts.pop();
        //this.set('url', referer);
        SC.Logger.debug("Referer: " + referer);

        //remove all match
        inputParts.shift();
        var options = {}, i;
      
        var optionsParts = inputParts.pop().slice(0, -1).split('&');
        for (i = 0; i < optionsParts.length; i++) {
          var res = optionsParts[i].split('='); 
          options[res[0]] = res[1];
        }
        options.url = referer;
        this.set('options', options);
      }
      this.endPropertyChanges();
    }
  }),
  
  navigationTarget: null

});
