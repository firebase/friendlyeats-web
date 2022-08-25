<script>

import HeaderBase from '../components/header-base.svelte';
import Setup from '../components/setup.svelte';
export let that = null;

const config = that.getFirebaseConfig();

</script>

<div class="header"><HeaderBase {that}/></div>
<main><Setup {that} {config}/></main>
