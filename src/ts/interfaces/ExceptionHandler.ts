interface ExceptionHandler {
	AuthenticationException?: ((response: APIResponse) => void)|null;
	LockedException?: ((response: APIResponse) => void)|null;
	SkautISAuthorizationException?: ((response: APIResponse) => void)|null;
	readonly [key: string]: ((response: APIResponse) => void)|null|undefined;
}
