<script>

import { Route } from 'tinro'; 
import Index from "./routes/index.svelte";
import Setup from "./routes/setup.svelte";
import Restaurant from "./routes/restaurant.svelte";

const filters = {
    city: '',
    price: '',
    category: '',
    sort: 'Rating'
};

firebase.auth().signInAnonymously().then(() => {
}).catch(function(err) {
    console.log(err);
});

</script>

<Route path="/"><Index {filters}/></Route>
<Route path="/restaurants/:id"><Restaurant/></Route>
<Route path="/setup"><Setup/></Route>
