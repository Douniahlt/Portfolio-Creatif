// Script principal pour le portfolio arcade
document.addEventListener('DOMContentLoaded', () => {
  // Simulation de l'écran de chargement
  simulateLoading();

  // Initialiser le monde interactif
  initArcadeWorld();

  // Initialiser le personnage info (style Sims) - élément conservé
  initCharacterInfo();

  // Initialiser les machines/installations interactives
  initClaw(); // Machine à pince pour modèles 3D
  initGallery(); // Galerie d'art interactive
  initArcadeMachine(); // Borne d'arcade pour jeux
  initProjector(); // Projecteur pour scènes Unreal
  initLab(); // Laboratoire pour démos GL4D

  // Configurer l'audio
  setupAudio();
});

// Écran de chargement
function simulateLoading() {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingTips = [
      "Astuce : Attrape des modèles 3D avec la machine à pince !",
      "Astuce : Utilise la lampe torche pour explorer mes dessins dans la galerie.",
      "Astuce : Essaie de mélanger différentes fioles dans le laboratoire !",
      "Astuce : Tourne la manivelle du projecteur pour voir mes scènes Unreal.",
      "Astuce : Clique sur le plumbob vert pour en savoir plus sur moi."
  ];

  // Afficher un conseil aléatoire
  const randomTip = loadingTips[Math.floor(Math.random() * loadingTips.length)];
  document.querySelector('.loading-tips').textContent = randomTip;

  // Simuler le chargement
  setTimeout(() => {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.transition = 'opacity 1s ease-in-out';
      setTimeout(() => {
          loadingScreen.style.display = 'none';
      }, 1000);
  }, 3000);
}

// Initialisation du monde interactif (salle d'arcade/parc)
function initArcadeWorld() {
  const arcadeWorld = document.getElementById('arcade-world');
  
  // Ajouter des éléments décoratifs (néons, particules, etc.)
  addDecorations(arcadeWorld);
  
  // Ajouter système de navigation entre les zones
  setupNavigation();
  
  // Initialiser les points d'intérêt cliquables
  initSpots();
}

// Ajouter décorations à l'arrière-plan
function addDecorations(container) {
  // Les décorations sont déjà dans le HTML, mais on peut ajouter des comportements ici
  const neonSign = document.querySelector('.neon-sign');
  if (neonSign) {
      // Animation spéciale au survol
      neonSign.addEventListener('mouseover', () => {
          neonSign.style.animation = 'none';
          neonSign.style.textShadow = '0 0 20px var(--arcade-accent-glow), 0 0 30px var(--arcade-accent-glow)';
          
          setTimeout(() => {
              neonSign.style.animation = 'neon-flicker 2s infinite';
              neonSign.style.textShadow = '';
          }, 500);
      });
  }
}

// Fonction pour initialiser le toggle de thème
function initThemeToggle() {
    // Créer le bouton de bascule de thème
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Icône de soleil par défaut (pour basculer en mode jour)
    themeToggle.setAttribute('title', 'Changer de thème (Jour/Nuit)');
    document.body.appendChild(themeToggle);
    
    // Vérifier si un thème est déjà enregistré dans le localStorage
    const savedTheme = localStorage.getItem('arcade-theme');
    
    // Si le thème sauvegardé est 'sims4', on l'applique, sinon on reste en mode sombre par défaut
    if (savedTheme === 'sims4') {
      document.body.classList.add('sims4-theme');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Icône de lune pour le thème jour
    }
    
    // Ajouter l'événement de clic pour basculer entre les thèmes
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('sims4-theme');
      
      // Mettre à jour l'icône et sauvegarder la préférence
      if (document.body.classList.contains('sims4-theme')) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Icône de lune pour revenir au thème nuit
        localStorage.setItem('arcade-theme', 'sims4');
      } else {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Icône de soleil pour passer au thème jour
        localStorage.setItem('arcade-theme', 'dark');
      }
      
      // Jouer un son si la fonction existe
      if (typeof playSound === 'function') {
        playSound('click');
      }
    });
    
    // Ajouter une animation pour attirer l'attention sur le bouton au chargement initial
    setTimeout(() => {
      themeToggle.classList.add('attention');
      setTimeout(() => {
        themeToggle.classList.remove('attention');
      }, 3000);
    }, 5000); // Délai pour que l'utilisateur remarque le bouton après 5 secondes
  }
  
  // Ajouter l'initialisation du toggle de thème au chargement du document
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
  });

// Initialisation des points d'intérêt cliquables
function initSpots() {
  const spots = document.querySelectorAll('.arcade-machine-spot');
  
  spots.forEach(spot => {
      spot.addEventListener('click', () => {
          const zoneId = spot.getAttribute('data-zone');
          navigateToZone(zoneId);
          playSound('transition');
      });
  });
}

// Navigation entre les zones
function setupNavigation() {
  const mapBtn = document.getElementById('map-btn');
  const mapOverlay = document.getElementById('map-overlay');
  const mapClose = document.querySelector('.map-close');
  
  // Afficher/masquer la carte
  if (mapBtn && mapOverlay) {
      mapBtn.addEventListener('click', () => {
          mapOverlay.classList.toggle('hidden');
          playSound('click');
      });
      
      if (mapClose) {
          mapClose.addEventListener('click', () => {
              mapOverlay.classList.add('hidden');
              playSound('click');
          });
      }
  }
  
  // Navigation via la carte
  const hotspots = document.querySelectorAll('.map-hotspot');
  hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', () => {
          const zoneId = hotspot.getAttribute('data-zone');
          navigateToZone(zoneId);
          mapOverlay.classList.add('hidden');
          playSound('transition');
      });
  });
  
  // Navigation via les boutons retour
  const backBtns = document.querySelectorAll('.back-btn');
  backBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          const zoneId = btn.getAttribute('data-zone');
          navigateToZone(zoneId);
          playSound('click');
      });
  });
}

// Fonction pour naviguer entre les zones
function navigateToZone(zoneId) {
  // Masquer toutes les zones
  const zones = document.querySelectorAll('.zone, .arcade-hall');
  zones.forEach(zone => {
      zone.classList.add('hidden');
  });
  
  // Afficher l'animation de transition
  const transition = document.getElementById('zone-transition');
  transition.classList.remove('hidden');
  
  // Après l'animation, afficher la zone désirée
  setTimeout(() => {
      transition.classList.add('hidden');
      const targetZone = document.getElementById(zoneId);
      if (targetZone) {
          targetZone.classList.remove('hidden');
      } else if (zoneId === 'arcade-hall') {
          document.querySelector('.arcade-hall').classList.remove('hidden');
      }
  }, 1000);
}

