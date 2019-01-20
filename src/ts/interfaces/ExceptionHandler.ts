"use strict";

interface ExceptionHandler {
	AuthenticationException?: (response: APIResponse) => void;
	LockedException?: (response: APIResponse) => void;
	readonly [key: string]: ((response: APIResponse) => void)|undefined;
}
