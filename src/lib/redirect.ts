const RENDER_PAGE = Symbol("RENDER_PAGE");

function ensureProtocol(url: string, defaultProtocol = "https://") {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.href; // If valid, return as is
  } catch (e) {
    return `${defaultProtocol}${url}`;
  }
}

type Bang = {
  d: string;
  t: string;
  u: string;
};

function resolveDefaultBang(bangs: Bang[]) {
  const bang = localStorage.getItem("default-bang") ?? "g";
  return bangs.find((b) => b.t === bang) ?? bangs.find((b) => b.t === "g");
}

export async function getBangRedirectUrl() {
  const url = new URL(window.location.href);
  const query = url.searchParams.get("q")?.trim() ?? "";
  if (!query) {
    return RENDER_PAGE;
  }

  const { bangs } = await import("./bangs");

  // Match both !bang and bang! formats
  const prefixMatch = query.match(/!(\S+)/i);
  const suffixMatch = query.match(/(\S+)!/);

  const bangCandidate = (prefixMatch?.[1] ?? suffixMatch?.[1])?.toLowerCase();
  const selectedBang =
    bangs.find((b) => b.t === bangCandidate) ?? resolveDefaultBang(bangs);

  // Remove the bang from either position
  const cleanQuery = query
    .replace(/!\S+\s*/i, "") // Remove prefix bang
    .replace(/\s*\S+!/, "") // Remove suffix bang
    .trim();

  // If the query is just `!gh`, use `github.com` instead of `github.com/search?q=`
  if (cleanQuery === "")
    return selectedBang ? `https://${selectedBang.d}` : null;

  // Redirect to base domain if cleanQuery is empty
  if (!cleanQuery && selectedBang?.d) {
    return ensureProtocol(selectedBang.d);
  }

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
