/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  'use strict';

  /* Ensures the behavior namespace is created */
  window.PxAppNavBehavior = (window.PxAppNavBehavior || {});

  /**
   * Items are used to display the nav `items` as a button that can be selected.
   *
   * @polymerBehavior PxAppNavBehavior.Item
   */
  PxAppNavBehavior.Item = {
    properties: {
      /**
       * A reference the object used to create this nav item.
       */
      item: {
        type: Object
      },

      /**
       * Used as the label text for the item.
       */
      label: {
        type: String
      },

      /**
       * URL to navigate to when selected.
       */
      href: {
        type: String
      },

      /**
       * A string specifying the name of the browsing context into which to load the value
       * of the `href` attribute. Default value will open a new window/tab.
       */
      windowName: {
        type: String,
        value: ''
      },

      /**
       * Set to `true` if the item is selected.
       */
      selected: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: 'updateStyles'
      },

      /**
       * Set to `true` if the item is in a collapsed dropdown.
       */
      collapsed: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: 'updateStyles'
      },

      /**
       * Cancels events that trigger selection.
       */
      cancelSelect: {
        type: Boolean,
        value: false
      }
    },

    attached() {
      this.listen(this, 'tap', '_handleSelfTapped');
    },

    detached() {
      this.unlisten(this, 'tap', '_handleSelfTapped');
    },

    /**
     * Checks if a property is the desired `type`.
     *
     * @param {*} prop
     * @returns {Boolean}
     */
    _propIsTypeOf(prop, type) {
      return prop && type && (typeof prop === type);
    },

    /**
     * Fire the select event so this item's parent will mark it as selected.
     */
    _handleSelfTapped(evt) {
      if (this.cancelSelect || !this.item) return;
      if (this.href) {
        window.open(this.href, this.windowName)
        // Do not fire select event
        return;
      }
      this.fire('px-app-nav-item-tapped', {
        item: this.item
      }, {cancelable:true});
    }
  };
})();
