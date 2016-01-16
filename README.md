# clerkjs
Javascript object store with automatic PubSub based updates.

### Code Example (demo)

```javascript
// Create store with your app model.
var store = new Clerk({
    account: {
        user: "Kamil",
        weather: "cold and sunny",
        where: "Warszawa"
    },
    favourites: {
        planet: "jupiter",
        star: "vega",
        color: "orange"
    }
});


// Bind store changes to callbacks and initiate callbacks once.
// Pass unique id as first argument in order to avoid multiple listeners.
store.bind("uniqueId", {
    'account.user': function(val){ console.log('user changed: ', val); },
    'account.where': function(val){ console.log('user is at: ', val); },
    'favourites.planet': function(val){ console.log('fav planet: ', val); },
});


// Create clerk with rights to change data.
var clerk = store.registerClerk("kamil");


// Change data in store -> runs attached callbacks.
store.set(clerk, {
    'account.user': 'Roger Moore',
    'account.where': 'California',
    'favourites.planet': 'Pluto',
});


// UNDO & REDO your last actions
store.undo();
store.undo();
store.redo();
```