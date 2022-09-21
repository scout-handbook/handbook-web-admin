<div></div>

<script lang="ts">
import { setMainPageTab, showMainView } from "../../ts/admin/views/main";
if (window.location.pathname.substring(7)) {
setMainPageTab(window.location.pathname.substring(7) as MainPageTab);
}
showMainView(false);
</script>
