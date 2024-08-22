$(() => {
  var articleslow = window.articles.filter(article => article.qstock <= 5);

  const popupContentTemplate = function () {
    return $('<div>').dxDataGrid({
        dataSource: articleslow, 
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
            selectTextOnEditStart: true,
            startEditAction: 'click'
        },
        masterDetail: {
            enabled: false
        },
        columns: [
            { dataField: 'idart', caption: 'ID', width: 70,
            },
            { dataField: 'Nom_article', caption: 'Nom Article',
            }, 
            { dataField: 'prix',   caption: 'Prix',dataType: 'number', format: { type: 'currency', currency: 'MAD' }    },
            { dataField: 'qstock', caption: 'Quantité de stock', width: 150 ,dataType: 'number'},
            {dataField: 'codef',   caption: 'Code de famille'}
        ],
        
    
    });
  };

  const popup = $('#popup').dxPopup({
    contentTemplate: popupContentTemplate,
    width: 700,
    height: 400,
    container: '.dx-viewport',
    showTitle: true,
    title: 'Articles en rupture de stock',
    visible: true,
    dragEnabled: true,
    hideOnOutsideClick: true,
    showCloseButton: true,
  }).dxPopup('instance');
});
