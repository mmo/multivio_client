/**
==============================================================================
  Project:    Multivio - https://www.multivio.org/
  Copyright:  (c) 2009-2011 RERO
  License:    See file COPYING
==============================================================================
*/

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Multivio.reload = function () {
  SC.Logger.debug('New input');
  // STATECHART EVENT TRIGGER
  // Multivio.mainStatechart.sendEvent('main');
  Multivio.inputParameters.read();
};

Multivio.main = function main() {

  Multivio.changeTheme(SC.Object.create({
    newTheme: Multivio.configurator.get('defaultTheme')
  }));

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!
  //Multivio.getPath('mainPage.mainPane').append();

  // Set the content property on your primary controller
  // ex: Multivio.contactsController.set('content',Multivio.contacts);
  SC.routes.add('*', Multivio, 'reload');
  Multivio.mainStatechart.initStatechart();

  // With the following statetement... "[...] what you are doing is telling the
  // root responder to let your application's statechart be the catch-all (the
  // default) for any action sent to it if no other target responder could be
  // found to handle the incoming action. [...] By having your app's statechart
  // by the one and only default responder, it helps centralize your
  // aplication's state logic into one cohesive set of states. It also makes it
  // easier maintaining your code since you set the default responder in only
  // one place instead of multiple places such as being the default responder
  // for every pane in your application." From the blog post "SproutCore:
  // Making Use of Delegation | Frozen Canuck", 03.11.2011:
  // http://frozencanuck.wordpress.com/2011/02/03/sproutcore-making-use-of-delegation/
  SC.RootResponder.responder.set('defaultResponder', Multivio.mainStatechart);

};

function main() { 
  Multivio.main();
}
