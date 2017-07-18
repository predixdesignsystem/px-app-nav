(function() {
  'use strict';

  Polymer({
    is: 'px-app-nav-item',

    behaviors: [PxAppNavBehavior.Item],

    properties: {
      /**
       * Used to set the icon for the item.
       */
      icon: {
        type: String
      },

      /**
       * Set to `true` if this is a subitem.
       */
      subitem: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Shows a dropdown arrow icon to indicate this item can be tapped to
       * open a subgroup.
       */
      dropdown: {
        type: Boolean,
        value: false
      },

      /**
       * Set to `true` if the item is inside a overflowed dropdown.
       */
      overflowed: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: 'updateStyles' // Necessary to ensure correct style scoping for px-icon
      },

      /**
       * Shows an empty state outline for icon.
       */
      emptyIcon: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Shows an empty state outline for the label.
       */
      emptyLabel: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    },

    /**
     * If an item has an icon and a label, get class to add margin between them.
     */
    _addClassIfHasLabel(labelStr) {
      return (typeof labelStr === 'string' && labelStr.length) ? 'app-nav-item__icon--with-label' : '';
    }
  });
})();
