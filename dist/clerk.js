var Clerk = (function () {
    function Clerk(model) {
        var _this = this;
        this._listeners = [];
        this._clerks = [];
        this._history = [];
        this._now = 0;
        this.$app_data = {};
        this.registerClerk = function (id) {
            for (var i = 0, l = _this._clerks.length; i < l; i += 1) {
                if (_this._clerks[i].id == id) {
                    console.log("Model: Duplicated clerk.");
                    return false;
                }
            }
            _this._clerks.push({
                id: id,
                writes: 0
            });
            return id;
        };
        this.set = function (admin_id, data) {
            var admin = _this._get_admin(admin_id);
            if (admin) {
                for (var key in data) {
                    _this._save(key, data[key], admin_id);
                    admin.writes++;
                }
            }
        };
        this.undo = function (steps) {
            if (steps === void 0) { steps = 1; }
            _this._now = _this._now - steps;
            console.log("undo now: ", _this._now);
            _this._lets_dance();
        };
        this.redo = function (steps) {
            if (steps === void 0) { steps = 1; }
            _this._now = _this._now + steps;
            console.log("redo now: ", _this._now);
            _this._lets_dance();
        };
        this.bind = function (id, bindings) {
            var counter = 0;
            for (var key in bindings) {
                _this.get(key, id + "_" + counter++, bindings[key]);
            }
        };
        this.get = function (prop, id, callback) {
            if (id === void 0) { id = ""; }
            prop = prop.split('.');
            if (callback && id) {
                var _id = prop.join('.') + id;
                if (!_this._duplicatedListener(_id)) {
                    _this._listeners.push({
                        prop: prop,
                        callback: callback,
                        id: _id
                    });
                }
                callback(_this._getOnce(prop));
            }
            else {
                return _this._getOnce(prop);
            }
        };
        this.$app_data = model || {};
    }
    Clerk.prototype._save = function (prop, value, admin_id, dance) {
        if (dance === void 0) { dance = false; }
        prop = prop.split('.');
        var ref = this.$app_data, old_value = null;
        for (var i = 0, l = prop.length; i < l; i += 1) {
            if (typeof ref[prop[i]] === "undefined") {
                return false;
                console.log('Property doesnt exist: ', prop);
            }
            ;
            if (i == l - 1) {
                old_value = ref[prop[i]];
                ref[prop[i]] = value;
            }
            else {
                ref = ref[prop[i]];
            }
        }
        if (!dance) {
            this._history.push({
                old_val: old_value,
                new_val: value,
                prop: prop,
                invalidatedBy: admin_id
            });
            this._now++;
        }
        this._notify(prop);
    };
    Clerk.prototype._notify = function (pub_props) {
        for (var i = 0, len = this._listeners.length; i < len; i += 1) {
            var l = this._listeners[i];
            if (this._mark_for_change(l.prop, pub_props)) {
                l.callback(this._getOnce(l.prop));
            }
        }
    };
    Clerk.prototype._mark_for_change = function (a, b) {
        if (a[0] != b[0])
            return false;
        var l = null;
        (a.length > b.length) ? l = b.length : l = a.length;
        for (var i = 1; i < l; i += 1) {
            if (a[i] != b[i])
                return false;
        }
        return true;
    };
    Clerk.prototype._duplicatedListener = function (id) {
        for (var _i = 0, _a = this._listeners; _i < _a.length; _i++) {
            var l = _a[_i];
            if (id == l.id)
                return true;
        }
        return false;
    };
    Clerk.prototype._getOnce = function (prop) {
        var ref = this.$app_data;
        for (var _i = 0; _i < prop.length; _i++) {
            var p = prop[_i];
            if (typeof ref[p] !== "undefined") {
                ref = ref[p];
            }
            else
                return undefined;
        }
        return ref;
    };
    Clerk.prototype._lets_dance = function () {
        if (this._now >= this._history.length) {
            this._now = this._history.length;
        }
        else if (this._now < 0) {
            this._now = 0;
        }
        console.log("state: ", this._history);
        var bowie = this._history[this._now];
        this._save(bowie.prop.join('.'), bowie.old_val, false, true);
    };
    Clerk.prototype._get_admin = function (id) {
        for (var i = 0, l = this._clerks.length; i < l; i += 1) {
            if (this._clerks[i].id == id) {
                return this._clerks[i];
            }
        }
        return false;
    };
    return Clerk;
})();
