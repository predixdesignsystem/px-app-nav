# Px-app-nav

Px-app-nav is a navigation bar or drawer for applications.

## Overview

Use the px-app-nav to cleanly navigate portions or pages of a application. The navigation can be minimized or expanded to reveal the navigation items, which can have sub items. The navigation can host other web components or authentication such as the px-login web component. Navigation items can use font-awesome icons to better communicate with the user.

## Usage

### Prerequisites
1. node.js
2. npm
3. bower
4. Install the [webcomponents-lite.js polyfill](https://github.com/webcomponents/webcomponentsjs) to add support for web components and custom elements to your application.

### Getting Started

First, install the component via bower on the command line.

```
bower install https://github.com/PredixDev/px-app-nav.git --save
```
Second, import the component to your application with the following tag in your head.

```
<link rel="import" href="/bower_components/px-app-nav/px-app-nav.html"/>
```

Finally, use the component in your application:

```
<px-app-nav></px-app-nav>
```

<br />
<hr />

## Attributes

#### nav-expanded

*Type:* **Boolean** - (*Optional*) - *Default:* "true"

Whether the navigation is expanded. Reflected to an attribute (reflectToAttribute: true) so the application can bind to it and maintain state as needed.

```
<px-app-nav
	...
	nav-expanded="true">
</px-app-nav>
```
<br />
#### nav-items

*Type:* **Array** - (*Optional*) - *Default:* [{}] notify

Object array of items and sub-items in the nav. Each object in the Array can specify '[path-key]', 'label', 'icon' 'l10nId', 'eventName', and 'subitems', which is another Array.
```
<px-app-nav
	...
	nav-items='[{"path": "", "icon": "fa-warning", 
	"label":"Alerts","subitems": [{"label": "Sub 
	Category 1"}, {"label": "Sub Category 2"}]},
	{"path":"tab2", "icon": "fa-briefcase", "label":
	 "Cases"}]'>
</px-app-nav>
```

<br />
#### path-key

*Type:* **String** - (*Optional*) - *Default:* "path"

Allows a level of indirection in the Array of navItems passed in to resolve paths.

```
<px-app-nav
	...
	path-key="path">
</px-app-nav>
```

<br />

#### path-prefix

*Type:* **String** - (*Optional*) - *Default:* "#"

When navigating, this prefix is appended to the relative URL. Defaults to '#', indicating paths are routed via the hash part of the URL. To make them relative to current directory, use '/'.

```
<px-app-nav
	...
	path-prefix="/">
</px-app-nav>
```

<br />

#### rtl

*Type:* **Boolean** - (*Optional*) - *Default:* false

If true, nav drawer appears on the right to accommodate RTL languages. Set automatically if Mozilla's L20N framework is loaded on the document.

```
<px-app-nav
	...
	rtl="false">
</px-app-nav>
```
<br />

##Events
####nav-items-changed

Fired when any of the navigation items are modified.
<br />
## Using Events

Events follow the [Polymer data-binding standards](https://www.polymer-project.org/1.0/docs/devguide/data-binding.html).

You can can attach listeners by using one of the methods below:

1. Polymer Event listener
2. on- annotated event listener
3. addEventListener vanila Javascript method
<br />
<hr />

## Methods
#### markSelected(path)

Marks the nav item with the given path as selected, and all others as unselected.
<br />
<hr />

## Local Development

From the component's directory...

```
$ npm install
$ bower install
$ grunt sass
```

From the component's directory, to start a local server run:

```
$ grunt depserve
```

Navigate to the root of that server (e.g. http://localhost:8080/) in a browser to open the API documentation page, with link to the "Demo" / working examples.

### LiveReload

By default grunt watch is configured to enable LiveReload and will be watching for modifications in your root directory as well as `/css`.

Your browser will also need to have the LiveReload extension installed and enabled. For instructions on how to do this please refer to: [livereload.com/extensions/](http://livereload.com/extensions/).

Disable LiveReload by removing the `livereload` key from the configuration object or explicitly setting it to false.


### DevMode
Devmode runs `grunt depserve` and `grunt watch` concurrently so that when you make a change to your source files and save them, your preview will be updated in any browsers you have opened and turned on LiveReload.
From the component's directory run:

```
$ grunt devmode
```

### GE Coding Style Guide
[GE JS Developer's Guide](https://github.com/GeneralElectric/javascript)

<br />
<hr />

## Known Issues

Please use [Github Issues](https://github.com/PredixDev/px-app-nav/issues) to submit any bugs you might find.
