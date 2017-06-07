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
      this.fire('px-app-nav-item-tapped', {
        item: this.item
      }, {cancelable:true});
    }
  };
})();
