import "@soustack/blocks-web";
import { recipeFixture } from "./demo-data";

const app = document.querySelector<HTMLDivElement>("#app");

if (app) {
  app.innerHTML = "";
  const recipe = document.createElement("soustack-recipe");
  recipe.recipe = recipeFixture;
  app.appendChild(recipe);
} else {
  throw new Error("Missing #app root element.");
}
