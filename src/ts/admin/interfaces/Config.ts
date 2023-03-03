export interface ConfigCustomProperties {
  "--accent-color": string;
  "--avatar-border": string;
  "--background": string;
  "--background-darker": string;
  "--background-darkest": string;
  "--border-color": string;
  "--button-accent-cyan": string;
  "--button-accent-green": string;
  "--button-accent-red": string;
  "--button-accent-yellow": string;
  "--button-border": string;
  "--nav-width": string;
  "--non-accented-link-color": string;
  "--overlay-color": string;
  "--overlay-fallback-color": string;
  "--table-border": string;
  "--table-odd-row-background": string;
}

export interface Config {
  "api-uri": string;
  "admin-uri": string;
  "frontend-uri": string;
  "site-name": string;
  "custom-properties": ConfigCustomProperties;
}
