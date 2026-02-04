import { ApiSnippetInput } from "./types";

const generateCurl = ({
  method,
  url,
  headers = {},
  body,
  apiKey,
}: ApiSnippetInput): string => {
  const headerLines = {
    ...headers,
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };

  const headersString = Object.entries(headerLines)
    .map(([key, value]) => `-H "${key}: ${value}"`)
    .join(" \\\n  ");

  const bodyString = body ? ` \\\n  -d '${JSON.stringify(body, null, 2)}'` : "";

  return `curl -X ${method} "${url}" \\
  ${headersString}${bodyString}`;
};

export default generateCurl;