class Clerk {
    private _listeners = [];
    private _clerks = [];
    private _history = [];
    private _now: number = 0;
    private $app_data = {};    
    
    private _save(prop, value, admin_id, dance = false) {
        prop = prop.split('.')
        
        let ref = this.$app_data, old_value = null;
        
        for(let i = 0, l = prop.length; i < l; i+=1) {
            if(typeof ref[prop[i]] === "undefined") {
                return false;
                console.log('Property doesnt exist: ', prop);           
            };
            if(i == l-1) {
                old_value = ref[prop[i]]; 
                ref[prop[i]] = value;
            } else {
                ref = ref[prop[i]];
            }
        }
        if(!dance) {
            this._history.push({
                old_val: old_value,
                new_val: value,
                prop: prop,
                invalidatedBy: admin_id
            });
            this._now++;
        }
        this._notify(prop);
    }
    
    private _notify(pub_props) {
        for(let i = 0, len = this._listeners.length; i < len; i+=1) {
            let l: any = this._listeners[i];
            if(this._mark_for_change(l.prop, pub_props)) {
                l.callback(this._getOnce(l.prop));
            }
        }
    }
    
    private _mark_for_change(a, b) {
        if(a[0] != b[0]) return false;
        
        let l = null;
        (a.length > b.length) ? l=b.length : l=a.length;
        
        for(let i = 1; i < l; i+=1) {
            if(a[i] != b[i]) return false
        }
        return true;
    }
    
    private _duplicatedListener(id) {
        for(let l of this._listeners) {
            if(id == l.id) return true;
        }
        return false;
    }
    
    private _getOnce(prop) {
        let ref = this.$app_data;
        for(let p of prop) {
            if(typeof ref[p] !== "undefined") { ref = ref[p] }
            else return undefined
        }
        return ref
    }
    
    private _lets_dance() {      // put on your red shoes and dance the blues
        if(this._now >= this._history.length) { this._now = this._history.length; }
        else if(this._now < 0) { this._now = 0; }
        console.log("state: ", this._history)
        let bowie: any = this._history[this._now];
        this._save(bowie.prop.join('.'), bowie.old_val, false, true);
    } 
    
    private _get_admin(id) {
        for(let i = 0, l = this._clerks.length; i < l; i+=1) {
            if(this._clerks[i].id == id) {
                return this._clerks[i];
            }
        }
        return false
    }
        
    constructor (model: any) {
        this.$app_data = model || {};
    }
    
    
    // Public API
    registerClerk = (id) => {
        for(let i = 0, l = this._clerks.length; i < l; i+=1) {
            if(this._clerks[i].id == id) {
                console.log("Model: Duplicated clerk.");
                return false;
            }
        }
        this._clerks.push({
            id: id,
            writes: 0
        });
        return id
    }
    
    set = (admin_id, data) => {
        let admin: any = this._get_admin(admin_id)
        if(admin) {
            for(let key in data) {
                this._save(key, data[key], admin_id);
                admin.writes++;
            }
        }
    }
    
    undo = (steps = 1) => {
        this._now = this._now - steps;
        console.log("undo now: ", this._now);
        this._lets_dance();
    }
    
    redo = (steps = 1) => {
        this._now = this._now + steps;
        console.log("redo now: ", this._now);
        this._lets_dance();
    }
    
    bind = (id, bindings) => {
        let counter = 0;
        for(let key in bindings) {
            this.get(key, id+"_"+counter++, bindings[key]);
        }
    }
    
    get = (prop, id = "", callback) => {
        prop = prop.split('.');
        if(callback && id) {
            let _id = prop.join('.') + id;
            if(!this._duplicatedListener(_id)) {
                this._listeners.push({
                    prop: prop,
                    callback: callback,
                    id: _id
                });
            }
            callback(this._getOnce(prop));
        } else {
            return this._getOnce(prop);
        }
    }
}