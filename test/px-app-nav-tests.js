document.addEventListener("WebComponentsReady", function() {
  runCustomTests();
});

function runCustomTests() {

  describe('px-app-nav [selection API]', function() {
    it('sets its `selectedRoute` to the route of the `selected` item', function(done) {
      var fx = fixture('AppNavFixtureUnselected');
      var appNavEl = fx.querySelector('px-app-nav');
      var item = appNavEl.items[2].children[0];
      appNavEl.selected = item;

      setTimeout(function() {
        expect(appNavEl.selectedRoute).to.eql(['dashboards', 'trucks']);
        done();
      }, 50);
    });

    it('sets its `selectedMeta.parent` to reference the parent of the `selected` item', function(done) {
      var fx = fixture('AppNavFixtureUnselected');
      var appNavEl = fx.querySelector('px-app-nav');
      var item = appNavEl.items[2].children[0];
      var itemParent = appNavEl.items[2];
      appNavEl.selected = item;

      setTimeout(function() {
        expect(appNavEl.selectedMeta.parent).to.equal(itemParent);
        done();
      }, 50);
    });

    it('sets its `selectedMeta.children` property to the children of the `selected` item', function(done) {
      var fx = fixture('AppNavFixtureUnselected');
      var appNavEl = fx.querySelector('px-app-nav');
      var item = appNavEl.items[2];
      var itemChildren = appNavEl.items[2].children;
      appNavEl.selected = item;

      setTimeout(function() {
        expect(appNavEl.selectedMeta.children).to.eql(itemChildren);
        done();
      }, 50);
    });

    it('generates a `selectedMeta.path` from the root of the graph to the `selected` item', function(done) {
      var fx = fixture('AppNavFixtureUnselected');
      var appNavEl = fx.querySelector('px-app-nav');
      var item = appNavEl.items[2].children[0];
      var itemParent = appNavEl.items[2];
      appNavEl.selected = item;

      setTimeout(function() {
        expect(appNavEl.selectedMeta.path).to.be.an('array');
        expect(appNavEl.selectedMeta.path.length).to.equal(2);
        expect(appNavEl.selectedMeta.path[0]).to.equal(itemParent);
        expect(appNavEl.selectedMeta.path[1]).to.equal(item);
        done();
      }, 50);
    });


    it('selects an item by route through the `selectedRoute` property', function(done) {
      var fx = fixture('AppNavFixtureSelectedRoute');
      var appNavEl = fx.querySelector('px-app-nav');
      var routeItem = appNavEl.items[1];

      setTimeout(function() {
        expect(appNavEl.selected).to.equal(routeItem);
        done();
      }, 50);
    });

    it('selects an item and its parent by route through the `selectedRoute` property', function(done) {
      var fx = fixture('AppNavFixtureSelectedRouteNested');
      var appNavEl = fx.querySelector('px-app-nav');
      var parentItem = appNavEl.items[2];
      var item = appNavEl.items[2].children[1];

      setTimeout(function() {
        expect(appNavEl.selectedMeta.parent).to.equal(parentItem);
        expect(appNavEl.selected).to.equal(item);
        done();
      }, 50);
    });

    it('selects a different item and its parent by route through the `selectedRoute` property', function(done) {
      var fx = fixture('AppNavFixtureUnselected');
      var appNavEl = fx.querySelector('px-app-nav');
      appNavEl.selectedRoute = ['home'];

      setTimeout(function() {
        var homeItem = appNavEl.items[0];
        expect(appNavEl.selected).to.equal(homeItem);
        appNavEl.selectedRoute = ['dashboards', 'trucks'];
      }, 50);
      setTimeout(function() {
        var dashboardsItem = appNavEl.items[2];
        var trucksItem = appNavEl.items[2].children[0];
        expect(appNavEl.selectedMeta.parent).to.equal(dashboardsItem);
        expect(appNavEl.selected).to.equal(trucksItem);
        done();
      }, 60);
    });

    // it('selects a fallback item when the `fallbackPath` attribute is initially set, and no `selectedPath` is provided', function(done) {
    //   var fx = fixture('AppNavFixtureFallbackPath');
    //   var appNavEl = fx.querySelector('px-app-nav');
    //   var fallbackItem = appNavEl.items[0];
    //
    //   setTimeout(function() {
    //     expect(appNavEl.selectedItem).to.equal(fallbackItem);
    //     done();
    //   }, 50);
    // });
    //
    // it('does not update the `selectedPath` property when the `fallbackPath` item is selected', function(done) {
    //   var fx = fixture('AppNavFixtureFallbackPath');
    //   var appNavEl = fx.querySelector('px-app-nav');
    //
    //   setTimeout(function() {
    //     expect(appNavEl.selectedPath).to.be.undefined;
    //     done();
    //   }, 50);
    // });
    //
    // it('selects a fallback subitem when the `fallbackPath` and `fallbackSubpath` are initially set, and no `selectedPath` or `selectedSubpath` is provided', function(done) {
    //   var fx = fixture('AppNavFixtureFallbackSubpath');
    //   var appNavEl = fx.querySelector('px-app-nav');
    //   var fallbackItem = appNavEl.items[2];
    //   var fallbackSubitem = appNavEl.items[2].subitems[2];
    //
    //   setTimeout(function() {
    //     expect(appNavEl.selectedItem).to.equal(fallbackItem);
    //     expect(appNavEl.selectedSubitem).to.equal(fallbackSubitem);
    //     done();
    //   }, 50);
    // });
    //
    // it('does not update the `selectedPath` or `selectedSubpath` properties when the `fallbackPath` and `fallbackSubpath` items are selected', function(done) {
    //   var fx = fixture('AppNavFixtureFallbackSubpath');
    //   var appNavEl = fx.querySelector('px-app-nav');
    //
    //   setTimeout(function() {
    //     expect(appNavEl.selectedPath).to.be.undefined;
    //     expect(appNavEl.selectedSubpath).to.be.undefined;
    //     done();
    //   }, 50);
    // });
  });

  describe('px-app-nav [selecting DOM nodes]', function() {
    it('marks a <px-app-nav-item> as selected when its route is selected', function(done) {
      var fx = fixture('AppNavFixtureSelectedRoute');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var itemEls = Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item');
        var routeItemEl = itemEls.filter(el => el.item.id === 'alerts')[0];
        expect(routeItemEl.selected).to.equal(true);
        done();
      }, 50);
    });

    it('marks a <px-app-nav-group> and <px-app-nav-subitem> as selected when their route is selected', function(done) {
      var fx = fixture('AppNavFixtureSelectedRouteNested');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');
        var subitemEl = Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-subitem').filter(el => el.item.id === 'orders')[0];
        expect(groupEl.selected).to.equal(true);
        expect(subitemEl.selected).to.equal(true);
        done();
      }, 50);
    });
  });

  describe('px-app-nav [horizontal]', function() {
    it('fills its container', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var width = appNavEl.getBoundingClientRect().width;
        var height = appNavEl.getBoundingClientRect().height;
        expect(width).to.equal(1000);
        expect(height).to.equal(60);
        done();
      }, 50);
    });

    it('paints all of the groups, items and subitems it is given', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var itemEls = Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item');
        var groupEls = Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-group');
        var subitemEls = Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-subitem');
        expect(itemEls.length).to.equal(2);
        expect(groupEls.length).to.equal(1);
        expect(subitemEls.length).to.equal(3);
        done();
      }, 100);
    });

    it('selects an item when the item is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var homeItem = appNavEl.items[0];
      var itemEls;
      var itemEl;

      setTimeout(function() {
        itemEls = Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item');
        itemEl = itemEls.filter(el => el.item.id === 'home')[0];
        itemEl.click();
      }, 50);
      setTimeout(function() {
        expect(itemEl.selected).to.equal(true);
        expect(appNavEl.selectedRoute).to.eql(['home']);
        expect(appNavEl.selected).to.equal(homeItem);
        done();
      }, 100);
    });

    it('selects a new item when it is tapped, deselecting the last selected item', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var alertsItem = appNavEl.items[1];
      var itemEls;
      var firstSelectedEl;
      var secondSelectedEl;

      setTimeout(function() {
        itemEls = Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item');
        firstSelectedEl = itemEls.filter(el => el.item.id === 'home')[0];
        firstSelectedEl.click();
      }, 50);
      setTimeout(function() {
        secondSelectedEl = itemEls.filter(el => el.item.id === 'alerts')[0];
        secondSelectedEl.click();
      }, 60);
      setTimeout(function() {
        expect(firstSelectedEl.selected).to.equal(false);
        expect(secondSelectedEl.selected).to.equal(true);
        expect(appNavEl.selectedRoute).to.eql(['alerts']);
        expect(appNavEl.selected).to.equal(alertsItem);
        done();
      }, 100);
    });

    it('opens a dropdown when a group is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var groupEl;
      var groupItemEl;

      setTimeout(function() {
        groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');
        groupItemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        groupItemEl.click();
      }, 50);
      setTimeout(function() {
        expect(groupEl.opened).to.equal(true);
        done();
      }, 500);
    });

    it('closes an open dropdown when something else is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var groupEl;
      var groupItemEl;

      setTimeout(function() {
        groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');
        groupItemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        groupItemEl.click();
      }, 50);
      setTimeout(function() {
        appNavEl.click();
      }, 500);
      setTimeout(function() {
        expect(groupEl.opened).to.equal(false);
        done();
      }, 650);
    });

    it('selects a subitem and its group when the subitem is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var groupItem = appNavEl.items[2];
      var groupSubitem = groupItem.children[0];
      var groupEl;
      var groupItemEl;
      var subitemEls;
      var subitemEl;

      setTimeout(function() {
        groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');
        groupItemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        subitemEls = Polymer.dom(groupEl).querySelectorAll('px-app-nav-subitem');
        subitemEl = subitemEls.filter(el => el.item.id === 'trucks')[0];
        groupItemEl.click();
      }, 50);
      setTimeout(function() {
        subitemEl.click();
      }, 100);
      setTimeout(function() {
        expect(subitemEl.selected).to.equal(true);
        expect(appNavEl.selectedRoute).to.eql(['dashboards','trucks']);
        expect(appNavEl.selected).to.equal(groupSubitem);
        expect(appNavEl.selectedMeta.parent).to.equal(groupItem);
        done();
      }, 200);
    });

    it('marks all of its items as visible if they all fit', function(done) {
      var fx = fixture('AppNavFixtureForMeasurements');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '620px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        expect(appNavEl.visibleItems.length).to.equal(6);
        expect(appNavEl.overflowedItems.length).to.equal(0);
        expect(appNavEl.someOverflowed).to.equal(false);
        expect(appNavEl.anyOverflowed).to.equal(false);
        done();
      }, 70);
    });

    it('marks one of its items as overflowed if it no longer fits', function(done) {
      var fx = fixture('AppNavFixtureForMeasurements');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '610px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        expect(appNavEl.visibleItems.length).to.equal(5);
        expect(appNavEl.overflowedItems.length).to.equal(1);
        expect(appNavEl.someOverflowed).to.equal(true);
        expect(appNavEl.anyOverflowed).to.equal(true);
        done();
      }, 500);
    });

    it('marks two of its items as overflowed if it they longer fit', function(done) {
      var fx = fixture('AppNavFixtureForMeasurements');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '600px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        expect(appNavEl.visibleItems.length).to.equal(4);
        expect(appNavEl.overflowedItems.length).to.equal(2);
        expect(appNavEl.someOverflowed).to.equal(true);
        expect(appNavEl.anyOverflowed).to.equal(true);
        done();
      }, 500);
    });

    it('marks all of its items as overflowed and collapses fully when only one item fits', function(done) {
      var fx = fixture('AppNavFixtureForMeasurements');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '180px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        expect(appNavEl.visibleItems.length).to.equal(0);
        expect(appNavEl.overflowedItems.length).to.equal(6);
        expect(appNavEl.allCollapsed).to.equal(true);
        done();
      }, 500);
    });

    it('measures items correctly their icon is sized with the CSS style variable --px-app-nav-item-icon-size', function() {
      var fx = fixture('AppNavFixtureIconSizeVariable');
      var appNavEl = fx.querySelector('px-app-nav');
      var item = { label: 'Home', path: 'home', icon: 'px-fea:home' };
      var measurement = appNavEl._measureItem(item);
      expect(measurement).to.be.closeTo(120, 2);
    });

    it('measures items correctly when their padding is sized with the CSS style variable --px-app-nav-item-padding', function() {
      var fx = fixture('AppNavFixtureItemPaddingVariable');
      var appNavEl = fx.querySelector('px-app-nav');
      var item = { label: 'Home', path: 'home', icon: 'px-fea:home' };
      var measurement = appNavEl._measureItem(item);
      expect(measurement).to.be.closeTo(193, 2);
    });

    it('shows an overflow group when any of its items no longer fit', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '300px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        var overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        expect(overflowGroupEl).to.be.instanceof(HTMLElement);
        done();
      }, 500);
    });

    it('hides overflowed items from the main navigation and shows them in the overflowed dropdown', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '300px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        // Tests that the items actually end up in the DOM
        var itemEls = Polymer.dom(appNavEl.root).querySelectorAll('#items > px-app-nav-item');
        var groupEls = Polymer.dom(appNavEl.root).querySelectorAll('#items > px-app-nav-group');
        var overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var subgroupEls = Polymer.dom(overflowGroupEl).querySelectorAll('px-app-nav-subgroup');
        expect(itemEls.length).to.equal(2);
        expect(groupEls.length).to.equal(1);
        expect(subgroupEls.length).to.equal(1);
        done();
      }, 500);
    });

    it('opens the overflow dropdown when the overflow icon is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var overflowGroupEl;
      var overflowIconEl;

      setTimeout(function() {
        fx.style.width = '300px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        overflowIconEl = Polymer.dom(overflowGroupEl.root).querySelector('px-app-nav-item');
        overflowIconEl.click();
      }, 250);
      setTimeout(function() {
        expect(overflowGroupEl.opened).to.equal(true);
        done();
      }, 500);
    });

    it('closes the open overflow dropdown when something else is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var overflowGroupEl;
      var overflowIconEl;

      setTimeout(function() {
        fx.style.width = '300px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        overflowIconEl = Polymer.dom(overflowGroupEl.root).querySelector('px-app-nav-item');
        overflowIconEl.click();
      }, 250);
      setTimeout(function() {
        appNavEl.click();
      }, 450);
      setTimeout(function() {
        expect(overflowGroupEl.opened).to.equal(false);
        done();
      }, 750);
    });

    it('opens a subgroup in the overflow dropdown when the subgroup is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var overflowGroupEl;
      var overflowIconEl;
      var subgroupEl;
      var subgroupItemEl;

      setTimeout(function() {
        fx.style.width = '300px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        overflowIconEl = Polymer.dom(overflowGroupEl.root).querySelector('px-app-nav-item');
        overflowIconEl.click();
      }, 250);
      setTimeout(function() {
        subgroupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-subgroup');
        subgroupItemEl = Polymer.dom(subgroupEl.root).querySelector('px-app-nav-item');
        subgroupItemEl.click();
      }, 450);
      setTimeout(function() {
        expect(subgroupEl.opened).to.equal(true);
        done();
      }, 650);
    });

    it('keeps an opened subgroup open when the overflow dropdown is closed', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var overflowGroupEl;
      var overflowIconEl;
      var subgroupEl;
      var subgroupItemEl;

      setTimeout(function() {
        fx.style.width = '300px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        overflowIconEl = Polymer.dom(overflowGroupEl.root).querySelector('px-app-nav-item');
        overflowIconEl.click();
      }, 350);
      setTimeout(function() {
        subgroupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-subgroup');
        subgroupItemEl = Polymer.dom(subgroupEl.root).querySelector('px-app-nav-item');
        subgroupItemEl.click();
      }, 550);
      setTimeout(function() {
        appNavEl.click();
      }, 750);
      setTimeout(function() {
        overflowIconEl.click();
        expect(subgroupEl.opened).to.equal(true);
        done();
      }, 950);
    });

    it('closes the overflow dropdown and selects the overflow icon, subgroup, and subitem when an overflowed subitem is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var overflowGroupEl;
      var overflowIconEl;
      var subgroupEl;
      var subgroupItemEl;
      var subitemEl;

      setTimeout(function() {
        fx.style.width = '300px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        overflowIconEl = Polymer.dom(overflowGroupEl.root).querySelector('px-app-nav-item');
        overflowIconEl.click();
      }, 350);
      setTimeout(function() {
        subgroupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-subgroup');
        subgroupItemEl = Polymer.dom(subgroupEl.root).querySelector('px-app-nav-item');
        subgroupItemEl.click();
      }, 550);
      setTimeout(function() {
        subitemEl = Polymer.dom(subgroupEl).querySelector('px-app-nav-subitem');
        subitemEl.click();
      }, 750);
      setTimeout(function() {
        expect(overflowGroupEl.opened).to.equal(false);
        expect(subitemEl.selected).to.equal(true);
        expect(overflowGroupEl.selected).to.equal(true);
        expect(subgroupEl.selected).to.equal(true);
        done();
      }, 950);
    });
  });

  describe('px-app-nav [collapsed]', function() {
    var sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('collapses when `collapseAll` attribute is true', function(done) {
      var fx = fixture('AppNavFixtureCollapsed');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        expect(appNavEl.allCollapsed).to.equal(true);
        done();
      }, 100);
    });

    it('sizes the collapsed dropdown from the `--px-app-nav-collapsed-width` style variable', function(done) {
      var fx = fixture('AppNavFixtureCollapsed');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        appNavEl.collapseOpened = true;
      }, 50);
      setTimeout(function() {
        var collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var dropdownEl = Polymer.dom(collapsedGroupEl.root).querySelector('#groupcontent');
        var width = dropdownEl.getBoundingClientRect().width;
        expect(width).to.equal(275);
        done();
      }, 400);
    });

    it('collapses when its container is smaller than the `collapseAt` size', function(done) {
      var fx = fixture('AppNavFixtureCollapseAtWidth');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        expect(appNavEl.allCollapsed).to.equal(true);
        done();
      }, 100);
    });

    it('shows an empty outline in the collapsed button when collapsed with no item selected', function(done) {
      var fx = fixture('AppNavFixtureCollapsed');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var collapsedGroupItemEl = Polymer.dom(collapsedGroupEl.root).querySelector('px-app-nav-item');
        expect(collapsedGroupEl.emptyIcon).to.equal(true);
        expect(collapsedGroupEl.emptyLabel).to.equal(true);
        expect(collapsedGroupItemEl.emptyIcon).to.equal(true);
        expect(collapsedGroupItemEl.emptyLabel).to.equal(true);
        done();
      }, 50);
    });

    it('shows the selected item in the collapsed button when an item is selected', function(done) {
      var fx = fixture('AppNavFixtureCollapsedSelected');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var collapsedGroupItemEl = Polymer.dom(collapsedGroupEl.root).querySelector('px-app-nav-item');
        expect(collapsedGroupItemEl.label).to.equal('Home');
        expect(collapsedGroupItemEl.icon).to.equal('px-fea:home');
        done();
      }, 50);
    });

    it('shows the open icon when the `collapseWithIcon` attribute is true and an item is selected', function(done) {
      var fx = fixture('AppNavFixtureCollapsedWithIconSelected');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var collapsedGroupItemEl = Polymer.dom(collapsedGroupEl.root).querySelector('px-app-nav-item');
        expect(collapsedGroupItemEl.label).to.be.null;
        expect(collapsedGroupItemEl.icon).to.equal('px-nav:hamburger');
        done();
      }, 50);
    });

    it('shows the close icon when the `collapseWithIcon` attribute is true, the dropdown is open, and an item is selected', function(done) {
      var fx = fixture('AppNavFixtureCollapsedWithIconSelected');
      var appNavEl = fx.querySelector('px-app-nav');
      var collapsedGroupEl;
      var collapsedGroupItemEl;

      setTimeout(function() {
        collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        collapsedGroupItemEl = Polymer.dom(collapsedGroupEl.root).querySelector('px-app-nav-item');
        collapsedGroupItemEl.click();
      }, 50);
      setTimeout(function() {
        expect(collapsedGroupItemEl.label).to.be.null;
        expect(collapsedGroupItemEl.icon).to.equal('px-nav:close');
        done();
      }, 250);
    });

    it('updates the `collapseOpened` property when the dropdown is open', function(done) {
      var fx = fixture('AppNavFixtureCollapsedWithIconSelected');
      var appNavEl = fx.querySelector('px-app-nav');
      var collapsedGroupEl;
      var collapsedGroupItemEl;

      setTimeout(function() {
        collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        collapsedGroupItemEl = Polymer.dom(collapsedGroupEl.root).querySelector('px-app-nav-item');
        expect(appNavEl.collapseOpened).to.equal(false);
        collapsedGroupItemEl.click();
      }, 50);
      setTimeout(function() {
        expect(appNavEl.collapseOpened).to.equal(true);
        collapsedGroupItemEl.click();
      }, 250);
      setTimeout(function() {
        expect(appNavEl.collapseOpened).to.equal(false);
        done();
      }, 450);
    });

    it('opens and closes the dropdown when the `collapseOpened` attribute is changed', function(done) {
      var fx = fixture('AppNavFixtureCollapsedWithIconSelected');
      var appNavEl = fx.querySelector('px-app-nav');
      var collapsedGroupEl;
      var dropdownEl;

      setTimeout(function() {
        collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        dropdownEl = Polymer.dom(collapsedGroupEl.root).querySelector('#groupcontent');
        appNavEl.collapseOpened = true;
      }, 50);
      setTimeout(function() {
        expect(dropdownEl.offsetLeft).to.be.greaterThan(0);
        appNavEl.collapseOpened = false;
      }, 350);
      setTimeout(function() {
        expect(dropdownEl.offsetLeft).to.equal(0);
        done();
      }, 650);
    });
  });

  describe('px-app-nav-measure-text behavior', function() {
    var sandbox;
    var fx;
    var stubEl;

    before(function() {
      Polymer({
        is: 'px-app-nav-measure-text-stub',
        behaviors: [PxAppNavBehavior.MeasureText]
      });
    });

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      fx = fixture('AppNavMeasureTextStub');
      stubEl = fx.querySelector('px-app-nav-measure-text-stub');
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('creates a 2d canvas interace', function() {
      const canvasInterface = stubEl._get2dMeasureCanvas('Arial', '23px');
      expect(canvasInterface).to.be.instanceof(CanvasRenderingContext2D);
    });

    it('configures the 2d canvas interface with the requested font-family and font-size', function() {
      const canvasInterface = stubEl._get2dMeasureCanvas('Arial', '23px');
      expect(canvasInterface.font).to.equal('23px Arial');
    });

    it('correctly measures a bit of text', function() {
      const text = 'The quick brown fox jumps over the lazy programmer';
      const textRenderedSize = fx.querySelector('p').getBoundingClientRect().width;
      const textMeasuredSize = stubEl._measureText(text, 'Arial', '23px');
      expect(textMeasuredSize).to.be.closeTo(textRenderedSize, 2);
    });
  });
}
