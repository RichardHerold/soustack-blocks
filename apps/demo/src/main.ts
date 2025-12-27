import "@soustack/blocks-web";
import { init } from "@soustack/embed";
import { recipeFixture, interactiveRecipeFixture } from "./demo-data";
import { renderDesignSandbox } from "./design-sandbox";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = "";
  
  // Section for new interactive recipe card
  const interactiveSection = document.createElement("section");
  interactiveSection.style.cssText = "padding: 2rem; background: #f9fafb; border-bottom: 3px solid #ff6b35; margin-bottom: 2rem;";
  
  const interactiveHeader = document.createElement("h2");
  interactiveHeader.textContent = "✨ New: Interactive Recipe Card";
  interactiveHeader.style.cssText = "margin: 0 0 1rem 0; font-size: 1.5rem; color: #1f2937; font-weight: 600;";
  
  const interactiveDescription = document.createElement("p");
  interactiveDescription.textContent = "Try the new <soustack-recipe-card> component with scaling controls and Mise en place view. Click the header to expand!";
  interactiveDescription.style.cssText = "margin: 0 0 1.5rem 0; color: #6b7280; font-size: 0.9375rem;";
  
  const recipeCard = document.createElement("soustack-recipe-card");
  recipeCard.recipe = interactiveRecipeFixture;
  recipeCard.setAttribute("expanded", "");
  
  interactiveSection.append(interactiveHeader, interactiveDescription, recipeCard);
  
  // Section for existing components
  const existingSection = document.createElement("section");
  existingSection.style.cssText = "padding: 2rem;";
  
  const existingHeader = document.createElement("h2");
  existingHeader.textContent = "Existing Components";
  existingHeader.style.cssText = "margin: 0 0 1.5rem 0; font-size: 1.5rem; color: #1f2937; font-weight: 600;";
  
  const badgesUser = document.createElement("soustack-badges");
  badgesUser.mode = "user";
  badgesUser.recipe = recipeFixture;

  const badgesDev = document.createElement("soustack-badges");
  badgesDev.mode = "dev";
  badgesDev.recipe = recipeFixture;

  const recipe = document.createElement("soustack-recipe");
  recipe.recipe = recipeFixture;

  existingSection.append(existingHeader, badgesUser, badgesDev, recipe);

  app.append(interactiveSection, existingSection);
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
