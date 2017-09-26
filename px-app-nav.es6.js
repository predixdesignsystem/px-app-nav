(function() {
  'use strict';

  Polymer({
    is: 'px-app-nav',

    behaviors: [
      Polymer.IronResizableBehavior,
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
       *
       * The following is an example of a list of valid nav items:
       *
       *     [
       *       { "label" : "Home",   "id" : "home",   "icon" : "px-fea:home" },
       *       { "label" : "Alerts", "id" : "alerts", "icon" : "px-fea:alerts" },
       *       { "label" : "Assets", "id" : "assets", "icon" : "px-fea:asset", "children": [
       *         { "label" : "Asset #1", "id" : "a1" },
       *         { "label" : "Asset #2", "id" : "a2" }
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
       *       "children" : "subAssets"
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
       * When `true`, the vertical navigation is open and the user is interacting
       * with it. When `false`, the vertical navigation is closed.
       */
      verticalOpened: {
        type: Boolean,
        value: false,
        notify: true,
        readOnly: true,
        reflectToAttribute: true
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

      _availableWidth: {
        type: Number,
        observer: 'rebuild'
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
      'px-app-nav-rebuilt' : '_handleRebuild'
    },

    _handleRebuild() {
      if (!this.collapseAll && !this.vertical && this.anyOverflowed && this.collapseOpened) {
        if (!this._collapsedGroup) {
          var group = Polymer.dom(this.root).querySelector('#overflowedGroup');
          if (!group) return;
          this._collapsedGroup = group;
        }

        this._collapsedGroup.refitGroup();
      }
    },

    _handleMouseEnter() {
      if (!this.vertical) return;

      this._mouseIsOverNav = true;
      if (this.isDebouncerActive('close-nav-on-mouseleave')) {
        this.cancelDebouncer('close-nav-on-mouseleave');
      }
      if (this._mouseIsOverNav && !this.verticalOpened) {
        this._setVerticalOpened(true);
      }
    },

    _handleMouseLeave() {
      if (!this.vertical) return;

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
        const visibleEl = Polymer.dom(this.root).querySelector('#visible');
        const overflowedEl = Polymer.dom(this.root).querySelector('#overflowed');
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
      if (this.collapseAll || this.vertical) return;

      const debouncer = 'measure-available-width';
      if (typeof this._availableWidth !== 'number') {
        this._measureAvailableWidth();
        return;
      }
      if (this.isDebouncerActive(debouncer)) {
        this.cancelDebouncer(debouncer);
      }
      this.debounce(debouncer, this._measureAvailableWidth.bind(this), 100);
    },

    /**
     * Measures the width the nav items may occupy, allowing the component to
     * do math to see which items fit/are visible and which don't fit/will be
     * overflowed. Measurements happen in the next animation frame, ensuring
     * we don't trigger a premature reflow and that the tab is visible.
     */
    _measureAvailableWidth() {
      window.requestAnimationFrame(() => {
        const containerEl = this.$.container;
        const actionsEl = this.$.actions;
        if (!containerEl || !actionsEl) return;
        const containerWidth = containerEl.getBoundingClientRect().width;
        const actionsWidth = actionsEl.getBoundingClientRect().width;
        const width = containerWidth - actionsWidth;
        if (this._availableWidth !== width) this.set('_availableWidth', width);
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
      if (!this.items || !Array.isArray(this.items) || (!this.collapseAll && !this.vertical && typeof this._availableWidth !== 'number')) return;

      if (this.vertical) {
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
    _getDropdownWidth(allCollapsed) {
      if (allCollapsed) {
        const width = parseInt(this.getComputedStyleValue('--px-app-nav-collapsed-width'));
        return isNaN(width) ? 320 : width;
      }
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
})();
