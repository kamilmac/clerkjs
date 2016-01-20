# clerkjs
Javascript object store with automatic PubSub based updates.


# HOW IT WORKS

#### Create store.
```javascript
// JS object with your app model.
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
```


#### Observe store and react to changes.
```javascript
// Bind callbacks to data changes.
// Pass unique id as first argument in order to avoid multiple listeners.
store.bind("uniqueId", {
    'account.user': function(val){ console.log('user changed: ', val); },
    'account.where': function(val){ console.log('user is at: ', val); },
    'favourites.planet': function(val){ console.log('fav planet: ', val); },
});

// Get current value once without binding.
var acc = store.get("account.user");
```

#### Create Clerk with rights to change data.
```javascript
var clerk = store.registerClerk("kamil");

// Change data in store -> runs attached callbacks.
store.set(clerk, {
    'account.user': 'Roger Moore',
    'account.where': 'California',
    'favourites.planet': 'Pluto',
});
```

### [UNDER DEVELOPMENT]
#### Undo & Redo actions.
```javascript
// UNDO & REDO your last actions  
store.undo();
store.redo();
```

# INSTALLATION

npm install https://github.com/kamilmac/clerkjs.git

bower install https://github.com/kamilmac/clerkjs.git

source files are placed in "dist" folder.


 