// =====================================================
// EASTER EGG 1: DIALOGUES CACHÉS SUR ÉLÉMENTS DU DÉCOR
// =====================================================

function initHiddenDialogues() {
  // Éléments interactifs cachés - avec des sélecteurs plus larges pour une meilleure couverture
  const hiddenElements = [
    { 
      selector: '.floating-particle, .cabinet-frame, .glow-effect', 
      quotes: [
        "J'ai passé beaucoup trop de temps à animer ces particules...",
        "Les effets lumineux sont inspirés des néons rétro des années 80."
      ]
    },
    { 
      selector: '.projector-light, .projector-lens, .film-reel', 
      quotes: [
        "Fun fact: ma première expérience avec l'animation était un flipbook à l'âge de 7 ans.",
        "Saviez-vous que les premiers projecteurs de cinéma s'appelaient des Kinétoscopes?"
      ]
    },
    { 
      selector: '.cauldron, .flask-liquid, .lab-equipment', 
      quotes: [
        "Attention, ne pas boire le contenu des fioles virtuelles !",
        "La chimie du code : 1 partie d'inspiration, 2 parties de persévérance."
      ]
    }
  ];

  // Easter eggs spécifiques pour chaque œuvre d'art
  const artworkEasterEggs = {
    'art1': { // Portrait au crayon
      message: "Fun fact: Ce portrait a pris 10 heures de travail avec seulement 3 crayon !"
    },
    'art2': { // Illustration digitale
      message: "Ce personnage apparaîtra dans un webcomic que je développe secrètement..."
    },
    'art3': { // Peinture classique
      message: "La peinture action m'a donné du fil à retordre, mais le résultat en valait la peine !"
    },
    'art4': { // Bouquet en crochet
      message: "Ce bouquet ne fanera jamais !"
    },
    'art5': { // Sculpture
      message: "Le travail d'équipe fais des miracles !"
    }
  };
  
  // Easter eggs spécifiques pour les modèles 3D
  const modelEasterEggs = {
    'model1': { // Personnage 3D
      message: "Ce personnage arrivera très prochainement dans un prochain projet !"
    },
    'model2': { // Lanterne
      message: "Trouver comment faire du bloom avec le compositing render layer c'etait un vrai défi !"
    },
    'model3': { // Katana
      message: "Le deuxième modèle que j'ai fais !"
    },
    'model4': { // Grenouille
      message: "J'apprend blender donc quand j'ai vu que ma v1 faisais 6millions de polygones..."
    },
    'model5': { // Phare
      message: "Peut être q'un petit marin est caché dans la fenêtre du phare qui sait ?"
    }
  };

  // Créer la bulle de dialogue (une seule, réutilisée)
  const dialogBubble = document.createElement('div');
  dialogBubble.className = 'easter-egg-dialogue';
  dialogBubble.style.display = 'none';
  document.body.appendChild(dialogBubble);

  // Fonction pour afficher un message dans la bulle
  function showDialogue(message, element, event) {
    // Positionner et afficher la bulle
    const rect = element.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Ajuster la position pour qu'elle soit visible à l'écran
    const bodyRect = document.body.getBoundingClientRect();
    let topPos, leftPos;
    
    // Si un événement est fourni, utiliser sa position
    if (event) {
      topPos = event.pageY - 80;
      leftPos = event.pageX - 125;
    } else {
      // Sinon, centrer sur l'élément
      topPos = rect.top + scrollTop - 80;
      leftPos = rect.left + rect.width/2 - 125;
    }
    
    // S'assurer que la bulle reste dans les limites de l'écran
    if (leftPos < 10) leftPos = 10;
    if (leftPos > bodyRect.width - 260) leftPos = bodyRect.width - 260;
    if (topPos < 70) topPos = 70;
    
    dialogBubble.textContent = message;
    dialogBubble.style.top = `${topPos}px`;
    dialogBubble.style.left = `${leftPos}px`;
    dialogBubble.style.display = 'block';
    dialogBubble.classList.add('show-dialogue');
    
    // Jouer un son
    if (typeof playSound === 'function') {
      playSound('click');
    }
    
    // Masquer après délai - réduit de 4000ms à 3000ms
    setTimeout(() => {
      dialogBubble.classList.remove('show-dialogue');
      setTimeout(() => {
        dialogBubble.style.display = 'none';
      }, 500);
    }, 3000); // Réduit de 4000ms à 3000ms
  }

  // Ajouter les interactions pour les éléments génériques
  hiddenElements.forEach(element => {
    const targets = document.querySelectorAll(element.selector);
    
    targets.forEach(target => {
      // S'assurer que l'élément est positionné pour l'indicateur
      const currentPosition = window.getComputedStyle(target).position;
      if (currentPosition === 'static') {
        target.style.position = 'relative';
      }
      
      // Ajouter la classe d'easter egg
      target.classList.add('has-secret');
      
      // Créer l'indicateur visuel
      const indicator = document.createElement('span');
      indicator.className = 'secret-indicator';
      indicator.innerHTML = '?';
      target.appendChild(indicator);
      
      // Ajouter gestionnaire de clic UNIQUEMENT sur l'indicateur
      indicator.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêcher la propagation aux parents
        
        // Empêcher les clics multiples pendant l'affichage
        if (dialogBubble.style.display === 'block') return;
        
        // Choisir une citation aléatoire
        const randomQuote = element.quotes[Math.floor(Math.random() * element.quotes.length)];
        showDialogue(randomQuote, target, event);
      });
    });
  });
  
  // Fonction pour appliquer les easter eggs aux éléments
  function applyEasterEggToElement(element, message) {
    if (!element) return;
    
    // S'assurer que l'élément est positionné
    const currentPosition = window.getComputedStyle(element).position;
    if (currentPosition === 'static') {
      element.style.position = 'relative';
    }
    
    // Ajouter la classe d'easter egg
    element.classList.add('has-secret');
    
    // Supprimer un indicateur existant s'il y en a un
    const existingIndicator = element.querySelector('.secret-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    // Créer l'indicateur
    const indicator = document.createElement('span');
    indicator.className = 'secret-indicator';
    indicator.innerHTML = '?';
    
    // Ajustements spéciaux pour certains types d'éléments
    if (element.classList.contains('model-capsule')) {
      // Pour les modèles 3D, rendre l'indicateur TOUJOURS visible
      indicator.style.opacity = '1';
      indicator.style.zIndex = '1000';
      indicator.style.width = '20px';
      indicator.style.height = '20px';
      indicator.style.top = '5px';
      indicator.style.right = '5px';
      indicator.style.fontSize = '14px';
      indicator.style.backgroundColor = 'var(--arcade-accent)';
      indicator.style.animation = 'pulse-glow 1.5s infinite';
      indicator.style.boxShadow = '0 0 10px var(--arcade-accent-glow)';
    }
    
    element.appendChild(indicator);
    
    // Ajouter gestionnaire de clic sur l'indicateur
    indicator.addEventListener('click', (event) => {
      event.stopPropagation(); // Empêcher la propagation aux parents
      if (dialogBubble.style.display === 'block') return;
      showDialogue(message, element, event);
    });
  }
  
  // Appliquer les easter eggs aux œuvres d'art
  function applyArtworkEasterEggs() {
    Object.keys(artworkEasterEggs).forEach(artId => {
      const artwork = document.querySelector(`.artwork[data-id="${artId}"]`);
      if (artwork) {
        applyEasterEggToElement(artwork, artworkEasterEggs[artId].message);
      }
    });
  }
  
  // Fonction spéciale pour appliquer les easter eggs aux modèles 3D
  function applyModelEasterEggs() {
    // Chercher d'abord le conteneur des capsules pour voir s'il est déjà chargé
    const capsuleContainer = document.querySelector('.capsule-container');
    
    Object.keys(modelEasterEggs).forEach(modelId => {
      const modelCapsule = document.querySelector(`.model-capsule[data-id="${modelId}"]`);
      
      if (modelCapsule) {
        // Supprimer tout indicateur existant
        const existingIndicators = modelCapsule.querySelectorAll('.secret-indicator, .model-secret-indicator');
        existingIndicators.forEach(ind => ind.remove());
        
        // Créer un nouvel indicateur avec une position absolue
        const indicator = document.createElement('div');
        indicator.className = 'model-secret-indicator'; // Classe différente pour style spécifique
        indicator.innerHTML = '?';
        
        // Appliquer les styles directement
        indicator.style.position = 'absolute';
        indicator.style.top = '5px';
        indicator.style.right = '5px';
        indicator.style.width = '20px';
        indicator.style.height = '20px';
        indicator.style.backgroundColor = 'var(--arcade-accent)';
        indicator.style.color = 'white';
        indicator.style.borderRadius = '50%';
        indicator.style.display = 'flex';
        indicator.style.justifyContent = 'center';
        indicator.style.alignItems = 'center';
        indicator.style.fontSize = '14px';
        indicator.style.fontWeight = 'bold';
        indicator.style.cursor = 'pointer';
        indicator.style.zIndex = '1000';
        indicator.style.opacity = '1';
        indicator.style.animation = 'pulse-glow 1.5s infinite';
        indicator.style.boxShadow = '0 0 10px var(--arcade-accent-glow)';
        
        // Ajouter au modèle
        modelCapsule.appendChild(indicator);
        
        // Gestionnaire de clic pour l'indicateur
        indicator.addEventListener('click', (event) => {
          event.stopPropagation();
          if (dialogBubble.style.display === 'block') return;
          
          // Assurons-nous que la position est correcte pour les modèles
          showDialogue(modelEasterEggs[modelId].message, modelCapsule, event);
        });
      }
    });
  }
  
  // Appliquer initialement les easter eggs
  applyArtworkEasterEggs();
  
  // Pour les modèles 3D, attendre que tout soit chargé
  setTimeout(applyModelEasterEggs, 1000);
  
  // Vérification périodique pour les modèles 3D (s'ils n'ont pas été chargés immédiatement)
  const checkInterval = setInterval(() => {
    const models = document.querySelectorAll('.model-capsule');
    if (models.length > 0) {
      applyModelEasterEggs();
    }
  }, 2000);
  
  // Arrêter l'intervalle après un certain temps
  setTimeout(() => {
    clearInterval(checkInterval);
  }, 10000); // 10 secondes max
  
  // Observer les changements dans le DOM pour les éléments ajoutés dynamiquement
  const observer = new MutationObserver((mutations) => {
    let shouldApplyArtworkEasterEggs = false;
    let shouldApplyModelEasterEggs = false;
    
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        // Vérifier si des œuvres d'art ou des modèles ont été ajoutés
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Type d'élément
            if (node.classList && (
                node.classList.contains('artwork') || 
                node.querySelector('.artwork')
            )) {
              shouldApplyArtworkEasterEggs = true;
            }
            
            if (node.classList && (
                node.classList.contains('model-capsule') || 
                node.querySelector('.model-capsule') ||
                node.classList.contains('capsule-container') ||
                node.querySelector('.capsule-container')
            )) {
              shouldApplyModelEasterEggs = true;
            }
          }
        });
      }
    });
    
    // Réappliquer les easter eggs si nécessaire
    if (shouldApplyArtworkEasterEggs) {
      applyArtworkEasterEggs();
    }
    
    if (shouldApplyModelEasterEggs) {
      setTimeout(applyModelEasterEggs, 500); // Délai pour s'assurer que tout est rendu
    }
  });
  
  // Observer le corps du document
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Ajouter des styles pour les secrets et la bulle
  const styles = document.createElement('style');
  styles.textContent = `
    .secret-indicator {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 15px;
      height: 15px;
      background-color: var(--arcade-accent);
      color: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: bold;
      opacity: 0;
      z-index: 50;
      transition: opacity 0.3s;
      cursor: pointer;
    }
    
    .has-secret:hover .secret-indicator {
      opacity: 0.9;
      animation: pulse-glow 1.5s infinite;
    }
    
    /* Style spécifique pour les indicateurs des modèles 3D */
    .model-secret-indicator {
      opacity: 1 !important; /* Toujours visible */
      position: absolute;
      z-index: 1000;
      animation: pulse-glow 1.5s infinite;
      width: 15px !important;
      height: 15px !important;
      font-size: 10px !important;
    }
    .easter-egg-dialogue {
      position: absolute;
      background-color: var(--panel-bg);
      border: 2px solid var(--arcade-accent);
      border-radius: 10px;
      padding: 12px 18px;
      width: 250px;
      min-height: 60px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 10px var(--arcade-accent-glow);
      z-index: 1000;
      font-size: 14px;
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.3s, transform 0.3s;
      text-align: center;
      color: white;
    }
    
    /* Style adapté pour le thème clair */
    .sims4-theme .easter-egg-dialogue {
      color: #333;
      background-color: rgba(255, 255, 255, 0.95);
    }
    
    .easter-egg-dialogue::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border-width: 10px;
      border-style: solid;
      border-color: var(--arcade-accent) transparent transparent transparent;
    }
    
    .easter-egg-dialogue.show-dialogue {
      opacity: 1;
      transform: translateY(0);
    }
    
    @keyframes pulse-glow {
      0%, 100% {
        box-shadow: 0 0 5px var(--arcade-accent-glow);
        transform: scale(1);
      }
      50% {
        box-shadow: 0 0 15px var(--arcade-accent-glow);
        transform: scale(1.2);
      }
    }
  `;
  document.head.appendChild(styles);
  
  // Ajouter une notification initiale pour informer l'utilisateur
  setTimeout(() => {
    const notification = document.createElement('div');
    notification.className = 'notification active';
    notification.innerHTML = `
      <div class="notification-header">
        <h4>Easter Eggs Cachés</h4>
        <button class="close-notification">&times;</button>
      </div>
      <div class="notification-content">
        <p>Ce portfolio contient des easter eggs ! Cherchez les éléments avec un "?" et cliquez dessus pour les découvrir.</p>
      </div>
    `;
    
    const container = document.getElementById('notification-container');
    if (container) {
      container.appendChild(notification);
      
      // Fermer la notification
      const closeNotif = notification.querySelector('.close-notification');
      closeNotif.addEventListener('click', () => {
        notification.classList.remove('active');
        setTimeout(() => {
          notification.remove();
        }, 300);
      });
      
      // Auto-fermeture
      setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
          notification.remove();
        }, 300);
      }, 6000);
    }
  }, 5000);
}

