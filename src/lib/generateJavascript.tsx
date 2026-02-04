import { ApiSnippetInput } from "./types";

const generateJavaScript = ({
  method,
  url,
  headers = {},
  body,
  apiKey,
}: ApiSnippetInput): string => {
  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
    ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
  };

  return `const response = await fetch("${url}", {
  method: "${method}",
  headers: ${JSON.stringify(finalHeaders, null, 2)},
  body: ${body ? JSON.stringify(body, null, 2) : "undefined"},
});

const data = await response.json();
console.log(data);`;
};

export default generateJavaScript;
