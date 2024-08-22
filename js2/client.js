$(function() {
    if (typeof window.villes !== 'undefined') {
        var cmpClient = window.client.length; 
         initializeDataGrid('#gridContainer', window.client, cmpClient);
    } else {
        console.error("Villes data not loaded.");
    }

    function initializeDataGrid(containerSelector, dataSource, cmp, isClient = false) {
        const columns = [
            {
                dataField: 'ID',
                caption: 'ID',
                width: 70,
                editorOptions: { disabled: true },
            },
            {
                dataField: 'Nom_complete',
                validationRules: [{ type: 'required', message: 'Le Nom est requis' }],
            },
            {
                dataField: 'Téléphone',
                validationRules: [{ type: 'required', message: 'Le Téléphone est requis' }],
                editorOptions: {
                    mask: '+212000000000',
                    maskRules: { X: /[4-9]/ },
                    maskInvalidMessage: 'Le téléphone doit être au format correct',
                    valueChangeEvent: 'keyup',
                },
            },
            'Address',
            {
                dataField: 'Ville',
                caption: 'Ville',
                width: 125,
                validationRules: [{ type: 'required', message: 'La ville est requise' }],
                lookup: {
                    dataSource: window.villes,
                    displayExpr: 'Name',
                    valueExpr: 'Name'
                }
            }
        ];

        if (isClient) {
            columns.push(
                {
                    dataField: 'Email',
                    validationRules: [{ type: 'required', message: 'L\'Email est requis' }],
                },
                {
                    dataField: 'BirthDate',
                    caption: 'Date de naissance',
                    dataType: 'date',
                }
            );
        }

        const dataGrid = $(containerSelector).dxDataGrid({
            dataSource: dataSource,
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
            columns: columns,
            masterDetail: {
                enabled: false
            },
            onRowInserting: function(e) {
                e.data.ID = cmp;
                cmp++;
                saveDataToServer();
            }
        }).dxDataGrid('instance');

        $(containerSelector + '-selectTextOnEditStart').dxCheckBox({
            value: true,
            text: 'Select Text on Edit Start',
            onValueChanged(data) {
                dataGrid.option('editing.selectTextOnEditStart', data.value);
            }
        });

        $(containerSelector + '-startEditAction').dxSelectBox({
            value: 'click',
            inputAttr: { 'aria-label': 'Action' },
            items: ['click', 'dblClick'],
            onValueChanged(data) {
                dataGrid.option('editing.startEditAction', data.value);
                saveDataToServer();
            }
        });
    }
});
