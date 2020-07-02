sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, JSONModel) {
	"use strict";

	return Controller.extend("com.hcl.analyticalcards.controller.AppHome", {
		onInit: function () {
			var that = this;
			var cardDataModel = this.getOwnerComponent().getModel("dataModel");
			cardDataModel.attachEventOnce("requestCompleted", function(fEvent) {
				that.onModelReadComplete(fEvent, that);
			});
			
			cardDataModel.read("/ServiceRequestCollection",{
				success: function (oData) {
					that._allTicketData = oData;
				}
			});
			
			//Populate Column Card JSON Data
			var columnCardDataModel = this.getOwnerComponent().getModel("columnCardModel");
			this._columnCardData = columnCardDataModel.getJSON();
			
			//Populate initial JSON of Line Chart
			var lineChartDataJSON = {};
			var lineChartDataArray = [];
			for(var i = 1; i <= 12; i++) {
				var lineChartData = {};
				switch(i) {
					case 1:
						lineChartData.Month = "January";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
						break;
					case 2:
						lineChartData.Month = "February";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
						break;
					case 3:
					    lineChartData.Month = "March";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					case 4:
					    lineChartData.Month = "April";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					case 5:
					    lineChartData.Month = "May";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					case 6:
					    lineChartData.Month = "June";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					case 7:
					    lineChartData.Month = "July";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					case 8:
					    lineChartData.Month = "August";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					case 9:
					    lineChartData.Month = "September";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					case 10:
					    lineChartData.Month = "October";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					case 11:
					    lineChartData.Month = "November";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					case 12:
					    lineChartData.Month = "December";
						lineChartData.RequestCount20 = 0;
						lineChartData.RequestCount19 = 0;
					    break;
					default:
				    	// code block
				} 
				lineChartDataArray.push(lineChartData);
			}
			lineChartDataJSON.results = lineChartDataArray;
			this._lineChartData = lineChartDataJSON;
		},
		
		onBeforeRendering: function() {
			
		},
		
		onAfterRendering: function() {
			this.getView().byId("cardServiceRequestsDonut").setBusy(true);
			this.getView().byId("cardServiceRequestsStackedColumn").setBusy(true);
			this.getView().byId("cardServiceRequestsLine").setBusy(true);
			
			var stakedColumnCardData = JSON.parse(this._columnCardData);
			this.getView().byId("cardServiceRequestsStackedColumn").setManifest(stakedColumnCardData);
		},
		
		onModelReadComplete: function(oEvent, oController) {
			var cardDataModel = oController.getOwnerComponent().getModel("dataModel");
			
			//Read PRIORITY Types for DONUT
			cardDataModel.read("/ServiceRequestServicePriorityCodeCollection",{
				success: function (oData) {
					for(var i = 0; i < oData.results.length; i++) {
						delete oData.results[i].__metadata;
					}
					oController._priorityData = oData;
					oController.populatePriorityCountData(oController);
				},
				error: function (oError) {
					
				}
			});
			
			//Read STATUS Types for COLUMN
			cardDataModel.read("/ServiceRequestServiceRequestUserLifeCycleStatusCodeCollection",{
				success: function (oData) {
					for(var i = 0; i < oData.results.length; i++) {
						delete oData.results[i].__metadata;
					}
					oController._statusData = oData;
					oController.populateStatusCountData(oController);
				},
				error: function (oError) {
					
				}
			});
			
			oController.populateMonthlyCountData(oController);
		},
		
		/********* PRIORITY DONUT CHART DATA POPULATION - START *********/
		populatePriorityCountData: function(oController) {
			var priorityCollection = oController._priorityData;
			var priorityFilterArray = [];
			for(var i = 0; i < priorityCollection.results.length; i++) {
				var statusFilter = new Filter({
			      path: "ServicePriorityCode",
			      operator: FilterOperator.EQ,
			      value1: priorityCollection.results[i].Code
			    });
			    priorityFilterArray.push(statusFilter);
			}

			for(var j = 0; j < priorityCollection.results.length; j++) {
				oController._priorityData.results[j].requestCount = oController.getPriorityBasedCount(oController._allTicketData, priorityCollection.results[j].Code);
			}
			
			var donutCardDataModel = oController.getOwnerComponent().getModel("donutCardModel");
			var donutCardData = JSON.parse(donutCardDataModel.getJSON());
			donutCardData["sap.card"].content.data.json = oController._priorityData;
			donutCardData["sap.card"].content.data.path = "/results";
			oController.getView().byId("cardServiceRequestsDonut").setManifest(donutCardData);
			oController.getView().byId("cardServiceRequestsDonut").setBusy(false);
		},
		
		getPriorityBasedCount: function(oData, priorityCode) {
			return oData.results.filter(function(o) { return o.ServicePriorityCode === priorityCode; }).length;
		},
		/********* PRIORITY DONUT CHART DATA POPULATION - END *********/
		
		/********* STATUS COLUMN CHART DATA POPULATION - START *********/
		populateStatusCountData: function(oController) {
			var statusCollection = oController._statusData;
			var statusFilterArray = [];
			for(var i = 0; i < statusCollection.results.length; i++) {
				var statusFilter = new Filter({
			      path: "ServiceRequestUserLifeCycleStatusCode",
			      operator: FilterOperator.EQ,
			      value1: statusCollection.results[i].Code
			    });
			    statusFilterArray.push(statusFilter);
			}

			for(var j = 0; j < statusCollection.results.length; j++) {
				oController._statusData.results[j].requestCount = oController.getStatusBasedCount(oController._allTicketData, statusCollection.results[j].Code);
			}
			
			var columnCardDataModel = oController.getOwnerComponent().getModel("columnCardModel");
			var columnCardData = JSON.parse(columnCardDataModel.getJSON());
			columnCardData["sap.card"].content.data.json = oController._statusData;
			columnCardData["sap.card"].content.data.path = "/results";
			oController.getView().byId("cardServiceRequestsStackedColumn").setManifest(columnCardData);
			oController.getView().byId("cardServiceRequestsStackedColumn").setBusy(false);
		},
		
		getStatusBasedCount: function(oData, statusCode) {
			return oData.results.filter(function(o) { return o.ServiceRequestUserLifeCycleStatusCode === statusCode; }).length;
		},
		/********* STATUS COLUMN CHART DATA POPULATION - END *********/
		
		/********* MONTHLY LINE CHART DATA POPULATION - START *********/
		populateMonthlyCountData: function(oController) {
			for(var i = 0; i < oController._allTicketData.results.length; i++) {
				if(oController._allTicketData.results[i].CreationDateTime.getFullYear() === 2020) {
					oController._lineChartData.results[oController._allTicketData.results[i].CreationDateTime.getMonth()].RequestCount20 = 
					oController._lineChartData.results[oController._allTicketData.results[i].CreationDateTime.getMonth()].RequestCount20 + 1;
				} else if(oController._allTicketData.results[i].CreationDateTime.getFullYear() === 2019) {
					oController._lineChartData.results[oController._allTicketData.results[i].CreationDateTime.getMonth()].RequestCount19 = 
					oController._lineChartData.results[oController._allTicketData.results[i].CreationDateTime.getMonth()].RequestCount19 + 1;
				}
			}
			
			var lineCardDataModel = oController.getOwnerComponent().getModel("lineCardModel");
			var lineCardData = JSON.parse(lineCardDataModel.getJSON());
			lineCardData["sap.card"].content.data.json.results = oController._lineChartData.results;
			lineCardData["sap.card"].content.data.path = "/results";
			oController.getView().byId("cardServiceRequestsLine").setManifest(lineCardData);
			oController.getView().byId("cardServiceRequestsLine").setBusy(false);
		}
		/********* MONTHLY LINE CHART DATA POPULATION - END *********/
	});
});