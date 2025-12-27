import "@soustack/blocks-web";
import { init } from "@soustack/embed";
import { recipeFixture } from "./demo-data";
import { renderDesignSandbox } from "./design-sandbox";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = "";
  const badgesUser = document.createElement("soustack-badges");
  badgesUser.mode = "user";
  badgesUser.recipe = recipeFixture;

  const badgesDev = document.createElement("soustack-badges");
  badgesDev.mode = "dev";
  badgesDev.recipe = recipeFixture;

  const recipe = document.createElement("soustack-recipe");
  recipe.recipe = recipeFixture;

  app.append(badgesUser, badgesDev, recipe);
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
