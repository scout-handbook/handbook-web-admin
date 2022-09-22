<!-- TODO: Extract from config -->
<Router basepath="/admin">
	<Route path="lessons/add" component={AddLessonView} />
	<Route path="lessons/:id/edit" let:params>
		<EditLessonView lesson={params.id} />
	</Route>

	<Route path="lessons" component={MainView} />
	<Route path="competences" component={MainView} />
	<Route path="images" component={MainView} />
	<Route path="users" component={MainView} />
	<Route path="groups" component={MainView} />
</Router>

<script lang="ts">
import {Router, Route} from "svelte-navigator";
import AddLessonView from "./AddLessonView.svelte";
import EditLessonView from "./EditLessonView.svelte";
import MainView from "./MainView.svelte";
</script>
