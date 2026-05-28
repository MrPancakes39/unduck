# Re:Search Rebrand Plan

## Summary

Rebrand this Unduck fork to **Re:Search**, update the public hosted URL to `https://research.mrpancakes39.xyz/`, refresh README/OpenSearch/browser metadata, and lightly restyle the homepage with a minimal pink tint.

## Scope

Update:

- `src/main.ts`
- `src/global.css`
- `public/opensearch.xml`
- `index.html`
- `README.md`
- `package.json`

Do not update:

- `src/bang.ts` bang dataset entries
- `LICENSE` upstream copyright
- `TODO.html`, unless it is intentionally deployed or linked

## Website Copy And Links

In `src/main.ts`, change the homepage title to:

```html
<h1>Re:Search</h1>
```

Change the custom search URL input value to:

```text
https://research.mrpancakes39.xyz/?q=%s
```

Remove the `t3.chat` footer link.

Change footer links to:

```html
<a href="https://mrpancakes39.xyz" target="_blank">sal</a>
•
<a href="https://github.com/MrPancakes39/unduck" target="_blank">github</a>
```

Keep:

- Default search engine selector
- Copy button behavior
- Google AI checkbox behavior
- DuckDuckGo AI checkbox behavior

## UI Styling

Use the `ui` skill guidance for the visual pass.

In `src/global.css`:

- Keep the page minimal, centered, and utility-focused.
- Add a restrained pink tint.
- Use readable dark text on a soft pink background.
- Avoid gradients, decorative blobs, marketing sections, or major layout changes.
- Ensure the longer URL fits on mobile.
- Keep border radius small, around `4px`, to match the existing utility feel.

Suggested palette:

```css
--page-bg: #fff7fb;
--text: #24141c;
--muted: #7a5c69;
--border: #efbfd2;
--surface: #fffafd;
--surface-hover: #fdebf4;
--accent: #d9468f;
--accent-soft: #f8cfe0;
```

Implementation notes:

- Add CSS variables under `:root`.
- Apply `background: var(--page-bg)` and `color: var(--text)` to `body`.
- Use pink-tinted borders/focus/hover states for inputs, buttons, and the custom engine select.
- Make `.content-container` responsive with enough horizontal padding.
- On narrow screens, allow `.url-container` to remain usable without overflow.
- Preserve native checkbox behavior; do not add JavaScript solely for visual checkbox state.
- Inputs and buttons should stay at least `16px` text size on mobile.

## OpenSearch

In `public/opensearch.xml`, change:

```xml
<ShortName>Re:Search</ShortName>
<Description>A fast bang-powered default search engine.</Description>
<Tags>research search bangs</Tags>
<Url type="text/html" method="GET" template="https://research.mrpancakes39.xyz/?q={searchTerms}"/>
<Image height="16" width="16" type="image/svg+xml">https://research.mrpancakes39.xyz/search.svg</Image>
```

Keep:

```xml
<InputEncoding>UTF-8</InputEncoding>
<OutputEncoding>UTF-8</OutputEncoding>
<Query role="example" searchTerms="!g cats"/>
```

## HTML Metadata

In `index.html`, change the OpenSearch title:

```html
title="Re:Search"
```

Change page title:

```html
<title>Re:Search</title>
```

Change meta description:

```html
<meta name="description" content="A fast bang-powered default search engine." />
```

Change Plausible domain:

```html
data-domain="research.mrpancakes39.xyz"
```

Keep:

```html
<link rel="icon" type="image/svg+xml" href="/search.svg" />
<link rel="search" type="application/opensearchdescription+xml" href="/opensearch.xml" />
```

## README

Rewrite `README.md` to be fork-aware and minimal.

Required content:

````md
# Re:Search

Re:Search is a fork of Unduck.

DuckDuckGo's bang redirects can be slow. Re:Search lets you add a custom browser search engine that supports DuckDuckGo bangs while doing the redirect work client-side.

This fork is hosted on Netlify at https://research.mrpancakes39.xyz/.

## Browser Setup

Use this URL as your custom search engine URL:

```text
https://research.mrpancakes39.xyz/?q=%s
```

## How It Works

DuckDuckGo handles bang redirects server-side. Re:Search keeps the bang lookup in the client so, after the app is loaded, your browser can resolve redirects directly.

## Browser Guides

- **Chrome**: [Set default search engine and site search shortcuts](https://support.google.com/chrome/answer/95426)
- **Firefox**: [Change your default search settings in Firefox](https://support.mozilla.org/en-US/kb/change-your-default-search-settings-firefox)
- **Edge**: [Change your default search engine in Microsoft Edge](https://support.microsoft.com/en-us/microsoft-edge/change-your-default-search-engine-in-microsoft-edge-cccaf51c-a4df-a43e-8036-d4d2c527a791)
- **Brave**: [How do I set my default search engine?](https://support.brave.com/hc/en-us/articles/360017479752-How-do-I-set-my-default-search-engine)
````

Remove:

- Upstream YouTube thumbnail section
- First-person upstream wording
- `https://unduck.link`

## Package Metadata

In `package.json`, change:

```json
"name": "re-search"
```

Leave scripts and dependencies unchanged.

## Explicit Non-Changes

Do not edit `LICENSE`.

- It currently attributes upstream copyright to Theo Browne.
- Preserve upstream license attribution for the fork.

Do not edit `src/bang.ts`.

- Matches like `t3.chat`, `github`, `theo`, and `unduck` inside this file are bang dataset entries or comments.
- Changing them could break search behavior.

Do not edit `TODO.html` by default.

- It appears to be a standalone PR triage artifact with historical upstream links.
- If this file is deployed intentionally, only update its visible/page title from `Unduck` to `Re:Search`; leave historical PR links intact.

## Verification

Run:

```sh
pnpm run build
```

Then search for stale public branding:

```sh
rg "Und\\*ck|unduck\\.link|t3\\.chat|x\\.com/theo|t3dotgg/unduck" --glob '!src/bang.ts' .
```

Expected result:

- No matches in active site, README, OpenSearch, package metadata, or HTML metadata.
- Matches in `TODO.html` are acceptable only if intentionally preserved.

Manual checks:

- Homepage heading is `Re:Search`.
- Install URL is `https://research.mrpancakes39.xyz/?q=%s`.
- Copy button copies that exact URL.
- Footer shows only `sal` and `github`.
- `sal` links to `https://mrpancakes39.xyz`.
- `github` links to `https://github.com/MrPancakes39/unduck`.
- OpenSearch XML uses `Re:Search` and `research.mrpancakes39.xyz`.
- README mentions this is a fork of Unduck and hosted on Netlify.

## Assumptions

- `https://research.mrpancakes39.xyz/` is the canonical production URL.
- The OpenSearch/search-engine template should include the slash before the query string.
- The repository remains named `unduck`, so the GitHub link points to `MrPancakes39/unduck`.
- The homepage should remain a minimal utility page, not a landing page.
