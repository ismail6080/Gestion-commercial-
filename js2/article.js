$(function() {
    if (typeof window.articles === 'undefined') {
        console.error("Data not loaded yet.");
        return;
    }

    var cmp = window.articles.length;

    function initializeDataGrid() {
        var dataGrid = $('#gridContainer').dxDataGrid({
            dataSource: window.articles,
            keyExpr: 'idart',
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: 'Rechercher...',
            },
            showBorders: true,
            paging: { enabled: false },
            editing: {
                mode: 'row',
                allowUpdating: true,
                allowAdding: true,
                allowDeleting: true,
                selectTextOnEditStart: true,
                startEditAction: 'click'
            },
            masterDetail: {
                enabled: false
            },
            columns: [
                {
                    dataField: 'idart',
                    caption: 'ID',
                    width: 70,
                    editorOptions: { disabled: true }
                },
                {
                    dataField: 'Nom_article',
                    caption: 'Nom Article',
                    validationRules: [{ type: 'required', message: 'Le Nom est requis' }]
                },
                {
                    dataField: 'prix',
                    caption: 'Prix',
                    dataType: 'number',
                    width: 250,
                    format: { type: 'currency', currency: 'MAD' },
                    validationRules: [
                        { type: 'required', message: 'Le prix est requis' },
                        { type: 'range', min: 0, message: 'Le prix doit être positif' }
                    ]
                },
                {
                    dataField: 'qstock',
                    caption: 'Quantité de stock',
                    width: 250,
                    dataType: 'number',
                    validationRules: [
                        { type: 'required', message: 'La Quantité est requise' },
                        { type: 'range', min: 1, message: 'La quantité doit être au moins 1' }
                    ]
                },
                {
                    dataField: 'codef',
                    caption: 'Désignation de famille',
                    width: 200,
                    validationRules: [{ type: 'required', message: 'Le Désignation est requis' }],
                    lookup: {
                        dataSource: window.artfamille,
                        displayExpr: 'Désignation',
                        valueExpr: 'Désignation'
                    }
                }
            ],
            onRowUpdating: function(e) {
                console.log("Updating row:", e.oldData, e.newData);
                saveDataToServer();
            },
            onRowInserting: function(e) {
                e.data.idart = cmp++;
                saveDataToServer();
            }
        }).dxDataGrid('instance');
    }

    initializeDataGrid();
});
