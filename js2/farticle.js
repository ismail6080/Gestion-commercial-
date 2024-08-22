$(function() {
    if (typeof window.artfamille === 'undefined' || typeof window.articles === 'undefined') {
        console.error("Data not loaded yet.");
        return;
    }

    initializeDataGrid();
    function initializeDataGrid() {
        var dataGrid = $('#gridContainer').dxDataGrid({
            dataSource: window.artfamille, 
            keyExpr: 'idartf', 
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
            masterDetail: {
                enabled: false
            },
            columns: [
                { dataField: 'idartf', caption: 'ID', width: 100,
                  editorOptions: {
                      disabled: true,
                  },
                },
                { dataField: 'Désignation', caption: 'Désignation',
                    validationRules: [{
                        type: 'required',
                        message: 'La désignation est requise',
                    }]
                },
                { dataField: 'code', caption: 'Code',
                    validationRules: [{
                        type: 'required',
                        message: 'Le code est requis',
                    }]
                }
            ],
            onRowUpdating: function(e) {
                console.log("Updating row:", e.oldData, e.newData);
                saveDataToServer();
    
            },
            onRowInserting: function(e) {
                e.data.idartf = window.artfamille.length + 1; 
                saveDataToServer();
            },
           
            onRowRemoving: function(e) {
                saveDataToServer();
                var familyCode = e.data.Désignation; 
             
                var associatedArticles = window.articles.filter(article => {
                    var articleCode = article.codef
                    return articleCode === familyCode;
                });
                if (associatedArticles.length > 0) {
                    e.cancel = true; 
                    DevExpress.ui.notify(`Impossible de supprimer la famille d'article avec le code ${familyCode} car elle est associée à des articles existants.`, "error", 3000);
                }
            }
            
            
        }).dxDataGrid('instance');
    }
});
