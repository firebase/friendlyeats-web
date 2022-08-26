<script>

import { Route } from 'tinro'; 
import Index from "./routes/index.svelte";
import Setup from "./routes/setup.svelte";
import Restaurant from "./routes/restaurant.svelte";
import { restrantIsEmpty } from './lib/stores';
import { router } from 'tinro';

const isEmpty = restrantIsEmpty();
isEmpty.subscribe(isEmpty => {
    if (isEmpty) {
        router.goto('/setup');
    }
});

const initialFilters = {
    city: '',
    price: '',
    category: '',
    sort: 'Rating'
};

class FriendlyEats {
    constructor() {
        this.filters = {...initialFilters};

        firebase.auth().signInAnonymously().then(() => {
        }).catch(function(err) {
            console.log(err);
        });
    }
};

let that = new FriendlyEats();

</script>

<Route path="/"><Index {that}/></Route>
<Route path="/restaurants/:id"><Restaurant {that}/></Route>
<Route path="/setup"><Setup {that}/></Route>
