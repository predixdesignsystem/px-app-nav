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

describe('px-app-nav-item', function() {
  var sandbox;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('fills its parent', function() {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');

    var width = itemEl.getBoundingClientRect().width;
    expect(width).to.equal(300);
  });

  /*
  it('uses the `--px-app-nav-height` CSS variable to set its height if defined', function() {
    var fx = fixture('AppNavItemCustomHeight');
    var itemEl = fx.querySelector('px-app-nav-item');

    var height = itemEl.getBoundingClientRect().height;
    expect(height).to.equal(73);
  });
  */

  it('defines its own height by default', function() {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');

    var height = itemEl.getBoundingClientRect().height;
    expect(height).to.equal(60);
  });

  it('uses the `label` attribute to set its label text', function(done) {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');

    flush(function() {
      var itemLabelNode = Polymer.dom(itemEl.root).querySelector('p.app-nav-item__label');
      expect(itemLabelNode.innerText).to.equal('Home');
      done();
    });
  });

  it('uses the `icon` attribute to set its icon', function(done) {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');

    flush(function() {
      var iconNode = Polymer.dom(itemEl.root).querySelector('px-icon');
      expect(iconNode.icon).to.equal('px-fea:home');
      done();
    });
  });

  it('uses the `icon` attribute to set its icon', function(done) {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');

    flush(function() {
      var iconNode = Polymer.dom(itemEl.root).querySelector('px-icon');
      expect(iconNode.icon).to.equal('px-fea:home');
      done();
    });
  });

  it('shows a dropdown carat icon if `dropdown` attribute is true', function(done) {
    var fx = fixture('AppNavItemDropdown');
    var itemEl = fx.querySelector('px-app-nav-item');

    flush(function() {
      var caratNode = Polymer.dom(itemEl.root).querySelector('px-icon.app-nav-item__dropdown-icon');
      expect(caratNode).to.be.instanceof(HTMLElement);
      done();
    });
  });

  it('correctly sets its classes if it has a label', function(done) {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');

    flush(function() {
      var iconNode = Polymer.dom(itemEl.root).querySelector('px-icon');
      var hasCorrectClass = iconNode
      expect(iconNode.classList.contains('app-nav-item__icon--with-label')).to.be.true;
      done();
    });
  });

  it('correctly sets its classes if it does not have a label', function(done) {
    var fx = fixture('AppNavItemIconOnly');
    var itemEl = fx.querySelector('px-app-nav-item');

    flush(function() {
      var iconNode = Polymer.dom(itemEl.root).querySelector('px-icon');
      var hasCorrectClass = iconNode
      expect(iconNode.classList.contains('app-nav-item__icon--with-label')).to.be.false;
      done();
    });
  });

  it('uses the `href` property to navigate to arbitrary URLs', function(done) {
    var fx = fixture('AppNavItemHref');
    var itemEl = fx.querySelector('px-app-nav-item');
    window.open = sinon.spy();
    itemEl.fire('tap')

    flush(function() {
      expect(window.open).to.be.calledWithExactly('https://www.predix-ui.com', '');
      done();
    });
  });

  it('uses the `windowName` property to define what browsing context navigation occurs in', function(done) {
    var fx = fixture('AppNavItemHrefWindow');
    var itemEl = fx.querySelector('px-app-nav-item');
    window.open = sinon.spy();
    itemEl.fire('tap')

    flush(function() {
      expect(window.open).to.be.calledWithExactly('https://www.predix-ui.com', 'myWindow');
      done();
    });
  });

  it('does not trigger navigation when the `href` property is set on an item dropdown', function(done) {
    // ie. ignore the `href` prop if the item has children
    var fx = fixture('AppNavItemHrefDropdown');
    var itemEl = fx.querySelector('px-app-nav-item');
    window.open = sinon.spy();
    itemEl.fire('tap')

    flush(function() {
      expect(window.open).to.not.be.called;
      done();
    });
  });

  it('reflects its attribute and updates styles when the `overflowed` attribute is set', function(done) {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');
    var updateSpy = sandbox.spy(itemEl, 'updateStyles');
    itemEl.overflowed = true;

    flush(function() {
      expect(itemEl.hasAttribute('overflowed')).to.be.true;
      expect(updateSpy).to.be.calledOnce;
      done();
    });
  });

  it('reflects its attribute and updates styles when the `collapsed` attribute is set', function(done) {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');
    var updateSpy = sandbox.spy(itemEl, 'updateStyles');
    itemEl.collapsed = true;

    flush(function() {
      expect(itemEl.hasAttribute('collapsed')).to.be.true;
      expect(updateSpy).to.be.calledOnce;
      done();
    });
  });

  it('reflects its attribute and updates styles when the `selected` attribute is set', function(done) {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');
    var updateSpy = sandbox.spy(itemEl, 'updateStyles');
    itemEl.selected = true;

    flush(function() {
      expect(itemEl.hasAttribute('selected')).to.be.true;
      expect(updateSpy).to.be.calledOnce;
      done();
    });
  });

  it('shows an empty state when the `empty` attribute is set', function(done) {
    var fx = fixture('AppNavItemEmpty');
    var itemEl = fx.querySelector('px-app-nav-item');

    flush(function() {
      var emptyIconNode = Polymer.dom(itemEl.root).querySelector('div.app-nav-item__icon--empty');
      var emptyLabelNode = Polymer.dom(itemEl.root).querySelector('div.app-nav-item__label--empty');
      expect(emptyIconNode).to.be.instanceof(HTMLElement);
      expect(emptyLabelNode).to.be.instanceof(HTMLElement);
      done();
    });
  });

  it('fires a custom selection event when it is tapped', function(done) {
    var fx = fixture('AppNavItem');
    var itemEl = fx.querySelector('px-app-nav-item');
    var evtSpy = sinon.spy();
    itemEl.addEventListener('px-app-nav-item-tapped', evtSpy);

    setTimeout(function() {
      itemEl.click();
    }, 50);
    setTimeout(function() {
      expect(evtSpy).to.have.been.calledOnce;
      var evtArg = evtSpy.getCall(0).args[0];
      expect(evtArg.detail).to.be.instanceof(Object);
      expect(evtArg.detail.item).to.equal(itemEl.item);
      done();
    }, 60);
  });

  it('does not fire a custom selection event when it is tapped if the `cancelSelect` attribute is set', function(done) {
    var fx = fixture('AppNavItemCancelSelect');
    var itemEl = fx.querySelector('px-app-nav-item');
    var evtSpy = sinon.spy();
    itemEl.addEventListener('px-app-nav-item-tapped', evtSpy);

    setTimeout(function() {
      itemEl.click();
    }, 50);
    setTimeout(function() {
      expect(evtSpy).to.have.not.been.called;
      done();
    }, 60);
  });
});
