<script>

import { Route } from 'tinro'; 
import Index from "./pages/index.svelte";
import Setup from "./pages/setup.svelte";
import Restaurant from "./pages/restaurant.svelte";

</script>

<Route path="/"><Index/></Route>
<Route path="/restaurants/:id"><Restaurant/></Route>
<Route path="/setup"><Setup/></Route>
