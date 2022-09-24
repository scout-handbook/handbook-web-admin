<div id="overlay"></div>
<div id="dialog">
	<div id="dialogText"></div>
	<div class="button yellow-button" id="dismiss-text"></div>
	<div class="button" id="confirm-text"></div>
</div>
<div id="spinner"></div>
<main>
	<!-- TODO: Extract from config -->
	<Router basepath="/admin">
		<Route path="lessons/add" component={AddLessonView} />
		<Route path="lessons/:id/edit" let:params>
			<EditLessonView lessonID={params.id} />
		</Route>
		<Route path="lessons/:id/versions/:version/restore" let:params>
			<RestoreLessonView lessonID={params.id} version={params.version} />
		</Route>

		<Route path="lessons" component={MainView} />
		<Route path="competences" component={MainView} />
		<Route path="images" component={MainView} />
		<Route path="users" component={MainView} />
		<Route path="groups" component={MainView} />
	</Router>
</main>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i">

<script lang="ts">
import {Router, Route} from "svelte-navigator";
import AddLessonView from "./AddLessonView.svelte";
import EditLessonView from "./EditLessonView.svelte";
import RestoreLessonView from "./RestoreLessonView.svelte";
import MainView from "./MainView.svelte";
</script>
