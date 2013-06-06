# Multivio client code description

This file contains a guide for understanding the client application's source code.

More detailed technical information can be found in the SproutCore guides: http://guides.sproutcore.com/ and other SproutCore resources at http://www.sproutcore.com/


## Code structure

**(SproutCore standard approach)**

The project employs a standard SproutCore folder structure.

### `apps/`

Although SproutCore allows multiple applications in a single project, the Multivio client project is composed of a single app `multivio`.

The app employs a standard SproutCore folder structure, with the following additions:

- folders:
	 - **`apps/multivio/docs/`** - local project documentation
- files:
	 - **`apps/multivio/configurator.js`** - application configuration


#### Important files in the `apps` folder

(See also the files mentioned in the _Loading sequence_ section.)

##### `apps/resources/main_page`

This file defines the main page: `Multivio.mainPage` (in SC, *A Page object is used to store a set of views that can be lazily configured as needed...*), together with its `mainPane` (in SC, *a pane is just like a regular view except that it doesn’t need to live within a parent view...*). 

Hence, `mainPane` is the root interface element of the application: it takes the whole screen, and all its child views become visible as soon as the pane is displayed on the screen (which is done in the `statechart`).

Note that there are additional, secondary pages and panes in the application (for error messages, application loading, etc.), but the main action really occurs inside `Multivio.mainPage.mainPane`.

##### `models/file.js`

...





### `frameworks/`

TODO


### `scripts/`

TODO


### `themes/`

TODO

### `Buildfile`

Project configuration, including:

- server proxy declarations
- required libraries
- ...


### `COPYING`

The text of the source code license (GPLv2)


### `README`

A textual description of the project, used as front page for the source code repository.


## Loading sequence

**(SproutCore standard approach)**


### `core.js`

In http://guides.sproutcore.com/getting_started.html:
> The `core.js` file is the first file that gets loaded, and is where the actual application is defined. This is also where you usually define any global constants that the application might use (which should be very few), or any configuration that external libraries might require.


### `main.js`

The `main.js` file is very basic: it starts the application and initializes the statechart. From there on, the statechart takes control of the application.


## Important SproutCore-related facts

- views use absolute positioning [http://guides.sproutcore.com/views.html]
- 

### `statecharts/main_statechart.js`

The root application state is defined in the file `main_statechart.js`. Together, the files inside the `statecharts` folder define the complete applicaton statechart. This is where the core of the application lives, hence is very important for its understanding. A graphical representation of the statechart is provided in `docs/multivio_client_statechart.graffle` (which is in OmniGraffle format - a PDF version is provided for convenience).

