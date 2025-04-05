// =====================================================
// EASTER EGG 1: DIALOGUES CACHÉS SUR ÉLÉMENTS DU DÉCOR
// =====================================================

function initHiddenDialogues() {
  // Éléments interactifs cachés - avec des sélecteurs plus larges pour une meilleure couverture
  const hiddenElements = [
    { 
      selector: '.neon-sign, .machine-preview img, .arcade-machines h3', 
      quotes: [
        "La créativité, c'est l'intelligence qui s'amuse !",
        "Le code est poésie, un bug est juste une rime inattendue."
      ]
    },
    { 
      selector: '.floating-particle, .cabinet-frame, .glow-effect', 
      quotes: [
        "J'ai passé beaucoup trop de temps à animer ces particules...",
      ]
    },
    { 
      selector: '.projector-light, .projector-lens, .film-reel', 
      quotes: [
        "Fun fact: ma première expérience avec l'animation était un flipbook à l'âge de 7 ans."
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

  // Créer la bulle de dialogue (une seule, réutilisée)
  const dialogBubble = document.createElement('div');
  dialogBubble.className = 'easter-egg-dialogue';
  dialogBubble.style.display = 'none';
  document.body.appendChild(dialogBubble);

  // Ajouter les interactions
  hiddenElements.forEach(element => {
    const targets = document.querySelectorAll(element.selector);
    
    targets.forEach(target => {
      // S'assurer que l'élément est positionné (pour l'indicateur visuel)
      const currentPosition = window.getComputedStyle(target).position;
      if (currentPosition === 'static') {
        target.style.position = 'relative';
      }
      
      // Ajouter indice visuel plus visible (classe + indicateur)
      target.classList.add('has-secret');
      
      // Créer un indicateur visuel distinct pour chaque élément secret
      const indicator = document.createElement('span');
      indicator.className = 'secret-indicator';
      indicator.innerHTML = '?';
      target.appendChild(indicator);
      
      // Ajouter gestionnaire de clic
      target.addEventListener('click', (event) => {
        // Empêcher les clics multiples pendant l'affichage
        if (dialogBubble.style.display === 'block') return;
        
        // Choisir une citation aléatoire
        const randomQuote = element.quotes[Math.floor(Math.random() * element.quotes.length)];
        
        // Positionner et afficher la bulle
        dialogBubble.textContent = randomQuote;
        
        // Ajuster la position pour qu'elle soit visible à l'écran
        const bodyRect = document.body.getBoundingClientRect();
        let topPos = event.pageY - 80;
        let leftPos = event.pageX - 125;
        
        // S'assurer que la bulle reste dans les limites de l'écran
        if (leftPos < 10) leftPos = 10;
        if (leftPos > bodyRect.width - 260) leftPos = bodyRect.width - 260;
        if (topPos < 70) topPos = 70;
        
        dialogBubble.style.top = `${topPos}px`;
        dialogBubble.style.left = `${leftPos}px`;
        dialogBubble.style.display = 'block';
        dialogBubble.classList.add('show-dialogue');
        
        // Jouer un son
        if (typeof playSound === 'function') {
          playSound('click');
        }
        
        // Masquer après délai
        setTimeout(() => {
          dialogBubble.classList.remove('show-dialogue');
          setTimeout(() => {
            dialogBubble.style.display = 'none';
          }, 500);
        }, 4000);
      });
    });
  });
  
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
      z-index: 10;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    
    .has-secret {
      cursor: pointer;
    }
    
    .has-secret:hover .secret-indicator {
      opacity: 0.7;
      animation: pulse-glow 1.5s infinite;
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
        <p>Ce portfolio contient des easter eggs ! Cherchez les éléments avec un "?" et cliquez pour les découvrir.</p>
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
          
          // Dessiner la nourriture
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