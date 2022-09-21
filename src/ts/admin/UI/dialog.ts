import { dismissSpinner } from "./spinner";

let confirmCallbackWrapped: () => void;

function keyPressDialog(event: KeyboardEvent): void {
  if (event.key === "Enter") {
    confirmCallbackWrapped();
  }
}

function dismissDialog(): void {
  document.getElementById("overlay")!.style.display = "none";
  document.getElementById("dialog")!.style.display = "none";
  document.getElementById("dismiss-text")!.style.display = "none";
  document.removeEventListener("keypress", keyPressDialog);
}

export function dialog(
  mainText: string,
  confirmText: string,
  confirmCallback?: () => void,
  dismissText?: string,
  dismissCallback?: () => void
): void {
  dismissSpinner();
  document.getElementById("overlay")!.style.display = "inline";
  document.getElementById("dialog")!.style.display = "block";
  document.getElementById("dialogText")!.innerHTML = mainText;
  document.getElementById("confirm-text")!.innerHTML =
    '<i class="icon-ok"></i>' + confirmText;
  if (confirmCallback) {
    confirmCallbackWrapped = function (): void {
      dismissDialog();
      confirmCallback();
    };
  } else {
    confirmCallbackWrapped = dismissDialog;
  }
  document.getElementById("confirm-text")!.onclick = confirmCallbackWrapped;
  if (dismissText) {
    document.getElementById("dismiss-text")!.style.display = "inline";
    document.getElementById("dismiss-text")!.innerHTML =
      '<i class="icon-cancel"></i>' + dismissText;
    let dismissCallbackWrapped;
    if (dismissCallback) {
      dismissCallbackWrapped = function (): void {
        dismissDialog();
        dismissCallback();
      };
    } else {
      dismissCallbackWrapped = dismissDialog;
    }
    document.getElementById("dismiss-text")!.onclick = dismissCallbackWrapped;
  } else {
    document.addEventListener("keypress", keyPressDialog);
  }
}