// Personnage d'info style Sims
function initCharacterInfo() {
  const character = document.getElementById('character-info');
  
  if (!character) return;
  
  // Ajouter le plumbob au-dessus du personnage
  const plumbob = document.createElement('div');
  plumbob.className = 'plumbob';
  character.appendChild(plumbob);
  
  // Ajouter l'avatar
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.innerHTML = `<img src="img/avatar.png" alt="Mon avatar" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\'><rect width=\'60\' height=\'60\' fill=\'%2354CF45\'/><text x=\'50%\' y=\'50%\' font-size=\'18\' text-anchor=\'middle\' fill=\'white\' font-family=\'Arial\'>ATI</text></svg>'">`; 
  character.appendChild(avatar);
  
  // Panneau d'information détaillé (caché par défaut)
  const infoPanel = document.createElement('div');
  infoPanel.className = 'info-panel hidden';
  infoPanel.innerHTML = `
      <div class="info-header">
          <h3>Dounia Hullot</h3>
          <button class="close-btn">&times;</button>
      </div>
      <div class="info-content">
          <div class="info-section">
              <div class="info-avatar">
                  <img src="img/avatar.png" alt="Mon avatar" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'><rect width=\'100\' height=\'100\' fill=\'%2354CF45\'/><text x=\'50%\' y=\'50%\' font-size=\'24\' text-anchor=\'middle\' fill=\'white\' font-family=\'Arial\'>ATI</text></svg>'">
              </div>
              <div class="info-details">
                  <div class="info-title">Étudiante informatique</div>
                  <div class="info-bio">
                      Passionnée par l'art numérique et le développement de jeux. 
                      Je souhaite intégrer la L3 ATI à Paris 8 pour approfondir mes connaissances 
                      en création numérique et interactive.
                  </div>
              </div>
          </div>
          
          <div class="info-skills">
              <h4>Mes Compétences</h4>
              <div class="skill">
                  <div class="skill-name">
                      <span>3D (Blender)</span>

                  </div>
                  <div class="skill-bar">
                      <div class="skill-progress" data-skill="30"></div>
                  </div>
              </div>
              
              <div class="skill">
                  <div class="skill-name">
                      <span>Dessin</span>
                  </div>
                  <div class="skill-bar">
                      <div class="skill-progress" data-skill="50"></div>
                  </div>
              </div>
              
              <div class="skill">
                  <div class="skill-name">
                      <span>Développement</span>
                  </div>
                  <div class="skill-bar">
                      <div class="skill-progress" data-skill="90"></div>
                  </div>
              </div>
              
              <div class="skill">
                  <div class="skill-name">
                      <span>Game Design</span>
                  </div>
                  <div class="skill-bar">
                      <div class="skill-progress" data-skill="40"></div>
                  </div>
              </div>
          </div>
          
          <div class="info-traits">
              <h4>Traits</h4>
              <ul class="traits-list">
                  <li class="trait">Créative</li>
                  <li class="trait">Curieuse</li>
                  <li class="trait">Persévérante</li>
              </ul>
          </div>
          
          <div class="info-contacts" style="margin-top: 20px; text-align: center;">
              <h4 style="color: var(--arcade-accent); text-shadow: 0 0 8px var(--arcade-accent-glow); margin-bottom: 15px;">Contact</h4>
              <p>dounia.hullot@gmail.com</p>
              <div style="margin-top: 10px;">
                  <a href="https://www.linkedin.com/in/dounia-hullot-a6025a223/" style="color: var(--arcade-blue); text-decoration: none; margin: 0 10px;">LinkedIn</a>
                  <a href="https://github.com/Douniahlt" style="color: var(--arcade-green); text-decoration: none; margin: 0 10px;">GitHub</a>
                  <a href="https://www.instagram.com/_aka.art._/" style="color: var(--arcade-yellow); text-decoration: none; margin: 0 10px;">Instagram</a>
              </div>
          </div>
      </div>
  `;
  document.body.appendChild(infoPanel);
  
  // Afficher le panneau au clic sur le personnage
  character.addEventListener('click', () => {
      infoPanel.classList.remove('hidden');
      animateSkillBars();
      playSound('click');
  });
  
  // Fermer le panneau
  const closeBtn = infoPanel.querySelector('.close-btn');
  if (closeBtn) {
      closeBtn.addEventListener('click', () => {
          infoPanel.classList.add('hidden');
          playSound('click');
      });
  }
  
  // Animer les barres de compétences
  function animateSkillBars() {
      const skillBars = document.querySelectorAll('.skill-progress');
      
      setTimeout(() => {
          skillBars.forEach(bar => {
              const skill = bar.getAttribute('data-skill') || '0';
              bar.style.width = `${skill}%`;
          });
      }, 300);
  }
}

// Configuration audio
function setupAudio() {
  const backgroundMusic = document.getElementById('background-music');
  const audioControl = document.getElementById('audio-control');
  
  if (!backgroundMusic || !audioControl) return;
  
  // Définir le volume et état initial
  backgroundMusic.volume = 0.3;
  let isMuted = true;
  backgroundMusic.muted = isMuted;
  
  // Afficher l'état initial
  if (isMuted) {
      audioControl.classList.add('muted');
      audioControl.querySelector('i').className = 'fas fa-volume-mute';
  }
  
  // Toggle audio
  audioControl.addEventListener('click', () => {
      isMuted = !isMuted;
      backgroundMusic.muted = isMuted;
      
      if (isMuted) {
          audioControl.classList.add('muted');
          audioControl.querySelector('i').className = 'fas fa-volume-mute';
      } else {
          audioControl.classList.remove('muted');
          audioControl.querySelector('i').className = 'fas fa-volume-up';
          
          // Essayer de jouer la musique
          backgroundMusic.play().catch(e => console.log('Autoplay bloqué:', e));
      }
      
      playSound('click');
  });
}

// Fonction pour jouer des sons
function playSound(type) {
  let sound;
  switch (type) {
      case 'click':
          sound = document.getElementById('click-sound');
          break;
      case 'success':
          sound = document.getElementById('success-sound');
          break;
      case 'transition':
          sound = document.getElementById('transition-sound');
          break;
      default:
          return;
  }
  
  if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Erreur de lecture audio:', e));
  }
}

// Machine à pince pour modèles 3D

