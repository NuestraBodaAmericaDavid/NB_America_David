// script.js
document.addEventListener('DOMContentLoaded', () => {
  const blockIntro = document.getElementById('block-intro');
  const blockInvitation = document.getElementById('block-invitation');
  const backgroundMusic = document.getElementById('background-music');
  const staticFlowersContainer = document.getElementById('static-flowers');
  const flowerRainContainer = document.getElementById('flower-rain');
  const flowerRainMainContainer = document.getElementById('flower-rain-main');
  
  let audioContext;
  let analyser;
  let microphone;
  let isBlowDetected = false;

  // Inicializar flores estáticas
  function initializeStaticFlowers() {
    const flowerTypes = ['flor-blanca.svg', 'flor-azul.svg'];
    const sizes = ['small', 'medium', 'large'];
    
    // Crear 25 flores estáticas distribuidas
    for (let i = 0; i < 25; i++) {
      const flower = document.createElement('div');
      flower.className = `static-flower ${sizes[Math.floor(Math.random() * sizes.length)]}`;
      
      // Posición aleatoria
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      
      // Tipo de flor aleatorio
      const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      
      flower.style.top = `${top}%`;
      flower.style.left = `${left}%`;
      flower.innerHTML = `<img src="./media/${flowerType}" alt="Flor">`;
      
      // Animación delay aleatorio
      flower.style.animationDelay = `${Math.random() * 5}s`;
      
      staticFlowersContainer.appendChild(flower);
    }
  }

  // Inicializar lluvia de flores
  function initializeFlowerRain(container) {
    const flowerTypes = ['flor-blanca.svg', 'flor-azul.svg'];
    
    function createFallingFlower() {
      const flower = document.createElement('div');
      flower.className = 'falling-flower';
      
      const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      const left = Math.random() * 100;
      const duration = 15 + Math.random() * 10; // 15-25 segundos
      const delay = Math.random() * 5;
      
      flower.style.left = `${left}%`;
      flower.style.animationDuration = `${duration}s`;
      flower.style.animationDelay = `${delay}s`;
      flower.innerHTML = `<img src="./media/${flowerType}" alt="Flor">`;
      
      container.appendChild(flower);
      
      // Remover flor después de caer
      setTimeout(() => {
        if (flower.parentNode) {
          flower.parentNode.removeChild(flower);
        }
      }, duration * 1000);
    }
    
    // Crear flores continuamente
    setInterval(createFallingFlower, 500);
    
    // Crear algunas flores iniciales
    for (let i = 0; i < 10; i++) {
      setTimeout(createFallingFlower, i * 300);
    }
  }

  // Detección de soplo
  async function initBlowDetection() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        } 
      });
      
      audioContext = new AudioContext();
      analyser = audioContext.createAnalyser();
      microphone = audioContext.createMediaStreamSource(stream);
      
      analyser.fftSize = 256;
      microphone.connect(analyser);
      
      detectBlow();
      
    } catch (error) {
      console.log('Micrófono no disponible, usando click fallback');
      setupClickFallback();
    }
  }

  function detectBlow() {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const blowThreshold = 180; // Ajustable según sensibilidad
    let blowCounter = 0;
    
    function checkBlow() {
      analyser.getByteFrequencyData(dataArray);
      const volume = Math.max(...dataArray);
      
      if (volume > blowThreshold && !isBlowDetected) {
        blowCounter++;
        if (blowCounter > 3) { // Confirmar soplo
          handleBlowDetected();
        }
      } else {
        blowCounter = Math.max(0, blowCounter - 1);
      }
      
      requestAnimationFrame(checkBlow);
    }
    checkBlow();
  }

  function handleBlowDetected() {
    if (isBlowDetected) return;
    
    isBlowDetected = true;
    
    // Efecto visual de soplo
    blockIntro.classList.add('blow-detected');
    
    // Animar flores
    gsap.to('.static-flower', {
      x: "random(-30, 30)",
      y: "random(-20, 20)", 
      rotation: "random(-15, 15)",
      duration: 0.8,
      stagger: 0.05,
      ease: "power2.out"
    });
    
    // Reproducir música y transición
    playMusic();
    
    setTimeout(() => {
      blockIntro.classList.add('hidden');
      blockInvitation.classList.remove('hidden');
      gsap.fromTo(blockInvitation, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5 }
      );
    }, 1500);
  }

  function setupClickFallback() {
    document.addEventListener('click', () => {
      if (!isBlowDetected) {
        handleBlowDetected();
      }
    });
  }

  function playMusic() {
    if (backgroundMusic) {
      backgroundMusic.volume = 0.7;
      backgroundMusic.play().catch(console.log);
    }
  }

  // Inicializar todo
  initializeStaticFlowers();
  initializeFlowerRain(flowerRainContainer);
  initializeFlowerRain(flowerRainMainContainer);
  initBlowDetection();

  // Mantén tu código existente para cuenta regresiva, carruseles, etc.
  // ... (tu código JavaScript existente) ...
});
