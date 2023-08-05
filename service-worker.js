// No seu arquivo JavaScript
const installButton = document.getElementById('install-button');
const dismissButton = document.getElementById('dismiss-button');
const installPopup = document.getElementById('install-popup');

let deferredPrompt;

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;

  // Exibe o pop-up para lembrar o usuário de instalar o PWA
  installPopup.style.display = 'block';
});

// Evento para o botão "Instalar" no pop-up
installButton.addEventListener('click', () => {
  installPopup.style.display = 'none';
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(choiceResult => {
    if (choiceResult.outcome === 'accepted') {
      console.log('O usuário aceitou a instalação do PWA');
    } else {
      console.log('O usuário recusou a instalação do PWA');
    }
    deferredPrompt = null;
  });
});

// Evento para o botão "Fechar" no pop-up
dismissButton.addEventListener('click', () => {
  installPopup.style.display = 'none';
});
