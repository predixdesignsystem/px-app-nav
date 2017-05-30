document.addEventListener("WebComponentsReady", function() {
  runCustomTests();
});

function runCustomTests() {

  describe('px-app-nav-item', function() {
    var sandbox;

    beforeEach(function() {
      sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('fills its parent', function() {
      var fx = fixture('AppNavSubitem');
      var itemEl = fx.querySelector('px-app-nav-subitem');

      var width = itemEl.getBoundingClientRect().width;
      expect(width).to.equal(300);
    });

    it('uses the `--px-app-nav-subitem-height` CSS variable to set its height if defined', function() {
      var fx = fixture('AppNavSubitemCustomHeight');
      var itemEl = fx.querySelector('px-app-nav-subitem');

      var height = itemEl.getBoundingClientRect().height;
      expect(height).to.equal(73);
    });

    it('defines its own height by default', function() {
      var fx = fixture('AppNavSubitem');
      var itemEl = fx.querySelector('px-app-nav-subitem');

      var height = itemEl.getBoundingClientRect().height;
      expect(height).to.equal(30);
    });

    it('uses the `label` attribute to set its label text', function(done) {
      var fx = fixture('AppNavSubitem');
      var itemEl = fx.querySelector('px-app-nav-subitem');

      flush(function() {
        var itemLabelNode = Polymer.dom(itemEl.root).querySelector('p.app-nav-subitem__label');
        expect(itemLabelNode.innerText).to.equal('Dashboard #1');
        done();
      });
    });

    it('reflects its attribute and updates styles when the `overflowed` attribute is set', function(done) {
      var fx = fixture('AppNavSubitem');
      var itemEl = fx.querySelector('px-app-nav-subitem');
      var updateSpy = sandbox.spy(itemEl, 'updateStyles');
      itemEl.parentSelected = true;

      flush(function() {
        expect(itemEl.hasAttribute('parent-selected')).to.be.true;
        expect(updateSpy).to.be.calledOnce;
        done();
      });
    });

    it('fires a custom selection event when it is tapped', function(done) {
      var fx = fixture('AppNavSubitem');
      var itemEl = fx.querySelector('px-app-nav-subitem');
      var evtSpy = sinon.spy();
      itemEl.addEventListener('px-app-nav-item-tapped', evtSpy);

      setTimeout(function() {
        itemEl.click();
      }, 50);
      setTimeout(function() {
        expect(evtSpy).to.have.been.calledOnce;
        var evtArg = evtSpy.getCall(0).args[0];
        expect(evtArg.detail).to.be.instanceof(Object);
        expect(evtArg.detail).to.deep.equal({ path: ['dash1'] });
        done();
      }, 60);
    });
  });
}
