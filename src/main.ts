import "./global.css";
import { RootPage } from "./components/root-page";
import { getBangRedirectUrl } from "./lib/redirect";

async function main() {
  const searchUrl = await getBangRedirectUrl();

  // Error case
  if (searchUrl == null) return;

  // Redirect case
  if (typeof searchUrl === "string") {
    window.location.replace(searchUrl);
    return;
  }

  // Render page case
  await import("./lib/analytics");
  new RootPage().mount();
}

main();
