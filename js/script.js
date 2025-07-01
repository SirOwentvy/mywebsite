document.addEventListener('DOMContentLoaded', function() {
    // Nasconde la schermata di caricamento dopo un ritardo minimo
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 3000); // Attende 3 secondi prima di nascondere il loader
    });

    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Logica del widget radio
    const radioWidget = document.getElementById('radio-widget');
    const frequencyKnob = document.getElementById('frequency-knob');
    const radioAudio = document.getElementById('radio-audio');

    if (frequencyKnob && radioAudio && radioWidget) {
        radioAudio.volume = 0.1; // Imposta il volume al 50%
        frequencyKnob.addEventListener('click', () => {
            if (radioAudio.paused) {
                radioAudio.play();
                radioWidget.classList.add('playing');
            } else {
                radioAudio.pause();
                radioWidget.classList.remove('playing');
            }
        });
    }

    // Logica del terminale
    const openBtn = document.getElementById('open-terminal-btn');
    const closeBtn = document.getElementById('close-terminal-btn');
    const terminal = document.getElementById('terminal-widget');
    const output = document.getElementById('terminal-output');

    if (openBtn && closeBtn && terminal && output) {
        openBtn.addEventListener('click', () => {
            terminal.classList.remove('hidden');
            if (document.getElementById('hero')) {
                startTerminalAnimation();
            } else if (document.getElementById('about-page')) {
                startAboutTerminalAnimation();
            }
        });

        closeBtn.addEventListener('click', () => {
            terminal.classList.add('hidden');
            output.innerHTML = ''; // Pulisce il terminale alla chiusura
        });
    }

    function startAboutTerminalAnimation() {
        const terminalBody = document.getElementById('terminal-body');
        const output = document.getElementById('terminal-output');
        if (!output || !terminalBody) return;

        output.innerHTML = ''; // Pulisce l'output precedente

        const links = [
            { text: '> GitHub: <a href="#" target="_blank">https://github.com/SirOwentvy</a>' }
            //{ text: '> LinkedIn: <a href="#" target="_blank">linkedin.com/in/tuo-profilo</a>' },
            //{ text: '> Sito Web: <a href="#" target="_blank">tuo-sito.com</a>' }
        ];

        let i = 0;
        function addLink() {
            if (i < links.length) {
                const p = document.createElement('p');
                p.innerHTML = links[i].text;
                output.appendChild(p);
                terminalBody.scrollTop = terminalBody.scrollHeight;
                i++;
                setTimeout(addLink, 500);
            } else {
                const p = document.createElement('p');
                p.innerHTML = '> ';
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                p.appendChild(cursor);
                output.appendChild(p);
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        }

        const p = document.createElement('p');
        p.textContent = '> Caricamento link...';
        output.appendChild(p);
        terminalBody.scrollTop = terminalBody.scrollHeight;

        setTimeout(addLink, 1000);
    }

    function startTerminalAnimation() {
        const terminalBody = document.getElementById('terminal-body');
        const asciiArt = [
                            `
                ____    _    _     __     ___  _____ ___  ____  _____ 
                / ___|  / \\  | |    \\ \\   / / \\|_   _/ _ \\|  _ \\| ____|
                \\___ \\ / _ \\ | |     \\ \\ / / _ \\ | || | | | |_) |  _|  
                ___) / ___ \\| |___   \\ V / ___ \\| || |_| |  _ <| |___ 
                |____/_/   \\_\\_____|   \\_/_/   \\_\\_| \\___/|_| \\_\\_____|
                                                                    
                `
        ];

        const initialLines = asciiArt.map(line => ({ text: line, isAscii: true, delay: 25 }));

        const commandLines = [
            { text: '', delay: 1000 }, // Riga vuota per separazione
            { text: 'Inizializzazione sistema...', delay: 1000 },
            { text: 'Controllo permessi...', delay: 1500 },
            { text: 'Accesso autorizzato.', delay: 500 },
            { text: 'Pronto. Digita `help` per la lista dei comandi.', delay: 1000 },
            { text: '> download-cv', isCommand: true, delay: 2000 },
            { text: 'Download del file `cv.pdf` in corso...', delay: 1000 },
            { text: '#################### 100%', delay: 1500 },
            { text: 'Download completato. Clicca qui per aprire.', isLink: true, link: 'assets/cv.pdf', delay: 500 }
        ];

        const lines = initialLines.concat(commandLines);

        let lineIndex = 0;
        output.innerHTML = '';

        function scrollToBottom() {
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        function typeLine() {
            if (lineIndex >= lines.length) {
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                output.appendChild(cursor);
                scrollToBottom();
                return;
            }

            const lineInfo = lines[lineIndex];
            const p = document.createElement('p');
            output.appendChild(p);

            if (lineInfo.isAscii) {
                p.classList.add('ascii-art');
                p.textContent = lineInfo.text;
                lineIndex++;
                setTimeout(typeLine, lineInfo.delay);
                scrollToBottom();
                return;
            }

            if (lineInfo.isLink) {
                setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = lineInfo.link;
                    a.textContent = lineInfo.text;
                    a.target = '_blank';
                    p.appendChild(a);
                    lineIndex++;
                    typeLine();
                    scrollToBottom();
                }, lineInfo.delay);
            } else {
                let charIndex = 0;
                const text = lineInfo.isCommand ? lineInfo.text : lineInfo.text;
                p.innerHTML = lineInfo.isCommand ? '' : '> ';
                const cursor = document.createElement('span');
                cursor.className = 'cursor';
                p.appendChild(cursor);

                function typeChar() {
                    if (charIndex < text.length) {
                        cursor.before(text.charAt(charIndex));
                        charIndex++;
                        setTimeout(typeChar, 50);
                    } else {
                        p.removeChild(cursor);
                        lineIndex++;
                        setTimeout(typeLine, lineInfo.delay);
                    }
                    scrollToBottom();
                }
                typeChar();
            }
        }

        typeLine();
    }
});