function initQuizAnimations() {

    document.addEventListener("DOMContentLoaded", () => {

      const quizHeader = document.querySelector(".quiz-header")
      if (quizHeader) {
        quizHeader.classList.add("animate-entrance")
      }
  
      const metaItems = document.querySelectorAll(".quiz-meta-item")
      metaItems.forEach((item, index) => {
        
        item.style.setProperty("--i", index + 1)
  
       
        item.addEventListener("mouseenter", () => {
          item.classList.add("meta-item-hover")
        })
  
        item.addEventListener("mouseleave", () => {
          item.classList.remove("meta-item-hover")
        })
      })
  

      if (quizHeader) {
        quizHeader.addEventListener("mouseenter", createParticles)
      }
    })
  }
  

  function createParticles() {
    const quizHeader = document.querySelector(".quiz-header")
    if (!quizHeader) return
  
 
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "quiz-particle"
  
      // Random position, size and color
      const size = Math.random() * 8 + 2
      const x = Math.random() * quizHeader.offsetWidth
      const y = Math.random() * quizHeader.offsetHeight
      const duration = Math.random() * 2 + 1
      const delay = Math.random() * 0.5
  

      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      particle.style.animationDuration = `${duration}s`
      particle.style.animationDelay = `${delay}s`
  
      // Random color
      const colors = ["#7b68ee", "#4cd3a5", "#6a5acd", "#3bc192"]
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
  
      quizHeader.appendChild(particle)
  
   
      setTimeout(
        () => {
          if (particle.parentNode === quizHeader) {
            quizHeader.removeChild(particle)
          }
        },
        (duration + delay) * 1000,
      )
    }
  }
  
  // Initialize animations
  initQuizAnimations()
  