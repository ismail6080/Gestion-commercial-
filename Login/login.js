$(() => {

  const formWidget = $('#form').dxForm({
    formData: {},
    items: [{
      itemType: 'group',
      caption: 'Connexion',
      items: [{
        dataField: 'Username',
        editorType: 'dxTextBox',
        editorOptions: {
          placeholder: 'Nom d’utilisateur',
        },
        validationRules: [{
          type: 'required',
          message: 'Le nom d’utilisateur est requis',
        }],
      }, {
        dataField: 'Password',
        editorType: 'dxTextBox',
        editorOptions: {
          mode: 'password',
          placeholder: 'Mot de passe',
          valueChangeEvent: 'keyup',
          buttons: [{
            name: 'togglePassword',
            location: 'after',
            options: {
              icon: 'fa fa-eye', // Icône par défaut pour afficher le mot de passe
              stylingMode: 'text',
              onClick: () => togglePasswordVisibility('Password'),
            },
          }],
        },
        validationRules: [{
          type: 'required',
          message: 'Le mot de passe est requis',
        }],
      }],
    }],
    colCount: 1,
    labelLocation: 'top',
    showValidationSummary: true,
  }).dxForm('instance');

  $('#buttonContainer').dxButton({
    text: 'Se Connecter',
    type: 'default',
    stylingMode: 'contained',
    onClick: function() {
      $('#loginForm').submit();
    }
  });

  $('#loginForm').on('submit', (e) => {
    e.preventDefault();

    const formData = formWidget.option('formData');
    const { Username, Password } = formData;

    let redirectUrl = '';

    const user = users.find(u => u.username === Username && u.password === Password);

    if (user) {
      // Redirection vers l'URL appropriée selon l'utilisateur
      localStorage.setItem('menuData', JSON.stringify(user.role === 'admin' ? menuDataAdmin : user.role === 'gestionnaire_vente' ? menuDataVente : menuDataReception));
      window.location.href = user.redirectUrl;
    } else {
      DevExpress.ui.notify({
        message: 'Nom d’utilisateur ou mot de passe invalide',
        position: {
          my: 'center top',
          at: 'center top',
        },
      }, 'error', 3000);
    }
  });

  function togglePasswordVisibility(dataField) {
    const editor = formWidget.getEditor(dataField);
    const currentMode = editor.option('mode');
    const newMode = currentMode === 'password' ? 'text' : 'password';
    editor.option('mode', newMode);

    // Sélectionnez le bouton d'icône pour mettre à jour l'icône manuellement
    const button = editor.element().find('.dx-button').eq(0);
    const newIconClass = newMode === 'password' ? 'fa fa-eye' : 'fa fa-eye-slash';

    // Retirez l'ancienne classe d'icône et ajoutez la nouvelle
    button.find('i').removeClass().addClass(newIconClass);
  }
});
