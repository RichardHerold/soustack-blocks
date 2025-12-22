import "@soustack/blocks-web";
import { recipeFixture } from "./demo-data";

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
