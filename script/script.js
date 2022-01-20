// Chiều dài & rộng của khung pháo
const WIDTH = 1513;
const HEIGHT = 743;
// Kích cỡ của hạt pháo
const PARTICLE_SIZE = 7;
// Tốc độ biến đổi (nhỏ dần) của hạt pháo
const PARTICLE_CHANGE_SIZE_SPEED = 0.1;
// Tốc độ nổ (hạt) pháo
const PARTICLE_CHANGE_SPEED = 0.5;
// Tốc độ rơi
const ACCELERATION = 0.12;
// Xác định đuôi (hạt) dài hay ngắn
const DOT_CHANGE_SIZE_SPEED = 0.2;
const DOT_CHANGE_ALPHA_SPEED = 0.07;
// Tốc độ rơi chậm dần
const PARTICLE_MIN_SPEED = 10;
// Số lượng hạt
const NUMBER_PARTICLE_PER_BULLET = 15;

class particle {
    constructor(bullet, deg) {
        this.bullet = bullet;
        this.ctx = bullet.ctx;
        this.deg = deg;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 4 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;

        // Tất cả hạt
        this.dots = [];
    }

    update() {

        this.speed -= PARTICLE_CHANGE_SPEED;
        if (this.speed < 0) {
            this.speed = 0;
        }

        // Tăng tốc độ rơi (hạt)
        this.fallSpeed += ACCELERATION;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;

        // Tính toán vị trị của các hạt
        this.x += this.speedX;
        this.y += this.speedY;

        // if (this.size > PARTICLE_CHANGE_SIZE_SPEED) {
        //     this.size -= PARTICLE_CHANGE_SIZE_SPEED;
        // }

        if (this.size > 0) {
            this.dots.push({
                x: this.x, 
                y: this.y, 
                alpha: 1, 
                size: this.size
            })
        }

        this.dots.forEach( dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        })

        this.dots = this.dots.filter( dot => {
            return dot.size > 0;
        })

        if (this.dots.length == 0) {
            this.remove();
        }

    }

    // Xoá các hạt đã "nổ"
    // remove() {
    //     this.bullet.particles.splice(this.bullet.particle.indexOf(this), 1);
    // }


    draw() {
        this.dots.forEach( dot => {
            this.ctx.fillStyle = 'rgba('+this.color+','+dot.alpha+')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        })
    }
}

class bullet {
    constructor(fireworks){
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT / 2; // Cho pháo nổ chỉ "phần trên" của khung
        this.color = Math.floor(Math.random() * 255) + ',' +
                     Math.floor(Math.random() * 255) + ',' + 
                     Math.floor(Math.random() * 255);

        this.particles = [];

        // Tạo 1 hạt
        let bulletDeg = Math.PI * 2 / NUMBER_PARTICLE_PER_BULLET;
        for (let i=0; i<NUMBER_PARTICLE_PER_BULLET; i++) {
            let newParticle = new particle(this, i * bulletDeg);
            this.particles.push(newParticle);
        }
    }

    // Xoá các hạt đã "nổ"
    // remove() {
    //     this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this),1);
    // }

    update() {
        if (this.particles.length == 0) {
            this.remove();
        }
        this.particles.forEach( particle => particle.update() );
    }

    draw() {
        this.particles.forEach( particle => particle.draw() );
    }
}

class fireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        document.body.appendChild(this.canvas);

        this.bullets = [];

        setInterval( () => {
            // Tạo hạt pháo mới
            let newBullet = new bullet(this);
            this.bullets.push(newBullet);
        }, 1000)
        this.loop();
    }

    // Reset lại liên tục
    loop() {
        this.bullets.forEach( bullet => bullet.update() );
        this.draw();
        setTimeout( () => this.loop(), 20 );
    }

    // Xoá màn hình
    clearScreen() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    draw() {
        this.clearScreen();
        this.bullets.forEach( bullet => bullet.draw() );
    }
}
var f = new fireworks();