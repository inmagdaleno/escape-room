window.onload = () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const textEl = document.getElementById('text');
  const containerEl = document.querySelector('#pantalla-bienvenida .contenido'); // Ser más específico con el selector

  let particles = [];
  let originalParticles = [];
  let isDisintegrated = false;

  // Función para ajustar el tamaño y posición del canvas
  function resizeCanvas() {
    const textRect = textEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    canvas.width = textRect.width;
    canvas.height = textRect.height;
    
    // Cálculo preciso de la posición relativa al contenedor
    canvas.style.left = `${textRect.left - containerRect.left}px`;
    canvas.style.top = `${textRect.top - containerRect.top}px`;

    createParticlesFromText();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      if (p.alpha <= 0) return;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white"; // El color de las partículas puede ser el del texto o blanco
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function createParticlesFromText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Obtener estilos del h1
    const computedStyle = getComputedStyle(textEl);
    const fontSize = parseFloat(computedStyle.fontSize);
    const fontFamily = computedStyle.fontFamily;
    const color = computedStyle.color;

    ctx.fillStyle = color;
    ctx.font = `${computedStyle.fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center"; // Centrar el texto para el dibujado
    ctx.textBaseline = "top"; // Línea base superior para dibujar desde el inicio del texto

    // Dibujar el texto en el centro horizontal del canvas
    ctx.fillText(textEl.textContent, canvas.width / 2, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

     particles = [];
    originalParticles = [];

    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const index = (y * canvas.width + x) * 4;
        const alpha = data[index + 3];

        if (alpha > 128) {
          const particle = {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            alpha: 1,
            radius: Math.random() * 1.5 + 1
          };
          particles.push({ ...particle });
          originalParticles.push({ ...particle }); // Clona para restaurar
        }
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Eventos de mouse sobre el contenedor
  containerEl.addEventListener('mouseenter', () => {
    if (isDisintegrated) return;

    resizeCanvas(); // Asegurarse de que el canvas tenga el tamaño correcto
    createParticlesFromText();
    textEl.style.opacity = 0;
    isDisintegrated = true;

    particles.forEach((p, i) => {
      gsap.to(p, {
        duration: gsap.utils.random(16, 28), // Animación 4x más lenta
        x: p.x + p.vx * 100,
        y: p.y + p.vy * 100,
        alpha: 0,
        ease: "power2.out",
        onUpdate: draw
      });
    });
  });

  containerEl.addEventListener('mouseleave', () => {
    if (!isDisintegrated) return;

    // Rearma las partículas y luego muestra el texto
    particles.forEach((p, i) => {
      const original = originalParticles[i];
      gsap.to(p, {
        duration: 1.5,
        x: original.x,
        y: original.y,
        alpha: 1,
        ease: "power2.inOut",
        onUpdate: draw,
        onComplete: () => {
          if (i === particles.length - 1) {
            textEl.style.opacity = 1;
            isDisintegrated = false;
          }
        }
      });
    });
  });

  // Ajustar el canvas cuando la ventana cambia de tamaño
  window.addEventListener('resize', resizeCanvas);

  // Inicializar el canvas al cargar la página
  resizeCanvas();
};
