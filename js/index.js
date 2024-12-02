import { preloadImages } from './utils.js';

// Function to animate the header (frame)
const animateFrame = () => {
  const frame = document.querySelector('.frame'); 
  const frameTitle = frame.querySelector('.frame__title');
  
  gsap.timeline({
    defaults: {
      ease: 'none'
    },
    scrollTrigger: {
      trigger: frame,
      start: 'clamp(top bottom)', 
      end: 'bottom top',
      scrub: true
    }
  })
  .to(frame, {
    yPercent: 35,
    scale: .95,
    startAt: { filter: 'brightness(100%)' },
    filter: 'brightness(10%)'
  })
  .to(frameTitle, {
    xPercent: -80
  }, 0);
};

const animateText = () => {
  const paragraphs = [...document.querySelectorAll("p")];
  let spans = [];

  // Split text into spans once
  paragraphs.forEach((paragraph) => {
    const htmlString = paragraph.textContent
      .split("")
      .map((char) => `<span>${char}</span>`)
      .join("");
    paragraph.innerHTML = htmlString;
  });

  spans = [...document.querySelectorAll("span")];

  // Track scroll event with requestAnimationFrame
  let ticking = false;

  function revealSpans() {
    spans.forEach((span) => {
      const parentRect = span.parentElement.getBoundingClientRect();
      if (parentRect.top < window.innerHeight * 0.8) {
        const { left, top } = span.getBoundingClientRect();
        const adjustedTop = top - window.innerHeight * 0.65;

        let opacityValue =
          1 - (adjustedTop * 0.01 + left * 0.001) < 0.1
            ? 0
            : 1 - (adjustedTop * 0.01 + left * 0.001);

        opacityValue = Math.min(Math.max(opacityValue, 0), 1); // Clamp between 0.1 and 1
        span.style.opacity = opacityValue.toFixed(2);
      }
    });
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        revealSpans();
        ticking = false;
      });
      ticking = true;
    }
  }

  // Attach optimized scroll listener
  window.addEventListener("scroll", onScroll);
  revealSpans(); // Initial call
};



// Function to animate the 2nd header (frame)
const animateSecondFrame= () => {
  const frame = document.querySelector('.secondVideo'); 
  const frameTitle = frame.querySelector('.frame__title');
  
  gsap.timeline({
    defaults: {
      ease: 'none'
    },
    scrollTrigger: {
      trigger: frame,
      start: 'clamp(top top)', 
      end: 'bottom top',
      scrub: true
    }
  })
  .to(frame, {
    yPercent: 35,
    scale: .95,
    startAt: { filter: 'brightness(100%)' },
    filter: 'brightness(10%)'
  })
  .to(frameTitle, {
    xPercent: -80
  }, 0);
};



// Function to animate the first grid
const animateFirstGrid = () => {
  const grid = document.querySelector('[data-grid-first]');
  const gridImages = grid.querySelectorAll('.grid__img');

  gsap.timeline({
    defaults: {
      ease: 'sine'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=250%',
      pin: grid.parentNode,
      scrub: 0.5,
    }
  })
  .from(gridImages, {
    stagger: 0.07,
    y: () => gsap.utils.random(window.innerHeight, window.innerHeight * 1.8)
  })
  // text content
  .from(grid.parentNode.querySelector('.content__title'), {
    duration: 1.2,
    ease: 'power4',
    yPercent: 180,
    autoAlpha: 0
  }, 0.8);
};


/**
 * Calculates the initial translation and 3D rotation of an element, moving and rotating it further away from the center of the screen.
 * The rotation and Z-axis translation are proportional to the distance from the center, with elements near the center rotating less and moving less in Z.
 * 
 * @param {Element} element - The DOM element to calculate the translation and rotation for
 * @param {Number} offsetDistance - The distance by which the element will be moved away from the center (default: 250px)
 * @param {Number} maxRotation - The maximum rotation in degrees for farthest elements (default: 300 degrees)
 * @param {Number} maxZTranslation - The maximum Z-axis translation in pixels for farthest elements (default: 2000px)
 * @returns {Object} The x, y, z translation and rotateX, rotateY values as {x, y, z, rotateX, rotateY}
 */
