/* exported spinner, dismissSpinner */

function spinner(): void {
  document.getElementById("overlay")!.style.display = "inline";
  document.getElementById("spinner")!.style.display = "block";
}

function dismissSpinner(): void {
  document.getElementById("overlay")!.style.display = "none";
  document.getElementById("spinner")!.style.display = "none";
}
