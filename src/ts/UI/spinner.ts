export function spinner(): void {
  document.getElementById("overlay")!.style.display = "inline";
  document.getElementById("spinner")!.style.display = "block";
}

export function dismissSpinner(): void {
  document.getElementById("overlay")!.style.display = "none";
  document.getElementById("spinner")!.style.display = "none";
}
