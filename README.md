# clerkjs
Javascript object store with automatic PubSub based updates.


# HOW IT WORKS

#### CREATE STORE
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


#### OBSERVE STORE AND REACT TO CHANGES
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

#### CREATE CLERK WITH RIGHT TO CHANGE DATA
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
#### UNDO & REDO ACTIONS
```javascript
// UNDO & REDO your last actions  
store.undo();
store.redo();
```

# INSTALLATION

npm install https://github.com/kamilmac/clerkjs.git

bower install https://github.com/kamilmac/clerkjs.git

source files are placed in "dist" folder.


 