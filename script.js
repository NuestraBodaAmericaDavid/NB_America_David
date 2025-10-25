document.addEventListener('DOMContentLoaded', () => {
  const jarLid = document.getElementById('jar-lid');
  const jarBody = document.getElementById('jar-body');
  const blockIntro = document.getElementById('block-intro');
  const blockInvitation = document.getElementById('block-invitation');
  const backgroundMusic = document.getElementById('background-music');
  
  // Elementos de la cuenta regresiva
  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');
  
  // Fecha objetivo: 8 de NOVIEMBRE de 2025 a las 4:00 PM
  const targetDate = new Date(2025, 10, 8, 16, 00, 0);
  
  // Forzar repintado inicial para Chrome
  setTimeout(() => {
    jarBody.style.display = 'none';
    jarBody.offsetHeight; // Trigger reflow
    jarBody.style.display = 'block';
  }, 100);

  // Agregar animación continua de palpitar
  gsap.to('.jar-container', {
    scale: 1.05,
    duration: 1,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Función para actualizar la cuenta regresiva
  function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;
    
    if (difference <= 0) {
      daysElement.textContent = '00';
      hoursElement.textContent = '00';
      minutesElement.textContent = '00';
      secondsElement.textContent = '00';
      return;
    }
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
  }
  
  // Iniciar cuenta regresiva
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Intentar reproducir música automáticamente
  function playMusic() {
    if (backgroundMusic) {
      backgroundMusic.play()
        .then(() => {
          console.log('Música reproduciéndose automáticamente');
        })
        .catch(error => {
          console.log('Error en reproducción automática:', error);
        });
    }
  }

  // Intentar reproducir al cargar
  playMusic();

  // CARRUSEL SIMPLIFICADO - PARA MÚLTIPLES CARRUSELES
  function initialize3DCarousel() {
    const carousels = document.querySelectorAll('.carousel-3d-container');
    
    carousels.forEach(container => {
      const slides = container.querySelectorAll('.carousel-slide');
      const totalSlides = slides.length;
      
      if (totalSlides === 0) return;
      
      let currentSlide = 0;
      let rotationInterval;
      
      // Actualizar clases de los slides
      function updateSlides() {
        slides.forEach((slide, index) => {
          // Remover todas las clases
          slide.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
          
          // Calcular la posición relativa
          let diff = index - currentSlide;
          
          // Ajustar para el carrusel circular
          if (diff < -Math.floor(totalSlides / 2)) {
            diff += totalSlides;
          } else if (diff > Math.floor(totalSlides / 2)) {
            diff -= totalSlides;
          }
          
          // Asignar clases según la posición
          if (diff === 0) {
            slide.classList.add('active');
          } else if (diff === -1 || (diff === totalSlides - 1 && currentSlide === 0)) {
            slide.classList.add('prev');
          } else if (diff === 1 || (diff === -totalSlides + 1 && currentSlide === totalSlides - 1)) {
            slide.classList.add('next');
          } else if (diff === -2 || (diff === totalSlides - 2 && currentSlide <= 1)) {
            slide.classList.add('far-prev');
          } else if (diff === 2 || (diff === -totalSlides + 2 && currentSlide >= totalSlides - 2)) {
            slide.classList.add('far-next');
          }
        });
      }
      
      // Cambiar al siguiente slide
      function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlides();
      }
      
      // Inicializar
      updateSlides();
      
      // Limpiar intervalo anterior si existe
      if (rotationInterval) {
        clearInterval(rotationInterval);
      }
      
      // Rotación automática cada 4 segundos (más tiempo)
      rotationInterval = setInterval(nextSlide, 4000);
      
      // Pausar rotación cuando la página no está visible
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          clearInterval(rotationInterval);
        } else {
          rotationInterval = setInterval(nextSlide, 4000);
        }
      });
    });
  }

  // EVENTO CLICK ORIGINAL MODIFICADO
  jarLid.addEventListener('click', () => {
    // Intentar reproducir música si no se ha podido antes
    playMusic();
    
    // Mejorar rendimiento preparando elementos para animación
    jarLid.style.willChange = 'transform';
    jarBody.style.willChange = 'transform, opacity';
    
    // Animar tapa hacia arriba
    gsap.to(jarLid, {
      y: -200,
      duration: 1.2,
      ease: "power2.out",
      onComplete: () => {
        jarLid.style.willChange = 'auto';
      }
    });

    // Animar frasco hacia abajo y desvanecer
    gsap.to(jarBody, {
      y: 200,
      opacity: 0,
      duration: 1.5,
      ease: "power2.in",
      onComplete: () => {
        jarBody.style.willChange = 'auto';
        // Ocultar bloque 1
        blockIntro.classList.add('hidden');
        // Mostrar bloque 2 (invitación)
        blockInvitation.classList.remove('hidden');
        gsap.fromTo(blockInvitation, 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 1.2 }
        );
        
        // INICIALIZAR CARRUSEL después de mostrar el bloque
        setTimeout(initialize3DCarousel, 500);
      }
    });
  });
  
  // Detectar Chrome específicamente para aplicar mejoras adicionales
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  if (isChrome) {
    document.body.classList.add('chrome-browser');
  }
});


