import { AfterLoadEvent } from "../AfterLoadEvent";
import { authFailHandler, reAuthHandler, request } from "../tools/request";
import { dialog } from "../UI/dialog";
import { Event } from "../interfaces/Event";
import { GROUPS, refreshMetadata } from "../metadata";
import { Participant } from "../interfaces/Participant";
import { parseBoolForm } from "../tools/parseBoolForm";
import { Payload } from "../interfaces/Payload";
import { refreshLogin } from "../tools/refreshLogin";
import { RequestResponse } from "../interfaces/RequestResponse";
import { sidePanelClose, sidePanelOpen } from "../UI/sidePanel";
import { spinner } from "../UI/spinner";
import { User } from "../interfaces/User";
import { UserListResponse } from "../interfaces/UserListResponse";

let participantEvent: AfterLoadEvent;
let addEvent: AfterLoadEvent;
let groupEvent: AfterLoadEvent;

let participants: Array<Participant>;
let users: Array<User>;

function setdiff(a: Array<Participant>, b: Array<User>): Array<Participant> {
  const bArr = b.map(function (x): number {
    return x.id;
  });
  const result = [];
  for (let i = 0; i < a.length; i++) {
    if (bArr.indexOf(a[i].id) < 0) {
      result.push(a[i]);
    }
  }
  return result;
}

function importGroupSave(id: string): void {
  const participants: Array<Participant> = [];
  const nodes = document
    .getElementById("side-panel-form")!
    .getElementsByTagName("input");
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].checked) {
      participants.push({
        id: parseInt(nodes[i].dataset.id!),
        name: nodes[i].dataset.name!,
      });
    }
  }

  if (participants.length === 0) {
    return;
  }

  const html = '<div id="embedded-spinner"></div>';
  document.getElementById("importList")!.innerHTML = html;

  addEvent = new AfterLoadEvent(participants.length);
  for (let i = 0; i < participants.length; i++) {
    request(
      CONFIG["api-uri"] + "/v1.0/user",
      "POST",
      participants[i] as unknown as Payload,
      function (): void {
        addEvent.trigger();
      },
      authFailHandler
    );
  }

  addEvent.addCallback(function (): void {
    groupEvent = new AfterLoadEvent(participants.length);
    for (let i = 0; i < participants.length; i++) {
      const payload = { group: id };
      request(
        CONFIG["api-uri"] +
          "/v1.0/user/" +
          participants[i].id.toString() +
          "/group",
        "PUT",
        payload,
        function (): void {
          groupEvent.trigger();
        },
        authFailHandler
      );
    }

    groupEvent.addCallback(function (): void {
      sidePanelClose();
      spinner();
      dialog("Akce byla úspěšná.", "OK");
      refreshMetadata();
      history.back();
    });
  });

  sidePanelClose();
  spinner();
}

function importGroupSelectParticipantsRender(id: string): void {
  const newparticipants = setdiff(participants, users);
  if (newparticipants.length === 0) {
    sidePanelClose();
    spinner();
    dialog("Akce nemá žádné účastníky (kteří ještě nebyli importováni).", "OK");
    refreshMetadata();
    history.back();
  }
  let html = '<h4>Výběr účastníků:</h4><form id="side-panel-form">';
  for (let i = 0; i < newparticipants.length; i++) {
    html +=
      '<div class="form-row"><label class="form-switch"><input type="checkbox" data-id="' +
      newparticipants[i].id.toString() +
      '" data-name="' +
      newparticipants[i].name +
      '"><span class="form-custom form-checkbox"></span></label>' +
      newparticipants[i].name +
      "</div>";
  }
  html += "</form>";
  document.getElementById("importList")!.innerHTML = html;
  document.getElementById("importGroupNext")!.innerHTML =
    '<i class="icon-floppy"></i>Uložit';
  document.getElementById("importGroupNext")!.onclick = function (): void {
    importGroupSave(id);
  };
}

function importGroupSelectParticipants(id: string): void {
  const eventId = parseBoolForm()[0];
  if (eventId) {
    const html = '<div id="embedded-spinner"></div>';
    document.getElementById("importList")!.innerHTML = html;
    participantEvent = new AfterLoadEvent(2);
    participantEvent.addCallback(importGroupSelectParticipantsRender);
    const exceptionHandler = reAuthHandler;
    exceptionHandler.SkautISAuthorizationException = function (): void {
      sidePanelClose();
      dialog("Pro tuto akci nemáte ve SkautISu dostatečná práva.", "OK");
    };
    request(
      CONFIG["api-uri"] + "/v1.0/event/" + eventId + "/participant",
      "GET",
      {},
      function (response: RequestResponse): void {
        participants = response as Array<Participant>;
        participantEvent.trigger(id);
      },
      exceptionHandler
    );
    request(
      CONFIG["api-uri"] + "/v1.0/user",
      "GET",
      { page: 1, "per-page": 1000, group: id },
      function (response: RequestResponse): void {
        users = (response as UserListResponse).users;
        participantEvent.trigger(id);
      },
      reAuthHandler
    );
    document.getElementById("importGroupNext")!.removeAttribute("onclick");
  }
}

function importGroupSelectEventRender(id: string, events: Array<Event>): void {
  if (events.length === 0) {
    sidePanelClose();
    spinner();
    dialog("Nejste instruktorem na žádné akci.", "OK");
    refreshMetadata();
    history.back();
  }
  let html = '<h4>Volba kurzu:</h4><form id="side-panel-form">';
  for (let i = 0; i < events.length; i++) {
    html +=
      '<div class="form-row"><label class="form-switch"><input type="radio" name="field" data-id="' +
      events[i].id.toString() +
      '"><span class="form-custom form-radio"></span></label>' +
      events[i].name +
      "</div>";
  }
  html += "</form>";
  document.getElementById("importList")!.innerHTML = html;
  document.getElementById("importGroupNext")!.onclick = function (): void {
    importGroupSelectParticipants(id);
  };
}

export function importGroupOnClick(id: string): void {
  sidePanelOpen();
  let html =
    '<div class="button yellow-button" id="side-panel-cancel"><i class="icon-cancel"></i>Zrušit</div>';
  html +=
    '<div class="button green-button" id="importGroupNext"><i class="icon-fast-fw"></i>Pokračovat</div>';
  html +=
    '<h3 class="side-panel-title">Importovat ze SkautISu: ' +
    GROUPS.get(id)!.name +
    "</h3>";
  html += '<div id="importList"><div id="embedded-spinner"></div></div>';
  document.getElementById("side-panel")!.innerHTML = html;
  document.getElementById("side-panel-cancel")!.onclick = function (): void {
    history.back();
  };
  request(
    CONFIG["api-uri"] + "/v1.0/event",
    "GET",
    {},
    function (response: RequestResponse): void {
      importGroupSelectEventRender(id, response as Array<Event>);
    },
    reAuthHandler
  );

  history.pushState({ sidePanel: "open" }, "title", "/admin/groups");
  refreshLogin();
}
