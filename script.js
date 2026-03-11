document.addEventListener("DOMContentLoaded", () => {
  const annotationLinks = document.querySelectorAll(".annotation-link");

  // Move all annotation containers to their respective links
  const containers = document.querySelectorAll(".annotation-container");
  containers.forEach((container) => {
    const id = container.id;
    const annotationLinkId = document.querySelector(
      `.annotation-link[data-annotation-id="${id}"]`,
    );
    if (annotationLinkId) {
      // Find the parent paragraph or block element of the trigger
      const parentElement =
        annotationLinkId.closest("p, div, blockquote, li") || annotationLinkId;
      // Insert the container right after that block element
      parentElement.after(container);
    }
  });

  // Add click event listeners to annotation links
  annotationLinks.forEach((aLink) => {
    aLink.addEventListener("click", function () {
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
});
