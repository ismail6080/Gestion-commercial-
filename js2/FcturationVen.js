$(document).ready(function () {
    // Vérifiez si les données sont chargées
    if (typeof window.ventes === "undefined" || typeof window.commandes=== "undefined" || typeof window.client === "undefined") {
        console.error("Les données ne sont pas encore chargées.");
        return;
    }

    // Variables globales pour stocker les réceptions facturées et non facturées
    var receptionsFacturise = window.ventes.filter(rec => rec.Facturation === "Facturisée");
    var receptionsNonFacturise = window.ventes.filter(rec => rec.Facturation === "Non Facturisée");

    // Fonction pour obtenir le montant total des commandes pour une réception donnée
    function getTotalAmount(VenteId) {
        return window.commandes
            .filter((commande) => commande.VenteId === VenteId)
            .reduce((total, commande) => total + commande.Amount, 0);
    }

    // Fonction pour remplir le select avec les fournisseurs
    function remplirFournisseurs() {
        var fournisseurSelect = $("#fournisseurSelect");
        fournisseurSelect.empty(); // Vider les options existantes

        window.client.forEach(client => {
            fournisseurSelect.append(new Option(client.Nom_complete, client.Id));
        });
    }

    // Fonction pour mettre à jour les DataGrids en fonction du fournisseur sélectionné
    function mettreAJourDataGrids(Client) {
        var filteredReceptionsFacturise = receptionsFacturise.filter(rec => rec.Client === Client);
        var filteredReceptionsNonFacturise = receptionsNonFacturise.filter(rec => rec.Client === Client);

        $("#gridContainer").dxDataGrid("instance").option("dataSource", filteredReceptionsFacturise);
        $("#gridContainer2").dxDataGrid("instance").option("dataSource", filteredReceptionsNonFacturise);
    }

    // Initialiser DataGrid1 pour les réceptions facturées
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
                { dataField: "VenteNumber", caption: "Numéro de vente", editorOptions: { disabled: true } },
                { dataField: "Date", caption: "Date", dataType: "date", format: "dd/MM/yyyy" },
                { dataField: "Client", caption: "Client" },
                { dataField: "Observation", caption: "Observation" },
            ]
        });
    }

    // Initialiser DataGrid2 pour les réceptions non facturées
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
                { dataField: "VenteNumber", caption: "Numéro de réception", editorOptions: { disabled: true } },
                { dataField: "Date", caption: "Date", dataType: "date", format: "dd/MM/yyyy" },
                { dataField: "Client", caption: "Fournisseur" },
                { dataField: "Observation", caption: "Observation" },
            ]
        });
    }

    // Mettre à jour la visibilité des boutons de déplacement
    function toggleMoveButtons() {
        var grid1 = $("#gridContainer").dxDataGrid("instance");
        var grid2 = $("#gridContainer2").dxDataGrid("instance");

        var selectedInGrid1 = grid1.getSelectedRowsData().length > 0;
        var selectedInGrid2 = grid2.getSelectedRowsData().length > 0;

        // Activer les boutons en fonction des sélections
        $("#facturiseBtn").prop('disabled', !selectedInGrid2);
        $("#defacturiseBtn").prop('disabled', !selectedInGrid1);
    }

    // Déplacer une réception entre les deux DataGrids
    function moveReception(toFacturise) {
        var grid1 = $("#gridContainer").dxDataGrid("instance");
        var grid2 = $("#gridContainer2").dxDataGrid("instance");

        var selectedReception = grid1.getSelectedRowsData()[0] || grid2.getSelectedRowsData()[0];

        if (!selectedReception) {
            DevExpress.ui.notify(`Veuillez sélectionner une vente à déplacer`, "error", 3000);
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

        toggleMoveButtons(); // Re-hide buttons after action
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

    // Remplir les fournisseurs
    remplirFournisseurs();

    // Événement pour la sélection du fournisseur
    $("#fournisseurSelect").on("change", function () {
        var selectedClient = $(this).val();
        if (selectedClient) {
            mettreAJourDataGrids(selectedClient);
        }
    });

    // Initialiser les DataGrids avec toutes les réceptions au départ
    initialiserDataGrid1(receptionsFacturise);
    initialiserDataGrid2(receptionsNonFacturise);
});
