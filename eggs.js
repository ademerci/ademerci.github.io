(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEggs);
    } else {
        initEggs();
    }

    function initEggs() {
        const mascotSvg = document.querySelector('.mascot-stage .mascot');
        const mascotStage = document.querySelector('.mascot-stage');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (mascotSvg && mascotStage) {
            mascotSvg.style.pointerEvents = 'auto';
            mascotSvg.style.cursor = 'pointer';
            mascotSvg.setAttribute('tabindex', '0');
            mascotSvg.setAttribute('role', 'button');
            mascotSvg.setAttribute('aria-label', 'Clawd springen lassen');

            let jumpCount = 0;
            let isJumping = false;
            let activeBubble = null;

            function triggerJump() {
                if (isJumping) return;
                isJumping = window.getComputedStyle(mascotSvg).bottom; // Lock flag

                if (prefersReducedMotion) {
                    mascotSvg.style.bottom = '20px';
                    setTimeout(() => {
                        mascotSvg.style.bottom = '0px';
                        isJumping = false;
                    }, 300);
                } else {
                    const animation = mascotSvg.animate([
                        { bottom: '0px' },
                        { bottom: '60px' },
                        { bottom: '0px' }
                    ], {
                        duration: 500,
                        easing: 'steps(6)'
                    });

                    animation.onfinish = () => {
                        isJumping = false;
                    };
                }

                jumpCount++;
                if (jumpCount === 10) {
                    jumpCount = 0;
                    if (activeBubble) {
                        activeBubble.remove();
                    }

                    const stageRect = mascotStage.getBoundingClientRect();
                    const mascotRect = mascotSvg.getBoundingClientRect();

                    const bubble = document.createElement('div');
                    bubble.textContent = 'Hör auf mich zu klicken!';
                    bubble.style.position = 'absolute';
                    bubble.style.left = `${(mascotRect.left - stageRect.left) + (mascotRect.width / 2)}px`;
                    bubble.style.top = `${(mascotRect.top - stageRect.top) - 10}px`;
                    bubble.style.transform = 'translate(-50%, -100%)';
                    bubble.style.backgroundColor = '#ffffff';
                    bubble.style.color = '#3a2a1a';
                    bubble.style.border = '3px solid #3a2a1a';
                    bubble.style.padding = '4px 6px';
                    bubble.style.fontFamily = "'Press Start 2P', monospace";
                    bubble.style.fontSize = '10px';
                    bubble.style.whiteSpace = 'nowrap';
                    bubble.style.zIndex = '100';

                    mascotStage.appendChild(bubble);
                    activeBubble = bubble;

                    setTimeout(() => {
                        if (bubble.parentNode) {
                            bubble.remove();
                        }
                        if (activeBubble === bubble) {
                            activeBubble = null;
                        }
                    }, 2500);
                }
            }

            mascotSvg.addEventListener('click', triggerJump);
            mascotSvg.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    triggerJump();
                }
            });
        }

        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;
        let snailActive = false;

        window.addEventListener('keydown', (e) => {
            if (snailActive) return;

            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            const expected = konamiCode[konamiIndex];
            const expectedKey = expected.length === 1 ? expected.toLowerCase() : expected;

            if (key === expectedKey) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    konamiIndex = 0;
                    spawnSnail();
                }
            } else {
                if (key === (konamiCode[0].length === 1 ? konamiCode[0].toLowerCase() : konamiCode[0])) {
                    konamiIndex = 1;
                } else {
                    konamiIndex = 0;
                }
            }
        });

        function showToast(text) {
            const toast = document.createElement('div');
            toast.textContent = text;
            toast.style.position = 'fixed';
            toast.style.top = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = '#ffffff';
            toast.style.color = '#3a2a1a';
            toast.style.border = '3px solid #3a2a1a';
            toast.style.padding = '6px 10px';
            toast.style.fontFamily = "'Press Start 2P', monospace";
            toast.style.fontSize = '10px';
            toast.style.whiteSpace = 'nowrap';
            toast.style.zIndex = '1001';
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }

        function spawnSnail() {
            snailActive = true;
            showToast('Die Schnecke hat dich gefunden.');

            const svgNS = "http://www.w3.org/2000/svg";
            const snailSvg = document.createElementNS(svgNS, "svg");
            snailSvg.setAttribute("viewBox", "0 0 60 40");
            snailSvg.setAttribute("width", "60");
            snailSvg.setAttribute("height", "40");
            snailSvg.setAttribute("shape-rendering", "crispEdges");
            snailSvg.style.position = 'fixed';
            snailSvg.style.zIndex = '1000';
            snailSvg.style.pointerEvents = 'none';

            const rows = [
                'E...E.......',
                '.E.E..SSSS..',
                '.GGG.SBBBBS.',
                '.GGGSBSSSBBS',
                '.GGGSBSBSBBS',
                '.GGGSBSSBBS.',
                'GGGGGSBBBBS.',
                'GGGGGGGGGGGG'
            ];

            const colorMap = {
                'S': '#5a3820',
                'B': '#c08a5a',
                'G': '#9bb07a',
                'E': '#2b2b2b'
            };

            const pixelSize = 5;
            for (let r = 0; r < rows.length; r++) {
                for (let c = 0; c < rows[r].length; c++) {
                    const char = rows[r][c];
                    if (colorMap[char]) {
                        const rect = document.createElementNS(svgNS, "rect");
                        rect.setAttribute("x", c * pixelSize);
                        rect.setAttribute("y", r * pixelSize);
                        rect.setAttribute("width", pixelSize);
                        rect.setAttribute("height", pixelSize);
                        rect.setAttribute("fill", colorMap[char]);
                        snailSvg.appendChild(rect);
                    }
                }
            }

            let posX = 0;
            let posY = window.innerHeight - 40;
            snailSvg.style.left = `${posX}px`;
            snailSvg.style.top = `${posY}px`;
            document.body.appendChild(snailSvg);

            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            window.addEventListener('touchmove', (e) => {
                if (e.touches.length > 0) {
                    mouseX = e.touches[0].clientX;
                    mouseY = e.touches[0].clientY;
                }
            }, { passive: true });

            let caught = false;

            if (prefersReducedMotion) {
                const interval = setInterval(() => {
                    if (caught) {
                        clearInterval(interval);
                        return;
                    }
                    posX = mouseX - 30;
                    posY = mouseY - 20;
                    snailSvg.style.left = `${posX}px`;
                    snailSvg.style.top = `${posY}px`;

                    const centerX = posX + 30;
                    const centerY = posY + 20;
                    const dist = Math.hypot(centerX - mouseX, centerY - mouseY);

                    if (dist < 20) {
                        caught = true;
                        showToast('Erwischt! Lade die Seite neu, um zu entkommen.');
                        clearInterval(interval);
                    }
                }, 2000);
            } else {
                function updateSnail() {
                    if (!caught) {
                        const centerX = posX + 30;
                        const centerY = posY + 20;
                        const dx = mouseX - centerX;
                        const dy = mouseY - centerY;
                        const dist = Math.hypot(dx, dy);

                        if (dist < 20) {
                            caught = true;
                            showToast('Erwischt! Lade die Seite neu, um zu entkommen.');
                        } else if (dist > 1) {
                            const speed = 1.2;
                            posX += (dx / dist) * speed;
                            posY += (dy / dist) * speed;
                            snailSvg.style.left = `${posX}px`;
                            snailSvg.style.top = `${posY}px`;

                            if (dx > 0) {
                                snailSvg.style.transform = 'scaleX(-1)';
                            } else if (dx < 0) {
                                snailSvg.style.transform = 'scaleX(1)';
                            }
                        }
                    }
                    requestAnimationFrame(updateSnail);
                }
                requestAnimationFrame(updateSnail);
            }
        }
    }
})();