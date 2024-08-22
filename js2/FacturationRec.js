$(document).ready(function () {
    if (typeof window.reception === "undefined" || typeof window.orders === "undefined" || typeof window.fournisseur === "undefined") {
        console.error("Les données ne sont pas encore chargées.");
        return;
    }

    var receptionsFacturise = window.reception.filter(rec => rec.Facturation === "Facturisée");
    var receptionsNonFacturise = window.reception.filter(rec => rec.Facturation === "Non Facturisée");

    function getTotalAmount(receptionId) {
        return window.orders
            .filter((order) => order.ReceptionId === receptionId)
            .reduce((total, order) => total + order.Amount, 0);
    }
 
    function remplirFournisseurs() {
        var fournisseurSelect = $("#fournisseurSelect");
        fournisseurSelect.empty(); 

        window.fournisseur.forEach(fournisseur => {
            fournisseurSelect.append(new Option(fournisseur.Nom_complete, fournisseur.Id));
        });
    }
 function mettreAJourDataGrids(fournisseurId) {
        var filteredReceptionsFacturise = receptionsFacturise.filter(rec => rec.FournisseurId === fournisseurId);
        var filteredReceptionsNonFacturise = receptionsNonFacturise.filter(rec => rec.FournisseurId === fournisseurId);

        $("#gridContainer").dxDataGrid("instance").option("dataSource", filteredReceptionsFacturise);
        $("#gridContainer2").dxDataGrid("instance").option("dataSource", filteredReceptionsNonFacturise);
    }

    function initialiserDataGrid1(dataSource) {
        $("#gridContainer").dxDataGrid({
            dataSource: dataSource,
            keyExpr: "Id",
            paging: {
                pageSize: 10,
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100],
            },
            selection: {
                mode: "single",
                selectAllMode: "allPages"
            },
            onSelectionChanged: function (e) {
                toggleMoveButtons();
            },
            searchPanel: {
                visible: true,
                highlightCaseSensitive: true,
            },
            columns: [
                { dataField: "ReceptionNumber", caption: "Numéro de réception", editorOptions: { disabled: true } },
                { dataField: "Date", caption: "Date", dataType: "date", format: "dd/MM/yyyy" },
                { dataField: "FournisseurId", caption: "Fournisseur" },
                { dataField: "Service", caption: "Service" },
                { dataField: "Observation", caption: "Observation" },
            ]
        });
    }

    function initialiserDataGrid2(dataSource) {
        $("#gridContainer2, .move-button, #BtnSelect").css('display', 'block');

        $("#gridContainer2").dxDataGrid({
            dataSource: dataSource,
            keyExpr: "Id",
            paging: {
                pageSize: 10,
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [10, 25, 50, 100],
            },
            selection: {
                mode: "single",
                selectAllMode: "allPages"
            },
            onSelectionChanged: function (e) {
                toggleMoveButtons();
            },
            searchPanel: {
                visible: true,
                highlightCaseSensitive: true,
            },
            columns: [
                { dataField: "ReceptionNumber", caption: "Numéro de réception", editorOptions: { disabled: true } },
                { dataField: "Date", caption: "Date", dataType: "date", format: "dd/MM/yyyy" },
                { dataField: "FournisseurId", caption: "Fournisseur" },
                { dataField: "Service", caption: "Service" },
                { dataField: "Observation", caption: "Observation" },
            ]
        });
    }

    function toggleMoveButtons() {
        var grid1 = $("#gridContainer").dxDataGrid("instance");
        var grid2 = $("#gridContainer2").dxDataGrid("instance");

        var selectedInGrid1 = grid1.getSelectedRowsData().length > 0;
        var selectedInGrid2 = grid2.getSelectedRowsData().length > 0;

       
        $("#facturiseBtn").prop('disabled', !selectedInGrid2);
        $("#defacturiseBtn").prop('disabled', !selectedInGrid1);
    }

    function moveReception(toFacturise) {
        var grid1 = $("#gridContainer").dxDataGrid("instance");
        var grid2 = $("#gridContainer2").dxDataGrid("instance");

        var selectedReception = grid1.getSelectedRowsData()[0] || grid2.getSelectedRowsData()[0];

        if (!selectedReception) {
            DevExpress.ui.notify(`Veuillez sélectionner une réception à déplacer`, "error", 3000);
            return;
        }

        if (toFacturise) {
            selectedReception.Facturation = "Facturisée";
            receptionsFacturise.push(selectedReception);
            receptionsNonFacturise = receptionsNonFacturise.filter(rec => rec.Id !== selectedReception.Id);
        } else {
            selectedReception.Facturation = "Non Facturisée";
            receptionsNonFacturise.push(selectedReception);
            receptionsFacturise = receptionsFacturise.filter(rec => rec.Id !== selectedReception.Id);
        }

       
        mettreAJourDataGrids($("#fournisseurSelect").val());

        toggleMoveButtons(); 
    }

    $("#facturiseBtn").dxButton({
        icon: "chevronup",
        onClick: function () {
            console.log("Bouton 'Facturiser' cliqué.");
            moveReception(true);
        }
    });

    $("#defacturiseBtn").dxButton({
        icon: "chevrondown",
        onClick: function () {
            console.log("Bouton 'Défacturiser' cliqué.");
            moveReception(false);
        }
    });

    remplirFournisseurs();

    $("#fournisseurSelect").on("change", function () {
        var selectedFournisseurId = $(this).val();
        if (selectedFournisseurId) {
            mettreAJourDataGrids(selectedFournisseurId);
        }
    });

    initialiserDataGrid1(receptionsFacturise);
    initialiserDataGrid2(receptionsNonFacturise);
});
