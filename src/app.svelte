<script>

import { Route } from 'tinro'; 
import Index from "./routes/index.svelte";
import Setup from "./routes/setup.svelte";
import Restaurant from "./routes/restaurant.svelte";
import AddReview from './components/add-review.svelte';
import { mountComponent } from './lib/renderer';
import { addRating } from './lib/firestore';
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
        this.dialogs = {};

        firebase.auth().signInAnonymously().then(() => {
            this.initReviewDialog();
        }).catch(function(err) {
            console.log(err);
        });
    }

    initReviewDialog() {
        let values = {
            rating: 0,
            text: '',
        };

        let dialog = document.querySelector('#dialog-add-review');
        mountComponent(dialog, AddReview, { values });
        this.dialogs.add_review = new mdc.dialog.MDCDialog(dialog);

        this.dialogs.add_review.listen('MDCDialog:accept', function() {
            var pathname = getCleanPath(document.location.pathname);
            var id = pathname.split('/')[2];

            addRating(id, {
                ...values,
                userName: 'Anonymous (Web)',
                timestamp: new Date(),
                userId: firebase.auth().currentUser.uid
            });
        });
    }
};

function getCleanPath(dirtyPath) {
    if (dirtyPath.startsWith('/index.html')) {
        return dirtyPath.split('/').slice(1).join('/');
    } else {
        return dirtyPath;
    }
}

let that = new FriendlyEats();

</script>

<Route path="/"><Index {that}/></Route>
<Route path="/restaurants/:id"><Restaurant {that}/></Route>
<Route path="/setup"><Setup {that}/></Route>
