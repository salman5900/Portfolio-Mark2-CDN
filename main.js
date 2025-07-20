// Hamburger menu toggle
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

function toggleMenu() {
  const isOpen = sideMenu.classList.toggle("open");
  overlay.classList.toggle("active", isOpen);
  hamburgerBtn.setAttribute("aria-expanded", isOpen);
  sideMenu.setAttribute("aria-hidden", !isOpen);
}

hamburgerBtn.addEventListener("click", toggleMenu);
overlay.addEventListener("click", toggleMenu);

// Typing animation logic
function runTypingAnimation() {
  const lines = [
    "> Booting terminal...",
    "> Started coding in 2022 🧠",
    "> 2023: Build my my first ever app  🚀",
    "> 2024: Freelance projects & experiments 💼",
    "> 2025: Full-stack dev with AI integrations 🤖",
  ];

  const output = document.getElementById("console-output");
  let i = 0;
  let j = 0;
  let currentLine = "";

  function typeLine() {
    if (i < lines.length) {
      if (j < lines[i].length) {
        currentLine += lines[i][j++];
        output.innerHTML = currentLine + '<span class="blinker">|</span>';
        setTimeout(typeLine, 35);
      } else {
        currentLine += "\n";
        output.innerHTML = currentLine;
        i++;
        j = 0;
        setTimeout(typeLine, 250);
      }
    } else {
      output.innerHTML = currentLine + '<span class="blinker">|</span>';
    }
  }

  // Reset
  output.innerHTML = "";
  currentLine = "";
  i = 0;
  j = 0;

  typeLine();
}

// Parallax tilt effect based on mouse position
const card = document.getElementById("terminal-card");
const wrapper = document.getElementById("terminal-wrapper");

let currentX = 0;
let currentY = 0;
let currentScale = 1;
let targetX = 0;
let targetY = 0;
let targetScale = 1;

const easing = 0.35;

function animate() {
  currentX += (targetX - currentX) * easing;
  currentY += (targetY - currentY) * easing;
  currentScale += (targetScale - currentScale) * easing;

  card.style.transform = `perspective(1000px) rotateX(${currentX}deg) rotateY(${currentY}deg) scale(${currentScale})`;
  requestAnimationFrame(animate);
}
animate();

wrapper.addEventListener("mousemove", (e) => {
  const rect = wrapper.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = -((y - centerY) / centerY) * 6;
  const rotateY = ((x - centerX) / centerX) * 6;

  const distance = Math.sqrt(
    Math.pow((x - centerX) / centerX, 2) + Math.pow((y - centerY) / centerY, 2)
  );

  const isNearCorner =
    (x < 80 && y < 80) ||
    (x > rect.width - 80 && y < 80) ||
    (x < 80 && y > rect.height - 80) ||
    (x > rect.width - 80 && y > rect.height - 80);

  targetX = rotateX;
  targetY = rotateY;
  targetScale = isNearCorner ? 1 : 1 - distance * 0.015;
});

wrapper.addEventListener("mouseleave", () => {
  targetX = 0;
  targetY = 0;
  targetScale = 1;
});

// text animation
const consoleOutput = document.getElementById("console-output");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        consoleOutput.classList.add("opacity-100", "translate-y-0");
        consoleOutput.classList.remove("opacity-0", "translate-y-4");

        runTypingAnimation(); // 🔥 Run animation when in view
      } else {
        consoleOutput.classList.remove("opacity-100", "translate-y-0");
        consoleOutput.classList.add("opacity-0", "translate-y-4");
      }
    });
  },
  {
    threshold: 0.5,
  }
);

observer.observe(consoleOutput);

// dynamic navbar
const navbar = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 10) {
    navbar.classList.add("bg-navbar");
  } else {
    navbar.classList.remove("bg-navbar");
  }
});

// animation for skills
document.addEventListener("DOMContentLoaded", () => {
  const tiles = document.querySelectorAll(".glass-tile");

  const revealGroups = () => {
    for (let i = 0; i < tiles.length; i += 3) {
      const group = [tiles[i], tiles[i + 1], tiles[i + 2]].filter(Boolean);
      const rects = group.map((tile) => tile.getBoundingClientRect());
      const inView = rects.some((rect) => rect.top < window.innerHeight - 100);

      group.forEach((tile) => {
        tile.classList.toggle("group-visible", inView);
      });
    }
  };

  window.addEventListener("scroll", revealGroups);
  revealGroups(); // run once on load
});