const calculateInitialTransform = (element, offsetDistance = 250, maxRotation = 300, maxZTranslation = 2000) => {
  const viewportCenter = { width: window.innerWidth / 2, height: window.innerHeight / 2 };
  const elementCenter = { 
    x: element.offsetLeft + element.offsetWidth / 2, 
    y: element.offsetTop + element.offsetHeight / 2 
  };

  // Calculate the angle between the center of the element and the center of the viewport
  const angle = Math.atan2(Math.abs(viewportCenter.height - elementCenter.y), Math.abs(viewportCenter.width - elementCenter.x));

  // Calculate the x and y translation based on the angle and distance
  const translateX = Math.abs(Math.cos(angle) * offsetDistance);
  const translateY = Math.abs(Math.sin(angle) * offsetDistance);

  // Calculate the maximum possible distance from the center (diagonal of the viewport)
  const maxDistance = Math.sqrt(Math.pow(viewportCenter.width, 2) + Math.pow(viewportCenter.height, 2));

  // Calculate the current distance from the center
  const currentDistance = Math.sqrt(Math.pow(viewportCenter.width - elementCenter.x, 2) + Math.pow(viewportCenter.height - elementCenter.y, 2));

  // Scale rotation and Z-translation based on distance from the center (closer elements rotate/translate less, farther ones rotate/translate more)
  const distanceFactor = currentDistance / maxDistance;

  // Calculate the rotation values based on the position relative to the center
  const rotationX = ((elementCenter.y < viewportCenter.height ? -1 : 1) * (translateY / offsetDistance) * maxRotation * distanceFactor);
  const rotationY = ((elementCenter.x < viewportCenter.width ? 1 : -1) * (translateX / offsetDistance) * maxRotation * distanceFactor);

  // Calculate the Z-axis translation (depth) based on the distance from the center
  const translateZ = maxZTranslation * distanceFactor;

  // Determine direction based on position relative to the viewport center
  return {
    x: elementCenter.x < viewportCenter.width ? -translateX : translateX,
    y: elementCenter.y < viewportCenter.height ? -translateY : translateY,
    z: translateZ,
    rotateX: rotationX,
    rotateY: rotationY
  };
};

// Function to animate the fourth grid
const animateFourthGrid = () => {
  const grid = document.querySelector('[data-grid-fourth]');
  const gridImages = grid.querySelectorAll('.grid__img');

  gsap.timeline({
    defaults: {
      ease: 'expo'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode,
      scrub: 0.2,
    }
  })
  .set(grid, {perspective: 1000}) // Add perspective for 3D effect
  .fromTo(gridImages, {
    // Define the starting position based on the pre-calculated translation, rotation, and Z-axis translation values
    x: (_, el) => calculateInitialTransform(el).x,
    y: (_, el) => calculateInitialTransform(el).y,
    z: (_, el) => calculateInitialTransform(el).z, // Z-axis translation
    rotateX: (_, el) => calculateInitialTransform(el).rotateX*.5,
    rotateY: (_, el) => calculateInitialTransform(el).rotateY,
    autoAlpha: 0,
    scale: 0.7,
  }, {
    // Animate the images to their original position and remove transform
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    autoAlpha: 1,
    scale: 1,
    stagger: {
      amount: 0.2,
      from: 'center',
      grid: [4, 9]
    }
  });
};


// Function to animate the sixth grid
const animateSixthGrid = () => {
  const grid = document.querySelector('[data-grid-sixth]');
  const gridImages = grid.querySelectorAll('.grid__img');
  
  gsap.timeline({
    defaults: {
      ease: 'none'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode,
      scrub: 0.5,
    }
  })
  .from(gridImages, {
    stagger: {
      amount: 0.03,
      from: 'edges',
      grid: [3,3]
    },
    scale: 0.7,
    autoAlpha: 0
  })
  .from(grid, {
    scale: .7,
    skewY: 5,
  }, 0);
};

// Function to animate the header (frame)
const animateEnd = () => {
  const frame = document.querySelector('.end_frame'); 
  const frameTitle = frame.querySelector('.end__title');
  
  gsap.timeline({
    defaults: {
      ease: 'none'
    },
    scrollTrigger: {
      trigger: frame,
      start: 'clamp(top bottom)', 
      end: 'bottom bottom',
      scrub: false
    }
  })
  .to(frame, {
    yPercent: 35,
    scale: .95,
    startAt: { filter: 'brightness(100%)' },
    filter: 'brightness(10%)'
  })
  .to(frameTitle, {
    xPercent: -80
  }, 0);
};



// Main initialization function
const init = () => {
  // Animate the header (frame)
  animateFrame();

  // Call animations for each grid based on their data attributes
  animateFirstGrid();
  animateSecondFrame();
  animateFourthGrid();
  animateSixthGrid();
  animateText();
};


// Preload images and initialize animations
preloadImages('.grid__img').then(() => {
  document.body.classList.remove('loading'); // Remove the loading class from the body
  init();
  window.scrollTo(0, 0);
});