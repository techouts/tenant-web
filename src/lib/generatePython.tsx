import { ApiSnippetInput } from "./types";

const generatePython = ({
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

  return `import requests

url = "${url}"
headers = ${JSON.stringify(finalHeaders, null, 2)}
payload = ${body ? JSON.stringify(body, null, 2) : "None"}

response = requests.${method.toLowerCase()}(
    url,
    headers=headers,
    json=payload
)

print(response.json())`;
};
export default generatePython;
