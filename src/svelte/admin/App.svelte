<!-- TODO: Extract from config -->
<Router basepath="/admin">
	<Route path="lessons" component={MainView}/>
	<Route path="competences" component={MainView}/>
	<Route path="images" component={MainView}/>
	<Route path="users" component={MainView}/>
	<Route path="groups" component={MainView}/>
</Router>

<script lang="ts">
import {Router, Route} from "svelte-navigator";
import MainView from "./MainView.svelte";
</script>
