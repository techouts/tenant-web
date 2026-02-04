import generateCurl from "./generateCurl";
import generateJavaScript from "./generateJavascript";
import generatePython from "./generatePython";
import { ApiSnippetInput } from "./types";

export type Language = "curl" | "javascript" | "python";

export function generateApiSnippet(
  language: Language,
  config: ApiSnippetInput,
): string {
  switch (language) {
    case "curl":
      return generateCurl   (config);
    case "javascript":
      return generateJavaScript(config);
    case "python":
      return generatePython(config);
    default:
      throw new Error("Unsupported language");
  }
}
