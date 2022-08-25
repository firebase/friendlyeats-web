<script>

import HeaderBase from '../components/header-base.svelte';
import ListRestaurants from '../components/list-restaurants.svelte';

export let that = null;

</script>

<div class="header"><HeaderBase {that} filters={that.filters}/></div>
<main><ListRestaurants {that}/></main>
