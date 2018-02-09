v2.1.7
==================
* Fix demo for IE

v2.1.6
==================
* fix link in demo

v2.1.3
==================
* fix demo

v2.1.2
==================
* merge #86

v2.1.1
==================
* fix dependencies

v2.1.0
==================
* Polymer 1.x/2.x hybrid support.

v2.0.12
==================
* add device flags

v2.0.11
==================
* Temporary fix for #78, adds a CSS declaration after the @apply to ensure polymer-cli w/ css-slam doesn't break this

v2.0.10
==================
* Update demo to use "id" instead of "path" for Dashboard item and subitems

v2.0.9
==================
* Does not collapse navigation if only one item is present

v2.0.8
==================
* Docs changes only: Add vertical navigation simple example (examples/vertical.html)
  and fix vertical demo so it shows up

v2.0.7
==================
* update docs

v2.0.6
==================
* update to use px-fea icons instead of px-nav where possible

v2.0.5
==================
* Fix comment block for analyzer

v2.0.4
==================
* update demo to use unique name

v2.0.3
==================
* Changed overflow icon to px-utl:overflow instead of px-nav:collapse

v2.0.2
==================
* Rebuilt demo
* Added css variable docs

v2.0.1
==================
* Move to px-app-asset-graph API for creating and selecting items

v2.0.0
==================
* Complete overhaul of px-app-nav API and design. See the documentation for
  more information on how to migrate to the new component.
* Clicking on an item in px-app-nav no longer automatically navigates to the
  item's URL by setting the window.location. Instead, listen to the event
  `selected-changed` for updates when an item is selected and sync the state to
  the URL if you choose (e.g. by setting `window.location`, using a framework
  router, or using the new px-app-route helper element).
* The `navItems` property has been renamed to `items`. The format of the
  navigation items object has also changed.
* In `navItems`, child items were added to a parent item with the `subitems` key.
  In `items`, child items are added to a parent item with the `children` key.
* In `navItems`, item paths were set with the `path` key. In `items`, item paths
  are set with the `id` key.
* In `navItems`, item paths were set with the `path` key. In `items`, item paths
  are set with the `id` key.
* In `navItems`, an `eventName` could be passed that would be fired when the
  item was tapped. That option has been removed from `items`. Instead, watch
  `selected-changed` for updates when a new item is selected (when tapped or
  through data binding).
* All icon names used in `navItems` should be updated to use the new px-icon
  names. If you do not update to use the px-icon names, you will need to load the
  font awesome icons in your app. The font awesome icons will not be loaded with
  the px-app-nav component by default.
* The `navContracting` and `naxExpanding` properties have been removed. See the
  `collapseOpened` property for an approximate replacement.
* The `pathPrefix` property has been removed as px-app-nav no longer navigates
  the page directly when an item is clicked. You can implement this yourself by
  listening to `selected-changed` and setting the URL.
* The `pathKey` property has been removed.
* The `markSelected` method has been removed. Use the `select()` method to
  select an item by reference.
* The nav is no longer configured to be vertical and toggle to open/close by
  default. There are now a variety of modes available (horizontal, vertical,
  collapsed) for different use cases. See the documentation for more
  information. To use the vertical mode, set the `vertical` property to true.
  The vertical mode is no longer meant to be used on mobile. The `collapsed`
  mode should be used on mobile instead.

v1.10.12
==================
* sass fix for safari 9

v1.10.11
==================
* fix #41 (debounce clicks), simplify sass

v1.10.10
==================
* update docs

v1.10.9
==================
* use neon-animation instead of web-animations-js direct. Plays nicer with paper/vis components

v1.10.8
==================
* fix for web animations dependency clash with vis/paper elements

v1.10.7
==================
* removed alert dialog from demo per design feedback

v1.10.6
==================
* added styling section to API documentation

v1.10.4
==================
* updated to px-demo

v1.10.3
==================
* Update colors design to pick up new colors

v1.10.2
==================
* changing ghp.sh to account for Alpha releases

v1.10.0
==================
* Updated dependencies

v1.9.22
==================
* changing browser in wct testing from safari 8 to safari 10 on elcapitan

v1.9.21
==================
* moving px-polymer-font-awesome back to 0.1.x version.

v1.9.20
==================
* updated dependencies

v1.9.19
==================
* added missing font-awesome import

v1.9.18
==================
* changing all devDeps to ^

v1.9.17
==================
* Update px-theme to 2.0.1 and update test fixtures

v1.9.16
==================
* Update px-theme to 2.0.1 and update test fixtures

v1.9.15
==================
* Update px-theme to 2.0.1 and update test fixtures

v1.9.14
==================
* Update px-theme to 2.0.1 and update test fixtures

v1.9.13
==================
* Update px-theme to 2.0.1 and update test fixtures

v1.9.12
==================
* removing px-theme style call


v1.9.11
==================
* changing Gruntfile.js to gulpfile.js


v1.9.10
==================
* bower updating px-demo-snippet

v1.9.9
==================
* merge PR #26 to provide the object model with event details

v1.9.8
==================
* Updates dependencies to fix bower resolution for px-defaults-design

v1.9.7
==================
* merge PR #25 which fixes missing px-theme import

v1.9.6
==================
* removed call to checkNavExpandedState() which made everything break.

v1.9.2
==================
* fix select & hover span gray text issue.

v1.9.1
==================
* use sass variables for nav icon height.

v1.9.0
==================
* grunt to gulp conversion and move to style modules.

v1.8.0
==================
* added px-iconography-styles

v1.7.6
==================
* added codepen

v1.7.5
==================
* changed icons to work under shadow dom.

v1.7.4
==================
* added overflow to demoContainer and removed flex__wrap from mega-demo

v1.7.3
==================
* updated mega demo styles and bower px-demo-snippet to ^

v1.7.2
==================
* added vulcanize to demo gh-pages

v1.6.1
==================
* Merge of pull request number 16 to enable "Display tooltip when nav is collapsed"

v1.6.0
==================
* Upgrade to Polymer 1.5.0

v1.5.4
==================
* added oss_notice to bower ignore

v1.5.3
==================
* added pull request inside travis

v1.5.2
==================
* added auto github pages functionality

v1.5.1
==================
* Up px-login version

v1.5.0
==================
* migrate to polymer 1.4.0

v1.3.1
===================
* updated docs and fixed some js warnings.

v1.0.10
===================
* Added 'popstate' event listener

v1.0.8
===================
* Updated License
