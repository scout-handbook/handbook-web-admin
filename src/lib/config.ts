const config = JSON.parse(
  document.documentElement.dataset["config"] ?? "{}",
) as Record<string, string>;

export const adminUri = config["admin-uri"];

export const apiUri = config["api-uri"];

export const frontendUri = config["frontend-uri"];

export const siteName = config["site-name"];
