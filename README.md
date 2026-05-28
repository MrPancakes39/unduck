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
