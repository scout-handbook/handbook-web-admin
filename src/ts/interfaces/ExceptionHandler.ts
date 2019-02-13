interface ExceptionHandler {
	AuthenticationException?: (response: APIResponse) => void;
	LockedException?: (response: APIResponse) => void;
	SkautISAuthorizationException?: (response: APIResponse) => void;
	readonly [key: string]: ((response: APIResponse) => void)|undefined;
}
