class LetterGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
        this.numbers = "0123456789".split('');
        this.mode = 'letters';
        this.showChallenge = false;
        this.attempts = 0;
        this.currentChallenge = null;
        this.showingReward = false;
        this.rewardTimer = 0;
        
        // Load resources
        this.loadSounds();
        this.loadRewardImages();
        this.loadBackgrounds();
        
        // Setup virtual keyboard
        this.setupVirtualKeyboard();
        
        // Start game
        this.newChallenge();
    }

    async loadSounds() {
        this.sounds = {};
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const loadSound = async (character, folder) => {
            try {
                const response = await fetch(`sounds/${folder}/${character.toLowerCase()}.wav`);  // Changed to .wav
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                this.sounds[character] = audioBuffer;
            } catch (error) {
                console.log(`Could not load sound for ${character}`);
            }
        };

        // Load letters
        for (let letter of this.letters) {
            await loadSound(letter, 'letters');
        }
        
        // Load numbers
        for (let number of this.numbers) {
            await loadSound(number, 'numbers');
        }
    }

    async loadRewardImages() {
        this.rewardImages = [];
        const rewardFiles = [
            'reward1.jpg',
            'reward2.jpg',
            'reward3.jpg',
            'reward4.jpeg',
            'reward5.jpg',
            'reward6.png',
            'reward7.jpeg',
            'reward8.jpg',
            'reward9.jpg',
            'reward10.jpg'
        ];
        
        for (let file of rewardFiles) {
            const img = new Image();
            img.src = `rewards/${file}`;
            await new Promise(resolve => img.onload = resolve);
            this.rewardImages.push(img);
        }
    }
    
    async loadBackgrounds() {
        this.backgroundImages = [];
        const bgFiles = [
            'bg1.jpg',
            'bg2.jpg',
            'bg3.jpg',
            'bg4.jpg',
            'bg5.jpg',
            'bg6.jpg',
            'bg7.jpg',
            'bg8.jpg',
            'bg9.jpg'
        ];
        
        for (let file of bgFiles) {
            const img = new Image();
            img.src = `background/${file}`;
            await new Promise(resolve => img.onload = resolve);
            this.backgroundImages.push(img);
        }
        
        if (this.backgroundImages.length > 0) {
            this.currentBackground = this.backgroundImages[0];
        }
    }
    setupVirtualKeyboard() {
        const keyboard = document.getElementById('virtualKeyboard');
        
        // Add letter keys
        for (let letter of this.letters) {
            const button = document.createElement('button');
            button.className = 'key';
            button.textContent = letter;
            button.addEventListener('click', () => this.checkAnswer(letter.toLowerCase()));
            keyboard.appendChild(button);
        }
        
        // Add number keys
        for (let number of this.numbers) {
            const button = document.createElement('button');
            button.className = 'key';
            button.textContent = number;
            button.addEventListener('click', () => this.checkAnswer(number));
            keyboard.appendChild(button);
        }
        
        // Add space key for switching modes
        const spaceButton = document.createElement('button');
        spaceButton.className = 'key';
        spaceButton.style.width = '120px';
        spaceButton.textContent = 'Switch';
        spaceButton.addEventListener('click', () => {
            this.mode = this.mode === 'letters' ? 'numbers' : 'letters';
            this.showChallenge = false;
            this.newChallenge();
        });
        keyboard.appendChild(spaceButton);
    }

    playSound(character) {
        if (this.sounds[character]) {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createBufferSource();
            source.buffer = this.sounds[character];
            source.connect(audioContext.destination);
            source.start();
        }
    }

    newChallenge() {
        this.currentChallenge = this.mode === 'letters' 
            ? this.letters[Math.floor(Math.random() * this.letters.length)]
            : this.numbers[Math.floor(Math.random() * this.numbers.length)];
        
        this.playSound(this.currentChallenge);
        this.changeBackground();
    }

    changeBackground() {
        if (this.backgroundImages.length > 0) {
            this.currentBackground = this.backgroundImages[
                Math.floor(Math.random() * this.backgroundImages.length)
            ];
        }
    }

    showReward() {
        this.showingReward = true;
        this.rewardTimer = Date.now();
        this.currentRewardImage = this.rewardImages[
            Math.floor(Math.random() * this.rewardImages.length)
        ];
    }

    checkAnswer(input) {
        const correct = input === this.currentChallenge.toLowerCase();
        
        if (correct) {
            this.score++;
            this.showReward();
            this.showChallenge = false;
            this.attempts = 0;
        } else {
            this.attempts++;
            this.showChallenge = true;
            this.playSound(this.currentChallenge);
        }
        
        return correct;
    }

    draw() {
        // Clear canvas and draw background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.currentBackground) {
            this.ctx.drawImage(this.currentBackground, 0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw current challenge if needed
        if (this.showChallenge) {
            this.ctx.font = '120px Arial';
            this.ctx.textAlign = 'center';
            
            // Draw white outline
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 8;
            this.ctx.strokeText(this.currentChallenge, this.canvas.width/2, this.canvas.height/2);
            
            // Draw blue text
            this.ctx.fillStyle = '#6495ED';
            this.ctx.fillText(this.currentChallenge, this.canvas.width/2, this.canvas.height/2);
        }

        // Draw reward if active
        if (this.showingReward && this.currentRewardImage) {
            if (Date.now() - this.rewardTimer < 2000) {
                // Draw white background for reward
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(
                    this.canvas.width/2 - 105,
                    this.canvas.height/2 - 105,
                    210,
                    210
                );
                
                // Draw reward image
                this.ctx.drawImage(
                    this.currentRewardImage,
                    this.canvas.width/2 - 100,
                    this.canvas.height/2 - 100,
                    200,
                    200
                );
                
                // Draw "SUPER!" text with outline
                this.ctx.font = '120px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 8;
                this.ctx.strokeText('SUPER!', this.canvas.width/2, 100);
                this.ctx.fillStyle = 'red';
                this.ctx.fillText('SUPER!', this.canvas.width/2, 100);
            } else {
                this.showingReward = false;
                this.newChallenge();
            }
        }

        // Draw score
        this.ctx.font = '40px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillText(`Score: ${this.score}`, 10, 40);

        // Draw mode
        this.ctx.textAlign = 'right';
        this.ctx.fillText(
            `Mode: ${this.mode === 'letters' ? 'Letters' : 'Cijfers'}`,
            this.canvas.width - 10,
            40
        );

        requestAnimationFrame(() => this.draw());
    }
}

// Start the game when the page loads
window.onload = () => {
    const game = new LetterGame();
    game.draw();
};