// =====================================================
// EASTER EGG 2: JEU SNAKE APRÈS 10 CLICS SUR LE TITRE
// =====================================================

function initTitleClickGame() {
  const arcadeTitle = document.querySelector('.arcade-title');
  
  if (!arcadeTitle) return;
  
  let clickCount = 0;
  let gameActive = false;
  let gameInterval;
  
  arcadeTitle.addEventListener('click', () => {
    if (gameActive) return;
    
    clickCount++;
    
    // Animation visuelle pour chaque clic
    arcadeTitle.style.transform = 'scale(1.1)';
    setTimeout(() => {
      arcadeTitle.style.transform = '';
    }, 200);
    
    // Jouer un son à chaque clic
    if (typeof playSound === 'function') {
      playSound('click');
    }
    
    // Afficher le compteur après 5 clics
    if (clickCount >= 5 && clickCount < 10) {
      const counter = document.createElement('div');
      counter.className = 'click-counter';
      counter.textContent = `${clickCount}/10`;
      counter.style.position = 'absolute';
      counter.style.top = '0';
      counter.style.right = '0';
      counter.style.backgroundColor = 'var(--arcade-accent)';
      counter.style.color = 'white';
      counter.style.padding = '2px 6px';
      counter.style.borderRadius = '10px';
      counter.style.fontSize = '12px';
      counter.style.opacity = '0.8';
      counter.style.transition = 'opacity 0.5s';
      
      // Supprimer les anciens compteurs
      const oldCounters = arcadeTitle.querySelectorAll('.click-counter');
      oldCounters.forEach(old => old.remove());
      
      arcadeTitle.appendChild(counter);
      
      // Faire disparaître le compteur
      setTimeout(() => {
        counter.style.opacity = '0';
        setTimeout(() => {
          counter.remove();
        }, 500);
      }, 1000);
    }
    
    // Si 10 clics atteints, lancer le mini-jeu
    if (clickCount === 10) {
      if (typeof playSound === 'function') {
        playSound('success');
      }
      launchSnakeGame();
      clickCount = 0; // Réinitialiser le compteur
    }
  });
  
  function launchSnakeGame() {
    // Créer le conteneur du jeu
    const gameContainer = document.createElement('div');
    gameContainer.className = 'snake-game-container';
    
    // Ajouter le contenu du jeu
    gameContainer.innerHTML = `
      <div class="snake-game-header">
        <h3>ARCADE SNAKE</h3>
        <div class="snake-game-score">Score: <span id="snake-score">0</span></div>
        <button class="snake-game-close">&times;</button>
      </div>
      <div class="snake-game-area">
        <canvas id="snake-canvas"></canvas>
      </div>
      <div class="snake-game-controls">
        <div>Contrôles: Flèches ← ↑ → ↓ pour diriger le serpent</div>
        <div>Mangez les pixels pour grandir et marquer des points!</div>
      </div>
    `;
    
    document.body.appendChild(gameContainer);
    
    // Afficher le jeu avec animation et initialiser après que le conteneur soit visible
    setTimeout(() => {
      gameContainer.classList.add('show-game');
      
      // Attendre que l'animation soit terminée et que le conteneur soit complètement affiché
      setTimeout(() => {
        // Initialiser le jeu
        gameActive = true;
        const canvas = document.getElementById('snake-canvas');
        const ctx = canvas.getContext('2d');
        const scoreDisplay = document.getElementById('snake-score');
        const closeBtn = gameContainer.querySelector('.snake-game-close');
        
        // Ajuster le canvas à la taille du conteneur maintenant qu'il est visible
        const gameArea = gameContainer.querySelector('.snake-game-area');
        canvas.width = gameArea.clientWidth;
        canvas.height = gameArea.clientHeight;
        
        // Variables du jeu
        const boxSize = 20;
        const canvasWidth = Math.floor(canvas.width / boxSize) * boxSize;
        const canvasHeight = Math.floor(canvas.height / boxSize) * boxSize;
        const gridWidth = canvasWidth / boxSize;
        const gridHeight = canvasHeight / boxSize;
        
        let snake = [
          { x: Math.floor(gridWidth / 2) * boxSize, y: Math.floor(gridHeight / 2) * boxSize }
        ];
        let direction = 'right';
        let nextDirection = 'right';
        let food = {};
        let score = 0;
        let speed = 130; // Milliseconds par mouvement (plus petit = plus rapide)
        let gameOver = false;
        
        // Référencer l'écouteur d'événement pour pouvoir le supprimer plus tard
        const keyDownHandler = function(e) {
          // Empêcher le défilement de la page avec les flèches
          if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
          }
          
          // Changer la direction
          switch (e.key) {
            case 'ArrowUp':
              if (direction !== 'down') nextDirection = 'up';
              break;
            case 'ArrowDown':
              if (direction !== 'up') nextDirection = 'down';
              break;
            case 'ArrowLeft':
              if (direction !== 'right') nextDirection = 'left';
              break;
            case 'ArrowRight':
              if (direction !== 'left') nextDirection = 'right';
              break;
            case 'Escape':
              endGame();
              break;
          }
        };
        
        document.addEventListener('keydown', keyDownHandler);
        
        // Gestionnaire de fermeture
        closeBtn.addEventListener('click', endGame);
        canvas.addEventListener('click', function() {
          if (gameOver) endGame();
        });
        
        function endGame() {
          gameActive = false;
          clearInterval(gameInterval);
          
          // Supprimer les gestionnaires d'événements
          document.removeEventListener('keydown', keyDownHandler);
          
          // Animation de sortie
          gameContainer.classList.remove('show-game');
          
          // Supprimer après l'animation
          setTimeout(() => {
            gameContainer.remove();
          }, 500);
        }
        
        // Générer la nourriture à une position aléatoire
        function createFood() {
          food = {
            x: Math.floor(Math.random() * gridWidth) * boxSize,
            y: Math.floor(Math.random() * gridHeight) * boxSize,
            color: getRandomColor()
          };
          
          // S'assurer que la nourriture n'apparaît pas sur le serpent
          const isOnSnake = snake.some(segment => 
            segment.x === food.x && segment.y === food.y
          );
          
          if (isOnSnake) {
            createFood(); // Récursion pour trouver une position valide
          }
        }
        
        // Obtenir une couleur aléatoire pour la nourriture
        function getRandomColor() {
          const colors = [
            'var(--arcade-blue)',
            'var(--arcade-green)',
            'var(--arcade-yellow)',
            'var(--arcade-red)',
            'var(--arcade-accent)'
          ];
          return colors[Math.floor(Math.random() * colors.length)];
        }
        
        // Dessiner le jeu
        function draw() {
          // Vérification que le canvas est toujours valide
          if (!canvas.getContext) return;
          
          // Effacer le canvas
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Dessiner la grille (facultatif, pour l'esthétique)
          ctx.strokeStyle = '#111';
          ctx.lineWidth = 1;
          for (let i = 0; i < gridWidth; i++) {
            ctx.beginPath();
            ctx.moveTo(i * boxSize, 0);
            ctx.lineTo(i * boxSize, canvasHeight);
            ctx.stroke();
          }
          for (let i = 0; i < gridHeight; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * boxSize);
            ctx.lineTo(canvasWidth, i * boxSize);
            ctx.stroke();
          }
          
          // Dessiner le serpent
          snake.forEach((segment, index) => {
            // Corps du serpent avec gradient de couleur
            const hue = (index * 10) % 360;
            if (index === 0) {
              // Tête du serpent
              ctx.fillStyle = 'var(--arcade-green)';
              ctx.shadowBlur = 10;
              ctx.shadowColor = 'var(--arcade-green-glow)';
            } else {
              // Corps du serpent
              ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
              ctx.shadowBlur = 5;
              ctx.shadowColor = `hsla(${hue}, 100%, 50%, 0.5)`;
            }
            
            ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
            
            // Dessiner des yeux sur la tête
            if (index === 0) {
              ctx.fillStyle = '#fff';
              
              // Position des yeux selon la direction
              let eyeX1, eyeY1, eyeX2, eyeY2;
              switch(direction) {
                case 'up':
                  eyeX1 = segment.x + boxSize / 4;
                  eyeY1 = segment.y + boxSize / 4;
                  eyeX2 = segment.x + boxSize - boxSize / 4;
                  eyeY2 = segment.y + boxSize / 4;
                  break;
                case 'down':
                  eyeX1 = segment.x + boxSize / 4;
                  eyeY1 = segment.y + boxSize - boxSize / 4;
                  eyeX2 = segment.x + boxSize - boxSize / 4;
                  eyeY2 = segment.y + boxSize - boxSize / 4;
                  break;
                case 'left':
                  eyeX1 = segment.x + boxSize / 4;
                  eyeY1 = segment.y + boxSize / 4;
                  eyeX2 = segment.x + boxSize / 4;
                  eyeY2 = segment.y + boxSize - boxSize / 4;
                  break;
                case 'right':
                  eyeX1 = segment.x + boxSize - boxSize / 4;
                  eyeY1 = segment.y + boxSize / 4;
                  eyeX2 = segment.x + boxSize - boxSize / 4;
                  eyeY2 = segment.y + boxSize - boxSize / 4;
                  break;
              }
              
              ctx.beginPath();
              ctx.arc(eyeX1, eyeY1, boxSize / 8, 0, Math.PI * 2);
              ctx.arc(eyeX2, eyeY2, boxSize / 8, 0, Math.PI * 2);
              ctx.fill();
            }
            
            // Réinitialiser l'ombre
            ctx.shadowBlur = 0;
          });
          
          //// Dessiner la nourriture
          ctx.fillStyle = food.color;
          ctx.shadowBlur = 15;
          ctx.shadowColor = food.color;
          ctx.fillRect(food.x, food.y, boxSize, boxSize);
          ctx.shadowBlur = 0;
          
          // Dessiner notification de Game Over
          if (gameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = '30px var(--arcade-font), monospace';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'var(--arcade-red)';
            ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
            
            ctx.font = '18px var(--primary-font), sans-serif';
            ctx.fillStyle = 'white';
            ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
            
            ctx.font = '14px var(--primary-font), sans-serif';
            ctx.fillText('Cliquez pour fermer', canvas.width / 2, canvas.height / 2 + 60);
          }
        }
        
        // Mettre à jour le jeu
        function update() {
          if (gameOver) return;
          
          // Mettre à jour la direction
          direction = nextDirection;
          
          // Calculer la nouvelle position de la tête
          const head = { ...snake[0] };
          
          switch (direction) {
            case 'up':
              head.y -= boxSize;
              break;
            case 'down':
              head.y += boxSize;
              break;
            case 'left':
              head.x -= boxSize;
              break;
            case 'right':
              head.x += boxSize;
              break;
          }
          
          // Vérifier la collision avec les murs
          if (
            head.x < 0 || 
            head.x >= canvasWidth || 
            head.y < 0 || 
            head.y >= canvasHeight
          ) {
            gameOver = true;
            return;
          }
          
          // Vérifier la collision avec soi-même
          for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
              gameOver = true;
              return;
            }
          }
          
          // Vérifier la collision avec la nourriture
          const ateFood = head.x === food.x && head.y === food.y;
          
          if (ateFood) {
            // Augmenter le score
            score += 10;
            scoreDisplay.textContent = score;
            
            // Jouer un son
            if (typeof playSound === 'function') {
              playSound('success');
            }
            
            // Créer une nouvelle nourriture
            createFood();
            
            // Augmenter la vitesse tous les 5 fruits (jusqu'à une limite)
            if (score % 50 === 0 && speed > 50) {
              speed -= 10;
            }
          } else {
            // Si pas de nourriture mangée, enlever la queue
            snake.pop();
          }
          
          // Ajouter la nouvelle tête
          snake.unshift(head);
        }
        
        // Initialiser le jeu
        createFood();
        
        // Boucle principale du jeu
        function gameLoop() {
          update();
          draw();
        }
        
        // S'assurer que le canvas est prêt avant de démarrer la boucle de jeu
        requestAnimationFrame(() => {
          // Démarrer la boucle de jeu
          gameInterval = setInterval(gameLoop, speed);
          
          // Initial draw
          draw();
        });
      }, 300); // Attendre 300ms que l'animation d'affichage soit terminée
    }, 10);
    
    // Ajouter styles pour le jeu
    const gameStyles = document.createElement('style');
    gameStyles.textContent = `
      .snake-game-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        width: 90%;
        max-width: 600px;
        height: 70vh;
        max-height: 600px;
        background-color: var(--panel-bg);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.5), 0 0 20px var(--arcade-green-glow);
        border: 2px solid var(--arcade-green);
        display: flex;
        flex-direction: column;
        z-index: 1000;
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s;
      }
      
      .snake-game-container.show-game {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
      
      .snake-game-header {
        background: linear-gradient(90deg, var(--arcade-green), #00b36b);
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .snake-game-header h3 {
        margin: 0;
        color: black;
        font-family: var(--arcade-font);
        font-size: 16px;
      }
      
      .snake-game-score {
        color: black;
        font-weight: bold;
      }
      
      .snake-game-close {
        background: none;
        border: none;
        color: black;
        font-size: 24px;
        cursor: pointer;
      }
      
      .snake-game-area {
        flex: 1;
        background-color: #000;
        position: relative;
        overflow: hidden;
        border-bottom: 1px solid var(--arcade-green);
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      #snake-canvas {
        background-color: #000;
        display: block;
        width: 100%;
        height: 100%;
      }
      
      .snake-game-controls {
        padding: 15px;
        text-align: center;
        font-size: 12px;
        background-color: rgba(0, 0, 0, 0.3);
        color: var(--arcade-light);
      }
      
      /* Adapter les textes pour le thème clair */
      .sims4-theme .snake-game-controls {
        background-color: rgba(0, 0, 0, 0.1);
        color: #333;
      }
      
      @media (max-width: 768px) {
        .snake-game-container {
          width: 95%;
          height: 60vh;
        }
      }
    `;
    document.head.appendChild(gameStyles);
  }
}

// Initialiser les easter eggs
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    initHiddenDialogues();
    initTitleClickGame();
  }, 2000); // Délai pour s'assurer que tout est chargé
});