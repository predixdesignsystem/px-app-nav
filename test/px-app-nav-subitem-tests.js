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

describe('px-app-nav-subitem', function() {
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
      expect(evtArg.detail.item).to.equal(itemEl.item);
      done();
    }, 60);
  });
});
