document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".annotation-link");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const annotationId = this.getAttribute("data-annotation-id");
      const isActive = this.classList.contains("active");

      if (isActive) {
        closeAnnotation(this, annotationId);
      } else {
        openAnnotation(this, annotationId);
      }
    });
  });

  // Close annotations when clicking outside
  document.addEventListener("click", (event) => {
    const activeTriggers = document.querySelectorAll(".annotation-link.active");

    activeTriggers.forEach((trigger) => {
      const annotationId = trigger.getAttribute("data-annotation-id");
      const container = document.getElementById(annotationId);

      // If the click was not on the trigger itself and not inside the container
      if (
        container &&
        !trigger.contains(event.target) &&
        !container.contains(event.target)
      ) {
        closeAnnotation(trigger, annotationId);
      }
    });
  });

  function openAnnotation(trigger, id) {
    const container = document.getElementById(id);
    if (!container) return;

    // Mark trigger as active
    trigger.classList.add("active");

    // Show container
    container.classList.add("open");

    // Update max-height for animation
    requestAnimationFrame(() => {
      container.style.maxHeight = container.scrollHeight + "px";
    });
  }

  function closeAnnotation(trigger, id) {
    const container = document.getElementById(id);
    if (!container) return;

    container.style.maxHeight = "0px";
    trigger.classList.remove("active");

    container.addEventListener(
      "transitionend",
      () => {
        if (!trigger.classList.contains("active")) {
          container.classList.remove("open");
        }
      },
      { once: true },
    );
  }

  function closeAllAnnotations() {
    document
      .querySelectorAll(".annotation-trigger.active")
      .forEach((trigger) => {
        closeAnnotation(trigger);
      });
  }
});
