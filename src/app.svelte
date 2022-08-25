<script>

import { Route } from 'tinro'; 
import Index from "./routes/index.svelte";
import Setup from "./routes/setup.svelte";
import Restaurant from "./routes/restaurant.svelte";
import { restrantIsEmpty } from './lib/stores';
import { router } from 'tinro';

export let that = null;

const isEmpty = restrantIsEmpty();
isEmpty.subscribe(isEmpty => {
    if (isEmpty) {
        router.goto('/setup');
    }
});

</script>

<Route path="/"><Index {that}/></Route>
<Route path="/restaurants/:id"><Restaurant {that}/></Route>
<Route path="/setup"><Setup {that}/></Route>
