import "./global.css";
import "./lib/analytics";
import { RootPage } from "./components/root-page";
import { getBangRedirectUrl } from "./lib/redirect";

function main() {
  const searchUrl = getBangRedirectUrl();

  // Error case
  if (searchUrl == null) return;

  // Redirect case
  if (typeof searchUrl === "string") {
    window.location.replace(searchUrl);
    return;
  }

  // Render page case
  new RootPage().mount();
}

main();
