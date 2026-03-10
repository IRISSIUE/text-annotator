document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".annotation-link");

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const annotationId = this.getAttribute("data-annotation-id");
      const isActive = this.classList.contains("active");

      if (isActive) {
        closeAnnotation(this);
      } else {
        openAnnotation(this, annotationId);
      }
    });
  });

  function openAnnotation(trigger, id) {
    // To expand "inline" and "down from the line", we insert it after
    // the parent paragraph, but we could also detect the target's
    // position to make it feel even more local.
    const parentElement = trigger.closest("p, div, blockquote, li");

    // Use document fragment for better performance if template is large
    const template = document.getElementById(id);
    if (!template) return;

    const container = document.createElement("div");

    // Dynamic styling: add custom class if trigger has it
    const customStyle = trigger.getAttribute("data-custom-style");
    container.className = `annotation-container clearfix ${customStyle || ""}`;

    // Pass down any inline CSS variables from trigger to container
    const triggerColor = trigger.style.getPropertyValue("--trigger-color");
    if (triggerColor) {
      container.style.setProperty("--accent-color", triggerColor);
      container.style.setProperty(
        "--bg-color",
        `${triggerColor.trim()}10`, // Add transparency to hex or handle appropriately
      );
    }

    const content = template.content.cloneNode(true);
    container.appendChild(content);

    // Insert directly after the block element containing the span
    parentElement.after(container);

    // Mark trigger as active and trigger the slide-down
    trigger.classList.add("active");

    // Force reflow for transition
    void container.offsetHeight;

    container.classList.add("open");
    // Use a small delay or requestAnimationFrame to ensure the DOM has rendered the content
    // and correctly calculated scrollHeight, especially if it contains images.
    requestAnimationFrame(() => {
      container.style.maxHeight = container.scrollHeight + "px";
    });
  }

  function closeAnnotation(trigger) {
    const parentElement = trigger.closest("p, div, blockquote, li");
    const container = parentElement.nextElementSibling;

    if (container && container.classList.contains("annotation-container")) {
      container.style.maxHeight = "0px";
      container.style.opacity = "0";
      trigger.classList.remove("active");

      // Remove from DOM after transition
      container.addEventListener(
        "transitionend",
        () => {
          if (!trigger.classList.contains("active")) {
            container.remove();
          }
        },
        { once: true },
      );
    }
  }

  function closeAllAnnotations() {
    document
      .querySelectorAll(".annotation-trigger.active")
      .forEach((trigger) => {
        closeAnnotation(trigger);
      });
  }
});
