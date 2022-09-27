<script lang="ts">
  import { addImage } from "../../ts/admin/actions/addImage";
  import { config } from "../../ts/admin/stores";
  import { downloadImageList } from "../../ts/admin/views/mainSubviews/image";
  import { getElementsByClassName } from "../../ts/admin/tools/getElementsByClassName";

  const nodes = getElementsByClassName("top-bar-tab");
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].className = "top-bar-tab";
  }
  document.getElementById("image-manager")!.className += " active-top-bar-tab";

  downloadImageList(1, 15);
</script>

<h1>{$config["site-name"] + " - Obrázky"}</h1>
<div
  id="addImage"
  class="button green-button"
  on:click={() => {
    addImage(false);
  }}
>
  <i class="icon-plus" />
  Nahrát
</div>
<div id="imageList" />
