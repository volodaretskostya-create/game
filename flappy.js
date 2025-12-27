let cvs = document.getElementById("canvas")
let ctx = cvs.getContext("2d")

let scoreElem = document.getElementById("score")
let bestScoreElem = document.getElementById("best_score")

let scoreValue = 0
let bestScoreValue = 0

cvs.width = 256
cvs.height = 512

let bird = new Image()
bird.src = "img/bird.png"

let fly_audio = new Audio()
fly_audio.src = "audio/fly.mp3"

let score_audio = new Audio()
score_audio.src = "audio/score.mp3"

let back = new Image()
back.src = "img/back.png"

let pippe_bottom = new Image()
pippe_bottom.src = "img/pipeBottom.png"

let pippe_up = new Image()
pippe_up.src = "img/pipeUp.png"

let road = new Image()
road.src = "img/road.png"

let velY = 0
let gravity = 0.2

let xPos = 10
let yPos = 0
let gap = 110
let pause = false
let pipe = []
pipe[0] = {
    x: cvs.width,
    y: 0
}

function draw() {
    if (!pause) {
        ctx.drawImage(back, 0, 0)
        ctx.drawImage(bird, xPos, yPos)
        if (yPos + bird.height >= cvs.height - road.height) {
            resetY()
        }
        velY += gravity
        yPos += velY

        for (let i = 0; i < pipe.length; i++) {
            if (pipe[i].x < -pippe_up.width) {
                pipe.shift()
            } else {
                ctx.drawImage(pippe_up, pipe[i].x, pipe[i].y)
                ctx.drawImage(pippe_bottom, pipe[i].x, pipe[i].y + pippe_up.height + gap)

                pipe[i].x -= 2

                if (pipe[i].x == 80) {
                    pipe.push({
                        x: cvs.width,
                        y: Math.floor(Math.random() * pippe_up.height) - pippe_up.height
                    })
                }

            }

            if (xPos + bird.width >= pipe[i].x &&
                xPos <= pipe[i].x + pippe_up.width &&
                (yPos <= pipe[i].y + pippe_up.height ||
                    yPos + bird.height >= pipe[i].y + pippe_up.height + gap)) {
                resetY()
            }
            if (pipe[i].x === 0) {
                scoreValue++
                score_audio.play()
            }
        }
        ctx.drawImage(road, 0, cvs.height - road.height)
        scoreElem.innerHTML = "SCORE:" + scoreValue
        bestScoreElem.innerHTML = "BEST|SCORE:" + bestScoreValue
    } else {
        ctx.drawImage(back, 0, 0)
        ctx.drawImage(bird, xPos, yPos)
        for (let i = 0; i < pipe.length; i++) {
            ctx.drawImage(pippe_up, pipe[i].x, pipe[i].y)
            ctx.drawImage(pippe_bottom, pipe[i].x, pipe[i].y + pippe_up.height + gap)
        }
        ctx.drawImage(road, 0, cvs.height - road.height)
        ctx.fillStyle = `rgba(0, 0, 0, .2)`
        ctx.fillRect(0, 0, canvas.width, canvas.height)


    }
}

cvs.addEventListener("mousedown", moveUp)

function moveUp() {
    velY = -4
    fly_audio.play()
}

function resetY() {
    if (scoreValue > bestScoreValue) {
        bestScoreValue = scoreValue
    }

    scoreValue = 0
    xPos = 10, yPos = 0
    velY = 0
    gravity = 0.2

    pipe = []
    pipe[0] = {
        x: cvs.width,
        y: 0
    }
}

function game_pause() {
    pause = !pause
}

setInterval(draw, 20)
