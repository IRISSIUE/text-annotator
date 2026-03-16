import { DataService, MockDataProvider } from "./data-provider.js";
import { GoogleSheetsProvider } from "./google-sheets-provider.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM fully loaded and parsed. Initializing annotation system...");

  // Toggle between providers as needed
  const service = new DataService(GoogleSheetsProvider);
  // const service = new DataService(MockDataProvider);

  const data = await service.getProjectData();

  injectDynamicStyles(data.styles);
  buildAnnotations(data.annotations);
  renderMetadata(data.metadata);
  renderPoemLines(data.lines, data.annotations);
  initializeAnnotationLogic();
});

/**
 * Generate and inject CSS from Styles Data
 */
function injectDynamicStyles(styles) {
  const styleSheet = document.createElement("style");
  let cssRules = "";
  styles.forEach((style) => {
    cssRules += `
            .annotation-link[data-custom-style="${style.id}"] {
                font-family: ${style.fontFamily};
                font-size: ${style.fontSize};
                font-style: ${style.fontStyle};
                font-weight: ${style.fontWeight};
                letter-spacing: ${style.letterSpacing};
                font-stretch: ${style.fontStretch};
                text-transform: ${style.textTransform};
                color: ${style.color};
            }
            .annotation-link[data-custom-style="${style.id}"].active {
                color: ${style.activeColor};
            }
        `;
  });
  styleSheet.textContent = cssRules;
  document.head.appendChild(styleSheet);
}

/**
 * Build the hidden reservoir of annotation content
 */
function buildAnnotations(annotations) {
  const reservoir = document.getElementById("annotations-reservoir");
  if (!reservoir) return;

  annotations.forEach((ann) => {
    const container = document.createElement("div");
    container.id = ann.id;
    container.className = "annotation-container clearfix";

    let mediaHtml = "";
    if (ann.mediaUrl && ann.mediaUrl.trim() !== "") {
      if (ann.mediaUrl.includes("youtube.com")) {
        mediaHtml = `
                    <div class="video-container ${ann.mediaPosition}">
                        <iframe width="100%" height="200" src="${ann.mediaUrl}" frameborder="0" allowfullscreen></iframe>
                    </div>`;
      } else {
        mediaHtml = `<img src="${ann.mediaUrl}" class="${ann.mediaPosition}">`;
      }
    }

    container.innerHTML = `
            <div class="annotation-content">
                ${mediaHtml}
                <p>${ann.content}</p>
            </div>
        `;
    reservoir.appendChild(container);
  });
}

function renderMetadata(metadata) {
  const titleEl = document.getElementById("title");
  const authorEl = document.getElementById("author");
  const annotatorEl = document.getElementById("annotator");
  if (titleEl) titleEl.textContent = metadata.title || "";
  if (authorEl) authorEl.textContent = "By " + metadata.author || "";
  if (annotatorEl)
    annotatorEl.textContent = "Annotated by " + metadata.annotator || "";
}

/**
 * Render poem/text lines and link them to annotations
 */
function renderPoemLines(lines, annotations) {
  const textContainer = document.querySelector(".text-container");
  if (!textContainer) return;

  textContainer.innerHTML = "";
  if (!lines || lines.length === 0) {
    textContainer.textContent = "No lines available.";
    return;
  }
  lines.forEach((line) => {
    const p = document.createElement("p");
    let processedText = line.text;
    const matches = line.text.match(/\[(.*?)\]/g);

    if (matches) {
      matches.forEach((match) => {
        const id = match.replace("[", "").replace("]", "");
        const ann = annotations.find((a) => a.id === id);
        if (ann) {
          const annotatedLinkText = ann.title || id;
          processedText = processedText.replace(
            match,
            `<span class="annotation-link" 
                   data-annotation-id="${id}" 
                   data-custom-style="${ann.styleId}">${annotatedLinkText}</span>`,
          );
        }
      });
    }

    p.innerHTML = processedText;
    textContainer.appendChild(p);
  });
}

/**
 * Setup interaction logic, positioning, and click events
 */
function initializeAnnotationLogic() {
  // Move all annotation containers to their respective triggers
  const allContainers = document.querySelectorAll(".annotation-container");
  allContainers.forEach((container) => {
    const id = container.id;
    const trigger = document.querySelector(
      `.annotation-link[data-annotation-id="${id}"]`,
    );
    if (trigger) {
      const parentElement =
        trigger.closest("p, div, blockquote, li") || trigger;
      parentElement.after(container);
    }
  });

  // Re-bind click events
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

  // Global Click Listener for Close-Away
  document.addEventListener("click", (event) => {
    const activeTriggers = document.querySelectorAll(".annotation-link.active");
    activeTriggers.forEach((trigger) => {
      const annotationId = trigger.getAttribute("data-annotation-id");
      const container = document.getElementById(annotationId);
      if (
        container &&
        !trigger.contains(event.target) &&
        !container.contains(event.target)
      ) {
        closeAnnotation(trigger, annotationId);
      }
    });
  });
}

function openAnnotation(trigger, id) {
  const container = document.getElementById(id);
  if (!container) return;
  trigger.classList.add("active");
  container.classList.add("open");
  requestAnimationFrame(() => {
    container.style.maxHeight = container.scrollHeight + "px";
  });
}

function closeAnnotation(trigger, id) {
  const container = document.getElementById(id);
  if (!container) return;
  trigger.classList.remove("active");
  container.style.maxHeight = "0";
  setTimeout(() => {
    container.classList.remove("open");
  }, 400); // Wait for transition
}
