document.addEventListener("DOMContentLoaded", () => {

  const initParticles = () => {
    const containers = document.querySelectorAll(".results-container, .history-container, .draft-container")

    containers.forEach((container) => {
      if (!container) return

      for (let i = 0; i < 30; i++) {
        const particle = document.createElement("div")
        particle.className = "particle"

        const size = Math.random() * 10 + 5
        const posX = Math.random() * 100
        const posY = Math.random() * 100
        const duration = Math.random() * 20 + 10
        const delay = Math.random() * 5

        particle.style.width = `${size}px`
        particle.style.height = `${size}px`
        particle.style.left = `${posX}%`
        particle.style.top = `${posY}%`
        particle.style.animationDuration = `${duration}s`
        particle.style.animationDelay = `${delay}s`

        container.appendChild(particle)
      }
    })
  }

  const setupParticipants = () => {
    const participants = document.querySelectorAll(".participant-item")
    participants.forEach((participant, index) => {
      participant.style.setProperty("--i", index + 1)
    })
  }

  const setupQuestions = () => {
    const questions = document.querySelectorAll(".question-item")
    questions.forEach((question, index) => {
      question.style.setProperty("--i", index + 1)
    })
  }

  const enhanceChart = () => {
    const chartCanvas = document.querySelector(".chart-container canvas")
    if (chartCanvas) {
      chartCanvas.style.filter = "drop-shadow(0 5px 15px rgba(123, 104, 238, 0.2))"
    }
  }

  const enhanceChartNotice = () => {
    const chartNotice = document.querySelector(".chart-notice")
    if (!chartNotice) return

    // Add animated background
    chartNotice.style.backgroundSize = "200% 200%"

    // Create and add floating emojis
    const addFloatingEmojis = () => {
      const emojis = ["🎯", "📊", "🏆", "⭐", "🚀", "💯", "🔥", "👏"]
      const emoji = document.createElement("div")
      emoji.className = "floating-emoji"
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)]

      const leftPos = Math.random() * 100
      emoji.style.left = `${leftPos}%`

      const duration = 5 + Math.random() * 5
      emoji.style.animationDuration = `${duration}s`

      chartNotice.appendChild(emoji)

      setTimeout(() => {
        emoji.remove()
      }, duration * 1000)
    }
    setInterval(addFloatingEmojis, 1500)
  }

  
  setTimeout(() => {
    initParticles()
    setupParticipants()
    setupQuestions()
    enhanceChart()
    enhanceChartNotice() 
  }, 500)
})
