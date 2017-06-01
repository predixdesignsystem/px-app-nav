document.addEventListener("WebComponentsReady", function() {
  runCustomTests();
});

function runCustomTests() {

  describe('px-app-nav-group', function() {
    var sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('fills its parent', function() {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');

      var width = groupEl.getBoundingClientRect().width;
      expect(width).to.equal(300);
    });

    it('selects its item if it is selected', function(done) {
      var fx = fixture('AppNavGroupSelected');
      var groupEl = fx.querySelector('px-app-nav-group');

      flush(function() {
        var itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        expect(itemEl.selected).to.be.true;
        done();
      });
    });

    it('does not select its item if the `noHighlight` attribute is set to true', function(done) {
      var fx = fixture('AppNavGroupSelectedNoHighlight');
      var groupEl = fx.querySelector('px-app-nav-group');

      flush(function() {
        var itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        expect(itemEl.selected).to.be.false;
        done();
      });
    });

    it('uses the `label` attribute to set its item\'s label text', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');

      flush(function() {
        var itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        expect(itemEl.label).to.equal('Alerts');
        done();
      });
    });

    it('uses the `icon` attribute to set its item\'s icon', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');

      flush(function() {
        var itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        expect(itemEl.icon).to.equal('px:alert');
        done();
      });
    });

    it('hides its dropdown icon if the `hideDropdownIcon` attribute is set to true', function(done) {
      var fx = fixture('AppNavGroupHideDropdownIcon');
      var groupEl = fx.querySelector('px-app-nav-group');

      flush(function() {
        var itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        expect(itemEl.dropdown).to.be.false;
        done();
      });
    });

    it('sets its icon to the empty state if the `empty` attribute is set to true', function(done) {
      var fx = fixture('AppNavGroupEmpty');
      var groupEl = fx.querySelector('px-app-nav-group');

      flush(function() {
        var itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        expect(itemEl.empty).to.be.true;
        done();
      });
    });

    it('sets its dropdown content width to a static value from `fixedWidth`', function(done) {
      var fx = fixture('AppNavGroupFixedWidth');
      var groupEl = fx.querySelector('px-app-nav-group');

      setTimeout(function() {
        var itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        var contentEl = Polymer.dom(groupEl.root).querySelector('#groupcontent');
        var width = contentEl.getBoundingClientRect().width;
        expect(width).to.equal(227);
        done();
      }, 100);
    });

    it('dynamically sets its dropdown content width to be at least as wide as the group', function(done) {
      var fx = fixture('AppNavGroupDynamicWidthMin');
      var groupEl = fx.querySelector('px-app-nav-group');
      groupEl.style.width = '216px';

      setTimeout(function() {
        var itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        var contentEl = Polymer.dom(groupEl.root).querySelector('#groupcontent');
        var width = contentEl.getBoundingClientRect().width;
        expect(width).to.be.closeTo(216, 2);
        done();
      }, 100);
    });

    it('dynamically sets its dropdown content width grow to fit its largest item if it fits in the window', function(done) {
      var fx = fixture('AppNavGroupDynamicWidthGrow');
      var groupEl = fx.querySelector('px-app-nav-group');
      groupEl.style.width = '200px';

      setTimeout(function() {
        var itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        debugger;
        var subitemEl = Polymer.dom(groupEl).querySelectorAll('px-app-nav-subitem')[0];
        var subitemWidth = subitemEl.getBoundingClientRect().width;
        var contentEl = Polymer.dom(groupEl.root).querySelector('#groupcontent');
        var contentWidth = contentEl.getBoundingClientRect().width;
        expect(contentWidth).to.be.closeTo(subitemWidth, 2);
        done();
      }, 80);
    });

    it('opens its dropdown when the `opened` attribute is set to true', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      groupEl.opened = true;

      setTimeout(function() {
        var dropdownEl = Polymer.dom(groupEl.root).querySelector('iron-dropdown');
        expect(dropdownEl.opened).to.be.true;
        done();
      }, 50);
    });

    it('closes its dropdown when the `opened` attribute is set to false', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      groupEl.opened = true;

      setTimeout(function() {
        groupEl.opened = false;
      }, 50);
      setTimeout(function() {
        var dropdownEl = Polymer.dom(groupEl.root).querySelector('iron-dropdown');
        expect(dropdownEl.opened).to.be.false;
        done();
      }, 60);
    });

    it('opens its dropdown when its item is tapped', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      var dropdownEl;
      var itemEl;

      setTimeout(function() {
        dropdownEl = Polymer.dom(groupEl.root).querySelector('iron-dropdown');
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        expect(dropdownEl.opened).to.be.true;
        done();
      }, 60);
    });

    it('closes its dropdown when its item is tapped', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      var dropdownEl;
      var itemEl;

      setTimeout(function() {
        dropdownEl = Polymer.dom(groupEl.root).querySelector('iron-dropdown');
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        itemEl.click();
      }, 60);
      setTimeout(function() {
        expect(dropdownEl.opened).to.be.false;
        done();
      }, 70);
    });

    it('closes its dropdown when something else is tapped', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      var dropdownEl;
      var itemEl;

      setTimeout(function() {
        dropdownEl = Polymer.dom(groupEl.root).querySelector('iron-dropdown');
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        fx.click();
      }, 70);
      setTimeout(function() {
        expect(dropdownEl.opened).to.be.false;
        done();
      }, 90);
    });

    it('closes its dropdown when a subitem is selected', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      var dropdownEl;
      var itemEl;
      var subitemEl;

      setTimeout(function() {
        dropdownEl = Polymer.dom(groupEl.root).querySelector('iron-dropdown');
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        subitemEl = Polymer.dom(groupEl).querySelectorAll('px-app-nav-subitem')[0];
        itemEl.click();
      }, 50);
      setTimeout(function() {
        subitemEl.click();
      }, 60);
      setTimeout(function() {
        expect(dropdownEl.opened).to.be.false;
        done();
      }, 70);
    });

    it('closes its dropdown when its dropdown container (not the dropdown content) is tapped', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      var dropdownEl;
      var itemEl;
      var containerEl;

      setTimeout(function() {
        dropdownEl = Polymer.dom(groupEl.root).querySelector('iron-dropdown');
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        containerEl = Polymer.dom(groupEl.root).querySelector('#groupcontainer');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        containerEl.click();
      }, 60);
      setTimeout(function() {
        expect(dropdownEl.opened).to.be.false;
        done();
      }, 70);
    });

    it('updates its `opened` property when the dropdown is opened by tap', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      var itemEl;

      setTimeout(function() {
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        expect(groupEl.opened).to.be.true;
        done();
      }, 60);
    });

    it('updates its `opened` property when the dropdown is closed by tap', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      var itemEl;

      setTimeout(function() {
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        itemEl.click();
      }, 60);
      setTimeout(function() {
        expect(groupEl.opened).to.be.false;
        done();
      }, 70);
    });

    it('updates its `opened` property when the dropdown is closed by tap', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      var itemEl;

      setTimeout(function() {
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        itemEl.click();
      }, 50);
      setTimeout(function() {
        itemEl.click();
      }, 60);
      setTimeout(function() {
        expect(groupEl.opened).to.be.false;
        done();
      }, 70);
    });

    it('intercepts subitem selection events and retargets them to include its own path', function(done) {
      var fx = fixture('AppNavGroup');
      var groupEl = fx.querySelector('px-app-nav-group');
      var evtSpy = sinon.spy();
      groupEl.addEventListener('px-app-nav-item-tapped', evtSpy);
      var itemEl;
      var subitemEl;

      setTimeout(function() {
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        subitemEl = Polymer.dom(groupEl).querySelectorAll('px-app-nav-subitem')[0];
        itemEl.click();
      }, 50);
      setTimeout(function() {
        subitemEl.click();
      }, 60);
      setTimeout(function() {
        expect(evtSpy).to.have.been.calledOnce;
        var evtArg = evtSpy.getCall(0).args[0];
        expect(evtArg.detail).to.be.instanceof(Object);
        expect(evtArg.detail).to.deep.equal({ group: true, path: ['alerts', 'generators'] });
        done();
      }, 60);
    });

    it('does not intercept subitem selection events if the `cancelSelect` property is true', function(done) {
      var fx = fixture('AppNavGroupCancelSelect');
      var groupEl = fx.querySelector('px-app-nav-group');
      var evtSpy = sinon.spy();
      groupEl.addEventListener('px-app-nav-item-tapped', evtSpy);
      var itemEl;
      var subitemEl;

      setTimeout(function() {
        itemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
        subitemEl = Polymer.dom(groupEl).querySelectorAll('px-app-nav-subitem')[0];
        itemEl.click();
      }, 50);
      setTimeout(function() {
        subitemEl.click();
      }, 60);
      setTimeout(function() {
        expect(evtSpy).to.have.been.calledOnce;
        var evtArg = evtSpy.getCall(0).args[0];
        expect(evtArg.detail).to.deep.equal({ path: ['generators'] });
        done();
      }, 60);
    });
  });
}
