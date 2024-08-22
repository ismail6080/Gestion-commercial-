$(document).ready(function () {
  if (typeof window.reception === "undefined" || typeof window.orders === "undefined") {
      console.error("Les données ne sont pas encore chargées.");
      return;
  }

  function getTotalAmount(receptionId) {
      return window.orders
          .filter(order => order.ReceptionId === receptionId)
          .reduce((total, order) => total + order.Amount, 0);
  }

  $("#gridContainer").dxDataGrid({
      dataSource: window.reception,
      keyExpr: "Id",
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
          mode: "popup",
          allowUpdating: true,
          allowDeleting: true,
          allowAdding: true,
          startEditAction: "click",
      },
      onRowInserting: function (e) {
          var year = new Date().getFullYear() % 100;
          var cmp = window.reception.length + 1;
          e.data.ReceptionNumber = `BR${year.toString().padStart(2, "0")}${cmp.toString().padStart(3, "0")}`;
      },
      onRowInserted: function (e) {
          window.reception.push(e.data);
          var receptionOrders = window.orders.filter(order => order.ReceptionId === e.data.Id);
          receptionOrders.forEach(order => {
              var article = window.articles.find(a => a.Nom_article === order.Article);
              if (article) {
                  article.Stock = (article.Stock || 0) + order.Quantity;
              }
          });
      },
      onRowUpdating: function (e) {
          $.extend(e.oldData, e.newData);
          var index = window.reception.findIndex(item => item.Id === e.key);
          if (index > -1) {
              window.reception[index] = e.oldData;
          }
      },
      onRowRemoving: function (e) {
          var index = window.reception.findIndex(item => item.Id === e.key);
          if (index > -1) {
              window.reception.splice(index, 1);
          }
      },
      allowColumnReordering: false,
      rowAlternationEnabled: true,
      showBorders: true,
      width: "100%",
      columns: [
          {
              dataField: "ReceptionNumber",
              caption: "Numéro de réception",
              editorOptions: { disabled: true },
          },
          {
              dataField: "Date",
              caption: "Date",
              dataType: "date",
              format: "dd/MM/yyyy",
              validationRules: [{ type: "required", message: "La date est requise" }],
          },
          {
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
              dataField: "Observation",
              editorType: "dxTextArea",
              editorOptions: { height: 90, maxLength: 200 },
              label: { text: "Observation" },
          },
          {
              dataField: "TotalAmount",
              editorOptions: { disabled: true },
              caption: "Montant Total",
              calculateCellValue: function (data) {
                  return getTotalAmount(data.Id);
              },
              format: { type: "currency", currency: "MAD" },
          },
          {
              dataField: "FournisseurId",
              caption: "Fournisseur",
              lookup: {
                  dataSource: window.fournisseur,
                  displayExpr: "Nom_complete",
                  valueExpr: "Nom_complete",
              },
              validationRules: [{ type: "required", message: "Le fournisseur est requis" }],
          },
          {
              type: "buttons",
              buttons: [
                  { hint: "Editer", icon: "edit", onClick: function (e) {} },
                  {
                      hint: "Supprimer",
                      icon: "trash",
                      onClick: function (e) {
                          const data = e.row.data;
                          DevExpress.ui.dialog.confirm(
                              "Êtes-vous sûr de vouloir supprimer cet enregistrement ?",
                              "Confirmation de suppression"
                          ).done(function (dialogResult) {
                              if (dialogResult) {
                                  const index = window.reception.findIndex(item => item.Id === data.Id);
                                  if (index > -1) {
                                      window.reception.splice(index, 1);
                                      $("#gridContainer").dxDataGrid("instance").refresh();
                                      DevExpress.ui.notify(
                                          "Enregistrement supprimé avec succès.",
                                          "success",
                                          3000
                                      );
                                  }
                              }
                          });
                      },
                  },
                  {
                      hint: "imprimer",
                      icon: "fa fa-print",
                      onClick: function (e) {
                          const data = e.row.data;
                          const items = window.orders.filter(order => order.ReceptionId === data.Id);

                          const totalHT = items.reduce((sum, item) => sum + item.Quantity * item.Price, 0);

                          const { jsPDF } = window.jspdf;
                          const doc = new jsPDF();

                          doc.addImage(window.logoBase64, "PNG", 70, 8, 50, 20);
                          
                          const factureType="Facture de Reception";
                          doc.setFont("times", "bold");
                          doc.setFontSize(16);
                          doc.text(factureType, 105, 40, null, null, 'center');

                          // Add receipt details with different font styles
                          doc.setFont("times", "bold");
                          doc.setFontSize(12);
                          doc.text("Numéro de Réception:", 14, 50);
                          doc.setFont("helvetica", "normal");
                          doc.text(`${data.ReceptionNumber}`, 70, 50);

                          doc.setFont("times", "bold");
                          doc.text("Date:", 120, 50);
                          doc.setFont("helvetica", "normal");
                          doc.text(`${data.Date}`, 140, 50);

                          doc.setFont("times", "bold");
                          doc.text("Fournisseur:", 14, 60);
                          doc.setFont("helvetica", "normal");
                          const fournisseur = window.fournisseur.find(f => f.ID === data.FournisseurId);
                          doc.text(`${fournisseur ? fournisseur.Nom_complete : ''}`, 45, 60);

                          doc.setFont("times", "bold");
                          doc.text("Service:", 120, 60);
                          doc.setFont("helvetica", "normal");
                          doc.text(`${data.Service}`, 140, 60);

                          // Prepare table data
                          const tableColumn = [
                              "ID Commande",
                              "Article",
                              "Quantité",
                              "Prix Unitaire",
                              "Montant",
                          ];
                          const tableRows = [];

                          items.forEach(item => {
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
                              didDrawCell: data => {
                                  if (
                                      data.row.index === tableRows.length - 2 ||
                                      data.row.index === tableRows.length - 1
                                  ) {
                                      data.cell.styles.textColor = [251, 131, 7]; // Couleur du texte pour le montant total
                                      data.cell.styles.fontStyle = "bold"; // Mettre le texte en gras
                                  }
                              },
                          });

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
                  },
              ],
          },
      ],
      masterDetail: {
          enabled: true,
          template: function (container, options) {
              $("<div/>").dxDataGrid({
                  dataSource: window.orders.filter(order => order.ReceptionId === options.data.Id),
                  searchPanel: {
                      visible: true,
                      width: 240,
                      placeholder: "Rechercher...",
                  },
                  columns: [
                      {
                          dataField: "CammandeId",
                          caption: "ID commande",
                          editorOptions: { disabled: true },
                      },
                      {
                          dataField: "ArticleId",
                          caption: "Article",
                          lookup: {
                              dataSource: window.articles,
                              displayExpr: "Nom_article",
                              valueExpr: "Nom_article",
                          },
                      },
                      {
                          dataField: "Quantity",
                          caption: "Quantité",
                          dataType: "number",
                          validationRules: [
                              { type: "required", message: "La quantité est requise" },
                              {
                                  type: "range",
                                  min: 1,
                                  message: "La quantité doit être au moins 1",
                              },
                          ],
                      },
                      {
                          dataField: "Price",
                          caption: "Prix",
                          format: { type: "currency", currency: "MAD" },
                          dataType: "number",
                          validationRules: [
                              { type: "required", message: "Le prix est requis" },
                          ],
                      },
                      {
                          dataField: "Amount",
                          caption: "Montant",
                          format: { type: "currency", currency: "MAD" },
                          calculateCellValue: function (data) {
                              return data.Quantity * data.Price;
                          },
                          editorOptions: { disabled: true },
                      },
                  ],
                  showBorders: true,
                  columnAutoWidth: true,
                  height: "auto",
                  editing: {
                      mode: "popup",
                      allowUpdating: true,
                      allowDeleting: true,
                      allowAdding: true,
                      startEditAction: "click",
                  },
                  onRowInserting: function (e) {
                      e.data.CammandeId = Date.now(); // Unique identifier
                      e.data.ReceptionId = options.data.Id;
                      saveDataToServer();
                  },
                  onRowInserted: function (e) {
                      window.orders.push(e.data);
                      var article = window.articles.find(a => a.Nom_article === e.data.Article);
                      if (article) {
                          article.Stock = (article.Stock || 0) + e.data.Quantity;
                      }
                      saveDataToServer();
                  },
                  onRowUpdating: function (e) {
                      $.extend(e.oldData, e.newData);
                      const index = window.orders.findIndex(order => order.CammandeId === e.key);
                      if (index > -1) {
                          window.orders[index] = e.oldData;
                          var article = window.articles.find(a => a.Nom_article === e.oldData.Article);
                          if (article) {
                              article.Stock = (article.Stock || 0) - e.oldData.Quantity + e.newData.Quantity;
                          }
                      }
                      saveDataToServer();
                  },
                  onRowRemoving: function (e) {
                      const index = window.orders.findIndex(order => order.CammandeId === e.key);
                      if (index > -1) {
                          var order = window.orders[index];
                          var article = window.articles.find(a => a.Nom_article === order.Article);
                          if (article) {
                              article.Stock = (article.Stock || 0) - order.Quantity;
                          }
                          window.orders.splice(index, 1);
                      }
                      saveDataToServer();
                  },
              }).appendTo(container);
          },
      },
  });
});
