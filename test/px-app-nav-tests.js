document.addEventListener("WebComponentsReady", function() {
  runCustomTests();
});

function runCustomTests() {
  describe('px-app-nav [horizontal]', function() {
    var sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox.restore();
    });

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
        expect(itemEls.length).to.equal(5);
        expect(groupEls.length).to.equal(1);
        done();
      }, 50);
    });

    it('selects an item when the item is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var homeItem = appNavEl.items[0];
      var itemEls;
      var itemEl;

      setTimeout(function() {
        itemEls = Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item');
        itemEl = itemEls.filter(item => item.path === 'home')[0];
        itemEl.click();
      }, 50);
      setTimeout(function() {
        expect(itemEl.selected).to.equal(true);
        expect(appNavEl.selectedPath).to.equal('home');
        expect(appNavEl.selectedItem).to.equal(homeItem);
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
      }, 500);
    });

    it('selects a subitem and its group when the subitem is tapped', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');
      var groupItem = appNavEl.items[2];
      var groupSubitem = groupItem.subitems[0];
      var groupEl;
      var groupItemEl;
      var subitemEls;
      var subitemEl;

      setTimeout(function() {
        groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');
        groupItemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        subitemEls = Polymer.dom(groupEl).querySelectorAll('px-app-nav-item');
        subitemEl = subitemEls.filter(item => item.path === 'trucks')[0];
        groupItemEl.click();
      }, 50);
      setTimeout(function() {
        subitemEl.click();
      }, 100);
      setTimeout(function() {
        expect(subitemEl.selected).to.equal(true);
        expect(appNavEl.selectedPath).to.equal('dashboards');
        expect(appNavEl.selectedItem).to.equal(groupItem);
        expect(appNavEl.selectedSubpath).to.equal('trucks');
        expect(appNavEl.selectedSubitem).to.equal(groupSubitem);
        done();
      }, 200);
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

    it('hides overflowed items from the main navigation and puts them in the overflowed dropdown', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '300px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        var itemEls = Polymer.dom(appNavEl.root).querySelectorAll('#items > px-app-nav-item');
        var groupEls = Polymer.dom(appNavEl.root).querySelectorAll('#items > px-app-nav-group');
        var overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var subgroupEls = Polymer.dom(overflowGroupEl).querySelectorAll('px-app-nav-subgroup');
        expect(itemEls.length).to.equal(2);
        expect(groupEls.length).to.equal(1);
        expect(subgroupEls.length).to.equal(1);
        done();
      }, 250);
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
      }, 650);
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
      }, 250);
      setTimeout(function() {
        subgroupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-subgroup');
        subgroupItemEl = Polymer.dom(subgroupEl.root).querySelector('px-app-nav-item');
        subgroupItemEl.click();
      }, 450);
      setTimeout(function() {
        appNavEl.click();
      }, 650);
      setTimeout(function() {
        overflowIconEl.click();
        expect(subgroupEl.opened).to.equal(true);
        done();
      }, 850);
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
      }, 250);
      setTimeout(function() {
        subgroupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-subgroup');
        subgroupItemEl = Polymer.dom(subgroupEl.root).querySelector('px-app-nav-item');
        subgroupItemEl.click();
      }, 450);
      setTimeout(function() {
        subitemEl = Polymer.dom(subgroupEl).querySelector('px-app-nav-item');
        subitemEl.click();
      }, 650);
      setTimeout(function() {
        expect(overflowGroupEl.opened).to.equal(false);
        expect(subitemEl.selected).to.equal(true);
        expect(overflowGroupEl.selected).to.equal(true);
        expect(subgroupEl.selected).to.equal(true);
        done();
      }, 700);
    });

    it('collapses fully when only one item fits', function(done) {
      var fx = fixture('AppNavFixtureHorizontal');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '180px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        expect(appNavEl.allCollapsed).to.equal(true);
        done();
      }, 500);
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
      }, 50);
    });

    it('collapses when its container is smaller than the `collapseAt` size', function(done) {
      var fx = fixture('AppNavFixtureCollapseAtWidth');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        expect(appNavEl.allCollapsed).to.equal(true);
        done();
      }, 50);
    });

    it('shows an empty outline in the collapsed button when collapsed with no item selected', function(done) {
      var fx = fixture('AppNavFixtureCollapsed');
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var collapsedGroupItemEl = Polymer.dom(collapsedGroupEl.root).querySelector('px-app-nav-item');
        expect(collapsedGroupEl.empty).to.equal(true);
        expect(collapsedGroupItemEl.empty).to.equal(true);
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
        expect(collapsedGroupItemEl.icon).to.equal('px:home');
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
        expect(collapsedGroupItemEl.icon).to.equal('px:hamburger');
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
        expect(collapsedGroupItemEl.icon).to.equal('px:close');
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
      }, 250);
      setTimeout(function() {
        expect(dropdownEl.offsetLeft).to.equal(0);
        done();
      }, 450);
    });
  });
}
