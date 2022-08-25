<script>

import { Route } from 'tinro'; 
import Index from "./routes/index.svelte";
import Setup from "./routes/setup.svelte";
import Restaurant from "./routes/restaurant.svelte";

export let that = null;

</script>

<Route path="/"><Index {that}/></Route>
<Route path="/restaurants/:id"><Restaurant {that}/></Route>
<Route path="/setup"><Setup {that}/></Route>
