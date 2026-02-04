export const capitalizeAndCleanString = (input: string): string => {
  return input
    ?.replace(/[^a-zA-Z0-9\s_]/g, "")
    ?.split(/[\s_]+/)
    ?.map(
      (word) => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase(),
    )
    ?.join(" ");
};
export const extractText = (value: string, key: string): string => {
  if (typeof value !== "string" || typeof key !== "string") return "";
  return value?.replace(key?.slice(0, key?.length), "");
};

export const toHyphenatedString = (str: string): string => {
  return str?.toLowerCase()?.replace(/\s+/g, "_");
};
