/*global QUnit*/

sap.ui.define([
	"com/hcl/analyticalcards/controller/AppHome.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AppHome Controller");

	QUnit.test("I should test the AppHome controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});