function initClaw() {
    const clawMachine = document.getElementById('claw-machine');
    
    if (!clawMachine) return;
    
    const claw = document.getElementById('claw');
    const capsules = document.querySelectorAll('.model-capsule');
    const upBtn = document.getElementById('up-btn');
    const downBtn = document.getElementById('down-btn');
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const grabBtn = document.getElementById('grab-btn');
    
    if (!claw || !upBtn || !downBtn || !leftBtn || !rightBtn || !grabBtn) return;
    
    // Position initiale
    let clawX = 50; // %
    let clawY = 30; // Changé de 20% à 30% pour être plus bas initialement
    let isGrabbing = false;
    let selectedModel = null;
    
    // Mise à jour de la position de la pince
    function updateClawPosition() {
        claw.style.left = `${clawX}%`;
        claw.style.top = `${clawY}%`;
    }
    
    // Déplacer la pince avec les flèches du clavier
    document.addEventListener('keydown', (e) => {
        if (clawMachine.classList.contains('hidden') || isGrabbing) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                clawX = Math.max(10, clawX - 2);
                break;
            case 'ArrowRight':
                clawX = Math.min(90, clawX + 2);
                break;
            case 'ArrowUp':
                clawY = Math.max(10, clawY - 2);
                break;
            case 'ArrowDown':
                clawY = Math.min(80, clawY + 2); // Augmenté de 70% à 80% pour permettre à la pince de descendre plus bas
                break;
            case ' ': // Espace pour attraper
                grabModel();
                break;
        }
        updateClawPosition();
    });
    
    // Contrôles tactiles - ajustés pour permettre un meilleur mouvement
    upBtn.addEventListener('click', () => {
        if (isGrabbing) return;
        clawY = Math.max(10, clawY - 5);
        updateClawPosition();
        playSound('click');
    });
    
    downBtn.addEventListener('click', () => {
        if (isGrabbing) return;
        clawY = Math.min(80, clawY + 5); // Augmenté pour permettre à la pince de descendre plus bas
        updateClawPosition();
        playSound('click');
    });
    
    leftBtn.addEventListener('click', () => {
        if (isGrabbing) return;
        clawX = Math.max(10, clawX - 5);
        updateClawPosition();
        playSound('click');
    });
    
    rightBtn.addEventListener('click', () => {
        if (isGrabbing) return;
        clawX = Math.min(90, clawX + 5);
        updateClawPosition();
        playSound('click');
    });
    
    grabBtn.addEventListener('click', grabModel);
    
    function grabModel() {
        if (isGrabbing) return;
        
        isGrabbing = true;
        claw.classList.add('grabbing');
        playSound('click');
        
        // Animation de descente - augmentée pour aller plus bas
        let grabY = clawY;
        const grabInterval = setInterval(() => {
            grabY += 2;
            claw.style.top = `${grabY}%`;
            
            // Vérifier si la pince touche une capsule
            for (const capsule of capsules) {
                const rect1 = claw.getBoundingClientRect();
                const rect2 = capsule.getBoundingClientRect();
                
                // Élargissement léger de la zone de détection pour faciliter la prise
                if (rect1.left < rect2.right + 5 && 
                    rect1.right > rect2.left - 5 && 
                    rect1.top < rect2.bottom + 5 && 
                    rect1.bottom > rect2.top - 5) {
                    
                    clearInterval(grabInterval);
                    selectedModel = capsule.getAttribute('data-id');
                    capsule.classList.add('grabbed');
                    
                    // Attacher la capsule à la pince
                    setTimeout(() => {
                        capsule.style.position = 'absolute';
                        capsule.style.left = `${clawX}%`;
                        capsule.style.top = `${grabY}%`;
                        
                        // Remonter la pince avec la capsule
                        const upInterval = setInterval(() => {
                            grabY -= 2;
                            claw.style.top = `${grabY}%`;
                            capsule.style.top = `${grabY + 10}%`;
                            
                            if (grabY <= 20) {
                                clearInterval(upInterval);
                                showModelDetails(selectedModel);
                                playSound('success');
                                
                                // Réinitialiser après un certain temps
                                setTimeout(() => {
                                    isGrabbing = false;
                                    claw.classList.remove('grabbing');
                                    capsule.classList.remove('grabbed');
                                    capsule.style.position = '';
                                    resetCapsulePositions();
                                }, 3000);
                            }
                        }, 50);
                    }, 500);
                    
                    return;
                }
            }
            
            // Si rien n'est attrapé après une certaine distance
            if (grabY >= 85) { // Augmenté de 70% à 85% pour s'assurer que la pince descend assez bas
                clearInterval(grabInterval);
                
                // Remonter la pince vide
                const upInterval = setInterval(() => {
                    grabY -= 2;
                    claw.style.top = `${grabY}%`;
                    
                    if (grabY <= clawY) {
                        clearInterval(upInterval);
                        isGrabbing = false;
                        claw.classList.remove('grabbing');
                    }
                }, 50);
            }
        }, 50);
    }
    
    // Repositionner les capsules - ajusté pour les rendre plus accessibles
    function resetCapsulePositions() {
        capsules.forEach(capsule => {
            capsule.style = '';
        });
    }
    
    
    function showModelDetails(modelId) {
        // Données des modèles 3D
        const models3D = [
            { id: 'model1', name: 'Personnage 3D', model: 'models/personnage.glb', description: 'Personnage stylisé à venir', author: 'Moi' },
            { id: 'model2', name: 'Objet 3D', model: 'models/lenterne.glb', description: 'Lanterne', author: 'Moi' },
            { id: 'model3', name: 'Objet 3D', model: 'models/katana.glb', description: 'Katana', author: 'Moi' },
            { id: 'model4', name: 'Animal 3D', model: 'models/grenouille.glb', description: 'Grenouille', author: 'Moi' },
            { id: 'model5', name: 'Objet 3D', model: 'models/phare.glb', description: 'Phare qui illumine l\'horizon', author: 'Moi' }
        ];
        
        const model = models3D.find(m => m.id === modelId);
        
        if (!model) return;
        
        const viewer = document.getElementById('model-viewer');
        if (!viewer) return;
        
        viewer.classList.remove('hidden');
        
        // Utiliser model-viewer pour afficher le modèle 3D avec corrections
        viewer.innerHTML = `
            <div class="viewer-header" style="background: linear-gradient(90deg, var(--arcade-blue), #007ACC); padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: white;">${model.name}</h3>
                <button class="close-btn" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div class="viewer-content" style="padding: 20px; display: flex; flex-direction: column; gap: 20px;">
                <model-viewer src="${model.model}" 
                              alt="${model.name}" 
                              auto-rotate 
                              camera-controls 
                              shadow-intensity="1"
                              style="width: 100%; height: 400px; background-color: #222;"
                              poster="img/${modelId}_thumb.png">
                    <!-- Corrigé le message de chargement pour qu'il disparaisse correctement -->
                    <div slot="progress-bar" class="model-loading" style="display: flex; justify-content: center; align-items: center; height: 100%;">
                        <div style="background-color: rgba(0,0,0,0.7); padding: 15px; border-radius: 10px;">
                            Chargement du modèle 3D...
                        </div>
                    </div>
                </model-viewer>
                <div class="model-info" style="background-color: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px;">
                    <h4 style="color: var(--arcade-blue); margin-top: 0;">${model.name}</h4>
                    <p style="margin-bottom: 10px;">${model.description}</p>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; color: rgba(255,255,255,0.7);">
                        <span>Créé par: ${model.author}</span>
                        <span>Logiciel: Blender</span>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter gestionnaire pour fermer
        const closeBtn = viewer.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                viewer.classList.add('hidden');
                playSound('click');
            });
        }
        
        // Ajouter un gestionnaire d'événements pour model-viewer
        const modelViewer = viewer.querySelector('model-viewer');
        if (modelViewer) {
            // Écouter l'événement de chargement complet pour s'assurer que le message disparaît
            modelViewer.addEventListener('load', () => {
                const loadingElement = modelViewer.querySelector('.model-loading');
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            });
            
            // Vérifier si le modèle est déjà chargé
            if (modelViewer.loaded) {
                const loadingElement = modelViewer.querySelector('.model-loading');
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            }
        }
    }
    
    // Initialiser la position de la pince
    updateClawPosition();
  }

// Galerie d'art interactive
function initGallery() {
  const gallery = document.getElementById('art-gallery');
  
  if (!gallery) return;
  
  const artworkWall = gallery.querySelector('.artwork-wall');
  const artworks = gallery.querySelectorAll('.artwork');
  
  if (!artworkWall || !artworks.length) return;
  
  // Créer la lampe torche
  const flashlight = document.createElement('div');
  flashlight.className = 'flashlight';
  artworkWall.appendChild(flashlight);
  
  // Suivre le mouvement de la souris
  artworkWall.addEventListener('mousemove', (e) => {
      const rect = artworkWall.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      flashlight.style.left = `${x}px`;
      flashlight.style.top = `${y}px`;
      
      // Révéler les œuvres proches
      artworks.forEach(artwork => {
          const artRect = artwork.getBoundingClientRect();
          const artX = artRect.left + artRect.width/2 - rect.left;
          const artY = artRect.top + artRect.height/2 - rect.top;
          
          // Calculer la distance
          const distance = Math.sqrt(Math.pow(x - artX, 2) + Math.pow(y - artY, 2));
          
          // Ajuster l'opacité en fonction de la distance
          const opacity = Math.max(0.1, Math.min(1, 1 - distance/250));
          artwork.style.opacity = opacity.toString();
      });
  });
  
  // Pour mobile, toucher révèle temporairement les œuvres
  artworkWall.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
          const touch = e.touches[0];
          const rect = artworkWall.getBoundingClientRect();
          const x = touch.clientX - rect.left;
          const y = touch.clientY - rect.top;
          
          flashlight.style.left = `${x}px`;
          flashlight.style.top = `${y}px`;
          
          // Révéler les œuvres proches
          artworks.forEach(artwork => {
              const artRect = artwork.getBoundingClientRect();
              const artX = artRect.left + artRect.width/2 - rect.left;
              const artY = artRect.top + artRect.height/2 - rect.top;
              
              // Calculer la distance
              const distance = Math.sqrt(Math.pow(x - artX, 2) + Math.pow(y - artY, 2));
              
              // Ajuster l'opacité en fonction de la distance
              const opacity = Math.max(0.1, Math.min(1, 1 - distance/250));
              artwork.style.opacity = opacity.toString();
          });
      }
  });
  
  // Cliquer sur une œuvre pour voir les détails
  artworks.forEach(artwork => {
      artwork.addEventListener('click', () => {
          const id = artwork.getAttribute('data-id');
          showArtworkDetails(id);
          playSound('click');
      });
  });
  
  // Afficher les détails d'une œuvre
  function showArtworkDetails(artId) {
      // Données des œuvres
      const artCollection = [
          { id: 'art1', title: 'Portrait au crayon', image: 'img/portrait.jpeg', description: 'Dessin au crayon papier qui capture une femme en kimono fait dans le cadre d\'un concours fabercastell.', medium: 'Traditionnel', year: '2019' },
          { id: 'art2', title: 'Illustration digitale', image: 'img/digital.jpeg', description: 'Illustration d\'un personnage assise dans un jardin. Dédié à un prochain projet webtoon.', medium: 'Digital', year: '2022' },
          { id: 'art3', title: 'Peinture classique', image: 'img/peinture.jpeg', description: 'Réalisée à l’acrylique, cette scène est une reproduction de la toile Psyché entrant Jardin de Cupidon.', medium: 'Peinture acrylique', year: '2023' },
          { id: 'art4', title: 'Bouquet en crochet', image: 'img/crochet.jpeg', description: 'Ce petit bouquet composé de fils chenille et coton est entièrement réalisé à la main.', medium: 'Crochet', year: '2024' },
          { id: 'art5', title: 'Sculpture', image: 'img/sculpture.jpeg', description: 'Sulpture en argile d\'un buste stylisé d’un personnage fantastique, féminin, faite en groupe.', medium: 'Argile', year: '2020' }
      ];
      
      const artwork = artCollection.find(a => a.id === artId);
      
      if (!artwork) return;
      
      const viewer = document.getElementById('artwork-viewer');
      if (!viewer) return;
      
      viewer.classList.remove('hidden');
      
      viewer.innerHTML = `
          <div class="viewer-header" style="background: linear-gradient(90deg, var(--arcade-green), #00804d); padding: 15px; display: flex; justify-content: space-between; align-items: center;">
              <h3 style="margin: 0; color: white;">${artwork.title}</h3>
              <button class="close-btn" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
          </div>
          <div class="viewer-content" style="padding: 20px; display: flex; flex-direction: column; gap: 20px;">
              <div class="artwork-display" style="text-align: center;">
                  <img src="${artwork.image}" alt="${artwork.title}" style="max-width: 100%; max-height: 70vh; border-radius: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.3);" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'800\' height=\'600\'><rect width=\'800\' height=\'600\' fill=\'%23333\'/><text x=\'50%\' y=\'50%\' font-size=\'24\' text-anchor=\'middle\' fill=\'white\' font-family=\'Arial\'>${artwork.title}</text></svg>'">
              </div>
              <div class="artwork-info" style="background-color: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px;">
                    <h4 style="color: var(--arcade-green); margin-top: 0;">${artwork.title}</h4>
                    <p style="margin-bottom: 10px;">${artwork.description}</p>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; color: rgba(255,255,255,0.7);">
                        <span>Technique: ${artwork.medium}</span>
                        <span>Année: ${artwork.year}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter gestionnaire pour fermer
        const closeBtn = viewer.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                viewer.classList.add('hidden');
                playSound('click');
            });
        }
    }
}

