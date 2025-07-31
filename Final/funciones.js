document.addEventListener('DOMContentLoaded', () => {
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const gameOverVideo = document.getElementById('game-over-video');
    const btnRestart = document.getElementById('btn-restart');
    const timerDisplay = document.getElementById('timer');
    let timerInterval;

    function startTimer() {
        const endTime = localStorage.getItem('endTime');
        if (!endTime) {
            // Handle case where timer wasn't started
            return;
        }

        timerInterval = setInterval(() => {
            const remainingTime = endTime - Date.now();
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                gameOverOverlay.classList.remove('oculto');
                gameOverVideo.play();
                return;
            }
            const minutes = Math.floor((remainingTime / 1000) / 60);
            const seconds = Math.floor((remainingTime / 1000) % 60);
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    btnRestart.addEventListener('click', () => {
        localStorage.removeItem('endTime');
        window.location.href = '../index.html';
    });

    startTimer();

    console.log('DOM Content Loaded');
    const escenaFinal = document.getElementById('escena-final');
    const escenaDiscos = document.getElementById('escena-discos');
    const btnIrPortal = document.getElementById('btn-ir-portal');

    if (btnIrPortal && escenaFinal && escenaDiscos) {
        btnIrPortal.addEventListener('click', () => {
            escenaFinal.classList.remove('visible');
            escenaFinal.classList.add('oculto');
            escenaDiscos.classList.remove('oculto');
            escenaDiscos.classList.add('visible');
        });
    }

    // Modales y botones de la esquina
    const btnPerfil = document.getElementById('btn-perfil');
    const btnRanking = document.getElementById('btn-ranking');
    const modalPerfil = document.getElementById('modal-perfil');
    const modalRanking = document.getElementById('modal-ranking');
    const cerrarModalPerfil = document.getElementById('cerrar-modal-perfil');
    const cerrarModalRanking = document.getElementById('cerrar-modal-ranking');

    // Perfil de usuario
    const formPerfil = document.getElementById('form-perfil');
    const inputPerfilImg = document.getElementById('input-perfil-img');
    const perfilImgPreview = document.getElementById('perfil-img-preview');
    const btnCambiarImg = document.getElementById('btn-cambiar-img');

    // Score y Timer
    const scoreContainer = document.getElementById('score-container');
    const scoreDisplay = document.getElementById('score');

    let currentScore = parseInt(localStorage.getItem('gameScore')) || 400;
    scoreDisplay.textContent = currentScore;

    function updateScore(points) {
        currentScore += points;
        scoreDisplay.textContent = currentScore;
        localStorage.setItem('gameScore', currentScore);
    }

    // Funcionalidad de los discos (existente)
    const discos = document.querySelectorAll('.disco');

    // Botones de navegación
    const btnVolverAtras = document.getElementById('btn-volver-atras');
    const btnIrAdelante = document.getElementById('btn-ir-adelante');

    if (btnIrAdelante) {
        btnIrAdelante.addEventListener('click', () => {
            console.log('btn-ir-adelante clicked');
            document.getElementById('escena-final').classList.remove('visible');
            document.getElementById('escena-final').classList.add('oculto');
            document.getElementById('escena-discos').classList.remove('oculto');
            document.getElementById('escena-discos').classList.add('visible');
        });
    }

    if (btnVolverAtras) {
        btnVolverAtras.addEventListener('click', () => {
            history.back();
        });
    }

    const botonComprobar = document.getElementById('comprobar');
    let angulos = {
        disco1: 0,
        disco2: 0,
        disco3: 0
    };
    let discoActivo = null;
    const valorDisplay = document.getElementById('valorDisplay');
    const botonObtenerCoordenadas = document.getElementById('obtenerCoordenadas');

    // Abrir y cerrar modales
    btnPerfil.addEventListener('click', () => {
        console.log('btn-perfil clicked');
        modalPerfil.classList.add('visible');
    });

    cerrarModalPerfil.addEventListener('click', () => {
        modalPerfil.classList.remove('visible');
    });

    btnRanking.addEventListener('click', () => {
        console.log('btn-ranking clicked');
        modalRanking.classList.add('visible');
        // Aquí se podría llamar a una función para cargar el ranking
        cargarRanking();
    });

    cerrarModalRanking.addEventListener('click', () => {
        modalRanking.classList.remove('visible');
    });

    // Funcionalidad del formulario de perfil
    btnCambiarImg.addEventListener('click', () => {
        inputPerfilImg.click();
    });

    inputPerfilImg.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                perfilImgPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    formPerfil.addEventListener('submit', (event) => {
        event.preventDefault();
        // Aquí se enviaría la información del perfil al servidor
        alert('Perfil guardado (funcionalidad de guardado no implementada en este ejemplo).');
        modalPerfil.classList.remove('visible');
    });

    // Función para cargar el ranking (ejemplo con datos dummy)
    function cargarRanking() {
        const tablaRankingBody = document.querySelector('#tabla-ranking tbody');
        tablaRankingBody.innerHTML = ''; // Limpiar tabla

        const rankingData = [
            { puesto: 1, jugador: 'Jugador1', puntuacion: 1500 },
            { puesto: 2, jugador: 'Jugador2', puntuacion: 1200 },
            { puesto: 3, jugador: 'Jugador3', puntuacion: 1000 },
        ];

        rankingData.forEach(item => {
            const row = tablaRankingBody.insertRow();
            row.insertCell().textContent = item.puesto;
            row.insertCell().textContent = item.jugador;
            row.insertCell().textContent = item.puntuacion;
        });
    }

    // Funcionalidad de los discos (existente)
    const obtenerValorDisco3 = (angulo) => {
        const valoresDisco3 = {
            15: 1, 45: 2, 75: 3, 105: 4, 135: 5, 165: 6,
            195: 7, 225: 8, 255: 9, 285: 10, 315: 11, 345: 12
        };
        const tolerancia = 5;

        for (const grados in valoresDisco3) {
            const gradosNum = parseInt(grados);
            const anguloNormalizado = (angulo % 360 + 360) % 360;

            if (anguloNormalizado >= gradosNum - tolerancia && anguloNormalizado <= gradosNum + tolerancia) {
                return valoresDisco3[grados];
            }
        }
        return 0; // Valor por defecto si no coincide
    };

    const obtenerValorDisco2 = (angulo) => {
        const valoresDisco2 = {
            0: 1, 22.5: 2, 45: 12, 67.5: 4, 90: 5, 112.5: 6,
            135: 7, 157.5: 11, 180: 9, 202.5: 3, 225: 14, 247.5: 8,
            270: 15, 292.5: 0, 315: 10, 337.5: 13
        };
        const tolerancia = 5;

        for (const grados in valoresDisco2) {
            const gradosNum = parseFloat(grados);
            const anguloNormalizado = (angulo % 360 + 360) % 360;

            if (anguloNormalizado >= gradosNum - tolerancia && anguloNormalizado <= gradosNum + tolerancia) {
                return valoresDisco2[grados];
            }
        }
        return 0; // Valor por defecto si no coincide
    };

    const obtenerValorDisco1 = (angulo) => {
        const valoresDisco1 = {
            0: 13, 13.85: 14, 27.7: 15, 41.55: 16, 55.4: 17, 69.25: 18,
            83.1: 19, 96.95: 20, 110.8: 21, 125.65: 22, 138.5: 23, 152.35: 24,
            166.2: 25, 180.05: 26, 193.9: 1, 207.75: 2, 221.6: 3, 235.45: 4,
            249.3: 5, 263.15: 6, 277: 7, 290.85: 8, 304.7: 9, 318.55: 10,
            332.4: 11, 346.25: 12
        };
        const tolerancia = 5;

        for (const grados in valoresDisco1) {
            const gradosNum = parseFloat(grados);
            const anguloNormalizado = (angulo % 360 + 360) % 360;

            if (anguloNormalizado >= gradosNum - tolerancia && anguloNormalizado <= gradosNum + tolerancia) {
                return valoresDisco1[grados];
            }
        }
        return 0; // Valor por defecto si no coincide
    };

    discos.forEach(disco => {
        disco.addEventListener('mousedown', (e) => {
            if (discoActivo === disco) {
                discoActivo = null;
                return;
            }

            discoActivo = disco;
            const rect = disco.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const startX = e.clientX - centerX;
            const startY = e.clientY - centerY;
            const startAngle = Math.atan2(startY, startX) * (180 / Math.PI);
            const currentAngle = angulos[disco.id];

            document.onmousemove = (e) => {
                if (discoActivo !== disco) return;

                const moveX = e.clientX - centerX;
                const moveY = e.clientY - centerY;
                const angle = Math.atan2(moveY, moveX) * (180 / Math.PI);
                let rotation = angle - startAngle;
                angulos[disco.id] = (currentAngle + rotation) % 360;
                disco.style.transform = `rotate(${angulos[disco.id]}deg)`;
            };
        });
    });

    botonComprobar.addEventListener('click', () => {
        const correctAnswers = {
            primero: "10",
            segundo: "25",
            tercero: "26",
            cuarto: "17",
            quinto: "5",
            sexto: "32"
        };

        const userAnswers = {
            primero: document.getElementById('primero').value,
            segundo: document.getElementById('segundo').value,
            tercero: document.getElementById('tercero').value,
            cuarto: document.getElementById('cuarto').value,
            quinto: document.getElementById('quinto').value,
            sexto: document.getElementById('sexto').value
        };

        const feedbackMessage = document.getElementById('feedback-message');
        let allCorrect = true;
        let wrongPosition = false;

        const correctValues = Object.values(correctAnswers);

        for (const id in userAnswers) {
            const input = document.getElementById(id);
            const userAnswer = userAnswers[id];

            input.classList.remove('error', 'wrong-position');

            if (correctAnswers[id] !== userAnswer) {
                allCorrect = false;
                if (correctValues.includes(userAnswer)) {
                    input.classList.add('wrong-position');
                    wrongPosition = true;
                } else {
                    input.classList.add('error');
                }
            }
        }

        if (allCorrect) {
            const victoryScreen = document.getElementById('victory-screen');
            const currentScene = document.querySelector('.pantalla.visible');
            if (currentScene) {
                currentScene.classList.remove('visible');
                currentScene.classList.add('oculto');
            }
            victoryScreen.classList.remove('oculto');
            victoryScreen.classList.add('visible');
            document.getElementById('victory-video').play();
            localStorage.removeItem('endTime'); // Clear the timer on victory

            // Hide other elements like score/timer containers
            document.getElementById('score-container').style.display = 'none';
            document.getElementById('timer-container').style.display = 'none';
            document.querySelector('.esquina-superior-derecha').style.display = 'none';
            document.querySelector('.esquina-superior-izquierda').style.display = 'none';

            // Add event listeners for victory buttons
            document.getElementById('btn-play-again').addEventListener('click', () => {
                window.location.href = '../index.html';
            });

            document.getElementById('btn-exit').addEventListener('click', () => {
                window.close(); // Attempt to close the window
                // Fallback for browsers that prevent window.close()
                window.location.href = 'about:blank';
            });

        } else if (wrongPosition) {
            feedbackMessage.textContent = 'Algunos números son correctos pero no están en la posición adecuada.';
        } else {
            feedbackMessage.textContent = 'Algunos números son incorrectos. Inténtalo de nuevo.';
        }
    });

    botonObtenerCoordenadas.addEventListener('click', () => {
        const valorDisco3 = obtenerValorDisco3(angulos.disco3);
        const valorDisco2 = obtenerValorDisco2(angulos.disco2);
        const valorDisco1 = obtenerValorDisco1(angulos.disco1);
        const valorTotal = valorDisco1 + valorDisco2 + valorDisco3;
        valorDisplay.textContent = valorTotal;
        valorDisplay.style.visibility = 'visible';
    });
});