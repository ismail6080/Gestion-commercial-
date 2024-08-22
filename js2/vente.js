$(document).ready(function() {
    if (typeof window.ventes === 'undefined' || typeof window.commandes === 'undefined') {
        console.error("Data not loaded yet.");
        return;
    }

    var year = new Date().getFullYear() % 100;
    var cmp = window.ventes.length;
    var newReceptionNumber = `BR${year.toString().padStart(2, '0')}${cmp.toString().padStart(3, '0')}`;

    // Function to calculate the total amount for each reception
    function getTotalAmount(VenteId) {
        return window.commandes
            .filter(order => order.VenteId === VenteId)
            .reduce((total, order) => total + order.Amount, 0);
    }

   
    $('#gridContainer').dxDataGrid({
        dataSource: window.ventes,
        keyExpr: 'Id',
        paging: {
            pageSize: 10,
        },
        pager: {
            showPageSizeSelector: true,
            allowedPageSizes: [10, 25, 50, 100],
        },
        remoteOperations: false,
        searchPanel: {
            visible: true,
            highlightCaseSensitive: true,
        },
        groupPanel: {
            visible: true,
        },
        grouping: {
            autoExpandAll: false,
        },
        editing: {
            mode: 'popup',
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true,
            startEditAction: 'click',
        },
        onRowInserting: function(e) {
            var year = new Date().getFullYear() % 100;
            var cmp = window.ventes.length + 1;
            e.data.VenteNumber = `FR${year.toString().padStart(2, '0')}${cmp.toString().padStart(3, '0')}`;
            saveDataToServer();
        },
        allowColumnReordering: false,
        rowAlternationEnabled: true,
        width: '100%',
        columns: [
            {
                dataField: 'VenteNumber',
                caption: 'Numéro de Vente',
                editorOptions: { disabled: true },
            }, {
                dataField: 'Facturation',
                caption: 'Facturation',
                cellTemplate: function(container, options) {
                    $('<div>').dxCheckBox({
                        value: options.value === "Facturisée",
                        onValueChanged: function(e) {
                            options.setValue(e.value ? "Facturisée" : "Non Facturisée");
                            var rowElement = container.closest('.dx-row');
                            if (e.value) {
                                rowElement.css('color', 'green');
                            } else {
                                rowElement.css('color', 'red');
                            }
                        }
                    }).appendTo(container);
                },
                editCellTemplate: function(container, options) {
                    $('<div>').dxCheckBox({
                        value: options.value === "Facturisée",
                        onValueChanged: function(e) {
                            options.setValue(e.value ? "Facturisée" : "Non Facturisée");
                        }
                    }).appendTo(container);
                }
            },
            {
                dataField: 'Date',
                caption: 'Date',
                dataType: 'date',
                format: 'dd/MM/yyyy',
                validationRules: [{ type: 'required', message: 'La date est requise' }],
            },
            {
                dataField: 'Client',
                caption: 'Client',
                lookup: {
                    dataSource: window.client,
                    displayExpr: "Nom_complete",
                    valueExpr: "Nom_complete",
                },            
                validationRules: [{ type: 'required', message: 'Le client est requis' }],
            },
            {
                dataField: "Observation",
                editorType: 'dxTextArea',
                editorOptions: {
                    height: 90,
                    maxLength: 200
                },
            },
            {
                dataField: 'TotalAmount',
                caption: 'Montant Total',
                calculateCellValue: function (data) {
                    return getTotalAmount(data.Id);
                },
                format: { type: 'currency', currency: 'MAD' }
            },
            {
                type: 'buttons',
                buttons: [
                    {
                        hint: 'Editer',
                        icon: 'edit',
                        onClick: function (e) {
                           
                        }
                    },
                    {
                        hint: 'Suprimer',
                        icon: 'trash',
                        onClick: function (e) {
                            const data = e.row.data;
                            DevExpress.ui.dialog.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?", "Confirmation de suppression")
                                .done(function (dialogResult) {
                                    if (dialogResult) {
                                        const index = window.ventes.findIndex(item => item.Id === data.Id);
                                        if (index > -1) {
                                            window.ventes.splice(index, 1);
                                            $('#gridContainer').dxDataGrid('instance').refresh();
                                            DevExpress.ui.notify("Enregistrement supprimé avec succès.", "success", 3000);
                                        }
                                    }
                                });
                        }
                    },
                    {
                        hint: "imprimer",
                        icon: "fa fa-print",
                        onClick: function (e) {
                            const data = e.row.data;
                            const items = window.commandes.filter(
                                (commande) => commande.VenteId === data.Id
                            );

                            const totalHT = items.reduce(
                                (sum, item) => sum + item.Quantity * item.Price,
                                0
                            );

                            const { jsPDF } = window.jspdf;
                            const doc = new jsPDF();

                            
                           doc.addImage(window.logoBase64, "PNG", 70, 8, 50, 20);
                            

                            const factureType = "Facture de Vente";
                            doc.setFont("times", "bold");
                            doc.setFontSize(16);
                            doc.text(factureType, 105, 40, null, null, 'center');

                            doc.setFont("times", "bold");
                            doc.setFontSize(12);
                            doc.text("Numéro de Vente:", 14, 50);
                            doc.setFont("helvetica", "normal");
                            doc.text(`${data.VenteNumber}`, 70, 50);

                            doc.setFont("times", "bold");
                            doc.text("Date:", 120, 50);
                            doc.setFont("helvetica", "normal");
                            doc.text(`${data.Date}`, 140, 50);

                            doc.setFont("times", "bold");
                            doc.text("Client:", 14, 60);
                            doc.setFont("helvetica", "normal");
                            doc.text(`${data.Client}`, 45, 60);

                            // Prepare table data
                            const tableColumn = [
                                "ID Commande",
                                "Article",
                                "Quantité",
                                "Prix Unitaire",
                                "Montant",
                            ];
                            const tableRows = [];

                            items.forEach((item) => {
                                const itemData = [
                                    item.CammandeId,
                                    item.ArticleId,
                                    item.Quantity.toString(),
                                    `${item.Price} MAD`,
                                    `${item.Quantity * item.Price} MAD`,
                                ];
                                tableRows.push(itemData);
                            });
                            tableRows.push(["", "", "", "Total", `${totalHT} MAD`]);

                            // Generate table
                            doc.autoTable({
                                startY: 70,
                                head: [tableColumn],
                                body: tableRows,
                                theme: "striped",
                                styles: {
                                    fontSize: 10,
                                    cellPadding: 5,
                                    valign: "middle",
                                },
                                headStyles: {
                                    fillColor: [46, 154, 153],
                                },
                            });

                            
                            // Add company information at the end
                            doc.setFont("Courier", "bold");
                            doc.setFontSize(10);
                            doc.text("Localisation:", 14, doc.internal.pageSize.height - 20);
                            doc.setFont("Courier New", "normal");
                            doc.text("Technopole 2,Lotissement Founty,Bloc E, 4éme étage,Agadir, Maroc", 45, doc.internal.pageSize.height - 20);

                            doc.setFont("Courier", "bold");
                            doc.text("Contactez-Nous:", 14, doc.internal.pageSize.height - 15);
                            doc.setFont("Courier New", "normal");
                            doc.text("contact@omegasoft.ma", 47,doc.internal.pageSize.height - 15);

                            doc.text("05-28-22-15-95", 100, doc.internal.pageSize.height - 15);
                            doc.text("05-28-22-15-96", 130, doc.internal.pageSize.height - 15);
                            doc.text("06-61-40-53-43", 160, doc.internal.pageSize.height - 15);

                            // Add current date and time
                            doc.setTextColor(0, 0, 0);
                            const currentDate = new Date().toLocaleDateString();
                            const currentTime = new Date().toLocaleTimeString();
                            doc.setFontSize(8);
                            doc.text(
                                `${currentDate} ${currentTime}`,
                                100,
                                doc.internal.pageSize.height - 5
                            );

                            const string = doc.output("datauristring");
                            const embed = `<embed width='100%' height='100%' src='${string}'/>`;
                            const x = window.open();
                            x.document.open();
                            x.document.write(embed);
                            x.document.close();
                            window.pdfWindow = x;
                        },
                    }
                ]
            }
        ],
        masterDetail: {
            enabled: true,
            template: function(container, options) {
                $('<div/>').dxDataGrid({
                    dataSource: window.commandes.filter(order => order.VenteId === options.data.Id),
                    searchPanel: {
                        visible: true,
                        width: 240,
                        placeholder: 'Rechercher...',
                    },
                    columns: [
                        {
                            dataField: 'CammandeId',
                            caption: 'ID Commande',
                            editorOptions: { disabled: true },
                        },
                        {
                            dataField: 'ArticleId', // Ensure this matches your JSON data field
                            caption: 'Article',
                            lookup: {
                                dataSource: window.articles,
                                displayExpr: 'Nom_article',
                                valueExpr: 'ArticleId' 
                            }
                        },
                        {
                            dataField: 'Quantity',
                            caption: 'Quantité',
                            dataType: 'number',
                            validationRules: [
                                { type: 'required', message: 'La quantité est requise' },
                                {type:'custom',
                                    validationCallback:function(e){
                                       var article = window.articles.find(item => item.Nom_article === e.data.ArticleId);
                                       return e.value < article.qstock && e.value>0;
                                       },
                                     message:'Cette Quantité n\'exist pas ou invariable',
                                   }
                            ],
                        },
                        {
                            dataField: 'Price',
                            caption: 'Prix',
                            format: { type: 'currency', currency: 'MAD' },
                            dataType: 'number',
                            validationRules: [
                                { type: 'required', message: 'Le prix est requis' },
                                 {
                                    type: 'custom',
                                    validationCallback: function(e) {
                                        var article = window.articles.find(item => item.Nom_article === e.data.ArticleId);
                                        return e.value >= article.prix;
                                    },
                                    
                                    message: 'Le prix doit être supérieur ou égal au prix de l\'article'
                                }
                            ]
                        },
                        {
                            dataField: 'Amount',
                            caption: 'Montant',
                            format: { type: 'currency', currency: 'MAD' },
                            calculateCellValue: function (data) {
                                return data.Quantity * data.Price;
                            },
                            editorOptions: { disabled: true },
                        }
                    ],
                    columnAutoWidth: true,
                    height: 'auto',
                    editing: {
                        mode: 'popup',
                        allowUpdating: true,
                        allowDeleting: true,
                        allowAdding: true,
                        startEditAction: 'click',
                    },
                    onRowInserting: function(e) {
                        var cmp = window.commandes.length + 1;
                        e.data.CammandeId = `O${cmp.toString().padStart(3, '0')}`;
                        saveDataToServer();
                    },
                    onRowUpdated: function(e) {
                        console.log('Row updated:', e.data);
                        saveDataToServer();
                    },
                    onRowRemoved: function(e) {
                        console.log('Row removed:', e.data);
                        saveDataToServer();
                    }
                }).appendTo(container);
            }
        }
    });
});
