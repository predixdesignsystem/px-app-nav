function ensureNodeListIsArray(list) {
  return Array.isArray(list) ? list : Array.prototype.slice.call(list, 0);
};

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
    let fx = fixture('AppNavFixtureSelectedRoute');

    flush(() => {
      let appNavEl = fx.querySelector('px-app-nav');
      let itemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item'));
      let routeItemEl = itemEls.filter(el => el.item.id === 'alerts')[0];

      async.until(
        () => {
          return (!!routeItemEl);
        },
        (cb) => {
          itemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item'));
          routeItemEl = itemEls.filter(el => el.item.id === 'alerts')[0];
          setTimeout(cb, 1000);
        },
        () => {
          expect(routeItemEl.selected).to.equal(true);
          done();
        }
      );

    });
  });

  it('marks a <px-app-nav-group> and <px-app-nav-subitem> as selected when their route is selected', function(done) {
    var fx = fixture('AppNavFixtureSelectedRouteNested');

    flush(() => {
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');
        var subitemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-subitem'));
        var subitemEl = subitemEls.filter(el => el.item.id === 'orders')[0];
        expect(groupEl.selected).to.equal(true);
        expect(subitemEl.selected).to.equal(true);
        done();
      }, 50);
    });
  });
});

describe('px-app-nav [horizontal]', function() {
  describe('', () => {
    let fx;

    beforeEach((done) => {
      fx = fixture('AppNavFixtureHorizontal');
      flush(done);
    });

    it('fills its container', function(done) {
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
      let appNavEl = fx.querySelector('px-app-nav');
      let itemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item'));
      let groupEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-group'));
      let subitemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-subitem'));

      async.until(
        () => (itemEls.length === 2),
        (cb) => {
          itemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item'));
          groupEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-group'));
          itemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item'));
          subitemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-subitem'));
          setTimeout(cb,1000)
        },
        () => {
          expect(itemEls.length).to.equal(2);
          expect(groupEls.length).to.equal(1);
          expect(subitemEls.length).to.equal(3);
          done();
        }
      )
    });

    it('selects an item when the item is tapped', function(done) {
      var appNavEl = fx.querySelector('px-app-nav');
      var homeItem = appNavEl.items[0];
      var itemEls;
      var itemEl;

      setTimeout(function() {
        itemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item'));
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
      var appNavEl = fx.querySelector('px-app-nav');
      var alertsItem = appNavEl.items[1];
      var itemEls;
      var firstSelectedEl;
      var secondSelectedEl;

      itemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item'));
      firstSelectedEl = itemEls.filter(el => el.item.id === 'home')[0];

      async.until(
        () => {
          return (!!firstSelectedEl);
        },
        (cb) => {
          itemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('px-app-nav-item'));
          firstSelectedEl = itemEls.filter(el => el.item.id === 'home')[0];
          setTimeout(cb, 1000);
        },
        () => {
          firstSelectedEl.click();

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
        }
      );
    });

    it('opens a dropdown when a group is tapped', function(done) {
      let appNavEl = fx.querySelector('px-app-nav');
      let groupEl;
      let groupItemEl;


      groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');

      async.until(
        () => (!!groupEl),
        (cb) => {
          groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');
          setTimeout(cb, 1000)
        },
        () => {
          groupItemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
          groupItemEl.click();
          flush(()=>{
            expect(groupEl.opened).to.equal(true);
            done();
          })
        }
      )
    });

    it('closes an open dropdown when something else is tapped', function(done) {
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
      let appNavEl = fx.querySelector('px-app-nav');
      let groupItem = appNavEl.items[2];
      let groupSubitem = groupItem.children[0];
      let groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');
      let groupItemEl;
      let subitemEls;
      let subitemEl;

      async.until(
        () => (!!groupEl),
        (cb) => {
          groupEl = Polymer.dom(appNavEl.root).querySelector('px-app-nav-group');
          setTimeout(cb, 1000);
        },
        () =>{
          groupItemEl = Polymer.dom(groupEl.root).querySelector('px-app-nav-item');
          subitemEls = ensureNodeListIsArray(Polymer.dom(groupEl).querySelectorAll('px-app-nav-subitem'));
          subitemEl = subitemEls.filter(el => el.item.id === 'trucks')[0];
          groupItemEl.click();
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
        }
      );
    });
  });

  describe('[measuring]', () => {
    let fx;

    beforeEach((done) => {
      fx = fixture('AppNavFixtureForMeasurements');
      flush(done);
    });

    it('marks all of its items as visible if they all fit', function(done) {
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
      let appNavEl = fx.querySelector('px-app-nav');

      fx.style.width = '180px';
      appNavEl.notifyResize();
      flush(()=>{
        async.until(
          ()=> (!!appNavEl.overflowedItems),
          (cb)=> setTimeout(cb, 1000),
          ()=>{
            async.until(
              ()=> (appNavEl.overflowedItems.length === 6),
              (cb)=>setTimeout(cb, 1000),
              ()=>{
                expect(appNavEl.visibleItems.length).to.equal(0);
                expect(appNavEl.overflowedItems.length).to.equal(6);
                expect(appNavEl.allCollapsed).to.equal(true);
                done();
              }
            );
          }
        );
      });
    });

  it('does not mark all of its items as overflowed if there is only one top-level item', function(done) {
    var fx = fixture('AppNavFixtureOneItem');

    flush(() => {
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '180px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        expect(appNavEl.visibleItems.length).to.equal(1);
        expect(appNavEl.overflowedItems.length).to.equal(0);
        expect(appNavEl.allCollapsed).to.equal(false);
        done();
      }, 500);
    });
  });

  it('measures items correctly their icon is sized with the CSS style variable --px-app-nav-item-icon-size', function(done) {
    var fx = fixture('AppNavFixtureIconSizeVariable');

    flush(() => {
      var appNavEl = fx.querySelector('px-app-nav');
      var item = { label: 'Home', path: 'home', icon: 'px-fea:home' };
      var measurement = appNavEl._measureItem(item);

      async.until(
        ()=> (measurement >= 118 && measurement <= 120),
        (cb)=>{
          measurement = appNavEl._measureItem(item);
          setTimeout(cb, 1000)
        },
        ()=>{
          expect(measurement).to.be.closeTo(120, 2);
          done();
        }
      );
    });
  });

  it('measures items correctly when their padding is sized with the CSS style variable --px-app-nav-item-padding', function(done) {
    var fx = fixture('AppNavFixtureItemPaddingVariable');

    flush(() => {
      var appNavEl = fx.querySelector('px-app-nav');
      var item = { label: 'Home', path: 'home', icon: 'px-fea:home' };
      var measurement = appNavEl._measureItem(item);
      expect(measurement).to.be.closeTo(193, 2);
      done();
    });
  });

  it('shows an overflow group when any of its items no longer fit', function(done) {
    var fx = fixture('AppNavFixtureHorizontal');

    flush(() => {
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
  });
});

  describe('[dropdown actions]', () => {
    let fx;

    beforeEach((done) => {
      fx = fixture('AppNavFixtureHorizontal');
      flush(done);
    });

    it('hides overflowed items from the main navigation and shows them in the overflowed dropdown', function(done) {
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        fx.style.width = '300px';
        appNavEl.notifyResize();
      }, 50);
      setTimeout(function() {
        // Tests that the items actually end up in the DOM
        var itemEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('#items > px-app-nav-item'));
        var groupEls = ensureNodeListIsArray(Polymer.dom(appNavEl.root).querySelectorAll('#items > px-app-nav-group'));
        var overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var subgroupEls = ensureNodeListIsArray(Polymer.dom(overflowGroupEl).querySelectorAll('px-app-nav-subgroup'));
        expect(itemEls.length).to.equal(2);
        expect(groupEls.length).to.equal(1);
        expect(subgroupEls.length).to.equal(1);
        done();
      }, 500);
    });

    it('opens the overflow dropdown when the overflow icon is tapped', function(done) {
      let appNavEl = fx.querySelector('px-app-nav');
      let overflowGroupEl;
      let overflowIconEl;

      fx.style.width = '300px';
      appNavEl.notifyResize();
      overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');

      async.until(
        () => (!!overflowGroupEl),
        (cb)=> {
          overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
          setTimeout(cb, 1000)
        },
        ()=>{
          overflowIconEl = Polymer.dom(overflowGroupEl.root).querySelector('px-app-nav-item');
          overflowIconEl.click();

          async.until(
            ()=> (overflowGroupEl.opened),
            (cb)=>setTimeout(cb, 1000),
            ()=>{
              expect(overflowGroupEl.opened).to.equal(true);
              done();
            }
          );
        }
      );
    });

    it('closes the open overflow dropdown when something else is tapped', function(done) {
      let appNavEl = fx.querySelector('px-app-nav');
      let overflowGroupEl;
      let overflowIconEl;

      fx.style.width = '300px';
      appNavEl.notifyResize();

      overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');

      async.until(
        () => (!!overflowGroupEl),
        (cb)=> {
          overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
          setTimeout(cb, 1000)
        },
        ()=>{
          overflowIconEl = Polymer.dom(overflowGroupEl.root).querySelector('px-app-nav-item');
          overflowIconEl.click();
          flush(()=>{
            async.whilst(
              () => overflowGroupEl.opened,
              (cb)=> {
                appNavEl.click();
                setTimeout(cb, 1000)
              },
              ()=>{
                expect(overflowGroupEl.opened).to.equal(false);
                done();
              }
            );
          });
        }
      );
    });

    it('opens a subgroup in the overflow dropdown when the subgroup is tapped', function(done) {
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
      var appNavEl = fx.querySelector('px-app-nav');
      var overflowGroupEl;
      var overflowIconEl;
      var subgroupEl;
      var subgroupItemEl;
      var subitemEl;

      fx.style.width = '300px';
      appNavEl.notifyResize();
      flush(()=>{
        overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');

        async.until(
          () => (!!overflowGroupEl),
          (cb) => {
            overflowGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
            setTimeout(cb, 1000);
          },
          () => {
            overflowIconEl = Polymer.dom(overflowGroupEl.root).querySelector('px-app-nav-item');
            overflowIconEl.click();
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
          }
        )

      });
    });
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

    flush(() => {
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        expect(appNavEl.allCollapsed).to.equal(true);
        done();
      }, 100);
    });
  });

  it('sizes the collapsed dropdown from the `--px-app-nav-collapsed-width` style variable', function(done) {
    var fx = fixture('AppNavFixtureCollapsed');

    flush(() => {
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
  });

  it('collapses when its container is smaller than the `collapseAt` size', function(done) {
    var fx = fixture('AppNavFixtureCollapseAtWidth');

    flush(() => {
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        expect(appNavEl.allCollapsed).to.equal(true);
        done();
      }, 100);
    });
  });

  it('shows an empty outline in the collapsed button when collapsed with no item selected', function(done) {
    var fx = fixture('AppNavFixtureCollapsed');

    flush(() => {
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
  });

  it('shows the selected item in the collapsed button when an item is selected', function(done) {
    var fx = fixture('AppNavFixtureCollapsedSelected');

    flush(() => {
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var collapsedGroupItemEl = Polymer.dom(collapsedGroupEl.root).querySelector('px-app-nav-item');
        expect(collapsedGroupItemEl.label).to.equal('Home');
        expect(collapsedGroupItemEl.icon).to.equal('px-fea:home');
        done();
      }, 50);
    });
  });

  it('shows the open icon when the `collapseWithIcon` attribute is true and an item is selected', function(done) {
    var fx = fixture('AppNavFixtureCollapsedWithIconSelected');

    flush(() => {
      var appNavEl = fx.querySelector('px-app-nav');

      setTimeout(function() {
        var collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
        var collapsedGroupItemEl = Polymer.dom(collapsedGroupEl.root).querySelector('px-app-nav-item');
        expect(collapsedGroupItemEl.label).to.be.null;
        expect(collapsedGroupItemEl.icon).to.equal('px-nav:hamburger');
        done();
      }, 50);
    });
  });

  it('shows the close icon when the `collapseWithIcon` attribute is true, the dropdown is open, and an item is selected', function(done) {
    var fx = fixture('AppNavFixtureCollapsedWithIconSelected');

    flush(() => {
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
  });

  it('updates the `collapseOpened` property when the dropdown is open', function(done) {
    var fx = fixture('AppNavFixtureCollapsedWithIconSelected');

    flush(() => {
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
      }, 480);
    });
  });

  it('opens and closes the dropdown when the `collapseOpened` attribute is changed', function(done) {
    var fx = fixture('AppNavFixtureCollapsedWithIconSelected');

    flush(() => {
      var appNavEl = fx.querySelector('px-app-nav');
      var collapsedGroupEl;
      var dropdownEl;

      collapsedGroupEl = Polymer.dom(appNavEl.root).querySelector('#overflowedGroup');
      dropdownEl = Polymer.dom(collapsedGroupEl.root).querySelector('#groupcontent');
      appNavEl.collapseOpened = true;

      async.until(
        ()=> (dropdownEl.offsetLeft > 0),
        (cb)=>setTimeout(cb, 1000),
        ()=>{
          expect(dropdownEl.offsetLeft).to.be.greaterThan(0);
          appNavEl.collapseOpened = false;
          async.until(
            ()=> (dropdownEl.offsetLeft === 0),
            (cb)=>setTimeout(cb, 1000),
            ()=>{
              expect(dropdownEl.offsetLeft).to.equal(0);
              done();
            }
          );
        }
      );
    });
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

  beforeEach(function(done) {
    sandbox = sinon.sandbox.create();
    fx = fixture('AppNavMeasureTextStub');
    flush(() => {
      stubEl = fx.querySelector('px-app-nav-measure-text-stub');
      done();
    });
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
