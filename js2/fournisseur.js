$(function() {
    if (typeof window.fournisseur === 'undefined' && typeof window.villes === 'undefined') {
        console.error("Data not loaded yet.");
        return;
    }
    
    var cmp = window.fournisseur.length; // Initialize cmp with the length of the fournisseur array

    initializeDataGrid();

    function initializeDataGrid() {
        const dataGrid = $('#gridContainer').dxDataGrid({
            dataSource: window.fournisseur,
            keyExpr: 'ID',
            searchPanel: {
                visible: true,
                width: 240,
                placeholder: 'Rechercher...',
            },
            showBorders: true,
            paging: { enabled: false },
            editing: {
                mode: 'popup',
                allowUpdating: true,
                allowAdding: true,
                allowDeleting: true,
                selectTextOnEditStart: true,
                startEditAction: 'click'
            },
            columns: [
                {
                    dataField: 'ID',
                    caption: 'ID',
                    width: 70,
                    editorOptions: {
                        disabled: true, 
                    
                    },
                },
                {
                    dataField: 'Nom_complete',
                    validationRules: [{
                        type: 'required',
                        message: 'Le Nom est requis',
                    }]
                },
                {
                    dataField: 'Téléphone',
                    validationRules: [{
                        type: 'required',
                        message: 'Le Téléphone est requis',
                    }],
                    editorOptions: {
                        mask: '+212000000000',
                        maskRules: {
                            X: /[4-9]/,
                        },
                        maskInvalidMessage: 'Le téléphone doit être au format correct',
                        valueChangeEvent: 'keyup',
                    },
                },
                'Address',
                {
                    dataField: 'Ville',
                    caption: 'Ville',
                    width: 125,
                    validationRules: [{
                        type: 'required',
                        message: 'La ville est requise',
                    }],
                    lookup: {
                        dataSource: window.villes,
                        displayExpr: 'Name',
                        valueExpr: 'Name'
                    }
                }
            ],
            masterDetail: {
                enabled: false
            },
            onRowInserting: function(e) {
                e.data.ID = cmp;
                cmp++;
                saveDataToServer();
            }
        }).dxDataGrid('instance');

        $('#selectTextOnEditStart').dxCheckBox({
            value: true,
            text: 'Select Text on Edit Start',
            onValueChanged(data) {
                dataGrid.option('editing.selectTextOnEditStart', data.value);
            }
        });

        $('#startEditAction').dxSelectBox({
            value: 'click',
            inputAttr: { 'aria-label': 'Action' },
            items: ['click', 'dblClick'],
            onValueChanged(data) {
                dataGrid.option('editing.startEditAction', data.value);
            }
        });
    }
});
