(function() {
  'use strict';

  Polymer({
    is: 'px-app-nav',

    behaviors: [Polymer.IronResizableBehavior,PxAppNavBehavior.MeasureText],

    properties: {
      /**
       * An array of objects that will be used to build the nav. Top-level items
       * can have one level of subitems beneath them, turning the parent item
       * into a dropdown group.
       *
       * All items and subitems should have at least the following properties:
       *
       * - {String} path - A unique string that identifies the item. Should only
       * contain alphanumeric characters matching A-Z, a-z, or 0-9. Avoid using
       * special characters that must be encoded or decoded in URLs. The path
       * must not contain any dots (`.`). Examples: 'home' or 'alerts'
       * - {String} label - A short, human-readable text label for the item
       *
       * The following optional properties can be used for top-level items only:
       *
       * - {String} icon - The name of a valid iron-icon that will be placed
       * next to the text label for the item. Use a valid icon from px-icon-set
       * or define your own using the iron-iconset or iron-iconset-svg elements.
       * - {Array} subitems - An array of subitem objects that will placed in a
       * dropdown under the top-level item. Each subitem must have a `path`
       * and `label` defined. If an `icon` or `subitems` property is defined
       * on a subitem, those properties will be ignored.
       *
       * Note that top-level items with subitems cannot be directly selected
       * by the user. They will only be selected when one of their subitems
       * is tapped.
       *
       * The following is an example of a list of valid nav items:
       *
       *     [
       *       { "label" : "Home",   "path" : "home",   "icon" : "px:home" },
       *       { "label" : "Alerts", "path" : "alerts", "icon" : "px:alert" },
       *       { "label" : "Assets", "path" : "assets", "icon" : "px:asset", subitems: [
       *         { "label" : "Asset #1", "path" : "a1" },
       *         { "label" : "Asset #2", "path" : "a2" }
       *       ] }
       *     ]
       *
       */
      items: {
        type: Array,
        notify: true,
        observer: '_handleNavItemsChanged'
      },

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
       * The width of the collapsed menu dropdown. Use a number (e.g. `60`) which
       * will be converted to a pixel value (e.g. '60px').
       */
      collapseDropdownWidth: {
        type: Number,
        value: 320
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
       * A reference to the currently selected item's object. This is a read-only
       * value you can bind to and use to update your app's state, e.g. to
       * change the current page to some value stored in the selected item's
       * object. To change the selected item, use the `selectedPath` attribute.
       *
       * This is a direct reference to the item that was passed into the `items`
       * list, and can be compared with its `items` entry using reference equality.
       *
       * Note that the `selectedItem` may initially notify its value as `null`
       * if no `selectedPath` is initially set, or if the `selectedPath` is
       * set late.
       */
      selectedItem: {
        type: Object,
        notify: true,
        readOnly: true,
        value: null
      },

      /**
       * A reference to the currently selected subitem's object. This is a read-only
       * value you can bind to and use to update your app's state, e.g. to
       * change the current page to some value stored in the selected subitem's
       * object. To change the selected subitem, use the `selectedSubpath` attribute.
       *
       * This is a direct reference to the subitem that was passed into the `items`
       * list, and can be compared with its `items` entry using reference equality.
       *
       * Note that the `selectedSubitem` may initially notify its value as `null`
       * if no `selectedSubath` is initially set, or if the `selectedSubpath` is
       * set late.
       */
      selectedSubitem: {
        type: Object,
        notify: true,
        readOnly: true,
        value: null
      },

      /**
       * The path of the currently selected item. Set this attribute to select
       * an item. Listen for updates to this attribute to be notified when
       * the user selects a new item.
       */
      selectedPath: {
        type: String,
        notify: true,
        observer: '_handleSelectedPathChanged'
      },

      /**
       * The path of the currently selected subitem. Set this attribute to select
       * a subitem. Listen for updates to this attribute to be notified when
       * the user selects a new subitem.
       */
      selectedSubpath: {
        type: String,
        notify: true,
        observer: '_handleSelectedPathChanged'
      },

      /**
       * The path to an item that will be visually selected and set as the
       * `selectedItem` if no valid `selectedPath` is provided.
       *
       * Note that when the fallback path is used to select an item, the `selectedPath`
       * attribute will not be updated. This ensures that data binding the
       * `selectedPath` to your app router won't spam the window location
       * with values when the page first loads. To initially select an item,
       * use `selectedPath` instead.
       */
      fallbackPath: {
        type: String
      },

      /**
       * The path to a subitem that will be visually selected and set as the
       * `selectedSubitem` if no valid `selectedPath` is provided.
       *
       * If a valid `selectedPath` is provided and no valid `selectedSubpath` is
       * provided, the fallbackSubpath will not be used.
       *
       * Note that when the fallback subpath is used to select a subitem, the `selectedSubpath`
       * attribute will not be updated. This ensures that data binding the
       * `selectedSubpath` to your app router won't spam the window location
       * with values when the page first loads. To initially select an item,
       * use `selectedSubpath` instead.
       */
      fallbackSubpath: {
        type: String
      },

      /**
       * True if the fallbackPath and/or fallbackSubpath were used to initially
       * select an item and/or subitem.
       */
      fallbackSelected: {
        type: Boolean,
        value: false,
        notify: true,
        readOnly: true
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

      _availableWidth: {
        type: Number,
        observer: 'rebuild'
      }
    },

    /**
     * Static values we use to calculate the size of items when we do math to
     * measure if they can fit in the nav.
     */
    statics: {
      ITEM_PADDING: '1rem', /*on both sides*/
      ITEM_ICON_WIDTH: '2rem',
      ITEM_ICON_PADDING: '0.33rem', /*only on one side*/
      OPEN_ICON_WIDTH: '1.33rem',
      OPEN_ICON_PADDING: '0.2rem' /*only on one side*/
    },

    observers: [
      '_handleSelectedPathChanged(fallbackPath, items)',
      '_handleItemVisibilityChanged(visibleItems, overflowedItems, visibleItems.*, overflowedItems.*)'
    ],

    listeners: {
      'iron-resize' : '_handleResize',
      'px-app-nav-item-tapped' : '_handleItemSelected'
    },

    /**
     * When the `items` list changes, retraces and memoizes item paths so they
     * can easily be found later during a selection.
     */
    _handleNavItemsChanged(items) {
      if (!items || !Array.isArray(items)) return;
      const paths = this._paths = this._traceItemPaths(items);
      this.rebuild();
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
     * When the user taps on an item or subitem, a selection request event
     * bubbles up with the new selected path. This method handles that selection
     * request and syncs the newly selected path to the `selectedPath` and
     * `selectedSubpath` properties, triggering selection.
     */
    _handleItemSelected(evt) {
      if (!evt.detail.path || !Array.isArray(evt.detail.path) || !evt.detail.path.length) return;

      if (evt.detail.path.length === 1) {
        this.set('selectedPath', evt.detail.path[0]);
        this.set('selectedSubpath', null);
      }
      if (evt.detail.path.length === 2) {
        this.set('selectedPath', evt.detail.path[0]);
        this.set('selectedSubpath', evt.detail.path[1]);
      }
    },

    /**
     * This is the single point-of-control that selects and deselects items.
     * Selection can happen in the following ways:
     *
     * - The `selectedPath` and `selectedSubpath` properties can be changed from
     * the outside through data binding
     * - The user can tap an item or subitem, triggering a selection request
     * event that that updates the `selectedPath` and `selectedSubpath`
     * - If no `selectedPath` or `selectedSubpath` are initially present, the
     * `fallbackPath` and `fallbackSubpath` are used to select an item
     *
     * This method handles all of those cases, ensuring that the selection state
     * is always kept in sync across all APIs. It searches a memoized list of
     * paths to find a reference to the item/subitem objects at the selected path,
     * and sets the `selectedItem` and `selectedSubitem` properties, triggering
     * template data binding that will tell those items to appear selected.
     */
    _handleSelectedPathChanged() {
      this.debounce('selected-path-changed', ()=>{
        // 1. Find the items
        let path = !this.selectedSubpath ? this.selectedPath : `${this.selectedPath}.${this.selectedSubpath}`;
        let [item, subitem] = this._findItemByPath(path);
        if (item) {
          this._setSelectedItem(item);
          this._setSelectedSubitem(subitem);
          this._setFallbackSelected(false);
          return;
        }

        // 2. If no items found and fallback is defined, try the fallback
        if (!item && this.fallbackPath && this.fallbackPath !== this.selectedPath) {
          let path = !this.fallbackSubpath ? this.fallbackPath : `${this.fallbackPath}.${this.fallbackSubpath}`;
          let [item, subitem] = this._findItemByPath(path);
          if (item) {
            this._setSelectedItem(item);
            this._setSelectedSubitem(subitem);
            this._setFallbackSelected(true);
            return;
          }
        }

        // 3. Fallback path can't be found either
        console.log(`Could not find an item matching the path ${path}.`)
      });
    },

    /**
     * Called when an `iron-resize` event notifies the element that its
     * parent container size may have changed.
     *
     * Size changed events will be collapsed to only trigger a new measurement
     * every 100ms. If the menu is currently collapsed, measure events
     * will not be triggered.
     */
    _handleResize() {
      if (this.collapseAll) return;

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
     * Recursively traces the paths of a list of navigation items, returning
     * an object with the stringified paths as keys and the corresponding
     * item references as values.
     */
    _traceItemPaths(items, parent, paths={}) {
      for (let item of items) {
        let pathKey = parent ? `${parent.path}.${item.path}` : item.path;
        if (paths[pathKey]) {
          console.log(`PX-APP-NAV ERR: Path ${pathKey} is duplicated. All paths must be unique.`);
        }
        else if (parent) {
          paths[pathKey] = [parent, item];
        }
        else {
          paths[pathKey] = [item];
        }

        if (item.subitems) {
          this._traceItemPaths(item.subitems, item, paths);
        }
      }

      return paths;
    },

    /**
     * Searches the memoized paths to find an item at a certain path.
     * The `pathStr` should be formatted as a string. When there is only a path
     * and no subpath, use the path directly (e.g. 'home' for path 'home').
     * When there is a path and subpath, concatenate both with a dot in the middle
     * (e.g. 'dashboards.trucks' for path 'dashboards' and subpath 'trucks').
     *
     * @param  {String} pathStr
     * @return {Array.<Object|null>}
     */
    _findItemByPath(pathStr) {
      let items = [null,null];
      if (typeof this._paths === 'object' && this._paths.hasOwnProperty(pathStr)) {
        items[0] = this._paths[pathStr][0];
        items[1] = this._paths[pathStr][1] || null;
      }
      return items;
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
     *
     *
     * @return {Array.<Array>} - First item is the list of visible items (if any), second item is the list of overflowed items (if any)
     */
    rebuild() {
      if (!this.items || !Array.isArray(this.items) || (!this.collapseAll && typeof this._availableWidth !== 'number')) return;

      if (this.collapseAll || this._availableWidth === 0 || (typeof this.collapseAt === 'number' && this._availableWidth <= this.collapseAt)) {
        this._setVisibleItems([]);
        this._setOverflowedItems(this.items.slice(0));
        return [this.visibleItems, this.overflowedItems];
      }

      const measurements = this._measureItems(this.items);
      const {visible, overflowed} = this._fitItems(this.items, measurements, this._availableWidth);

      // If only one item can fit, switch to collapsed mode
      if (visible.length === 1) {
        this._setVisibleItems([]);
        this._setOverflowedItems(this.items.slice(0));
        return [this.visibleItems, this.overflowedItems];
      }

      this._setVisibleItems(visible);
      this._setOverflowedItems(overflowed);
      this.notifyPath('visibleItems.*');
      this.notifyPath('overflowedItems.*');

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
      const textLength = this._measureText(item.label, fontFamily, fontSize);
      if (!textLength) return;
      let totalLength = textLength; /* start with text size */
      totalLength += (itemPadding*2); /* add left pad + right pad */
      if (item.icon && item.icon.length) totalLength += (iconSize + iconPadding); /* add icon size + icon right pad */
      if (item.subitems && item.subitems.length) totalLength += (openIconSize + openIconPadding); /* add dropdown icon size + dropdown icon left pad */
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
        const itemPadding = parse('--px-app-nav-item-padding', this.statics.ITEM_PADDING);
        const iconSize = parse('--px-app-nav-item-icon-size', this.statics.ITEM_ICON_WIDTH);
        const iconPadding = rem(this.statics.ITEM_ICON_PADDING);
        const openIconSize = rem(this.statics.OPEN_ICON_WIDTH);
        const openIconPadding = rem(this.statics.OPEN_ICON_PADDING);
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
     * @param  {Boolean} collapseWithIcon
     * @param  {Boolean} allCollapsed
     * @return {String|null}
     */
    _getDropdownLabel(selectedItem, collapseWithIcon, allCollapsed) {
      if (allCollapsed && selectedItem && typeof selectedItem === 'object' && !collapseWithIcon) {
        return selectedItem.label;
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
     * @param  {Boolean} collapseWithIcon
     * @param  {Boolean} allCollapsed
     * @param  {Boolean} anyOverflowed
     * @param  {Boolean} collapseOpened
     * @return {String|null}
     */
    _getDropdownIcon(selectedItem, collapseWithIcon, allCollapsed, anyOverflowed, collapseOpened) {
      if (anyOverflowed && !allCollapsed) {
        return 'px:collapse';
      }
      if (allCollapsed && collapseWithIcon && !collapseOpened) {
        return 'px:hamburger';
      }
      if (allCollapsed && collapseWithIcon && collapseOpened) {
        return 'px:close';
      }
      if (allCollapsed && selectedItem && typeof selectedItem === 'object') {
        return selectedItem.icon;
      }
      return null;
    },

    /**
     * If the dropdown is collapsed, returns the `collapseDropdownWidth` value.
     * Otherwise, returns undefined.
     *
     * @return {Number|undefined}
     */
    _getDropdownWidth(collapseDropdownWidth, allCollapsed) {
      return allCollapsed ? collapseDropdownWidth : undefined;
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
     * Checks if the item is a parent of subitems.
     *
     * @param  {Object} item
     * @return {Boolean}
     */
    _isItemParent(item) {
      return item && Array.isArray(item.subitems) && item.subitems.length;
    },

    /**
     * Checks if the item is NOT a parent of subitems.
     *
     * @param  {Object} item
     * @return {Boolean}
     */
    _isItemNotParent(item) {
      return !item.hasOwnProperty('subitems');
    },

    /**
     * Checks if the selected item is in the overflow list.
     *
     * @param  {Object|null} selectedItem
     * @param  {Array} overflowedItems
     * @return {Boolean}
     */
    _isSelectedOverflowed(selectedItem, overflowedItems) {
      if (!selectedItem || !overflowedItems || !Array.isArray(overflowedItems) || !overflowedItems.length) return false;
      return overflowedItems.indexOf(selectedItem) !== -1;
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