// side show
let portfolioSliderCurrentIndex = 0;
const portfolioSliderTotalSlides = 4;
const portfolioSliderItems = document.querySelectorAll(".slider-item");
const portfolioSliderDots = document.querySelectorAll(".dot");
const portfolioSliderProgressBar = document.getElementById("progress-bar");
const portfolioSliderWrapper = document.querySelector(".relative.max-w-6xl");

// Auto-play variables
let portfolioSliderAutoPlayTimer;
let portfolioSliderAutoPlayRunning = false;
let portfolioSliderUserInteracting = false;

function updatePortfolioSlider() {
  portfolioSliderItems.forEach((slide, index) => {
    slide.style.transform = `translateX(${
      (index - portfolioSliderCurrentIndex) * 100
    }%)`;
  });

  // Update dots
  portfolioSliderDots.forEach((dot, index) => {
    if (index === portfolioSliderCurrentIndex) {
      dot.classList.remove("bg-gray-600", "hover:bg-gray-500");
      dot.classList.add("bg-amber-400", "scale-125");
    } else {
      dot.classList.remove("bg-amber-400", "scale-125");
      dot.classList.add("bg-gray-600", "hover:bg-gray-500");
    }
  });

  // Update progress bar
  portfolioSliderProgressBar.style.width = `${
    ((portfolioSliderCurrentIndex + 1) / portfolioSliderTotalSlides) * 100
  }%`;
}

function nextPortfolioSlide() {
  portfolioSliderCurrentIndex =
    (portfolioSliderCurrentIndex + 1) % portfolioSliderTotalSlides;
  updatePortfolioSlider();
}

function prevPortfolioSlide() {
  portfolioSliderCurrentIndex =
    (portfolioSliderCurrentIndex - 1 + portfolioSliderTotalSlides) %
    portfolioSliderTotalSlides;
  updatePortfolioSlider();
}

function goToPortfolioSlide(index) {
  portfolioSliderCurrentIndex = index;
  updatePortfolioSlider();
}

// Auto-play functions
function startPortfolioSliderAutoPlay() {
  if (!portfolioSliderUserInteracting && !portfolioSliderAutoPlayRunning) {
    portfolioSliderAutoPlayTimer = setInterval(nextPortfolioSlide, 8000);
    portfolioSliderAutoPlayRunning = true;
  }
}

function stopPortfolioSliderAutoPlay() {
  if (portfolioSliderAutoPlayTimer) {
    clearInterval(portfolioSliderAutoPlayTimer);
    portfolioSliderAutoPlayTimer = null;
    portfolioSliderAutoPlayRunning = false;
  }
}

function handlePortfolioSliderUserInteraction() {
  portfolioSliderUserInteracting = true;
  stopPortfolioSliderAutoPlay();

  // Resume auto-play after 3 seconds of no interaction
  setTimeout(() => {
    portfolioSliderUserInteracting = false;
    if (checkPortfolioSliderVisibility()) {
      startPortfolioSliderAutoPlay();
    }
  }, 3000);
}

// Check if slider is visible in viewport
function checkPortfolioSliderVisibility() {
  const rect = portfolioSliderWrapper.getBoundingClientRect();
  const windowHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return (
    rect.top < windowHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

// Intersection Observer for visibility
const portfolioSliderVisibilityObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Slider is visible
        if (!portfolioSliderUserInteracting) {
          startPortfolioSliderAutoPlay();
        }
      } else {
        // Slider is not visible
        stopPortfolioSliderAutoPlay();
      }
    });
  },
  {
    threshold: 0.3, // Trigger when 30% of slider is visible
  }
);

// Start observing the slider
portfolioSliderVisibilityObserver.observe(portfolioSliderWrapper);

// Event listeners with user interaction handling
document.getElementById("nextBtn").addEventListener("click", () => {
  handlePortfolioSliderUserInteraction();
  nextPortfolioSlide();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  handlePortfolioSliderUserInteraction();
  prevPortfolioSlide();
});

portfolioSliderDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    handlePortfolioSliderUserInteraction();
    goToPortfolioSlide(index);
  });
});

// Keyboard navigation without stopping auto-play
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    nextPortfolioSlide();
  }
  if (e.key === "ArrowLeft") {
    prevPortfolioSlide();
  }
});

// Pause auto-play on hover
portfolioSliderWrapper.addEventListener("mouseenter", () => {
  if (portfolioSliderAutoPlayRunning) {
    stopPortfolioSliderAutoPlay();
  }
});

