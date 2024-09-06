function runWhenElementIsAvailable(selector, callback) {
  const targetNode = document.body; // You can narrow this down to a specific part of the DOM if necessary

  // Check if the element is already available
  if (document.querySelector(selector)) {
    callback();
    return; // Exit if the element is already found
  }

  // Create an observer instance
  const observer = new MutationObserver(function (mutationsList, observer) {
    if (document.querySelector(selector)) {
      callback(); // Run the script
      observer.disconnect(); // Stop observing once the element is found
    }
  });

  // Start observing the document body for changes
  observer.observe(targetNode, { childList: true, subtree: true });
}

runWhenElementIsAvailable(".cta-logo-block", function () {
  console.log(".cta-logo-block element is available.");
  const gsapScript = document.createElement("script");
  gsapScript.src =
    "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.4.2/gsap.min.js";
  gsapScript.type = "text/javascript";
  document.body.appendChild(gsapScript);

  gsapScript.onload = function () {
    console.log("GSAP loaded");

    // Load Splitting.js after GSAP is loaded
    const splitjS = document.createElement("script");
    splitjS.src = "https://unpkg.com/splitting/dist/splitting.min.js";
    splitjS.type = "text/javascript";
    document.body.appendChild(splitjS);

    splitjS.onload = function () {
      console.log("Splitting.js loaded");

      // Load ScrollTrigger after Splitting.js is loaded
      const trigger = document.createElement("script");
      trigger.src =
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.3.3/ScrollTrigger.min.js";
      trigger.type = "text/javascript";
      document.body.appendChild(trigger);

      trigger.onload = function () {
        console.log("ScrollTrigger loaded");

        // Function to split text into words
        let splitWords = function (selector) {
          var elements = document.querySelectorAll(selector);

          elements.forEach(function (el) {
            el.dataset.splitText = el.textContent;

            el.innerHTML = el.textContent
              .split(/\s/)
              .map(function (word) {
                return word
                  .split("-")
                  .map(function (word) {
                    return '<span class="word">' + word + "</span>";
                  })
                  .join('<span class="hyphen">-</span>');
              })
              .join('<span class="whitespace"> </span>');
          });
        };

        // Function to wrap text lines in span elements
        let splitLines = function (selector) {
          var elements = document.querySelectorAll(selector);
          splitWords(selector);

          elements.forEach(function (el) {
            var lines = getLines(el);
            var wrappedLines = "";

            lines.forEach(function (wordsArr) {
              wrappedLines += '<span class="line"><span class="words">';
              wordsArr.forEach(function (word) {
                wrappedLines += word.outerHTML;
              });
              wrappedLines += "</span></span>";
            });

            el.innerHTML = wrappedLines;
          });
        };

        // Function to get lines of text
        let getLines = function (el) {
          var lines = [];
          var line;
          var words = el.querySelectorAll("span");
          var lastTop;

          for (var i = 0; i < words.length; i++) {
            var word = words[i];

            if (word.offsetTop != lastTop) {
              // Don't start with whitespace
              if (!word.classList.contains("whitespace")) {
                lastTop = word.offsetTop;
                line = [];
                lines.push(line);
              }
            }

            line.push(word);
          }

          return lines;
        };

        // Split lines on ".reveal-text"
        splitLines(".reveal-text");

        // Register ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        // Animate text reveal
        let revealText = document.querySelectorAll(".reveal-text");
        revealText.forEach((element) => {
          const lines = element.querySelectorAll(".words");

          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              toggleActions: "restart none none reset",
            },
          });

          tl.set(element, { autoAlpha: 1 });
          tl.from(lines, 1, {
            yPercent: 100,
            ease: Power3.out,
            stagger: 0.1,
            delay: 0,
          });
        });

        // Animate images
        let revealImages = document.querySelectorAll(".reveal-image");
        revealImages.forEach((element) => {
          const images = element.querySelectorAll("img");

          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: element,
              toggleActions: "restart none none reset",
            },
          });

          tl.set(element, { autoAlpha: 1 });
          tl.from(images, 1, {
            yPercent: 100,
            ease: Power3.out,
            stagger: 0.2,
            delay: 0.1,
          });
        });

        // Apply animation only on screens larger than 568px
        if (window.innerWidth > 568) {
          $(".story-image-wrap").each(function () {
            let triggerElement = $(this);
            let targetElement = triggerElement.find(".story-image-element");

            // Set the initial styles
            gsap.set(targetElement, {
              borderRadius: "100%", // Start with circular border-radius
              width: "65%", // Initial width
            });

            // Animate the border-radius and width
            gsap.to(targetElement, {
              borderRadius: "6.25rem", // Target border-radius after scrolling
              width: "100%", // Target width after scrolling
              ease: "power1.inOut",
              scrollTrigger: {
                trigger: triggerElement,
                start: "top 60%",
                end: "top 20%",
                scrub: 0.5, // Smoothness of the scroll-triggered animation
              },
            });
          });
        }

        // Reapply animations if the window is resized
        window.addEventListener("resize", () => {
          if (window.innerWidth > 568) {
            ScrollTrigger.refresh();
          }
        });

        gsap.registerPlugin(ScrollTrigger);

        gsap.utils.toArray(".paragraph").forEach((paragraph) => {
          gsap.fromTo(
            paragraph,
            {
              y: 100, // Start 100px below
              opacity: 0, // Start fully transparent
            },
            {
              y: 0,
              opacity: 1,
              duration: 3,
              ease: "power3.out",
              scrollTrigger: {
                trigger: paragraph,
                start: "top 80%",
                end: "top 50%",
                scrub: 1,
                markers: false,
              },
            }
          );
        });

        // Function to initialize the image animations
        function initAnimation1() {
          gsap.utils.toArray(".image-container").forEach((image) => {
            gsap.fromTo(
              image,
              { rotation: -20, y: 100 },
              {
                rotation: 10,
                y: -150,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: image,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                  markers: false,
                },
              }
            );
          });
        }

        function initAnimation2() {
          gsap.utils.toArray(".image-move").forEach((image) => {
            gsap.fromTo(
              image,
              { rotation: 20, y: 100 },
              {
                rotation: -10,
                y: -90,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: image,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                  markers: false,
                },
              }
            );
          });
        }

        function initAnimation3() {
          gsap.utils.toArray(".breland").forEach((image) => {
            gsap.fromTo(
              image,
              { rotation: 10, y: 100 },
              {
                rotation: -5,
                y: -70,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: image,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                  markers: false,
                },
              }
            );
          });
        }

        function initAnimation4() {
          gsap.utils.toArray(".left-breland").forEach((image) => {
            gsap.fromTo(
              image,
              { rotation: 10, y: 100 },
              {
                rotation: 5,
                y: -70,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: image,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                  markers: false,
                },
              }
            );
          });
        }

        // Check if the screen width is greater than 568px and initialize animations
        function checkScreenSize() {
          if (window.innerWidth > 568) {
            initAnimation1();
            initAnimation2();
            initAnimation3();
            initAnimation4();
          }
        }

        // Initial check for screen size
        checkScreenSize();

        // Re-check on window resize
        window.addEventListener("resize", () => {
          ScrollTrigger.refresh();
          checkScreenSize();
        });

        // Active state toggle for learning-author-box
        const boxes = document.querySelectorAll(".learning-author-box");

        boxes.forEach(function (box) {
          box.addEventListener("click", function () {
            // Remove active class from all boxes
            boxes.forEach(function (b) {
              b.classList.remove("active");
            });

            // Add active class to the clicked box
            box.classList.add("active");
          });
        });
      };
    };
  };
  // Ensure ScrollTrigger recalculates positions correctly
  // ScrollTrigger.refresh();
});
