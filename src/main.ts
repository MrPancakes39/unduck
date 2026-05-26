import { bangs } from "./bang";
import "./global.css";
import bingIcon from "./assets/bing.svg";
import braveIcon from "./assets/brave.svg";
import duckduckgoIcon from "./assets/duckduckgo.svg";
import ecosiaIcon from "./assets/ecosia.webp";
import googleIcon from "./assets/google.svg";
import kagiIcon from "./assets/kagi.png";
import mojeekIcon from "./assets/mojeek.png";
import qwantIcon from "./assets/qwant.png";
import startpageIcon from "./assets/startpage.png";
import yahooIcon from "./assets/yahoo.png";
import yandexIcon from "./assets/yandex.png";

const ENGINE_OPTIONS = [
  { name: "Google", bang: "g", icon: googleIcon },
  { name: "Bing", bang: "b", icon: bingIcon },
  { name: "DuckDuckGo", bang: "ddg", icon: duckduckgoIcon },
  {
    name: "Ecosia",
    bang: "ecosia",
    icon: ecosiaIcon,
    iconClass: "engine-select-icon-circle",
  },
  { name: "Yahoo", bang: "y", icon: yahooIcon },
  {
    name: "Yandex",
    bang: "yandex",
    icon: yandexIcon,
    iconClass: "engine-select-icon-rounded",
  },
  { name: "Brave", bang: "brave", icon: braveIcon },
  { name: "Kagi", bang: "kagi", icon: kagiIcon },
  {
    name: "Startpage",
    bang: "sp",
    icon: startpageIcon,
    iconClass: "engine-select-icon-rounded",
  },
  {
    name: "Qwant",
    bang: "qwant",
    icon: qwantIcon,
    iconClass: "engine-select-icon-rounded",
  },
  {
    name: "Mojeek",
    bang: "mojeek",
    icon: mojeekIcon,
    iconClass: "engine-select-icon-rounded",
  },
];

const DEFAULT_ENGINES = ENGINE_OPTIONS;

const isGoogleBang = (bang: string) => bang === "g" || bang === "gweb";

const isDuckDuckGoBang = (bang: string) => bang === "ddg" || bang === "html";

function resolveDefaultBang() {
  const bang = localStorage.getItem("default-bang") ?? "g";
  return bangs.find((b) => b.t === bang) ?? bangs.find((b) => b.t === "g");
}

