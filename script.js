/* ============================================================
   BIRTHDAY SURPRISE — JAVASCRIPT EXPERIENCE
   Version: 3.0
   Features:
   - Magical welcome interaction
   - Animated stars and particles
   - Confetti celebrations
   - Floating hearts
   - Birthday wishes
   - Interactive gift reveal
   - Scroll animations
   - Toast notifications
   - Optional generated ambient music
   - Restart experience
============================================================ */

"use strict";

/* ============================================================
   01. APPLICATION CONFIGURATION
============================================================ */

const BirthdayApp = {
    config: {
        particleCount: 30,
        starCount: 45,
        confettiCount: 100,
        heartCount: 16,
        maxConfetti: 180,
        toastDuration: 2600,
        scrollThreshold: 0.12,
        enableAmbientParticles: true,
        enableSoundByDefault: false
    },

    state: {
        started: false,
        giftOpened: false,
        wishMade: false,
        musicEnabled: false,
        celebrationCount: 0,
        lastWishIndex: -1,
        activeTimers: [],
        audioContext: null,
        masterGain: null,
        oscillators: [],
        particlesCreated: 0,
        disposed: false
    },

    elements: {},

    wishes: [
        "May this new chapter bring you beautiful surprises. ✨",
        "May happiness find you in the smallest moments. 💖",
        "May your dreams grow bigger and your worries grow smaller. 🌙",
        "May you always have a reason to smile. 🌸",
        "May this year be full of courage, laughter and wonderful memories. 🎂",
        "May every new sunrise bring you fresh possibilities. ☀️",
        "May you always feel appreciated for who you are. 💗",
        "May your journey be filled with unexpected magic. ✨",
        "May your heart always find peace and happiness. 🕊️",
        "May the coming year be your most beautiful chapter yet. 🌷"
    ],

    colors: [
        "#ff77bd",
        "#ffb4dc",
        "#a879ff",
        "#d3b4ff",
        "#f5d59a",
        "#fff0c9",
        "#ff3f9d",
        "#e8b7ff",
        "#ffffff"
    ],

    hearts: ["♡", "♥", "❤", "💕", "💖", "💗", "✧", "✦"],

    confettiSymbols: ["✦", "✧", "♥", "♡", "✶", "✷"],

    /* --------------------------------------------------------
       01.1 INITIALIZE
    -------------------------------------------------------- */

    init() {
        this.cacheElements();
        this.bindEvents();
        this.initializeReveal();
        this.initializeStars();
        this.initializeParticles();
        this.initializeAmbientEffects();
        this.initializeKeyboardSupport();
        this.updateMusicButton();
        this.revealHeroImmediately();

        console.info(
            "%c BIRTHDAY SURPRISE ",
            "background:#8f2879;color:#fff;padding:8px 14px;border-radius:5px;font-weight:bold;"
        );

        console.info(
            "%cA little magic is ready. ✨",
            "color:#ff77bd;font-size:13px;"
        );
    },

    /* --------------------------------------------------------
       01.2 ELEMENT CACHE
    -------------------------------------------------------- */

    cacheElements() {
        const ids = [
            "startSurprise",
            "wishButton",
            "wishResult",
            "confettiButton",
            "heartButton",
            "giftBox",
            "giftButton",
            "giftInstruction",
            "secretMessage",
            "finalCelebrate",
            "restartButton",
            "effectsLayer",
            "starField",
            "particleField",
            "toast",
            "musicToggle",
            "musicLabel"
        ];

        ids.forEach((id) => {
            this.elements[id] = document.getElementById(id);
        });
    },

    /* --------------------------------------------------------
       01.3 EVENT LISTENERS
    -------------------------------------------------------- */

    bindEvents() {
        this.on("startSurprise", "click", () => {
            this.startSurprise();
        });

        this.on("wishButton", "click", () => {
            this.makeWish();
        });

        this.on("confettiButton", "click", () => {
            this.celebrate("big");
        });

        this.on("heartButton", "click", () => {
            this.sendHearts();
        });

        this.on("giftButton", "click", () => {
            this.openGift();
        });

        this.on("giftBox", "click", () => {
            if (!this.state.giftOpened) {
                this.openGift();
            }
        });

        this.on("finalCelebrate", "click", () => {
            this.celebrate("grand");
        });

        this.on("restartButton", "click", () => {
            this.restartExperience();
        });

        this.on("musicToggle", "click", () => {
            this.toggleMusic();
        });

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.pauseAmbientWork();
            } else {
                this.resumeAmbientWork();
            }
        });

        window.addEventListener("pagehide", () => {
            this.stopMusic();
        });
    },

    on(id, eventName, callback) {
        const element = this.elements[id];

        if (element) {
            element.addEventListener(eventName, callback);
        }
    },

    /* ========================================================
       02. GENERAL UTILITIES
    ======================================================== */

    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomInt(min, max) {
        return Math.floor(this.random(min, max + 1));
    },

    pick(array) {
        return array[Math.floor(Math.random() * array.length)];
    },

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    createElement(tag, className, parent) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (parent) {
            parent.appendChild(element);
        }

        return element;
    },

    safeRemove(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    },

    prefersReducedMotion() {
        return window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    },

    isVisible(element) {
        if (!element) {
            return false;
        }

        const rect = element.getBoundingClientRect();

        return (
            rect.bottom > 0 &&
            rect.top < window.innerHeight
        );
    },

    /* ========================================================
       03. WELCOME EXPERIENCE
    ======================================================== */

    startSurprise() {
        if (this.state.started) {
            this.showToast("The magic is already happening! ✨");
            this.scrollToSection("celebration");
            return;
        }

        this.state.started = true;

        this.showToast("Your special celebration begins now! 💖");

        this.celebrate("medium");
        this.createHearts(12);
        this.scrollToSection("celebration");

        this.pulseButton(this.elements.startSurprise);
    },

    scrollToSection(id) {
        const section = document.getElementById(id);

        if (!section) {
            return;
        }

        section.scrollIntoView({
            behavior: this.prefersReducedMotion() ? "auto" : "smooth",
            block: "start"
        });
    },

    revealHeroImmediately() {
        const hero = document.querySelector(".hero");

        if (!hero) {
            return;
        }

        hero.querySelectorAll(".reveal").forEach((element, index) => {
            const delay = this.prefersReducedMotion() ? 0 : index * 100;

            window.setTimeout(() => {
                element.classList.add("visible");
            }, delay);
        });
    },

    /* ========================================================
       04. SCROLL REVEAL SYSTEM
    ======================================================== */

    initializeReveal() {
        const revealElements = document.querySelectorAll(
            ".reveal:not(.hero .reveal)"
        );

        if (!("IntersectionObserver" in window)) {
            revealElements.forEach((element) => {
                element.classList.add("visible");
            });

            return;
        }

        this.revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: this.config.scrollThreshold,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            this.revealObserver.observe(element);
        });
    },

    /* ========================================================
       05. MAGICAL STAR FIELD
    ======================================================== */

    initializeStars() {
        const container = this.elements.starField;

        if (!container) {
            return;
        }

        const fragment = document.createDocumentFragment();
        const count = this.prefersReducedMotion()
            ? 10
            : this.config.starCount;

        for (let i = 0; i < count; i++) {
            const star = document.createElement("span");

            const size = this.random(1, 3.5);
            const duration = this.random(2.5, 6);
            const delay = this.random(0, 6);

            star.style.cssText = [
                "position:absolute",
                `left:${this.random(0, 100)}%`,
                `top:${this.random(0, 100)}%`,
                `width:${size}px`,
                `height:${size}px`,
                "border-radius:50%",
                `background:${this.pick(this.colors)}`,
                `box-shadow:0 0 ${size * 4}px ${this.pick(this.colors)}`,
                `animation:starTwinkle ${duration}s ease-in-out ${delay}s infinite`,
                "pointer-events:none"
            ].join(";");

            fragment.appendChild(star);
        }

        container.appendChild(fragment);
    },

    /* ========================================================
       06. CONTINUOUS AMBIENT PARTICLES
    ======================================================== */

    initializeParticles() {
        if (!this.config.enableAmbientParticles) {
            return;
        }

        const container = this.elements.particleField;

        if (!container) {
            return;
        }

        const fragment = document.createDocumentFragment();

        const count = this.prefersReducedMotion()
            ? 0
            : this.config.particleCount;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement("span");

            particle.className = "particle";

            const size = this.random(2, 5);
            const duration = this.random(8, 17);
            const delay = this.random(-17, 0);
            const drift = this.random(-90, 90);

            particle.style.setProperty("--x", `${this.random(0, 100)}%`);
            particle.style.setProperty("--size", `${size}px`);
            particle.style.setProperty("--duration", `${duration}s`);
            particle.style.setProperty("--delay", `${delay}s`);
            particle.style.setProperty("--drift", `${drift}px`);
            particle.style.setProperty(
                "--particle-color",
                this.pick(this.colors)
            );

            fragment.appendChild(particle);
        }

        container.appendChild(fragment);
    },

    initializeAmbientEffects() {
        this.addAmbientSparkles();
    },

    addAmbientSparkles() {
        const scene = document.querySelector(".background-scene");

        if (!scene || this.prefersReducedMotion()) {
            return;
        }

        if (scene.querySelector(".ambient-sparkle")) {
            return;
        }

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < 12; i++) {
            const sparkle = document.createElement("span");

            sparkle.className = "ambient-sparkle";
            sparkle.textContent = this.pick(["✧", "·", "✦"]);

            sparkle.style.cssText = [
                "position:absolute",
                `left:${this.random(3, 97)}%`,
                `top:${this.random(5, 95)}%`,
                `color:${this.pick(this.colors)}`,
                `font-size:${this.random(8, 17)}px`,
                `opacity:${this.random(0.15, 0.45)}`,
                `animation:symbolFloat ${this.random(5, 10)}s ease-in-out ${this.random(0, 5)}s infinite`,
                "pointer-events:none"
            ].join(";");

            fragment.appendChild(sparkle);
        }

        scene.appendChild(fragment);
    },

    pauseAmbientWork() {
        document.body.classList.add("page-paused");
    },

    resumeAmbientWork() {
        document.body.classList.remove("page-paused");
    },

    /* ========================================================
       07. BIRTHDAY WISH GENERATOR
    ======================================================== */

    makeWish() {
        const result = this.elements.wishResult;
        const button = this.elements.wishButton;

        if (!result) {
            return;
        }

        let index = this.randomInt(0, this.wishes.length - 1);

        if (this.wishes.length > 1) {
            while (index === this.state.lastWishIndex) {
                index = this.randomInt(0, this.wishes.length - 1);
            }
        }

        this.state.lastWishIndex = index;
        this.state.wishMade = true;

        result.textContent = this.wishes[index];

        result.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(8px) scale(0.97)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0) scale(1)"
                }
            ],
            {
                duration: 500,
                easing: "ease-out"
            }
        );

        this.pulseButton(button);
        this.createHearts(4);

        this.showToast("A little wish, just for you. 🌙");
    },

    /* ========================================================
       08. FLOATING HEART GENERATOR
    ======================================================== */

    sendHearts() {
        this.createHearts(this.config.heartCount);

        this.showToast("Sending happiness your way! 💖");

        this.pulseButton(this.elements.heartButton);
    },

    createHearts(count = 10) {
        const layer = this.elements.effectsLayer;

        if (!layer) {
            return;
        }

        const safeCount = this.prefersReducedMotion()
            ? Math.min(count, 5)
            : Math.min(count, 35);

        for (let i = 0; i < safeCount; i++) {
            const heart = document.createElement("span");

            heart.className = "heart";
            heart.textContent = this.pick(this.hearts);

            heart.style.left = `${this.random(3, 97)}%`;
            heart.style.bottom = `${this.random(-30, 5)}px`;
            heart.style.fontSize = `${this.random(15, 31)}px`;
            heart.style.animationDuration =
                `${this.random(4, 8)}s`;

            heart.style.animationDelay =
                `${this.random(0, 0.9)}s`;

            heart.style.color = this.pick(this.colors);

            layer.appendChild(heart);

            heart.addEventListener("animationend", () => {
                this.safeRemove(heart);
            }, { once: true });

            window.setTimeout(() => {
                this.safeRemove(heart);
            }, 10000);
        }
    },

    /* ========================================================
       09. CONFETTI CELEBRATION ENGINE
    ======================================================== */

    celebrate(level = "medium") {
        const settings = {
            small: 30,
            medium: 65,
            big: 100,
            grand: 150
        };

        const requested = settings[level] || settings.medium;

        this.state.celebrationCount++;

        this.createConfetti(requested);

        if (level === "big" || level === "grand") {
            this.createHearts(level === "grand" ? 25 : 15);
        }

        if (level === "grand") {
            this.flashCelebration();
        }

        this.showToast(
            this.state.celebrationCount > 1
                ? "The celebration continues! 🎉"
                : "Let the birthday magic begin! 🎂"
        );
    },

    createConfetti(count = 80) {
        const layer = this.elements.effectsLayer;

        if (!layer) {
            return;
        }

        if (this.prefersReducedMotion()) {
            this.createHearts(Math.min(5, Math.ceil(count / 20)));
            return;
        }

        const existing = layer.querySelectorAll(".confetti-piece");

        if (existing.length > this.config.maxConfetti) {
            existing.forEach((piece, index) => {
                if (index < existing.length - this.config.maxConfetti) {
                    this.safeRemove(piece);
                }
            });
        }

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < count; i++) {
            const piece = document.createElement("span");

            piece.className = "confetti-piece";

            const size = this.random(4, 10);
            const duration = this.random(2.8, 5.5);
            const delay = this.random(0, 1.2);
            const drift = this.random(-160, 160);
            const rotation = this.randomInt(250, 1100);

            piece.style.setProperty("--x", `${this.random(0, 100)}%`);
            piece.style.setProperty("--size", `${size}px`);
            piece.style.setProperty("--duration", `${duration}s`);
            piece.style.setProperty("--delay", `${delay}s`);
            piece.style.setProperty("--drift", `${drift}px`);
            piece.style.setProperty("--rotation", `${rotation}deg`);

            piece.style.setProperty(
                "--confetti-color",
                this.pick(this.colors)
            );

            fragment.appendChild(piece);

            window.setTimeout(() => {
                this.safeRemove(piece);
            }, (duration + delay + 0.5) * 1000);
        }

        layer.appendChild(fragment);
    },

    flashCelebration() {
        const hero = document.querySelector(".final-content");

        if (!hero || this.prefersReducedMotion()) {
            return;
        }

        hero.animate(
            [
                { filter: "brightness(1)" },
                { filter: "brightness(1.35)" },
                { filter: "brightness(1)" }
            ],
            {
                duration: 700,
                easing: "ease-out"
            }
        );
    },

    /* ========================================================
       10. INTERACTIVE GIFT BOX
    ======================================================== */

    openGift() {
        if (this.state.giftOpened) {
            this.showToast("Your surprise is already open! 💖");
            return;
        }

        const gift = this.elements.giftBox;
        const button = this.elements.giftButton;
        const instruction = this.elements.giftInstruction;
        const message = this.elements.secretMessage;

        if (!gift || !message) {
            return;
        }

        this.state.giftOpened = true;

        gift.classList.add("opened");
        gift.setAttribute("aria-label", "Birthday gift opened");

        if (instruction) {
            instruction.textContent =
                "A LITTLE SURPRISE, WRAPPED WITH GOOD WISHES. ✨";
        }

        if (button) {
            button.textContent = "SURPRISE UNLOCKED ✓";
            button.disabled = true;
            button.setAttribute("aria-expanded", "true");
        }

        message.hidden = false;

        this.createConfetti(65);
        this.createHearts(18);

        this.showToast("Surprise unlocked! Happy Birthday! 🎁");

        window.setTimeout(() => {
            message.scrollIntoView({
                behavior: this.prefersReducedMotion() ? "auto" : "smooth",
                block: "center"
            });
        }, 150);
    },

    /* ========================================================
       11. BUTTON FEEDBACK
    ======================================================== */

    pulseButton(button) {
        if (!button || this.prefersReducedMotion()) {
            return;
        }

        button.animate(
            [
                { transform: "scale(1)" },
                { transform: "scale(1.045)" },
                { transform: "scale(1)" }
            ],
            {
                duration: 350,
                easing: "ease-out"
            }
        );
    },

    /* ========================================================
       12. TOAST NOTIFICATIONS
    ======================================================== */

    showToast(message) {
        const toast = this.elements.toast;

        if (!toast) {
            return;
        }

        if (this.toastTimer) {
            window.clearTimeout(this.toastTimer);
        }

        toast.textContent = message;
        toast.classList.add("show");

        this.toastTimer = window.setTimeout(() => {
            toast.classList.remove("show");
        }, this.config.toastDuration);
    },

    /* ========================================================
       13. OPTIONAL AMBIENT MUSIC
       Uses the Web Audio API; no external music file.
    ======================================================== */

    async toggleMusic() {
        if (this.state.musicEnabled) {
            this.stopMusic();
            this.updateMusicButton();
            this.showToast("Ambient sound turned off. ♫");
            return;
        }

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            this.showToast("Ambient audio is not supported in this browser.");
            return;
        }

        try {
            if (!this.state.audioContext) {
                this.state.audioContext = new AudioContextClass();

                this.state.masterGain =
                    this.state.audioContext.createGain();

                this.state.masterGain.gain.value = 0.0001;

                this.state.masterGain.connect(
                    this.state.audioContext.destination
                );
            }

            if (this.state.audioContext.state === "suspended") {
                await this.state.audioContext.resume();
            }

            this.state.musicEnabled = true;

            this.startAmbientMusic();
            this.updateMusicButton();

            this.showToast("Soft ambient tones enabled. ♫");
        } catch (error) {
            this.state.musicEnabled = false;
            this.updateMusicButton();

            this.showToast("Audio could not start. Please try again.");
            console.warn("Audio initialization failed:", error);
        }
    },

    startAmbientMusic() {
        const context = this.state.audioContext;
        const master = this.state.masterGain;

        if (!context || !master || !this.state.musicEnabled) {
            return;
        }

        this.stopOscillators();

        const now = context.currentTime;

        master.gain.cancelScheduledValues(now);
        master.gain.setTargetAtTime(0.035, now, 0.8);

        /*
         * Gentle generated tones, not a recording.
         * This is intentionally quiet and simple.
         */

        const notes = [
            { frequency: 261.63, delay: 0 },
            { frequency: 329.63, delay: 0.8 },
            { frequency: 392.00, delay: 1.6 },
            { frequency: 329.63, delay: 2.4 }
        ];

        notes.forEach((note, index) => {
            const oscillator = context.createOscillator();
            const gain = context.createGain();

            oscillator.type = "sine";
            oscillator.frequency.value = note.frequency;

            gain.gain.value = 0.0001;

            oscillator.connect(gain);
            gain.connect(master);

            oscillator.start(now);

            const startAt = now + note.delay;

            gain.gain.setValueAtTime(0.0001, startAt);
            gain.gain.linearRampToValueAtTime(
                0.10,
                startAt + 0.35
            );
            gain.gain.setTargetAtTime(
                0.025,
                startAt + 0.5,
                0.7
            );

            this.state.oscillators.push({
                oscillator,
                gain,
                index
            });
        });

        this.scheduleAmbientSequence();
    },

    scheduleAmbientSequence() {
        if (!this.state.musicEnabled) {
            return;
        }

        if (this.ambientSequenceTimer) {
            window.clearTimeout(this.ambientSequenceTimer);
        }

        this.ambientSequenceTimer = window.setTimeout(() => {
            if (!this.state.musicEnabled) {
                return;
            }

            this.startAmbientMusic();
        }, 4500);
    },

    stopOscillators() {
        this.state.oscillators.forEach(({ oscillator, gain }) => {
            try {
                const context = this.state.audioContext;

                if (context) {
                    const now = context.currentTime;

                    gain.gain.cancelScheduledValues(now);
                    gain.gain.setTargetAtTime(0.0001, now, 0.08);

                    oscillator.stop(now + 0.5);
                }
            } catch (error) {
                /* An already stopped oscillator can be ignored. */
            }
        });

        this.state.oscillators = [];
    },

    stopMusic() {
        this.state.musicEnabled = false;

        if (this.ambientSequenceTimer) {
            window.clearTimeout(this.ambientSequenceTimer);
            this.ambientSequenceTimer = null;
        }

        this.stopOscillators();

        const master = this.state.masterGain;
        const context = this.state.audioContext;

        if (master && context && context.state !== "closed") {
            const now = context.currentTime;

            master.gain.cancelScheduledValues(now);
            master.gain.setTargetAtTime(0.0001, now, 0.12);
        }

        this.updateMusicButton();
    },

    updateMusicButton() {
        const button = this.elements.musicToggle;
        const label = this.elements.musicLabel;

        if (button) {
            button.setAttribute(
                "aria-pressed",
                String(this.state.musicEnabled)
            );
        }

        if (label) {
            label.textContent = this.state.musicEnabled
                ? "SOUND ON"
                : "SOUND OFF";
        }
    },

    /* ========================================================
       14. KEYBOARD ACCESSIBILITY
    ======================================================== */

    initializeKeyboardSupport() {
        const gift = this.elements.giftBox;

        if (gift) {
            gift.setAttribute("role", "button");
            gift.setAttribute("tabindex", "0");
            gift.setAttribute("aria-label", "Open the birthday gift");

            gift.addEventListener("keydown", (event) => {
                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {
                    event.preventDefault();
                    this.openGift();
                }
            });
        }
    },

    /* ========================================================
       15. RESTART EXPERIENCE
    ======================================================== */

    restartExperience() {
        this.stopMusic();

        this.state.started = false;
        this.state.giftOpened = false;
        this.state.wishMade = false;
        this.state.celebrationCount = 0;
        this.state.lastWishIndex = -1;

        if (this.elements.giftBox) {
            this.elements.giftBox.classList.remove("opened");
            this.elements.giftBox.setAttribute(
                "aria-label",
                "Open the birthday gift"
            );
        }

        if (this.elements.giftButton) {
            this.elements.giftButton.disabled = false;
            this.elements.giftButton.textContent =
                "UNWRAP YOUR GIFT ✨";
            this.elements.giftButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        if (this.elements.giftInstruction) {
            this.elements.giftInstruction.textContent =
                "SOME SURPRISES ARE BETTER OPENED WITH A LITTLE CURIOSITY.";
        }

        if (this.elements.secretMessage) {
            this.elements.secretMessage.hidden = true;
        }

        if (this.elements.wishResult) {
            this.elements.wishResult.textContent = "";
        }

        if (this.elements.effectsLayer) {
            this.elements.effectsLayer.replaceChildren();
        }

        if (this.toastTimer) {
            window.clearTimeout(this.toastTimer);
        }

        if (this.elements.toast) {
            this.elements.toast.classList.remove("show");
        }

        this.showToast("A fresh start. Let the magic begin again! ✨");

        this.scrollToSection("home");
    },

    /* ========================================================
       16. OPTIONAL CUSTOM MESSAGE HELPER
       Call BirthdayApp.showToast("Your own message") from
       another script if needed.
    ======================================================== */

    setCustomWish(message) {
        const result = this.elements.wishResult;

        if (!result || typeof message !== "string") {
            return;
        }

        result.textContent = message;
        this.state.wishMade = true;
    },

    /* ========================================================
       17. CLEANUP
    ======================================================== */

    destroy() {
        this.stopMusic();

        if (this.revealObserver) {
            this.revealObserver.disconnect();
        }

        if (this.toastTimer) {
            window.clearTimeout(this.toastTimer);
        }

        if (this.ambientSequenceTimer) {
            window.clearTimeout(this.ambientSequenceTimer);
        }

        this.state.disposed = true;
    }
};


/* ============================================================
   18. START THE APPLICATION
============================================================ */

function initializeBirthdayWebsite() {
    BirthdayApp.init();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeBirthdayWebsite,
        { once: true }
    );
} else {
    initializeBirthdayWebsite();
}


/* ============================================================
   19. OPTIONAL GLOBAL CONVENIENCE FUNCTIONS
============================================================ */

window.BirthdayApp = BirthdayApp;

window.celebrateBirthday = function () {
    BirthdayApp.celebrate("grand");
};

window.sendBirthdayHearts = function () {
    BirthdayApp.sendHearts();
};

window.makeBirthdayWish = function () {
    BirthdayApp.makeWish();
};

/* ============================================================
   END OF BIRTHDAY SURPRISE JAVASCRIPT
============================================================ */