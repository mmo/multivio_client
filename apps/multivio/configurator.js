/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

/**
  @namespace

  Object that stores all configuration parameters

  @author che
  @extends SC.Object
  @since 0.1.0
*/

Multivio.configurator = SC.Object.create({
  
  /**
    The support address
  */
  support: 'info@multivio.org',  
  
  /**
    The name of the multivio server
    
    @property String
    @default server
  */
  serverName: null,
  
  /**
    The version of the server
    
    @property String
  */  
  serverVersion: null,
  
  /**
    The version of compatibility between server and client
  */
  serverCompatibility: '0.4.0',

  /**
    Default theme
  */
  defaultTheme: 'default',

  /**
    List of allowed themes
  */
  allowedThemes: 'default white dark blue'.w(),
  
  /**
    The theme to be used
  */
  initialTheme: 'mvo-white-theme'

});
