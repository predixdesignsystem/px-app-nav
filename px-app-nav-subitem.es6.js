(function() {
  'use strict';

  Polymer({
    is: 'px-app-nav-subitem',

    behaviors: [PxAppNavBehavior.Item],

    properties: {
      /**
       * Set to `true` if the subitem's parent is selected.
       */
      parentSelected: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: 'updateStyles'
      }
    }
  });
})();
