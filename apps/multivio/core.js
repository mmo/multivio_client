/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2014 RERO
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

    // TODO: simplify by putting input parameters in configurator?
    // (check all its clients)
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

  /**
    TODO: document this - VERY IMPORTANT APPLICATION PROPERTY
   */
  currentContentController: null

});

/************************************
  Character codes for keyboard events
 ************************************/

// TODO check proper usage of keyboard events all over the application

Multivio.KEYCODES = {
  SPACE:        32,
  ENTER:        13,
  TAB:           9,
  ESCAPE:       27,
  BACKSPACE:     8,
  
  SHIFT:        16,
  CONTROL:      17,
  ALT:          18,
  CAPSLOCK:     20,
  
  LEFT_ARROW:   37,
  UP_ARROW:     38,
  RIGHT_ARROW:  39,
  DOWN_ARROW:   40,
  
  DELETE:       42,
  HOME:         36,
  END:          35,
  PAGE_UP:      33,
  PAGE_DOWN:    34,
  
  PLUS:         43,
  MINUS:        45,
  
  UPPERCASE_F:  70,
  LOWERCASE_F: 102,
  UPPERCASE_L:  76,
  LOWERCASE_L: 108,
  UPPERCASE_N:  78,
  LOWERCASE_N: 110,
  UPPERCASE_O:  79,
  LOWERCASE_O: 111,
  UPPERCASE_R:  82,
  LOWERCASE_R: 114,
  UPPERCASE_W:  87,
  LOWERCASE_W: 119
}
