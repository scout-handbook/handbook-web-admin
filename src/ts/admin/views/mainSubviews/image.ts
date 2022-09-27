export function showImagePreview(event: MouseEvent): void {
  const overlay = document.getElementById("overlay")!;
  overlay.style.display = "inline";
  overlay.style.cursor = "pointer";
  const html =
    '<img src="' +
    CONFIG["api-uri"] +
    "/v1.0/image/" +
    (event.target as HTMLElement).dataset.id! +
    '" class="preview-image">';
  overlay.innerHTML = html;
  overlay.onclick = function (): void {
    overlay.style.display = "none";
    overlay.style.cursor = "auto";
    overlay.innerHTML = "";
    overlay.onclick = null;
  };
}
