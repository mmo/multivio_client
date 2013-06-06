/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

Multivio.Theme = SC.AceTheme.create({
  name: 'mvo-basic'
});

// Tell SproutCore about the theme
SC.Theme.addTheme(Multivio.Theme);
 
// Make it the default theme
SC.defaultTheme = 'mvo-basic';