// Borne d'arcade pour jeux Godot
function initArcadeMachine() {
    const arcadeMachine = document.getElementById('arcade-machine');
    
    if (!arcadeMachine) return;
    
    const screen = arcadeMachine.querySelector('.cabinet-screen');
    const gameItems = arcadeMachine.querySelectorAll('.game-item');
    const joystick = arcadeMachine.querySelector('.joystick-stick');
    const arcadeButtons = arcadeMachine.querySelectorAll('.arcade-btn');
    
    if (!screen || !gameItems.length || !joystick || !arcadeButtons.length) return;
    
    // Effet visuel sur le joystick
    let joystickAngle = 0;
    let joystickInterval;
    
    // Animation aléatoire du joystick
    function animateJoystick() {
        joystickInterval = setInterval(() => {
            joystickAngle = Math.random() * 20 - 10; // -10 à 10 degrés
            joystick.style.transform = `rotate(${joystickAngle}deg)`;
        }, 1000);
    }
    
    // Arrêter l'animation du joystick
    function stopJoystickAnimation() {
        clearInterval(joystickInterval);
        joystick.style.transform = 'rotate(0deg)';
    }
    
    // Démarrer l'animation du joystick
    animateJoystick();
    
    // Effet "appuyé" sur les boutons lors du clic
    arcadeButtons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.classList.add('pressed');
        });
        
        button.addEventListener('mouseup', () => {
            button.classList.remove('pressed');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('pressed');
        });
        
        // Simuler un clic aléatoire de temps en temps
        setInterval(() => {
            if (Math.random() > 0.9 && !arcadeMachine.classList.contains('hidden')) {
                button.classList.add('pressed');
                setTimeout(() => {
                    button.classList.remove('pressed');
                }, 200);
            }
        }, 3000);
    });
    
    // Sélection de jeu
    gameItems.forEach(item => {
        item.addEventListener('click', () => {
            const gameId = item.getAttribute('data-id');
            showGameDetails(gameId);
            playSound('click');
        });
    });
    
    // Afficher les détails d'un jeu
    function showGameDetails(gameId) {
        // Données des jeux
        const games = [
            { id: 'game1', title: 'Firefly Dreams', image: 'img/firefly.png', video: 'video/firefly.webm', description: 'Un jeu en 2D avec exploration et puzzles, développé avec Godot Engine.', year: '2021', genre: 'Aventure / Puzzle' },
            { id: 'game2', title: 'Vol d\'oiseaux', image: 'img/oiseau1.png', video: 'video/oiseau.webm', description: 'Simulation de vol en essaim d\'oiseau utilisant la bibliothèque Raylib (C++).', year: '2025', genre: 'Exploration' },
            { id: 'game3', title: '?', image: 'img/game3_thumb.jpg', video: 'videos/game3_demo.mp4', description: 'Un jeu en 3D avec exploration, développé avec Godot Engine.', year: '2025', genre: '?' }
        ];
        
        const game = games.find(g => g.id === gameId);
        
        if (!game) return;
        
        const viewer = document.getElementById('game-viewer');
        if (!viewer) return;
        
        viewer.classList.remove('hidden');
        
        viewer.innerHTML = `
            <div class="viewer-header" style="background: linear-gradient(90deg, var(--arcade-yellow), #b3b300); padding: 15px; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: white;">${game.title}</h3>
                <button class="close-btn" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer;">&times;</button>
            </div>
            <div class="viewer-content" style="padding: 20px; display: flex; flex-direction: column; gap: 20px;">
                <div class="game-display" style="text-align: center;">
                    <video controls poster="${game.image}" style="max-width: 100%; max-height: 60vh; border-radius: 10px; box-shadow: 0 10px 20px rgba(0,0,0,0.3);">
                        <source src="${game.video}" type="video/mp4">
                        Votre navigateur ne supporte pas la vidéo.
                    </video>
                </div>
                <div class="game-info" style="background-color: rgba(0,0,0,0.2); padding: 15px; border-radius: 10px;">
                    <h4 style="color: var(--arcade-yellow); margin-top: 0;">${game.title}</h4>
                    <p style="margin-bottom: 10px;">${game.description}</p>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; color: rgba(255,255,255,0.7);">
                        <span>Genre: ${game.genre}</span>
                        <span>Année: ${game.year}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter gestionnaire pour fermer
        const closeBtn = viewer.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                viewer.classList.add('hidden');
                playSound('click');
                stopJoystickAnimation();
            });
        }
    }
}

// Projecteur pour scènes Unreal
function initProjector() {
    const projectorZone = document.getElementById('projector');
    
    if (!projectorZone) return;
    
    const projectorCrank = document.getElementById('projector-crank');
    const unrealVideo = document.getElementById('unreal-video');
    const reels = projectorZone.querySelectorAll('.reel');
    
    if (!projectorCrank || !unrealVideo || !reels.length) return;
    
    // Animation de base de la manivelle
    let rotationDegree = 0;
    let rotateCrankInterval = setInterval(() => {
        rotationDegree += 2;
        projectorCrank.style.transform = `rotate(${rotationDegree}deg)`;
    }, 100);
    
    // Animation du crank au clic
    projectorCrank.addEventListener('click', () => {
        // Arrêter l'animation de base
        clearInterval(rotateCrankInterval);
        
        // Animation rapide
        let speed = 15;
        let totalRotation = 0;
        const fastRotateInterval = setInterval(() => {
            rotationDegree += speed;
            projectorCrank.style.transform = `rotate(${rotationDegree}deg)`;
            
            totalRotation += speed;
            if (totalRotation >= 360) {
                clearInterval(fastRotateInterval);
                
                // Reprendre l'animation de base
                rotateCrankInterval = setInterval(() => {
                    rotationDegree += 2;
                    projectorCrank.style.transform = `rotate(${rotationDegree}deg)`;
                }, 100);
                
                // Changer de bobine
                changeReel();
            }
        }, 30);
        
        playSound('click');
    });
    
    // Sélection de bobine directe
    reels.forEach(reel => {
        reel.addEventListener('click', () => {
            const reelId = reel.getAttribute('data-id');
            updateVideo(reelId);
            highlightReel(reel);
            playSound('click');
        });
    });
    
    // Changement de bobine
    let currentReelIndex = 0;
    
    function changeReel() {
        currentReelIndex = (currentReelIndex + 1) % reels.length;
        const newReel = reels[currentReelIndex];
        const reelId = newReel.getAttribute('data-id');
        
        updateVideo(reelId);
        highlightReel(newReel);
    }
    
    // Mise à jour de la vidéo
    function updateVideo(reelId) {
        // Sources des vidéos
        const videoSources = {
            'scene1': 'video/chateau_video.mp4',
            'scene2': 'video/montagne.mp4',
            'scene3': 'video/montagne2.mp4'
        };
        
        if (videoSources[reelId]) {
            unrealVideo.src = videoSources[reelId];
            unrealVideo.load();
            unrealVideo.play().catch(e => console.log('Lecture automatique empêchée:', e));
        }
    }
    
    // Mettre en évidence la bobine sélectionnée
    function highlightReel(selectedReel) {
        reels.forEach(reel => {
            reel.classList.remove('selected');
            reel.querySelector('.reel-film').style.borderColor = '#666';
        });
        
        selectedReel.classList.add('selected');
        selectedReel.querySelector('.reel-film').style.borderColor = 'var(--arcade-red)';
        selectedReel.querySelector('.reel-film').style.boxShadow = '0 0 15px var(--arcade-red-glow)';
    }
    
    // Initialiser avec la première bobine
    highlightReel(reels[0]);
    updateVideo(reels[0].getAttribute('data-id'));
}

// Laboratoire pour démos GL4D
function initLab() {
    const lab = document.getElementById('gl4d-lab');
    
    if (!lab) return;
    
    const flasks = lab.querySelectorAll('.flask');
    const cauldron = lab.querySelector('.cauldron-liquid');
    const mixButton = lab.querySelector('.mix-button');
    const labDisplay = lab.querySelector('.lab-display');
    
    if (!flasks.length || !cauldron || !mixButton || !labDisplay) return;
    
    // Remplacer le contenu du lab display pour avoir à la fois un canvas et des vidéos
    labDisplay.innerHTML = `
        <canvas id="gl4d-canvas"></canvas>
        <video id="demo-video-1" class="demo-video hidden" controls poster="demo1-poster.jpg">
            <source src="video/feu.webm" type="video/mp4">
            Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
        <video id="demo-video-2" class="demo-video hidden" controls poster="demo2-poster.jpg">
            <source src="video/F1.webm" type="video/mp4">
            Votre navigateur ne supporte pas les vidéos HTML5.
        </video>
    `;
    
    // Récupérer les références aux éléments
    const canvas = document.getElementById('gl4d-canvas');
    const demoVideo1 = document.getElementById('demo-video-1');
    const demoVideo2 = document.getElementById('demo-video-2');
    
    // S'assurer que le canvas a les bonnes dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // Ingrédients sélectionnés
    let selectedIngredients = [];
    
    // Sélection de fioles
    flasks.forEach(flask => {
        flask.addEventListener('click', () => {
            const ingredient = flask.getAttribute('data-ingredient');
            
            // Toggle sélection
            if (flask.classList.contains('selected')) {
                flask.classList.remove('selected');
                selectedIngredients = selectedIngredients.filter(i => i !== ingredient);
            } else {
                flask.classList.add('selected');
                selectedIngredients.push(ingredient);
            }
            
            // Effet visuel
            if (flask.classList.contains('selected')) {
                flask.style.transform = 'translateY(-10px)';
                flask.querySelector('.flask-liquid').style.height = '50px';
                flask.style.filter = 'brightness(1.5)';
            } else {
                flask.style.transform = '';
                flask.querySelector('.flask-liquid').style.height = '';
                flask.style.filter = '';
            }
            
            // Mise à jour du chaudron
            updateCauldron();
            
            playSound('click');
        });
    });
    
    // Mise à jour du chaudron
    function updateCauldron() {
        if (selectedIngredients.length === 0) {
            cauldron.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            cauldron.style.boxShadow = 'none';
            return;
        }
        
        // Couleurs pour les ingrédients
        const colors = {
            'particles': 'var(--arcade-green)',
            'colors': 'var(--arcade-blue)',
            'geometry': 'var(--arcade-red)'
        };
        
        // Mélanger les couleurs
        if (selectedIngredients.length === 1) {
            cauldron.style.backgroundColor = colors[selectedIngredients[0]];
        } else if (selectedIngredients.length === 2) {
            cauldron.style.background = `linear-gradient(to right, ${
                colors[selectedIngredients[0]]}, ${colors[selectedIngredients[1]]
            })`;
        } else {
            cauldron.style.background = `linear-gradient(to right, ${
                colors[selectedIngredients[0]]}, ${colors[selectedIngredients[1]]}, ${colors[selectedIngredients[2]]
            })`;
        }
        
        // Ajouter un effet de lueur
        cauldron.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
    }
    
    // Mélanger et lancer la démo appropriée
    mixButton.addEventListener('click', () => {
        if (selectedIngredients.length === 0) {
            // Notification s'il n'y a pas d'ingrédients
            showNotification('Ajoutez des ingrédients', 'Sélectionnez au moins un ingrédient pour voir la démo.');
            return;
        }
        
        // Animation de mélange
        mixButton.disabled = true;
        cauldron.style.transform = 'translateY(-5px)';
        cauldron.style.opacity = '0.7';
        
        // Effet de bouillonnement
        const bubbles = document.createElement('div');
        bubbles.className = 'cauldron-bubbles';
        bubbles.style.position = 'absolute';
        bubbles.style.top = '0';
        bubbles.style.left = '0';
        bubbles.style.width = '100%';
        bubbles.style.height = '100%';
        bubbles.style.pointerEvents = 'none';
        
        // Créer des bulles
        for (let i = 0; i < 10; i++) {
            const bubble = document.createElement('div');
            bubble.style.position = 'absolute';
            bubble.style.width = `${Math.random() * 10 + 5}px`;
            bubble.style.height = bubble.style.width;
            bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            bubble.style.borderRadius = '50%';
            bubble.style.bottom = '0';
            bubble.style.left = `${Math.random() * 80 + 10}%`;
            bubble.style.animation = `bubble-rise ${Math.random() * 2 + 1}s linear`;
            
            bubbles.appendChild(bubble);
        }
        
        cauldron.appendChild(bubbles);
        
        playSound('success');
        
        // Après l'animation, lancer la démo appropriée
        setTimeout(() => {
            // Masquer tous les éléments d'abord
            canvas.style.display = 'none';
            document.querySelectorAll('.demo-video').forEach(video => {
                video.pause();
                video.classList.add('hidden');
            });
            
            // Définir les démos selon les ingrédients
            const demoType = selectedIngredients.sort().join('-');
            
            // Déterminer quelle démo lancer en fonction de la combinaison
            switch(demoType) {
                case 'colors-geometry': // Première démo vidéo personnalisée
                    demoVideo1.classList.remove('hidden');
                    demoVideo1.style.display = 'block';
                    demoVideo1.currentTime = 0;
                    demoVideo1.play().catch(e => console.log('Lecture automatique empêchée:', e));
                    break;
                    
                case 'colors-geometry-particles': // Deuxième démo vidéo personnalisée
                    demoVideo2.classList.remove('hidden');
                    demoVideo2.style.display = 'block';
                    demoVideo2.currentTime = 0;
                    demoVideo2.play().catch(e => console.log('Lecture automatique empêchée:', e));
                    break;
                    
                default: // Pour les autres combinaisons, utiliser les animations canvas originales
                    canvas.style.display = 'block';
                    launchCanvasDemo(demoType, canvas);
                    break;
            }
            
            // Nettoyer
            cauldron.style.transform = '';
            cauldron.style.opacity = '';
            cauldron.removeChild(bubbles);
            mixButton.disabled = false;
        }, 2000);
    });
    
    // Fonction pour lancer les démos canvas originales
    function launchCanvasDemo(demoType, canvas) {
        // Reprendre la fonction originale avec les animations canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Réinitialiser le canvas
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Animations simulées comme dans le code original
        let animationId;
        
        switch (demoType) {
            case 'particles':
                animationId = particlesDemo(ctx, canvas);
                break;
            case 'colors':
                animationId = colorsDemo(ctx, canvas);
                break;
            case 'geometry':
                animationId = geometryDemo(ctx, canvas);
                break;
            case 'colors-particles':
                animationId = colorParticlesDemo(ctx, canvas);
                break;
            case 'geometry-particles':
                animationId = geometryParticlesDemo(ctx, canvas);
                break;
            default:
                animationId = particlesDemo(ctx, canvas);
        }
        
        // Stocker l'ID d'animation pour pouvoir l'arrêter plus tard
        canvas.setAttribute('data-animation-id', animationId);
    }
    
    // Exemples de démos GL4D simulées avec Canvas 2D
    function particlesDemo(ctx, canvas) {
        const particles = [];
        const particleCount = 100;
        
        // Créer des particules
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                color: 'rgba(0, 255, 140, 0.7)',
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Mettre à jour et dessiner les particules
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Rebondir sur les bords
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                // Dessiner la particule
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            return requestAnimationFrame(animate);
        }
        
        return animate();
    }
    
    function colorsDemo(ctx, canvas) {
        let hue = 0;
        
        function animate() {
            hue = (hue + 0.5) % 360;
            
            // Animation de couleurs
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
            gradient.addColorStop(0.5, `hsl(${(hue + 120) % 360}, 100%, 50%)`);
            gradient.addColorStop(1, `hsl(${(hue + 240) % 360}, 100%, 50%)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            return requestAnimationFrame(animate);
        }
        
        return animate();
    }
    
    function geometryDemo(ctx, canvas) {
        const shapes = [];
        const shapeCount = 20;
        
        // Créer des formes
        for (let i = 0; i < shapeCount; i++) {
            shapes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 50 + 20,
                type: Math.floor(Math.random() * 3), // 0: cercle, 1: carré, 2: triangle
                rotation: 0,
                rotationSpeed: (Math.random() * 2 - 1) * 0.02,
                color: `rgba(255, 42, 109, ${Math.random() * 0.5 + 0.3})`
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Dessiner les formes
            shapes.forEach(shape => {
                shape.rotation += shape.rotationSpeed;
                
                ctx.save();
                ctx.translate(shape.x, shape.y);
                ctx.rotate(shape.rotation);
                ctx.fillStyle = shape.color;
                
                // Dessiner selon le type
                switch (shape.type) {
                    case 0: // Cercle
                        ctx.beginPath();
                        ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 1: // Carré
                        ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                        break;
                    case 2: // Triangle
                        ctx.beginPath();
                        ctx.moveTo(0, -shape.size / 2);
                        ctx.lineTo(shape.size / 2, shape.size / 2);
                        ctx.lineTo(-shape.size / 2, shape.size / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                }
                
                ctx.restore();
            });
            
            return requestAnimationFrame(animate);
        }
        
        return animate();
    }
    
    function colorParticlesDemo(ctx, canvas) {
        const particles = [];
        const particleCount = 200;
        
        // Créer des particules
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 4 + 1,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`,
                speedX: Math.random() * 3 - 1.5,
                speedY: Math.random() * 3 - 1.5
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Mettre à jour et dessiner les particules
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                // Rebondir sur les bords
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                // Dessiner la particule
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            return requestAnimationFrame(animate);
        }
        
        return animate();
    }
    
    function geometryParticlesDemo(ctx, canvas) {
        // Implémentation simulée d'une démo géométrie + particules
        // Similaire aux fonctions précédentes mais combinant les effets
        
        const particles = [];
        const shapes = [];
        
        // Créer des particules
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                color: 'rgba(255, 42, 109, 0.7)',
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
        
        // Créer des formes
        for (let i = 0; i < 10; i++) {
            shapes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 50 + 20,
                type: Math.floor(Math.random() * 3),
                rotation: 0,
                rotationSpeed: (Math.random() * 2 - 1) * 0.02,
                color: 'rgba(0, 255, 140, 0.3)'
            });
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Dessiner les formes
            shapes.forEach(shape => {
                shape.rotation += shape.rotationSpeed;
                
                ctx.save();
                ctx.translate(shape.x, shape.y);
                ctx.rotate(shape.rotation);
                ctx.fillStyle = shape.color;
                
                switch (shape.type) {
                    case 0:
                        ctx.beginPath();
                        ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 1:
                        ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                        break;
                    case 2:
                        ctx.beginPath();
                        ctx.moveTo(0, -shape.size / 2);
                        ctx.lineTo(shape.size / 2, shape.size / 2);
                        ctx.lineTo(-shape.size / 2, shape.size / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                }
                
                ctx.restore();
            });
            
            // Dessiner les particules
            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            });
            
            return requestAnimationFrame(animate);
        }
        
        return animate();
    }
    
    function colorGeometryDemo(ctx, canvas) {
        // Démo combinant couleurs et géométrie
        let hue = 0;
        const shapes = [];
        
        // Créer des formes
        for (let i = 0; i < 15; i++) {
            shapes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 60 + 30,
                type: Math.floor(Math.random() * 3),
                rotation: 0,
                rotationSpeed: (Math.random() * 2 - 1) * 0.02
            });
        }
        
        function animate() {
            hue = (hue + 0.5) % 360;
            
            // Fond avec gradient
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0.1)`);
            gradient.addColorStop(1, `hsla(${(hue + 180) % 360}, 100%, 50%, 0.1)`);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Dessiner les formes
            shapes.forEach(shape => {
                shape.rotation += shape.rotationSpeed;
                
                ctx.save();
                ctx.translate(shape.x, shape.y);
                ctx.rotate(shape.rotation);
                ctx.fillStyle = `hsla(${(hue + Math.random() * 60) % 360}, 100%, 50%, 0.5)`;
                
                switch (shape.type) {
                    case 0:
                        ctx.beginPath();
                        ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 1:
                        ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                        break;
                    case 2:
                        ctx.beginPath();
                        ctx.moveTo(0, -shape.size / 2);
                        ctx.lineTo(shape.size / 2, shape.size / 2);
                        ctx.lineTo(-shape.size / 2, shape.size / 2);
                        ctx.closePath();
                        ctx.fill();
                        break;
                }
                
                ctx.restore();
            });
            
            return requestAnimationFrame(animate);
        }
        
        return animate();
    }
    
    function fullDemo(ctx, canvas) {
      // Démo combinant tous les effets - la plus spectaculaire
      let hue = 0;
      const particles = [];
      const shapes = [];
      
      // Créer des particules
      for (let i = 0; i < 100; i++) {
          particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              radius: Math.random() * 4 + 1,
              speedX: Math.random() * 3 - 1.5,
              speedY: Math.random() * 3 - 1.5
          });
      }
      
      // Créer des formes
      for (let i = 0; i < 12; i++) {
          shapes.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 70 + 30,
              type: Math.floor(Math.random() * 3),
              rotation: 0,
              rotationSpeed: (Math.random() * 2 - 1) * 0.03
          });
      }
      
      function animate() {
          hue = (hue + 0.5) % 360;
          
          // Effet de traînée
          ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Dessiner les formes
          shapes.forEach(shape => {
              shape.rotation += shape.rotationSpeed;
              
              ctx.save();
              ctx.translate(shape.x, shape.y);
              ctx.rotate(shape.rotation);
              ctx.fillStyle = `hsla(${(hue + Math.random() * 60) % 360}, 100%, 50%, 0.3)`;
              ctx.strokeStyle = `hsla(${(hue + 180) % 360}, 100%, 50%, 0.8)`;
              ctx.lineWidth = 2;
              
              switch (shape.type) {
                  case 0:
                      ctx.beginPath();
                      ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.stroke();
                      break;
                  case 1:
                      ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                      ctx.strokeRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
                      break;
                  case 2:
                      ctx.beginPath();
                      ctx.moveTo(0, -shape.size / 2);
                      ctx.lineTo(shape.size / 2, shape.size / 2);
                      ctx.lineTo(-shape.size / 2, shape.size / 2);
                      ctx.closePath();
                      ctx.fill();
                      ctx.stroke();
                      break;
              }
              
              ctx.restore();
          });
          
          // Dessiner les particules
          particles.forEach(particle => {
              particle.x += particle.speedX;
              particle.y += particle.speedY;
              
              if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
              if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
              
              ctx.beginPath();
              ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
              ctx.fillStyle = `hsl(${(hue + particle.x / canvas.width * 360) % 360}, 100%, 50%)`;
              ctx.fill();
          });
          
          return requestAnimationFrame(animate);
      }
      
      return animate();
  }
  
  // Afficher une notification
  function showNotification(title, message) {
      const container = document.getElementById('notification-container');
      if (!container) return;
      
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.innerHTML = `
          <div class="notification-header">
              <h4>${title}</h4>
              <button class="close-notification">&times;</button>
          </div>
          <div class="notification-content">
              <p>${message}</p>
          </div>
      `;
      
      // Styles pour la notification
      notification.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      notification.style.color = 'white';
      notification.style.borderRadius = '10px';
      notification.style.margin = '10px';
      notification.style.boxShadow = '0 0 15px var(--arcade-accent-glow)';
      notification.style.border = '1px solid var(--arcade-accent)';
      notification.style.overflow = 'hidden';
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      notification.style.transition = 'all 0.3s ease';
      
      // Header
      const header = notification.querySelector('.notification-header');
      header.style.display = 'flex';
      header.style.justifyContent = 'space-between';
      header.style.padding = '10px 15px';
      header.style.backgroundColor = 'var(--arcade-accent)';
      
      // Titre
      const titleEl = notification.querySelector('h4');
      titleEl.style.margin = '0';
      titleEl.style.fontSize = '16px';
      
      // Bouton fermer
      const closeBtn = notification.querySelector('.close-notification');
      closeBtn.style.background = 'none';
      closeBtn.style.border = 'none';
      closeBtn.style.color = 'white';
      closeBtn.style.fontSize = '20px';
      closeBtn.style.cursor = 'pointer';
      
      // Contenu
      const content = notification.querySelector('.notification-content');
      content.style.padding = '10px 15px';
      
      // Ajouter au conteneur
      container.appendChild(notification);
      
      // Animation d'entrée
      setTimeout(() => {
          notification.style.opacity = '1';
          notification.style.transform = 'translateY(0)';
      }, 10);
      
      // Fermer la notification
      closeBtn.addEventListener('click', () => {
          notification.style.opacity = '0';
          notification.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
              container.removeChild(notification);
          }, 300);
      });
      
      // Auto-fermeture après 5 secondes
      setTimeout(() => {
          if (container.contains(notification)) {
              notification.style.opacity = '0';
              notification.style.transform = 'translateY(20px)';
              
              setTimeout(() => {
                  if (container.contains(notification)) {
                      container.removeChild(notification);
                  }
              }, 300);
          }
      }, 5000);
  }
}

// Initialisation lors du chargement de la page
window.addEventListener('load', () => {
  // Masquer le loader une fois tout chargé
  const fullLoader = document.getElementById('full-page-loader');
  if (fullLoader) {
      fullLoader.style.opacity = '0';
      setTimeout(() => {
          fullLoader.style.display = 'none';
      }, 500);
  }
  
  // Tentative de lecture de la musique
  const backgroundMusic = document.getElementById('background-music');
  if (backgroundMusic) {
      // La plupart des navigateurs bloquent l'autoplay,
      // donc on attend une interaction utilisateur
      document.addEventListener('click', () => {
          if (backgroundMusic.paused) {
              backgroundMusic.play().catch(e => {
                  console.log('Lecture audio bloquée:', e);
              });
          }
      }, { once: true });
  }
});