"use strict";

interface SerializedAction {
	url: string;
	method: string;
	payload: Payload;
	callback: () => void;
}
