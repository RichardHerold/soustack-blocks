// Import to register the custom element
import "@soustack/blocks-web";

/**
 * Discovers a Soustack recipe URL from link tags in the document.
 * Looks for <link rel="alternate" type="application/vnd.soustack+json" href="...">
 * @param doc - Document to search (defaults to document)
 * @returns The resolved URL string, or null if not found
 */
export function discoverSoustackUrl(doc: Document = document): string | null {
  const link = doc.querySelector(
    'link[rel="alternate"][type="application/vnd.soustack+json"]'
  ) as HTMLLinkElement | null;

  if (!link?.href) {
    return null;
  }

  return new URL(link.href, doc.baseURI).toString();
}

/**
 * Resolves a URL relative to a base document.
 */
function resolveUrl(url: string, doc: Document = document): string {
  return new URL(url, doc.baseURI).toString();
}

/**
 * Renders an error message inside a target element.
 */
function renderError(target: Element, message: string): void {
  const errorEl = document.createElement("div");
  errorEl.style.cssText = `
    padding: 0.75rem;
    background: #fee2e2;
    border: 1px solid #fca5a5;
    border-radius: 4px;
    color: #991b1b;
    font-size: 0.875rem;
  `;
  errorEl.textContent = `Error: ${message}`;
  target.innerHTML = "";
  target.appendChild(errorEl);
}

/**
 * Processes a single target element.
 */
async function processTarget(
  target: Element,
  doc: Document = document
): Promise<void> {
  // Determine URL
  const explicitUrl = target.getAttribute("data-soustack");
  const useDiscovery = target.hasAttribute("data-soustack-discover");

  let url: string | null = null;

  if (explicitUrl) {
    url = resolveUrl(explicitUrl, doc);
  } else if (useDiscovery) {
    url = discoverSoustackUrl(doc);
    if (!url) {
      renderError(target, "No Soustack recipe URL found via discovery");
      console.warn("[soustack-embed] Discovery failed for target", target);
      return;
    }
  } else {
    renderError(target, "No URL specified (use data-soustack or data-soustack-discover)");
    console.warn("[soustack-embed] No URL for target", target);
    return;
  }

  // Fetch JSON
  let recipe: unknown;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    recipe = await response.json();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch recipe";
    renderError(target, message);
    console.warn("[soustack-embed] Fetch failed for target", target, error);
    return;
  }

  // Create and configure soustack-recipe element
  const recipeEl = document.createElement("soustack-recipe");
  (recipeEl as any).recipe = recipe;

  // Clear target and append
  target.innerHTML = "";
  target.appendChild(recipeEl);
}

/**
 * Initializes the embed by scanning the DOM for targets and rendering recipes.
 * @param opts - Options object
 * @param opts.root - Root element to search within (defaults to document)
 */
export function init(opts?: { root?: ParentNode }): void {
  const root = opts?.root ?? document;
  const doc = root instanceof Document ? root : root.ownerDocument ?? document;

  // Find all targets
  const targets = Array.from(
    root.querySelectorAll("[data-soustack], [data-soustack-discover]")
  );

  // Process each target
  targets.forEach((target) => {
    processTarget(target, doc).catch((error) => {
      renderError(target, "Unexpected error");
      console.warn("[soustack-embed] Unexpected error for target", target, error);
    });
  });
}

