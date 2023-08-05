// No seu arquivo JavaScript
const installButton = document.getElementById('install-button');

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  const deferredPrompt = event;
  
  installButton.addEventListener('click', () => {
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
});
