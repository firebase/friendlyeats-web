<script>

import { Route } from 'tinro'; 
import Index from "./routes/index.svelte";
import Setup from "./routes/setup.svelte";
import Restaurant from "./routes/restaurant.svelte";

export let that = null;

</script>

<nav>
    <a href="/">Index</a>
    <a href="/restaurant/taro">Ramen Taro</a>
    <a href="/restaurant/jiro">Ramen Jiro</a>
    <a href="/setup">Setup</a>
</nav>

<Route path="/"><Index {that}/></Route>
<Route path="/restaurant/:id"><Restaurant {that}/></Route>
<Route path="/setup"><Setup {that}/></Route>