portfolioSliderWrapper.addEventListener("mouseleave", () => {
  if (!portfolioSliderUserInteracting && checkPortfolioSliderVisibility()) {
    startPortfolioSliderAutoPlay();
  }
});

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopPortfolioSliderAutoPlay();
  } else if (
    !portfolioSliderUserInteracting &&
    checkPortfolioSliderVisibility()
  ) {
    startPortfolioSliderAutoPlay();
  }
});

// test
document.addEventListener("DOMContentLoaded", function () {
  const boxes = document.querySelectorAll(".retro-box");
  let currentPattern = Array(boxes.length).fill(false);

  // Retro gaming patterns - different fill configurations
  const patterns = [
    [true, false, true, false, true, false, true, false, true],
    [false, true, false, true, false, true, false, true, false],
    [true, true, false, false, true, true, false, false, true],
    [false, false, true, true, false, false, true, true, false],
    [true, false, false, true, true, false, false, true, true],
    [false, true, true, false, false, true, true, false, false],
    [true, true, true, false, false, false, true, true, true],
    [false, false, false, true, true, true, false, false, false],
  ];

  let patternIndex = 0;

  function animateToPattern(targetPattern) {
    boxes.forEach((box, index) => {
      const delay = parseFloat(box.dataset.delay) * 1000;
      const currentState = currentPattern[index];
      const targetState = targetPattern[index];

      setTimeout(() => {
        if (currentState !== targetState) {
          // Add transition class
          box.classList.add(targetState ? "filling" : "unfilling");

          // Add scanning effect
          box.style.background = targetState
            ? "linear-gradient(90deg, #1a1a1a 0%, #fbbf24 50%, #1a1a1a 100%)"
            : "linear-gradient(90deg, #fbbf24 0%, #1a1a1a 50%, #fbbf24 100%)";

          box.style.backgroundSize = "200% 100%";

          // Complete the transition
          setTimeout(() => {
            box.classList.remove("filling", "unfilling");
            if (targetState) {
              box.classList.add("active");
            } else {
              box.classList.remove("active");
            }
            box.style.background = "";
            box.style.backgroundSize = "";
          }, 800);
        }
      }, delay);
    });

    currentPattern = [...targetPattern];
  }

  // Start the animation loop
  function startRetroLoop() {
    animateToPattern(patterns[patternIndex]);
    patternIndex = (patternIndex + 1) % patterns.length;
  }

  // Initial animation
  setTimeout(startRetroLoop, 500);

  // Continue the loop
  setInterval(startRetroLoop, 4000);

  // Add some retro sound effects simulation with visual feedback
  boxes.forEach((box) => {
    box.addEventListener("click", function () {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "";
      }, 150);
    });
  });
});

// for cilent section
document.querySelectorAll(".interactive-element").forEach((element) => {
  element.addEventListener("mouseenter", function () {
    this.style.transform = "scale(1.2)";
    this.style.filter =
      "brightness(1.5) drop-shadow(0 0 10px rgba(251, 191, 36, 0.8))";
  });

  element.addEventListener("mouseleave", function () {
    this.style.transform = "";
    this.style.filter = "";
  });
});

// Restart typewriter animation
setInterval(() => {
  const typewriter = document.querySelector(".typewriter");
  typewriter.style.animation = "none";
  setTimeout(() => {
    typewriter.style.animation =
      "typewriter 3s steps(30) infinite, blink 1s step-end infinite";
  }, 100);
}, 6000);

// Service cards hover effect enhancement
document.querySelectorAll(".service-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.querySelector("svg").style.transform = "rotate(360deg) scale(1.2)";
    this.querySelector("svg").style.transition = "all 0.5s ease";
  });

  card.addEventListener("mouseleave", function () {
    this.querySelector("svg").style.transform = "";
  });
});

// Add random sparkle effects
function createSparkle() {
  const sparkle = document.createElement("div");
  sparkle.className = "absolute w-1 h-1 bg-amber-400 rounded-full opacity-0";
  sparkle.style.left = Math.random() * 100 + "%";
  sparkle.style.top = Math.random() * 100 + "%";

  document.querySelector("section").appendChild(sparkle);

  sparkle
    .animate(
      [
        { opacity: 0, transform: "scale(0)" },
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0)" },
      ],
      {
        duration: 2000,
        easing: "ease-out",
      }
    )
    .addEventListener("finish", () => sparkle.remove());
}

// Create sparkles periodically
setInterval(createSparkle, 3000);

function showIssuePopup() {
  alert("There is a small issue with the links. The dev is on it 🚧");
}
