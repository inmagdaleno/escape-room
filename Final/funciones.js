document.addEventListener('DOMContentLoaded', () => {
    const discos = document.querySelectorAll('.disco');
    const botonComprobar = document.getElementById('comprobar');
    let angulos = {
        disco1: 0,
        disco2: 0,
        disco3: 0
    };
    let discoActivo = null;
    const valorDisplay = document.getElementById('valorDisplay');
    const botonObtenerCoordenadas = document.getElementById('obtenerCoordenadas');

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
        const valorDisco3 = obtenerValorDisco3(angulos.disco3);
        const valorDisco2 = obtenerValorDisco2(angulos.disco2);
        const valorDisco1 = obtenerValorDisco1(angulos.disco1);
        const valorFinal = valorDisco1 + valorDisco2 + valorDisco3;
        alert(`El valor de la combinación es: ${valorFinal}`);
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
