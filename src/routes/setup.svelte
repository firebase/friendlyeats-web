<script>

import HeaderBase from '../components/header-base.svelte';
import Setup from '../components/setup.svelte';
import { restrantIsEmpty } from '../lib/stores';
import { router } from 'tinro';

export let that = null;

const config = that.getFirebaseConfig();

const isEmpty = restrantIsEmpty();
isEmpty.subscribe(isEmpty => {
    if (isEmpty) {
        router.goto('/');
    }
});

</script>

<div class="header"><HeaderBase {that}/></div>
<main><Setup {that} {config}/></main>