function setupEngineSelect(
  container: HTMLElement,
  selectedBang: string,
  googleAiSetting: HTMLLabelElement,
  googleAiCheckbox: HTMLInputElement,
  ddgAiSetting: HTMLLabelElement,
  ddgAiCheckbox: HTMLInputElement
) {
  const trigger = container.querySelector<HTMLButtonElement>(
    ".engine-select-trigger"
  )!;
  const list = container.querySelector<HTMLUListElement>(
    ".engine-select-list"
  )!;

  const googleEngine =
    DEFAULT_ENGINES.find((engine) => engine.bang === "g") ??
    DEFAULT_ENGINES[0]!;

  const duckDuckGoEngine =
    DEFAULT_ENGINES.find((engine) => engine.bang === "ddg") ??
    DEFAULT_ENGINES[0]!;

  const getEngine = (bang: string) => {
    if (isGoogleBang(bang)) return googleEngine;
    if (isDuckDuckGoBang(bang)) return duckDuckGoEngine;
    return (
      DEFAULT_ENGINES.find((engine) => engine.bang === bang) ?? googleEngine
    );
  };

  const iconClass = (engine: (typeof DEFAULT_ENGINES)[number]) =>
    ["engine-select-icon", engine.iconClass].filter(Boolean).join(" ");

  const updateGoogleAiSetting = (bang: string) => {
    const googleSelected = isGoogleBang(bang);
    googleAiSetting.hidden = !googleSelected;
    googleAiSetting.classList.toggle("is-visible", googleSelected);
    if (googleSelected) googleAiCheckbox.checked = bang === "g";
  };

  const updateDuckDuckGoAiSetting = (bang: string) => {
    const ddgSelected = isDuckDuckGoBang(bang);
    ddgAiSetting.hidden = !ddgSelected;
    ddgAiSetting.classList.toggle("is-visible", ddgSelected);
    if (ddgSelected) ddgAiCheckbox.checked = bang === "ddg";
  };

  const updateEngineToggles = (bang: string) => {
    updateGoogleAiSetting(bang);
    updateDuckDuckGoAiSetting(bang);
  };

  const renderTrigger = (engine: (typeof DEFAULT_ENGINES)[number]) => {
    trigger.innerHTML = `
      <img src="${engine.icon}" alt="" class="${iconClass(engine)}" />
      <span>${engine.name}</span>
      <span class="engine-select-chevron" aria-hidden="true">▾</span>
    `;
    trigger.setAttribute("aria-expanded", list.hidden ? "false" : "true");
  };

  const close = () => {
    list.hidden = true;
    container.classList.remove("open");
    trigger.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    list.hidden = false;
    container.classList.add("open");
    trigger.setAttribute("aria-expanded", "true");
  };

  const isEngineSelected = (engineBang: string, bang: string) => {
    if (engineBang === "g") return isGoogleBang(bang);
    if (engineBang === "ddg") return isDuckDuckGoBang(bang);
    return engineBang === bang;
  };

  list.innerHTML = DEFAULT_ENGINES.map(
    (engine) => `
      <li>
        <button
          type="button"
          class="engine-select-option${
            isEngineSelected(engine.bang, selectedBang) ? " selected" : ""
          }"
          data-bang="${engine.bang}"
          role="option"
          aria-selected="${isEngineSelected(engine.bang, selectedBang)}"
        >
          <img src="${engine.icon}" alt="" class="${iconClass(engine)}" />
          <span>${engine.name}</span>
        </button>
      </li>
    `
  ).join("");

  renderTrigger(getEngine(selectedBang));
  updateEngineToggles(selectedBang);

  trigger.addEventListener("click", () => {
    if (list.hidden) open();
    else close();
  });

  list.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
      ".engine-select-option"
    );
    if (!button) return;

    const bang = button.dataset.bang!;
    const storedBang = bang === "g" ? "g" : bang === "ddg" ? "ddg" : bang;
    localStorage.setItem("default-bang", storedBang);
    selectedBang = storedBang;

    for (const option of list.querySelectorAll<HTMLButtonElement>(
      ".engine-select-option"
    )) {
      const optionBang = option.dataset.bang!;
      const isSelected = isEngineSelected(optionBang, storedBang);
      option.classList.toggle("selected", isSelected);
      option.setAttribute("aria-selected", String(isSelected));
    }

    renderTrigger(getEngine(storedBang));
    updateEngineToggles(storedBang);
    close();
  });

  googleAiCheckbox.addEventListener("change", () => {
    const bang = googleAiCheckbox.checked ? "g" : "gweb";
    localStorage.setItem("default-bang", bang);
    selectedBang = bang;
    updateEngineToggles(bang);
  });

  ddgAiCheckbox.addEventListener("change", () => {
    const bang = ddgAiCheckbox.checked ? "ddg" : "html";
    localStorage.setItem("default-bang", bang);
    selectedBang = bang;
    updateEngineToggles(bang);
  });

  document.addEventListener("click", (event) => {
    if (!container.contains(event.target as Node)) close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}

function noSearchDefaultPageRender() {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  app.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh;">
      <div class="content-container">
        <h1>Und*ck</h1>
        <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>
        <div class="url-container"> 
          <input 
            type="text" 
            class="url-input"
            value="https://unduck.link?q=%s"
            readonly 
          />
          <button class="copy-button">
            <img src="/clipboard.svg" alt="Copy" />
          </button>
        </div>
        <div class="setting-group">
          <div class="setting">
            <span>Default Search Engine:</span>
            <div class="engine-select" id="default-browser-select">
              <button
                type="button"
                class="engine-select-trigger"
                aria-haspopup="listbox"
                aria-expanded="false"
              ></button>
              <ul class="engine-select-list" role="listbox" hidden></ul>
            </div>
          </div>
          <label class="setting-engine-toggle" id="google-ai-setting" hidden>
            <input type="checkbox" id="google-ai-checkbox" />
            <span>Show Google AI search results</span>
          </label>
          <label class="setting-engine-toggle" id="ddg-ai-setting" hidden>
            <input type="checkbox" id="ddg-ai-checkbox" />
            <span>Show DuckDuckGo AI search results</span>
          </label>
        </div>
      </div>
      <footer class="footer">
        <a href="https://t3.chat" target="_blank">t3.chat</a>
        •
        <a href="https://x.com/theo" target="_blank">theo</a>
        •
        <a href="https://github.com/t3dotgg/unduck" target="_blank">github</a>
      </footer>
    </div>
  `;

  const copyButton = app.querySelector<HTMLButtonElement>(".copy-button")!;
  const copyIcon = copyButton.querySelector("img")!;
  const urlInput = app.querySelector<HTMLInputElement>(".url-input")!;

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(urlInput.value);
    copyIcon.src = "/clipboard-check.svg";

    setTimeout(() => {
      copyIcon.src = "/clipboard.svg";
    }, 2000);
  });

  const engineSelect = app.querySelector<HTMLDivElement>(
    "#default-browser-select"
  )!;
  const googleAiSetting =
    app.querySelector<HTMLLabelElement>("#google-ai-setting")!;
  const googleAiCheckbox = app.querySelector<HTMLInputElement>(
    "#google-ai-checkbox"
  )!;
  const ddgAiSetting = app.querySelector<HTMLLabelElement>("#ddg-ai-setting")!;
  const ddgAiCheckbox =
    app.querySelector<HTMLInputElement>("#ddg-ai-checkbox")!;
  const selectedBang = localStorage.getItem("default-bang") ?? "g";

  setupEngineSelect(
    engineSelect,
    selectedBang,
    googleAiSetting,
    googleAiCheckbox,
    ddgAiSetting,
    ddgAiCheckbox
  );
}

function getBangredirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    noSearchDefaultPageRender();
    return null;
  }

  // Match both !bang and bang! formats
  const prefixMatch = query.match(/!(\S+)/i);
  const suffixMatch = query.match(/(\S+)!/);

  const bangCandidate = (prefixMatch?.[1] ?? suffixMatch?.[1])?.toLowerCase();
  const selectedBang =
    bangs.find((b) => b.t === bangCandidate) ?? resolveDefaultBang();

  // Remove the bang from either position
  const cleanQuery = query
    .replace(/!\S+\s*/i, "") // Remove prefix bang
    .replace(/\s*\S+!/, "") // Remove suffix bang
    .trim();

  // If the query is just `!gh`, use `github.com` instead of `github.com/search?q=`
  if (cleanQuery === "")
    return selectedBang ? `https://${selectedBang.d}` : null;

  // Format of the url is:
  // https://www.google.com/search?q={{{s}}}
  const searchUrl = selectedBang?.u.replace(
    "{{{s}}}",
    // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
    encodeURIComponent(cleanQuery).replace(/%2F/g, "/")
  );
  if (!searchUrl) return null;

  return searchUrl;
}

function doRedirect() {
  const searchUrl = getBangredirectUrl();
  if (!searchUrl) return;
  window.location.replace(searchUrl);
}

doRedirect();
