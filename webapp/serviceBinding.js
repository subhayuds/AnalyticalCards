function initModel() {
	var sUrl = "/oData_on_C4C/sap/c4c/odata/v1/c4codataapi/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}