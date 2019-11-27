/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/**

`px-app-nav` is an app-level navigation element that allows users to change the
current view. The element is designed to work on desktop and mobile/touch
devices, supporting any viewport size. It has three distinct visual styles that
can be switched at any time to suit different app designs.

--------------------------------------------------------------------------------

### Navigation items: Structuring data and managing selection

The navigation accepts a list of items that will be converted into buttons for
the user to interact with. Each item should have at least a label that will
be displayed for the user to select and a unique ID that will be used to keep
track of which item is selected.

This data should be passed into the `items` attribute or property on the
`px-app-nav` element.

This is a simple navigation data example:


    [
      {
        "id" : "home",
        "label" : "Home",
        "icon" : "px-fea:home"
      },
      {
        "id" : "alert",
        "label" : "Alerts",
        "icon" : "px-fea:alerts"
      }
    ]


Top-level navigation items can optionally have child items. This is useful for
creating categories of related pages. If a top-level navigation item has any
children it cannot be selected directly - users can select its child items,
and the top-level "category" item will get the selected visual style.

This example shows a "Dashboards" category with a few different dashboard pages:


    [
      {
        "id" : "dash",
        "label" : "Dashboards",
        "icon" : "px-fea:dashboard",
        "children" : [
          {
            "id" : "plant-status",
            "label" : "Plant Status Updates"
          },
          {
            "id" : "output-info",
            "label" : "Daily Output Measurements"
          }
        ]
      }
    ]

All items (top-level items, top-level category items, and child items) should
have the following properties:

  - **id** {string} - unique string that identifies the item. Should only contain
  valid, URI-safe characters. Example: "home", "alerts1"
  - **label** {string} - short, human-readable text. The user will tap this text
  to select the item. Example: "Homepage", "View Alerts"

The following optional properties can be defined for top-level items only:

  - **icon** {string} - valid [px-icon-set](https://www.predix-ui.com/#/modules/px-icon-set/)
  icon placed next to the text label for the item. Use an icon from the `px-fea`
  for the best sizing and visual styling. If the icon you need is not available in
  the `px-fea` icon set, you may use an icon from the `px-nav` icon set, but only
  do so if absolutely necessary.
  - **children** {array} - child items that will be placed in a dropdown under
  their parent top-level item. Each child item should have an `id` and `label`.
  If the child item has an `icon` property, it will be ignored.

Example top-level item without children:


    {
      "id" : "page-id",
      "label" : "Page Title",
      "icon" : "px-fea:templates"
    }


Example top-level item with child items:


    {
      "id" : "category-id",
      "label" : "Category Title",
      "icon" : "px-fea:microservice",
      "children" : [
        {
          "id" : "child-item-1",
          "label" : "First Child Title"
        },
        {
          "id" : "child-item-2",
          "label" : "Second Child Title"
        }
      ]
    }


Additional data not used by `px-app-nav` can also be included in each item's
object. This is a useful way to store metadata about app pages that will be used
at run-time when a new nav item is selected. Example:


    {
      "id" : "all-cases",
      "label" : "Cases",
      "metadata" : {
        "openCases" : "12",
        "closedCases" : "82"
      }
    }

The navigation will not mutate any of its items properties, making it easy to
share any item metadata with other app components.

#### Responding to item selection

When the user taps on a navigation item it will be marked as selected. The app
containing the `px-app-nav` element should respond to the new selected item and
update its view.

There are two ways for an app to listen for user selection:

- **By reference:** The element's `selected` property will be updated when a new
item is selected. The `selected` property will notify a reference to the object
that describes the item in the `items` array.

- **By route:** The element's `selectedRoute` property will notify an array of
strings that trace the path from the root of the `items` graph to the selected
item. This is useful for binding the navigation state to the app's URL path.
(See the [px-app-route](https://www.predix-ui.com/#/elements/px-app-helpers/px-app-route)
module for a guide to binding the navigation state to the URL.)

For example, given the following simplified navigation `items` list:

    [
      {
        "id" : "dash",
        "label" : "Dashboards",
        "children" : [
          {
            "id" : "info-dash",
            "label" : "Info Dashboard"
          }
        ]
      }
    ]

When the user selects the "Info Dashboard", the `selectedRoute` will be set to
`["dash", "info-fash"]`.

#### Selecting an item programmatically

Sometimes it is useful for an app to automatically change the active page
(e.g. opening the home page when the app is first loaded, or opening a dashboard
when the user clicks on an alert message). The `selected` and `selectedRoute`
properties can be used to set the selected navigation item state in the same
way they are used to read the selected navigation item state.

The simplest way to do this is through `selectedRoute`:


    <px-app-nav
        items='[
          { "label" : "Home",   "id" : "home",   "icon" : "px-fea:home" },
          { "label" : "Alerts", "id" : "alerts", "icon" : "px-fea:alerts" },
          { "label" : "Assets", "id" : "assets", "icon" : "px-fea:asset", children: [
            { "label" : "Asset #1", "id" : "a1" },
            { "label" : "Asset #2", "id" : "a2" }
          ] }
        ]'
        selected-route='["assets", "a1"]'>
    </px-app-nav>


Items can also be selected by reference using the `selected` property. Selecting
this way requires a bit of JavaScript; the navigation does a simple reference
equality check (`item1 === item2`) to find the item in the graph and select it.
Passing an item with the same properties as one of the `items` objects will
not select it.


    <px-app-nav id="nav"></px-app-nav>
    <script>
      var nav = document.getElementById('nav');
      var navItems = [
        { "id" : "home", "label" : "Home" }
      ];
      nav.items = navItems;
      nav.selected = navItems[0];
    </script>


Data-binding can also be used to accomplish the same thing without manually
finding the `px-app-nav` element in the DOM.

### Binding to the URL path (routing)

The `px-app-nav` element is designed to easily bind its state to the URL path.
When the user selects an item, its `selectedRoute` can be encoded and used to
set the URL path. The user can then bookmark the page or share the URL to link
to a specific view. When the user loads a page with a URL path defined, that
path can be decoded and used to select the right navigation item (and show a
page).

For a ready-to-go solution for binding `px-app-nav` to the URL path, see the
[px-app-route](https://www.predix-ui.com/#/elements/px-app-helpers/px-app-route) component.
This component works best in applications built using Polymer as a data-binding
framework, but also exposes methods to help convert the navigation's
`selectedRoute` to and from a path string for use in other framework routers.

Alternatively, listen for update events from the `selected` and/or `selectedRoute`
properties in your app and send the values to the framework router of your
choice, or implement your own routing system from scratch.

--------------------------------------------------------------------------------


### Navigation styles

Two of the navigation styles, horizontal and vertical, should only be used on
desktop screens. The collapsed navigation style should be used on mobile/touch
devices and can also be used for desktop devices.


#### 1. Horizontal navigation

The horizontal navigation style is a persistent bar fixed to the top of the viewport.
Navigation items are displayed in a row. If the window is too narrow to fit all
the items, any overflowed items are placed into an overflow dropdown. If only
one navigation item fits in the window, the navigation will automatically
switch to collapse style (see description below).

This is the default style. It doesn't require any additional configuration to
enable beyond putting the `px-app-nav` element tag on the app page. The following
example shows how to configure px-app-nav in the horizontal style:


    <px-app-nav
        items='[
          { "label" : "Home",   "id" : "home",   "icon" : "px-fea:home" },
          { "label" : "Alerts", "id" : "alerts", "icon" : "px-fea:alerts" },
          { "label" : "Assets", "id" : "assets", "icon" : "px-fea:asset", children: [
            { "label" : "Asset #1", "id" : "a1" },
            { "label" : "Asset #2", "id" : "a2" }
          ] }
        ]'
        selected-route='["assets","a1"]'>
    </px-app-nav>

#### Positioning a horizontal app-nav in an app:

The horizontal style `px-app-nav` element should be fixed at the top of your app
with app content configured to scroll beneath it. The app must position the
`px-app-nav` element using CSS to fix it to the top of the view. By default, the
element is `position: relative` and `display: block`, causing it to fill its
parent container's width but scroll out of the view as the user scrolls down
the page.

The following example fixes the element to the top of the view so content
can scroll beneath it:


    <style>
      px-app-nav {
        position: fixed;
        top: 0;
        left: 0;
      }
    </style>
    <px-app-nav items="..."></px-app-nav>

Using position fixed will cause the `px-app-nav` element to cover other HTML
elements at the top of your page. Offset your content (e.g. by setting
`margin-top: 80px` on your content container) to ensure the navigation does not
cover other app elements unintentionally.

--------------------------------------------------------------------------------

#### 2. Collapsed navigation

The collapsed navigation style is also a persistent bar fixed to the top of the
viewport. The navigation items are displayed in a dropdown menu that the user
can open by clicking or tapping on the open button; and closed by selecting
a navigation item or clicking or tapping anywhere else in the viewport.

If no item is selected, the collapsed navigation will show an empty outline
for the dropdown trigger button. If an item is selected that item's label and
icon will be shown in the dropdown trigger button.

This style can be enabled in a few different ways:

- **Force collapse:** Setting the `collapseAll` property to true or enabling the
`collapse-all` attribute on the `px-app-nav` element will force the navigation
to use the collapsed style at all times. Example:


    <px-app-nav items="..." collapse-all></px-app-nav>


- **Dynamic collapse:** The `collapseAt` property can be used to dynamically
collapse and un-collapse the navigation when the viewport size changes. If the
size of the `px-app-nav` element's container becomes smaller than the `collapseAt`
value, it is collapsed. If the element's container becomes larger than the
`collapseAt` value, it is un-collapsed.


    <px-app-nav items="..." collapse-at="420"></px-app-nav>


The `collapseAt` property should be a number that will be converted into pixels.

When the navigation is automatically collapsed or un-collapsed, the read-only
`collapsed` property will be updated. Watch that property to figure out the
state of the navigation.

- **Auto-collapse:** When the default horizontal style is in use and only 1 item
fits in the space available to the `px-app-nav` element, the navigation will be
automatically collapsed.

#### Positioning a collapsed app-nav in an app:

Follow the sticking instructions in the Horizontal style section above to
correctly position the `px-app-nav` element on the page in collapsed style.

--------------------------------------------------------------------------------

#### 3. Vertical navigation

The vertical navigation style is fixed to the left or right side of the browser.
When the navigation is not being interacted with it displays as a narrow strip
showing only the navigation item icons. When the user hovers over the vertical
navigation, the bar animates open and allows the user to click/tap to select
a new item. Example:


    <px-app-nav items="..." vertical></px-app-nav>

The vertical navigation can be opened in a few ways:

- **Auto open:** When the default vertical style is in use the navigation will automatically
open on hover over the `px-app-nav` element.

- **Force open:** Setting the `verticalOpenedAt` property to 0 on the `px-app-nav` 
element will force the navigation to use the opened style at all times. Example:


    <px-app-nav items="..." vertical-opened=at="0"></px-app-nav>


- **Dynamic open:** The `verticalOpenedAt` property can be used to dynamically open 
the navigation when the viewport size changes. If the size of the `px-app-nav` element's 
parent container becomes larger than the value of `verticalOpenedAt`, it is opened.
For example, if `verticalOpenedAt` is 600, the navigation will open if the containers
width exceeds 600px and close if below 600px.


    <px-app-nav items="..." vertical-opened-at="600"></px-app-nav>


The `verticalOpenedAt` property should be a number that will be converted into pixels.

When the navigation is dynamically opened, the `verticalOpened` property will be updated. 
Watch that property to figure out the state of the navigation.


#### Positioning a vertical app-nav  in an app:

The vertical style defaults to CSS styles `position: absolute; left: 0; top: 0;`
to stick to the left side of the screen. This causes the navigation element to
fill the first `position: relative` item above it in the DOM. Override these
values to position it in whatever way your app requires:


      <style>
        px-app-nav {
          position: fixed;
          right: 0;
          top: 0;
        }
      </style>
      <px-app-nav items="..."></px-app-nav>

--------------------------------------------------------------------------------


### Styling

The following custom properties are available for styling:

Custom property | Description
----------------|-------------
`--px-app-nav-background-color`                                         | The background color of the app nav bar
`--px-app-nav-item-background-color--collapsed`                         | The background color for a collapsed app nav
`--px-app-nav-item-background-color--empty`                             | The background color for an empty app nav
`--px-app-nav-item-background-color--hover`                             | The hover state color for an app nav item
`--px-app-nav-item-background-color--pressed`                           | The pressed state color for an app nav item
`--px-app-nav-item-background-color--selected`                          | The background color for a selected app nav item
`--px-app-nav-item-background-color`                                    | The background color for an unselected app nav item
`--px-app-nav-item-icon-color--collapsed`                               | The color of the icon in a collapsed app nav
`--px-app-nav-item-icon-color--hover`                                   | The hover state color for an icon
`--px-app-nav-item-icon-color--pressed`                                 | The pressed state color for an icon
`--px-app-nav-item-icon-color--selected`                                | The  color for the icon in a selected item
`--px-app-nav-item-icon-color`                                          | The normal, unselected color for an icon
`--px-app-nav-item-stripe-color--selected`                              | The stripe accent color on the top or side of a selected item
`--px-app-nav-item-text-color--collapsed`                               | The text color in a collapsed state
`--px-app-nav-item-text-color--hover`                                   | The text color in a hover state
`--px-app-nav-item-text-color--pressed`                                 | The text color in a pressed state
`--px-app-nav-item-text-color--selected`                                | The text color for a selected item
`--px-app-nav-item-text-color`                                          | The normal, unselected text color
`--px-app-nav-subitem-background-color--hover`                          | The hover state background color for the dropdown submenu
`--px-app-nav-subitem-background-color--selected`                       | The  background color for a selected item in the dropdown submenu
`--px-app-nav-subitem-background-color`                                 | The background color for the dropdown submenu
`--px-app-nav-subitem-text-color--collapsed`                            | The collapsed state text color for a submenu item
`--px-app-nav-subitem-text-color--hover`                                | The hover state text color for a submenu item
`--px-app-nav-subitem-text-color--selected`                             | The text color for a selected submenu item
`--px-app-nav-subitem-text-color`                                       | The normal, unselected text color for a submenu item
`--px-app-nav-subitem-background-color--collapsed`                      | The background color for the dropdown submenu in a collapsed state
`--px-app-nav-subitem-background-color--collapsed-hover`                | The hover state background color for the dropdown submenu in a collapsed state
`--px-app-nav-subitem-text-color--parent-collapsed-selected`            | The background color for the selected dropdown submenu in a collapsed state
`--px-app-nav-subitem-background-color--parent-collapsed-selected`      | The background color for the parent item of a selected submenu item in a collapsed state
`--px-app-nav-subitem-accent-color--parent-collapsed-selected`          | The strip accent color for the parent item of a selected submenu item in a collapsed state
`--px-app-nav-subitem-background-color--parent-collapsed-hover`         | The background color for the parent of a hovered submenu item in a collapsed state
`--px-app-nav-subitem-background-color--parent-collapsed-selected`      | The background color for the parent of a selected submenu item in a collapsed state
`--px-app-nav-subitem-text-color--parent-collapsed-selected`            | The text color for the parent of a hovered submenu item in a collapsed state
`--px-app-nav-subitem-text-color--parent-collapsed-not-selected`        | The text color for the parent of an open, unselected submenu item in a collapsed state
`--px-app-nav-subitem-background-color--parent-collapsed-not-selected`  | The background color for the parent of an open, unselected submenu item in a collapsed state


@element px-app-nav
@blurb A navigation component that allows the user to browse app pages and content
@homepage index.html
@demo index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import 'px-app-helpers/px-app-asset/px-app-asset-behavior-graph.js';
import 'px-app-helpers/px-app-asset/px-app-asset-behavior-selectable.js';
import './px-app-nav-behavior-measure-text.js';
import './px-app-nav-group.js';
import './px-app-nav-subgroup.js';
import './px-app-nav-item.js';
import './px-app-nav-subitem.js';
import './css/px-app-nav-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

Polymer({
  _template: html`
    <style include="px-app-nav-styles"></style>

    <section class="app-nav" id="container">
      <section class="app-nav__items" id="items">
        <!-- STATE: Horizontal or menu nav, any visible items -->
        <template is="dom-if" if="[[!vertical]]">
          <template is="dom-repeat" items="{{items}}" filter="_isItemVisible" id="visible">
            <!-- Stamp groups, which hold children -->
            <template is="dom-if" if="{{_isItemParent(item, keys.children)]]">
              <px-app-nav-group label="[[_getItemProp(item, keys.label)]]" icon="[[_getItemProp(item, keys.icon)]]" selected\$="[[_isItemSelected(item, selectedMeta.parent)]]" collapsed\$="[[vertical]]">
                <template is="dom-repeat" items="[[_getItemProp(item, keys.children)]]" as="subitem">
                  <px-app-nav-subitem item="[[subitem]]" label="[[_getItemProp(subitem, keys.label)]]" href="[[_getItemProp(item, keys.href)]]" window-name="[[_getItemProp(item, keys.window)]]" selected\$="[[_isItemSelected(subitem, selectedMeta.item)]]">
                  </px-app-nav-subitem>
                </template>
              </px-app-nav-group>
            </template>

            <!-- Stamp plain old items, which hold children -->
            <template is="dom-if" if="[[_isItemNotParent(item, keys.children)}}">
              <px-app-nav-item item="[[item]]" label="[[_getItemProp(item, keys.label)]]" icon="[[_getItemProp(item, keys.icon)]]" href="[[_getItemProp(item, keys.href)]]" window-name="[[_getItemProp(item, keys.window)]]" selected\$="[[_isItemSelected(item, selectedMeta.item)]]">
              </px-app-nav-item>
            </template>
          </template>
        </template>

        <!-- STATE: Items overflowed or collapsed -->
        <template is="dom-if" if="[[anyOverflowed]]">
          <px-app-nav-group id="overflowedGroup" cancel-select="" fixed-width="[[_getDropdownWidth(allCollapsed, anyOverflowed)]]" label="[[_getDropdownLabel(selectedMeta.item, selectedMeta.parent, keys.label, collapseWithIcon, allCollapsed)]]" icon="[[_getDropdownIcon(selectedMeta.item, selectedMeta.parent, keys.icon, collapseWithIcon, allCollapsed, anyOverflowed, collapseOpened)]]" selected\$="[[_isSelectedOverflowed(selectedMeta.item, selectedMeta.parent, overflowedItems)]]" hide-dropdown-icon="[[_isCollapsedCaratHidden(allCollapsed, collapseWithIcon)]]" no-highlight="[[allCollapsed]]" empty-icon="[[_isCollapsedDropdownEmpty(selectedMeta.item, allCollapsed, collapseWithIcon)]]" empty-label="[[_isCollapsedDropdownEmpty(selectedMeta.item, allCollapsed, collapseWithIcon)]]" fit-into="[[fitInto]]" opened="{{collapseOpened}}">
            <!-- Second item stamp: overflowed/collapsed items -->
            <template is="dom-repeat" items="[[items]]" filter="_isItemOverflowed" id="overflowed">
              <!-- Stamp groups, which hold children -->
              <template is="dom-if" if="[[_isItemParent(item, keys.children)]]">
                <px-app-nav-subgroup label="[[_getItemProp(item, keys.label)]]" icon="[[_getItemProp(item, keys.icon)]]" selected\$="[[_isItemSelected(item, selectedMeta.parent)]]" overflowed\$="[[someOverflowed]]" collapsed\$="[[allCollapsed]]" opened\$="[[_isOpened(item)]]">
                  <template is="dom-repeat" items="[[_getItemProp(item, keys.children)]]" as="subitem">
                    <px-app-nav-subitem item="[[subitem]]" label="[[_getItemProp(subitem, keys.label)]]" href="[[_getItemProp(subitem, keys.href)]]" window-name="[[_getItemProp(subitem, keys.window)]]" selected\$="[[_isItemSelected(subitem, selectedMeta.item)]]" parent-selected\$="[[_isItemSelected(item, selectedMeta.parent)]]" collapsed\$="[[allCollapsed]]">
                    
                  </px-app-nav-subitem></template>
                </px-app-nav-subgroup>
              </template>

              <!-- Stamp plain old items, which hold children -->
              <template is="dom-if" if="[[_isItemNotParent(item, keys.children)]]">
                <px-app-nav-item item="[[item]]" label="[[_getItemProp(item, keys.label)]]" icon="[[_getItemProp(item, keys.icon)]]" href="[[_getItemProp(item, keys.href)]]" window-name="[[_getItemProp(item, keys.window)]]" selected\$="[[_isItemSelected(item, selectedMeta.item)]]" overflowed\$="[[someOverflowed]]" collapsed\$="[[allCollapsed]]">
                </px-app-nav-item>
              </template>
            </template>
          </px-app-nav-group>
        </template>

        <!-- STATE: Vertical nav -->
        <template is="dom-if" if="[[vertical]]">
          <!-- Second item stamp: overflowed/collapsed items -->
          <template is="dom-repeat" items="[[items]]" id="vertical">
            <!-- Stamp groups, which hold children -->
            <template is="dom-if" if="[[_isItemParent(item, keys.children)]]">
              <px-app-nav-subgroup label="[[_getItemProp(item, keys.label)]]" icon="[[_getItemProp(item, keys.icon)]]" selected\$="[[_isItemSelected(item, selectedMeta.parent)]]" collapsed="" only-show-icon="[[!verticalOpened]]" empty-icon="[[_isIconEmpty(item, keys.icon)]]" opened\$="[[_isOpened(item)]]" item="[[item]]">
                <template is="dom-repeat" items="[[_getItemProp(item, keys.children)]]" as="subitem">
                  <px-app-nav-subitem item="[[subitem]]" label="[[_getItemProp(subitem, keys.label)]]" href="[[_getItemProp(subitem, keys.href)]]" window-name="[[_getItemProp(subitem, keys.window)]]" selected\$="[[_isItemSelected(subitem, selectedMeta.item)]]" parent-selected\$="[[_isItemSelected(item, selectedMeta.parent)]]" collapsed="">
                </px-app-nav-subitem></template>
              </px-app-nav-subgroup>
            </template>

            <!-- Stamp plain old items, which hold children -->
            <template is="dom-if" if="[[_isItemNotParent(item, keys.children)]]">
              <px-app-nav-item item="[[item]]" label="[[_getItemProp(item, keys.label)]]" icon="[[_getItemProp(item, keys.icon)]]" href="[[_getItemProp(item, keys.href)]]" window-name="[[_getItemProp(item, keys.window)]]" selected\$="[[_isItemSelected(item, selectedMeta.item)]]" collapsed="" only-show-icon\$="[[!verticalOpened]]" empty-icon="[[_isIconEmpty(item, keys.icon)]]">
              </px-app-nav-item>
            </template>
          </template>
        </template>
      </section>

      <section class="app-nav__actions" id="actions">
        <slot id="actionsvisible" name="actions"></slot>
      </section>
    </section>
`,

  is: 'px-app-nav',

  behaviors: [
    IronResizableBehavior,
    PxAppNavBehavior.MeasureText,
    PxAppBehavior.AssetGraph,
    PxAppBehavior.AssetSelectable,
  ],

  properties: {
    /**
     * An array of objects that will be used to build the nav. Top-level items
     * can optionally have one level of children beneath them, turning the
     * top-level item into a dropdown group.
     *
     * Selecting an item automatically selects its parent if it has one.
     * For the navigation, top-level items with children cannot be selected
     * directly - instead, users can select a child item and its parent will
     * also be marked as selected (and set as the `selectedItemParent`).
     *
     * All items should have at least the following properties:
     *
     * - {String} id - A unique string that identifies the item. Should only
     * contain valid ASCII characters. Its recommended to only use URI-safe
     * characters to allow for easy binding to the URL. Examples: 'home' or 'alerts'
     * - {String} label - A short, human-readable text label for the item.
     *
     * The following optional properties can be used for top-level items only:
     *
     * - {String} icon - The name of a valid px-icon that will be placed
     * next to the text label for the item. Use a valid icon from px-icon-set
     * or define your own using the px-iconset or px-iconset-svg elements.
     * - {Array} children - An array of subitem objects that will placed in a
     * dropdown under the top-level item. Each subitem must have a `path`
     * and `label` defined. If an `icon` or `children` property is defined
     * on a subitem, those properties will be ignored.
     * - {Boolean} opened - (only valid if item has children) A boolean value
     * that set the group to open by default.
     *
     * The following optional properties can only be used on items with no children:
     *
     * - {String} href - Overrides the default route navigation and instead opens the specified
     * external link. (customize window/tab behavior using window property)
     * - {String} window - (only valid if `href` used) String that identifies
     * the window/tab to open the external link in. Use '_self' for current window/tab,
     * a name to renavigate a named window/tab, or exclude this property for a new window/tab.
     *
     * The following is an example of a list of valid nav items:
     *
     *     [
     *       { "label" : "Home",   "id" : "home",   "icon" : "px-fea:home" },
     *       { "label" : "Alerts", "id" : "alerts", "icon" : "px-fea:alerts" },
     *       { "label" : "Assets", "id" : "assets", "icon" : "px-fea:asset", "children": [
     *         { "label" : "Asset #1", "id" : "a1" },
     *         { "label" : "Asset #2", "id" : "a2" },
     *         { "label" : "Asset #3 (ext)", "id" : "a3", href: "https://predix-ui.com" }
     *       ] }
     *     ]
     *
     * The item property names can be changed, e.g. to choose a different item
     * property to serve as a unique ID. See the `keys` property for details.
     *
     * @property items
     */

    /**
     * A reference to the currently selected item. Use this property to set the
     * selected item directly. The object passed to this property must be a
     * direct reference to one of the `items` objects. Changing this property
     * will automatically update the `selectedRoute`.
     *
     * Selecting an item automatically selects its parent if it has one.
     * For the navigation, top-level items with children cannot be selected
     * directly - instead, select a child item and its parent will also be
     * marked as selected (and set as the `selectedItemParent`).
     *
     * See `selectedRoute` for an alternative way to select items.
     *
     * @property selected
     */

    /**
     * The route to the selected item as an array of strings. Use this property
     * to set the selected item by route, or to bind to updates when the
     * selected item is changed. Changing this property will automatically
     * update the `selectedItem`.
     *
     * The route array starts at the top of the graph and ends with the selected
     * item. Each route entry is a string that corresponds to the unique ID
     * of an item. The item property this unique ID will be taken from can be
     * configured with the `key` property. By default, it will be `item.id`.
     *
     * Selecting an item automatically selects its parent if it has one.
     * For the navigation, top-level items with children cannot be selected
     * directly - instead, select a child item and its parent will also be
     * marked as selected (and set as the `selectedItemParent`).
     *
     * For example, given the following graph:
     *
     *     [
     *       {
     *         "label" : "Dashboards",
     *         "id" : "dash",
     *         "children" : [
     *           { "label" : "Truck Statuses", "id" : "trucks" },
     *           { "label" : "Generator Alerts", "id" : "generators" }
     *         ]
     *       },
     *     ]
     *
     * To select the "Truck Statuses" page, set the route array to:
     *
     *     ["dash", "trucks"]
     *
     * If the user then selects the "Generator Alerts" item, the route array
     * would be replaced with a new array with the following entries:
     *
     *     ["dash", "generators"]
     *
     * @property selectedRoute
     */

    /**
     * Changes the item properties (keys) that will be used internally to find
     * each item's unique ID, label, icon, and child list.
     *
     * Use this property if you already have a predefined data schema for your
     * application and want to customize this component to match your schema.
     * Otherwise, its recommended to leave the defaults.
     *
     * The following properties can be set:
     *
     * - id: [default='id'] a unique ID for the item
     * - label: [default='label'] a human-readable label
     * - icon: [default='icon'] an icon configuration string
     * - children: [default='children'] an array of child items
     * - href: [default='href'] URL to navigate to on selection
     * - window: [default='window'] browsing context that navigation will occur on
     *
     * If you want to configure any keys, you must set all the keys. If any
     * of the keys are not defined, the navigation will fail.
     *
     * For example, the schema could be changed to the following:
     *
     *     {
     *       "id" : "assetId",
     *       "label" : "assetName",
     *       "icon" : "assetIcon",
     *       "children" : "subAssets",
     *       "href": "href",
     *       "window": "window"
     *     }
     *
     * @property keys
     */

    /**
     * Set to `true` to collapse all nav items into a dropdown. Makes the nav
     * more accessible on mobile devices.
     *
     * Use `collapseAt` instead to dynamically collapse the nav based on the
     * current window size.
     */
    collapseAll: {
      type: Boolean,
      value: false,
      observer: '_handleCollapseAllChanged',
      notify: true
    },

    /**
     * The width below which the nav will automatically collapse. Use a number
     * (e.g. `450`) which will be converted to a pixel value (e.g. '450px').
     *
     * This property will overwrite the `collapseAll` property. Avoid data
     * binding in to both properties at the same time.
     */
    collapseAt: {
      type: Number,
      observer: 'rebuild'
    },

    /**
     * Set to `true` to show an open/close icon for the collapsed menu instead
     * of the selected item.
     */
    collapseWithIcon: {
      type: Boolean,
      value: false
    },

    /**
     * When `true`, the collapse dropdown is open. When `false`, it is closed
     * or does not exist.
     */
    collapseOpened: {
      type: Boolean,
      value: false,
      notify: true
    },

    /**
     * Shows the vertical navigation. The navigation will be take up the
     * full left-hand side of the page.
     */
    vertical: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },

    /**
     * When `true`, the vertical navigation is open. 
     * When `false`, the vertical navigation is closed.
     * 
     * This property is controlled by two means:
     *    1. when `verticalOpenedAt` is configured and its
     *        value is currently below `_parentWidth`
     *    2. otherwise, `mouseenter` and `mouseleave` events
     */
    verticalOpened: {
      type: Boolean,
      value: false,
      notify: true,
      readOnly: true,
      reflectToAttribute: true
    },

    /**
     * The parent container width at which the vertical navigation should be opened. 
     * Use a number (e.g. `600`) which will be converted to a pixel value (e.g. '600px').
     * 
     * This property will overwrite the `verticalOpened` property. Avoid data
     * binding in both properties at the same time.
     */
    verticalOpenedAt: {
      type: Number,
      observer: 'rebuild'
    },

    /**
     * An array of items that are currently visible — they fit in the menu
     * and are not overflowed or collapse.
     */
    visibleItems: {
      type: Array,
      notify: true,
      readOnly: true
    },

    /**
     * An array of items that are currently hidden in the overflow dropdown
     * or in the collapsed dropdown.
     */
    overflowedItems: {
      type: Array,
      notify: true,
      readOnly: true
    },

    /**
     * True if all items are collapsed.
     */
    allCollapsed: {
      type: Boolean,
      value: false,
      notify: true,
      readOnly: true,
      computed: '_computeAllCollapsed(overflowedItems,visibleItems)'
    },

    /**
     * True if some items are overflowed, or all items are collapsed.
     */
    anyOverflowed: {
      type: Boolean,
      value: false,
      notify: true,
      readOnly: true,
      computed: '_computeAnyOverflowed(overflowedItems,visibleItems)'
    },

    /**
     * True if some items are overflowed, and some items are visible.
     */
    someOverflowed: {
      type: Boolean,
      value: false,
      notify: true,
      readOnly: true,
      computed: '_computeSomeOverflowed(overflowedItems,visibleItems)'
    },

    /**
     * Reference the HTMLElement to fit any nav dropdowns into. Dropdowns will
     * automatically be constrained to fit their width and height inside
     * this container element. If the nav items in the dropdown are wider than
     * the container, they will be truncated with ellipses. If the nav items
     * in the dropdown are taller than the container, the dropdown will show
     * and scroll bar so users can see the overset items.
     *
     * By default, dropdowns will be fit into the `window`. If your nav is
     * placed inside of another container, and should not expand to take
     * up all available space in the window, use this property to constrain
     * the dropdowns' sizes.
     */
    fitInto: {
      type: HTMLElement
    },

    /**
     * Available width within the `px-app-nav` container element.
     */
    _availableWidth: {
      type: Number,
      observer: 'rebuild'
    },

    /**
     * Width of the `px-app-nav` parent element.
     */
    _parentWidth: {
      type: Number,
      observer: 'rebuild'
    },

    /**
     * Integer value in [ms] to delay opening the vertical nav until the mouse
     * has hover the specified time.
     */
    delaySlideAnimation: {
      type: Number,
      value: 0,
      reflectToAttribute: true
    },

    _delayAnimationAsyncHandler: {
      type: Number,
      value: undefined
    }
  },

  /**
   * Static values we use to calculate the size of items when we do math to
   * measure if they can fit in the nav.
   */
  _statics: {
    ITEM_PADDING: '1rem', /*on both sides*/
    ITEM_ICON_WIDTH: '2rem',
    ITEM_ICON_PADDING: '0.33rem', /*only on one side*/
    OPEN_ICON_WIDTH: '1.33rem',
    OPEN_ICON_PADDING: '0.2rem' /*only on one side*/
  },

  observers: [
    '_handleItemVisibilityChanged(visibleItems, overflowedItems, visibleItems.*, overflowedItems.*)'
  ],

  listeners: {
    'iron-resize' : '_handleResize',
    'px-app-nav-item-tapped' : '_itemSelectedByEvent',
    'mouseenter' : '_handleMouseEnter',
    'mouseleave' : '_handleMouseLeave',
    'px-app-asset-graph-created' : 'rebuild',
    'px-app-nav-rebuilt' : '_handleRebuild',
    'tap' : '_handleTap'
  },

  _handleTap() {
    // Force navigation bar open on click to eliminate weird double slide animation effect.
    this._setVerticalOpened(true);
  },

  ready() {
    // Update `keys` map with `href` and `window` values
    // TODO: Move to `px-app-helpers`
    if (!this.keys.href) this.keys.href = 'href';
    if (!this.keys.window) this.keys.window = 'window';
  },

  _handleRebuild() {
    if (!this.collapseAll && !this.vertical && this.anyOverflowed && this.collapseOpened) {
      if (!this._collapsedGroup) {
        var group = dom(this.root).querySelector('#overflowedGroup');
        if (!group) return;
        this._collapsedGroup = group;
      }

      this._collapsedGroup.refitGroup();
    }
  },

  _handleMouseEnter() {
    if (!this.vertical || this._isVerticalOpenedByThreshold()) return;

    this._mouseIsOverNav = true;

    var delay = this.delaySlideAnimation;
    this._delayAnimationAsyncHandler = this.async(() => {
      if (this.isDebouncerActive('close-nav-on-mouseleave')) {
        this.cancelDebouncer('close-nav-on-mouseleave');
      }

      if (this._mouseIsOverNav && !this.verticalOpened) {
        this._setVerticalOpened(true);
      }
    }, delay);
  },

  _handleMouseLeave() {
    if (!this.vertical || this._isVerticalOpenedByThreshold()) return;

    if (this._delayAnimationAsyncHandler) {
      this.cancelAsync(this._delayAnimationAsyncHandler);
      this._delayAnimationAsyncHandler = undefined;
    }

    this._mouseIsOverNav = false;
    this.debounce('close-nav-on-mouseleave', function() {
      if (!this._mouseIsOverNav && this.verticalOpened) {
        this._setVerticalOpened(false);
      }
    }, 250);
  },

  /**
   * Calls the render methods on dom-repeats to force them to re-filter their
   * items when `visibleItems` or `overflowedItems` changes.
   */
  _handleItemVisibilityChanged() {
    this.debounce('item-visibility-changed', function(){
      const visibleEl = dom(this.root).querySelector('#visible');
      const overflowedEl = dom(this.root).querySelector('#overflowed');
      if (visibleEl) visibleEl.render();
      if (overflowedEl) overflowedEl.render();
    });
  },

  /**
   * Forces a rebuild to collapse all items when `collapseAll` becomes true.
   * Forces a re-measure and rebuild to un-collapse all items when
   * `collapseAll` becomes false.
   *
   * @param  {Boolean} collapseAll
   */
  _handleCollapseAllChanged(collapseAll) {
    if (collapseAll) {
      this.rebuild();
    }
    if (!collapseAll) {
      this._availableWidth = null; // Forces width to notify changes
      this._handleResize();
    }
  },

  /**
   * Updates the selected item when the user taps on a nav item button.
   * If the button was for an external link, have window open it.
   */
  _itemSelectedByEvent(evt) {
    if (evt.detail.item) {
      this.select(evt.detail.item, 'DOM_EVENT');
    }
  },

  /**
   * Called when an `iron-resize` event notifies the element that its
   * parent container size may have changed.
   *
   * Size changed events will be collapsed to only trigger a new measurement
   * every 100ms. If the menu is currently collapsed, measure events
   * will not be triggered.
   */
  _handleResize(evt) {
    if (this.collapseAll || (this.vertical && typeof this.verticalOpenedAt !== 'number')) return;

    const debouncer = 'measure-available-and-parent-width';
    if (typeof this._availableWidth !== 'number' || typeof this._parentWidth !== 'number') {
      this._measureAvailableAndParentWidth();
      return;
    }
    if (this.isDebouncerActive(debouncer)) {
      this.cancelDebouncer(debouncer);
    }
    this.debounce(debouncer, this._measureAvailableAndParentWidth.bind(this), 100);
  },

  /**
   * Measures the width the nav items may occupy, allowing the component to
   * do math to see which items fit/are visible and which don't fit/will be
   * overflowed. Measurements happen in the next animation frame, ensuring
   * we don't trigger a premature reflow and that the tab is visible.
   */
  _measureAvailableAndParentWidth() {
    window.requestAnimationFrame(() => {
      const containerEl = this.$.container;
      const actionsEl = this.$.actions;
      if (containerEl && actionsEl) {
        const containerWidth = containerEl.getBoundingClientRect().width;
        const actionsWidth = actionsEl.getBoundingClientRect().width;
        const width = containerWidth - actionsWidth;
        if (this._availableWidth !== width) this.set('_availableWidth', width);
      }

      const parentEl = this.parentElement;
      if (parentEl) {
        const width = parentEl.getBoundingClientRect().width;
        if (this._parentWidth !== width) this.set('_parentWidth', width);
      }
    });
  },

  /**
   * Rebuilds the navigation by measuring the expected length of each nav
   * item and determining which items will fit in the available nav width.
   * The items that fit are added to the `visibleItems` list, and the items
   * that do not fit  are added to the `overflowedItems` list.
   *
   * This method will only run if some nav items have been passed to the
   * `items` attribute or property.
   *
   * @return {Array.<Array>} - First item is the list of visible items (if any), second item is the list of overflowed items (if any)
   */
  rebuild() {
    if (!this.items || !Array.isArray(this.items) || 
        (!this.collapseAll && !this.vertical && typeof this._availableWidth !== 'number') || 
        (this.vertical && typeof this.verticalOpenedAt !== 'number' && !this._parentWidth)) return;

    if (this.vertical) {
      if (this.verticalOpenedAt >= 0) this._setVerticalOpened(this._parentWidth > this.verticalOpenedAt);

      this._setVisibleItems(this.items.slice(0));
      this._setOverflowedItems([]);
      return [this.visibleItems, this.overflowedItems];
    }
    if (this.collapseAll || this._availableWidth === 0 || (typeof this.collapseAt === 'number' && this._availableWidth <= this.collapseAt)) {
      this._setVisibleItems([]);
      this._setOverflowedItems(this.items.slice(0));
      this.fire('px-app-nav-rebuilt');
      return [this.visibleItems, this.overflowedItems];
    }

    const measurements = this._measureItems(this.items);
    const {visible, overflowed} = this._fitItems(this.items, measurements, this._availableWidth);

    // If only one item can fit, and there is more than one nav item defined,
    // switch to collapsed mode
    if (visible.length === 1 && this.items.length > 1) {
      this._setVisibleItems([]);
      this._setOverflowedItems(this.items.slice(0));
      this.fire('px-app-nav-rebuilt');
      return [this.visibleItems, this.overflowedItems];
    }

    this._setVisibleItems(visible);
    this._setOverflowedItems(overflowed);
    this.notifyPath('visibleItems.*');
    this.notifyPath('overflowedItems.*');

    this.fire('px-app-nav-rebuilt');
    return [this.visibleItems, this.overflowedItems];
  },

  /**
   * Iterates over a list of items and determines which will fit into the
   * available width and which will not.
   *
   * If any items do not fit, backtracks and reduces the available width to
   * ensure an overflowed icon will also fit.
   *
   * @param  {Array} items - A flat Array of items to fit
   * @param  {Array} measurements - An Array of measurements for each item, in the same order as the items list
   * @param  {Number} width - The width to fit the items into
   * @return {Array.<Array>} - First entry is Array of items that fit, second entry is Array of items that do not fit
   */
  _fitItems(items, measurements, width) {
    let available = width;

    // If the first item is larger than the available, collapse all
    if (available < measurements[0]) {
      return { visible: [], overflowed: items.slice(0) };
    }

    // Try to fit items in the available space
    let i = 0;
    let len = items.length;

    while (i<len && available>0) {
      if (measurements[i] > available) {
        break;
      }
      available -= measurements[i];
      i++;
    }

    // If any overflow, ensure the overflow icon can fit
    const {itemPadding, iconSize} = this._getItemStyles();
    let overflowSize = (itemPadding*2) + iconSize;
    if (i !== len && available < overflowSize) {
      available -= overflowSize;
      while (i>0 && available<0) {
        available += measurements[i];
        i--;
      }
    }
    return { visible: items.slice(0,i), overflowed: items.slice(i) };
  },

  /**
   * Measures the expected width for each item based on static values. This
   * speeds up calculation on which items will fit — we do not have to
   * paint items then measure and hide the overflowed items triggering
   * another repaint. Instead, we can do math based off the items values
   * and measure them using a canvas to come up with a good guess for their size.
   *
   * @param  {Array} items - A flat Array of items to fit
   * @return {Array} - A list of measurements for each item, in the same order as the items list
   */
  _measureItems(items) {
    const boundMeasureFn = this._measureItem.bind(this);
    return items.map(boundMeasureFn);
  },

  /**
   * Measures each item using the `_measureText` behavior and returns the
   * expected length of the item in pixels as a number.
   *
   * @param  {Object} item
   * @return {Number}
   */
  _measureItem(item) {
    const {fontFamily, fontSize, itemPadding, iconSize, iconPadding, openIconSize, openIconPadding} = this._getItemStyles();
    const textLength = this._measureText(item[this.keys.label], fontFamily, fontSize);
    if (!textLength) return;
    let totalLength = textLength; /* start with text size */
    totalLength += (itemPadding*2); /* add left pad + right pad */
    if (item[this.keys.icon] && item[this.keys.icon].length) totalLength += (iconSize + iconPadding); /* add icon size + icon right pad */
    if (item[this.keys.children] && item[this.keys.children].length) totalLength += (openIconSize + openIconPadding); /* add dropdown icon size + dropdown icon left pad */
    return totalLength;
  },

  /**
   * Fetches the font styles for this element from the DOM. Caches the result
   * so we only need to call the `CSSText` API once (this forces a reflow).
   *
   * @TODO: What if the font-size and font-family change at runtime? How should
   * we balance performance of calling expensive DOM APIs and ensuring the
   * component correctly reacts to its current CSS state at any time?
   *
   * @return {Object} styles
   * @return {String} styles.fontName - The CSS 'font-name' of this element
   * @return {String} styles.fontFamily - The CSS 'font-family' of this element
   * @return {Number} styles.iconSize - The size of the icon in pixels as a number
   */
  _getItemStyles() {
    if (!this._fontStyleCache) {
      const {fontSize, fontFamily} = window.getComputedStyle(this);
      const rem = (val) => this._remToPx(parseFloat(val));
      const parse = (cssVar, fallbackRem) => this._parseSizeStyleVar(cssVar, rem(fallbackRem), parseInt(fontSize));
      const itemPadding = parse('--px-app-nav-item-padding', this._statics.ITEM_PADDING);
      const iconSize = parse('--px-app-nav-item-icon-size', this._statics.ITEM_ICON_WIDTH);
      const iconPadding = rem(this._statics.ITEM_ICON_PADDING);
      const openIconSize = rem(this._statics.OPEN_ICON_WIDTH);
      const openIconPadding = rem(this._statics.OPEN_ICON_PADDING);
      this._fontStyleCache = {fontSize, fontFamily, itemPadding, iconSize, iconPadding, openIconSize, openIconPadding};
    }
    return this._fontStyleCache;
  },

  /**
   * Parses a CSS style variable. If the style variable is defined,
   * parses it into a relative pixel value (for px, em, and rem only).
   * If it is not defined, returns the fallback.
   *
   * @param  {String} cssVar - e.g. '--px-app-nav-item-padding'
   * @param  {Number} fallback - Fallback if the style variable is undefined or can't be parsed
   * @return {Number}
   */
  _parseSizeStyleVar(cssVar, fallback, emBase) {
    const val = this.getComputedStyleValue(cssVar);
    if (typeof val === 'string' && val.slice(-2) === 'px') {
      return parseInt(val);
    }
    if (typeof val === 'string' && val.slice(-2) === 'em') {
      return emBase * parseFloat(val);
    }
    if (typeof val === 'string' && val.slice(-2) === 'rem') {
      return this._remToPx(parseFloat(val));
    }
    return fallback;
  },

  /**
   * Converts a REM-based value to a pixel value and returns as a parsed number.
   *
   * @param  {Number} rem - A parsed rem integer or float
   * @return {Number}
   */
  _remToPx(rem) {
    const remBase = this._documentRemBaseCache = (this._documentRemBaseCache || parseInt(window.getComputedStyle(document.documentElement).fontSize));
    return Math.round(rem * remBase);
  },

  /**
   * Gets the dropdown label text.
   *
   * There is no label text if:
   * - the menu is not collapsed
   * - the menu is collapsed and `collapseWithIcon` is true
   * - the menu is collapsed and there is no selected item
   *
   * If the menu is collapsed and an item is selected, returns the selected
   * item's label text.
   *
   * Otherwise, returns null.
   *
   * @param  {Object|null} selectedItem
   * @param  {Object|null} selectedItemParent
   * @param  {String} labelKey
   * @param  {Boolean} collapseWithIcon
   * @param  {Boolean} allCollapsed
   * @return {String|null}
   */
  _getDropdownLabel(selectedItem, selectedItemParent, labelKey, collapseWithIcon, allCollapsed) {
    if (allCollapsed && selectedItemParent && typeof selectedItemParent === 'object' && !collapseWithIcon) {
      return selectedItemParent[labelKey];
    }
    if (allCollapsed && selectedItem && typeof selectedItem === 'object' && !collapseWithIcon) {
      return selectedItem[labelKey];
    }
    return null;
  },

  /**
   * Gets the dropdown icon.
   *
   * 1. If some items are overflowed but the menu is not collapsed, returns
   * the double-right-arrow icon.
   * 2. If all items are overflowed, `collapseWithIcon` is true, and the collapse
   * dropdown is closed, returns the hamburger icon.
   * 3. If all items are overflowed, `collapseWithIcon` is true, and the collapse
   * dropdown is opened, returns the X (close) icon.
   * 4. If all items are overflowed, and an item is selected, returns
   * the selected item's icon (if it exists).
   *
   * Otherwise, returns null.
   *
   * @param  {Object|null} selectedItem
   * @param  {Object|null} selectedItemParent
   * @param  {String} iconKey
   * @param  {Boolean} collapseWithIcon
   * @param  {Boolean} allCollapsed
   * @param  {Boolean} anyOverflowed
   * @param  {Boolean} collapseOpened
   * @return {String|null}
   */
  _getDropdownIcon(selectedItem, selectedItemParent, iconKey, collapseWithIcon, allCollapsed, anyOverflowed, collapseOpened) {
    if (anyOverflowed && !allCollapsed) {
      return 'px-utl:overflow';
    }
    if (allCollapsed && collapseWithIcon && !collapseOpened) {
      return 'px-nav:hamburger';
    }
    if (allCollapsed && collapseWithIcon && collapseOpened) {
      return 'px-nav:close';
    }
    if (allCollapsed && selectedItemParent && typeof selectedItemParent === 'object') {
      return selectedItemParent[iconKey];
    }
    if (allCollapsed && selectedItem && typeof selectedItem === 'object') {
      return selectedItem[iconKey];
    }
    return null;
  },

  /**
   * If the dropdown is collapsed, reads the `-px-app-nav-collapsed-width--open`
   * style variable and returns it or default value `320`.
   *
   * @return {Number|undefined}
   */
  _getDropdownWidth(allCollapsed, anyOverflowed) {
    const width = parseInt(this.getComputedStyleValue('--px-app-nav-collapsed-width'));
    if (allCollapsed && !isNaN(width)) return width; 
    else if (allCollapsed) return 350;
    else if (anyOverflowed) return undefined;
    else return 320;
  },

  /**
   * Fetches an item's property at the configured key. Used to dynamically
   * fetch the item's label, icon, children, etc. based on the configured
   * `keys` for the app.
   *
   * @param  {Object} item
   * @param  {String} key
   * @return {String}
   */
  _getItemProp(item, key) {
    return item[key];
  },

  /**
   * Hides the dropdown carat if all nav items are not collapsed, or if
   * the collapsed dropdown uses an open/closed icon.
   *
   * @param  {Boolean} allCollapsed
   * @param  {Boolean} collapseWithIcon
   * @return {Boolean}
   */
  _isCollapsedCaratHidden(allCollapsed, collapseWithIcon) {
    return !allCollapsed || collapseWithIcon;
  },

  /**
   * Sets the collapsed dropdown to show an empty/unselected state if the
   * nav is collapsed but no item is selected.
   *
   * @param  {Object|null} selectedItem
   * @param  {Boolean} allCollapsed
   * @return {Boolean} - `true` if no item is selected, `false` if an item is selected or the nav is not collapsed
   */
  _isCollapsedDropdownEmpty(selectedItem, allCollapsed, collapseWithIcon) {
    return allCollapsed && !collapseWithIcon && (!selectedItem || typeof selectedItem !== 'object');
  },

  /**
   * Checks if the sub group should be opened.
   *
   * @param  {Object|null} item
   * @return {Boolean}
   */
  _isOpened(item) {
    return item.opened === true;
  },

  /**
   * @param  {Boolean} item
   * @param  {Object|null} selectedItem
   * @return {Boolean}
   */
  _isItemSelected(item, selectedItem) {
    return item && selectedItem && item === selectedItem;
  },

  /**
   * Triggered automatically when `visibleItems` changes. Filters the dom-repeats
   * to show/collapse items.
   *
   * @param  {Object} item
   * @return {Boolean}
   */
  _isItemVisible(item) {
    if (!item || !this.visibleItems || !Array.isArray(this.visibleItems)) return false;
    return this.visibleItems.indexOf(item) !== -1;
  },

  /**
   * Triggered automatically when `overflowedItems` changes. Filters the dom-repeats
   * to show/collapse items.
   *
   * @param  {Object} item
   * @return {Boolean}
   */
  _isItemOverflowed(item) {
    if (!item || !this.overflowedItems || !Array.isArray(this.overflowedItems)) return false;
    return this.overflowedItems.indexOf(item) !== -1;
  },

  /**
   * Checks if the item is a parent of children.
   *
   * @param  {Object} item
   * @return {Boolean}
   */
  _isItemParent(item, childrenKey) {
    return item.hasOwnProperty(childrenKey) && Array.isArray(item[childrenKey]) && item[childrenKey].length > 0;
  },

  /**
   * Checks if the item is NOT a parent of children.
   *
   * @param  {Object} item
   * @return {Boolean}
   */
  _isItemNotParent(item, childrenKey) {
    return !item.hasOwnProperty(childrenKey) || !Array.isArray(item[childrenKey]) || item[childrenKey].length === 0;
  },

  /**
   * Checks if the selected item is in the overflow list.
   *
   * @param  {Object|null} selectedItem
   * @param  {Array} overflowedItems
   * @return {Boolean}
   */
  _isSelectedOverflowed(selectedItem, selectedItemParent, overflowedItems) {
    if (!selectedItem || !overflowedItems || !Array.isArray(overflowedItems) || !overflowedItems.length) return false;
    if (selectedItemParent) return overflowedItems.indexOf(selectedItemParent) !== -1;
    return overflowedItems.indexOf(selectedItem) !== -1;
  },

  /**
   * Checks if the icon is undefined or an empty string.
   *
   * @param  {Object|null} item
   * @param  {String} iconKey
   * @return {Boolean}
   */
  _isIconEmpty(item, iconKey) {
    return (!item.hasOwnProperty(iconKey) || typeof item[iconKey] !== 'string' && item[iconKey].length >= 0);
  },

  /**
   * Checks if the vertical navigation is currently opened 
   * by means of the `verticalOpenedAt` property.
   */
  _isVerticalOpenedByThreshold() {
    return this.verticalOpened && typeof this.verticalOpenedAt === 'number' && this._parentWidth > this.verticalOpenedAt;
  },

  /**
   * @param  {Array} overflowed
   * @param  {Array} visible
   * @return {Boolean}
   */
  _computeAnyOverflowed(overflowed, visible) {
    return Array.isArray(overflowed) && overflowed.length > 0;
  },

  /**
   * @param  {Array} overflowed
   * @param  {Array} visible
   * @return {Boolean}
   */
  _computeAllCollapsed(overflowed, visible) {
    return Array.isArray(overflowed) && overflowed.length > 0 && Array.isArray(visible) && visible.length === 0;
  },

  /**
   * @param  {Array} overflowed
   * @param  {Array} visible
   * @return {Boolean}
   */
  _computeSomeOverflowed(overflowed, visible) {
    return Array.isArray(overflowed) && overflowed.length > 0 && Array.isArray(visible) && visible.length > 0;
  }
});
