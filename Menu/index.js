$(() => {
  const SUBMENU_HEIGHT = 100;
  let submenuMaxHeight = 0;

  $('#menu').dxMenu({
    dataSource: menuData,
    adaptivityEnabled: false,
    width: 200, // Ajustez la largeur ici pour permettre une meilleure visibilité
    hideSubmenuOnMouseLeave: false,
    onSubmenuShowing: ({ submenuContainer }) => {
      $(submenuContainer).css('maxHeight', submenuMaxHeight || '');
    },
    onItemClick(e) {
      if (e.itemData.text) {
        function loadScript(scriptSrc) {
          DevExpress.ui.notify(`L'élément "${e.itemData.text}" a été cliqué`, 'success', 1500);
          $('script.gridContainerjs').remove(); 
          $(".move-button ,#gridContainer2,#BtnSelect").css({
            'display': 'none',
        });
          $('head').append(`<script class='gridContainerjs' src='${scriptSrc}'></script>`); // Ajouter le nouveau script
        }

        switch (e.itemData.text) {
          case "Home":
            // Action pour "Home"
            break;
          case "Fournisseur":
            loadScript('js2/fournisseur.js');
            break;
          case "Client":
            loadScript('js2/client.js');
            break;
          case "Article":
            loadScript('js2/article.js');
            break;
          case "F_Article":
            loadScript('js2/farticle.js');
            break;
          case "Réception":
            loadScript('js2/reception.js'); 
            break;
          case "Vente":
            loadScript('js2/vente.js');
            break;
          case "Notifications":
            loadScript('js2/popup.js');
            break;
          case "Réception de Facturation":
            loadScript('js2/FacturationRec.js');
            break;
          case "Vente de Facturation":
            loadScript('js2/FcturationVen.js');
            break;
          case "Facturation":
            break;
          case "Déconnexion":
            localStorage.removeItem('menuData'); 
            window.location.href = 'login.html'; 
            break;
          default:
            console.log(`No action defined for ${e.itemData.text}`);
            break;
        }
      }
    }
  }).dxMenu('instance');
});
