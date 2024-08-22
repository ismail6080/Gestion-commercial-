const users = [
    { username: 'ADMIN', password: '12345', role: 'admin', redirectUrl: 'fournisseur.html' },
    { username: 'G_VENTE', password: 'GV12345', role: 'gestionnaire_vente', redirectUrl: 'fournisseur.html' },
    { username: 'G_RECEPTION', password: 'GR12345', role: 'gestionnaire_reception', redirectUrl: 'fournisseur.html' },
  ];
const menuDataAdmin = [
    {
      text: '',
      html: '<img src="img/logo.png" alt="Home" style="width: 90px; height: 24px;">',
      items: []
    },
    {
      text: 'Fournisseur',
      icon: 'fa fa-truck',
      items: []
    },
    {
      text: 'Client',
      icon: 'user',
      items: []
    },
    {
      text: 'Article',
      icon: 'box',
      items: []
    },
    {
      text: 'F_Article',
      icon: 'fas fa-sitemap',
      items: []
    },
    {
      text: 'Réception',
      icon: 'fas fa-box-open',
      items: []
    },
    {
      text: 'Vente',
      icon: 'fas fa-shopping-cart',
      items: []
    },
    {
      text: 'Facturation',
      icon: 'fa fa-file',
      items: [
        { text: 'Réception de Facturation', icon: 'fas fa-box-open', items: [] },
        { text: 'Vente de Facturation', icon: 'fas fa-shopping-cart', items: [] },
      ]
    },
    {
      text: 'Notifications',
      icon: 'fas fa-bell',
      items: []
    },
    {
      text: 'Déconnexion',
      icon: 'fas fa-sign-out-alt',
      items: []
    }
  ];
  
  const menuDataVente = [
    {
      text: '',
      html: '<img src="img/logo.png" alt="Home" style="width: 90px; height: 24px;">',
      items: []
    },
    {
      text: 'Vente',
      icon: 'fas fa-shopping-cart',
      items: []
    },
    {
      text: 'Facturation',
      icon: 'fa fa-file',
      items: [
        { text: 'Vente de Facturation', icon: 'fas fa-shopping-cart', items: [] },
      ]
    },
    {
      text: 'Notifications',
      icon: 'fas fa-bell',
      items: []
    },
    {
      text: 'Déconnexion',
      icon: 'fas fa-sign-out-alt',
      items: []
    }
  ];
  
  const menuDataReception = [
    {
      text: '',
      html: '<img src="img/logo.png" alt="Home" style="width: 90px; height: 24px;">',
      items: []
    },
    {
      text: 'Réception',
      icon: 'fas fa-box-open',
      items: []
    },
    {
      text: 'Facturation',
      icon: 'fa fa-file',
      items: [
        { text: 'Réception de Facturation', icon: 'fas fa-box-open', items: [] },
      ]
    },
    {
      text: 'Notifications',
      icon: 'fas fa-bell',
      items: []
    },
    {
      text: 'Déconnexion',
      icon: 'fas fa-sign-out-alt',
      items: []
    }
  ];
  