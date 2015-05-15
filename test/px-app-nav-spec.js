'use strict';

/*
 * Copyright (c) 2013 GE Global Research. All rights reserved.
 *
 * The copyright to the computer software herein is the property of
 * GE Global Research. The software may be used and/or copied only
 * with the written permission of GE Global Research or in accordance
 * with the terms and conditions stipulated in the agreement/contract
 * under which the software has been supplied.
 */

/**
 * @class UI test spec.
 *
 * @author Jeff Reichenberg
 *
 * TODO: make a selenium "PageObject" out of the component to provide an interface to expected behavior
 */

var webdriver = require('webdriver-support/node_modules/selenium-webdriver'),
    chai = require('chai'),
    webdriverFactory = require('webdriver-support');

var driver, driverSession;

chai.use(require('chai-as-promised'));

before(function() {
    driverSession = webdriverFactory.create();
    driver = driverSession.setup({spec: __filename});
});

after(function(done) {
    driverSession.teardown(done);
});

afterEach(function (done) {
    driverSession.logState(this.currentTest, done);
});

describe('Instancing component from provided DOM data attribute', function () {

    before(function() {
        driver.get('fixture.html?dom=shady');
        return driver.wait(webdriver.until.elementLocated(webdriver.By.css("px-app-nav li")), 3000);
    });

    it('should instance a px-app-nav from the expected DOM', function () {
        return chai.expect(
            driver.findElement(webdriver.By.css("px-app-nav"))
        ).to.eventually.exist;
    });

    it('should have default nav items and subitems', function () {
        return chai.expect(
            driver.findElements(webdriver.By.css("px-app-nav li"))
        ).to.eventually.have.length(4);
    });

    it('should hide subitems by default', function () {
        return chai.expect(
            driver.findElement(webdriver.By.css("px-app-nav ul > li > ul")).getAttribute("class")
        ).to.eventually.contain("visuallyhidden");
    });
});


describe('Interaction', function () {

    it('should be expanded by default', function () {
        return chai.expect(
            driver.findElement(webdriver.By.css("px-app-nav")).getSize()
        ).to.eventually.have.property('width', 219);
    });

    it('should collapse when the toggle is clicked from an expanded state', function () {
        driver.findElement(webdriver.By.css("px-app-nav button")).click();
        driver.wait(webdriver.until.elementLocated(webdriver.By.css("px-app-nav.navbar--collapsed")), 2000);
        return chai.expect(
            driver.findElement(webdriver.By.css("px-app-nav")).getSize()
        ).to.eventually.have.property('width', 55);
    });

    it('should hide the text labels when collapsed', function () {
        return chai.expect(
            driver.findElement(webdriver.By.css("px-app-nav li a span")).getSize()
        ).to.eventually.have.property('width', 1);
    });

    it('should expand when the toggle is clicked from a collapsed state', function () {
        driver.findElement(webdriver.By.css("px-app-nav button")).click();
        driver.wait(webdriver.until.elementLocated(webdriver.By.css("px-app-nav:not(.navbar--text-hidden)")), 2000);
        return chai.expect(
            driver.findElement(webdriver.By.css("px-app-nav")).getSize()
        ).to.eventually.have.property('width', 219);
    });

    it('should show subitems when a parent item is clicked', function () {
        driver.findElement(webdriver.By.css("px-app-nav ul > li > a")).click();
        return chai.expect(
            driver.findElement(webdriver.By.css("px-app-nav ul > li > ul")).getAttribute("class")
        ).to.eventually.not.contain("visuallyhidden");
    });
});

describe('Navigation', function () {

    it('should navigate when clicking on an item', function () {
        driver.findElement(webdriver.By.css("px-app-nav a[href='#tab2']")).click();//click cases
        return chai.expect(
            driver.getCurrentUrl()
        ).to.eventually.contain("#tab2");
    });

    it('should mark the selected item as selected', function () {
        return chai.expect(
            driver.findElement(webdriver.By.css("px-app-nav a[href='#tab2'].selected"))
        ).to.eventually.exist;
    });
});

