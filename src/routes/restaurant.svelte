<script>

import { meta } from 'tinro';

export let that = null;

const route = meta();
const id = route.params['id'];

</script>

<div class="header">{id}</div>
<main></main>
