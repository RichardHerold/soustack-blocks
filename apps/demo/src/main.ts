import "@soustack/blocks-web";
import { init } from "@soustack/embed";
import { interactiveRecipeFixture } from "./demo-data";
import { renderDesignSandbox } from "./design-sandbox";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = "";
  
  const recipeCard = document.createElement("soustack-recipe-card");
  recipeCard.recipe = interactiveRecipeFixture;
  recipeCard.setAttribute("expanded", "");
  
  app.append(recipeCard);
} else {
  throw new Error("Missing #app root element.");
}

// Initialize embed
init();

// Render design sandbox - wait for DOM to be ready
const renderSandboxWhenReady = () => {
  const sandboxContainer = document.getElementById("design-sandbox");
  if (sandboxContainer) {
    renderDesignSandbox(sandboxContainer);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderSandboxWhenReady);
} else {
  // DOM is already ready
  renderSandboxWhenReady();
}
