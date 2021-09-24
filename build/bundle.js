
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root.host) {
            return root;
        }
        return document;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/GraphicTitle.svelte generated by Svelte v3.42.1 */

    const file = "src/components/GraphicTitle.svelte";

    function create_fragment(ctx) {
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(/*title*/ ctx[0]);
    			attr_dev(h2, "class", "graphictitle svelte-1unousy");
    			add_location(h2, file, 17, 0, 242);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t, /*title*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GraphicTitle', slots, []);
    	let { title } = $$props;
    	let { subhed } = $$props;
    	const writable_props = ['title', 'subhed'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GraphicTitle> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('subhed' in $$props) $$invalidate(1, subhed = $$props.subhed);
    	};

    	$$self.$capture_state = () => ({ title, subhed });

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(0, title = $$props.title);
    		if ('subhed' in $$props) $$invalidate(1, subhed = $$props.subhed);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, subhed];
    }

    class GraphicTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { title: 0, subhed: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GraphicTitle",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !('title' in props)) {
    			console.warn("<GraphicTitle> was created without expected prop 'title'");
    		}

    		if (/*subhed*/ ctx[1] === undefined && !('subhed' in props)) {
    			console.warn("<GraphicTitle> was created without expected prop 'subhed'");
    		}
    	}

    	get title() {
    		throw new Error("<GraphicTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<GraphicTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subhed() {
    		throw new Error("<GraphicTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subhed(value) {
    		throw new Error("<GraphicTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/GraphicFooter.svelte generated by Svelte v3.42.1 */

    const file$1 = "src/components/GraphicFooter.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let span;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			span = element("span");
    			t0 = text("SOURCE: ");
    			t1 = text(/*source*/ ctx[0]);
    			attr_dev(span, "class", "graphic-footer-text svelte-10vhisg");
    			add_location(span, file$1, 28, 6, 371);
    			attr_dev(div0, "id", "footer-meta");
    			attr_dev(div0, "class", "svelte-10vhisg");
    			add_location(div0, file$1, 27, 3, 342);
    			attr_dev(div1, "id", "graphic-footer");
    			attr_dev(div1, "class", "svelte-10vhisg");
    			add_location(div1, file$1, 26, 0, 313);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, span);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*source*/ 1) set_data_dev(t1, /*source*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GraphicFooter', slots, []);
    	let { source } = $$props;
    	let { note } = $$props;
    	const writable_props = ['source', 'note'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GraphicFooter> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('source' in $$props) $$invalidate(0, source = $$props.source);
    		if ('note' in $$props) $$invalidate(1, note = $$props.note);
    	};

    	$$self.$capture_state = () => ({ source, note });

    	$$self.$inject_state = $$props => {
    		if ('source' in $$props) $$invalidate(0, source = $$props.source);
    		if ('note' in $$props) $$invalidate(1, note = $$props.note);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [source, note];
    }

    class GraphicFooter extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { source: 0, note: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GraphicFooter",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*source*/ ctx[0] === undefined && !('source' in props)) {
    			console.warn("<GraphicFooter> was created without expected prop 'source'");
    		}

    		if (/*note*/ ctx[1] === undefined && !('note' in props)) {
    			console.warn("<GraphicFooter> was created without expected prop 'note'");
    		}
    	}

    	get source() {
    		throw new Error("<GraphicFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set source(value) {
    		throw new Error("<GraphicFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get note() {
    		throw new Error("<GraphicFooter>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set note(value) {
    		throw new Error("<GraphicFooter>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function ascending(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector(compare) {
      if (compare.length === 1) compare = ascendingComparator(compare);
      return {
        left: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          }
          return lo;
        },
        right: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) > 0) hi = mid;
            else lo = mid + 1;
          }
          return lo;
        }
      };
    }

    function ascendingComparator(f) {
      return function(d, x) {
        return ascending(f(d), x);
      };
    }

    var ascendingBisect = bisector(ascending);
    var bisectRight = ascendingBisect.right;

    function number(x) {
      return x === null ? NaN : +x;
    }

    function sequence(start, stop, step) {
      start = +start, stop = +stop, step = (n = arguments.length) < 2 ? (stop = start, start = 0, 1) : n < 3 ? 1 : +step;

      var i = -1,
          n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
          range = new Array(n);

      while (++i < n) {
        range[i] = start + i * step;
      }

      return range;
    }

    var e10 = Math.sqrt(50),
        e5 = Math.sqrt(10),
        e2 = Math.sqrt(2);

    function ticks(start, stop, count) {
      var reverse,
          i = -1,
          n,
          ticks,
          step;

      stop = +stop, start = +start, count = +count;
      if (start === stop && count > 0) return [start];
      if (reverse = stop < start) n = start, start = stop, stop = n;
      if ((step = tickIncrement(start, stop, count)) === 0 || !isFinite(step)) return [];

      if (step > 0) {
        start = Math.ceil(start / step);
        stop = Math.floor(stop / step);
        ticks = new Array(n = Math.ceil(stop - start + 1));
        while (++i < n) ticks[i] = (start + i) * step;
      } else {
        start = Math.floor(start * step);
        stop = Math.ceil(stop * step);
        ticks = new Array(n = Math.ceil(start - stop + 1));
        while (++i < n) ticks[i] = (start - i) / step;
      }

      if (reverse) ticks.reverse();

      return ticks;
    }

    function tickIncrement(start, stop, count) {
      var step = (stop - start) / Math.max(0, count),
          power = Math.floor(Math.log(step) / Math.LN10),
          error = step / Math.pow(10, power);
      return power >= 0
          ? (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1) * Math.pow(10, power)
          : -Math.pow(10, -power) / (error >= e10 ? 10 : error >= e5 ? 5 : error >= e2 ? 2 : 1);
    }

    function tickStep(start, stop, count) {
      var step0 = Math.abs(stop - start) / Math.max(0, count),
          step1 = Math.pow(10, Math.floor(Math.log(step0) / Math.LN10)),
          error = step0 / step1;
      if (error >= e10) step1 *= 10;
      else if (error >= e5) step1 *= 5;
      else if (error >= e2) step1 *= 2;
      return stop < start ? -step1 : step1;
    }

    function threshold(values, p, valueof) {
      if (valueof == null) valueof = number;
      if (!(n = values.length)) return;
      if ((p = +p) <= 0 || n < 2) return +valueof(values[0], 0, values);
      if (p >= 1) return +valueof(values[n - 1], n - 1, values);
      var n,
          i = (n - 1) * p,
          i0 = Math.floor(i),
          value0 = +valueof(values[i0], i0, values),
          value1 = +valueof(values[i0 + 1], i0 + 1, values);
      return value0 + (value1 - value0) * (i - i0);
    }

    var prefix = "$";

    function Map$1() {}

    Map$1.prototype = map.prototype = {
      constructor: Map$1,
      has: function(key) {
        return (prefix + key) in this;
      },
      get: function(key) {
        return this[prefix + key];
      },
      set: function(key, value) {
        this[prefix + key] = value;
        return this;
      },
      remove: function(key) {
        var property = prefix + key;
        return property in this && delete this[property];
      },
      clear: function() {
        for (var property in this) if (property[0] === prefix) delete this[property];
      },
      keys: function() {
        var keys = [];
        for (var property in this) if (property[0] === prefix) keys.push(property.slice(1));
        return keys;
      },
      values: function() {
        var values = [];
        for (var property in this) if (property[0] === prefix) values.push(this[property]);
        return values;
      },
      entries: function() {
        var entries = [];
        for (var property in this) if (property[0] === prefix) entries.push({key: property.slice(1), value: this[property]});
        return entries;
      },
      size: function() {
        var size = 0;
        for (var property in this) if (property[0] === prefix) ++size;
        return size;
      },
      empty: function() {
        for (var property in this) if (property[0] === prefix) return false;
        return true;
      },
      each: function(f) {
        for (var property in this) if (property[0] === prefix) f(this[property], property.slice(1), this);
      }
    };

    function map(object, f) {
      var map = new Map$1;

      // Copy constructor.
      if (object instanceof Map$1) object.each(function(value, key) { map.set(key, value); });

      // Index array by numeric index or specified key function.
      else if (Array.isArray(object)) {
        var i = -1,
            n = object.length,
            o;

        if (f == null) while (++i < n) map.set(i, object[i]);
        else while (++i < n) map.set(f(o = object[i], i, object), o);
      }

      // Convert object to map.
      else if (object) for (var key in object) map.set(key, object[key]);

      return map;
    }

    function Set$1() {}

    var proto = map.prototype;

    Set$1.prototype = set.prototype = {
      constructor: Set$1,
      has: proto.has,
      add: function(value) {
        value += "";
        this[prefix + value] = value;
        return this;
      },
      remove: proto.remove,
      clear: proto.clear,
      values: proto.keys,
      size: proto.size,
      empty: proto.empty,
      each: proto.each
    };

    function set(object, f) {
      var set = new Set$1;

      // Copy constructor.
      if (object instanceof Set$1) object.each(function(value) { set.add(value); });

      // Otherwise, assume it’s an array.
      else if (object) {
        var i = -1, n = object.length;
        if (f == null) while (++i < n) set.add(object[i]);
        else while (++i < n) set.add(f(object[i], i, object));
      }

      return set;
    }

    function entries(map) {
      var entries = [];
      for (var key in map) entries.push({key: key, value: map[key]});
      return entries;
    }

    var array = Array.prototype;

    var map$1 = array.map;
    var slice = array.slice;

    var implicit = {name: "implicit"};

    function ordinal(range) {
      var index = map(),
          domain = [],
          unknown = implicit;

      range = range == null ? [] : slice.call(range);

      function scale(d) {
        var key = d + "", i = index.get(key);
        if (!i) {
          if (unknown !== implicit) return unknown;
          index.set(key, i = domain.push(d));
        }
        return range[(i - 1) % range.length];
      }

      scale.domain = function(_) {
        if (!arguments.length) return domain.slice();
        domain = [], index = map();
        var i = -1, n = _.length, d, key;
        while (++i < n) if (!index.has(key = (d = _[i]) + "")) index.set(key, domain.push(d));
        return scale;
      };

      scale.range = function(_) {
        return arguments.length ? (range = slice.call(_), scale) : range.slice();
      };

      scale.unknown = function(_) {
        return arguments.length ? (unknown = _, scale) : unknown;
      };

      scale.copy = function() {
        return ordinal()
            .domain(domain)
            .range(range)
            .unknown(unknown);
      };

      return scale;
    }

    function band() {
      var scale = ordinal().unknown(undefined),
          domain = scale.domain,
          ordinalRange = scale.range,
          range = [0, 1],
          step,
          bandwidth,
          round = false,
          paddingInner = 0,
          paddingOuter = 0,
          align = 0.5;

      delete scale.unknown;

      function rescale() {
        var n = domain().length,
            reverse = range[1] < range[0],
            start = range[reverse - 0],
            stop = range[1 - reverse];
        step = (stop - start) / Math.max(1, n - paddingInner + paddingOuter * 2);
        if (round) step = Math.floor(step);
        start += (stop - start - step * (n - paddingInner)) * align;
        bandwidth = step * (1 - paddingInner);
        if (round) start = Math.round(start), bandwidth = Math.round(bandwidth);
        var values = sequence(n).map(function(i) { return start + step * i; });
        return ordinalRange(reverse ? values.reverse() : values);
      }

      scale.domain = function(_) {
        return arguments.length ? (domain(_), rescale()) : domain();
      };

      scale.range = function(_) {
        return arguments.length ? (range = [+_[0], +_[1]], rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = [+_[0], +_[1]], round = true, rescale();
      };

      scale.bandwidth = function() {
        return bandwidth;
      };

      scale.step = function() {
        return step;
      };

      scale.round = function(_) {
        return arguments.length ? (round = !!_, rescale()) : round;
      };

      scale.padding = function(_) {
        return arguments.length ? (paddingInner = paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
      };

      scale.paddingInner = function(_) {
        return arguments.length ? (paddingInner = Math.max(0, Math.min(1, _)), rescale()) : paddingInner;
      };

      scale.paddingOuter = function(_) {
        return arguments.length ? (paddingOuter = Math.max(0, Math.min(1, _)), rescale()) : paddingOuter;
      };

      scale.align = function(_) {
        return arguments.length ? (align = Math.max(0, Math.min(1, _)), rescale()) : align;
      };

      scale.copy = function() {
        return band()
            .domain(domain())
            .range(range)
            .round(round)
            .paddingInner(paddingInner)
            .paddingOuter(paddingOuter)
            .align(align);
      };

      return rescale();
    }

    function define(constructor, factory, prototype) {
      constructor.prototype = factory.prototype = prototype;
      prototype.constructor = constructor;
    }

    function extend(parent, definition) {
      var prototype = Object.create(parent.prototype);
      for (var key in definition) prototype[key] = definition[key];
      return prototype;
    }

    function Color() {}

    var darker = 0.7;
    var brighter = 1 / darker;

    var reI = "\\s*([+-]?\\d+)\\s*",
        reN = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\s*",
        reP = "\\s*([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
        reHex = /^#([0-9a-f]{3,8})$/,
        reRgbInteger = new RegExp("^rgb\\(" + [reI, reI, reI] + "\\)$"),
        reRgbPercent = new RegExp("^rgb\\(" + [reP, reP, reP] + "\\)$"),
        reRgbaInteger = new RegExp("^rgba\\(" + [reI, reI, reI, reN] + "\\)$"),
        reRgbaPercent = new RegExp("^rgba\\(" + [reP, reP, reP, reN] + "\\)$"),
        reHslPercent = new RegExp("^hsl\\(" + [reN, reP, reP] + "\\)$"),
        reHslaPercent = new RegExp("^hsla\\(" + [reN, reP, reP, reN] + "\\)$");

    var named = {
      aliceblue: 0xf0f8ff,
      antiquewhite: 0xfaebd7,
      aqua: 0x00ffff,
      aquamarine: 0x7fffd4,
      azure: 0xf0ffff,
      beige: 0xf5f5dc,
      bisque: 0xffe4c4,
      black: 0x000000,
      blanchedalmond: 0xffebcd,
      blue: 0x0000ff,
      blueviolet: 0x8a2be2,
      brown: 0xa52a2a,
      burlywood: 0xdeb887,
      cadetblue: 0x5f9ea0,
      chartreuse: 0x7fff00,
      chocolate: 0xd2691e,
      coral: 0xff7f50,
      cornflowerblue: 0x6495ed,
      cornsilk: 0xfff8dc,
      crimson: 0xdc143c,
      cyan: 0x00ffff,
      darkblue: 0x00008b,
      darkcyan: 0x008b8b,
      darkgoldenrod: 0xb8860b,
      darkgray: 0xa9a9a9,
      darkgreen: 0x006400,
      darkgrey: 0xa9a9a9,
      darkkhaki: 0xbdb76b,
      darkmagenta: 0x8b008b,
      darkolivegreen: 0x556b2f,
      darkorange: 0xff8c00,
      darkorchid: 0x9932cc,
      darkred: 0x8b0000,
      darksalmon: 0xe9967a,
      darkseagreen: 0x8fbc8f,
      darkslateblue: 0x483d8b,
      darkslategray: 0x2f4f4f,
      darkslategrey: 0x2f4f4f,
      darkturquoise: 0x00ced1,
      darkviolet: 0x9400d3,
      deeppink: 0xff1493,
      deepskyblue: 0x00bfff,
      dimgray: 0x696969,
      dimgrey: 0x696969,
      dodgerblue: 0x1e90ff,
      firebrick: 0xb22222,
      floralwhite: 0xfffaf0,
      forestgreen: 0x228b22,
      fuchsia: 0xff00ff,
      gainsboro: 0xdcdcdc,
      ghostwhite: 0xf8f8ff,
      gold: 0xffd700,
      goldenrod: 0xdaa520,
      gray: 0x808080,
      green: 0x008000,
      greenyellow: 0xadff2f,
      grey: 0x808080,
      honeydew: 0xf0fff0,
      hotpink: 0xff69b4,
      indianred: 0xcd5c5c,
      indigo: 0x4b0082,
      ivory: 0xfffff0,
      khaki: 0xf0e68c,
      lavender: 0xe6e6fa,
      lavenderblush: 0xfff0f5,
      lawngreen: 0x7cfc00,
      lemonchiffon: 0xfffacd,
      lightblue: 0xadd8e6,
      lightcoral: 0xf08080,
      lightcyan: 0xe0ffff,
      lightgoldenrodyellow: 0xfafad2,
      lightgray: 0xd3d3d3,
      lightgreen: 0x90ee90,
      lightgrey: 0xd3d3d3,
      lightpink: 0xffb6c1,
      lightsalmon: 0xffa07a,
      lightseagreen: 0x20b2aa,
      lightskyblue: 0x87cefa,
      lightslategray: 0x778899,
      lightslategrey: 0x778899,
      lightsteelblue: 0xb0c4de,
      lightyellow: 0xffffe0,
      lime: 0x00ff00,
      limegreen: 0x32cd32,
      linen: 0xfaf0e6,
      magenta: 0xff00ff,
      maroon: 0x800000,
      mediumaquamarine: 0x66cdaa,
      mediumblue: 0x0000cd,
      mediumorchid: 0xba55d3,
      mediumpurple: 0x9370db,
      mediumseagreen: 0x3cb371,
      mediumslateblue: 0x7b68ee,
      mediumspringgreen: 0x00fa9a,
      mediumturquoise: 0x48d1cc,
      mediumvioletred: 0xc71585,
      midnightblue: 0x191970,
      mintcream: 0xf5fffa,
      mistyrose: 0xffe4e1,
      moccasin: 0xffe4b5,
      navajowhite: 0xffdead,
      navy: 0x000080,
      oldlace: 0xfdf5e6,
      olive: 0x808000,
      olivedrab: 0x6b8e23,
      orange: 0xffa500,
      orangered: 0xff4500,
      orchid: 0xda70d6,
      palegoldenrod: 0xeee8aa,
      palegreen: 0x98fb98,
      paleturquoise: 0xafeeee,
      palevioletred: 0xdb7093,
      papayawhip: 0xffefd5,
      peachpuff: 0xffdab9,
      peru: 0xcd853f,
      pink: 0xffc0cb,
      plum: 0xdda0dd,
      powderblue: 0xb0e0e6,
      purple: 0x800080,
      rebeccapurple: 0x663399,
      red: 0xff0000,
      rosybrown: 0xbc8f8f,
      royalblue: 0x4169e1,
      saddlebrown: 0x8b4513,
      salmon: 0xfa8072,
      sandybrown: 0xf4a460,
      seagreen: 0x2e8b57,
      seashell: 0xfff5ee,
      sienna: 0xa0522d,
      silver: 0xc0c0c0,
      skyblue: 0x87ceeb,
      slateblue: 0x6a5acd,
      slategray: 0x708090,
      slategrey: 0x708090,
      snow: 0xfffafa,
      springgreen: 0x00ff7f,
      steelblue: 0x4682b4,
      tan: 0xd2b48c,
      teal: 0x008080,
      thistle: 0xd8bfd8,
      tomato: 0xff6347,
      turquoise: 0x40e0d0,
      violet: 0xee82ee,
      wheat: 0xf5deb3,
      white: 0xffffff,
      whitesmoke: 0xf5f5f5,
      yellow: 0xffff00,
      yellowgreen: 0x9acd32
    };

    define(Color, color, {
      copy: function(channels) {
        return Object.assign(new this.constructor, this, channels);
      },
      displayable: function() {
        return this.rgb().displayable();
      },
      hex: color_formatHex, // Deprecated! Use color.formatHex.
      formatHex: color_formatHex,
      formatHsl: color_formatHsl,
      formatRgb: color_formatRgb,
      toString: color_formatRgb
    });

    function color_formatHex() {
      return this.rgb().formatHex();
    }

    function color_formatHsl() {
      return hslConvert(this).formatHsl();
    }

    function color_formatRgb() {
      return this.rgb().formatRgb();
    }

    function color(format) {
      var m, l;
      format = (format + "").trim().toLowerCase();
      return (m = reHex.exec(format)) ? (l = m[1].length, m = parseInt(m[1], 16), l === 6 ? rgbn(m) // #ff0000
          : l === 3 ? new Rgb((m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf), 1) // #f00
          : l === 8 ? rgba(m >> 24 & 0xff, m >> 16 & 0xff, m >> 8 & 0xff, (m & 0xff) / 0xff) // #ff000000
          : l === 4 ? rgba((m >> 12 & 0xf) | (m >> 8 & 0xf0), (m >> 8 & 0xf) | (m >> 4 & 0xf0), (m >> 4 & 0xf) | (m & 0xf0), (((m & 0xf) << 4) | (m & 0xf)) / 0xff) // #f000
          : null) // invalid hex
          : (m = reRgbInteger.exec(format)) ? new Rgb(m[1], m[2], m[3], 1) // rgb(255, 0, 0)
          : (m = reRgbPercent.exec(format)) ? new Rgb(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, 1) // rgb(100%, 0%, 0%)
          : (m = reRgbaInteger.exec(format)) ? rgba(m[1], m[2], m[3], m[4]) // rgba(255, 0, 0, 1)
          : (m = reRgbaPercent.exec(format)) ? rgba(m[1] * 255 / 100, m[2] * 255 / 100, m[3] * 255 / 100, m[4]) // rgb(100%, 0%, 0%, 1)
          : (m = reHslPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, 1) // hsl(120, 50%, 50%)
          : (m = reHslaPercent.exec(format)) ? hsla(m[1], m[2] / 100, m[3] / 100, m[4]) // hsla(120, 50%, 50%, 1)
          : named.hasOwnProperty(format) ? rgbn(named[format]) // eslint-disable-line no-prototype-builtins
          : format === "transparent" ? new Rgb(NaN, NaN, NaN, 0)
          : null;
    }

    function rgbn(n) {
      return new Rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff, 1);
    }

    function rgba(r, g, b, a) {
      if (a <= 0) r = g = b = NaN;
      return new Rgb(r, g, b, a);
    }

    function rgbConvert(o) {
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Rgb;
      o = o.rgb();
      return new Rgb(o.r, o.g, o.b, o.opacity);
    }

    function rgb(r, g, b, opacity) {
      return arguments.length === 1 ? rgbConvert(r) : new Rgb(r, g, b, opacity == null ? 1 : opacity);
    }

    function Rgb(r, g, b, opacity) {
      this.r = +r;
      this.g = +g;
      this.b = +b;
      this.opacity = +opacity;
    }

    define(Rgb, rgb, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Rgb(this.r * k, this.g * k, this.b * k, this.opacity);
      },
      rgb: function() {
        return this;
      },
      displayable: function() {
        return (-0.5 <= this.r && this.r < 255.5)
            && (-0.5 <= this.g && this.g < 255.5)
            && (-0.5 <= this.b && this.b < 255.5)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      hex: rgb_formatHex, // Deprecated! Use color.formatHex.
      formatHex: rgb_formatHex,
      formatRgb: rgb_formatRgb,
      toString: rgb_formatRgb
    }));

    function rgb_formatHex() {
      return "#" + hex(this.r) + hex(this.g) + hex(this.b);
    }

    function rgb_formatRgb() {
      var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
      return (a === 1 ? "rgb(" : "rgba(")
          + Math.max(0, Math.min(255, Math.round(this.r) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.g) || 0)) + ", "
          + Math.max(0, Math.min(255, Math.round(this.b) || 0))
          + (a === 1 ? ")" : ", " + a + ")");
    }

    function hex(value) {
      value = Math.max(0, Math.min(255, Math.round(value) || 0));
      return (value < 16 ? "0" : "") + value.toString(16);
    }

    function hsla(h, s, l, a) {
      if (a <= 0) h = s = l = NaN;
      else if (l <= 0 || l >= 1) h = s = NaN;
      else if (s <= 0) h = NaN;
      return new Hsl(h, s, l, a);
    }

    function hslConvert(o) {
      if (o instanceof Hsl) return new Hsl(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Color)) o = color(o);
      if (!o) return new Hsl;
      if (o instanceof Hsl) return o;
      o = o.rgb();
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          h = NaN,
          s = max - min,
          l = (max + min) / 2;
      if (s) {
        if (r === max) h = (g - b) / s + (g < b) * 6;
        else if (g === max) h = (b - r) / s + 2;
        else h = (r - g) / s + 4;
        s /= l < 0.5 ? max + min : 2 - max - min;
        h *= 60;
      } else {
        s = l > 0 && l < 1 ? 0 : h;
      }
      return new Hsl(h, s, l, o.opacity);
    }

    function hsl(h, s, l, opacity) {
      return arguments.length === 1 ? hslConvert(h) : new Hsl(h, s, l, opacity == null ? 1 : opacity);
    }

    function Hsl(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Hsl, hsl, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Hsl(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = this.h % 360 + (this.h < 0) * 360,
            s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
            l = this.l,
            m2 = l + (l < 0.5 ? l : 1 - l) * s,
            m1 = 2 * l - m2;
        return new Rgb(
          hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
          hsl2rgb(h, m1, m2),
          hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2),
          this.opacity
        );
      },
      displayable: function() {
        return (0 <= this.s && this.s <= 1 || isNaN(this.s))
            && (0 <= this.l && this.l <= 1)
            && (0 <= this.opacity && this.opacity <= 1);
      },
      formatHsl: function() {
        var a = this.opacity; a = isNaN(a) ? 1 : Math.max(0, Math.min(1, a));
        return (a === 1 ? "hsl(" : "hsla(")
            + (this.h || 0) + ", "
            + (this.s || 0) * 100 + "%, "
            + (this.l || 0) * 100 + "%"
            + (a === 1 ? ")" : ", " + a + ")");
      }
    }));

    /* From FvD 13.37, CSS Color Module Level 3 */
    function hsl2rgb(h, m1, m2) {
      return (h < 60 ? m1 + (m2 - m1) * h / 60
          : h < 180 ? m2
          : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
          : m1) * 255;
    }

    var deg2rad = Math.PI / 180;
    var rad2deg = 180 / Math.PI;

    var A = -0.14861,
        B = +1.78277,
        C = -0.29227,
        D = -0.90649,
        E = +1.97294,
        ED = E * D,
        EB = E * B,
        BC_DA = B * C - D * A;

    function cubehelixConvert(o) {
      if (o instanceof Cubehelix) return new Cubehelix(o.h, o.s, o.l, o.opacity);
      if (!(o instanceof Rgb)) o = rgbConvert(o);
      var r = o.r / 255,
          g = o.g / 255,
          b = o.b / 255,
          l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB),
          bl = b - l,
          k = (E * (g - l) - C * bl) / D,
          s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)), // NaN if l=0 or l=1
          h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
      return new Cubehelix(h < 0 ? h + 360 : h, s, l, o.opacity);
    }

    function cubehelix(h, s, l, opacity) {
      return arguments.length === 1 ? cubehelixConvert(h) : new Cubehelix(h, s, l, opacity == null ? 1 : opacity);
    }

    function Cubehelix(h, s, l, opacity) {
      this.h = +h;
      this.s = +s;
      this.l = +l;
      this.opacity = +opacity;
    }

    define(Cubehelix, cubehelix, extend(Color, {
      brighter: function(k) {
        k = k == null ? brighter : Math.pow(brighter, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      darker: function(k) {
        k = k == null ? darker : Math.pow(darker, k);
        return new Cubehelix(this.h, this.s, this.l * k, this.opacity);
      },
      rgb: function() {
        var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
            l = +this.l,
            a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
            cosh = Math.cos(h),
            sinh = Math.sin(h);
        return new Rgb(
          255 * (l + a * (A * cosh + B * sinh)),
          255 * (l + a * (C * cosh + D * sinh)),
          255 * (l + a * (E * cosh)),
          this.opacity
        );
      }
    }));

    function constant(x) {
      return function() {
        return x;
      };
    }

    function linear(a, d) {
      return function(t) {
        return a + t * d;
      };
    }

    function exponential(a, b, y) {
      return a = Math.pow(a, y), b = Math.pow(b, y) - a, y = 1 / y, function(t) {
        return Math.pow(a + t * b, y);
      };
    }

    function hue(a, b) {
      var d = b - a;
      return d ? linear(a, d > 180 || d < -180 ? d - 360 * Math.round(d / 360) : d) : constant(isNaN(a) ? b : a);
    }

    function gamma(y) {
      return (y = +y) === 1 ? nogamma : function(a, b) {
        return b - a ? exponential(a, b, y) : constant(isNaN(a) ? b : a);
      };
    }

    function nogamma(a, b) {
      var d = b - a;
      return d ? linear(a, d) : constant(isNaN(a) ? b : a);
    }

    var interpolateRgb = (function rgbGamma(y) {
      var color = gamma(y);

      function rgb$1(start, end) {
        var r = color((start = rgb(start)).r, (end = rgb(end)).r),
            g = color(start.g, end.g),
            b = color(start.b, end.b),
            opacity = nogamma(start.opacity, end.opacity);
        return function(t) {
          start.r = r(t);
          start.g = g(t);
          start.b = b(t);
          start.opacity = opacity(t);
          return start + "";
        };
      }

      rgb$1.gamma = rgbGamma;

      return rgb$1;
    })(1);

    function numberArray(a, b) {
      if (!b) b = [];
      var n = a ? Math.min(b.length, a.length) : 0,
          c = b.slice(),
          i;
      return function(t) {
        for (i = 0; i < n; ++i) c[i] = a[i] * (1 - t) + b[i] * t;
        return c;
      };
    }

    function isNumberArray(x) {
      return ArrayBuffer.isView(x) && !(x instanceof DataView);
    }

    function genericArray(a, b) {
      var nb = b ? b.length : 0,
          na = a ? Math.min(nb, a.length) : 0,
          x = new Array(na),
          c = new Array(nb),
          i;

      for (i = 0; i < na; ++i) x[i] = interpolateValue(a[i], b[i]);
      for (; i < nb; ++i) c[i] = b[i];

      return function(t) {
        for (i = 0; i < na; ++i) c[i] = x[i](t);
        return c;
      };
    }

    function date(a, b) {
      var d = new Date;
      return a = +a, b = +b, function(t) {
        return d.setTime(a * (1 - t) + b * t), d;
      };
    }

    function interpolateNumber(a, b) {
      return a = +a, b = +b, function(t) {
        return a * (1 - t) + b * t;
      };
    }

    function object(a, b) {
      var i = {},
          c = {},
          k;

      if (a === null || typeof a !== "object") a = {};
      if (b === null || typeof b !== "object") b = {};

      for (k in b) {
        if (k in a) {
          i[k] = interpolateValue(a[k], b[k]);
        } else {
          c[k] = b[k];
        }
      }

      return function(t) {
        for (k in i) c[k] = i[k](t);
        return c;
      };
    }

    var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
        reB = new RegExp(reA.source, "g");

    function zero(b) {
      return function() {
        return b;
      };
    }

    function one(b) {
      return function(t) {
        return b(t) + "";
      };
    }

    function interpolateString(a, b) {
      var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
          am, // current match in a
          bm, // current match in b
          bs, // string preceding current number in b, if any
          i = -1, // index in s
          s = [], // string constants and placeholders
          q = []; // number interpolators

      // Coerce inputs to strings.
      a = a + "", b = b + "";

      // Interpolate pairs of numbers in a & b.
      while ((am = reA.exec(a))
          && (bm = reB.exec(b))) {
        if ((bs = bm.index) > bi) { // a string precedes the next number in b
          bs = b.slice(bi, bs);
          if (s[i]) s[i] += bs; // coalesce with previous string
          else s[++i] = bs;
        }
        if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
          if (s[i]) s[i] += bm; // coalesce with previous string
          else s[++i] = bm;
        } else { // interpolate non-matching numbers
          s[++i] = null;
          q.push({i: i, x: interpolateNumber(am, bm)});
        }
        bi = reB.lastIndex;
      }

      // Add remains of b.
      if (bi < b.length) {
        bs = b.slice(bi);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }

      // Special optimization for only a single match.
      // Otherwise, interpolate each of the numbers and rejoin the string.
      return s.length < 2 ? (q[0]
          ? one(q[0].x)
          : zero(b))
          : (b = q.length, function(t) {
              for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
              return s.join("");
            });
    }

    function interpolateValue(a, b) {
      var t = typeof b, c;
      return b == null || t === "boolean" ? constant(b)
          : (t === "number" ? interpolateNumber
          : t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
          : b instanceof color ? interpolateRgb
          : b instanceof Date ? date
          : isNumberArray(b) ? numberArray
          : Array.isArray(b) ? genericArray
          : typeof b.valueOf !== "function" && typeof b.toString !== "function" || isNaN(b) ? object
          : interpolateNumber)(a, b);
    }

    function interpolateRound(a, b) {
      return a = +a, b = +b, function(t) {
        return Math.round(a * (1 - t) + b * t);
      };
    }

    function cubehelix$1(hue) {
      return (function cubehelixGamma(y) {
        y = +y;

        function cubehelix$1(start, end) {
          var h = hue((start = cubehelix(start)).h, (end = cubehelix(end)).h),
              s = nogamma(start.s, end.s),
              l = nogamma(start.l, end.l),
              opacity = nogamma(start.opacity, end.opacity);
          return function(t) {
            start.h = h(t);
            start.s = s(t);
            start.l = l(Math.pow(t, y));
            start.opacity = opacity(t);
            return start + "";
          };
        }

        cubehelix$1.gamma = cubehelixGamma;

        return cubehelix$1;
      })(1);
    }

    cubehelix$1(hue);
    var cubehelixLong = cubehelix$1(nogamma);

    function constant$1(x) {
      return function() {
        return x;
      };
    }

    function number$1(x) {
      return +x;
    }

    var unit = [0, 1];

    function deinterpolateLinear(a, b) {
      return (b -= (a = +a))
          ? function(x) { return (x - a) / b; }
          : constant$1(b);
    }

    function deinterpolateClamp(deinterpolate) {
      return function(a, b) {
        var d = deinterpolate(a = +a, b = +b);
        return function(x) { return x <= a ? 0 : x >= b ? 1 : d(x); };
      };
    }

    function reinterpolateClamp(reinterpolate) {
      return function(a, b) {
        var r = reinterpolate(a = +a, b = +b);
        return function(t) { return t <= 0 ? a : t >= 1 ? b : r(t); };
      };
    }

    function bimap(domain, range, deinterpolate, reinterpolate) {
      var d0 = domain[0], d1 = domain[1], r0 = range[0], r1 = range[1];
      if (d1 < d0) d0 = deinterpolate(d1, d0), r0 = reinterpolate(r1, r0);
      else d0 = deinterpolate(d0, d1), r0 = reinterpolate(r0, r1);
      return function(x) { return r0(d0(x)); };
    }

    function polymap(domain, range, deinterpolate, reinterpolate) {
      var j = Math.min(domain.length, range.length) - 1,
          d = new Array(j),
          r = new Array(j),
          i = -1;

      // Reverse descending domains.
      if (domain[j] < domain[0]) {
        domain = domain.slice().reverse();
        range = range.slice().reverse();
      }

      while (++i < j) {
        d[i] = deinterpolate(domain[i], domain[i + 1]);
        r[i] = reinterpolate(range[i], range[i + 1]);
      }

      return function(x) {
        var i = bisectRight(domain, x, 1, j) - 1;
        return r[i](d[i](x));
      };
    }

    function copy(source, target) {
      return target
          .domain(source.domain())
          .range(source.range())
          .interpolate(source.interpolate())
          .clamp(source.clamp());
    }

    // deinterpolate(a, b)(x) takes a domain value x in [a,b] and returns the corresponding parameter t in [0,1].
    // reinterpolate(a, b)(t) takes a parameter t in [0,1] and returns the corresponding domain value x in [a,b].
    function continuous(deinterpolate, reinterpolate) {
      var domain = unit,
          range = unit,
          interpolate = interpolateValue,
          clamp = false,
          piecewise,
          output,
          input;

      function rescale() {
        piecewise = Math.min(domain.length, range.length) > 2 ? polymap : bimap;
        output = input = null;
        return scale;
      }

      function scale(x) {
        return (output || (output = piecewise(domain, range, clamp ? deinterpolateClamp(deinterpolate) : deinterpolate, interpolate)))(+x);
      }

      scale.invert = function(y) {
        return (input || (input = piecewise(range, domain, deinterpolateLinear, clamp ? reinterpolateClamp(reinterpolate) : reinterpolate)))(+y);
      };

      scale.domain = function(_) {
        return arguments.length ? (domain = map$1.call(_, number$1), rescale()) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
      };

      scale.rangeRound = function(_) {
        return range = slice.call(_), interpolate = interpolateRound, rescale();
      };

      scale.clamp = function(_) {
        return arguments.length ? (clamp = !!_, rescale()) : clamp;
      };

      scale.interpolate = function(_) {
        return arguments.length ? (interpolate = _, rescale()) : interpolate;
      };

      return rescale();
    }

    // Computes the decimal coefficient and exponent of the specified number x with
    // significant digits p, where x is positive and p is in [1, 21] or undefined.
    // For example, formatDecimal(1.23) returns ["123", 0].
    function formatDecimal(x, p) {
      if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
      var i, coefficient = x.slice(0, i);

      // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
      // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
      return [
        coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
        +x.slice(i + 1)
      ];
    }

    function exponent(x) {
      return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
    }

    function formatGroup(grouping, thousands) {
      return function(value, width) {
        var i = value.length,
            t = [],
            j = 0,
            g = grouping[0],
            length = 0;

        while (i > 0 && g > 0) {
          if (length + g + 1 > width) g = Math.max(1, width - length);
          t.push(value.substring(i -= g, i + g));
          if ((length += g + 1) > width) break;
          g = grouping[j = (j + 1) % grouping.length];
        }

        return t.reverse().join(thousands);
      };
    }

    function formatDefault(x, p) {
      x = x.toPrecision(p);

      out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
        switch (x[i]) {
          case ".": i0 = i1 = i; break;
          case "0": if (i0 === 0) i0 = i; i1 = i; break;
          case "e": break out;
          default: if (i0 > 0) i0 = 0; break;
        }
      }

      return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
    }

    var prefixExponent;

    function formatPrefixAuto(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1],
          i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
          n = coefficient.length;
      return i === n ? coefficient
          : i > n ? coefficient + new Array(i - n + 1).join("0")
          : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
          : "0." + new Array(1 - i).join("0") + formatDecimal(x, Math.max(0, p + i - 1))[0]; // less than 1y!
    }

    function formatRounded(x, p) {
      var d = formatDecimal(x, p);
      if (!d) return x + "";
      var coefficient = d[0],
          exponent = d[1];
      return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
          : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
          : coefficient + new Array(exponent - coefficient.length + 2).join("0");
    }

    var formatTypes = {
      "": formatDefault,
      "%": function(x, p) { return (x * 100).toFixed(p); },
      "b": function(x) { return Math.round(x).toString(2); },
      "c": function(x) { return x + ""; },
      "d": function(x) { return Math.round(x).toString(10); },
      "e": function(x, p) { return x.toExponential(p); },
      "f": function(x, p) { return x.toFixed(p); },
      "g": function(x, p) { return x.toPrecision(p); },
      "o": function(x) { return Math.round(x).toString(8); },
      "p": function(x, p) { return formatRounded(x * 100, p); },
      "r": formatRounded,
      "s": formatPrefixAuto,
      "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
      "x": function(x) { return Math.round(x).toString(16); }
    };

    // [[fill]align][sign][symbol][0][width][,][.precision][type]
    var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

    function formatSpecifier(specifier) {
      return new FormatSpecifier(specifier);
    }

    function FormatSpecifier(specifier) {
      if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

      var match,
          fill = match[1] || " ",
          align = match[2] || ">",
          sign = match[3] || "-",
          symbol = match[4] || "",
          zero = !!match[5],
          width = match[6] && +match[6],
          comma = !!match[7],
          precision = match[8] && +match[8].slice(1),
          type = match[9] || "";

      // The "n" type is an alias for ",g".
      if (type === "n") comma = true, type = "g";

      // Map invalid types to the default format.
      else if (!formatTypes[type]) type = "";

      // If zero fill is specified, padding goes after sign and before digits.
      if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

      this.fill = fill;
      this.align = align;
      this.sign = sign;
      this.symbol = symbol;
      this.zero = zero;
      this.width = width;
      this.comma = comma;
      this.precision = precision;
      this.type = type;
    }

    FormatSpecifier.prototype.toString = function() {
      return this.fill
          + this.align
          + this.sign
          + this.symbol
          + (this.zero ? "0" : "")
          + (this.width == null ? "" : Math.max(1, this.width | 0))
          + (this.comma ? "," : "")
          + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
          + this.type;
    };

    var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];

    function identity$1(x) {
      return x;
    }

    function formatLocale(locale) {
      var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : identity$1,
          currency = locale.currency,
          decimal = locale.decimal;

      function newFormat(specifier) {
        specifier = formatSpecifier(specifier);

        var fill = specifier.fill,
            align = specifier.align,
            sign = specifier.sign,
            symbol = specifier.symbol,
            zero = specifier.zero,
            width = specifier.width,
            comma = specifier.comma,
            precision = specifier.precision,
            type = specifier.type;

        // Compute the prefix and suffix.
        // For SI-prefix, the suffix is lazily computed.
        var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
            suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

        // What format function should we use?
        // Is this an integer type?
        // Can this type generate exponential notation?
        var formatType = formatTypes[type],
            maybeSuffix = !type || /[defgprs%]/.test(type);

        // Set the default precision if not specified,
        // or clamp the specified precision to the supported range.
        // For significant precision, it must be in [1, 21].
        // For fixed precision, it must be in [0, 20].
        precision = precision == null ? (type ? 6 : 12)
            : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
            : Math.max(0, Math.min(20, precision));

        function format(value) {
          var valuePrefix = prefix,
              valueSuffix = suffix,
              i, n, c;

          if (type === "c") {
            valueSuffix = formatType(value) + valueSuffix;
            value = "";
          } else {
            value = +value;

            // Convert negative to positive, and compute the prefix.
            // Note that -0 is not less than 0, but 1 / -0 is!
            var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

            // Perform the initial formatting.
            value = formatType(value, precision);

            // If the original value was negative, it may be rounded to zero during
            // formatting; treat this as (positive) zero.
            if (valueNegative) {
              i = -1, n = value.length;
              valueNegative = false;
              while (++i < n) {
                if (c = value.charCodeAt(i), (48 < c && c < 58)
                    || (type === "x" && 96 < c && c < 103)
                    || (type === "X" && 64 < c && c < 71)) {
                  valueNegative = true;
                  break;
                }
              }
            }

            // Compute the prefix and suffix.
            valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
            valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

            // Break the formatted value into the integer “value” part that can be
            // grouped, and fractional or exponential “suffix” part that is not.
            if (maybeSuffix) {
              i = -1, n = value.length;
              while (++i < n) {
                if (c = value.charCodeAt(i), 48 > c || c > 57) {
                  valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                  value = value.slice(0, i);
                  break;
                }
              }
            }
          }

          // If the fill character is not "0", grouping is applied before padding.
          if (comma && !zero) value = group(value, Infinity);

          // Compute the padding.
          var length = valuePrefix.length + value.length + valueSuffix.length,
              padding = length < width ? new Array(width - length + 1).join(fill) : "";

          // If the fill character is "0", grouping is applied after padding.
          if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

          // Reconstruct the final output based on the desired alignment.
          switch (align) {
            case "<": return valuePrefix + value + valueSuffix + padding;
            case "=": return valuePrefix + padding + value + valueSuffix;
            case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
          }
          return padding + valuePrefix + value + valueSuffix;
        }

        format.toString = function() {
          return specifier + "";
        };

        return format;
      }

      function formatPrefix(specifier, value) {
        var f = newFormat((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
            e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
            k = Math.pow(10, -e),
            prefix = prefixes[8 + e / 3];
        return function(value) {
          return f(k * value) + prefix;
        };
      }

      return {
        format: newFormat,
        formatPrefix: formatPrefix
      };
    }

    var locale;
    var format;
    var formatPrefix;

    defaultLocale({
      decimal: ".",
      thousands: ",",
      grouping: [3],
      currency: ["$", ""]
    });

    function defaultLocale(definition) {
      locale = formatLocale(definition);
      format = locale.format;
      formatPrefix = locale.formatPrefix;
      return locale;
    }

    function precisionFixed(step) {
      return Math.max(0, -exponent(Math.abs(step)));
    }

    function precisionPrefix(step, value) {
      return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
    }

    function precisionRound(step, max) {
      step = Math.abs(step), max = Math.abs(max) - step;
      return Math.max(0, exponent(max) - exponent(step)) + 1;
    }

    function tickFormat(domain, count, specifier) {
      var start = domain[0],
          stop = domain[domain.length - 1],
          step = tickStep(start, stop, count == null ? 10 : count),
          precision;
      specifier = formatSpecifier(specifier == null ? ",f" : specifier);
      switch (specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(start), Math.abs(stop));
          if (specifier.precision == null && !isNaN(precision = precisionPrefix(step, value))) specifier.precision = precision;
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null && !isNaN(precision = precisionRound(step, Math.max(Math.abs(start), Math.abs(stop))))) specifier.precision = precision - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null && !isNaN(precision = precisionFixed(step))) specifier.precision = precision - (specifier.type === "%") * 2;
          break;
        }
      }
      return format(specifier);
    }

    function linearish(scale) {
      var domain = scale.domain;

      scale.ticks = function(count) {
        var d = domain();
        return ticks(d[0], d[d.length - 1], count == null ? 10 : count);
      };

      scale.tickFormat = function(count, specifier) {
        return tickFormat(domain(), count, specifier);
      };

      scale.nice = function(count) {
        var d = domain(),
            i = d.length - 1,
            n = count == null ? 10 : count,
            start = d[0],
            stop = d[i],
            step = tickStep(start, stop, n);

        if (step) {
          step = tickStep(Math.floor(start / step) * step, Math.ceil(stop / step) * step, n);
          d[0] = Math.floor(start / step) * step;
          d[i] = Math.ceil(stop / step) * step;
          domain(d);
        }

        return scale;
      };

      return scale;
    }

    function linear$1() {
      var scale = continuous(deinterpolateLinear, interpolateNumber);

      scale.copy = function() {
        return copy(scale, linear$1());
      };

      return linearish(scale);
    }

    function quantile() {
      var domain = [],
          range = [],
          thresholds = [];

      function rescale() {
        var i = 0, n = Math.max(1, range.length);
        thresholds = new Array(n - 1);
        while (++i < n) thresholds[i - 1] = threshold(domain, i / n);
        return scale;
      }

      function scale(x) {
        if (!isNaN(x = +x)) return range[bisectRight(thresholds, x)];
      }

      scale.invertExtent = function(y) {
        var i = range.indexOf(y);
        return i < 0 ? [NaN, NaN] : [
          i > 0 ? thresholds[i - 1] : domain[0],
          i < thresholds.length ? thresholds[i] : domain[domain.length - 1]
        ];
      };

      scale.domain = function(_) {
        if (!arguments.length) return domain.slice();
        domain = [];
        for (var i = 0, n = _.length, d; i < n; ++i) if (d = _[i], d != null && !isNaN(d = +d)) domain.push(d);
        domain.sort(ascending);
        return rescale();
      };

      scale.range = function(_) {
        return arguments.length ? (range = slice.call(_), rescale()) : range.slice();
      };

      scale.quantiles = function() {
        return thresholds.slice();
      };

      scale.copy = function() {
        return quantile()
            .domain(domain)
            .range(range);
      };

      return scale;
    }

    function quantize() {
      var x0 = 0,
          x1 = 1,
          n = 1,
          domain = [0.5],
          range = [0, 1];

      function scale(x) {
        if (x <= x) return range[bisectRight(domain, x, 0, n)];
      }

      function rescale() {
        var i = -1;
        domain = new Array(n);
        while (++i < n) domain[i] = ((i + 1) * x1 - (i - n) * x0) / (n + 1);
        return scale;
      }

      scale.domain = function(_) {
        return arguments.length ? (x0 = +_[0], x1 = +_[1], rescale()) : [x0, x1];
      };

      scale.range = function(_) {
        return arguments.length ? (n = (range = slice.call(_)).length - 1, rescale()) : range.slice();
      };

      scale.invertExtent = function(y) {
        var i = range.indexOf(y);
        return i < 0 ? [NaN, NaN]
            : i < 1 ? [x0, domain[0]]
            : i >= n ? [domain[n - 1], x1]
            : [domain[i - 1], domain[i]];
      };

      scale.copy = function() {
        return quantize()
            .domain([x0, x1])
            .range(range);
      };

      return linearish(scale);
    }

    function threshold$1() {
      var domain = [0.5],
          range = [0, 1],
          n = 1;

      function scale(x) {
        if (x <= x) return range[bisectRight(domain, x, 0, n)];
      }

      scale.domain = function(_) {
        return arguments.length ? (domain = slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : domain.slice();
      };

      scale.range = function(_) {
        return arguments.length ? (range = slice.call(_), n = Math.min(domain.length, range.length - 1), scale) : range.slice();
      };

      scale.invertExtent = function(y) {
        var i = range.indexOf(y);
        return [domain[i - 1], domain[i]];
      };

      scale.copy = function() {
        return threshold$1()
            .domain(domain)
            .range(range);
      };

      return scale;
    }

    var t0 = new Date,
        t1 = new Date;

    function newInterval(floori, offseti, count, field) {

      function interval(date) {
        return floori(date = arguments.length === 0 ? new Date : new Date(+date)), date;
      }

      interval.floor = function(date) {
        return floori(date = new Date(+date)), date;
      };

      interval.ceil = function(date) {
        return floori(date = new Date(date - 1)), offseti(date, 1), floori(date), date;
      };

      interval.round = function(date) {
        var d0 = interval(date),
            d1 = interval.ceil(date);
        return date - d0 < d1 - date ? d0 : d1;
      };

      interval.offset = function(date, step) {
        return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
      };

      interval.range = function(start, stop, step) {
        var range = [], previous;
        start = interval.ceil(start);
        step = step == null ? 1 : Math.floor(step);
        if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
        do range.push(previous = new Date(+start)), offseti(start, step), floori(start);
        while (previous < start && start < stop);
        return range;
      };

      interval.filter = function(test) {
        return newInterval(function(date) {
          if (date >= date) while (floori(date), !test(date)) date.setTime(date - 1);
        }, function(date, step) {
          if (date >= date) {
            if (step < 0) while (++step <= 0) {
              while (offseti(date, -1), !test(date)) {} // eslint-disable-line no-empty
            } else while (--step >= 0) {
              while (offseti(date, +1), !test(date)) {} // eslint-disable-line no-empty
            }
          }
        });
      };

      if (count) {
        interval.count = function(start, end) {
          t0.setTime(+start), t1.setTime(+end);
          floori(t0), floori(t1);
          return Math.floor(count(t0, t1));
        };

        interval.every = function(step) {
          step = Math.floor(step);
          return !isFinite(step) || !(step > 0) ? null
              : !(step > 1) ? interval
              : interval.filter(field
                  ? function(d) { return field(d) % step === 0; }
                  : function(d) { return interval.count(0, d) % step === 0; });
        };
      }

      return interval;
    }

    var durationMinute = 6e4;
    var durationDay = 864e5;
    var durationWeek = 6048e5;

    var day = newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setDate(date.getDate() + step);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationDay;
    }, function(date) {
      return date.getDate() - 1;
    });

    function weekday(i) {
      return newInterval(function(date) {
        date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setDate(date.getDate() + step * 7);
      }, function(start, end) {
        return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * durationMinute) / durationWeek;
      });
    }

    var sunday = weekday(0);
    var monday = weekday(1);
    var tuesday = weekday(2);
    var wednesday = weekday(3);
    var thursday = weekday(4);
    var friday = weekday(5);
    var saturday = weekday(6);

    var year = newInterval(function(date) {
      date.setMonth(0, 1);
      date.setHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setFullYear(date.getFullYear() + step);
    }, function(start, end) {
      return end.getFullYear() - start.getFullYear();
    }, function(date) {
      return date.getFullYear();
    });

    // An optimized implementation for this simple case.
    year.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setFullYear(Math.floor(date.getFullYear() / k) * k);
        date.setMonth(0, 1);
        date.setHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setFullYear(date.getFullYear() + step * k);
      });
    };

    var utcDay = newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step);
    }, function(start, end) {
      return (end - start) / durationDay;
    }, function(date) {
      return date.getUTCDate() - 1;
    });

    function utcWeekday(i) {
      return newInterval(function(date) {
        date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCDate(date.getUTCDate() + step * 7);
      }, function(start, end) {
        return (end - start) / durationWeek;
      });
    }

    var utcSunday = utcWeekday(0);
    var utcMonday = utcWeekday(1);
    var utcTuesday = utcWeekday(2);
    var utcWednesday = utcWeekday(3);
    var utcThursday = utcWeekday(4);
    var utcFriday = utcWeekday(5);
    var utcSaturday = utcWeekday(6);

    var utcYear = newInterval(function(date) {
      date.setUTCMonth(0, 1);
      date.setUTCHours(0, 0, 0, 0);
    }, function(date, step) {
      date.setUTCFullYear(date.getUTCFullYear() + step);
    }, function(start, end) {
      return end.getUTCFullYear() - start.getUTCFullYear();
    }, function(date) {
      return date.getUTCFullYear();
    });

    // An optimized implementation for this simple case.
    utcYear.every = function(k) {
      return !isFinite(k = Math.floor(k)) || !(k > 0) ? null : newInterval(function(date) {
        date.setUTCFullYear(Math.floor(date.getUTCFullYear() / k) * k);
        date.setUTCMonth(0, 1);
        date.setUTCHours(0, 0, 0, 0);
      }, function(date, step) {
        date.setUTCFullYear(date.getUTCFullYear() + step * k);
      });
    };

    function localDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
        date.setFullYear(d.y);
        return date;
      }
      return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
    }

    function utcDate(d) {
      if (0 <= d.y && d.y < 100) {
        var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
        date.setUTCFullYear(d.y);
        return date;
      }
      return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
    }

    function newDate(y, m, d) {
      return {y: y, m: m, d: d, H: 0, M: 0, S: 0, L: 0};
    }

    function formatLocale$1(locale) {
      var locale_dateTime = locale.dateTime,
          locale_date = locale.date,
          locale_time = locale.time,
          locale_periods = locale.periods,
          locale_weekdays = locale.days,
          locale_shortWeekdays = locale.shortDays,
          locale_months = locale.months,
          locale_shortMonths = locale.shortMonths;

      var periodRe = formatRe(locale_periods),
          periodLookup = formatLookup(locale_periods),
          weekdayRe = formatRe(locale_weekdays),
          weekdayLookup = formatLookup(locale_weekdays),
          shortWeekdayRe = formatRe(locale_shortWeekdays),
          shortWeekdayLookup = formatLookup(locale_shortWeekdays),
          monthRe = formatRe(locale_months),
          monthLookup = formatLookup(locale_months),
          shortMonthRe = formatRe(locale_shortMonths),
          shortMonthLookup = formatLookup(locale_shortMonths);

      var formats = {
        "a": formatShortWeekday,
        "A": formatWeekday,
        "b": formatShortMonth,
        "B": formatMonth,
        "c": null,
        "d": formatDayOfMonth,
        "e": formatDayOfMonth,
        "f": formatMicroseconds,
        "g": formatYearISO,
        "G": formatFullYearISO,
        "H": formatHour24,
        "I": formatHour12,
        "j": formatDayOfYear,
        "L": formatMilliseconds,
        "m": formatMonthNumber,
        "M": formatMinutes,
        "p": formatPeriod,
        "q": formatQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatSeconds,
        "u": formatWeekdayNumberMonday,
        "U": formatWeekNumberSunday,
        "V": formatWeekNumberISO,
        "w": formatWeekdayNumberSunday,
        "W": formatWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatYear,
        "Y": formatFullYear,
        "Z": formatZone,
        "%": formatLiteralPercent
      };

      var utcFormats = {
        "a": formatUTCShortWeekday,
        "A": formatUTCWeekday,
        "b": formatUTCShortMonth,
        "B": formatUTCMonth,
        "c": null,
        "d": formatUTCDayOfMonth,
        "e": formatUTCDayOfMonth,
        "f": formatUTCMicroseconds,
        "g": formatUTCYearISO,
        "G": formatUTCFullYearISO,
        "H": formatUTCHour24,
        "I": formatUTCHour12,
        "j": formatUTCDayOfYear,
        "L": formatUTCMilliseconds,
        "m": formatUTCMonthNumber,
        "M": formatUTCMinutes,
        "p": formatUTCPeriod,
        "q": formatUTCQuarter,
        "Q": formatUnixTimestamp,
        "s": formatUnixTimestampSeconds,
        "S": formatUTCSeconds,
        "u": formatUTCWeekdayNumberMonday,
        "U": formatUTCWeekNumberSunday,
        "V": formatUTCWeekNumberISO,
        "w": formatUTCWeekdayNumberSunday,
        "W": formatUTCWeekNumberMonday,
        "x": null,
        "X": null,
        "y": formatUTCYear,
        "Y": formatUTCFullYear,
        "Z": formatUTCZone,
        "%": formatLiteralPercent
      };

      var parses = {
        "a": parseShortWeekday,
        "A": parseWeekday,
        "b": parseShortMonth,
        "B": parseMonth,
        "c": parseLocaleDateTime,
        "d": parseDayOfMonth,
        "e": parseDayOfMonth,
        "f": parseMicroseconds,
        "g": parseYear,
        "G": parseFullYear,
        "H": parseHour24,
        "I": parseHour24,
        "j": parseDayOfYear,
        "L": parseMilliseconds,
        "m": parseMonthNumber,
        "M": parseMinutes,
        "p": parsePeriod,
        "q": parseQuarter,
        "Q": parseUnixTimestamp,
        "s": parseUnixTimestampSeconds,
        "S": parseSeconds,
        "u": parseWeekdayNumberMonday,
        "U": parseWeekNumberSunday,
        "V": parseWeekNumberISO,
        "w": parseWeekdayNumberSunday,
        "W": parseWeekNumberMonday,
        "x": parseLocaleDate,
        "X": parseLocaleTime,
        "y": parseYear,
        "Y": parseFullYear,
        "Z": parseZone,
        "%": parseLiteralPercent
      };

      // These recursive directive definitions must be deferred.
      formats.x = newFormat(locale_date, formats);
      formats.X = newFormat(locale_time, formats);
      formats.c = newFormat(locale_dateTime, formats);
      utcFormats.x = newFormat(locale_date, utcFormats);
      utcFormats.X = newFormat(locale_time, utcFormats);
      utcFormats.c = newFormat(locale_dateTime, utcFormats);

      function newFormat(specifier, formats) {
        return function(date) {
          var string = [],
              i = -1,
              j = 0,
              n = specifier.length,
              c,
              pad,
              format;

          if (!(date instanceof Date)) date = new Date(+date);

          while (++i < n) {
            if (specifier.charCodeAt(i) === 37) {
              string.push(specifier.slice(j, i));
              if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
              else pad = c === "e" ? " " : "0";
              if (format = formats[c]) c = format(date, pad);
              string.push(c);
              j = i + 1;
            }
          }

          string.push(specifier.slice(j, i));
          return string.join("");
        };
      }

      function newParse(specifier, Z) {
        return function(string) {
          var d = newDate(1900, undefined, 1),
              i = parseSpecifier(d, specifier, string += "", 0),
              week, day$1;
          if (i != string.length) return null;

          // If a UNIX timestamp is specified, return it.
          if ("Q" in d) return new Date(d.Q);
          if ("s" in d) return new Date(d.s * 1000 + ("L" in d ? d.L : 0));

          // If this is utcParse, never use the local timezone.
          if (Z && !("Z" in d)) d.Z = 0;

          // The am-pm flag is 0 for AM, and 1 for PM.
          if ("p" in d) d.H = d.H % 12 + d.p * 12;

          // If the month was not specified, inherit from the quarter.
          if (d.m === undefined) d.m = "q" in d ? d.q : 0;

          // Convert day-of-week and week-of-year to day-of-year.
          if ("V" in d) {
            if (d.V < 1 || d.V > 53) return null;
            if (!("w" in d)) d.w = 1;
            if ("Z" in d) {
              week = utcDate(newDate(d.y, 0, 1)), day$1 = week.getUTCDay();
              week = day$1 > 4 || day$1 === 0 ? utcMonday.ceil(week) : utcMonday(week);
              week = utcDay.offset(week, (d.V - 1) * 7);
              d.y = week.getUTCFullYear();
              d.m = week.getUTCMonth();
              d.d = week.getUTCDate() + (d.w + 6) % 7;
            } else {
              week = localDate(newDate(d.y, 0, 1)), day$1 = week.getDay();
              week = day$1 > 4 || day$1 === 0 ? monday.ceil(week) : monday(week);
              week = day.offset(week, (d.V - 1) * 7);
              d.y = week.getFullYear();
              d.m = week.getMonth();
              d.d = week.getDate() + (d.w + 6) % 7;
            }
          } else if ("W" in d || "U" in d) {
            if (!("w" in d)) d.w = "u" in d ? d.u % 7 : "W" in d ? 1 : 0;
            day$1 = "Z" in d ? utcDate(newDate(d.y, 0, 1)).getUTCDay() : localDate(newDate(d.y, 0, 1)).getDay();
            d.m = 0;
            d.d = "W" in d ? (d.w + 6) % 7 + d.W * 7 - (day$1 + 5) % 7 : d.w + d.U * 7 - (day$1 + 6) % 7;
          }

          // If a time zone is specified, all fields are interpreted as UTC and then
          // offset according to the specified time zone.
          if ("Z" in d) {
            d.H += d.Z / 100 | 0;
            d.M += d.Z % 100;
            return utcDate(d);
          }

          // Otherwise, all fields are in local time.
          return localDate(d);
        };
      }

      function parseSpecifier(d, specifier, string, j) {
        var i = 0,
            n = specifier.length,
            m = string.length,
            c,
            parse;

        while (i < n) {
          if (j >= m) return -1;
          c = specifier.charCodeAt(i++);
          if (c === 37) {
            c = specifier.charAt(i++);
            parse = parses[c in pads ? specifier.charAt(i++) : c];
            if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
          } else if (c != string.charCodeAt(j++)) {
            return -1;
          }
        }

        return j;
      }

      function parsePeriod(d, string, i) {
        var n = periodRe.exec(string.slice(i));
        return n ? (d.p = periodLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseShortWeekday(d, string, i) {
        var n = shortWeekdayRe.exec(string.slice(i));
        return n ? (d.w = shortWeekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseWeekday(d, string, i) {
        var n = weekdayRe.exec(string.slice(i));
        return n ? (d.w = weekdayLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseShortMonth(d, string, i) {
        var n = shortMonthRe.exec(string.slice(i));
        return n ? (d.m = shortMonthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseMonth(d, string, i) {
        var n = monthRe.exec(string.slice(i));
        return n ? (d.m = monthLookup[n[0].toLowerCase()], i + n[0].length) : -1;
      }

      function parseLocaleDateTime(d, string, i) {
        return parseSpecifier(d, locale_dateTime, string, i);
      }

      function parseLocaleDate(d, string, i) {
        return parseSpecifier(d, locale_date, string, i);
      }

      function parseLocaleTime(d, string, i) {
        return parseSpecifier(d, locale_time, string, i);
      }

      function formatShortWeekday(d) {
        return locale_shortWeekdays[d.getDay()];
      }

      function formatWeekday(d) {
        return locale_weekdays[d.getDay()];
      }

      function formatShortMonth(d) {
        return locale_shortMonths[d.getMonth()];
      }

      function formatMonth(d) {
        return locale_months[d.getMonth()];
      }

      function formatPeriod(d) {
        return locale_periods[+(d.getHours() >= 12)];
      }

      function formatQuarter(d) {
        return 1 + ~~(d.getMonth() / 3);
      }

      function formatUTCShortWeekday(d) {
        return locale_shortWeekdays[d.getUTCDay()];
      }

      function formatUTCWeekday(d) {
        return locale_weekdays[d.getUTCDay()];
      }

      function formatUTCShortMonth(d) {
        return locale_shortMonths[d.getUTCMonth()];
      }

      function formatUTCMonth(d) {
        return locale_months[d.getUTCMonth()];
      }

      function formatUTCPeriod(d) {
        return locale_periods[+(d.getUTCHours() >= 12)];
      }

      function formatUTCQuarter(d) {
        return 1 + ~~(d.getUTCMonth() / 3);
      }

      return {
        format: function(specifier) {
          var f = newFormat(specifier += "", formats);
          f.toString = function() { return specifier; };
          return f;
        },
        parse: function(specifier) {
          var p = newParse(specifier += "", false);
          p.toString = function() { return specifier; };
          return p;
        },
        utcFormat: function(specifier) {
          var f = newFormat(specifier += "", utcFormats);
          f.toString = function() { return specifier; };
          return f;
        },
        utcParse: function(specifier) {
          var p = newParse(specifier += "", true);
          p.toString = function() { return specifier; };
          return p;
        }
      };
    }

    var pads = {"-": "", "_": " ", "0": "0"},
        numberRe = /^\s*\d+/, // note: ignores next directive
        percentRe = /^%/,
        requoteRe = /[\\^$*+?|[\]().{}]/g;

    function pad(value, fill, width) {
      var sign = value < 0 ? "-" : "",
          string = (sign ? -value : value) + "",
          length = string.length;
      return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
    }

    function requote(s) {
      return s.replace(requoteRe, "\\$&");
    }

    function formatRe(names) {
      return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
    }

    function formatLookup(names) {
      var map = {}, i = -1, n = names.length;
      while (++i < n) map[names[i].toLowerCase()] = i;
      return map;
    }

    function parseWeekdayNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.w = +n[0], i + n[0].length) : -1;
    }

    function parseWeekdayNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.u = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberSunday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.U = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberISO(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.V = +n[0], i + n[0].length) : -1;
    }

    function parseWeekNumberMonday(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.W = +n[0], i + n[0].length) : -1;
    }

    function parseFullYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 4));
      return n ? (d.y = +n[0], i + n[0].length) : -1;
    }

    function parseYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
    }

    function parseZone(d, string, i) {
      var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(string.slice(i, i + 6));
      return n ? (d.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), i + n[0].length) : -1;
    }

    function parseQuarter(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 1));
      return n ? (d.q = n[0] * 3 - 3, i + n[0].length) : -1;
    }

    function parseMonthNumber(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
    }

    function parseDayOfMonth(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.d = +n[0], i + n[0].length) : -1;
    }

    function parseDayOfYear(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
    }

    function parseHour24(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.H = +n[0], i + n[0].length) : -1;
    }

    function parseMinutes(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.M = +n[0], i + n[0].length) : -1;
    }

    function parseSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 2));
      return n ? (d.S = +n[0], i + n[0].length) : -1;
    }

    function parseMilliseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 3));
      return n ? (d.L = +n[0], i + n[0].length) : -1;
    }

    function parseMicroseconds(d, string, i) {
      var n = numberRe.exec(string.slice(i, i + 6));
      return n ? (d.L = Math.floor(n[0] / 1000), i + n[0].length) : -1;
    }

    function parseLiteralPercent(d, string, i) {
      var n = percentRe.exec(string.slice(i, i + 1));
      return n ? i + n[0].length : -1;
    }

    function parseUnixTimestamp(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.Q = +n[0], i + n[0].length) : -1;
    }

    function parseUnixTimestampSeconds(d, string, i) {
      var n = numberRe.exec(string.slice(i));
      return n ? (d.s = +n[0], i + n[0].length) : -1;
    }

    function formatDayOfMonth(d, p) {
      return pad(d.getDate(), p, 2);
    }

    function formatHour24(d, p) {
      return pad(d.getHours(), p, 2);
    }

    function formatHour12(d, p) {
      return pad(d.getHours() % 12 || 12, p, 2);
    }

    function formatDayOfYear(d, p) {
      return pad(1 + day.count(year(d), d), p, 3);
    }

    function formatMilliseconds(d, p) {
      return pad(d.getMilliseconds(), p, 3);
    }

    function formatMicroseconds(d, p) {
      return formatMilliseconds(d, p) + "000";
    }

    function formatMonthNumber(d, p) {
      return pad(d.getMonth() + 1, p, 2);
    }

    function formatMinutes(d, p) {
      return pad(d.getMinutes(), p, 2);
    }

    function formatSeconds(d, p) {
      return pad(d.getSeconds(), p, 2);
    }

    function formatWeekdayNumberMonday(d) {
      var day = d.getDay();
      return day === 0 ? 7 : day;
    }

    function formatWeekNumberSunday(d, p) {
      return pad(sunday.count(year(d) - 1, d), p, 2);
    }

    function dISO(d) {
      var day = d.getDay();
      return (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
    }

    function formatWeekNumberISO(d, p) {
      d = dISO(d);
      return pad(thursday.count(year(d), d) + (year(d).getDay() === 4), p, 2);
    }

    function formatWeekdayNumberSunday(d) {
      return d.getDay();
    }

    function formatWeekNumberMonday(d, p) {
      return pad(monday.count(year(d) - 1, d), p, 2);
    }

    function formatYear(d, p) {
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatYearISO(d, p) {
      d = dISO(d);
      return pad(d.getFullYear() % 100, p, 2);
    }

    function formatFullYear(d, p) {
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatFullYearISO(d, p) {
      var day = d.getDay();
      d = (day >= 4 || day === 0) ? thursday(d) : thursday.ceil(d);
      return pad(d.getFullYear() % 10000, p, 4);
    }

    function formatZone(d) {
      var z = d.getTimezoneOffset();
      return (z > 0 ? "-" : (z *= -1, "+"))
          + pad(z / 60 | 0, "0", 2)
          + pad(z % 60, "0", 2);
    }

    function formatUTCDayOfMonth(d, p) {
      return pad(d.getUTCDate(), p, 2);
    }

    function formatUTCHour24(d, p) {
      return pad(d.getUTCHours(), p, 2);
    }

    function formatUTCHour12(d, p) {
      return pad(d.getUTCHours() % 12 || 12, p, 2);
    }

    function formatUTCDayOfYear(d, p) {
      return pad(1 + utcDay.count(utcYear(d), d), p, 3);
    }

    function formatUTCMilliseconds(d, p) {
      return pad(d.getUTCMilliseconds(), p, 3);
    }

    function formatUTCMicroseconds(d, p) {
      return formatUTCMilliseconds(d, p) + "000";
    }

    function formatUTCMonthNumber(d, p) {
      return pad(d.getUTCMonth() + 1, p, 2);
    }

    function formatUTCMinutes(d, p) {
      return pad(d.getUTCMinutes(), p, 2);
    }

    function formatUTCSeconds(d, p) {
      return pad(d.getUTCSeconds(), p, 2);
    }

    function formatUTCWeekdayNumberMonday(d) {
      var dow = d.getUTCDay();
      return dow === 0 ? 7 : dow;
    }

    function formatUTCWeekNumberSunday(d, p) {
      return pad(utcSunday.count(utcYear(d) - 1, d), p, 2);
    }

    function UTCdISO(d) {
      var day = d.getUTCDay();
      return (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
    }

    function formatUTCWeekNumberISO(d, p) {
      d = UTCdISO(d);
      return pad(utcThursday.count(utcYear(d), d) + (utcYear(d).getUTCDay() === 4), p, 2);
    }

    function formatUTCWeekdayNumberSunday(d) {
      return d.getUTCDay();
    }

    function formatUTCWeekNumberMonday(d, p) {
      return pad(utcMonday.count(utcYear(d) - 1, d), p, 2);
    }

    function formatUTCYear(d, p) {
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCYearISO(d, p) {
      d = UTCdISO(d);
      return pad(d.getUTCFullYear() % 100, p, 2);
    }

    function formatUTCFullYear(d, p) {
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCFullYearISO(d, p) {
      var day = d.getUTCDay();
      d = (day >= 4 || day === 0) ? utcThursday(d) : utcThursday.ceil(d);
      return pad(d.getUTCFullYear() % 10000, p, 4);
    }

    function formatUTCZone() {
      return "+0000";
    }

    function formatLiteralPercent() {
      return "%";
    }

    function formatUnixTimestamp(d) {
      return +d;
    }

    function formatUnixTimestampSeconds(d) {
      return Math.floor(+d / 1000);
    }

    var locale$1;
    var timeFormat;
    var timeParse;
    var utcFormat;
    var utcParse;

    defaultLocale$1({
      dateTime: "%x, %X",
      date: "%-m/%-d/%Y",
      time: "%-I:%M:%S %p",
      periods: ["AM", "PM"],
      days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    });

    function defaultLocale$1(definition) {
      locale$1 = formatLocale$1(definition);
      timeFormat = locale$1.format;
      timeParse = locale$1.parse;
      utcFormat = locale$1.utcFormat;
      utcParse = locale$1.utcParse;
      return locale$1;
    }

    function colors(s) {
      return s.match(/.{6}/g).map(function(x) {
        return "#" + x;
      });
    }

    colors("1f77b4ff7f0e2ca02cd627289467bd8c564be377c27f7f7fbcbd2217becf");

    colors("393b795254a36b6ecf9c9ede6379398ca252b5cf6bcedb9c8c6d31bd9e39e7ba52e7cb94843c39ad494ad6616be7969c7b4173a55194ce6dbdde9ed6");

    colors("3182bd6baed69ecae1c6dbefe6550dfd8d3cfdae6bfdd0a231a35474c476a1d99bc7e9c0756bb19e9ac8bcbddcdadaeb636363969696bdbdbdd9d9d9");

    colors("1f77b4aec7e8ff7f0effbb782ca02c98df8ad62728ff98969467bdc5b0d58c564bc49c94e377c2f7b6d27f7f7fc7c7c7bcbd22dbdb8d17becf9edae5");

    cubehelixLong(cubehelix(300, 0.5, 0.0), cubehelix(-240, 0.5, 1.0));

    var warm = cubehelixLong(cubehelix(-100, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

    var cool = cubehelixLong(cubehelix(260, 0.75, 0.35), cubehelix(80, 1.50, 0.8));

    var rainbow = cubehelix();

    function ramp(range) {
      var n = range.length;
      return function(t) {
        return range[Math.max(0, Math.min(n - 1, Math.floor(t * n)))];
      };
    }

    ramp(colors("44015444025645045745055946075a46085c460a5d460b5e470d60470e6147106347116447136548146748166848176948186a481a6c481b6d481c6e481d6f481f70482071482173482374482475482576482677482878482979472a7a472c7a472d7b472e7c472f7d46307e46327e46337f463480453581453781453882443983443a83443b84433d84433e85423f854240864241864142874144874045884046883f47883f48893e49893e4a893e4c8a3d4d8a3d4e8a3c4f8a3c508b3b518b3b528b3a538b3a548c39558c39568c38588c38598c375a8c375b8d365c8d365d8d355e8d355f8d34608d34618d33628d33638d32648e32658e31668e31678e31688e30698e306a8e2f6b8e2f6c8e2e6d8e2e6e8e2e6f8e2d708e2d718e2c718e2c728e2c738e2b748e2b758e2a768e2a778e2a788e29798e297a8e297b8e287c8e287d8e277e8e277f8e27808e26818e26828e26828e25838e25848e25858e24868e24878e23888e23898e238a8d228b8d228c8d228d8d218e8d218f8d21908d21918c20928c20928c20938c1f948c1f958b1f968b1f978b1f988b1f998a1f9a8a1e9b8a1e9c891e9d891f9e891f9f881fa0881fa1881fa1871fa28720a38620a48621a58521a68522a78522a88423a98324aa8325ab8225ac8226ad8127ad8128ae8029af7f2ab07f2cb17e2db27d2eb37c2fb47c31b57b32b67a34b67935b77937b87838b9773aba763bbb753dbc743fbc7340bd7242be7144bf7046c06f48c16e4ac16d4cc26c4ec36b50c46a52c56954c56856c66758c7655ac8645cc8635ec96260ca6063cb5f65cb5e67cc5c69cd5b6ccd5a6ece5870cf5773d05675d05477d1537ad1517cd2507fd34e81d34d84d44b86d54989d5488bd6468ed64590d74393d74195d84098d83e9bd93c9dd93ba0da39a2da37a5db36a8db34aadc32addc30b0dd2fb2dd2db5de2bb8de29bade28bddf26c0df25c2df23c5e021c8e020cae11fcde11dd0e11cd2e21bd5e21ad8e219dae319dde318dfe318e2e418e5e419e7e419eae51aece51befe51cf1e51df4e61ef6e620f8e621fbe723fde725"));

    var magma = ramp(colors("00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf"));

    var inferno = ramp(colors("00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4"));

    var plasma = ramp(colors("0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921"));

    var xhtml = "http://www.w3.org/1999/xhtml";

    var namespaces = {
      svg: "http://www.w3.org/2000/svg",
      xhtml: xhtml,
      xlink: "http://www.w3.org/1999/xlink",
      xml: "http://www.w3.org/XML/1998/namespace",
      xmlns: "http://www.w3.org/2000/xmlns/"
    };

    function namespace(name) {
      var prefix = name += "", i = prefix.indexOf(":");
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return namespaces.hasOwnProperty(prefix) ? {space: namespaces[prefix], local: name} : name;
    }

    function creatorInherit(name) {
      return function() {
        var document = this.ownerDocument,
            uri = this.namespaceURI;
        return uri === xhtml && document.documentElement.namespaceURI === xhtml
            ? document.createElement(name)
            : document.createElementNS(uri, name);
      };
    }

    function creatorFixed(fullname) {
      return function() {
        return this.ownerDocument.createElementNS(fullname.space, fullname.local);
      };
    }

    function creator(name) {
      var fullname = namespace(name);
      return (fullname.local
          ? creatorFixed
          : creatorInherit)(fullname);
    }

    var matcher = function(selector) {
      return function() {
        return this.matches(selector);
      };
    };

    if (typeof document !== "undefined") {
      var element$1 = document.documentElement;
      if (!element$1.matches) {
        var vendorMatches = element$1.webkitMatchesSelector
            || element$1.msMatchesSelector
            || element$1.mozMatchesSelector
            || element$1.oMatchesSelector;
        matcher = function(selector) {
          return function() {
            return vendorMatches.call(this, selector);
          };
        };
      }
    }

    var matcher$1 = matcher;

    var filterEvents = {};

    var event = null;

    if (typeof document !== "undefined") {
      var element$2 = document.documentElement;
      if (!("onmouseenter" in element$2)) {
        filterEvents = {mouseenter: "mouseover", mouseleave: "mouseout"};
      }
    }

    function filterContextListener(listener, index, group) {
      listener = contextListener(listener, index, group);
      return function(event) {
        var related = event.relatedTarget;
        if (!related || (related !== this && !(related.compareDocumentPosition(this) & 8))) {
          listener.call(this, event);
        }
      };
    }

    function contextListener(listener, index, group) {
      return function(event1) {
        var event0 = event; // Events can be reentrant (e.g., focus).
        event = event1;
        try {
          listener.call(this, this.__data__, index, group);
        } finally {
          event = event0;
        }
      };
    }

    function parseTypenames(typenames) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        return {type: t, name: name};
      });
    }

    function onRemove(typename) {
      return function() {
        var on = this.__on;
        if (!on) return;
        for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
          if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
          } else {
            on[++i] = o;
          }
        }
        if (++i) on.length = i;
        else delete this.__on;
      };
    }

    function onAdd(typename, value, capture) {
      var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
      return function(d, i, group) {
        var on = this.__on, o, listener = wrap(value, i, group);
        if (on) for (var j = 0, m = on.length; j < m; ++j) {
          if ((o = on[j]).type === typename.type && o.name === typename.name) {
            this.removeEventListener(o.type, o.listener, o.capture);
            this.addEventListener(o.type, o.listener = listener, o.capture = capture);
            o.value = value;
            return;
          }
        }
        this.addEventListener(typename.type, listener, capture);
        o = {type: typename.type, name: typename.name, value: value, listener: listener, capture: capture};
        if (!on) this.__on = [o];
        else on.push(o);
      };
    }

    function selection_on(typename, value, capture) {
      var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

      if (arguments.length < 2) {
        var on = this.node().__on;
        if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
          for (i = 0, o = on[j]; i < n; ++i) {
            if ((t = typenames[i]).type === o.type && t.name === o.name) {
              return o.value;
            }
          }
        }
        return;
      }

      on = value ? onAdd : onRemove;
      if (capture == null) capture = false;
      for (i = 0; i < n; ++i) this.each(on(typenames[i], value, capture));
      return this;
    }

    function sourceEvent() {
      var current = event, source;
      while (source = current.sourceEvent) current = source;
      return current;
    }

    function point(node, event) {
      var svg = node.ownerSVGElement || node;

      if (svg.createSVGPoint) {
        var point = svg.createSVGPoint();
        point.x = event.clientX, point.y = event.clientY;
        point = point.matrixTransform(node.getScreenCTM().inverse());
        return [point.x, point.y];
      }

      var rect = node.getBoundingClientRect();
      return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
    }

    function mouse(node) {
      var event = sourceEvent();
      if (event.changedTouches) event = event.changedTouches[0];
      return point(node, event);
    }

    function none() {}

    function selector(selector) {
      return selector == null ? none : function() {
        return this.querySelector(selector);
      };
    }

    function selection_select(select) {
      if (typeof select !== "function") select = selector(select);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
          if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
            if ("__data__" in node) subnode.__data__ = node.__data__;
            subgroup[i] = subnode;
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function empty$1() {
      return [];
    }

    function selectorAll(selector) {
      return selector == null ? empty$1 : function() {
        return this.querySelectorAll(selector);
      };
    }

    function selection_selectAll(select) {
      if (typeof select !== "function") select = selectorAll(select);

      for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            subgroups.push(select.call(node, node.__data__, i, group));
            parents.push(node);
          }
        }
      }

      return new Selection(subgroups, parents);
    }

    function selection_filter(match) {
      if (typeof match !== "function") match = matcher$1(match);

      for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
          if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
            subgroup.push(node);
          }
        }
      }

      return new Selection(subgroups, this._parents);
    }

    function sparse(update) {
      return new Array(update.length);
    }

    function selection_enter() {
      return new Selection(this._enter || this._groups.map(sparse), this._parents);
    }

    function EnterNode(parent, datum) {
      this.ownerDocument = parent.ownerDocument;
      this.namespaceURI = parent.namespaceURI;
      this._next = null;
      this._parent = parent;
      this.__data__ = datum;
    }

    EnterNode.prototype = {
      constructor: EnterNode,
      appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
      insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
      querySelector: function(selector) { return this._parent.querySelector(selector); },
      querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
    };

    function constant$2(x) {
      return function() {
        return x;
      };
    }

    var keyPrefix = "$"; // Protect against keys like “__proto__”.

    function bindIndex(parent, group, enter, update, exit, data) {
      var i = 0,
          node,
          groupLength = group.length,
          dataLength = data.length;

      // Put any non-null nodes that fit into update.
      // Put any null nodes into enter.
      // Put any remaining data into enter.
      for (; i < dataLength; ++i) {
        if (node = group[i]) {
          node.__data__ = data[i];
          update[i] = node;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Put any non-null nodes that don’t fit into exit.
      for (; i < groupLength; ++i) {
        if (node = group[i]) {
          exit[i] = node;
        }
      }
    }

    function bindKey(parent, group, enter, update, exit, data, key) {
      var i,
          node,
          nodeByKeyValue = {},
          groupLength = group.length,
          dataLength = data.length,
          keyValues = new Array(groupLength),
          keyValue;

      // Compute the key for each node.
      // If multiple nodes have the same key, the duplicates are added to exit.
      for (i = 0; i < groupLength; ++i) {
        if (node = group[i]) {
          keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
          if (keyValue in nodeByKeyValue) {
            exit[i] = node;
          } else {
            nodeByKeyValue[keyValue] = node;
          }
        }
      }

      // Compute the key for each datum.
      // If there a node associated with this key, join and add it to update.
      // If there is not (or the key is a duplicate), add it to enter.
      for (i = 0; i < dataLength; ++i) {
        keyValue = keyPrefix + key.call(parent, data[i], i, data);
        if (node = nodeByKeyValue[keyValue]) {
          update[i] = node;
          node.__data__ = data[i];
          nodeByKeyValue[keyValue] = null;
        } else {
          enter[i] = new EnterNode(parent, data[i]);
        }
      }

      // Add any remaining nodes that were not bound to data to exit.
      for (i = 0; i < groupLength; ++i) {
        if ((node = group[i]) && (nodeByKeyValue[keyValues[i]] === node)) {
          exit[i] = node;
        }
      }
    }

    function selection_data(value, key) {
      if (!value) {
        data = new Array(this.size()), j = -1;
        this.each(function(d) { data[++j] = d; });
        return data;
      }

      var bind = key ? bindKey : bindIndex,
          parents = this._parents,
          groups = this._groups;

      if (typeof value !== "function") value = constant$2(value);

      for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
        var parent = parents[j],
            group = groups[j],
            groupLength = group.length,
            data = value.call(parent, parent && parent.__data__, j, parents),
            dataLength = data.length,
            enterGroup = enter[j] = new Array(dataLength),
            updateGroup = update[j] = new Array(dataLength),
            exitGroup = exit[j] = new Array(groupLength);

        bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

        // Now connect the enter nodes to their following update node, such that
        // appendChild can insert the materialized enter node before this node,
        // rather than at the end of the parent node.
        for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
          if (previous = enterGroup[i0]) {
            if (i0 >= i1) i1 = i0 + 1;
            while (!(next = updateGroup[i1]) && ++i1 < dataLength);
            previous._next = next || null;
          }
        }
      }

      update = new Selection(update, parents);
      update._enter = enter;
      update._exit = exit;
      return update;
    }

    function selection_exit() {
      return new Selection(this._exit || this._groups.map(sparse), this._parents);
    }

    function selection_merge(selection) {

      for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
        for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group0[i] || group1[i]) {
            merge[i] = node;
          }
        }
      }

      for (; j < m0; ++j) {
        merges[j] = groups0[j];
      }

      return new Selection(merges, this._parents);
    }

    function selection_order() {

      for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
        for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
          if (node = group[i]) {
            if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
            next = node;
          }
        }
      }

      return this;
    }

    function selection_sort(compare) {
      if (!compare) compare = ascending$1;

      function compareNode(a, b) {
        return a && b ? compare(a.__data__, b.__data__) : !a - !b;
      }

      for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
        for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
          if (node = group[i]) {
            sortgroup[i] = node;
          }
        }
        sortgroup.sort(compareNode);
      }

      return new Selection(sortgroups, this._parents).order();
    }

    function ascending$1(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function selection_call() {
      var callback = arguments[0];
      arguments[0] = this;
      callback.apply(null, arguments);
      return this;
    }

    function selection_nodes() {
      var nodes = new Array(this.size()), i = -1;
      this.each(function() { nodes[++i] = this; });
      return nodes;
    }

    function selection_node() {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
          var node = group[i];
          if (node) return node;
        }
      }

      return null;
    }

    function selection_size() {
      var size = 0;
      this.each(function() { ++size; });
      return size;
    }

    function selection_empty() {
      return !this.node();
    }

    function selection_each(callback) {

      for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
        for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
          if (node = group[i]) callback.call(node, node.__data__, i, group);
        }
      }

      return this;
    }

    function attrRemove(name) {
      return function() {
        this.removeAttribute(name);
      };
    }

    function attrRemoveNS(fullname) {
      return function() {
        this.removeAttributeNS(fullname.space, fullname.local);
      };
    }

    function attrConstant(name, value) {
      return function() {
        this.setAttribute(name, value);
      };
    }

    function attrConstantNS(fullname, value) {
      return function() {
        this.setAttributeNS(fullname.space, fullname.local, value);
      };
    }

    function attrFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttribute(name);
        else this.setAttribute(name, v);
      };
    }

    function attrFunctionNS(fullname, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
        else this.setAttributeNS(fullname.space, fullname.local, v);
      };
    }

    function selection_attr(name, value) {
      var fullname = namespace(name);

      if (arguments.length < 2) {
        var node = this.node();
        return fullname.local
            ? node.getAttributeNS(fullname.space, fullname.local)
            : node.getAttribute(fullname);
      }

      return this.each((value == null
          ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
          ? (fullname.local ? attrFunctionNS : attrFunction)
          : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
    }

    function defaultView(node) {
      return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
          || (node.document && node) // node is a Window
          || node.defaultView; // node is a Document
    }

    function styleRemove(name) {
      return function() {
        this.style.removeProperty(name);
      };
    }

    function styleConstant(name, value, priority) {
      return function() {
        this.style.setProperty(name, value, priority);
      };
    }

    function styleFunction(name, value, priority) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) this.style.removeProperty(name);
        else this.style.setProperty(name, v, priority);
      };
    }

    function selection_style(name, value, priority) {
      var node;
      return arguments.length > 1
          ? this.each((value == null
                ? styleRemove : typeof value === "function"
                ? styleFunction
                : styleConstant)(name, value, priority == null ? "" : priority))
          : defaultView(node = this.node())
              .getComputedStyle(node, null)
              .getPropertyValue(name);
    }

    function propertyRemove(name) {
      return function() {
        delete this[name];
      };
    }

    function propertyConstant(name, value) {
      return function() {
        this[name] = value;
      };
    }

    function propertyFunction(name, value) {
      return function() {
        var v = value.apply(this, arguments);
        if (v == null) delete this[name];
        else this[name] = v;
      };
    }

    function selection_property(name, value) {
      return arguments.length > 1
          ? this.each((value == null
              ? propertyRemove : typeof value === "function"
              ? propertyFunction
              : propertyConstant)(name, value))
          : this.node()[name];
    }

    function classArray(string) {
      return string.trim().split(/^|\s+/);
    }

    function classList(node) {
      return node.classList || new ClassList(node);
    }

    function ClassList(node) {
      this._node = node;
      this._names = classArray(node.getAttribute("class") || "");
    }

    ClassList.prototype = {
      add: function(name) {
        var i = this._names.indexOf(name);
        if (i < 0) {
          this._names.push(name);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      remove: function(name) {
        var i = this._names.indexOf(name);
        if (i >= 0) {
          this._names.splice(i, 1);
          this._node.setAttribute("class", this._names.join(" "));
        }
      },
      contains: function(name) {
        return this._names.indexOf(name) >= 0;
      }
    };

    function classedAdd(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.add(names[i]);
    }

    function classedRemove(node, names) {
      var list = classList(node), i = -1, n = names.length;
      while (++i < n) list.remove(names[i]);
    }

    function classedTrue(names) {
      return function() {
        classedAdd(this, names);
      };
    }

    function classedFalse(names) {
      return function() {
        classedRemove(this, names);
      };
    }

    function classedFunction(names, value) {
      return function() {
        (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
      };
    }

    function selection_classed(name, value) {
      var names = classArray(name + "");

      if (arguments.length < 2) {
        var list = classList(this.node()), i = -1, n = names.length;
        while (++i < n) if (!list.contains(names[i])) return false;
        return true;
      }

      return this.each((typeof value === "function"
          ? classedFunction : value
          ? classedTrue
          : classedFalse)(names, value));
    }

    function textRemove() {
      this.textContent = "";
    }

    function textConstant(value) {
      return function() {
        this.textContent = value;
      };
    }

    function textFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.textContent = v == null ? "" : v;
      };
    }

    function selection_text(value) {
      return arguments.length
          ? this.each(value == null
              ? textRemove : (typeof value === "function"
              ? textFunction
              : textConstant)(value))
          : this.node().textContent;
    }

    function htmlRemove() {
      this.innerHTML = "";
    }

    function htmlConstant(value) {
      return function() {
        this.innerHTML = value;
      };
    }

    function htmlFunction(value) {
      return function() {
        var v = value.apply(this, arguments);
        this.innerHTML = v == null ? "" : v;
      };
    }

    function selection_html(value) {
      return arguments.length
          ? this.each(value == null
              ? htmlRemove : (typeof value === "function"
              ? htmlFunction
              : htmlConstant)(value))
          : this.node().innerHTML;
    }

    function raise() {
      if (this.nextSibling) this.parentNode.appendChild(this);
    }

    function selection_raise() {
      return this.each(raise);
    }

    function lower() {
      if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
    }

    function selection_lower() {
      return this.each(lower);
    }

    function selection_append(name) {
      var create = typeof name === "function" ? name : creator(name);
      return this.select(function() {
        return this.appendChild(create.apply(this, arguments));
      });
    }

    function constantNull() {
      return null;
    }

    function selection_insert(name, before) {
      var create = typeof name === "function" ? name : creator(name),
          select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
      return this.select(function() {
        return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
      });
    }

    function remove() {
      var parent = this.parentNode;
      if (parent) parent.removeChild(this);
    }

    function selection_remove() {
      return this.each(remove);
    }

    function selection_datum(value) {
      return arguments.length
          ? this.property("__data__", value)
          : this.node().__data__;
    }

    function dispatchEvent(node, type, params) {
      var window = defaultView(node),
          event = window.CustomEvent;

      if (event) {
        event = new event(type, params);
      } else {
        event = window.document.createEvent("Event");
        if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
        else event.initEvent(type, false, false);
      }

      node.dispatchEvent(event);
    }

    function dispatchConstant(type, params) {
      return function() {
        return dispatchEvent(this, type, params);
      };
    }

    function dispatchFunction(type, params) {
      return function() {
        return dispatchEvent(this, type, params.apply(this, arguments));
      };
    }

    function selection_dispatch(type, params) {
      return this.each((typeof params === "function"
          ? dispatchFunction
          : dispatchConstant)(type, params));
    }

    var root = [null];

    function Selection(groups, parents) {
      this._groups = groups;
      this._parents = parents;
    }

    function selection() {
      return new Selection([[document.documentElement]], root);
    }

    Selection.prototype = selection.prototype = {
      constructor: Selection,
      select: selection_select,
      selectAll: selection_selectAll,
      filter: selection_filter,
      data: selection_data,
      enter: selection_enter,
      exit: selection_exit,
      merge: selection_merge,
      order: selection_order,
      sort: selection_sort,
      call: selection_call,
      nodes: selection_nodes,
      node: selection_node,
      size: selection_size,
      empty: selection_empty,
      each: selection_each,
      attr: selection_attr,
      style: selection_style,
      property: selection_property,
      classed: selection_classed,
      text: selection_text,
      html: selection_html,
      raise: selection_raise,
      lower: selection_lower,
      append: selection_append,
      insert: selection_insert,
      remove: selection_remove,
      datum: selection_datum,
      on: selection_on,
      dispatch: selection_dispatch
    };

    function select(selector) {
      return typeof selector === "string"
          ? new Selection([[document.querySelector(selector)]], [document.documentElement])
          : new Selection([[selector]], root);
    }

    const pi = Math.PI,
        tau = 2 * pi,
        epsilon = 1e-6,
        tauEpsilon = tau - epsilon;

    function Path() {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = "";
    }

    function path() {
      return new Path;
    }

    Path.prototype = path.prototype = {
      constructor: Path,
      moveTo: function(x, y) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
      },
      closePath: function() {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._ += "Z";
        }
      },
      lineTo: function(x, y) {
        this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      quadraticCurveTo: function(x1, y1, x, y) {
        this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) {
        this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      arcTo: function(x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x0 = this._x1,
            y0 = this._y1,
            x21 = x2 - x1,
            y21 = y2 - y1,
            x01 = x0 - x1,
            y01 = y0 - y1,
            l01_2 = x01 * x01 + y01 * y01;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x1,y1).
        if (this._x1 === null) {
          this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > epsilon));

        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
          var x20 = x2 - x0,
              y20 = y2 - y0,
              l21_2 = x21 * x21 + y21 * y21,
              l20_2 = x20 * x20 + y20 * y20,
              l21 = Math.sqrt(l21_2),
              l01 = Math.sqrt(l01_2),
              l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
              t01 = l / l01,
              t21 = l / l21;

          // If the start tangent is not coincident with (x0,y0), line to.
          if (Math.abs(t01 - 1) > epsilon) {
            this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
          }

          this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
        }
      },
      arc: function(x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r, ccw = !!ccw;
        var dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x0,y0).
        if (this._x1 === null) {
          this._ += "M" + x0 + "," + y0;
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
          this._ += "L" + x0 + "," + y0;
        }

        // Is this arc empty? We’re done.
        if (!r) return;

        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) da = da % tau + tau;

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon) {
          this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
        }

        // Is this arc non-empty? Draw an arc!
        else if (da > epsilon) {
          this._ += "A" + r + "," + r + ",0," + (+(da >= pi)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
        }
      },
      rect: function(x, y, w, h) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
      },
      toString: function() {
        return this._;
      }
    };

    var pi$1 = Math.PI,
        tau$1 = 2 * pi$1,
        epsilon$1 = 1e-6,
        tauEpsilon$1 = tau$1 - epsilon$1;

    function Path$1() {
      this._x0 = this._y0 = // start of current subpath
      this._x1 = this._y1 = null; // end of current subpath
      this._ = "";
    }

    function path$1() {
      return new Path$1;
    }

    Path$1.prototype = path$1.prototype = {
      constructor: Path$1,
      moveTo: function(x, y) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
      },
      closePath: function() {
        if (this._x1 !== null) {
          this._x1 = this._x0, this._y1 = this._y0;
          this._ += "Z";
        }
      },
      lineTo: function(x, y) {
        this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      quadraticCurveTo: function(x1, y1, x, y) {
        this._ += "Q" + (+x1) + "," + (+y1) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) {
        this._ += "C" + (+x1) + "," + (+y1) + "," + (+x2) + "," + (+y2) + "," + (this._x1 = +x) + "," + (this._y1 = +y);
      },
      arcTo: function(x1, y1, x2, y2, r) {
        x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
        var x0 = this._x1,
            y0 = this._y1,
            x21 = x2 - x1,
            y21 = y2 - y1,
            x01 = x0 - x1,
            y01 = y0 - y1,
            l01_2 = x01 * x01 + y01 * y01;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x1,y1).
        if (this._x1 === null) {
          this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
        else if (!(l01_2 > epsilon$1));

        // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
        // Equivalently, is (x1,y1) coincident with (x2,y2)?
        // Or, is the radius zero? Line to (x1,y1).
        else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon$1) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
          var x20 = x2 - x0,
              y20 = y2 - y0,
              l21_2 = x21 * x21 + y21 * y21,
              l20_2 = x20 * x20 + y20 * y20,
              l21 = Math.sqrt(l21_2),
              l01 = Math.sqrt(l01_2),
              l = r * Math.tan((pi$1 - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
              t01 = l / l01,
              t21 = l / l21;

          // If the start tangent is not coincident with (x0,y0), line to.
          if (Math.abs(t01 - 1) > epsilon$1) {
            this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
          }

          this._ += "A" + r + "," + r + ",0,0," + (+(y01 * x20 > x01 * y20)) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
        }
      },
      arc: function(x, y, r, a0, a1, ccw) {
        x = +x, y = +y, r = +r, ccw = !!ccw;
        var dx = r * Math.cos(a0),
            dy = r * Math.sin(a0),
            x0 = x + dx,
            y0 = y + dy,
            cw = 1 ^ ccw,
            da = ccw ? a0 - a1 : a1 - a0;

        // Is the radius negative? Error.
        if (r < 0) throw new Error("negative radius: " + r);

        // Is this path empty? Move to (x0,y0).
        if (this._x1 === null) {
          this._ += "M" + x0 + "," + y0;
        }

        // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
        else if (Math.abs(this._x1 - x0) > epsilon$1 || Math.abs(this._y1 - y0) > epsilon$1) {
          this._ += "L" + x0 + "," + y0;
        }

        // Is this arc empty? We’re done.
        if (!r) return;

        // Does the angle go the wrong way? Flip the direction.
        if (da < 0) da = da % tau$1 + tau$1;

        // Is this a complete circle? Draw two arcs to complete the circle.
        if (da > tauEpsilon$1) {
          this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
        }

        // Is this arc non-empty? Draw an arc!
        else if (da > epsilon$1) {
          this._ += "A" + r + "," + r + ",0," + (+(da >= pi$1)) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
        }
      },
      rect: function(x, y, w, h) {
        this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + (+w) + "v" + (+h) + "h" + (-w) + "Z";
      },
      toString: function() {
        return this._;
      }
    };

    function constant$3(x) {
      return function constant() {
        return x;
      };
    }

    var abs = Math.abs;
    var atan2 = Math.atan2;
    var cos = Math.cos;
    var max = Math.max;
    var min = Math.min;
    var sin = Math.sin;
    var sqrt = Math.sqrt;

    var epsilon$2 = 1e-12;
    var pi$2 = Math.PI;
    var halfPi = pi$2 / 2;
    var tau$2 = 2 * pi$2;

    function acos(x) {
      return x > 1 ? 0 : x < -1 ? pi$2 : Math.acos(x);
    }

    function asin(x) {
      return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
    }

    function arcInnerRadius(d) {
      return d.innerRadius;
    }

    function arcOuterRadius(d) {
      return d.outerRadius;
    }

    function arcStartAngle(d) {
      return d.startAngle;
    }

    function arcEndAngle(d) {
      return d.endAngle;
    }

    function arcPadAngle(d) {
      return d && d.padAngle; // Note: optional!
    }

    function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
      var x10 = x1 - x0, y10 = y1 - y0,
          x32 = x3 - x2, y32 = y3 - y2,
          t = y32 * x10 - x32 * y10;
      if (t * t < epsilon$2) return;
      t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
      return [x0 + t * x10, y0 + t * y10];
    }

    // Compute perpendicular offset line of length rc.
    // http://mathworld.wolfram.com/Circle-LineIntersection.html
    function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
      var x01 = x0 - x1,
          y01 = y0 - y1,
          lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01),
          ox = lo * y01,
          oy = -lo * x01,
          x11 = x0 + ox,
          y11 = y0 + oy,
          x10 = x1 + ox,
          y10 = y1 + oy,
          x00 = (x11 + x10) / 2,
          y00 = (y11 + y10) / 2,
          dx = x10 - x11,
          dy = y10 - y11,
          d2 = dx * dx + dy * dy,
          r = r1 - rc,
          D = x11 * y10 - x10 * y11,
          d = (dy < 0 ? -1 : 1) * sqrt(max(0, r * r * d2 - D * D)),
          cx0 = (D * dy - dx * d) / d2,
          cy0 = (-D * dx - dy * d) / d2,
          cx1 = (D * dy + dx * d) / d2,
          cy1 = (-D * dx + dy * d) / d2,
          dx0 = cx0 - x00,
          dy0 = cy0 - y00,
          dx1 = cx1 - x00,
          dy1 = cy1 - y00;

      // Pick the closer of the two intersection points.
      // TODO Is there a faster way to determine which intersection to use?
      if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

      return {
        cx: cx0,
        cy: cy0,
        x01: -ox,
        y01: -oy,
        x11: cx0 * (r1 / r - 1),
        y11: cy0 * (r1 / r - 1)
      };
    }

    function arc() {
      var innerRadius = arcInnerRadius,
          outerRadius = arcOuterRadius,
          cornerRadius = constant$3(0),
          padRadius = null,
          startAngle = arcStartAngle,
          endAngle = arcEndAngle,
          padAngle = arcPadAngle,
          context = null;

      function arc() {
        var buffer,
            r,
            r0 = +innerRadius.apply(this, arguments),
            r1 = +outerRadius.apply(this, arguments),
            a0 = startAngle.apply(this, arguments) - halfPi,
            a1 = endAngle.apply(this, arguments) - halfPi,
            da = abs(a1 - a0),
            cw = a1 > a0;

        if (!context) context = buffer = path$1();

        // Ensure that the outer radius is always larger than the inner radius.
        if (r1 < r0) r = r1, r1 = r0, r0 = r;

        // Is it a point?
        if (!(r1 > epsilon$2)) context.moveTo(0, 0);

        // Or is it a circle or annulus?
        else if (da > tau$2 - epsilon$2) {
          context.moveTo(r1 * cos(a0), r1 * sin(a0));
          context.arc(0, 0, r1, a0, a1, !cw);
          if (r0 > epsilon$2) {
            context.moveTo(r0 * cos(a1), r0 * sin(a1));
            context.arc(0, 0, r0, a1, a0, cw);
          }
        }

        // Or is it a circular or annular sector?
        else {
          var a01 = a0,
              a11 = a1,
              a00 = a0,
              a10 = a1,
              da0 = da,
              da1 = da,
              ap = padAngle.apply(this, arguments) / 2,
              rp = (ap > epsilon$2) && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)),
              rc = min(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
              rc0 = rc,
              rc1 = rc,
              t0,
              t1;

          // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
          if (rp > epsilon$2) {
            var p0 = asin(rp / r0 * sin(ap)),
                p1 = asin(rp / r1 * sin(ap));
            if ((da0 -= p0 * 2) > epsilon$2) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
            else da0 = 0, a00 = a10 = (a0 + a1) / 2;
            if ((da1 -= p1 * 2) > epsilon$2) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
            else da1 = 0, a01 = a11 = (a0 + a1) / 2;
          }

          var x01 = r1 * cos(a01),
              y01 = r1 * sin(a01),
              x10 = r0 * cos(a10),
              y10 = r0 * sin(a10);

          // Apply rounded corners?
          if (rc > epsilon$2) {
            var x11 = r1 * cos(a11),
                y11 = r1 * sin(a11),
                x00 = r0 * cos(a00),
                y00 = r0 * sin(a00),
                oc;

            // Restrict the corner radius according to the sector angle.
            if (da < pi$2 && (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10))) {
              var ax = x01 - oc[0],
                  ay = y01 - oc[1],
                  bx = x11 - oc[0],
                  by = y11 - oc[1],
                  kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2),
                  lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
              rc0 = min(rc, (r0 - lc) / (kc - 1));
              rc1 = min(rc, (r1 - lc) / (kc + 1));
            }
          }

          // Is the sector collapsed to a line?
          if (!(da1 > epsilon$2)) context.moveTo(x01, y01);

          // Does the sector’s outer ring have rounded corners?
          else if (rc1 > epsilon$2) {
            t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
            t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

            context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

            // Have the corners merged?
            if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

            // Otherwise, draw the two corners and the ring.
            else {
              context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
              context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
              context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
            }
          }

          // Or is the outer ring just a circular arc?
          else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

          // Is there no inner ring, and it’s a circular sector?
          // Or perhaps it’s an annular sector collapsed due to padding?
          if (!(r0 > epsilon$2) || !(da0 > epsilon$2)) context.lineTo(x10, y10);

          // Does the sector’s inner ring (or point) have rounded corners?
          else if (rc0 > epsilon$2) {
            t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
            t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

            context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

            // Have the corners merged?
            if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

            // Otherwise, draw the two corners and the ring.
            else {
              context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
              context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
              context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
            }
          }

          // Or is the inner ring just a circular arc?
          else context.arc(0, 0, r0, a10, a00, cw);
        }

        context.closePath();

        if (buffer) return context = null, buffer + "" || null;
      }

      arc.centroid = function() {
        var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
            a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$2 / 2;
        return [cos(a) * r, sin(a) * r];
      };

      arc.innerRadius = function(_) {
        return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$3(+_), arc) : innerRadius;
      };

      arc.outerRadius = function(_) {
        return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$3(+_), arc) : outerRadius;
      };

      arc.cornerRadius = function(_) {
        return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$3(+_), arc) : cornerRadius;
      };

      arc.padRadius = function(_) {
        return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$3(+_), arc) : padRadius;
      };

      arc.startAngle = function(_) {
        return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$3(+_), arc) : startAngle;
      };

      arc.endAngle = function(_) {
        return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$3(+_), arc) : endAngle;
      };

      arc.padAngle = function(_) {
        return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$3(+_), arc) : padAngle;
      };

      arc.context = function(_) {
        return arguments.length ? ((context = _ == null ? null : _), arc) : context;
      };

      return arc;
    }

    function Linear(context) {
      this._context = context;
    }

    Linear.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._point = 0;
      },
      lineEnd: function() {
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        x = +x, y = +y;
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; // proceed
          default: this._context.lineTo(x, y); break;
        }
      }
    };

    function curveLinear(context) {
      return new Linear(context);
    }

    function x(p) {
      return p[0];
    }

    function y(p) {
      return p[1];
    }

    function line() {
      var x$1 = x,
          y$1 = y,
          defined = constant$3(true),
          context = null,
          curve = curveLinear,
          output = null;

      function line(data) {
        var i,
            n = data.length,
            d,
            defined0 = false,
            buffer;

        if (context == null) output = curve(buffer = path$1());

        for (i = 0; i <= n; ++i) {
          if (!(i < n && defined(d = data[i], i, data)) === defined0) {
            if (defined0 = !defined0) output.lineStart();
            else output.lineEnd();
          }
          if (defined0) output.point(+x$1(d, i, data), +y$1(d, i, data));
        }

        if (buffer) return output = null, buffer + "" || null;
      }

      line.x = function(_) {
        return arguments.length ? (x$1 = typeof _ === "function" ? _ : constant$3(+_), line) : x$1;
      };

      line.y = function(_) {
        return arguments.length ? (y$1 = typeof _ === "function" ? _ : constant$3(+_), line) : y$1;
      };

      line.defined = function(_) {
        return arguments.length ? (defined = typeof _ === "function" ? _ : constant$3(!!_), line) : defined;
      };

      line.curve = function(_) {
        return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
      };

      line.context = function(_) {
        return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
      };

      return line;
    }

    function descending(a, b) {
      return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
    }

    function identity$2(d) {
      return d;
    }

    function pie() {
      var value = identity$2,
          sortValues = descending,
          sort = null,
          startAngle = constant$3(0),
          endAngle = constant$3(tau$2),
          padAngle = constant$3(0);

      function pie(data) {
        var i,
            n = data.length,
            j,
            k,
            sum = 0,
            index = new Array(n),
            arcs = new Array(n),
            a0 = +startAngle.apply(this, arguments),
            da = Math.min(tau$2, Math.max(-tau$2, endAngle.apply(this, arguments) - a0)),
            a1,
            p = Math.min(Math.abs(da) / n, padAngle.apply(this, arguments)),
            pa = p * (da < 0 ? -1 : 1),
            v;

        for (i = 0; i < n; ++i) {
          if ((v = arcs[index[i] = i] = +value(data[i], i, data)) > 0) {
            sum += v;
          }
        }

        // Optionally sort the arcs by previously-computed values or by data.
        if (sortValues != null) index.sort(function(i, j) { return sortValues(arcs[i], arcs[j]); });
        else if (sort != null) index.sort(function(i, j) { return sort(data[i], data[j]); });

        // Compute the arcs! They are stored in the original data's order.
        for (i = 0, k = sum ? (da - n * pa) / sum : 0; i < n; ++i, a0 = a1) {
          j = index[i], v = arcs[j], a1 = a0 + (v > 0 ? v * k : 0) + pa, arcs[j] = {
            data: data[j],
            index: i,
            value: v,
            startAngle: a0,
            endAngle: a1,
            padAngle: p
          };
        }

        return arcs;
      }

      pie.value = function(_) {
        return arguments.length ? (value = typeof _ === "function" ? _ : constant$3(+_), pie) : value;
      };

      pie.sortValues = function(_) {
        return arguments.length ? (sortValues = _, sort = null, pie) : sortValues;
      };

      pie.sort = function(_) {
        return arguments.length ? (sort = _, sortValues = null, pie) : sort;
      };

      pie.startAngle = function(_) {
        return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$3(+_), pie) : startAngle;
      };

      pie.endAngle = function(_) {
        return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$3(+_), pie) : endAngle;
      };

      pie.padAngle = function(_) {
        return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$3(+_), pie) : padAngle;
      };

      return pie;
    }

    function sign(x) {
      return x < 0 ? -1 : 1;
    }

    // Calculate the slopes of the tangents (Hermite-type interpolation) based on
    // the following paper: Steffen, M. 1990. A Simple Method for Monotonic
    // Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
    // NOV(II), P. 443, 1990.
    function slope3(that, x2, y2) {
      var h0 = that._x1 - that._x0,
          h1 = x2 - that._x1,
          s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
          s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
          p = (s0 * h1 + s1 * h0) / (h0 + h1);
      return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
    }

    // Calculate a one-sided slope.
    function slope2(that, t) {
      var h = that._x1 - that._x0;
      return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
    }

    // According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
    // "you can express cubic Hermite interpolation in terms of cubic Bézier curves
    // with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
    function point$1(that, t0, t1) {
      var x0 = that._x0,
          y0 = that._y0,
          x1 = that._x1,
          y1 = that._y1,
          dx = (x1 - x0) / 3;
      that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
    }

    function MonotoneX(context) {
      this._context = context;
    }

    MonotoneX.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x0 = this._x1 =
        this._y0 = this._y1 =
        this._t0 = NaN;
        this._point = 0;
      },
      lineEnd: function() {
        switch (this._point) {
          case 2: this._context.lineTo(this._x1, this._y1); break;
          case 3: point$1(this, this._t0, slope2(this, this._t0)); break;
        }
        if (this._line || (this._line !== 0 && this._point === 1)) this._context.closePath();
        this._line = 1 - this._line;
      },
      point: function(x, y) {
        var t1 = NaN;

        x = +x, y = +y;
        if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
        switch (this._point) {
          case 0: this._point = 1; this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y); break;
          case 1: this._point = 2; break;
          case 2: this._point = 3; point$1(this, slope2(this, t1 = slope3(this, x, y)), t1); break;
          default: point$1(this, this._t0, t1 = slope3(this, x, y)); break;
        }

        this._x0 = this._x1, this._x1 = x;
        this._y0 = this._y1, this._y1 = y;
        this._t0 = t1;
      }
    };

    function MonotoneY(context) {
      this._context = new ReflectContext(context);
    }

    (MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function(x, y) {
      MonotoneX.prototype.point.call(this, y, x);
    };

    function ReflectContext(context) {
      this._context = context;
    }

    ReflectContext.prototype = {
      moveTo: function(x, y) { this._context.moveTo(y, x); },
      closePath: function() { this._context.closePath(); },
      lineTo: function(x, y) { this._context.lineTo(y, x); },
      bezierCurveTo: function(x1, y1, x2, y2, x, y) { this._context.bezierCurveTo(y1, x1, y2, x2, y, x); }
    };

    function monotoneX(context) {
      return new MonotoneX(context);
    }

    function Natural(context) {
      this._context = context;
    }

    Natural.prototype = {
      areaStart: function() {
        this._line = 0;
      },
      areaEnd: function() {
        this._line = NaN;
      },
      lineStart: function() {
        this._x = [];
        this._y = [];
      },
      lineEnd: function() {
        var x = this._x,
            y = this._y,
            n = x.length;

        if (n) {
          this._line ? this._context.lineTo(x[0], y[0]) : this._context.moveTo(x[0], y[0]);
          if (n === 2) {
            this._context.lineTo(x[1], y[1]);
          } else {
            var px = controlPoints(x),
                py = controlPoints(y);
            for (var i0 = 0, i1 = 1; i1 < n; ++i0, ++i1) {
              this._context.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], x[i1], y[i1]);
            }
          }
        }

        if (this._line || (this._line !== 0 && n === 1)) this._context.closePath();
        this._line = 1 - this._line;
        this._x = this._y = null;
      },
      point: function(x, y) {
        this._x.push(+x);
        this._y.push(+y);
      }
    };

    // See https://www.particleincell.com/2012/bezier-splines/ for derivation.
    function controlPoints(x) {
      var i,
          n = x.length - 1,
          m,
          a = new Array(n),
          b = new Array(n),
          r = new Array(n);
      a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
      for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
      a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
      for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
      a[n - 1] = r[n - 1] / b[n - 1];
      for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
      b[n - 1] = (x[n] + a[n - 1]) / 2;
      for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
      return [a, b];
    }

    function curveNatural(context) {
      return new Natural(context);
    }

    /* src/charts/chart-donut.svelte generated by Svelte v3.42.1 */
    const file$2 = "src/charts/chart-donut.svelte";

    function create_fragment$2(ctx) {
    	let figure;
    	let figure_class_value;

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			attr_dev(figure, "class", figure_class_value = /*getClassNames*/ ctx[1]());
    			add_location(figure, file$2, 123, 0, 3279);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			/*figure_binding*/ ctx[10](figure);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			/*figure_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chart_donut', slots, []);
    	let { data = { data } } = $$props;
    	let { width = { width } } = $$props;
    	let { height = { height } } = $$props;
    	let { label = { label } } = $$props;
    	let { primaryKey = { primaryKey } } = $$props;
    	let { secondaryKey = { secondaryKey } } = $$props;
    	let { valueStyle = { valueStyle: displayAs } } = $$props;
    	let { hasAccent = false } = $$props;
    	let classNames = ["graph", "donut-graph"];

    	if (hasAccent) {
    		classNames.push("has-accent");
    	}

    	const getClassNames = () => {
    		return classNames.join(" ");
    	};

    	let d3 = {
    		scaleOrdinal: ordinal,
    		entries,
    		pie,
    		arc,
    		select,
    		mouse,
    		path
    	};

    	let el;
    	let valueStyleParams;

    	// TODO: Update this to allow for different data ranges
    	data = data[data.length - 1]; // only use latest day's data

    	/**
     * Sets the text inside of the donut graph
     */
    	let innerText;

    	if ("percent" === valueStyle || 'object' === typeof valueStyle && "percent" === valueStyle.type) {
    		valueStyleParams = {
    			style: 'percent',
    			minimumFractionDigits: 2
    		};

    		innerText = (data[primaryKey] / data[valueStyle.compareWith]).toLocaleString(undefined, valueStyleParams);
    	} else {
    		innerText = data[primaryKey].toLocaleString(undefined, valueStyleParams);
    	}

    	/**
     * Generate the graph
     */
    	onMount(generateGraph);

    	function generateGraph() {
    		const graphContainer = d3.select(el);

    		const graphTitle = graphContainer.append("div").attr("class", "graph-title").text(function (d) {
    			return label;
    		});

    		const graphVisualWrapper = graphContainer.append("div").attr("class", "graph-visual-wrapper");

    		/**
     * Add graph
     */
    		let graphData = {
    			a: data[primaryKey],
    			b: data[secondaryKey]
    		};

    		const graphVisual = graphVisualWrapper.append("svg").attr("class", "graph-visual").attr("aria-label", `${innerText} ${label}`).attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    		/**
     * Adds the donut chart
     */
    		const donut = d3.pie().value(function (d) {
    			return d.value;
    		});

    		let dataReady = donut(d3.entries(graphData));
    		graphVisual.selectAll().data(dataReady).enter().append('path').attr("class", "graph-column").attr('d', d3.arc().innerRadius(width * 0.35).outerRadius(width * 0.45)); // This is the size of the donut hole

    		/**
     * Adds the data label
     */
    		graphVisual.append("text").attr("class", "data-label").text(innerText);
    	}

    	const writable_props = [
    		'data',
    		'width',
    		'height',
    		'label',
    		'primaryKey',
    		'secondaryKey',
    		'valueStyle',
    		'hasAccent'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chart_donut> was created with unknown prop '${key}'`);
    	});

    	function figure_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    		if ('primaryKey' in $$props) $$invalidate(6, primaryKey = $$props.primaryKey);
    		if ('secondaryKey' in $$props) $$invalidate(7, secondaryKey = $$props.secondaryKey);
    		if ('valueStyle' in $$props) $$invalidate(8, valueStyle = $$props.valueStyle);
    		if ('hasAccent' in $$props) $$invalidate(9, hasAccent = $$props.hasAccent);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		scaleOrdinal: ordinal,
    		mouse,
    		select,
    		entries,
    		path,
    		arc,
    		pie,
    		data,
    		width,
    		height,
    		label,
    		primaryKey,
    		secondaryKey,
    		valueStyle,
    		hasAccent,
    		classNames,
    		getClassNames,
    		d3,
    		el,
    		valueStyleParams,
    		innerText,
    		generateGraph
    	});

    	$$self.$inject_state = $$props => {
    		if ('data' in $$props) $$invalidate(2, data = $$props.data);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    		if ('primaryKey' in $$props) $$invalidate(6, primaryKey = $$props.primaryKey);
    		if ('secondaryKey' in $$props) $$invalidate(7, secondaryKey = $$props.secondaryKey);
    		if ('valueStyle' in $$props) $$invalidate(8, valueStyle = $$props.valueStyle);
    		if ('hasAccent' in $$props) $$invalidate(9, hasAccent = $$props.hasAccent);
    		if ('classNames' in $$props) classNames = $$props.classNames;
    		if ('d3' in $$props) d3 = $$props.d3;
    		if ('el' in $$props) $$invalidate(0, el = $$props.el);
    		if ('valueStyleParams' in $$props) valueStyleParams = $$props.valueStyleParams;
    		if ('innerText' in $$props) innerText = $$props.innerText;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		el,
    		getClassNames,
    		data,
    		width,
    		height,
    		label,
    		primaryKey,
    		secondaryKey,
    		valueStyle,
    		hasAccent,
    		figure_binding
    	];
    }

    class Chart_donut extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			data: 2,
    			width: 3,
    			height: 4,
    			label: 5,
    			primaryKey: 6,
    			secondaryKey: 7,
    			valueStyle: 8,
    			hasAccent: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_donut",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get data() {
    		throw new Error("<Chart_donut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Chart_donut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Chart_donut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Chart_donut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Chart_donut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Chart_donut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Chart_donut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Chart_donut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primaryKey() {
    		throw new Error("<Chart_donut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primaryKey(value) {
    		throw new Error("<Chart_donut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryKey() {
    		throw new Error("<Chart_donut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryKey(value) {
    		throw new Error("<Chart_donut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get valueStyle() {
    		throw new Error("<Chart_donut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set valueStyle(value) {
    		throw new Error("<Chart_donut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasAccent() {
    		throw new Error("<Chart_donut>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasAccent(value) {
    		throw new Error("<Chart_donut>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function identity$3(x) {
      return x;
    }

    var top = 1,
        right = 2,
        bottom = 3,
        left = 4,
        epsilon$3 = 1e-6;

    function translateX(x) {
      return "translate(" + x + ",0)";
    }

    function translateY(y) {
      return "translate(0," + y + ")";
    }

    function number$2(scale) {
      return d => +scale(d);
    }

    function center(scale, offset) {
      offset = Math.max(0, scale.bandwidth() - offset * 2) / 2;
      if (scale.round()) offset = Math.round(offset);
      return d => +scale(d) + offset;
    }

    function entering() {
      return !this.__axis;
    }

    function axis(orient, scale) {
      var tickArguments = [],
          tickValues = null,
          tickFormat = null,
          tickSizeInner = 6,
          tickSizeOuter = 6,
          tickPadding = 3,
          offset = typeof window !== "undefined" && window.devicePixelRatio > 1 ? 0 : 0.5,
          k = orient === top || orient === left ? -1 : 1,
          x = orient === left || orient === right ? "x" : "y",
          transform = orient === top || orient === bottom ? translateX : translateY;

      function axis(context) {
        var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
            format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity$3) : tickFormat,
            spacing = Math.max(tickSizeInner, 0) + tickPadding,
            range = scale.range(),
            range0 = +range[0] + offset,
            range1 = +range[range.length - 1] + offset,
            position = (scale.bandwidth ? center : number$2)(scale.copy(), offset),
            selection = context.selection ? context.selection() : context,
            path = selection.selectAll(".domain").data([null]),
            tick = selection.selectAll(".tick").data(values, scale).order(),
            tickExit = tick.exit(),
            tickEnter = tick.enter().append("g").attr("class", "tick"),
            line = tick.select("line"),
            text = tick.select("text");

        path = path.merge(path.enter().insert("path", ".tick")
            .attr("class", "domain")
            .attr("stroke", "currentColor"));

        tick = tick.merge(tickEnter);

        line = line.merge(tickEnter.append("line")
            .attr("stroke", "currentColor")
            .attr(x + "2", k * tickSizeInner));

        text = text.merge(tickEnter.append("text")
            .attr("fill", "currentColor")
            .attr(x, k * spacing)
            .attr("dy", orient === top ? "0em" : orient === bottom ? "0.71em" : "0.32em"));

        if (context !== selection) {
          path = path.transition(context);
          tick = tick.transition(context);
          line = line.transition(context);
          text = text.transition(context);

          tickExit = tickExit.transition(context)
              .attr("opacity", epsilon$3)
              .attr("transform", function(d) { return isFinite(d = position(d)) ? transform(d + offset) : this.getAttribute("transform"); });

          tickEnter
              .attr("opacity", epsilon$3)
              .attr("transform", function(d) { var p = this.parentNode.__axis; return transform((p && isFinite(p = p(d)) ? p : position(d)) + offset); });
        }

        tickExit.remove();

        path
            .attr("d", orient === left || orient === right
                ? (tickSizeOuter ? "M" + k * tickSizeOuter + "," + range0 + "H" + offset + "V" + range1 + "H" + k * tickSizeOuter : "M" + offset + "," + range0 + "V" + range1)
                : (tickSizeOuter ? "M" + range0 + "," + k * tickSizeOuter + "V" + offset + "H" + range1 + "V" + k * tickSizeOuter : "M" + range0 + "," + offset + "H" + range1));

        tick
            .attr("opacity", 1)
            .attr("transform", function(d) { return transform(position(d) + offset); });

        line
            .attr(x + "2", k * tickSizeInner);

        text
            .attr(x, k * spacing)
            .text(format);

        selection.filter(entering)
            .attr("fill", "none")
            .attr("font-size", 10)
            .attr("font-family", "sans-serif")
            .attr("text-anchor", orient === right ? "start" : orient === left ? "end" : "middle");

        selection
            .each(function() { this.__axis = position; });
      }

      axis.scale = function(_) {
        return arguments.length ? (scale = _, axis) : scale;
      };

      axis.ticks = function() {
        return tickArguments = Array.from(arguments), axis;
      };

      axis.tickArguments = function(_) {
        return arguments.length ? (tickArguments = _ == null ? [] : Array.from(_), axis) : tickArguments.slice();
      };

      axis.tickValues = function(_) {
        return arguments.length ? (tickValues = _ == null ? null : Array.from(_), axis) : tickValues && tickValues.slice();
      };

      axis.tickFormat = function(_) {
        return arguments.length ? (tickFormat = _, axis) : tickFormat;
      };

      axis.tickSize = function(_) {
        return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
      };

      axis.tickSizeInner = function(_) {
        return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
      };

      axis.tickSizeOuter = function(_) {
        return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
      };

      axis.tickPadding = function(_) {
        return arguments.length ? (tickPadding = +_, axis) : tickPadding;
      };

      axis.offset = function(_) {
        return arguments.length ? (offset = +_, axis) : offset;
      };

      return axis;
    }

    function axisTop(scale) {
      return axis(top, scale);
    }

    function axisRight(scale) {
      return axis(right, scale);
    }

    function axisBottom(scale) {
      return axis(bottom, scale);
    }

    function axisLeft(scale) {
      return axis(left, scale);
    }

    var noop$1 = {value: function() {}};

    function dispatch$1() {
      for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
        if (!(t = arguments[i] + "") || (t in _)) throw new Error("illegal type: " + t);
        _[t] = [];
      }
      return new Dispatch(_);
    }

    function Dispatch(_) {
      this._ = _;
    }

    function parseTypenames$1(typenames, types) {
      return typenames.trim().split(/^|\s+/).map(function(t) {
        var name = "", i = t.indexOf(".");
        if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
        if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
        return {type: t, name: name};
      });
    }

    Dispatch.prototype = dispatch$1.prototype = {
      constructor: Dispatch,
      on: function(typename, callback) {
        var _ = this._,
            T = parseTypenames$1(typename + "", _),
            t,
            i = -1,
            n = T.length;

        // If no callback was specified, return the callback of the given type and name.
        if (arguments.length < 2) {
          while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
          return;
        }

        // If a type was specified, set the callback for the given type and name.
        // Otherwise, if a null callback was specified, remove callbacks of the given name.
        if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
        while (++i < n) {
          if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);
          else if (callback == null) for (t in _) _[t] = set$1(_[t], typename.name, null);
        }

        return this;
      },
      copy: function() {
        var copy = {}, _ = this._;
        for (var t in _) copy[t] = _[t].slice();
        return new Dispatch(copy);
      },
      call: function(type, that) {
        if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      },
      apply: function(type, that, args) {
        if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
        for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
      }
    };

    function get(type, name) {
      for (var i = 0, n = type.length, c; i < n; ++i) {
        if ((c = type[i]).name === name) {
          return c.value;
        }
      }
    }

    function set$1(type, name, callback) {
      for (var i = 0, n = type.length; i < n; ++i) {
        if (type[i].name === name) {
          type[i] = noop$1, type = type.slice(0, i).concat(type.slice(i + 1));
          break;
        }
      }
      if (callback != null) type.push({name: name, value: callback});
      return type;
    }

    function ascending$2(a, b) {
      return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
    }

    function bisector$1(compare) {
      if (compare.length === 1) compare = ascendingComparator$1(compare);
      return {
        left: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) < 0) lo = mid + 1;
            else hi = mid;
          }
          return lo;
        },
        right: function(a, x, lo, hi) {
          if (lo == null) lo = 0;
          if (hi == null) hi = a.length;
          while (lo < hi) {
            var mid = lo + hi >>> 1;
            if (compare(a[mid], x) > 0) hi = mid;
            else lo = mid + 1;
          }
          return lo;
        }
      };
    }

    function ascendingComparator$1(f) {
      return function(d, x) {
        return ascending$2(f(d), x);
      };
    }

    var ascendingBisect$1 = bisector$1(ascending$2);

    function max$1(array, f) {
      var i = -1,
          n = array.length,
          a,
          b;

      if (f == null) {
        while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
        while (++i < n) if ((b = array[i]) != null && b > a) a = b;
      }

      else {
        while (++i < n) if ((b = f(array[i], i, array)) != null && b >= b) { a = b; break; }
        while (++i < n) if ((b = f(array[i], i, array)) != null && b > a) a = b;
      }

      return a;
    }

    function sum(array, f) {
      var s = 0,
          n = array.length,
          a,
          i = -1;

      if (f == null) {
        while (++i < n) if (a = +array[i]) s += a; // Note: zero and null are equivalent.
      }

      else {
        while (++i < n) if (a = +f(array[i], i, array)) s += a;
      }

      return s;
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var d3_identity = function d3_identity(d) {
      return d;
    };

    var d3_reverse = function d3_reverse(arr) {
      var mirror = [];
      for (var i = 0, l = arr.length; i < l; i++) {
        mirror[i] = arr[l - i - 1];
      }
      return mirror;
    };

    //Text wrapping code adapted from Mike Bostock
    var d3_textWrapping = function d3_textWrapping(text, width) {
      text.each(function () {
        var text = select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineHeight = 1.2,
            //ems
        y = text.attr("y"),
            dy = parseFloat(text.attr("dy")) || 0,
            tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width && line.length > 1) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("dy", lineHeight + dy + "em").text(word);
          }
        }
      });
    };

    var d3_mergeLabels = function d3_mergeLabels() {
      var gen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var labels = arguments[1];
      var domain = arguments[2];
      var range = arguments[3];
      var labelDelimiter = arguments[4];

      if ((typeof labels === "undefined" ? "undefined" : _typeof(labels)) === "object") {
        if (labels.length === 0) return gen;

        var i = labels.length;
        for (; i < gen.length; i++) {
          labels.push(gen[i]);
        }
        return labels;
      } else if (typeof labels === "function") {
        var customLabels = [];
        var genLength = gen.length;
        for (var _i = 0; _i < genLength; _i++) {
          customLabels.push(labels({
            i: _i,
            genLength: genLength,
            generatedLabels: gen,
            domain: domain,
            range: range,
            labelDelimiter: labelDelimiter
          }));
        }
        return customLabels;
      }

      return gen;
    };

    var d3_linearLegend = function d3_linearLegend(scale, cells, labelFormat) {
      var data = [];

      if (cells.length > 1) {
        data = cells;
      } else {
        var domain = scale.domain(),
            increment = (domain[domain.length - 1] - domain[0]) / (cells - 1);
        var i = 0;

        for (; i < cells; i++) {
          data.push(domain[0] + i * increment);
        }
      }

      var labels = data.map(labelFormat);
      return {
        data: data,
        labels: labels,
        feature: function feature(d) {
          return scale(d);
        }
      };
    };

    var d3_quantLegend = function d3_quantLegend(scale, labelFormat, labelDelimiter) {
      var labels = scale.range().map(function (d) {
        var invert = scale.invertExtent(d);
        return labelFormat(invert[0]) + " " + labelDelimiter + " " + labelFormat(invert[1]);
      });

      return {
        data: scale.range(),
        labels: labels,
        feature: d3_identity
      };
    };

    var d3_ordinalLegend = function d3_ordinalLegend(scale) {
      return {
        data: scale.domain(),
        labels: scale.domain(),
        feature: function feature(d) {
          return scale(d);
        }
      };
    };

    var d3_cellOver = function d3_cellOver(cellDispatcher, d, obj) {
      cellDispatcher.call("cellover", obj, d);
    };

    var d3_cellOut = function d3_cellOut(cellDispatcher, d, obj) {
      cellDispatcher.call("cellout", obj, d);
    };

    var d3_cellClick = function d3_cellClick(cellDispatcher, d, obj) {
      cellDispatcher.call("cellclick", obj, d);
    };

    var helper = {
      d3_drawShapes: function d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path) {
        if (shape === "rect") {
          shapes.attr("height", shapeHeight).attr("width", shapeWidth);
        } else if (shape === "circle") {
          shapes.attr("r", shapeRadius);
        } else if (shape === "line") {
          shapes.attr("x1", 0).attr("x2", shapeWidth).attr("y1", 0).attr("y2", 0);
        } else if (shape === "path") {
          shapes.attr("d", path);
        }
      },

      d3_addText: function d3_addText(svg, enter, labels, classPrefix, labelWidth) {
        enter.append("text").attr("class", classPrefix + "label");
        var text = svg.selectAll("g." + classPrefix + "cell text." + classPrefix + "label").data(labels).text(d3_identity);

        if (labelWidth) {
          svg.selectAll("g." + classPrefix + "cell text." + classPrefix + "label").call(d3_textWrapping, labelWidth);
        }

        return text;
      },

      d3_calcType: function d3_calcType(scale, ascending, cells, labels, labelFormat, labelDelimiter) {
        var type = scale.invertExtent ? d3_quantLegend(scale, labelFormat, labelDelimiter) : scale.ticks ? d3_linearLegend(scale, cells, labelFormat) : d3_ordinalLegend(scale);

        //for d3.scaleSequential that doesn't have a range function
        var range = scale.range && scale.range() || scale.domain();
        type.labels = d3_mergeLabels(type.labels, labels, scale.domain(), range, labelDelimiter);

        if (ascending) {
          type.labels = d3_reverse(type.labels);
          type.data = d3_reverse(type.data);
        }

        return type;
      },

      d3_filterCells: function d3_filterCells(type, cellFilter) {
        var filterCells = type.data.map(function (d, i) {
          return { data: d, label: type.labels[i] };
        }).filter(cellFilter);
        var dataValues = filterCells.map(function (d) {
          return d.data;
        });
        var labelValues = filterCells.map(function (d) {
          return d.label;
        });
        type.data = type.data.filter(function (d) {
          return dataValues.indexOf(d) !== -1;
        });
        type.labels = type.labels.filter(function (d) {
          return labelValues.indexOf(d) !== -1;
        });
        return type;
      },

      d3_placement: function d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign) {
        cell.attr("transform", cellTrans);
        text.attr("transform", textTrans);
        if (orient === "horizontal") {
          text.style("text-anchor", labelAlign);
        }
      },

      d3_addEvents: function d3_addEvents(cells, dispatcher) {
        cells.on("mouseover.legend", function (d) {
          d3_cellOver(dispatcher, d, this);
        }).on("mouseout.legend", function (d) {
          d3_cellOut(dispatcher, d, this);
        }).on("click.legend", function (d) {
          d3_cellClick(dispatcher, d, this);
        });
      },

      d3_title: function d3_title(svg, title, classPrefix, titleWidth) {
        if (title !== "") {
          var titleText = svg.selectAll("text." + classPrefix + "legendTitle");

          titleText.data([title]).enter().append("text").attr("class", classPrefix + "legendTitle");

          svg.selectAll("text." + classPrefix + "legendTitle").text(title);

          if (titleWidth) {
            svg.selectAll("text." + classPrefix + "legendTitle").call(d3_textWrapping, titleWidth);
          }

          var cellsSvg = svg.select("." + classPrefix + "legendCells");
          var yOffset = svg.select("." + classPrefix + "legendTitle").nodes().map(function (d) {
            return d.getBBox().height;
          })[0],
              xOffset = -cellsSvg.nodes().map(function (d) {
            return d.getBBox().x;
          })[0];
          cellsSvg.attr("transform", "translate(" + xOffset + "," + yOffset + ")");
        }
      },

      d3_defaultLocale: {
        format: format,
        formatPrefix: formatPrefix
      },

      d3_defaultFormatSpecifier: ".01f",

      d3_defaultDelimiter: "to"
    };

    function color$1() {
      var scale = linear$1(),
          shape = "rect",
          shapeWidth = 15,
          shapeHeight = 15,
          shapeRadius = 10,
          shapePadding = 2,
          cells = [5],
          cellFilter = void 0,
          labels = [],
          classPrefix = "",
          useClass = false,
          title = "",
          locale = helper.d3_defaultLocale,
          specifier = helper.d3_defaultFormatSpecifier,
          labelOffset = 10,
          labelAlign = "middle",
          labelDelimiter = helper.d3_defaultDelimiter,
          labelWrap = void 0,
          orient = "vertical",
          ascending = false,
          path = void 0,
          titleWidth = void 0,
          legendDispatcher = dispatch$1("cellover", "cellout", "cellclick");

      function legend(svg) {
        var type = helper.d3_calcType(scale, ascending, cells, labels, locale.format(specifier), labelDelimiter),
            legendG = svg.selectAll("g").data([scale]);

        legendG.enter().append("g").attr("class", classPrefix + "legendCells");

        if (cellFilter) {
          helper.d3_filterCells(type, cellFilter);
        }

        var cell = svg.select("." + classPrefix + "legendCells").selectAll("." + classPrefix + "cell").data(type.data);

        var cellEnter = cell.enter().append("g").attr("class", classPrefix + "cell");
        cellEnter.append(shape).attr("class", classPrefix + "swatch");

        var shapes = svg.selectAll("g." + classPrefix + "cell " + shape + "." + classPrefix + "swatch").data(type.data);

        //add event handlers
        helper.d3_addEvents(cellEnter, legendDispatcher);

        cell.exit().transition().style("opacity", 0).remove();
        shapes.exit().transition().style("opacity", 0).remove();

        shapes = shapes.merge(shapes);

        helper.d3_drawShapes(shape, shapes, shapeHeight, shapeWidth, shapeRadius, path);
        var text = helper.d3_addText(svg, cellEnter, type.labels, classPrefix, labelWrap);

        // we need to merge the selection, otherwise changes in the legend (e.g. change of orientation) are applied only to the new cells and not the existing ones.
        cell = cellEnter.merge(cell);

        // sets placement
        var textSize = text.nodes().map(function (d) {
          return d.getBBox();
        }),
            shapeSize = shapes.nodes().map(function (d) {
          return d.getBBox();
        });
        //sets scale
        //everything is fill except for line which is stroke,
        if (!useClass) {
          if (shape == "line") {
            shapes.style("stroke", type.feature);
          } else {
            shapes.style("fill", type.feature);
          }
        } else {
          shapes.attr("class", function (d) {
            return classPrefix + "swatch " + type.feature(d);
          });
        }

        var cellTrans = void 0,
            textTrans = void 0,
            textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

        //positions cells and text
        if (orient === "vertical") {
          (function () {
            var cellSize = textSize.map(function (d, i) {
              return Math.max(d.height, shapeSize[i].height);
            });

            cellTrans = function cellTrans(d, i) {
              var height = sum(cellSize.slice(0, i));
              return "translate(0, " + (height + i * shapePadding) + ")";
            };

            textTrans = function textTrans(d, i) {
              return "translate( " + (shapeSize[i].width + shapeSize[i].x + labelOffset) + ", " + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
            };
          })();
        } else if (orient === "horizontal") {
          cellTrans = function cellTrans(d, i) {
            return "translate(" + i * (shapeSize[i].width + shapePadding) + ",0)";
          };
          textTrans = function textTrans(d, i) {
            return "translate(" + (shapeSize[i].width * textAlign + shapeSize[i].x) + ",\n          " + (shapeSize[i].height + shapeSize[i].y + labelOffset + 8) + ")";
          };
        }

        helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
        helper.d3_title(svg, title, classPrefix, titleWidth);

        cell.transition().style("opacity", 1);
      }

      legend.scale = function (_) {
        if (!arguments.length) return scale;
        scale = _;
        return legend;
      };

      legend.cells = function (_) {
        if (!arguments.length) return cells;
        if (_.length > 1 || _ >= 2) {
          cells = _;
        }
        return legend;
      };

      legend.cellFilter = function (_) {
        if (!arguments.length) return cellFilter;
        cellFilter = _;
        return legend;
      };

      legend.shape = function (_, d) {
        if (!arguments.length) return shape;
        if (_ == "rect" || _ == "circle" || _ == "line" || _ == "path" && typeof d === "string") {
          shape = _;
          path = d;
        }
        return legend;
      };

      legend.shapeWidth = function (_) {
        if (!arguments.length) return shapeWidth;
        shapeWidth = +_;
        return legend;
      };

      legend.shapeHeight = function (_) {
        if (!arguments.length) return shapeHeight;
        shapeHeight = +_;
        return legend;
      };

      legend.shapeRadius = function (_) {
        if (!arguments.length) return shapeRadius;
        shapeRadius = +_;
        return legend;
      };

      legend.shapePadding = function (_) {
        if (!arguments.length) return shapePadding;
        shapePadding = +_;
        return legend;
      };

      legend.labels = function (_) {
        if (!arguments.length) return labels;
        labels = _;
        return legend;
      };

      legend.labelAlign = function (_) {
        if (!arguments.length) return labelAlign;
        if (_ == "start" || _ == "end" || _ == "middle") {
          labelAlign = _;
        }
        return legend;
      };

      legend.locale = function (_) {
        if (!arguments.length) return locale;
        locale = formatLocale(_);
        return legend;
      };

      legend.labelFormat = function (_) {
        if (!arguments.length) return legend.locale().format(specifier);
        specifier = formatSpecifier(_);
        return legend;
      };

      legend.labelOffset = function (_) {
        if (!arguments.length) return labelOffset;
        labelOffset = +_;
        return legend;
      };

      legend.labelDelimiter = function (_) {
        if (!arguments.length) return labelDelimiter;
        labelDelimiter = _;
        return legend;
      };

      legend.labelWrap = function (_) {
        if (!arguments.length) return labelWrap;
        labelWrap = _;
        return legend;
      };

      legend.useClass = function (_) {
        if (!arguments.length) return useClass;
        if (_ === true || _ === false) {
          useClass = _;
        }
        return legend;
      };

      legend.orient = function (_) {
        if (!arguments.length) return orient;
        _ = _.toLowerCase();
        if (_ == "horizontal" || _ == "vertical") {
          orient = _;
        }
        return legend;
      };

      legend.ascending = function (_) {
        if (!arguments.length) return ascending;
        ascending = !!_;
        return legend;
      };

      legend.classPrefix = function (_) {
        if (!arguments.length) return classPrefix;
        classPrefix = _;
        return legend;
      };

      legend.title = function (_) {
        if (!arguments.length) return title;
        title = _;
        return legend;
      };

      legend.titleWidth = function (_) {
        if (!arguments.length) return titleWidth;
        titleWidth = _;
        return legend;
      };

      legend.textWrap = function (_) {
        if (!arguments.length) return textWrap;
        textWrap = _;
        return legend;
      };

      legend.on = function () {
        var value = legendDispatcher.on.apply(legendDispatcher, arguments);
        return value === legendDispatcher ? legend : value;
      };

      return legend;
    }

    function size() {
      var scale = linear$1(),
          shape = "rect",
          shapeWidth = 15,
          shapePadding = 2,
          cells = [5],
          cellFilter = void 0,
          labels = [],
          classPrefix = "",
          title = "",
          locale = helper.d3_defaultLocale,
          specifier = helper.d3_defaultFormatSpecifier,
          labelOffset = 10,
          labelAlign = "middle",
          labelDelimiter = helper.d3_defaultDelimiter,
          labelWrap = void 0,
          orient = "vertical",
          ascending = false,
          path = void 0,
          titleWidth = void 0,
          legendDispatcher = dispatch$1("cellover", "cellout", "cellclick");

      function legend(svg) {
        var type = helper.d3_calcType(scale, ascending, cells, labels, locale.format(specifier), labelDelimiter),
            legendG = svg.selectAll("g").data([scale]);

        if (cellFilter) {
          helper.d3_filterCells(type, cellFilter);
        }

        legendG.enter().append("g").attr("class", classPrefix + "legendCells");

        var cell = svg.select("." + classPrefix + "legendCells").selectAll("." + classPrefix + "cell").data(type.data);
        var cellEnter = cell.enter().append("g").attr("class", classPrefix + "cell");
        cellEnter.append(shape).attr("class", classPrefix + "swatch");

        var shapes = svg.selectAll("g." + classPrefix + "cell " + shape + "." + classPrefix + "swatch");

        //add event handlers
        helper.d3_addEvents(cellEnter, legendDispatcher);

        cell.exit().transition().style("opacity", 0).remove();

        shapes.exit().transition().style("opacity", 0).remove();
        shapes = shapes.merge(shapes);

        //creates shape
        if (shape === "line") {
          helper.d3_drawShapes(shape, shapes, 0, shapeWidth);
          shapes.attr("stroke-width", type.feature);
        } else {
          helper.d3_drawShapes(shape, shapes, type.feature, type.feature, type.feature, path);
        }

        var text = helper.d3_addText(svg, cellEnter, type.labels, classPrefix, labelWrap);

        // we need to merge the selection, otherwise changes in the legend (e.g. change of orientation) are applied only to the new cells and not the existing ones.
        cell = cellEnter.merge(cell);

        //sets placement

        var textSize = text.nodes().map(function (d) {
          return d.getBBox();
        }),
            shapeSize = shapes.nodes().map(function (d, i) {
          var bbox = d.getBBox();
          var stroke = scale(type.data[i]);

          if (shape === "line" && orient === "horizontal") {
            bbox.height = bbox.height + stroke;
          } else if (shape === "line" && orient === "vertical") {
            bbox.width = bbox.width;
          }
          return bbox;
        });

        var maxH = max$1(shapeSize, function (d) {
          return d.height + d.y;
        }),
            maxW = max$1(shapeSize, function (d) {
          return d.width + d.x;
        });

        var cellTrans = void 0,
            textTrans = void 0,
            textAlign = labelAlign == "start" ? 0 : labelAlign == "middle" ? 0.5 : 1;

        //positions cells and text
        if (orient === "vertical") {
          (function () {
            var cellSize = textSize.map(function (d, i) {
              return Math.max(d.height, shapeSize[i].height);
            });
            var y = shape == "circle" || shape == "line" ? shapeSize[0].height / 2 : 0;
            cellTrans = function cellTrans(d, i) {
              var height = sum(cellSize.slice(0, i));

              return "translate(0, " + (y + height + i * shapePadding) + ")";
            };

            textTrans = function textTrans(d, i) {
              return "translate( " + (maxW + labelOffset) + ",\n          " + (shapeSize[i].y + shapeSize[i].height / 2 + 5) + ")";
            };
          })();
        } else if (orient === "horizontal") {
          (function () {
            cellTrans = function cellTrans(d, i) {
              var width = sum(shapeSize.slice(0, i), function (d) {
                return d.width;
              });
              var y = shape == "circle" || shape == "line" ? maxH / 2 : 0;
              return "translate(" + (width + i * shapePadding) + ", " + y + ")";
            };

            var offset = shape == "line" ? maxH / 2 : maxH;
            textTrans = function textTrans(d, i) {
              return "translate( " + (shapeSize[i].width * textAlign + shapeSize[i].x) + ",\n              " + (offset + labelOffset) + ")";
            };
          })();
        }

        helper.d3_placement(orient, cell, cellTrans, text, textTrans, labelAlign);
        helper.d3_title(svg, title, classPrefix, titleWidth);

        cell.transition().style("opacity", 1);
      }

      legend.scale = function (_) {
        if (!arguments.length) return scale;
        scale = _;
        return legend;
      };

      legend.cells = function (_) {
        if (!arguments.length) return cells;
        if (_.length > 1 || _ >= 2) {
          cells = _;
        }
        return legend;
      };

      legend.cellFilter = function (_) {
        if (!arguments.length) return cellFilter;
        cellFilter = _;
        return legend;
      };

      legend.shape = function (_, d) {
        if (!arguments.length) return shape;
        if (_ == "rect" || _ == "circle" || _ == "line") {
          shape = _;
          path = d;
        }
        return legend;
      };

      legend.shapeWidth = function (_) {
        if (!arguments.length) return shapeWidth;
        shapeWidth = +_;
        return legend;
      };

      legend.shapePadding = function (_) {
        if (!arguments.length) return shapePadding;
        shapePadding = +_;
        return legend;
      };

      legend.labels = function (_) {
        if (!arguments.length) return labels;
        labels = _;
        return legend;
      };

      legend.labelAlign = function (_) {
        if (!arguments.length) return labelAlign;
        if (_ == "start" || _ == "end" || _ == "middle") {
          labelAlign = _;
        }
        return legend;
      };

      legend.locale = function (_) {
        if (!arguments.length) return locale;
        locale = formatLocale(_);
        return legend;
      };

      legend.labelFormat = function (_) {
        if (!arguments.length) return legend.locale().format(specifier);
        specifier = formatSpecifier(_);
        return legend;
      };

      legend.labelOffset = function (_) {
        if (!arguments.length) return labelOffset;
        labelOffset = +_;
        return legend;
      };

      legend.labelDelimiter = function (_) {
        if (!arguments.length) return labelDelimiter;
        labelDelimiter = _;
        return legend;
      };

      legend.labelWrap = function (_) {
        if (!arguments.length) return labelWrap;
        labelWrap = _;
        return legend;
      };

      legend.orient = function (_) {
        if (!arguments.length) return orient;
        _ = _.toLowerCase();
        if (_ == "horizontal" || _ == "vertical") {
          orient = _;
        }
        return legend;
      };

      legend.ascending = function (_) {
        if (!arguments.length) return ascending;
        ascending = !!_;
        return legend;
      };

      legend.classPrefix = function (_) {
        if (!arguments.length) return classPrefix;
        classPrefix = _;
        return legend;
      };

      legend.title = function (_) {
        if (!arguments.length) return title;
        title = _;
        return legend;
      };

      legend.titleWidth = function (_) {
        if (!arguments.length) return titleWidth;
        titleWidth = _;
        return legend;
      };

      legend.on = function () {
        var value = legendDispatcher.on.apply(legendDispatcher, arguments);
        return value === legendDispatcher ? legend : value;
      };

      return legend;
    }

    /* src/charts/meter-chart.svelte generated by Svelte v3.42.1 */
    const file$3 = "src/charts/meter-chart.svelte";

    function create_fragment$3(ctx) {
    	let figure;
    	let figure_class_value;

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			attr_dev(figure, "class", figure_class_value = /*getClassNames*/ ctx[1]());
    			add_location(figure, file$3, 180, 0, 5526);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			/*figure_binding*/ ctx[9](figure);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			/*figure_binding*/ ctx[9](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let widthScale;
    	let lengthScale;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Meter_chart', slots, []);

    	let d3 = {
    		scaleLinear: linear$1,
    		scaleBand: band,
    		scaleOrdinal: ordinal,
    		select,
    		axisLeft,
    		axisRight,
    		axisBottom,
    		axisTop,
    		legendColor: color$1
    	};

    	let el;
    	let { label = { label } } = $$props;
    	let { value = { value } } = $$props;
    	let { width = { width } } = $$props;
    	let { length = { length } } = $$props;
    	let { orientation = 'horizontal' } = $$props;
    	let { max = 100 } = $$props;
    	let { hasAccent = false } = $$props;
    	let classNames = ["graph", "meter-graph"];

    	if (hasAccent) {
    		classNames.push("has-accent");
    	}

    	const getClassNames = () => {
    		return classNames.join(" ");
    	};

    	let data = [max, value];

    	if ('horizontal' !== orientation) {
    		orientation = 'vertical';
    	}

    	onMount(generateChart);

    	function generateChart() {
    		let classNames = ["datapoint"];
    		let chartWidth;
    		let chartHeight;
    		let datapointWidthAttr;
    		let datapointLengthAttr;

    		/**
     * Set variables to match orientation.
     *
     * @since 1.5
     */
    		if ("vertical" === orientation) {
    			classNames.push("is-vertical");
    			chartHeight = length;
    			chartWidth = width;
    			datapointWidthAttr = 'width';
    			datapointLengthAttr = 'height';
    		} else {
    			classNames.push("is-horizontal");
    			chartHeight = width;
    			chartWidth = length;
    			datapointWidthAttr = 'height';
    			datapointLengthAttr = 'width';
    		}

    		const figure = d3.select(el);
    		const chartLabel = figure.append("figcaption").attr("class", "graph-title");

    		chartLabel.text(function (d) {
    			return label;
    		});

    		const svg = figure.append("svg").attr("class", classNames.join(" ")).attr("width", chartWidth).attr("height", chartHeight);

    		/**
     * Create chart
     *
     * @since 1.0
     */
    		for (let i = 0; i < data.length; i++) {
    			if (0 === i) {
    				/**
     * Adds the face to the datapoint.
     * The column showing the value rests on this, like a watch face.
     *
     * @since 1.5
     */
    				svg.append("rect").attr("class", "graph-face").attr(datapointWidthAttr, widthScale.bandwidth()).attr(datapointLengthAttr, function (d) {
    					return lengthScale(data[i]);
    				});
    			} else {
    				/**
     * Adds the column containing the value.
     * The column is kept in a container so the label can be
     * centered inside of it.
     *
     * @since 1.5
     */
    				let columnContainer = svg.append('g').attr("class", "datapoint__column-container");

    				let columnVerticalOffset = 0;
    				let columnLength = Math.floor(lengthScale(100 > data[i] ? data[i] : 100));
    				let columnWidth = Math.floor(widthScale.bandwidth());
    				let columnMidWidth = Math.floor(widthScale.bandwidth() / 2);
    				let columnMidLength = Math.floor(columnLength / 2);
    				let column = columnContainer.append("rect").attr("class", "graph-column").attr(datapointWidthAttr, columnWidth).attr(datapointLengthAttr, columnLength);

    				if ('vertical' === orientation) {
    					columnVerticalOffset = Math.floor(chartHeight - columnLength);
    					columnContainer.attr('transform', "translate(0, " + columnVerticalOffset + ")");
    				}

    				/**
     * Adds the datapoint label.
     * This is placed in the column container so it can be centered
     * inside the column, especially as it grows.
     *
     * @since 1.5
     */
    				let datapointLabel = columnContainer.append('text').attr('class', 'data-label').text(`${data[i]}%`);

    				if ("vertical" === orientation) {
    					let labelVerticalOffset = 20 > data[i] ? columnMidLength : columnMidLength;

    					datapointLabel.attr('x', function (d) {
    						return columnMidWidth;
    					}).attr('y', function (d) {
    						return labelVerticalOffset;
    					});
    				} else if ("horizontal" === orientation) {
    					datapointLabel.attr('x', function (d) {
    						return columnMidLength;
    					}).attr('y', function (d) {
    						return "50%";
    					});
    				}
    			}
    		}
    	}

    	const writable_props = ['label', 'value', 'width', 'length', 'orientation', 'max', 'hasAccent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Meter_chart> was created with unknown prop '${key}'`);
    	});

    	function figure_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(3, label = $$props.label);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('width' in $$props) $$invalidate(5, width = $$props.width);
    		if ('length' in $$props) $$invalidate(6, length = $$props.length);
    		if ('orientation' in $$props) $$invalidate(2, orientation = $$props.orientation);
    		if ('max' in $$props) $$invalidate(7, max = $$props.max);
    		if ('hasAccent' in $$props) $$invalidate(8, hasAccent = $$props.hasAccent);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		scaleBand: band,
    		scaleLinear: linear$1,
    		scaleOrdinal: ordinal,
    		axisBottom,
    		axisLeft,
    		axisRight,
    		axisTop,
    		select,
    		legendColor: color$1,
    		d3,
    		el,
    		label,
    		value,
    		width,
    		length,
    		orientation,
    		max,
    		hasAccent,
    		classNames,
    		getClassNames,
    		data,
    		generateChart,
    		widthScale,
    		lengthScale
    	});

    	$$self.$inject_state = $$props => {
    		if ('d3' in $$props) $$invalidate(12, d3 = $$props.d3);
    		if ('el' in $$props) $$invalidate(0, el = $$props.el);
    		if ('label' in $$props) $$invalidate(3, label = $$props.label);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('width' in $$props) $$invalidate(5, width = $$props.width);
    		if ('length' in $$props) $$invalidate(6, length = $$props.length);
    		if ('orientation' in $$props) $$invalidate(2, orientation = $$props.orientation);
    		if ('max' in $$props) $$invalidate(7, max = $$props.max);
    		if ('hasAccent' in $$props) $$invalidate(8, hasAccent = $$props.hasAccent);
    		if ('classNames' in $$props) classNames = $$props.classNames;
    		if ('data' in $$props) data = $$props.data;
    		if ('widthScale' in $$props) widthScale = $$props.widthScale;
    		if ('lengthScale' in $$props) lengthScale = $$props.lengthScale;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*width*/ 32) {
    			 widthScale = d3.scaleBand().rangeRound([0, width]);
    		}

    		if ($$self.$$.dirty & /*length*/ 64) {
    			 lengthScale = d3.scaleLinear().domain([0, 100]).range([0, length]).nice();
    		}
    	};

    	return [
    		el,
    		getClassNames,
    		orientation,
    		label,
    		value,
    		width,
    		length,
    		max,
    		hasAccent,
    		figure_binding
    	];
    }

    class Meter_chart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			label: 3,
    			value: 4,
    			width: 5,
    			length: 6,
    			orientation: 2,
    			max: 7,
    			hasAccent: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Meter_chart",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get label() {
    		throw new Error("<Meter_chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Meter_chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Meter_chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Meter_chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Meter_chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Meter_chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get length() {
    		throw new Error("<Meter_chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set length(value) {
    		throw new Error("<Meter_chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orientation() {
    		throw new Error("<Meter_chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orientation(value) {
    		throw new Error("<Meter_chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Meter_chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Meter_chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasAccent() {
    		throw new Error("<Meter_chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasAccent(value) {
    		throw new Error("<Meter_chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var emptyOn = dispatch$1("start", "end", "cancel", "interrupt");

    /* src/charts/chart-bar-vertical.svelte generated by Svelte v3.42.1 */
    const file$4 = "src/charts/chart-bar-vertical.svelte";

    function create_fragment$4(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart svelte-pzyzh7");
    			add_location(div, file$4, 227, 0, 5169);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[10](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let xScale;
    	let yScale;
    	let colors;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chart_bar_vertical', slots, []);

    	let d3 = {
    		scaleLinear: linear$1,
    		scaleBand: band,
    		scaleOrdinal: ordinal,
    		select,
    		mouse,
    		axisLeft,
    		axisRight,
    		axisBottom,
    		axisTop,
    		line,
    		path,
    		curveMonotoneX: monotoneX,
    		curveNatural,
    		interpolateRound,
    		legendColor: color$1
    	};

    	let el;
    	const padding = { top: 50, right: 0, bottom: 40, left: 40 };
    	let { data = { data } } = $$props;
    	let { width = { width } } = $$props;
    	let { height = { height } } = $$props;
    	let { xVar = { xVar } } = $$props;
    	let { yVar = { yVar } } = $$props;
    	let { yGroups = { yGroups: value } } = $$props;
    	let { colorscheme = { colorscheme } } = $$props;
    	let { colorsteps = yGroups.length } = $$props;
    	let { len = data.length } = $$props;

    	function showTip(d, target, mouse) {
    		target.style("position", "absolute").style("left", mouse[0] - 100 + "px").style("top", mouse[1] - 150 + "px").style("display", "inline-block").html(function (g) {
    			let arr = [];

    			for (g = 0; g < yGroups.length; g++) {
    				arr.push("<br/>" + yGroups[g] + ": " + d[yGroups[g]]);
    			}

    			return "<div class='tipdate'>" + d[xVar] + "</div>" + arr.join(' ');
    		});
    	}

    	onMount(generateColumnChart);

    	function generateColumnChart() {
    		var tooltip = d3.select(el).append("div").attr("class", "tooltip");
    		var svg = d3.select(el).append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + padding.left + "," + 0 + ")");

    		let axisBottomRender = svg.append("g").attr("transform", "translate(0," + (height - padding.bottom) + ")").attr("class", "horizontalAxis").call(d3.axisBottom(xScale).// .tickValues(xScale.domain().filter(function(d,i){
    		// 	console.log(d)
    		// 	// let tickCount = Math.round(xScale.domain().length/10);
    		// 	// let lastTick = xScale.domain().length-1;
    		// 	// return ((i % tickCount) === (lastTick % tickCount))
    		// }))
    		tickSize(0));

    		axisBottomRender.selectAll("path").attr("stroke", "#ccc");
    		axisBottomRender.selectAll("text").style("text-anchor", "end").attr("transform", "rotate(-45)").attr("dx", -3).attr("dy", 3.5);
    		let axisVerticalRender = svg.append("g").attr("class", "verticalAxis").call(d3.axisLeft(yScale).ticks(Math.min(6, yScale.domain()[1])).tickSize(0));
    		axisVerticalRender.selectAll("path").attr("stroke", "#ccc");

    		// add data columns
    		for (let i = 0; i < yGroups.length; i++) {
    			svg.append('g').selectAll("rect").data(data).enter().append("rect").attr("fill", colors(yGroups[i])).attr("x", function (d) {
    				return xScale(d[xVar]);
    			}).attr("y", function (d) {
    				let barheight = 0;

    				for (let j = i; j > -1; j = j - 1) {
    					barheight += d[yGroups[j]];
    				}

    				return yScale(barheight);
    			}).attr("width", xScale.bandwidth()).attr("height", function (d) {
    				return height - padding.bottom - yScale(d[yGroups[i]]);
    			}).on("mousemove", function (d) {
    				if (window.innerWidth > 600) {
    					showTip(d, tooltip, d3.mouse(this));
    				}
    			}).on("mouseout", function (d) {
    				tooltip.style("display", "none");
    			});
    		}
    	}

    	const writable_props = [
    		'data',
    		'width',
    		'height',
    		'xVar',
    		'yVar',
    		'yGroups',
    		'colorscheme',
    		'colorsteps',
    		'len'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chart_bar_vertical> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('xVar' in $$props) $$invalidate(4, xVar = $$props.xVar);
    		if ('yVar' in $$props) $$invalidate(5, yVar = $$props.yVar);
    		if ('yGroups' in $$props) $$invalidate(6, yGroups = $$props.yGroups);
    		if ('colorscheme' in $$props) $$invalidate(7, colorscheme = $$props.colorscheme);
    		if ('colorsteps' in $$props) $$invalidate(8, colorsteps = $$props.colorsteps);
    		if ('len' in $$props) $$invalidate(9, len = $$props.len);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		scaleLinear: linear$1,
    		scaleBand: band,
    		scaleOrdinal: ordinal,
    		axisLeft,
    		axisRight,
    		axisTop,
    		axisBottom,
    		select,
    		mouse,
    		line,
    		curveMonotoneX: monotoneX,
    		curveNatural,
    		path,
    		interpolateRound,
    		legendColor: color$1,
    		d3,
    		el,
    		padding,
    		data,
    		width,
    		height,
    		xVar,
    		yVar,
    		yGroups,
    		colorscheme,
    		colorsteps,
    		len,
    		showTip,
    		generateColumnChart,
    		yScale,
    		xScale,
    		colors
    	});

    	$$self.$inject_state = $$props => {
    		if ('d3' in $$props) $$invalidate(14, d3 = $$props.d3);
    		if ('el' in $$props) $$invalidate(0, el = $$props.el);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('xVar' in $$props) $$invalidate(4, xVar = $$props.xVar);
    		if ('yVar' in $$props) $$invalidate(5, yVar = $$props.yVar);
    		if ('yGroups' in $$props) $$invalidate(6, yGroups = $$props.yGroups);
    		if ('colorscheme' in $$props) $$invalidate(7, colorscheme = $$props.colorscheme);
    		if ('colorsteps' in $$props) $$invalidate(8, colorsteps = $$props.colorsteps);
    		if ('len' in $$props) $$invalidate(9, len = $$props.len);
    		if ('yScale' in $$props) yScale = $$props.yScale;
    		if ('xScale' in $$props) xScale = $$props.xScale;
    		if ('colors' in $$props) colors = $$props.colors;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*data, xVar, width*/ 22) {
    			// for (let k=0; k < (len-31); k++) {
    			// 	data.shift()
    			// }
    			// data.forEach(function(d,i){
    			// 	if (i > (avgdaycount-2)) {
    			// 		let array = [];
    			// 		for (let j=0;  j<avgdaycount; j++) {
    			// 			array.push( +data[i-j][yVar] )
    			// 		}
    			// 		let avg = array.reduce((a, b) => a + b, 0) / avgdaycount;
    			// 		data[i]["rollingavg"] = Math.round(avg);
    			// 	}
    			// })
    			 xScale = d3.scaleBand().domain(data.map(function (o) {
    				return o[xVar];
    			})).range([1, width - padding.left - padding.right]).padding(0.1);
    		}

    		if ($$self.$$.dirty & /*data, yVar, height*/ 42) {
    			 yScale = d3.scaleLinear().domain([
    				0,
    				Math.max.apply(Math, data.map(function (o) {
    					return o[yVar];
    				}))
    			]).range([height - padding.bottom, padding.top]).nice();
    		}

    		if ($$self.$$.dirty & /*yGroups, colorscheme*/ 192) {
    			 colors = d3.scaleOrdinal().domain(yGroups).range(colorscheme);
    		}
    	};

    	return [
    		el,
    		data,
    		width,
    		height,
    		xVar,
    		yVar,
    		yGroups,
    		colorscheme,
    		colorsteps,
    		len,
    		div_binding
    	];
    }

    class Chart_bar_vertical extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			data: 1,
    			width: 2,
    			height: 3,
    			xVar: 4,
    			yVar: 5,
    			yGroups: 6,
    			colorscheme: 7,
    			colorsteps: 8,
    			len: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_bar_vertical",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get data() {
    		throw new Error("<Chart_bar_vertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Chart_bar_vertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Chart_bar_vertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Chart_bar_vertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Chart_bar_vertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Chart_bar_vertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xVar() {
    		throw new Error("<Chart_bar_vertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xVar(value) {
    		throw new Error("<Chart_bar_vertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yVar() {
    		throw new Error("<Chart_bar_vertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yVar(value) {
    		throw new Error("<Chart_bar_vertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get yGroups() {
    		throw new Error("<Chart_bar_vertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set yGroups(value) {
    		throw new Error("<Chart_bar_vertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorscheme() {
    		throw new Error("<Chart_bar_vertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorscheme(value) {
    		throw new Error("<Chart_bar_vertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorsteps() {
    		throw new Error("<Chart_bar_vertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorsteps(value) {
    		throw new Error("<Chart_bar_vertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get len() {
    		throw new Error("<Chart_bar_vertical>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set len(value) {
    		throw new Error("<Chart_bar_vertical>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function digitFormat(number) {
        if ((number === undefined) || isNaN(number)) {
          return "n/a";
       } else {
          return number;
       }
    }

    /* src/charts/wellness-summary.svelte generated by Svelte v3.42.1 */
    const file$5 = "src/charts/wellness-summary.svelte";

    function create_fragment$5(ctx) {
    	let figure;
    	let h3;
    	let t0;
    	let t1;
    	let div4;
    	let div1;
    	let h40;
    	let t3;
    	let div0;
    	let t4_value = digitFormat(/*onCampus*/ ctx[0]) + "";
    	let t4;
    	let t5;
    	let div3;
    	let h41;
    	let t7;
    	let div2;
    	let t8_value = digitFormat(/*offCampus*/ ctx[1]) + "";
    	let t8;
    	let figure_class_value;

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			h3 = element("h3");
    			t0 = text(/*label*/ ctx[2]);
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			h40 = element("h4");
    			h40.textContent = "On Campus";
    			t3 = space();
    			div0 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div3 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Off Campus";
    			t7 = space();
    			div2 = element("div");
    			t8 = text(t8_value);
    			attr_dev(h3, "class", "graph-title");
    			add_location(h3, file$5, 23, 4, 505);
    			attr_dev(h40, "class", "data-category");
    			add_location(h40, file$5, 26, 12, 653);
    			attr_dev(div0, "class", "data-label");
    			add_location(div0, file$5, 27, 12, 706);
    			attr_dev(div1, "class", "wellness-summary__location");
    			add_location(div1, file$5, 25, 8, 600);
    			attr_dev(h41, "class", "data-category");
    			add_location(h41, file$5, 30, 12, 836);
    			attr_dev(div2, "class", "data-label");
    			add_location(div2, file$5, 31, 12, 890);
    			attr_dev(div3, "class", "wellness-summary__location");
    			add_location(div3, file$5, 29, 8, 783);
    			attr_dev(div4, "class", "wellness-summary__location-list");
    			add_location(div4, file$5, 24, 4, 546);
    			attr_dev(figure, "class", figure_class_value = /*getClassNames*/ ctx[4]());
    			add_location(figure, file$5, 22, 0, 451);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			append_dev(figure, h3);
    			append_dev(h3, t0);
    			append_dev(figure, t1);
    			append_dev(figure, div4);
    			append_dev(div4, div1);
    			append_dev(div1, h40);
    			append_dev(div1, t3);
    			append_dev(div1, div0);
    			append_dev(div0, t4);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div3, h41);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, t8);
    			/*figure_binding*/ ctx[6](figure);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 4) set_data_dev(t0, /*label*/ ctx[2]);
    			if (dirty & /*onCampus*/ 1 && t4_value !== (t4_value = digitFormat(/*onCampus*/ ctx[0]) + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*offCampus*/ 2 && t8_value !== (t8_value = digitFormat(/*offCampus*/ ctx[1]) + "")) set_data_dev(t8, t8_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			/*figure_binding*/ ctx[6](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Wellness_summary', slots, []);
    	let el;
    	let { onCampus = { onCampus } } = $$props;
    	let { offCampus = { offCampus } } = $$props;
    	let { label = { label } } = $$props;
    	let { hasAccent = false } = $$props;
    	let classNames = ["graph", "wellness-summary"];

    	if (hasAccent) {
    		classNames.push("has-accent");
    	}

    	const getClassNames = () => {
    		return classNames.join(" ");
    	};

    	const writable_props = ['onCampus', 'offCampus', 'label', 'hasAccent'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Wellness_summary> was created with unknown prop '${key}'`);
    	});

    	function figure_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(3, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('onCampus' in $$props) $$invalidate(0, onCampus = $$props.onCampus);
    		if ('offCampus' in $$props) $$invalidate(1, offCampus = $$props.offCampus);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('hasAccent' in $$props) $$invalidate(5, hasAccent = $$props.hasAccent);
    	};

    	$$self.$capture_state = () => ({
    		digitFormat,
    		el,
    		onCampus,
    		offCampus,
    		label,
    		hasAccent,
    		classNames,
    		getClassNames
    	});

    	$$self.$inject_state = $$props => {
    		if ('el' in $$props) $$invalidate(3, el = $$props.el);
    		if ('onCampus' in $$props) $$invalidate(0, onCampus = $$props.onCampus);
    		if ('offCampus' in $$props) $$invalidate(1, offCampus = $$props.offCampus);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('hasAccent' in $$props) $$invalidate(5, hasAccent = $$props.hasAccent);
    		if ('classNames' in $$props) classNames = $$props.classNames;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [onCampus, offCampus, label, el, getClassNames, hasAccent, figure_binding];
    }

    class Wellness_summary extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			onCampus: 0,
    			offCampus: 1,
    			label: 2,
    			hasAccent: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Wellness_summary",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get onCampus() {
    		throw new Error("<Wellness_summary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onCampus(value) {
    		throw new Error("<Wellness_summary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offCampus() {
    		throw new Error("<Wellness_summary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offCampus(value) {
    		throw new Error("<Wellness_summary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Wellness_summary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Wellness_summary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasAccent() {
    		throw new Error("<Wellness_summary>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasAccent(value) {
    		throw new Error("<Wellness_summary>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/charts/data-point.svelte generated by Svelte v3.42.1 */
    const file$6 = "src/charts/data-point.svelte";

    function create_fragment$6(ctx) {
    	let figure;
    	let figure_class_value;

    	const block = {
    		c: function create() {
    			figure = element("figure");
    			attr_dev(figure, "class", figure_class_value = /*getClassNames*/ ctx[1]());
    			add_location(figure, file$6, 84, 0, 2315);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, figure, anchor);
    			/*figure_binding*/ ctx[6](figure);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(figure);
    			/*figure_binding*/ ctx[6](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Data_point', slots, []);

    	let d3 = {
    		scaleOrdinal: ordinal,
    		entries,
    		pie,
    		arc,
    		select,
    		mouse,
    		path
    	};

    	let el;
    	const padding = { top: 10, right: 40, bottom: 70, left: 50 };
    	let { width = { width } } = $$props;
    	let { height = { height } } = $$props;
    	let { value = { value } } = $$props;
    	let { label = { label } } = $$props;
    	let hasAccent = false;
    	let classNames = ["graph", "data-point-graph"];

    	if (hasAccent) {
    		classNames.push("has-accent");
    	}

    	const getClassNames = () => {
    		return classNames.join(" ");
    	};

    	onMount(generateDonut);

    	function generateDonut() {
    		const graphContainer = d3.select(el);

    		const graphTitle = graphContainer.append("div").attr("class", "graph-title").text(function (d) {
    			return label;
    		});

    		const graphVisualWrapper = graphContainer.append("div").attr("class", "graph-visual-wrapper");
    		const graphVisual = graphVisualWrapper.append("svg").attr("class", "graph-visual").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    		let squareSideLength = 0.4 * width;
    		let squareStrokeWidth = "8px";
    		graphVisual.append("rect").attr("class", "graph-column").attr("width", squareSideLength).attr("height", squareSideLength).attr("x", -0.5 * squareSideLength).attr("y", -0.5 * squareSideLength).style("stroke-width", squareStrokeWidth);
    		const graphDataLabel = graphVisual.append("text").attr("class", "data-label").text(value.toLocaleString());
    	}

    	const writable_props = ['width', 'height', 'value', 'label'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Data_point> was created with unknown prop '${key}'`);
    	});

    	function figure_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		scaleOrdinal: ordinal,
    		mouse,
    		select,
    		entries,
    		path,
    		arc,
    		pie,
    		d3,
    		el,
    		padding,
    		width,
    		height,
    		value,
    		label,
    		hasAccent,
    		classNames,
    		getClassNames,
    		generateDonut
    	});

    	$$self.$inject_state = $$props => {
    		if ('d3' in $$props) d3 = $$props.d3;
    		if ('el' in $$props) $$invalidate(0, el = $$props.el);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('height' in $$props) $$invalidate(3, height = $$props.height);
    		if ('value' in $$props) $$invalidate(4, value = $$props.value);
    		if ('label' in $$props) $$invalidate(5, label = $$props.label);
    		if ('hasAccent' in $$props) hasAccent = $$props.hasAccent;
    		if ('classNames' in $$props) classNames = $$props.classNames;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [el, getClassNames, width, height, value, label, figure_binding];
    }

    class Data_point extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { width: 2, height: 3, value: 4, label: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Data_point",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get width() {
    		throw new Error("<Data_point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Data_point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Data_point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Data_point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Data_point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Data_point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Data_point>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Data_point>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-table/src/SvelteTable.svelte generated by Svelte v3.42.1 */

    const { Object: Object_1 } = globals;
    const file$7 = "node_modules/svelte-table/src/SvelteTable.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	child_ctx[35] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    const get_row_slot_changes = dirty => ({ row: dirty[0] & /*c_rows*/ 8192 });
    const get_row_slot_context = ctx => ({ row: /*row*/ ctx[33], n: /*n*/ ctx[35] });

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    const get_header_slot_changes = dirty => ({
    	sortOrder: dirty[0] & /*sortOrder*/ 2,
    	sortBy: dirty[0] & /*sortBy*/ 1
    });

    const get_header_slot_context = ctx => ({
    	sortOrder: /*sortOrder*/ ctx[1],
    	sortBy: /*sortBy*/ ctx[0]
    });

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	child_ctx[41] = list;
    	child_ctx[42] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[43] = list[i];
    	return child_ctx;
    }

    // (134:4) {#if showFilterHeader}
    function create_if_block_4(ctx) {
    	let tr;
    	let each_value_3 = /*columns*/ ctx[3];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tr, "class", "svelte-w7dofd");
    			add_location(tr, file$7, 134, 6, 3668);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterSelections, columns, asStringArray, classNameSelect, filterValues*/ 37388) {
    				each_value_3 = /*columns*/ ctx[3];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(134:4) {#if showFilterHeader}",
    		ctx
    	});

    	return block;
    }

    // (140:58) 
    function create_if_block_6(ctx) {
    	let select;
    	let option;
    	let select_class_value;
    	let mounted;
    	let dispose;
    	let each_value_4 = /*filterValues*/ ctx[12][/*col*/ ctx[36].key];
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	function select_change_handler() {
    		/*select_change_handler*/ ctx[25].call(select, /*col*/ ctx[36]);
    	}

    	const block = {
    		c: function create() {
    			select = element("select");
    			option = element("option");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			option.__value = undefined;
    			option.value = option.__value;
    			add_location(option, file$7, 141, 16, 4004);
    			attr_dev(select, "class", select_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameSelect*/ ctx[9])) + " svelte-w7dofd"));
    			if (/*filterSelections*/ ctx[2][/*col*/ ctx[36].key] === void 0) add_render_callback(select_change_handler);
    			add_location(select, file$7, 140, 14, 3901);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);
    			append_dev(select, option);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*filterSelections*/ ctx[2][/*col*/ ctx[36].key]);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", select_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*filterValues, columns*/ 4104) {
    				each_value_4 = /*filterValues*/ ctx[12][/*col*/ ctx[36].key];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_4.length;
    			}

    			if (dirty[0] & /*classNameSelect*/ 512 && select_class_value !== (select_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameSelect*/ ctx[9])) + " svelte-w7dofd"))) {
    				attr_dev(select, "class", select_class_value);
    			}

    			if (dirty[0] & /*filterSelections, columns, filterValues*/ 4108) {
    				select_option(select, /*filterSelections*/ ctx[2][/*col*/ ctx[36].key]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(140:58) ",
    		ctx
    	});

    	return block;
    }

    // (138:12) {#if col.searchValue !== undefined}
    function create_if_block_5(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[24].call(input, /*col*/ ctx[36]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			add_location(input, file$7, 138, 14, 3781);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*filterSelections*/ ctx[2][/*col*/ ctx[36].key]);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", input_input_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*filterSelections, columns, filterValues*/ 4108 && input.value !== /*filterSelections*/ ctx[2][/*col*/ ctx[36].key]) {
    				set_input_value(input, /*filterSelections*/ ctx[2][/*col*/ ctx[36].key]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(138:12) {#if col.searchValue !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (143:16) {#each filterValues[col.key] as option}
    function create_each_block_4(ctx) {
    	let option;
    	let t_value = /*option*/ ctx[43].name + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*option*/ ctx[43].value;
    			option.value = option.__value;
    			add_location(option, file$7, 143, 18, 4114);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*filterValues, columns*/ 4104 && t_value !== (t_value = /*option*/ ctx[43].name + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*filterValues, columns*/ 4104 && option_value_value !== (option_value_value = /*option*/ ctx[43].value)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(143:16) {#each filterValues[col.key] as option}",
    		ctx
    	});

    	return block;
    }

    // (136:8) {#each columns as col}
    function create_each_block_3(ctx) {
    	let th;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (/*col*/ ctx[36].searchValue !== undefined) return create_if_block_5;
    		if (/*filterValues*/ ctx[12][/*col*/ ctx[36].key] !== undefined) return create_if_block_6;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			if (if_block) if_block.c();
    			t = space();
    			add_location(th, file$7, 136, 10, 3714);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			if (if_block) if_block.m(th, null);
    			append_dev(th, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(th, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(136:8) {#each columns as col}",
    		ctx
    	});

    	return block;
    }

    // (165:10) {:else}
    function create_else_block_1(ctx) {
    	let th;
    	let t0_value = /*col*/ ctx[36].title + "";
    	let t0;
    	let t1;
    	let t2;
    	let th_class_value;
    	let if_block = /*sortBy*/ ctx[0] === /*col*/ ctx[36].key && create_if_block_3(ctx);

    	const block = {
    		c: function create() {
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			attr_dev(th, "class", th_class_value = "" + (null_to_empty(/*col*/ ctx[36].headerClass) + " svelte-w7dofd"));
    			add_location(th, file$7, 165, 12, 4763);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t0);
    			append_dev(th, t1);
    			if (if_block) if_block.m(th, null);
    			append_dev(th, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*columns*/ 8 && t0_value !== (t0_value = /*col*/ ctx[36].title + "")) set_data_dev(t0, t0_value);

    			if (/*sortBy*/ ctx[0] === /*col*/ ctx[36].key) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(th, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*columns, filterValues*/ 4104 && th_class_value !== (th_class_value = "" + (null_to_empty(/*col*/ ctx[36].headerClass) + " svelte-w7dofd"))) {
    				attr_dev(th, "class", th_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(165:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (155:10) {#if col.sortable}
    function create_if_block_1(ctx) {
    	let th;
    	let t0_value = /*col*/ ctx[36].title + "";
    	let t0;
    	let t1;
    	let t2;
    	let th_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*sortBy*/ ctx[0] === /*col*/ ctx[36].key && create_if_block_2(ctx);

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[26](/*col*/ ctx[36], ...args);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			attr_dev(th, "class", th_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](['isSortable', /*col*/ ctx[36].headerClass])) + " svelte-w7dofd"));
    			add_location(th, file$7, 155, 12, 4432);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t0);
    			append_dev(th, t1);
    			if (if_block) if_block.m(th, null);
    			append_dev(th, t2);

    			if (!mounted) {
    				dispose = listen_dev(th, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*columns*/ 8 && t0_value !== (t0_value = /*col*/ ctx[36].title + "")) set_data_dev(t0, t0_value);

    			if (/*sortBy*/ ctx[0] === /*col*/ ctx[36].key) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(th, t2);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*columns, filterValues*/ 4104 && th_class_value !== (th_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](['isSortable', /*col*/ ctx[36].headerClass])) + " svelte-w7dofd"))) {
    				attr_dev(th, "class", th_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(155:10) {#if col.sortable}",
    		ctx
    	});

    	return block;
    }

    // (170:14) {#if sortBy === col.key}
    function create_if_block_3(ctx) {
    	let t_value = (/*sortOrder*/ ctx[1] === 1
    	? /*iconAsc*/ ctx[4]
    	: /*iconDesc*/ ctx[5]) + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sortOrder, iconAsc, iconDesc*/ 50 && t_value !== (t_value = (/*sortOrder*/ ctx[1] === 1
    			? /*iconAsc*/ ctx[4]
    			: /*iconDesc*/ ctx[5]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(170:14) {#if sortBy === col.key}",
    		ctx
    	});

    	return block;
    }

    // (161:14) {#if sortBy === col.key}
    function create_if_block_2(ctx) {
    	let t_value = (/*sortOrder*/ ctx[1] === 1
    	? /*iconAsc*/ ctx[4]
    	: /*iconDesc*/ ctx[5]) + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*sortOrder, iconAsc, iconDesc*/ 50 && t_value !== (t_value = (/*sortOrder*/ ctx[1] === 1
    			? /*iconAsc*/ ctx[4]
    			: /*iconDesc*/ ctx[5]) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(161:14) {#if sortBy === col.key}",
    		ctx
    	});

    	return block;
    }

    // (154:8) {#each columns as col}
    function create_each_block_2(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*col*/ ctx[36].sortable) return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(154:8) {#each columns as col}",
    		ctx
    	});

    	return block;
    }

    // (152:62)        
    function fallback_block_1(ctx) {
    	let tr;
    	let each_value_2 = /*columns*/ ctx[3];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$7, 152, 6, 4355);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*asStringArray, columns, handleClickCol, sortOrder, iconAsc, iconDesc, sortBy*/ 98363) {
    				each_value_2 = /*columns*/ ctx[3];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(152:62)        ",
    		ctx
    	});

    	return block;
    }

    // (194:14) {:else}
    function create_else_block(ctx) {
    	let html_tag;

    	let raw_value = (/*col*/ ctx[36].renderValue
    	? /*col*/ ctx[36].renderValue(/*row*/ ctx[33])
    	: /*col*/ ctx[36].value(/*row*/ ctx[33])) + "";

    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*columns, c_rows*/ 8200 && raw_value !== (raw_value = (/*col*/ ctx[36].renderValue
    			? /*col*/ ctx[36].renderValue(/*row*/ ctx[33])
    			: /*col*/ ctx[36].value(/*row*/ ctx[33])) + "")) html_tag.p(raw_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(194:14) {:else}",
    		ctx
    	});

    	return block;
    }

    // (188:14) {#if col.renderComponent}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		/*col*/ ctx[36].renderComponent.props || {},
    		{ row: /*row*/ ctx[33] },
    		{ col: /*col*/ ctx[36] }
    	];

    	var switch_value = /*col*/ ctx[36].renderComponent.component || /*col*/ ctx[36].renderComponent;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*columns, c_rows*/ 8200)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty[0] & /*columns*/ 8 && get_spread_object(/*col*/ ctx[36].renderComponent.props || {}),
    					dirty[0] & /*c_rows*/ 8192 && { row: /*row*/ ctx[33] },
    					dirty[0] & /*columns*/ 8 && { col: /*col*/ ctx[36] }
    				])
    			: {};

    			if (switch_value !== (switch_value = /*col*/ ctx[36].renderComponent.component || /*col*/ ctx[36].renderComponent)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(188:14) {#if col.renderComponent}",
    		ctx
    	});

    	return block;
    }

    // (183:10) {#each columns as col}
    function create_each_block_1(ctx) {
    	let td;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let td_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*col*/ ctx[36].renderComponent) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_2(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[27](/*row*/ ctx[33], /*col*/ ctx[36], ...args);
    	}

    	const block = {
    		c: function create() {
    			td = element("td");
    			if_block.c();
    			t = space();
    			attr_dev(td, "class", td_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15]([/*col*/ ctx[36].class, /*classNameCell*/ ctx[11]])) + " svelte-w7dofd"));
    			add_location(td, file$7, 183, 12, 5298);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if_blocks[current_block_type_index].m(td, null);
    			append_dev(td, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(td, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(td, t);
    			}

    			if (!current || dirty[0] & /*columns, classNameCell, filterValues*/ 6152 && td_class_value !== (td_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15]([/*col*/ ctx[36].class, /*classNameCell*/ ctx[11]])) + " svelte-w7dofd"))) {
    				attr_dev(td, "class", td_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(183:10) {#each columns as col}",
    		ctx
    	});

    	return block;
    }

    // (181:40)          
    function fallback_block(ctx) {
    	let tr;
    	let tr_class_value;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*columns*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[28](/*row*/ ctx[33], ...args);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(tr, "class", tr_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameRow*/ ctx[10])) + " svelte-w7dofd"));
    			add_location(tr, file$7, 181, 8, 5171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			insert_dev(target, t, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(tr, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*asStringArray, columns, classNameCell, handleClickCell, c_rows*/ 305160) {
    				each_value_1 = /*columns*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*classNameRow*/ 1024 && tr_class_value !== (tr_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameRow*/ ctx[10])) + " svelte-w7dofd"))) {
    				attr_dev(tr, "class", tr_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(181:40)          ",
    		ctx
    	});

    	return block;
    }

    // (180:4) {#each c_rows as row, n}
    function create_each_block(ctx) {
    	let current;
    	const row_slot_template = /*#slots*/ ctx[23].row;
    	const row_slot = create_slot(row_slot_template, ctx, /*$$scope*/ ctx[22], get_row_slot_context);
    	const row_slot_or_fallback = row_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			if (row_slot_or_fallback) row_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (row_slot_or_fallback) {
    				row_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (row_slot) {
    				if (row_slot.p && (!current || dirty[0] & /*$$scope, c_rows*/ 4202496)) {
    					update_slot_base(
    						row_slot,
    						row_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(row_slot_template, /*$$scope*/ ctx[22], dirty, get_row_slot_changes),
    						get_row_slot_context
    					);
    				}
    			} else {
    				if (row_slot_or_fallback && row_slot_or_fallback.p && (!current || dirty[0] & /*classNameRow, c_rows, columns, classNameCell*/ 11272)) {
    					row_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (row_slot_or_fallback) row_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(180:4) {#each c_rows as row, n}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let table;
    	let thead;
    	let t0;
    	let thead_class_value;
    	let t1;
    	let tbody;
    	let tbody_class_value;
    	let table_class_value;
    	let current;
    	let if_block = /*showFilterHeader*/ ctx[14] && create_if_block_4(ctx);
    	const header_slot_template = /*#slots*/ ctx[23].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[22], get_header_slot_context);
    	const header_slot_or_fallback = header_slot || fallback_block_1(ctx);
    	let each_value = /*c_rows*/ ctx[13];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			table = element("table");
    			thead = element("thead");
    			if (if_block) if_block.c();
    			t0 = space();
    			if (header_slot_or_fallback) header_slot_or_fallback.c();
    			t1 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(thead, "class", thead_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameThead*/ ctx[7])) + " svelte-w7dofd"));
    			add_location(thead, file$7, 132, 2, 3589);
    			attr_dev(tbody, "class", tbody_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameTbody*/ ctx[8])) + " svelte-w7dofd"));
    			add_location(tbody, file$7, 178, 2, 5047);
    			attr_dev(table, "class", table_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameTable*/ ctx[6])) + " svelte-w7dofd"));
    			add_location(table, file$7, 131, 0, 3541);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			if (if_block) if_block.m(thead, null);
    			append_dev(thead, t0);

    			if (header_slot_or_fallback) {
    				header_slot_or_fallback.m(thead, null);
    			}

    			append_dev(table, t1);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*showFilterHeader*/ ctx[14]) if_block.p(ctx, dirty);

    			if (header_slot) {
    				if (header_slot.p && (!current || dirty[0] & /*$$scope, sortOrder, sortBy*/ 4194307)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[22],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[22])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[22], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			} else {
    				if (header_slot_or_fallback && header_slot_or_fallback.p && (!current || dirty[0] & /*columns, sortOrder, iconAsc, iconDesc, sortBy*/ 59)) {
    					header_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}

    			if (!current || dirty[0] & /*classNameThead*/ 128 && thead_class_value !== (thead_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameThead*/ ctx[7])) + " svelte-w7dofd"))) {
    				attr_dev(thead, "class", thead_class_value);
    			}

    			if (dirty[0] & /*asStringArray, classNameRow, handleClickRow, c_rows, columns, classNameCell, handleClickCell, $$scope*/ 4631560) {
    				each_value = /*c_rows*/ ctx[13];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*classNameTbody*/ 256 && tbody_class_value !== (tbody_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameTbody*/ ctx[8])) + " svelte-w7dofd"))) {
    				attr_dev(tbody, "class", tbody_class_value);
    			}

    			if (!current || dirty[0] & /*classNameTable*/ 64 && table_class_value !== (table_class_value = "" + (null_to_empty(/*asStringArray*/ ctx[15](/*classNameTable*/ ctx[6])) + " svelte-w7dofd"))) {
    				attr_dev(table, "class", table_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot_or_fallback, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot_or_fallback, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (if_block) if_block.d();
    			if (header_slot_or_fallback) header_slot_or_fallback.d(detaching);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let c_rows;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteTable', slots, ['header','row']);
    	const dispatch = createEventDispatcher();
    	let { columns } = $$props;
    	let { rows } = $$props;
    	let { sortBy = "" } = $$props;
    	let { sortOrder = 1 } = $$props;
    	let { iconAsc = '▲' } = $$props;
    	let { iconDesc = '▼' } = $$props;
    	let { classNameTable = '' } = $$props;
    	let { classNameThead = '' } = $$props;
    	let { classNameTbody = '' } = $$props;
    	let { classNameSelect = '' } = $$props;
    	let { classNameRow = '' } = $$props;
    	let { classNameCell = '' } = $$props;
    	let { filterSelections = {} } = $$props;
    	let sortFunction = () => "";

    	let showFilterHeader = columns.some(c => {
    		// check if there are any filter or search headers
    		return c.filterOptions !== undefined || c.searchValue !== undefined;
    	});

    	let filterValues = {};
    	let searchValues = {};
    	let columnByKey;
    	const asStringArray = v => [].concat(v).filter(v => typeof v === 'string' && v !== "").join(' ');

    	const calculateFilterValues = () => {
    		$$invalidate(12, filterValues = {});

    		columns.forEach(c => {
    			if (typeof c.filterOptions === "function") {
    				$$invalidate(12, filterValues[c.key] = c.filterOptions(rows), filterValues);
    			} else if (Array.isArray(c.filterOptions)) {
    				// if array of strings is provided, use it for name and value
    				$$invalidate(12, filterValues[c.key] = c.filterOptions.map(val => ({ name: val, value: val })), filterValues);
    			}
    		});
    	};

    	
    	

    	const updateSortOrder = colKey => {
    		if (colKey === sortBy) {
    			$$invalidate(1, sortOrder = sortOrder === 1 ? -1 : 1);
    		} else {
    			$$invalidate(1, sortOrder = 1);
    		}
    	};

    	const handleClickCol = (event, col) => {
    		updateSortOrder(col.key);
    		$$invalidate(0, sortBy = col.key);
    		dispatch('clickCol', { event, col, key: col.key });
    	};

    	const handleClickRow = (event, row) => {
    		dispatch('clickRow', { event, row });
    	};

    	const handleClickCell = (event, row, key) => {
    		dispatch('clickCell', { event, row, key });
    	};

    	const writable_props = [
    		'columns',
    		'rows',
    		'sortBy',
    		'sortOrder',
    		'iconAsc',
    		'iconDesc',
    		'classNameTable',
    		'classNameThead',
    		'classNameTbody',
    		'classNameSelect',
    		'classNameRow',
    		'classNameCell',
    		'filterSelections'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteTable> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler(col) {
    		filterSelections[col.key] = this.value;
    		$$invalidate(2, filterSelections);
    		$$invalidate(3, columns);
    		$$invalidate(12, filterValues);
    	}

    	function select_change_handler(col) {
    		filterSelections[col.key] = select_value(this);
    		$$invalidate(2, filterSelections);
    		$$invalidate(3, columns);
    		$$invalidate(12, filterValues);
    	}

    	const click_handler = (col, e) => handleClickCol(e, col);

    	const click_handler_1 = (row, col, e) => {
    		handleClickCell(e, row, col.key);
    	};

    	const click_handler_2 = (row, e) => {
    		handleClickRow(e, row);
    	};

    	$$self.$$set = $$props => {
    		if ('columns' in $$props) $$invalidate(3, columns = $$props.columns);
    		if ('rows' in $$props) $$invalidate(19, rows = $$props.rows);
    		if ('sortBy' in $$props) $$invalidate(0, sortBy = $$props.sortBy);
    		if ('sortOrder' in $$props) $$invalidate(1, sortOrder = $$props.sortOrder);
    		if ('iconAsc' in $$props) $$invalidate(4, iconAsc = $$props.iconAsc);
    		if ('iconDesc' in $$props) $$invalidate(5, iconDesc = $$props.iconDesc);
    		if ('classNameTable' in $$props) $$invalidate(6, classNameTable = $$props.classNameTable);
    		if ('classNameThead' in $$props) $$invalidate(7, classNameThead = $$props.classNameThead);
    		if ('classNameTbody' in $$props) $$invalidate(8, classNameTbody = $$props.classNameTbody);
    		if ('classNameSelect' in $$props) $$invalidate(9, classNameSelect = $$props.classNameSelect);
    		if ('classNameRow' in $$props) $$invalidate(10, classNameRow = $$props.classNameRow);
    		if ('classNameCell' in $$props) $$invalidate(11, classNameCell = $$props.classNameCell);
    		if ('filterSelections' in $$props) $$invalidate(2, filterSelections = $$props.filterSelections);
    		if ('$$scope' in $$props) $$invalidate(22, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		columns,
    		rows,
    		sortBy,
    		sortOrder,
    		iconAsc,
    		iconDesc,
    		classNameTable,
    		classNameThead,
    		classNameTbody,
    		classNameSelect,
    		classNameRow,
    		classNameCell,
    		filterSelections,
    		sortFunction,
    		showFilterHeader,
    		filterValues,
    		searchValues,
    		columnByKey,
    		asStringArray,
    		calculateFilterValues,
    		updateSortOrder,
    		handleClickCol,
    		handleClickRow,
    		handleClickCell,
    		c_rows
    	});

    	$$self.$inject_state = $$props => {
    		if ('columns' in $$props) $$invalidate(3, columns = $$props.columns);
    		if ('rows' in $$props) $$invalidate(19, rows = $$props.rows);
    		if ('sortBy' in $$props) $$invalidate(0, sortBy = $$props.sortBy);
    		if ('sortOrder' in $$props) $$invalidate(1, sortOrder = $$props.sortOrder);
    		if ('iconAsc' in $$props) $$invalidate(4, iconAsc = $$props.iconAsc);
    		if ('iconDesc' in $$props) $$invalidate(5, iconDesc = $$props.iconDesc);
    		if ('classNameTable' in $$props) $$invalidate(6, classNameTable = $$props.classNameTable);
    		if ('classNameThead' in $$props) $$invalidate(7, classNameThead = $$props.classNameThead);
    		if ('classNameTbody' in $$props) $$invalidate(8, classNameTbody = $$props.classNameTbody);
    		if ('classNameSelect' in $$props) $$invalidate(9, classNameSelect = $$props.classNameSelect);
    		if ('classNameRow' in $$props) $$invalidate(10, classNameRow = $$props.classNameRow);
    		if ('classNameCell' in $$props) $$invalidate(11, classNameCell = $$props.classNameCell);
    		if ('filterSelections' in $$props) $$invalidate(2, filterSelections = $$props.filterSelections);
    		if ('sortFunction' in $$props) $$invalidate(20, sortFunction = $$props.sortFunction);
    		if ('showFilterHeader' in $$props) $$invalidate(14, showFilterHeader = $$props.showFilterHeader);
    		if ('filterValues' in $$props) $$invalidate(12, filterValues = $$props.filterValues);
    		if ('searchValues' in $$props) searchValues = $$props.searchValues;
    		if ('columnByKey' in $$props) $$invalidate(21, columnByKey = $$props.columnByKey);
    		if ('c_rows' in $$props) $$invalidate(13, c_rows = $$props.c_rows);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*columns*/ 8) {
    			 {
    				$$invalidate(21, columnByKey = {});

    				columns.forEach(col => {
    					$$invalidate(21, columnByKey[col.key] = col, columnByKey);
    				});
    			}
    		}

    		if ($$self.$$.dirty[0] & /*columnByKey, sortBy*/ 2097153) {
    			 {
    				let col = columnByKey[sortBy];

    				if (col !== undefined && col.sortable === true && typeof col.value === "function") {
    					$$invalidate(20, sortFunction = r => col.value(r));
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*rows, filterSelections, columnByKey, sortFunction, sortOrder*/ 3670022) {
    			 $$invalidate(13, c_rows = rows.filter(r => {
    				// get search and filter results/matches
    				return Object.keys(filterSelections).every(f => {
    					// check search (text input) matches
    					let resSearch = filterSelections[f] === "" || columnByKey[f].searchValue && (columnByKey[f].searchValue(r) + "").toLocaleLowerCase().indexOf((filterSelections[f] + "").toLocaleLowerCase()) >= 0;

    					// check filter (dropdown) matches
    					let resFilter = resSearch || filterSelections[f] === undefined || // default to value() if filterValue() not provided in col
    					filterSelections[f] === (typeof columnByKey[f].filterValue === "function"
    					? columnByKey[f].filterValue(r)
    					: columnByKey[f].value(r));

    					return resFilter;
    				});
    			}).map(r => Object.assign({}, r, { $sortOn: sortFunction(r) })).sort((a, b) => {
    				if (a.$sortOn > b.$sortOn) return sortOrder; else if (a.$sortOn < b.$sortOn) return -sortOrder;
    				return 0;
    			}));
    		}

    		if ($$self.$$.dirty[0] & /*columns, rows*/ 524296) {
    			 {
    				// if filters are enabled, watch rows and columns
    				if (showFilterHeader && columns && rows) {
    					calculateFilterValues();
    				}
    			}
    		}
    	};

    	return [
    		sortBy,
    		sortOrder,
    		filterSelections,
    		columns,
    		iconAsc,
    		iconDesc,
    		classNameTable,
    		classNameThead,
    		classNameTbody,
    		classNameSelect,
    		classNameRow,
    		classNameCell,
    		filterValues,
    		c_rows,
    		showFilterHeader,
    		asStringArray,
    		handleClickCol,
    		handleClickRow,
    		handleClickCell,
    		rows,
    		sortFunction,
    		columnByKey,
    		$$scope,
    		slots,
    		input_input_handler,
    		select_change_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class SvelteTable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				columns: 3,
    				rows: 19,
    				sortBy: 0,
    				sortOrder: 1,
    				iconAsc: 4,
    				iconDesc: 5,
    				classNameTable: 6,
    				classNameThead: 7,
    				classNameTbody: 8,
    				classNameSelect: 9,
    				classNameRow: 10,
    				classNameCell: 11,
    				filterSelections: 2
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteTable",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*columns*/ ctx[3] === undefined && !('columns' in props)) {
    			console.warn("<SvelteTable> was created without expected prop 'columns'");
    		}

    		if (/*rows*/ ctx[19] === undefined && !('rows' in props)) {
    			console.warn("<SvelteTable> was created without expected prop 'rows'");
    		}
    	}

    	get columns() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rows() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rows(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortBy() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortBy(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sortOrder() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sortOrder(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconAsc() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconAsc(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconDesc() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconDesc(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameTable() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameTable(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameThead() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameThead(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameTbody() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameTbody(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameSelect() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameSelect(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameRow() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameRow(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get classNameCell() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set classNameCell(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterSelections() {
    		throw new Error("<SvelteTable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterSelections(value) {
    		throw new Error("<SvelteTable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/charts/chart-covid-variants.svelte generated by Svelte v3.42.1 */
    const file$8 = "src/charts/chart-covid-variants.svelte";

    function create_fragment$8(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "chart svelte-1rhv5fs");
    			add_location(div, file$8, 270, 0, 7261);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[13](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[13](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let rows;
    	let height;
    	let xScale;
    	let colorScale;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chart_covid_variants', slots, []);

    	let d3 = {
    		scaleLinear: linear$1,
    		scaleBand: band,
    		scaleOrdinal: ordinal,
    		scaleQuantize: quantize,
    		scaleQuantile: quantile,
    		scaleThreshold: threshold$1,
    		select,
    		axisLeft,
    		axisRight,
    		axisBottom,
    		axisTop,
    		legendColor: color$1,
    		legendSize: size
    	};

    	let { data = [] } = $$props;
    	let { width = { width } } = $$props;
    	let { groups = { groups } } = $$props;
    	let { columns = { columns } } = $$props;
    	let { isPercentage = { isPercentage } } = $$props;
    	let { colors = { colors } } = $$props;
    	let { labels = { labels } } = $$props;
    	let { footnotes = { footnotes } } = $$props;
    	let { orientation = "horizontal" } = $$props;
    	const padding = { top: 20, right: 0, bottom: 0, left: 20 };
    	let cellColors = colors.map(x => x);
    	let cellBounds = [0];
    	let totalItems = 0;
    	let totalCells = 0;
    	let cellValue = 1;
    	let cells = [0];
    	let numRows;
    	let el;

    	for (let i in groups) {
    		totalItems = data[groups[i]] + totalItems;
    		totalCells = totalItems;
    	}

    	if (isPercentage) {
    		cellValue = totalItems / 100;
    		totalCells = 100;
    	}

    	// Determine how many cells each group fills.
    	for (let i in groups) {
    		let groupValue = data[groups[i]] / cellValue;
    		let subtotal = Math.round(groupValue) + cells[cells.length - 1];

    		if (isPercentage && 100 < subtotal) {
    			subtotal = 100;
    		}

    		cells.push(subtotal);
    	}

    	/**
     * If it's a percentage, use 100 cells. Otherwise, usa a 1:1 cell/data point
     */
    	if (isPercentage) {
    		numRows = Math.round(100 / columns);
    	} else {
    		numRows = Math.ceil(totalItems / columns);
    	}

    	let cellSize = Math.floor(width / columns) - 1;
    	onMount(generateWaffleChart);

    	/**
     * Creates the graph.
     *
     * @since 1.0
     */
    	function generateWaffleChart() {
    		const graphContainer = d3.select(el);

    		// Adds graph.
    		let graph = graphContainer.append("svg").attr("width", width).attr("height", height + padding.top + 20);

    		let group = graph.append("g").attr("transform", "translate(" + padding.left + "," + padding.top + ")");
    		group.append("text").attr("class", "chart-label").text(totalItems + " cases");

    		for (let i = 0; i < totalCells; i++) {
    			group.append("circle").attr("aria-label", cellValue + ' cases').attr("class", "rect" + i).attr("cx", Math.floor(i / rows) * (cellSize + 1)).attr("cy", i % rows * (cellSize + 1) + 40).attr("r", cellSize / 2).attr("fill", colorScale(i)).attr("data-index", i);
    		}

    		// Adds legend.
    		const graphLegend = graphContainer.append("div").attr("class", "legend");

    		for (let i = 0; i < labels.length; i++) {
    			let legendCell = graphLegend.append("div").attr("class", "legend-key");
    			legendCell.append("span").attr("class", "legend-key-indicator").style("background-color", colors[i]).style("width", 0.75 * cellSize + "px").style("height", 0.75 * cellSize + "px");

    			legendCell.append("div").attr("class", "legend-key-label").text(function (d) {
    				return labels[i];
    			});
    		}

    		// Adds footnotes
    		if (0 < footnotes.length) {
    			const graphFootnotes = graphContainer.append("div").attr("class", "footnotes");

    			for (let i = 0; i < footnotes.length; i++) {
    				let footnote = graphFootnotes.append("div").attr("class", "footnote").append("small").attr("class", "footnote-body").text(function (d) {
    					return footnotes[i];
    				});
    			}
    		}
    	}

    	const writable_props = [
    		'data',
    		'width',
    		'groups',
    		'columns',
    		'isPercentage',
    		'colors',
    		'labels',
    		'footnotes',
    		'orientation'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chart_covid_variants> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(0, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('groups' in $$props) $$invalidate(3, groups = $$props.groups);
    		if ('columns' in $$props) $$invalidate(4, columns = $$props.columns);
    		if ('isPercentage' in $$props) $$invalidate(5, isPercentage = $$props.isPercentage);
    		if ('colors' in $$props) $$invalidate(6, colors = $$props.colors);
    		if ('labels' in $$props) $$invalidate(7, labels = $$props.labels);
    		if ('footnotes' in $$props) $$invalidate(8, footnotes = $$props.footnotes);
    		if ('orientation' in $$props) $$invalidate(9, orientation = $$props.orientation);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		scaleBand: band,
    		scaleLinear: linear$1,
    		scaleOrdinal: ordinal,
    		scaleQuantile: quantile,
    		scaleQuantize: quantize,
    		scaleThreshold: threshold$1,
    		axisBottom,
    		axisLeft,
    		axisRight,
    		axisTop,
    		select,
    		legendColor: color$1,
    		legendSize: size,
    		d3,
    		data,
    		width,
    		groups,
    		columns,
    		isPercentage,
    		colors,
    		labels,
    		footnotes,
    		orientation,
    		padding,
    		cellColors,
    		cellBounds,
    		totalItems,
    		totalCells,
    		cellValue,
    		cells,
    		numRows,
    		el,
    		cellSize,
    		generateWaffleChart,
    		colorScale,
    		rows,
    		height,
    		xScale
    	});

    	$$self.$inject_state = $$props => {
    		if ('d3' in $$props) $$invalidate(19, d3 = $$props.d3);
    		if ('data' in $$props) $$invalidate(1, data = $$props.data);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('groups' in $$props) $$invalidate(3, groups = $$props.groups);
    		if ('columns' in $$props) $$invalidate(4, columns = $$props.columns);
    		if ('isPercentage' in $$props) $$invalidate(5, isPercentage = $$props.isPercentage);
    		if ('colors' in $$props) $$invalidate(6, colors = $$props.colors);
    		if ('labels' in $$props) $$invalidate(7, labels = $$props.labels);
    		if ('footnotes' in $$props) $$invalidate(8, footnotes = $$props.footnotes);
    		if ('orientation' in $$props) $$invalidate(9, orientation = $$props.orientation);
    		if ('cellColors' in $$props) $$invalidate(21, cellColors = $$props.cellColors);
    		if ('cellBounds' in $$props) cellBounds = $$props.cellBounds;
    		if ('totalItems' in $$props) $$invalidate(10, totalItems = $$props.totalItems);
    		if ('totalCells' in $$props) totalCells = $$props.totalCells;
    		if ('cellValue' in $$props) cellValue = $$props.cellValue;
    		if ('cells' in $$props) $$invalidate(23, cells = $$props.cells);
    		if ('numRows' in $$props) $$invalidate(11, numRows = $$props.numRows);
    		if ('el' in $$props) $$invalidate(0, el = $$props.el);
    		if ('cellSize' in $$props) $$invalidate(24, cellSize = $$props.cellSize);
    		if ('colorScale' in $$props) colorScale = $$props.colorScale;
    		if ('rows' in $$props) $$invalidate(12, rows = $$props.rows);
    		if ('height' in $$props) height = $$props.height;
    		if ('xScale' in $$props) xScale = $$props.xScale;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*numRows*/ 2048) {
    			 $$invalidate(12, rows = numRows);
    		}

    		if ($$self.$$.dirty & /*rows*/ 4096) {
    			 height = rows * (cellSize + 1) * 1.25;
    		}

    		if ($$self.$$.dirty & /*totalItems, columns*/ 1040) {
    			 xScale = d3.scaleLinear().domain([0, totalItems]).range([0, columns * cellSize]);
    		}
    	};

    	 colorScale = d3.scaleQuantile().domain(cells).range(cellColors.splice(0, cells.length - 1));

    	return [
    		el,
    		data,
    		width,
    		groups,
    		columns,
    		isPercentage,
    		colors,
    		labels,
    		footnotes,
    		orientation,
    		totalItems,
    		numRows,
    		rows,
    		div_binding
    	];
    }

    class Chart_covid_variants extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			data: 1,
    			width: 2,
    			groups: 3,
    			columns: 4,
    			isPercentage: 5,
    			colors: 6,
    			labels: 7,
    			footnotes: 8,
    			orientation: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart_covid_variants",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get data() {
    		throw new Error("<Chart_covid_variants>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Chart_covid_variants>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Chart_covid_variants>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Chart_covid_variants>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groups() {
    		throw new Error("<Chart_covid_variants>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groups(value) {
    		throw new Error("<Chart_covid_variants>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get columns() {
    		throw new Error("<Chart_covid_variants>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<Chart_covid_variants>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPercentage() {
    		throw new Error("<Chart_covid_variants>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPercentage(value) {
    		throw new Error("<Chart_covid_variants>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colors() {
    		throw new Error("<Chart_covid_variants>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colors(value) {
    		throw new Error("<Chart_covid_variants>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labels() {
    		throw new Error("<Chart_covid_variants>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labels(value) {
    		throw new Error("<Chart_covid_variants>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get footnotes() {
    		throw new Error("<Chart_covid_variants>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set footnotes(value) {
    		throw new Error("<Chart_covid_variants>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orientation() {
    		throw new Error("<Chart_covid_variants>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orientation(value) {
    		throw new Error("<Chart_covid_variants>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var EOL = {},
        EOF = {},
        QUOTE = 34,
        NEWLINE = 10,
        RETURN = 13;

    function objectConverter(columns) {
      return new Function("d", "return {" + columns.map(function(name, i) {
        return JSON.stringify(name) + ": d[" + i + "] || \"\"";
      }).join(",") + "}");
    }

    function customConverter(columns, f) {
      var object = objectConverter(columns);
      return function(row, i) {
        return f(object(row), i, columns);
      };
    }

    // Compute unique columns in order of discovery.
    function inferColumns(rows) {
      var columnSet = Object.create(null),
          columns = [];

      rows.forEach(function(row) {
        for (var column in row) {
          if (!(column in columnSet)) {
            columns.push(columnSet[column] = column);
          }
        }
      });

      return columns;
    }

    function pad$1(value, width) {
      var s = value + "", length = s.length;
      return length < width ? new Array(width - length + 1).join(0) + s : s;
    }

    function formatYear$1(year) {
      return year < 0 ? "-" + pad$1(-year, 6)
        : year > 9999 ? "+" + pad$1(year, 6)
        : pad$1(year, 4);
    }

    function formatDate(date) {
      var hours = date.getUTCHours(),
          minutes = date.getUTCMinutes(),
          seconds = date.getUTCSeconds(),
          milliseconds = date.getUTCMilliseconds();
      return isNaN(date) ? "Invalid Date"
          : formatYear$1(date.getUTCFullYear()) + "-" + pad$1(date.getUTCMonth() + 1, 2) + "-" + pad$1(date.getUTCDate(), 2)
          + (milliseconds ? "T" + pad$1(hours, 2) + ":" + pad$1(minutes, 2) + ":" + pad$1(seconds, 2) + "." + pad$1(milliseconds, 3) + "Z"
          : seconds ? "T" + pad$1(hours, 2) + ":" + pad$1(minutes, 2) + ":" + pad$1(seconds, 2) + "Z"
          : minutes || hours ? "T" + pad$1(hours, 2) + ":" + pad$1(minutes, 2) + "Z"
          : "");
    }

    function dsvFormat(delimiter) {
      var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
          DELIMITER = delimiter.charCodeAt(0);

      function parse(text, f) {
        var convert, columns, rows = parseRows(text, function(row, i) {
          if (convert) return convert(row, i - 1);
          columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
        });
        rows.columns = columns || [];
        return rows;
      }

      function parseRows(text, f) {
        var rows = [], // output rows
            N = text.length,
            I = 0, // current character index
            n = 0, // current line number
            t, // current token
            eof = N <= 0, // current token followed by EOF?
            eol = false; // current token followed by EOL?

        // Strip the trailing newline.
        if (text.charCodeAt(N - 1) === NEWLINE) --N;
        if (text.charCodeAt(N - 1) === RETURN) --N;

        function token() {
          if (eof) return EOF;
          if (eol) return eol = false, EOL;

          // Unescape quotes.
          var i, j = I, c;
          if (text.charCodeAt(j) === QUOTE) {
            while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
            if ((i = I) >= N) eof = true;
            else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            return text.slice(j + 1, i - 1).replace(/""/g, "\"");
          }

          // Find next delimiter or newline.
          while (I < N) {
            if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
            else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
            else if (c !== DELIMITER) continue;
            return text.slice(j, i);
          }

          // Return last token before EOF.
          return eof = true, text.slice(j, N);
        }

        while ((t = token()) !== EOF) {
          var row = [];
          while (t !== EOL && t !== EOF) row.push(t), t = token();
          if (f && (row = f(row, n++)) == null) continue;
          rows.push(row);
        }

        return rows;
      }

      function preformatBody(rows, columns) {
        return rows.map(function(row) {
          return columns.map(function(column) {
            return formatValue(row[column]);
          }).join(delimiter);
        });
      }

      function format(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
      }

      function formatBody(rows, columns) {
        if (columns == null) columns = inferColumns(rows);
        return preformatBody(rows, columns).join("\n");
      }

      function formatRows(rows) {
        return rows.map(formatRow).join("\n");
      }

      function formatRow(row) {
        return row.map(formatValue).join(delimiter);
      }

      function formatValue(value) {
        return value == null ? ""
            : value instanceof Date ? formatDate(value)
            : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
            : value;
      }

      return {
        parse: parse,
        parseRows: parseRows,
        format: format,
        formatBody: formatBody,
        formatRows: formatRows,
        formatRow: formatRow,
        formatValue: formatValue
      };
    }

    var csv = dsvFormat(",");

    var csvParse = csv.parse;

    function responseText(response) {
      if (!response.ok) throw new Error(response.status + " " + response.statusText);
      return response.text();
    }

    function text$1(input, init) {
      return fetch(input, init).then(responseText);
    }

    function dsvParse(parse) {
      return function(input, init, row) {
        if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
        return text$1(input, init).then(function(response) {
          return parse(response, row);
        });
      };
    }

    var csv$1 = dsvParse(csvParse);

    function responseJson(response) {
      if (!response.ok) throw new Error(response.status + " " + response.statusText);
      if (response.status === 204 || response.status === 205) return;
      return response.json();
    }

    function json(input, init) {
      return fetch(input, init).then(responseJson);
    }

    // export const negativepositive = [
    //          "#88c7f0",
    //          "#D41B2C"
    //    ]
    const negativePositive = [
        "#9ebcda",
        "#6e016b"
    ];

    const getCalendarPage = (month, year, dayProps, weekStart = 0) => {
      let date = new Date(year, month, 1);
      date.setDate(date.getDate() - date.getDay() + weekStart);
      let nextMonth = month === 11 ? 0 : month + 1;
      // ensure days starts on Sunday
      // and end on saturday
      let weeks = [];
      while (date.getMonth() !== nextMonth || date.getDay() !== weekStart || weeks.length !== 6) {
        if (date.getDay() === weekStart) weeks.unshift({ days: [], id: `${year}${month}${year}${weeks.length}` });
        const updated = Object.assign({
          partOfMonth: date.getMonth() === month,
          day: date.getDate(),
          month: date.getMonth(),
          year: date.getFullYear(),
          date: new Date(date)
        }, dayProps(date));
        weeks[0].days.push(updated);
        date.setDate(date.getDate() + 1);
      }
      weeks.reverse();
      return { month, year, weeks };
    };

    const getDayPropsHandler = (start, end, selectableCallback) => {
      let today = new Date();
      today.setHours(0, 0, 0, 0);
      return date => {
        const isInRange = date >= start && date <= end;
        return {
          isInRange,
          selectable: isInRange && (!selectableCallback || selectableCallback(date)),
          isToday: date.getTime() === today.getTime()
        };
      };
    };

    function getMonths(start, end, selectableCallback = null, weekStart = 0) {
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      let endDate = new Date(end.getFullYear(), end.getMonth() + 1, 1);
      let months = [];
      let date = new Date(start.getFullYear(), start.getMonth(), 1);
      let dayPropsHandler = getDayPropsHandler(start, end, selectableCallback);
      while (date < endDate) {
        months.push(getCalendarPage(date.getMonth(), date.getFullYear(), dayPropsHandler, weekStart));
        date.setMonth(date.getMonth() + 1);
      }
      return months;
    }

    const areDatesEquivalent = (a, b) => a.getDate() === b.getDate()
      && a.getMonth() === b.getMonth()
      && a.getFullYear() === b.getFullYear();

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* node_modules/svelte-calendar/src/Components/Week.svelte generated by Svelte v3.42.1 */
    const file$9 = "node_modules/svelte-calendar/src/Components/Week.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (20:2) {#each days as day}
    function create_each_block$1(ctx) {
    	let div;
    	let button;
    	let t0_value = /*day*/ ctx[7].date.getDate() + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*day*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "day--label svelte-1f2gkwh");
    			attr_dev(button, "type", "button");
    			toggle_class(button, "selected", areDatesEquivalent(/*day*/ ctx[7].date, /*selected*/ ctx[1]));
    			toggle_class(button, "highlighted", areDatesEquivalent(/*day*/ ctx[7].date, /*highlighted*/ ctx[2]));
    			toggle_class(button, "shake-date", /*shouldShakeDate*/ ctx[3] && areDatesEquivalent(/*day*/ ctx[7].date, /*shouldShakeDate*/ ctx[3]));
    			toggle_class(button, "disabled", !/*day*/ ctx[7].selectable);
    			add_location(button, file$9, 26, 6, 652);
    			attr_dev(div, "class", "day svelte-1f2gkwh");
    			toggle_class(div, "outside-month", !/*day*/ ctx[7].partOfMonth);
    			toggle_class(div, "is-today", /*day*/ ctx[7].isToday);
    			toggle_class(div, "is-disabled", !/*day*/ ctx[7].selectable);
    			add_location(div, file$9, 20, 4, 493);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*days*/ 1 && t0_value !== (t0_value = /*day*/ ctx[7].date.getDate() + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*areDatesEquivalent, days, selected*/ 3) {
    				toggle_class(button, "selected", areDatesEquivalent(/*day*/ ctx[7].date, /*selected*/ ctx[1]));
    			}

    			if (dirty & /*areDatesEquivalent, days, highlighted*/ 5) {
    				toggle_class(button, "highlighted", areDatesEquivalent(/*day*/ ctx[7].date, /*highlighted*/ ctx[2]));
    			}

    			if (dirty & /*shouldShakeDate, areDatesEquivalent, days*/ 9) {
    				toggle_class(button, "shake-date", /*shouldShakeDate*/ ctx[3] && areDatesEquivalent(/*day*/ ctx[7].date, /*shouldShakeDate*/ ctx[3]));
    			}

    			if (dirty & /*days*/ 1) {
    				toggle_class(button, "disabled", !/*day*/ ctx[7].selectable);
    			}

    			if (dirty & /*days*/ 1) {
    				toggle_class(div, "outside-month", !/*day*/ ctx[7].partOfMonth);
    			}

    			if (dirty & /*days*/ 1) {
    				toggle_class(div, "is-today", /*day*/ ctx[7].isToday);
    			}

    			if (dirty & /*days*/ 1) {
    				toggle_class(div, "is-disabled", !/*day*/ ctx[7].selectable);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(20:2) {#each days as day}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;
    	let each_value = /*days*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "week svelte-1f2gkwh");
    			add_location(div, file$9, 14, 0, 341);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (dirty & /*days, areDatesEquivalent, selected, highlighted, shouldShakeDate, dispatch*/ 47) {
    				each_value = /*days*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			if (local) {
    				add_render_callback(() => {
    					if (div_outro) div_outro.end(1);

    					div_intro = create_in_transition(div, fly, {
    						x: /*direction*/ ctx[4] * 50,
    						duration: 180,
    						delay: 90
    					});

    					div_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, fade, { duration: 180 });
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Week', slots, []);
    	const dispatch = createEventDispatcher();
    	let { days } = $$props;
    	let { selected } = $$props;
    	let { highlighted } = $$props;
    	let { shouldShakeDate } = $$props;
    	let { direction } = $$props;
    	const writable_props = ['days', 'selected', 'highlighted', 'shouldShakeDate', 'direction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Week> was created with unknown prop '${key}'`);
    	});

    	const click_handler = day => dispatch('dateSelected', day.date);

    	$$self.$$set = $$props => {
    		if ('days' in $$props) $$invalidate(0, days = $$props.days);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(2, highlighted = $$props.highlighted);
    		if ('shouldShakeDate' in $$props) $$invalidate(3, shouldShakeDate = $$props.shouldShakeDate);
    		if ('direction' in $$props) $$invalidate(4, direction = $$props.direction);
    	};

    	$$self.$capture_state = () => ({
    		areDatesEquivalent,
    		fly,
    		fade,
    		createEventDispatcher,
    		dispatch,
    		days,
    		selected,
    		highlighted,
    		shouldShakeDate,
    		direction
    	});

    	$$self.$inject_state = $$props => {
    		if ('days' in $$props) $$invalidate(0, days = $$props.days);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(2, highlighted = $$props.highlighted);
    		if ('shouldShakeDate' in $$props) $$invalidate(3, shouldShakeDate = $$props.shouldShakeDate);
    		if ('direction' in $$props) $$invalidate(4, direction = $$props.direction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		days,
    		selected,
    		highlighted,
    		shouldShakeDate,
    		direction,
    		dispatch,
    		click_handler
    	];
    }

    class Week extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			days: 0,
    			selected: 1,
    			highlighted: 2,
    			shouldShakeDate: 3,
    			direction: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Week",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*days*/ ctx[0] === undefined && !('days' in props)) {
    			console.warn("<Week> was created without expected prop 'days'");
    		}

    		if (/*selected*/ ctx[1] === undefined && !('selected' in props)) {
    			console.warn("<Week> was created without expected prop 'selected'");
    		}

    		if (/*highlighted*/ ctx[2] === undefined && !('highlighted' in props)) {
    			console.warn("<Week> was created without expected prop 'highlighted'");
    		}

    		if (/*shouldShakeDate*/ ctx[3] === undefined && !('shouldShakeDate' in props)) {
    			console.warn("<Week> was created without expected prop 'shouldShakeDate'");
    		}

    		if (/*direction*/ ctx[4] === undefined && !('direction' in props)) {
    			console.warn("<Week> was created without expected prop 'direction'");
    		}
    	}

    	get days() {
    		throw new Error("<Week>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set days(value) {
    		throw new Error("<Week>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Week>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Week>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlighted() {
    		throw new Error("<Week>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<Week>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldShakeDate() {
    		throw new Error("<Week>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldShakeDate(value) {
    		throw new Error("<Week>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Week>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Week>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-calendar/src/Components/Month.svelte generated by Svelte v3.42.1 */
    const file$a = "node_modules/svelte-calendar/src/Components/Month.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (20:2) {#each visibleMonth.weeks as week (week.id) }
    function create_each_block$2(key_1, ctx) {
    	let first;
    	let week;
    	let current;

    	week = new Week({
    			props: {
    				days: /*week*/ ctx[8].days,
    				selected: /*selected*/ ctx[1],
    				highlighted: /*highlighted*/ ctx[2],
    				shouldShakeDate: /*shouldShakeDate*/ ctx[3],
    				direction: /*direction*/ ctx[4]
    			},
    			$$inline: true
    		});

    	week.$on("dateSelected", /*dateSelected_handler*/ ctx[7]);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(week.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(week, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const week_changes = {};
    			if (dirty & /*visibleMonth*/ 1) week_changes.days = /*week*/ ctx[8].days;
    			if (dirty & /*selected*/ 2) week_changes.selected = /*selected*/ ctx[1];
    			if (dirty & /*highlighted*/ 4) week_changes.highlighted = /*highlighted*/ ctx[2];
    			if (dirty & /*shouldShakeDate*/ 8) week_changes.shouldShakeDate = /*shouldShakeDate*/ ctx[3];
    			if (dirty & /*direction*/ 16) week_changes.direction = /*direction*/ ctx[4];
    			week.$set(week_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(week.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(week.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(week, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(20:2) {#each visibleMonth.weeks as week (week.id) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let div;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*visibleMonth*/ ctx[0].weeks;
    	validate_each_argument(each_value);
    	const get_key = ctx => /*week*/ ctx[8].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "month-container svelte-ny3kda");
    			add_location(div, file$a, 18, 0, 284);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*visibleMonth, selected, highlighted, shouldShakeDate, direction*/ 31) {
    				each_value = /*visibleMonth*/ ctx[0].weeks;
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div, outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Month', slots, []);
    	let { id } = $$props;
    	let { visibleMonth } = $$props;
    	let { selected } = $$props;
    	let { highlighted } = $$props;
    	let { shouldShakeDate } = $$props;
    	let lastId = id;
    	let direction;
    	const writable_props = ['id', 'visibleMonth', 'selected', 'highlighted', 'shouldShakeDate'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Month> was created with unknown prop '${key}'`);
    	});

    	function dateSelected_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(5, id = $$props.id);
    		if ('visibleMonth' in $$props) $$invalidate(0, visibleMonth = $$props.visibleMonth);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(2, highlighted = $$props.highlighted);
    		if ('shouldShakeDate' in $$props) $$invalidate(3, shouldShakeDate = $$props.shouldShakeDate);
    	};

    	$$self.$capture_state = () => ({
    		Week,
    		id,
    		visibleMonth,
    		selected,
    		highlighted,
    		shouldShakeDate,
    		lastId,
    		direction
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(5, id = $$props.id);
    		if ('visibleMonth' in $$props) $$invalidate(0, visibleMonth = $$props.visibleMonth);
    		if ('selected' in $$props) $$invalidate(1, selected = $$props.selected);
    		if ('highlighted' in $$props) $$invalidate(2, highlighted = $$props.highlighted);
    		if ('shouldShakeDate' in $$props) $$invalidate(3, shouldShakeDate = $$props.shouldShakeDate);
    		if ('lastId' in $$props) $$invalidate(6, lastId = $$props.lastId);
    		if ('direction' in $$props) $$invalidate(4, direction = $$props.direction);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*lastId, id*/ 96) {
    			 {
    				$$invalidate(4, direction = lastId < id ? 1 : -1);
    				$$invalidate(6, lastId = id);
    			}
    		}
    	};

    	return [
    		visibleMonth,
    		selected,
    		highlighted,
    		shouldShakeDate,
    		direction,
    		id,
    		lastId,
    		dateSelected_handler
    	];
    }

    class Month extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			id: 5,
    			visibleMonth: 0,
    			selected: 1,
    			highlighted: 2,
    			shouldShakeDate: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Month",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[5] === undefined && !('id' in props)) {
    			console.warn("<Month> was created without expected prop 'id'");
    		}

    		if (/*visibleMonth*/ ctx[0] === undefined && !('visibleMonth' in props)) {
    			console.warn("<Month> was created without expected prop 'visibleMonth'");
    		}

    		if (/*selected*/ ctx[1] === undefined && !('selected' in props)) {
    			console.warn("<Month> was created without expected prop 'selected'");
    		}

    		if (/*highlighted*/ ctx[2] === undefined && !('highlighted' in props)) {
    			console.warn("<Month> was created without expected prop 'highlighted'");
    		}

    		if (/*shouldShakeDate*/ ctx[3] === undefined && !('shouldShakeDate' in props)) {
    			console.warn("<Month> was created without expected prop 'shouldShakeDate'");
    		}
    	}

    	get id() {
    		throw new Error("<Month>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Month>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visibleMonth() {
    		throw new Error("<Month>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visibleMonth(value) {
    		throw new Error("<Month>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Month>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Month>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlighted() {
    		throw new Error("<Month>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<Month>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shouldShakeDate() {
    		throw new Error("<Month>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shouldShakeDate(value) {
    		throw new Error("<Month>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-calendar/src/Components/NavBar.svelte generated by Svelte v3.42.1 */

    const { Object: Object_1$1 } = globals;
    const file$b = "node_modules/svelte-calendar/src/Components/NavBar.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	child_ctx[17] = i;
    	return child_ctx;
    }

    // (64:4) {#each availableMonths as monthDefinition, index}
    function create_each_block$3(ctx) {
    	let div;
    	let span;
    	let t0_value = /*monthDefinition*/ ctx[15].abbrev + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler_2(...args) {
    		return /*click_handler_2*/ ctx[14](/*monthDefinition*/ ctx[15], /*index*/ ctx[17], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(span, "class", "svelte-1dqf106");
    			add_location(span, file$b, 70, 8, 1952);
    			attr_dev(div, "class", "month-selector--month svelte-1dqf106");
    			toggle_class(div, "selected", /*index*/ ctx[17] === /*month*/ ctx[0]);
    			toggle_class(div, "selectable", /*monthDefinition*/ ctx[15].selectable);
    			add_location(div, file$b, 64, 6, 1721);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			append_dev(span, t0);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*availableMonths*/ 64 && t0_value !== (t0_value = /*monthDefinition*/ ctx[15].abbrev + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*month*/ 1) {
    				toggle_class(div, "selected", /*index*/ ctx[17] === /*month*/ ctx[0]);
    			}

    			if (dirty & /*availableMonths*/ 64) {
    				toggle_class(div, "selectable", /*monthDefinition*/ ctx[15].selectable);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(64:4) {#each availableMonths as monthDefinition, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div5;
    	let div3;
    	let div0;
    	let i0;
    	let t0;
    	let div1;
    	let t1_value = /*monthsOfYear*/ ctx[4][/*month*/ ctx[0]][0] + "";
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let div2;
    	let i1;
    	let t5;
    	let div4;
    	let mounted;
    	let dispose;
    	let each_value = /*availableMonths*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			t0 = space();
    			div1 = element("div");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(/*year*/ ctx[1]);
    			t4 = space();
    			div2 = element("div");
    			i1 = element("i");
    			t5 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(i0, "class", "arrow left svelte-1dqf106");
    			add_location(i0, file$b, 51, 6, 1279);
    			attr_dev(div0, "class", "control svelte-1dqf106");
    			toggle_class(div0, "enabled", /*canDecrementMonth*/ ctx[3]);
    			add_location(div0, file$b, 48, 4, 1156);
    			attr_dev(div1, "class", "label svelte-1dqf106");
    			add_location(div1, file$b, 53, 4, 1321);
    			attr_dev(i1, "class", "arrow right svelte-1dqf106");
    			add_location(i1, file$b, 59, 6, 1551);
    			attr_dev(div2, "class", "control svelte-1dqf106");
    			toggle_class(div2, "enabled", /*canIncrementMonth*/ ctx[2]);
    			add_location(div2, file$b, 56, 4, 1430);
    			attr_dev(div3, "class", "heading-section svelte-1dqf106");
    			add_location(div3, file$b, 47, 2, 1122);
    			attr_dev(div4, "class", "month-selector svelte-1dqf106");
    			toggle_class(div4, "open", /*monthSelectorOpen*/ ctx[5]);
    			add_location(div4, file$b, 62, 2, 1601);
    			attr_dev(div5, "class", "title");
    			add_location(div5, file$b, 46, 0, 1100);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			append_dev(div0, i0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, i1);
    			append_dev(div5, t5);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div4, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*click_handler*/ ctx[12], false, false, false),
    					listen_dev(div1, "click", /*toggleMonthSelectorOpen*/ ctx[8], false, false, false),
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*canDecrementMonth*/ 8) {
    				toggle_class(div0, "enabled", /*canDecrementMonth*/ ctx[3]);
    			}

    			if (dirty & /*monthsOfYear, month*/ 17 && t1_value !== (t1_value = /*monthsOfYear*/ ctx[4][/*month*/ ctx[0]][0] + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*year*/ 2) set_data_dev(t3, /*year*/ ctx[1]);

    			if (dirty & /*canIncrementMonth*/ 4) {
    				toggle_class(div2, "enabled", /*canIncrementMonth*/ ctx[2]);
    			}

    			if (dirty & /*month, availableMonths, monthSelected*/ 577) {
    				each_value = /*availableMonths*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div4, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty & /*monthSelectorOpen*/ 32) {
    				toggle_class(div4, "open", /*monthSelectorOpen*/ ctx[5]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavBar', slots, []);
    	const dispatch = createEventDispatcher();
    	let { month } = $$props;
    	let { year } = $$props;
    	let { start } = $$props;
    	let { end } = $$props;
    	let { canIncrementMonth } = $$props;
    	let { canDecrementMonth } = $$props;
    	let { monthsOfYear } = $$props;
    	let monthSelectorOpen = false;
    	let availableMonths;

    	function toggleMonthSelectorOpen() {
    		$$invalidate(5, monthSelectorOpen = !monthSelectorOpen);
    	}

    	function monthSelected(event, { m, i }) {
    		event.stopPropagation();
    		if (!m.selectable) return;
    		dispatch('monthSelected', i);
    		toggleMonthSelectorOpen();
    	}

    	const writable_props = [
    		'month',
    		'year',
    		'start',
    		'end',
    		'canIncrementMonth',
    		'canDecrementMonth',
    		'monthsOfYear'
    	];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavBar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch('incrementMonth', -1);
    	const click_handler_1 = () => dispatch('incrementMonth', 1);
    	const click_handler_2 = (monthDefinition, index, e) => monthSelected(e, { m: monthDefinition, i: index });

    	$$self.$$set = $$props => {
    		if ('month' in $$props) $$invalidate(0, month = $$props.month);
    		if ('year' in $$props) $$invalidate(1, year = $$props.year);
    		if ('start' in $$props) $$invalidate(10, start = $$props.start);
    		if ('end' in $$props) $$invalidate(11, end = $$props.end);
    		if ('canIncrementMonth' in $$props) $$invalidate(2, canIncrementMonth = $$props.canIncrementMonth);
    		if ('canDecrementMonth' in $$props) $$invalidate(3, canDecrementMonth = $$props.canDecrementMonth);
    		if ('monthsOfYear' in $$props) $$invalidate(4, monthsOfYear = $$props.monthsOfYear);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		month,
    		year,
    		start,
    		end,
    		canIncrementMonth,
    		canDecrementMonth,
    		monthsOfYear,
    		monthSelectorOpen,
    		availableMonths,
    		toggleMonthSelectorOpen,
    		monthSelected
    	});

    	$$self.$inject_state = $$props => {
    		if ('month' in $$props) $$invalidate(0, month = $$props.month);
    		if ('year' in $$props) $$invalidate(1, year = $$props.year);
    		if ('start' in $$props) $$invalidate(10, start = $$props.start);
    		if ('end' in $$props) $$invalidate(11, end = $$props.end);
    		if ('canIncrementMonth' in $$props) $$invalidate(2, canIncrementMonth = $$props.canIncrementMonth);
    		if ('canDecrementMonth' in $$props) $$invalidate(3, canDecrementMonth = $$props.canDecrementMonth);
    		if ('monthsOfYear' in $$props) $$invalidate(4, monthsOfYear = $$props.monthsOfYear);
    		if ('monthSelectorOpen' in $$props) $$invalidate(5, monthSelectorOpen = $$props.monthSelectorOpen);
    		if ('availableMonths' in $$props) $$invalidate(6, availableMonths = $$props.availableMonths);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*start, year, end, monthsOfYear*/ 3090) {
    			 {
    				let isOnLowerBoundary = start.getFullYear() === year;
    				let isOnUpperBoundary = end.getFullYear() === year;

    				$$invalidate(6, availableMonths = monthsOfYear.map((m, i) => {
    					return Object.assign({}, { name: m[0], abbrev: m[1] }, {
    						selectable: !isOnLowerBoundary && !isOnUpperBoundary || (!isOnLowerBoundary || i >= start.getMonth()) && (!isOnUpperBoundary || i <= end.getMonth())
    					});
    				}));
    			}
    		}
    	};

    	return [
    		month,
    		year,
    		canIncrementMonth,
    		canDecrementMonth,
    		monthsOfYear,
    		monthSelectorOpen,
    		availableMonths,
    		dispatch,
    		toggleMonthSelectorOpen,
    		monthSelected,
    		start,
    		end,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class NavBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			month: 0,
    			year: 1,
    			start: 10,
    			end: 11,
    			canIncrementMonth: 2,
    			canDecrementMonth: 3,
    			monthsOfYear: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavBar",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*month*/ ctx[0] === undefined && !('month' in props)) {
    			console.warn("<NavBar> was created without expected prop 'month'");
    		}

    		if (/*year*/ ctx[1] === undefined && !('year' in props)) {
    			console.warn("<NavBar> was created without expected prop 'year'");
    		}

    		if (/*start*/ ctx[10] === undefined && !('start' in props)) {
    			console.warn("<NavBar> was created without expected prop 'start'");
    		}

    		if (/*end*/ ctx[11] === undefined && !('end' in props)) {
    			console.warn("<NavBar> was created without expected prop 'end'");
    		}

    		if (/*canIncrementMonth*/ ctx[2] === undefined && !('canIncrementMonth' in props)) {
    			console.warn("<NavBar> was created without expected prop 'canIncrementMonth'");
    		}

    		if (/*canDecrementMonth*/ ctx[3] === undefined && !('canDecrementMonth' in props)) {
    			console.warn("<NavBar> was created without expected prop 'canDecrementMonth'");
    		}

    		if (/*monthsOfYear*/ ctx[4] === undefined && !('monthsOfYear' in props)) {
    			console.warn("<NavBar> was created without expected prop 'monthsOfYear'");
    		}
    	}

    	get month() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set month(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get year() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set year(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canIncrementMonth() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canIncrementMonth(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get canDecrementMonth() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set canDecrementMonth(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get monthsOfYear() {
    		throw new Error("<NavBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set monthsOfYear(value) {
    		throw new Error("<NavBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-calendar/src/Components/Popover.svelte generated by Svelte v3.42.1 */

    const { window: window_1 } = globals;
    const file$c = "node_modules/svelte-calendar/src/Components/Popover.svelte";
    const get_contents_slot_changes = dirty => ({});
    const get_contents_slot_context = ctx => ({});
    const get_trigger_slot_changes = dirty => ({});
    const get_trigger_slot_context = ctx => ({});

    function create_fragment$c(ctx) {
    	let div4;
    	let div0;
    	let t;
    	let div3;
    	let div2;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowresize*/ ctx[14]);
    	const trigger_slot_template = /*#slots*/ ctx[13].trigger;
    	const trigger_slot = create_slot(trigger_slot_template, ctx, /*$$scope*/ ctx[12], get_trigger_slot_context);
    	const contents_slot_template = /*#slots*/ ctx[13].contents;
    	const contents_slot = create_slot(contents_slot_template, ctx, /*$$scope*/ ctx[12], get_contents_slot_context);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			if (trigger_slot) trigger_slot.c();
    			t = space();
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			if (contents_slot) contents_slot.c();
    			attr_dev(div0, "class", "trigger");
    			add_location(div0, file$c, 103, 2, 2358);
    			attr_dev(div1, "class", "contents-inner svelte-mc1z8c");
    			add_location(div1, file$c, 114, 6, 2745);
    			attr_dev(div2, "class", "contents svelte-mc1z8c");
    			add_location(div2, file$c, 113, 4, 2687);
    			attr_dev(div3, "class", "contents-wrapper svelte-mc1z8c");
    			set_style(div3, "transform", "translate(-50%,-50%) translate(" + /*translateX*/ ctx[8] + "px, " + /*translateY*/ ctx[7] + "px)");
    			toggle_class(div3, "visible", /*open*/ ctx[0]);
    			toggle_class(div3, "shrink", /*shrink*/ ctx[1]);
    			add_location(div3, file$c, 107, 2, 2476);
    			attr_dev(div4, "class", "sc-popover svelte-mc1z8c");
    			add_location(div4, file$c, 102, 0, 2311);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);

    			if (trigger_slot) {
    				trigger_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[15](div0);
    			append_dev(div4, t);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			if (contents_slot) {
    				contents_slot.m(div1, null);
    			}

    			/*div2_binding*/ ctx[16](div2);
    			/*div3_binding*/ ctx[17](div3);
    			/*div4_binding*/ ctx[18](div4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "resize", /*onwindowresize*/ ctx[14]),
    					listen_dev(div0, "click", /*doOpen*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (trigger_slot) {
    				if (trigger_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						trigger_slot,
    						trigger_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(trigger_slot_template, /*$$scope*/ ctx[12], dirty, get_trigger_slot_changes),
    						get_trigger_slot_context
    					);
    				}
    			}

    			if (contents_slot) {
    				if (contents_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						contents_slot,
    						contents_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(contents_slot_template, /*$$scope*/ ctx[12], dirty, get_contents_slot_changes),
    						get_contents_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*translateX, translateY*/ 384) {
    				set_style(div3, "transform", "translate(-50%,-50%) translate(" + /*translateX*/ ctx[8] + "px, " + /*translateY*/ ctx[7] + "px)");
    			}

    			if (dirty & /*open*/ 1) {
    				toggle_class(div3, "visible", /*open*/ ctx[0]);
    			}

    			if (dirty & /*shrink*/ 2) {
    				toggle_class(div3, "shrink", /*shrink*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(trigger_slot, local);
    			transition_in(contents_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(trigger_slot, local);
    			transition_out(contents_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (trigger_slot) trigger_slot.d(detaching);
    			/*div0_binding*/ ctx[15](null);
    			if (contents_slot) contents_slot.d(detaching);
    			/*div2_binding*/ ctx[16](null);
    			/*div3_binding*/ ctx[17](null);
    			/*div4_binding*/ ctx[18](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Popover', slots, ['trigger','contents']);
    	const dispatch = createEventDispatcher();

    	let once = (el, evt, cb) => {
    		function handler() {
    			cb.apply(this, arguments);
    			el.removeEventListener(evt, handler);
    		}

    		el.addEventListener(evt, handler);
    	};

    	let popover;
    	let w;
    	let triggerContainer;
    	let contentsAnimated;
    	let contentsWrapper;
    	let translateY = 0;
    	let translateX = 0;
    	let { open = false } = $$props;
    	let { shrink } = $$props;
    	let { trigger } = $$props;

    	const close = () => {
    		$$invalidate(1, shrink = true);

    		once(contentsAnimated, 'animationend', () => {
    			$$invalidate(1, shrink = false);
    			$$invalidate(0, open = false);
    			dispatch('closed');
    		});
    	};

    	function checkForFocusLoss(evt) {
    		if (!open) return;
    		let el = evt.target;

    		// eslint-disable-next-line
    		do {
    			if (el === popover) return;
    		} while (el = el.parentNode); // eslint-disable-next-line

    		close();
    	}

    	onMount(() => {
    		document.addEventListener('click', checkForFocusLoss);
    		if (!trigger) return;
    		triggerContainer.appendChild(trigger.parentNode.removeChild(trigger));

    		// eslint-disable-next-line
    		return () => {
    			document.removeEventListener('click', checkForFocusLoss);
    		};
    	});

    	const getDistanceToEdges = async () => {
    		if (!open) {
    			$$invalidate(0, open = true);
    		}

    		await tick();
    		let rect = contentsWrapper.getBoundingClientRect();

    		return {
    			top: rect.top + -1 * translateY,
    			bottom: window.innerHeight - rect.bottom + translateY,
    			left: rect.left + -1 * translateX,
    			right: document.body.clientWidth - rect.right + translateX
    		};
    	};

    	const getTranslate = async () => {
    		let dist = await getDistanceToEdges();
    		let x;
    		let y;

    		if (w < 480) {
    			y = dist.bottom;
    		} else if (dist.top < 0) {
    			y = Math.abs(dist.top);
    		} else if (dist.bottom < 0) {
    			y = dist.bottom;
    		} else {
    			y = 0;
    		}

    		if (dist.left < 0) {
    			x = Math.abs(dist.left);
    		} else if (dist.right < 0) {
    			x = dist.right;
    		} else {
    			x = 0;
    		}

    		return { x, y };
    	};

    	const doOpen = async () => {
    		const { x, y } = await getTranslate();
    		$$invalidate(8, translateX = x);
    		$$invalidate(7, translateY = y);
    		$$invalidate(0, open = true);
    		dispatch('opened');
    	};

    	const writable_props = ['open', 'shrink', 'trigger'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Popover> was created with unknown prop '${key}'`);
    	});

    	function onwindowresize() {
    		$$invalidate(3, w = window_1.innerWidth);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			triggerContainer = $$value;
    			$$invalidate(4, triggerContainer);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contentsAnimated = $$value;
    			$$invalidate(5, contentsAnimated);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contentsWrapper = $$value;
    			$$invalidate(6, contentsWrapper);
    		});
    	}

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			popover = $$value;
    			$$invalidate(2, popover);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('shrink' in $$props) $$invalidate(1, shrink = $$props.shrink);
    		if ('trigger' in $$props) $$invalidate(10, trigger = $$props.trigger);
    		if ('$$scope' in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		tick,
    		dispatch,
    		once,
    		popover,
    		w,
    		triggerContainer,
    		contentsAnimated,
    		contentsWrapper,
    		translateY,
    		translateX,
    		open,
    		shrink,
    		trigger,
    		close,
    		checkForFocusLoss,
    		getDistanceToEdges,
    		getTranslate,
    		doOpen
    	});

    	$$self.$inject_state = $$props => {
    		if ('once' in $$props) once = $$props.once;
    		if ('popover' in $$props) $$invalidate(2, popover = $$props.popover);
    		if ('w' in $$props) $$invalidate(3, w = $$props.w);
    		if ('triggerContainer' in $$props) $$invalidate(4, triggerContainer = $$props.triggerContainer);
    		if ('contentsAnimated' in $$props) $$invalidate(5, contentsAnimated = $$props.contentsAnimated);
    		if ('contentsWrapper' in $$props) $$invalidate(6, contentsWrapper = $$props.contentsWrapper);
    		if ('translateY' in $$props) $$invalidate(7, translateY = $$props.translateY);
    		if ('translateX' in $$props) $$invalidate(8, translateX = $$props.translateX);
    		if ('open' in $$props) $$invalidate(0, open = $$props.open);
    		if ('shrink' in $$props) $$invalidate(1, shrink = $$props.shrink);
    		if ('trigger' in $$props) $$invalidate(10, trigger = $$props.trigger);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		open,
    		shrink,
    		popover,
    		w,
    		triggerContainer,
    		contentsAnimated,
    		contentsWrapper,
    		translateY,
    		translateX,
    		doOpen,
    		trigger,
    		close,
    		$$scope,
    		slots,
    		onwindowresize,
    		div0_binding,
    		div2_binding,
    		div3_binding,
    		div4_binding
    	];
    }

    class Popover extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			open: 0,
    			shrink: 1,
    			trigger: 10,
    			close: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Popover",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*shrink*/ ctx[1] === undefined && !('shrink' in props)) {
    			console.warn("<Popover> was created without expected prop 'shrink'");
    		}

    		if (/*trigger*/ ctx[10] === undefined && !('trigger' in props)) {
    			console.warn("<Popover> was created without expected prop 'trigger'");
    		}
    	}

    	get open() {
    		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shrink() {
    		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shrink(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trigger() {
    		throw new Error("<Popover>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trigger(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		return this.$$.ctx[11];
    	}

    	set close(value) {
    		throw new Error("<Popover>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * generic function to inject data into token-laden string
     * @param str {String} Required
     * @param name {String} Required
     * @param value {String|Integer} Required
     * @returns {String}
     *
     * @example
     * injectStringData("The following is a token: #{tokenName}", "tokenName", 123); 
     * @returns {String} "The following is a token: 123"
     *
     */
    const injectStringData = (str,name,value) => str
      .replace(new RegExp('#{'+name+'}','g'), value);

    /**
     * Generic function to enforce length of string. 
     * 
     * Pass a string or number to this function and specify the desired length.
     * This function will either pad the # with leading 0's (if str.length < length)
     * or remove data from the end (@fromBack==false) or beginning (@fromBack==true)
     * of the string when str.length > length.
     *
     * When length == str.length or typeof length == 'undefined', this function
     * returns the original @str parameter.
     * 
     * @param str {String} Required
     * @param length {Integer} Required
     * @param fromBack {Boolean} Optional
     * @returns {String}
     *
     */
    const enforceLength = function(str,length,fromBack) {
      str = str.toString();
      if(typeof length == 'undefined') return str;
      if(str.length == length) return str;
      fromBack = (typeof fromBack == 'undefined') ? false : fromBack;
      if(str.length < length) {
        // pad the beginning of the string w/ enough 0's to reach desired length:
        while(length - str.length > 0) str = '0' + str;
      } else if(str.length > length) {
        if(fromBack) {
          // grab the desired #/chars from end of string: ex: '2015' -> '15'
          str = str.substring(str.length-length);
        } else {
          // grab the desired #/chars from beginning of string: ex: '2015' -> '20'
          str = str.substring(0,length);
        }
      }
      return str;
    };

    const daysOfWeek = [ 
      [ 'Sunday', 'Sun' ],
      [ 'Monday', 'Mon' ],
      [ 'Tuesday', 'Tue' ],
      [ 'Wednesday', 'Wed' ],
      [ 'Thursday', 'Thu' ],
      [ 'Friday', 'Fri' ],
      [ 'Saturday', 'Sat' ]
    ];

    const monthsOfYear = [ 
      [ 'January', 'Jan' ],
      [ 'February', 'Feb' ],
      [ 'March', 'Mar' ],
      [ 'April', 'Apr' ],
      [ 'May', 'May' ],
      [ 'June', 'Jun' ],
      [ 'July', 'Jul' ],
      [ 'August', 'Aug' ],
      [ 'September', 'Sep' ],
      [ 'October', 'Oct' ],
      [ 'November', 'Nov' ],
      [ 'December', 'Dec' ]
    ];

    let dictionary = { 
      daysOfWeek, 
      monthsOfYear
    };

    const extendDictionary = (conf) => 
      Object.keys(conf).forEach(key => {
        if(dictionary[key] && dictionary[key].length == conf[key].length) {
          dictionary[key] = conf[key];
        }
      });

    var acceptedDateTokens = [
      { 
        // d: day of the month, 2 digits with leading zeros:
        key: 'd', 
        method: function(date) { return enforceLength(date.getDate(), 2); } 
      }, { 
        // D: textual representation of day, 3 letters: Sun thru Sat
        key: 'D', 
        method: function(date) { return dictionary.daysOfWeek[date.getDay()][1]; } 
      }, { 
        // j: day of month without leading 0's
        key: 'j', 
        method: function(date) { return date.getDate(); } 
      }, { 
        // l: full textual representation of day of week: Sunday thru Saturday
        key: 'l', 
        method: function(date) { return dictionary.daysOfWeek[date.getDay()][0]; } 
      }, { 
        // F: full text month: 'January' thru 'December'
        key: 'F', 
        method: function(date) { return dictionary.monthsOfYear[date.getMonth()][0]; } 
      }, { 
        // m: 2 digit numeric month: '01' - '12':
        key: 'm', 
        method: function(date) { return enforceLength(date.getMonth()+1,2); } 
      }, { 
        // M: a short textual representation of the month, 3 letters: 'Jan' - 'Dec'
        key: 'M', 
        method: function(date) { return dictionary.monthsOfYear[date.getMonth()][1]; } 
      }, { 
        // n: numeric represetation of month w/o leading 0's, '1' - '12':
        key: 'n', 
        method: function(date) { return date.getMonth() + 1; } 
      }, { 
        // Y: Full numeric year, 4 digits
        key: 'Y', 
        method: function(date) { return date.getFullYear(); } 
      }, { 
        // y: 2 digit numeric year:
        key: 'y', 
        method: function(date) { return enforceLength(date.getFullYear(),2,true); }
       }
    ];

    var acceptedTimeTokens = [
      { 
        // a: lowercase ante meridiem and post meridiem 'am' or 'pm'
        key: 'a', 
        method: function(date) { return (date.getHours() > 11) ? 'pm' : 'am'; } 
      }, { 
        // A: uppercase ante merdiiem and post meridiem 'AM' or 'PM'
        key: 'A', 
        method: function(date) { return (date.getHours() > 11) ? 'PM' : 'AM'; } 
      }, { 
        // g: 12-hour format of an hour without leading zeros 1-12
        key: 'g', 
        method: function(date) { return date.getHours() % 12 || 12; } 
      }, { 
        // G: 24-hour format of an hour without leading zeros 0-23
        key: 'G', 
        method: function(date) { return date.getHours(); } 
      }, { 
        // h: 12-hour format of an hour with leading zeros 01-12
        key: 'h', 
        method: function(date) { return enforceLength(date.getHours()%12 || 12,2); } 
      }, { 
        // H: 24-hour format of an hour with leading zeros: 00-23
        key: 'H', 
        method: function(date) { return enforceLength(date.getHours(),2); } 
      }, { 
        // i: Minutes with leading zeros 00-59
        key: 'i', 
        method: function(date) { return enforceLength(date.getMinutes(),2); } 
      }, { 
        // s: Seconds with leading zeros 00-59
        key: 's', 
        method: function(date) { return enforceLength(date.getSeconds(),2); }
       }
    ];

    /**
     * Internationalization object for timeUtils.internationalize().
     * @typedef internationalizeObj
     * @property {Array} [daysOfWeek=[ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]] daysOfWeek Weekday labels as strings, starting with Sunday.
     * @property {Array} [monthsOfYear=[ 'January','February','March','April','May','June','July','August','September','October','November','December' ]] monthsOfYear Month labels as strings, starting with January.
     */

    /**
     * This function can be used to support additional languages by passing an object with 
     * `daysOfWeek` and `monthsOfYear` attributes.  Each attribute should be an array of
     * strings (ex: `daysOfWeek: ['monday', 'tuesday', 'wednesday'...]`)
     *
     * @param {internationalizeObj} conf
     */
    const internationalize = (conf={}) => { 
      extendDictionary(conf);
    };

    /**
     * generic formatDate function which accepts dynamic templates
     * @param date {Date} Required
     * @param template {String} Optional
     * @returns {String}
     *
     * @example
     * formatDate(new Date(), '#{M}. #{j}, #{Y}')
     * @returns {Number} Returns a formatted date
     *
     */
    const formatDate$1 = (date,template='#{m}/#{d}/#{Y}') => {
      acceptedDateTokens.forEach(token => {
        if(template.indexOf(`#{${token.key}}`) == -1) return; 
        template = injectStringData(template,token.key,token.method(date));
      }); 
      acceptedTimeTokens.forEach(token => {
        if(template.indexOf(`#{${token.key}}`) == -1) return;
        template = injectStringData(template,token.key,token.method(date));
      });
      return template;
    };

    const keyCodes = {
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      pgup: 33,
      pgdown: 34,
      enter: 13,
      escape: 27,
      tab: 9
    };

    const keyCodesArray = Object.keys(keyCodes).map(k => keyCodes[k]);

    /* node_modules/svelte-calendar/src/Components/Datepicker.svelte generated by Svelte v3.42.1 */
    const file$d = "node_modules/svelte-calendar/src/Components/Datepicker.svelte";

    const get_default_slot_changes = dirty => ({
    	selected: dirty[0] & /*selected*/ 1,
    	formattedSelected: dirty[0] & /*formattedSelected*/ 4
    });

    const get_default_slot_context = ctx => ({
    	selected: /*selected*/ ctx[0],
    	formattedSelected: /*formattedSelected*/ ctx[2]
    });

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[63] = list[i];
    	return child_ctx;
    }

    // (277:8) {#if !trigger}
    function create_if_block$1(ctx) {
    	let button;
    	let t;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*formattedSelected*/ ctx[2]);
    			attr_dev(button, "class", "calendar-button svelte-1lorc63");
    			attr_dev(button, "type", "button");
    			add_location(button, file$d, 277, 8, 7754);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*formattedSelected*/ 4) set_data_dev(t, /*formattedSelected*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(277:8) {#if !trigger}",
    		ctx
    	});

    	return block;
    }

    // (276:43)          
    function fallback_block$1(ctx) {
    	let if_block_anchor;
    	let if_block = !/*trigger*/ ctx[1] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*trigger*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(276:43)          ",
    		ctx
    	});

    	return block;
    }

    // (275:4) 
    function create_trigger_slot(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[40].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[47], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(div, "slot", "trigger");
    			attr_dev(div, "class", "svelte-1lorc63");
    			add_location(div, file$d, 274, 4, 7658);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*selected, formattedSelected*/ 5 | dirty[1] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[47],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[47])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[47], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty[0] & /*formattedSelected, trigger*/ 6)) {
    					default_slot_or_fallback.p(ctx, !current ? [-1, -1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_trigger_slot.name,
    		type: "slot",
    		source: "(275:4) ",
    		ctx
    	});

    	return block;
    }

    // (298:10) {#each sortedDaysOfWeek as day}
    function create_each_block$4(ctx) {
    	let span;
    	let t_value = /*day*/ ctx[63][1] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "svelte-1lorc63");
    			add_location(span, file$d, 298, 10, 8321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(298:10) {#each sortedDaysOfWeek as day}",
    		ctx
    	});

    	return block;
    }

    // (284:4) 
    function create_contents_slot(ctx) {
    	let div2;
    	let div1;
    	let navbar;
    	let t0;
    	let div0;
    	let t1;
    	let month_1;
    	let current;

    	navbar = new NavBar({
    			props: {
    				month: /*month*/ ctx[6],
    				year: /*year*/ ctx[7],
    				canIncrementMonth: /*canIncrementMonth*/ ctx[15],
    				canDecrementMonth: /*canDecrementMonth*/ ctx[14],
    				start: /*start*/ ctx[3],
    				end: /*end*/ ctx[4],
    				monthsOfYear: /*monthsOfYear*/ ctx[5]
    			},
    			$$inline: true
    		});

    	navbar.$on("monthSelected", /*monthSelected_handler*/ ctx[41]);
    	navbar.$on("incrementMonth", /*incrementMonth_handler*/ ctx[42]);
    	let each_value = /*sortedDaysOfWeek*/ ctx[18];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	month_1 = new Month({
    			props: {
    				visibleMonth: /*visibleMonth*/ ctx[8],
    				selected: /*selected*/ ctx[0],
    				highlighted: /*highlighted*/ ctx[10],
    				shouldShakeDate: /*shouldShakeDate*/ ctx[11],
    				id: /*visibleMonthId*/ ctx[17]
    			},
    			$$inline: true
    		});

    	month_1.$on("dateSelected", /*dateSelected_handler*/ ctx[43]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			create_component(navbar.$$.fragment);
    			t0 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t1 = space();
    			create_component(month_1.$$.fragment);
    			attr_dev(div0, "class", "legend svelte-1lorc63");
    			add_location(div0, file$d, 296, 8, 8248);
    			attr_dev(div1, "class", "calendar svelte-1lorc63");
    			add_location(div1, file$d, 284, 6, 7920);
    			attr_dev(div2, "slot", "contents");
    			attr_dev(div2, "class", "svelte-1lorc63");
    			add_location(div2, file$d, 283, 4, 7892);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			mount_component(navbar, div1, null);
    			append_dev(div1, t0);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t1);
    			mount_component(month_1, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const navbar_changes = {};
    			if (dirty[0] & /*month*/ 64) navbar_changes.month = /*month*/ ctx[6];
    			if (dirty[0] & /*year*/ 128) navbar_changes.year = /*year*/ ctx[7];
    			if (dirty[0] & /*canIncrementMonth*/ 32768) navbar_changes.canIncrementMonth = /*canIncrementMonth*/ ctx[15];
    			if (dirty[0] & /*canDecrementMonth*/ 16384) navbar_changes.canDecrementMonth = /*canDecrementMonth*/ ctx[14];
    			if (dirty[0] & /*start*/ 8) navbar_changes.start = /*start*/ ctx[3];
    			if (dirty[0] & /*end*/ 16) navbar_changes.end = /*end*/ ctx[4];
    			if (dirty[0] & /*monthsOfYear*/ 32) navbar_changes.monthsOfYear = /*monthsOfYear*/ ctx[5];
    			navbar.$set(navbar_changes);

    			if (dirty[0] & /*sortedDaysOfWeek*/ 262144) {
    				each_value = /*sortedDaysOfWeek*/ ctx[18];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const month_1_changes = {};
    			if (dirty[0] & /*visibleMonth*/ 256) month_1_changes.visibleMonth = /*visibleMonth*/ ctx[8];
    			if (dirty[0] & /*selected*/ 1) month_1_changes.selected = /*selected*/ ctx[0];
    			if (dirty[0] & /*highlighted*/ 1024) month_1_changes.highlighted = /*highlighted*/ ctx[10];
    			if (dirty[0] & /*shouldShakeDate*/ 2048) month_1_changes.shouldShakeDate = /*shouldShakeDate*/ ctx[11];
    			if (dirty[0] & /*visibleMonthId*/ 131072) month_1_changes.id = /*visibleMonthId*/ ctx[17];
    			month_1.$set(month_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(month_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(month_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(navbar);
    			destroy_each(each_blocks, detaching);
    			destroy_component(month_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_contents_slot.name,
    		type: "slot",
    		source: "(284:4) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div;
    	let popover_1;
    	let updating_open;
    	let updating_shrink;
    	let current;

    	function popover_1_open_binding(value) {
    		/*popover_1_open_binding*/ ctx[45](value);
    	}

    	function popover_1_shrink_binding(value) {
    		/*popover_1_shrink_binding*/ ctx[46](value);
    	}

    	let popover_1_props = {
    		trigger: /*trigger*/ ctx[1],
    		$$slots: {
    			contents: [create_contents_slot],
    			trigger: [create_trigger_slot]
    		},
    		$$scope: { ctx }
    	};

    	if (/*isOpen*/ ctx[12] !== void 0) {
    		popover_1_props.open = /*isOpen*/ ctx[12];
    	}

    	if (/*isClosing*/ ctx[13] !== void 0) {
    		popover_1_props.shrink = /*isClosing*/ ctx[13];
    	}

    	popover_1 = new Popover({ props: popover_1_props, $$inline: true });
    	/*popover_1_binding*/ ctx[44](popover_1);
    	binding_callbacks.push(() => bind(popover_1, 'open', popover_1_open_binding));
    	binding_callbacks.push(() => bind(popover_1, 'shrink', popover_1_shrink_binding));
    	popover_1.$on("opened", /*registerOpen*/ ctx[23]);
    	popover_1.$on("closed", /*registerClose*/ ctx[22]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(popover_1.$$.fragment);
    			attr_dev(div, "class", "datepicker svelte-1lorc63");
    			attr_dev(div, "style", /*wrapperStyle*/ ctx[16]);
    			toggle_class(div, "open", /*isOpen*/ ctx[12]);
    			toggle_class(div, "closing", /*isClosing*/ ctx[13]);
    			add_location(div, file$d, 260, 0, 7376);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(popover_1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const popover_1_changes = {};
    			if (dirty[0] & /*trigger*/ 2) popover_1_changes.trigger = /*trigger*/ ctx[1];

    			if (dirty[0] & /*visibleMonth, selected, highlighted, shouldShakeDate, visibleMonthId, month, year, canIncrementMonth, canDecrementMonth, start, end, monthsOfYear, formattedSelected, trigger*/ 183807 | dirty[1] & /*$$scope*/ 65536) {
    				popover_1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty[0] & /*isOpen*/ 4096) {
    				updating_open = true;
    				popover_1_changes.open = /*isOpen*/ ctx[12];
    				add_flush_callback(() => updating_open = false);
    			}

    			if (!updating_shrink && dirty[0] & /*isClosing*/ 8192) {
    				updating_shrink = true;
    				popover_1_changes.shrink = /*isClosing*/ ctx[13];
    				add_flush_callback(() => updating_shrink = false);
    			}

    			popover_1.$set(popover_1_changes);

    			if (!current || dirty[0] & /*wrapperStyle*/ 65536) {
    				attr_dev(div, "style", /*wrapperStyle*/ ctx[16]);
    			}

    			if (dirty[0] & /*isOpen*/ 4096) {
    				toggle_class(div, "open", /*isOpen*/ ctx[12]);
    			}

    			if (dirty[0] & /*isClosing*/ 8192) {
    				toggle_class(div, "closing", /*isClosing*/ ctx[13]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popover_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popover_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*popover_1_binding*/ ctx[44](null);
    			destroy_component(popover_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let months;
    	let visibleMonth;
    	let visibleMonthId;
    	let lastVisibleDate;
    	let firstVisibleDate;
    	let canIncrementMonth;
    	let canDecrementMonth;
    	let wrapperStyle;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Datepicker', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	const today = new Date();
    	const oneYear = 1000 * 60 * 60 * 24 * 365;
    	let popover;
    	let { format = '#{m}/#{d}/#{Y}' } = $$props;
    	let { start = new Date(Date.now() - oneYear) } = $$props;
    	let { end = new Date(Date.now() + oneYear) } = $$props;
    	let { selected = today } = $$props;
    	let { dateChosen = false } = $$props;
    	let { trigger = null } = $$props;
    	let { selectableCallback = null } = $$props;
    	let { weekStart = 0 } = $$props;

    	let { daysOfWeek = [
    		['Sunday', 'Sun'],
    		['Monday', 'Mon'],
    		['Tuesday', 'Tue'],
    		['Wednesday', 'Wed'],
    		['Thursday', 'Thu'],
    		['Friday', 'Fri'],
    		['Saturday', 'Sat']
    	] } = $$props;

    	let { monthsOfYear = [
    		['January', 'Jan'],
    		['February', 'Feb'],
    		['March', 'Mar'],
    		['April', 'Apr'],
    		['May', 'May'],
    		['June', 'Jun'],
    		['July', 'Jul'],
    		['August', 'Aug'],
    		['September', 'Sep'],
    		['October', 'Oct'],
    		['November', 'Nov'],
    		['December', 'Dec']
    	] } = $$props;

    	selected = selected.getTime() < start.getTime() || selected.getTime() > end.getTime()
    	? start
    	: selected;

    	let { style = '' } = $$props;
    	let { buttonBackgroundColor = '#fff' } = $$props;
    	let { buttonBorderColor = '#eee' } = $$props;
    	let { buttonTextColor = '#333' } = $$props;
    	let { highlightColor = '#f7901e' } = $$props;
    	let { dayBackgroundColor = 'none' } = $$props;
    	let { dayTextColor = '#4a4a4a' } = $$props;
    	let { dayHighlightedBackgroundColor = '#efefef' } = $$props;
    	let { dayHighlightedTextColor = '#4a4a4a' } = $$props;
    	internationalize({ daysOfWeek, monthsOfYear });

    	let sortedDaysOfWeek = weekStart === 0
    	? daysOfWeek
    	: (() => {
    			let dow = daysOfWeek.slice();
    			dow.push(dow.shift());
    			return dow;
    		})();

    	let highlighted = today;
    	let shouldShakeDate = false;
    	let shakeHighlightTimeout;
    	let month = today.getMonth();
    	let year = today.getFullYear();
    	let isOpen = false;
    	let isClosing = false;
    	today.setHours(0, 0, 0, 0);

    	function assignmentHandler(formatted) {
    		if (!trigger) return;
    		$$invalidate(1, trigger.innerHTML = formatted, trigger);
    	}

    	let monthIndex = 0;
    	let { formattedSelected } = $$props;

    	onMount(() => {
    		$$invalidate(6, month = selected.getMonth());
    		$$invalidate(7, year = selected.getFullYear());
    	});

    	function changeMonth(selectedMonth) {
    		$$invalidate(6, month = selectedMonth);
    		$$invalidate(10, highlighted = new Date(year, month, 1));
    	}

    	function incrementMonth(direction, day = 1) {
    		if (direction === 1 && !canIncrementMonth) return;
    		if (direction === -1 && !canDecrementMonth) return;
    		let current = new Date(year, month, 1);
    		current.setMonth(current.getMonth() + direction);
    		$$invalidate(6, month = current.getMonth());
    		$$invalidate(7, year = current.getFullYear());
    		$$invalidate(10, highlighted = new Date(year, month, day));
    	}

    	function getDefaultHighlighted() {
    		return new Date(selected);
    	}

    	const getDay = (m, d, y) => {
    		let theMonth = months.find(aMonth => aMonth.month === m && aMonth.year === y);
    		if (!theMonth) return null;

    		// eslint-disable-next-line
    		for (let i = 0; i < theMonth.weeks.length; ++i) {
    			// eslint-disable-next-line
    			for (let j = 0; j < theMonth.weeks[i].days.length; ++j) {
    				let aDay = theMonth.weeks[i].days[j];
    				if (aDay.month === m && aDay.day === d && aDay.year === y) return aDay;
    			}
    		}

    		return null;
    	};

    	function incrementDayHighlighted(amount) {
    		let proposedDate = new Date(highlighted);
    		proposedDate.setDate(highlighted.getDate() + amount);
    		let correspondingDayObj = getDay(proposedDate.getMonth(), proposedDate.getDate(), proposedDate.getFullYear());
    		if (!correspondingDayObj || !correspondingDayObj.isInRange) return;
    		$$invalidate(10, highlighted = proposedDate);

    		if (amount > 0 && highlighted > lastVisibleDate) {
    			incrementMonth(1, highlighted.getDate());
    		}

    		if (amount < 0 && highlighted < firstVisibleDate) {
    			incrementMonth(-1, highlighted.getDate());
    		}
    	}

    	function checkIfVisibleDateIsSelectable(date) {
    		const proposedDay = getDay(date.getMonth(), date.getDate(), date.getFullYear());
    		return proposedDay && proposedDay.selectable;
    	}

    	function shakeDate(date) {
    		clearTimeout(shakeHighlightTimeout);
    		$$invalidate(11, shouldShakeDate = date);

    		shakeHighlightTimeout = setTimeout(
    			() => {
    				$$invalidate(11, shouldShakeDate = false);
    			},
    			700
    		);
    	}

    	function assignValueToTrigger(formatted) {
    		assignmentHandler(formatted);
    	}

    	function registerSelection(chosen) {
    		if (!checkIfVisibleDateIsSelectable(chosen)) return shakeDate(chosen);

    		// eslint-disable-next-line
    		close();

    		$$invalidate(0, selected = chosen);
    		$$invalidate(24, dateChosen = true);
    		assignValueToTrigger(formattedSelected);
    		return dispatch('dateSelected', { date: chosen });
    	}

    	function handleKeyPress(evt) {
    		if (keyCodesArray.indexOf(evt.keyCode) === -1) return;
    		evt.preventDefault();

    		switch (evt.keyCode) {
    			case keyCodes.left:
    				incrementDayHighlighted(-1);
    				break;
    			case keyCodes.up:
    				incrementDayHighlighted(-7);
    				break;
    			case keyCodes.right:
    				incrementDayHighlighted(1);
    				break;
    			case keyCodes.down:
    				incrementDayHighlighted(7);
    				break;
    			case keyCodes.pgup:
    				incrementMonth(-1);
    				break;
    			case keyCodes.pgdown:
    				incrementMonth(1);
    				break;
    			case keyCodes.escape:
    				// eslint-disable-next-line
    				close();
    				break;
    			case keyCodes.enter:
    				registerSelection(highlighted);
    				break;
    		}
    	}

    	function registerClose() {
    		document.removeEventListener('keydown', handleKeyPress);
    		dispatch('close');
    	}

    	function close() {
    		popover.close();
    		registerClose();
    	}

    	function registerOpen() {
    		$$invalidate(10, highlighted = getDefaultHighlighted());
    		$$invalidate(6, month = selected.getMonth());
    		$$invalidate(7, year = selected.getFullYear());
    		document.addEventListener('keydown', handleKeyPress);
    		dispatch('open');
    	}

    	const writable_props = [
    		'format',
    		'start',
    		'end',
    		'selected',
    		'dateChosen',
    		'trigger',
    		'selectableCallback',
    		'weekStart',
    		'daysOfWeek',
    		'monthsOfYear',
    		'style',
    		'buttonBackgroundColor',
    		'buttonBorderColor',
    		'buttonTextColor',
    		'highlightColor',
    		'dayBackgroundColor',
    		'dayTextColor',
    		'dayHighlightedBackgroundColor',
    		'dayHighlightedTextColor',
    		'formattedSelected'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Datepicker> was created with unknown prop '${key}'`);
    	});

    	const monthSelected_handler = e => changeMonth(e.detail);
    	const incrementMonth_handler = e => incrementMonth(e.detail);
    	const dateSelected_handler = e => registerSelection(e.detail);

    	function popover_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			popover = $$value;
    			$$invalidate(9, popover);
    		});
    	}

    	function popover_1_open_binding(value) {
    		isOpen = value;
    		$$invalidate(12, isOpen);
    	}

    	function popover_1_shrink_binding(value) {
    		isClosing = value;
    		$$invalidate(13, isClosing);
    	}

    	$$self.$$set = $$props => {
    		if ('format' in $$props) $$invalidate(25, format = $$props.format);
    		if ('start' in $$props) $$invalidate(3, start = $$props.start);
    		if ('end' in $$props) $$invalidate(4, end = $$props.end);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('dateChosen' in $$props) $$invalidate(24, dateChosen = $$props.dateChosen);
    		if ('trigger' in $$props) $$invalidate(1, trigger = $$props.trigger);
    		if ('selectableCallback' in $$props) $$invalidate(26, selectableCallback = $$props.selectableCallback);
    		if ('weekStart' in $$props) $$invalidate(27, weekStart = $$props.weekStart);
    		if ('daysOfWeek' in $$props) $$invalidate(28, daysOfWeek = $$props.daysOfWeek);
    		if ('monthsOfYear' in $$props) $$invalidate(5, monthsOfYear = $$props.monthsOfYear);
    		if ('style' in $$props) $$invalidate(29, style = $$props.style);
    		if ('buttonBackgroundColor' in $$props) $$invalidate(30, buttonBackgroundColor = $$props.buttonBackgroundColor);
    		if ('buttonBorderColor' in $$props) $$invalidate(31, buttonBorderColor = $$props.buttonBorderColor);
    		if ('buttonTextColor' in $$props) $$invalidate(32, buttonTextColor = $$props.buttonTextColor);
    		if ('highlightColor' in $$props) $$invalidate(33, highlightColor = $$props.highlightColor);
    		if ('dayBackgroundColor' in $$props) $$invalidate(34, dayBackgroundColor = $$props.dayBackgroundColor);
    		if ('dayTextColor' in $$props) $$invalidate(35, dayTextColor = $$props.dayTextColor);
    		if ('dayHighlightedBackgroundColor' in $$props) $$invalidate(36, dayHighlightedBackgroundColor = $$props.dayHighlightedBackgroundColor);
    		if ('dayHighlightedTextColor' in $$props) $$invalidate(37, dayHighlightedTextColor = $$props.dayHighlightedTextColor);
    		if ('formattedSelected' in $$props) $$invalidate(2, formattedSelected = $$props.formattedSelected);
    		if ('$$scope' in $$props) $$invalidate(47, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Month,
    		NavBar,
    		Popover,
    		getMonths,
    		formatDate: formatDate$1,
    		internationalize,
    		keyCodes,
    		keyCodesArray,
    		onMount,
    		createEventDispatcher,
    		dispatch,
    		today,
    		oneYear,
    		popover,
    		format,
    		start,
    		end,
    		selected,
    		dateChosen,
    		trigger,
    		selectableCallback,
    		weekStart,
    		daysOfWeek,
    		monthsOfYear,
    		style,
    		buttonBackgroundColor,
    		buttonBorderColor,
    		buttonTextColor,
    		highlightColor,
    		dayBackgroundColor,
    		dayTextColor,
    		dayHighlightedBackgroundColor,
    		dayHighlightedTextColor,
    		sortedDaysOfWeek,
    		highlighted,
    		shouldShakeDate,
    		shakeHighlightTimeout,
    		month,
    		year,
    		isOpen,
    		isClosing,
    		assignmentHandler,
    		monthIndex,
    		formattedSelected,
    		changeMonth,
    		incrementMonth,
    		getDefaultHighlighted,
    		getDay,
    		incrementDayHighlighted,
    		checkIfVisibleDateIsSelectable,
    		shakeDate,
    		assignValueToTrigger,
    		registerSelection,
    		handleKeyPress,
    		registerClose,
    		close,
    		registerOpen,
    		firstVisibleDate,
    		lastVisibleDate,
    		months,
    		canDecrementMonth,
    		canIncrementMonth,
    		wrapperStyle,
    		visibleMonth,
    		visibleMonthId
    	});

    	$$self.$inject_state = $$props => {
    		if ('popover' in $$props) $$invalidate(9, popover = $$props.popover);
    		if ('format' in $$props) $$invalidate(25, format = $$props.format);
    		if ('start' in $$props) $$invalidate(3, start = $$props.start);
    		if ('end' in $$props) $$invalidate(4, end = $$props.end);
    		if ('selected' in $$props) $$invalidate(0, selected = $$props.selected);
    		if ('dateChosen' in $$props) $$invalidate(24, dateChosen = $$props.dateChosen);
    		if ('trigger' in $$props) $$invalidate(1, trigger = $$props.trigger);
    		if ('selectableCallback' in $$props) $$invalidate(26, selectableCallback = $$props.selectableCallback);
    		if ('weekStart' in $$props) $$invalidate(27, weekStart = $$props.weekStart);
    		if ('daysOfWeek' in $$props) $$invalidate(28, daysOfWeek = $$props.daysOfWeek);
    		if ('monthsOfYear' in $$props) $$invalidate(5, monthsOfYear = $$props.monthsOfYear);
    		if ('style' in $$props) $$invalidate(29, style = $$props.style);
    		if ('buttonBackgroundColor' in $$props) $$invalidate(30, buttonBackgroundColor = $$props.buttonBackgroundColor);
    		if ('buttonBorderColor' in $$props) $$invalidate(31, buttonBorderColor = $$props.buttonBorderColor);
    		if ('buttonTextColor' in $$props) $$invalidate(32, buttonTextColor = $$props.buttonTextColor);
    		if ('highlightColor' in $$props) $$invalidate(33, highlightColor = $$props.highlightColor);
    		if ('dayBackgroundColor' in $$props) $$invalidate(34, dayBackgroundColor = $$props.dayBackgroundColor);
    		if ('dayTextColor' in $$props) $$invalidate(35, dayTextColor = $$props.dayTextColor);
    		if ('dayHighlightedBackgroundColor' in $$props) $$invalidate(36, dayHighlightedBackgroundColor = $$props.dayHighlightedBackgroundColor);
    		if ('dayHighlightedTextColor' in $$props) $$invalidate(37, dayHighlightedTextColor = $$props.dayHighlightedTextColor);
    		if ('sortedDaysOfWeek' in $$props) $$invalidate(18, sortedDaysOfWeek = $$props.sortedDaysOfWeek);
    		if ('highlighted' in $$props) $$invalidate(10, highlighted = $$props.highlighted);
    		if ('shouldShakeDate' in $$props) $$invalidate(11, shouldShakeDate = $$props.shouldShakeDate);
    		if ('shakeHighlightTimeout' in $$props) shakeHighlightTimeout = $$props.shakeHighlightTimeout;
    		if ('month' in $$props) $$invalidate(6, month = $$props.month);
    		if ('year' in $$props) $$invalidate(7, year = $$props.year);
    		if ('isOpen' in $$props) $$invalidate(12, isOpen = $$props.isOpen);
    		if ('isClosing' in $$props) $$invalidate(13, isClosing = $$props.isClosing);
    		if ('monthIndex' in $$props) $$invalidate(38, monthIndex = $$props.monthIndex);
    		if ('formattedSelected' in $$props) $$invalidate(2, formattedSelected = $$props.formattedSelected);
    		if ('firstVisibleDate' in $$props) firstVisibleDate = $$props.firstVisibleDate;
    		if ('lastVisibleDate' in $$props) lastVisibleDate = $$props.lastVisibleDate;
    		if ('months' in $$props) $$invalidate(39, months = $$props.months);
    		if ('canDecrementMonth' in $$props) $$invalidate(14, canDecrementMonth = $$props.canDecrementMonth);
    		if ('canIncrementMonth' in $$props) $$invalidate(15, canIncrementMonth = $$props.canIncrementMonth);
    		if ('wrapperStyle' in $$props) $$invalidate(16, wrapperStyle = $$props.wrapperStyle);
    		if ('visibleMonth' in $$props) $$invalidate(8, visibleMonth = $$props.visibleMonth);
    		if ('visibleMonthId' in $$props) $$invalidate(17, visibleMonthId = $$props.visibleMonthId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*start, end, selectableCallback, weekStart*/ 201326616) {
    			 $$invalidate(39, months = getMonths(start, end, selectableCallback, weekStart));
    		}

    		if ($$self.$$.dirty[0] & /*month, year*/ 192 | $$self.$$.dirty[1] & /*months*/ 256) {
    			 {
    				$$invalidate(38, monthIndex = 0);

    				for (let i = 0; i < months.length; i += 1) {
    					if (months[i].month === month && months[i].year === year) {
    						$$invalidate(38, monthIndex = i);
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty[1] & /*months, monthIndex*/ 384) {
    			 $$invalidate(8, visibleMonth = months[monthIndex]);
    		}

    		if ($$self.$$.dirty[0] & /*year, month*/ 192) {
    			 $$invalidate(17, visibleMonthId = year + month / 100);
    		}

    		if ($$self.$$.dirty[0] & /*visibleMonth*/ 256) {
    			 lastVisibleDate = visibleMonth.weeks[visibleMonth.weeks.length - 1].days[6].date;
    		}

    		if ($$self.$$.dirty[0] & /*visibleMonth*/ 256) {
    			 firstVisibleDate = visibleMonth.weeks[0].days[0].date;
    		}

    		if ($$self.$$.dirty[1] & /*monthIndex, months*/ 384) {
    			 $$invalidate(15, canIncrementMonth = monthIndex < months.length - 1);
    		}

    		if ($$self.$$.dirty[1] & /*monthIndex*/ 128) {
    			 $$invalidate(14, canDecrementMonth = monthIndex > 0);
    		}

    		if ($$self.$$.dirty[0] & /*buttonBackgroundColor, style*/ 1610612736 | $$self.$$.dirty[1] & /*buttonBorderColor, buttonTextColor, highlightColor, dayBackgroundColor, dayTextColor, dayHighlightedBackgroundColor, dayHighlightedTextColor*/ 127) {
    			 $$invalidate(16, wrapperStyle = `
    --button-background-color: ${buttonBackgroundColor};
    --button-border-color: ${buttonBorderColor};
    --button-text-color: ${buttonTextColor};
    --highlight-color: ${highlightColor};
    --day-background-color: ${dayBackgroundColor};
    --day-text-color: ${dayTextColor};
    --day-highlighted-background-color: ${dayHighlightedBackgroundColor};
    --day-highlighted-text-color: ${dayHighlightedTextColor};
    ${style}
  `);
    		}

    		if ($$self.$$.dirty[0] & /*format, selected*/ 33554433) {
    			 {
    				$$invalidate(2, formattedSelected = typeof format === 'function'
    				? format(selected)
    				: formatDate$1(selected, format));
    			}
    		}
    	};

    	return [
    		selected,
    		trigger,
    		formattedSelected,
    		start,
    		end,
    		monthsOfYear,
    		month,
    		year,
    		visibleMonth,
    		popover,
    		highlighted,
    		shouldShakeDate,
    		isOpen,
    		isClosing,
    		canDecrementMonth,
    		canIncrementMonth,
    		wrapperStyle,
    		visibleMonthId,
    		sortedDaysOfWeek,
    		changeMonth,
    		incrementMonth,
    		registerSelection,
    		registerClose,
    		registerOpen,
    		dateChosen,
    		format,
    		selectableCallback,
    		weekStart,
    		daysOfWeek,
    		style,
    		buttonBackgroundColor,
    		buttonBorderColor,
    		buttonTextColor,
    		highlightColor,
    		dayBackgroundColor,
    		dayTextColor,
    		dayHighlightedBackgroundColor,
    		dayHighlightedTextColor,
    		monthIndex,
    		months,
    		slots,
    		monthSelected_handler,
    		incrementMonth_handler,
    		dateSelected_handler,
    		popover_1_binding,
    		popover_1_open_binding,
    		popover_1_shrink_binding,
    		$$scope
    	];
    }

    class Datepicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$d,
    			create_fragment$d,
    			safe_not_equal,
    			{
    				format: 25,
    				start: 3,
    				end: 4,
    				selected: 0,
    				dateChosen: 24,
    				trigger: 1,
    				selectableCallback: 26,
    				weekStart: 27,
    				daysOfWeek: 28,
    				monthsOfYear: 5,
    				style: 29,
    				buttonBackgroundColor: 30,
    				buttonBorderColor: 31,
    				buttonTextColor: 32,
    				highlightColor: 33,
    				dayBackgroundColor: 34,
    				dayTextColor: 35,
    				dayHighlightedBackgroundColor: 36,
    				dayHighlightedTextColor: 37,
    				formattedSelected: 2
    			},
    			null,
    			[-1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Datepicker",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*formattedSelected*/ ctx[2] === undefined && !('formattedSelected' in props)) {
    			console.warn("<Datepicker> was created without expected prop 'formattedSelected'");
    		}
    	}

    	get format() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set format(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dateChosen() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dateChosen(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trigger() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trigger(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectableCallback() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectableCallback(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get weekStart() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set weekStart(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get daysOfWeek() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set daysOfWeek(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get monthsOfYear() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set monthsOfYear(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonBackgroundColor() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonBackgroundColor(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonBorderColor() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonBorderColor(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonTextColor() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonTextColor(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlightColor() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlightColor(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dayBackgroundColor() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dayBackgroundColor(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dayTextColor() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dayTextColor(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dayHighlightedBackgroundColor() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dayHighlightedBackgroundColor(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dayHighlightedTextColor() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dayHighlightedTextColor(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formattedSelected() {
    		throw new Error("<Datepicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formattedSelected(value) {
    		throw new Error("<Datepicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.1 */

    const { Object: Object_1$2 } = globals;
    const file$e = "src/App.svelte";

    // (286:0) {#if covidData.length > 0}
    function create_if_block$2(ctx) {
    	let div31;
    	let div19;
    	let div6;
    	let graphictitle0;
    	let t0;
    	let div1;
    	let div0;
    	let chart_donut0;
    	let t1;
    	let div3;
    	let div2;
    	let chart_donut1;
    	let t2;
    	let div5;
    	let div4;
    	let chart_donut2;
    	let t3;
    	let div18;
    	let div17;
    	let graphictitle1;
    	let t4;
    	let div8;
    	let menu;
    	let button0;
    	let t6;
    	let button1;
    	let t8;
    	let button2;
    	let t10;
    	let div7;
    	let datepicker0;
    	let updating_selected;
    	let updating_dateChosen;
    	let t11;
    	let span;
    	let t13;
    	let datepicker1;
    	let updating_selected_1;
    	let updating_dateChosen_1;
    	let t14;
    	let div16;
    	let div15;
    	let div11;
    	let div9;
    	let t15;
    	let div10;
    	let t17;
    	let div14;
    	let div12;
    	let t18;
    	let div13;
    	let t20;
    	let previous_key = /*filteredData*/ ctx[8];
    	let t21;
    	let section;
    	let h2;
    	let t23;
    	let div20;
    	let data_point;
    	let t24;
    	let chart_donut3;
    	let t25;
    	let chart_donut4;
    	let t26;
    	let div21;
    	let graphictitle2;
    	let t27;
    	let chart_covid_variants;
    	let t28;
    	let div25;
    	let graphictitle3;
    	let t29;
    	let div24;
    	let div23;
    	let div22;
    	let meter_chart0;
    	let t30;
    	let meter_chart1;
    	let t31;
    	let div27;
    	let div26;
    	let chart_wellness_summary0;
    	let t32;
    	let chart_wellness_summary1;
    	let t33;
    	let p;
    	let t35;
    	let div30;
    	let div28;
    	let sveltetable;
    	let t36;
    	let button3;
    	let div29;
    	let current;
    	let mounted;
    	let dispose;

    	graphictitle0 = new GraphicTitle({
    			props: {
    				title: "Daily Positives for " + new Date(/*covidData*/ ctx[2][/*covidData*/ ctx[2].length - 1]['Date']).toLocaleDateString()
    			},
    			$$inline: true
    		});

    	chart_donut0 = new Chart_donut({
    			props: {
    				width: /*width_donut*/ ctx[5],
    				height: /*width_donut*/ ctx[5],
    				data: /*covidData*/ ctx[2],
    				label: "Students",
    				primaryKey: "Students Total Positive",
    				secondaryKey: "Students Total Negative",
    				valueStyle: "default"
    			},
    			$$inline: true
    		});

    	chart_donut1 = new Chart_donut({
    			props: {
    				width: /*width_donut*/ ctx[5],
    				height: /*width_donut*/ ctx[5],
    				data: /*covidData*/ ctx[2],
    				label: "Faculty/Staff",
    				primaryKey: "FacStaff Total Positive",
    				secondaryKey: "FacStaff Total Negative",
    				valueStyle: "default"
    			},
    			$$inline: true
    		});

    	chart_donut2 = new Chart_donut({
    			props: {
    				width: /*width_donut*/ ctx[5],
    				height: /*width_donut*/ ctx[5],
    				data: /*covidData*/ ctx[2],
    				label: "Contractors",
    				primaryKey: "Contractor Total Positive",
    				secondaryKey: "Contractor Total Negative",
    				valueStyle: "default"
    			},
    			$$inline: true
    		});

    	graphictitle1 = new GraphicTitle({
    			props: { title: "Test Results by Date" },
    			$$inline: true
    		});

    	function datepicker0_selected_binding(value) {
    		/*datepicker0_selected_binding*/ ctx[16](value);
    	}

    	function datepicker0_dateChosen_binding(value) {
    		/*datepicker0_dateChosen_binding*/ ctx[17](value);
    	}

    	let datepicker0_props = {
    		end: /*filterEndDate*/ ctx[0],
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	if (/*filterStartDate*/ ctx[1] !== void 0) {
    		datepicker0_props.selected = /*filterStartDate*/ ctx[1];
    	}

    	if (/*isStartDateChosen*/ ctx[3] !== void 0) {
    		datepicker0_props.dateChosen = /*isStartDateChosen*/ ctx[3];
    	}

    	datepicker0 = new Datepicker({ props: datepicker0_props, $$inline: true });
    	binding_callbacks.push(() => bind(datepicker0, 'selected', datepicker0_selected_binding));
    	binding_callbacks.push(() => bind(datepicker0, 'dateChosen', datepicker0_dateChosen_binding));

    	function datepicker1_selected_binding(value) {
    		/*datepicker1_selected_binding*/ ctx[18](value);
    	}

    	function datepicker1_dateChosen_binding(value) {
    		/*datepicker1_dateChosen_binding*/ ctx[19](value);
    	}

    	let datepicker1_props = {
    		start: /*filterStartDate*/ ctx[1],
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*filterEndDate*/ ctx[0] !== void 0) {
    		datepicker1_props.selected = /*filterEndDate*/ ctx[0];
    	}

    	if (/*isEndDateChosen*/ ctx[4] !== void 0) {
    		datepicker1_props.dateChosen = /*isEndDateChosen*/ ctx[4];
    	}

    	datepicker1 = new Datepicker({ props: datepicker1_props, $$inline: true });
    	binding_callbacks.push(() => bind(datepicker1, 'selected', datepicker1_selected_binding));
    	binding_callbacks.push(() => bind(datepicker1, 'dateChosen', datepicker1_dateChosen_binding));
    	let key_block = create_key_block(ctx);

    	data_point = new Data_point({
    			props: {
    				width: /*width_donut*/ ctx[5],
    				height: /*width_donut*/ ctx[5],
    				value: "0",
    				label: "Hospitalizations"
    			},
    			$$inline: true
    		});

    	chart_donut3 = new Chart_donut({
    			props: {
    				width: /*width_donut*/ ctx[5],
    				height: /*width_donut*/ ctx[5],
    				data: /*covidData*/ ctx[2],
    				label: "Seven-Day Positive Test Rate",
    				primaryKey: "Seven-Day Positive Primer",
    				secondaryKey: "Seven-Day Negative Primer",
    				valueStyle: {
    					"type": "percent",
    					"compareWith": "Seven-Day Tests Primer"
    				}
    			},
    			$$inline: true
    		});

    	chart_donut4 = new Chart_donut({
    			props: {
    				width: /*width_donut*/ ctx[5],
    				height: /*width_donut*/ ctx[5],
    				data: /*covidData*/ ctx[2],
    				label: "Campus Wellness Beds in Use",
    				primaryKey: "Beds In Use",
    				secondaryKey: "Beds Not In Use",
    				valueStyle: "default"
    			},
    			$$inline: true
    		});

    	graphictitle2 = new GraphicTitle({
    			props: { title: "Variants" },
    			$$inline: true
    		});

    	chart_covid_variants = new Chart_covid_variants({
    			props: {
    				isPercentage: false,
    				data: /*covidData*/ ctx[2][/*covidData*/ ctx[2].length - 1],
    				width: /*width*/ ctx[12],
    				columns: 25,
    				groups: ["SARS-COV-2", "SARS-COV-2 Delta"],
    				labels: ["SARS-COV-2", "SARS-COV-2 Delta"],
    				colors: ["var(--chart--variants-base)", "var(--chart--variants-delta)"],
    				footnotes: [
    					"* Northeastern’s Life Sciences Testing Center analyzes\n" + "                    the genome of viral samples that test positive for COVID-19\n" + "                    to determine which strain of the virus is behind a positive\n" + "                    test. The lab probes each sample for distinctive markers of\n" + "                    known variants of concern: Alpha (B.1.1.7), Beta (B.1.351),\n" + "                    Gamma (P.1), and Delta (B.1.617.2). Not all positive tests\n" + "                    in this report are from variants of concern, so the number\n" + "                    of variants reported here will not match the total positive\n" + "                    tests above."
    				]
    			},
    			$$inline: true
    		});

    	graphictitle3 = new GraphicTitle({
    			props: { title: "Vaccination Rates" },
    			$$inline: true
    		});

    	meter_chart0 = new Meter_chart({
    			props: {
    				length: meterColumnLength,
    				width: meterColumnWidth,
    				value: /*getMostRecentEntry*/ ctx[14]("Student Vaccinated"),
    				label: "Students Vaccination Rate"
    			},
    			$$inline: true
    		});

    	meter_chart1 = new Meter_chart({
    			props: {
    				length: meterColumnLength,
    				width: meterColumnWidth,
    				value: /*getMostRecentEntry*/ ctx[14]("Fac/Staff Vaccinated"),
    				label: "Faculty and Staff Vaccination Rate"
    			},
    			$$inline: true
    		});

    	chart_wellness_summary0 = new Wellness_summary({
    			props: {
    				label: "Students in Isolation",
    				onCampus: /*getMostRecentEntry*/ ctx[14]("Students in Isolation On Campus"),
    				offCampus: /*getMostRecentEntry*/ ctx[14]("Students in Isolation Off Campus"),
    				hasAccent: true
    			},
    			$$inline: true
    		});

    	chart_wellness_summary1 = new Wellness_summary({
    			props: {
    				label: "Students in Quarantine",
    				onCampus: /*getMostRecentEntry*/ ctx[14]("Students in Quarantine On Campus"),
    				offCampus: /*getMostRecentEntry*/ ctx[14]("Students in Quarantine Off Campus"),
    				hasAccent: true
    			},
    			$$inline: true
    		});

    	sveltetable = new SvelteTable({
    			props: {
    				columns: /*columns*/ ctx[13],
    				rows: /*covidData*/ ctx[2],
    				sortBy: "Date",
    				sortOrder: -1,
    				classNameCell: "infocell"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div31 = element("div");
    			div19 = element("div");
    			div6 = element("div");
    			create_component(graphictitle0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			create_component(chart_donut0.$$.fragment);
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			create_component(chart_donut1.$$.fragment);
    			t2 = space();
    			div5 = element("div");
    			div4 = element("div");
    			create_component(chart_donut2.$$.fragment);
    			t3 = space();
    			div18 = element("div");
    			div17 = element("div");
    			create_component(graphictitle1.$$.fragment);
    			t4 = space();
    			div8 = element("div");
    			menu = element("menu");
    			button0 = element("button");
    			button0.textContent = "Past 7\n                                Days";
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "Past 30\n                                Days";
    			t8 = space();
    			button2 = element("button");
    			button2.textContent = "Semester";
    			t10 = space();
    			div7 = element("div");
    			create_component(datepicker0.$$.fragment);
    			t11 = space();
    			span = element("span");
    			span.textContent = "–";
    			t13 = space();
    			create_component(datepicker1.$$.fragment);
    			t14 = space();
    			div16 = element("div");
    			div15 = element("div");
    			div11 = element("div");
    			div9 = element("div");
    			t15 = space();
    			div10 = element("div");
    			div10.textContent = "NEGATIVE TESTS";
    			t17 = space();
    			div14 = element("div");
    			div12 = element("div");
    			t18 = space();
    			div13 = element("div");
    			div13.textContent = "POSITIVE TESTS";
    			t20 = space();
    			key_block.c();
    			t21 = space();
    			section = element("section");
    			h2 = element("h2");
    			h2.textContent = "Overview";
    			t23 = space();
    			div20 = element("div");
    			create_component(data_point.$$.fragment);
    			t24 = space();
    			create_component(chart_donut3.$$.fragment);
    			t25 = space();
    			create_component(chart_donut4.$$.fragment);
    			t26 = space();
    			div21 = element("div");
    			create_component(graphictitle2.$$.fragment);
    			t27 = space();
    			create_component(chart_covid_variants.$$.fragment);
    			t28 = space();
    			div25 = element("div");
    			create_component(graphictitle3.$$.fragment);
    			t29 = space();
    			div24 = element("div");
    			div23 = element("div");
    			div22 = element("div");
    			create_component(meter_chart0.$$.fragment);
    			t30 = space();
    			create_component(meter_chart1.$$.fragment);
    			t31 = space();
    			div27 = element("div");
    			div26 = element("div");
    			create_component(chart_wellness_summary0.$$.fragment);
    			t32 = space();
    			create_component(chart_wellness_summary1.$$.fragment);
    			t33 = space();
    			p = element("p");
    			p.textContent = "*According to the university’s August 18,\n                2021 announcement, those who have been identified as close\n                contacts no longer have to quarantine as long as they are\n                vaccinated.";
    			t35 = space();
    			div30 = element("div");
    			div28 = element("div");
    			create_component(sveltetable.$$.fragment);
    			t36 = space();
    			button3 = element("button");
    			div29 = element("div");
    			div29.textContent = "View Full Table";
    			attr_dev(div0, "class", "donut-chart chart-seven-day-students");
    			add_location(div0, file$e, 298, 20, 9212);
    			attr_dev(div1, "class", "donut-item dash-stats-item");
    			add_location(div1, file$e, 296, 16, 9150);
    			attr_dev(div2, "class", "donut-chart");
    			add_location(div2, file$e, 315, 20, 9854);
    			attr_dev(div3, "class", "donut-item dash-stats-item");
    			add_location(div3, file$e, 313, 16, 9792);
    			attr_dev(div4, "class", "donut-chart");
    			add_location(div4, file$e, 331, 20, 10475);
    			attr_dev(div5, "class", "donut-item dash-stats-item");
    			add_location(div5, file$e, 329, 16, 10413);
    			attr_dev(div6, "class", "dash-stats dash-test-item");
    			add_location(div6, file$e, 292, 12, 8917);
    			attr_dev(button0, "class", "button-filter filter-seven-days is-active");
    			add_location(button0, file$e, 357, 28, 11499);
    			attr_dev(button1, "class", "button-filter filter-thirty-days");
    			add_location(button1, file$e, 361, 28, 11737);
    			attr_dev(button2, "class", "button-filter filter-semester");
    			add_location(button2, file$e, 365, 28, 11968);
    			attr_dev(menu, "type", "toolbar");
    			attr_dev(menu, "class", "filter-bar-presets");
    			add_location(menu, file$e, 356, 24, 11422);
    			attr_dev(span, "class", "date-separator");
    			attr_dev(span, "aria-label", "to");
    			add_location(span, file$e, 376, 28, 12609);
    			attr_dev(div7, "class", "filter-bar-date-range");
    			add_location(div7, file$e, 370, 24, 12187);
    			attr_dev(div8, "class", "filter-bar");
    			add_location(div8, file$e, 353, 20, 11371);
    			attr_dev(div9, "class", "cell1");
    			add_location(div9, file$e, 388, 32, 13315);
    			attr_dev(div10, "class", "cell-label");
    			add_location(div10, file$e, 389, 32, 13373);
    			attr_dev(div11, "class", "legendCells");
    			add_location(div11, file$e, 387, 28, 13257);
    			attr_dev(div12, "class", "cell2");
    			add_location(div12, file$e, 393, 32, 13540);
    			attr_dev(div13, "class", "cell-label");
    			add_location(div13, file$e, 394, 32, 13598);
    			attr_dev(div14, "class", "legendCells");
    			add_location(div14, file$e, 392, 28, 13482);
    			attr_dev(div15, "class", "dashboard-legend");
    			add_location(div15, file$e, 386, 24, 13198);
    			attr_dev(div16, "class", "chart-results-pos-neg__chart");
    			add_location(div16, file$e, 385, 20, 13131);
    			attr_dev(div17, "class", "dash-bars dash-test-item");
    			add_location(div17, file$e, 349, 16, 11196);
    			attr_dev(div18, "class", "chart-wrapper");
    			attr_dev(div18, "id", "chart-results-pos-neg");
    			add_location(div18, file$e, 348, 12, 11125);
    			attr_dev(div19, "class", "dashboard-grid-item panel-testing-results");
    			add_location(div19, file$e, 289, 8, 8758);
    			attr_dev(h2, "class", "section-heading");
    			add_location(h2, file$e, 420, 12, 14570);
    			attr_dev(div20, "class", "graph-group");
    			add_location(div20, file$e, 421, 12, 14624);
    			attr_dev(section, "id", "overview");
    			add_location(section, file$e, 419, 8, 14534);
    			attr_dev(div21, "class", "dashboard-grid-item dash-variants");
    			set_style(div21, "--chart--key-font-size", "var(--global--font-size-xs)");
    			add_location(div21, file$e, 453, 8, 15812);
    			attr_dev(div22, "class", "stacked-cont is-horizontal");
    			add_location(div22, file$e, 493, 20, 17621);
    			attr_dev(div23, "class", "dash-stacked-vaccination");
    			add_location(div23, file$e, 492, 16, 17562);
    			attr_dev(div24, "class", "dash-vac-chart");
    			add_location(div24, file$e, 490, 12, 17516);
    			attr_dev(div25, "class", "dashboard-grid-item dash-vac-rate");
    			add_location(div25, file$e, 485, 8, 17366);
    			attr_dev(div26, "class", "wellness-summary-list");
    			add_location(div26, file$e, 519, 12, 18638);
    			attr_dev(p, "class", "update-line");
    			add_location(p, file$e, 533, 12, 19376);
    			attr_dev(div27, "class", "dashboard-grid-item dash-wellness");
    			add_location(div27, file$e, 515, 8, 18473);
    			attr_dev(div28, "class", "dashboard-grid-item dash-table-wrapper");
    			attr_dev(div28, "id", "table-covid");
    			add_location(div28, file$e, 543, 12, 19761);
    			attr_dev(div29, "class", "button-label");
    			add_location(div29, file$e, 557, 16, 20294);
    			attr_dev(button3, "class", "table-button is-primary");
    			add_location(button3, file$e, 556, 12, 20214);
    			attr_dev(div30, "class", "dashboard-grid-item dash-table-container");
    			add_location(div30, file$e, 541, 8, 19693);
    			attr_dev(div31, "id", "dashboard-grid");
    			add_location(div31, file$e, 286, 4, 8628);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div31, anchor);
    			append_dev(div31, div19);
    			append_dev(div19, div6);
    			mount_component(graphictitle0, div6, null);
    			append_dev(div6, t0);
    			append_dev(div6, div1);
    			append_dev(div1, div0);
    			mount_component(chart_donut0, div0, null);
    			append_dev(div6, t1);
    			append_dev(div6, div3);
    			append_dev(div3, div2);
    			mount_component(chart_donut1, div2, null);
    			append_dev(div6, t2);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			mount_component(chart_donut2, div4, null);
    			append_dev(div19, t3);
    			append_dev(div19, div18);
    			append_dev(div18, div17);
    			mount_component(graphictitle1, div17, null);
    			append_dev(div17, t4);
    			append_dev(div17, div8);
    			append_dev(div8, menu);
    			append_dev(menu, button0);
    			append_dev(menu, t6);
    			append_dev(menu, button1);
    			append_dev(menu, t8);
    			append_dev(menu, button2);
    			append_dev(div8, t10);
    			append_dev(div8, div7);
    			mount_component(datepicker0, div7, null);
    			append_dev(div7, t11);
    			append_dev(div7, span);
    			append_dev(div7, t13);
    			mount_component(datepicker1, div7, null);
    			append_dev(div17, t14);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div11);
    			append_dev(div11, div9);
    			append_dev(div11, t15);
    			append_dev(div11, div10);
    			append_dev(div15, t17);
    			append_dev(div15, div14);
    			append_dev(div14, div12);
    			append_dev(div14, t18);
    			append_dev(div14, div13);
    			append_dev(div16, t20);
    			key_block.m(div16, null);
    			append_dev(div31, t21);
    			append_dev(div31, section);
    			append_dev(section, h2);
    			append_dev(section, t23);
    			append_dev(section, div20);
    			mount_component(data_point, div20, null);
    			append_dev(div20, t24);
    			mount_component(chart_donut3, div20, null);
    			append_dev(div20, t25);
    			mount_component(chart_donut4, div20, null);
    			append_dev(div31, t26);
    			append_dev(div31, div21);
    			mount_component(graphictitle2, div21, null);
    			append_dev(div21, t27);
    			mount_component(chart_covid_variants, div21, null);
    			append_dev(div31, t28);
    			append_dev(div31, div25);
    			mount_component(graphictitle3, div25, null);
    			append_dev(div25, t29);
    			append_dev(div25, div24);
    			append_dev(div24, div23);
    			append_dev(div23, div22);
    			mount_component(meter_chart0, div22, null);
    			append_dev(div22, t30);
    			mount_component(meter_chart1, div22, null);
    			append_dev(div31, t31);
    			append_dev(div31, div27);
    			append_dev(div27, div26);
    			mount_component(chart_wellness_summary0, div26, null);
    			append_dev(div26, t32);
    			mount_component(chart_wellness_summary1, div26, null);
    			append_dev(div27, t33);
    			append_dev(div27, p);
    			append_dev(div31, t35);
    			append_dev(div31, div30);
    			append_dev(div30, div28);
    			mount_component(sveltetable, div28, null);
    			append_dev(div30, t36);
    			append_dev(div30, button3);
    			append_dev(button3, div29);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*setFilterLastSevenDays*/ ctx[9], false, false, false),
    					listen_dev(button1, "click", /*setFilterLastThirtyDays*/ ctx[10], false, false, false),
    					listen_dev(button2, "click", /*setFilterThisSemester*/ ctx[11], false, false, false),
    					listen_dev(button3, "click", /*toggleTable*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const graphictitle0_changes = {};
    			if (dirty & /*covidData*/ 4) graphictitle0_changes.title = "Daily Positives for " + new Date(/*covidData*/ ctx[2][/*covidData*/ ctx[2].length - 1]['Date']).toLocaleDateString();
    			graphictitle0.$set(graphictitle0_changes);
    			const chart_donut0_changes = {};
    			if (dirty & /*width_donut*/ 32) chart_donut0_changes.width = /*width_donut*/ ctx[5];
    			if (dirty & /*width_donut*/ 32) chart_donut0_changes.height = /*width_donut*/ ctx[5];
    			if (dirty & /*covidData*/ 4) chart_donut0_changes.data = /*covidData*/ ctx[2];
    			chart_donut0.$set(chart_donut0_changes);
    			const chart_donut1_changes = {};
    			if (dirty & /*width_donut*/ 32) chart_donut1_changes.width = /*width_donut*/ ctx[5];
    			if (dirty & /*width_donut*/ 32) chart_donut1_changes.height = /*width_donut*/ ctx[5];
    			if (dirty & /*covidData*/ 4) chart_donut1_changes.data = /*covidData*/ ctx[2];
    			chart_donut1.$set(chart_donut1_changes);
    			const chart_donut2_changes = {};
    			if (dirty & /*width_donut*/ 32) chart_donut2_changes.width = /*width_donut*/ ctx[5];
    			if (dirty & /*width_donut*/ 32) chart_donut2_changes.height = /*width_donut*/ ctx[5];
    			if (dirty & /*covidData*/ 4) chart_donut2_changes.data = /*covidData*/ ctx[2];
    			chart_donut2.$set(chart_donut2_changes);
    			const datepicker0_changes = {};
    			if (dirty & /*filterEndDate*/ 1) datepicker0_changes.end = /*filterEndDate*/ ctx[0];

    			if (dirty & /*$$scope, filterStartDate*/ 67108866) {
    				datepicker0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_selected && dirty & /*filterStartDate*/ 2) {
    				updating_selected = true;
    				datepicker0_changes.selected = /*filterStartDate*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			if (!updating_dateChosen && dirty & /*isStartDateChosen*/ 8) {
    				updating_dateChosen = true;
    				datepicker0_changes.dateChosen = /*isStartDateChosen*/ ctx[3];
    				add_flush_callback(() => updating_dateChosen = false);
    			}

    			datepicker0.$set(datepicker0_changes);
    			const datepicker1_changes = {};
    			if (dirty & /*filterStartDate*/ 2) datepicker1_changes.start = /*filterStartDate*/ ctx[1];

    			if (dirty & /*$$scope, filterEndDate*/ 67108865) {
    				datepicker1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_selected_1 && dirty & /*filterEndDate*/ 1) {
    				updating_selected_1 = true;
    				datepicker1_changes.selected = /*filterEndDate*/ ctx[0];
    				add_flush_callback(() => updating_selected_1 = false);
    			}

    			if (!updating_dateChosen_1 && dirty & /*isEndDateChosen*/ 16) {
    				updating_dateChosen_1 = true;
    				datepicker1_changes.dateChosen = /*isEndDateChosen*/ ctx[4];
    				add_flush_callback(() => updating_dateChosen_1 = false);
    			}

    			datepicker1.$set(datepicker1_changes);

    			if (dirty & /*filteredData*/ 256 && safe_not_equal(previous_key, previous_key = /*filteredData*/ ctx[8])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(div16, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			const data_point_changes = {};
    			if (dirty & /*width_donut*/ 32) data_point_changes.width = /*width_donut*/ ctx[5];
    			if (dirty & /*width_donut*/ 32) data_point_changes.height = /*width_donut*/ ctx[5];
    			data_point.$set(data_point_changes);
    			const chart_donut3_changes = {};
    			if (dirty & /*width_donut*/ 32) chart_donut3_changes.width = /*width_donut*/ ctx[5];
    			if (dirty & /*width_donut*/ 32) chart_donut3_changes.height = /*width_donut*/ ctx[5];
    			if (dirty & /*covidData*/ 4) chart_donut3_changes.data = /*covidData*/ ctx[2];
    			chart_donut3.$set(chart_donut3_changes);
    			const chart_donut4_changes = {};
    			if (dirty & /*width_donut*/ 32) chart_donut4_changes.width = /*width_donut*/ ctx[5];
    			if (dirty & /*width_donut*/ 32) chart_donut4_changes.height = /*width_donut*/ ctx[5];
    			if (dirty & /*covidData*/ 4) chart_donut4_changes.data = /*covidData*/ ctx[2];
    			chart_donut4.$set(chart_donut4_changes);
    			const chart_covid_variants_changes = {};
    			if (dirty & /*covidData*/ 4) chart_covid_variants_changes.data = /*covidData*/ ctx[2][/*covidData*/ ctx[2].length - 1];
    			chart_covid_variants.$set(chart_covid_variants_changes);
    			const sveltetable_changes = {};
    			if (dirty & /*covidData*/ 4) sveltetable_changes.rows = /*covidData*/ ctx[2];
    			sveltetable.$set(sveltetable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(graphictitle0.$$.fragment, local);
    			transition_in(chart_donut0.$$.fragment, local);
    			transition_in(chart_donut1.$$.fragment, local);
    			transition_in(chart_donut2.$$.fragment, local);
    			transition_in(graphictitle1.$$.fragment, local);
    			transition_in(datepicker0.$$.fragment, local);
    			transition_in(datepicker1.$$.fragment, local);
    			transition_in(key_block);
    			transition_in(data_point.$$.fragment, local);
    			transition_in(chart_donut3.$$.fragment, local);
    			transition_in(chart_donut4.$$.fragment, local);
    			transition_in(graphictitle2.$$.fragment, local);
    			transition_in(chart_covid_variants.$$.fragment, local);
    			transition_in(graphictitle3.$$.fragment, local);
    			transition_in(meter_chart0.$$.fragment, local);
    			transition_in(meter_chart1.$$.fragment, local);
    			transition_in(chart_wellness_summary0.$$.fragment, local);
    			transition_in(chart_wellness_summary1.$$.fragment, local);
    			transition_in(sveltetable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(graphictitle0.$$.fragment, local);
    			transition_out(chart_donut0.$$.fragment, local);
    			transition_out(chart_donut1.$$.fragment, local);
    			transition_out(chart_donut2.$$.fragment, local);
    			transition_out(graphictitle1.$$.fragment, local);
    			transition_out(datepicker0.$$.fragment, local);
    			transition_out(datepicker1.$$.fragment, local);
    			transition_out(key_block);
    			transition_out(data_point.$$.fragment, local);
    			transition_out(chart_donut3.$$.fragment, local);
    			transition_out(chart_donut4.$$.fragment, local);
    			transition_out(graphictitle2.$$.fragment, local);
    			transition_out(chart_covid_variants.$$.fragment, local);
    			transition_out(graphictitle3.$$.fragment, local);
    			transition_out(meter_chart0.$$.fragment, local);
    			transition_out(meter_chart1.$$.fragment, local);
    			transition_out(chart_wellness_summary0.$$.fragment, local);
    			transition_out(chart_wellness_summary1.$$.fragment, local);
    			transition_out(sveltetable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div31);
    			destroy_component(graphictitle0);
    			destroy_component(chart_donut0);
    			destroy_component(chart_donut1);
    			destroy_component(chart_donut2);
    			destroy_component(graphictitle1);
    			destroy_component(datepicker0);
    			destroy_component(datepicker1);
    			key_block.d(detaching);
    			destroy_component(data_point);
    			destroy_component(chart_donut3);
    			destroy_component(chart_donut4);
    			destroy_component(graphictitle2);
    			destroy_component(chart_covid_variants);
    			destroy_component(graphictitle3);
    			destroy_component(meter_chart0);
    			destroy_component(meter_chart1);
    			destroy_component(chart_wellness_summary0);
    			destroy_component(chart_wellness_summary1);
    			destroy_component(sveltetable);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(286:0) {#if covidData.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (372:28) <Datepicker bind:selected={filterStartDate}                                         bind:dateChosen={isStartDateChosen}                                         end={filterEndDate}>
    function create_default_slot_1(ctx) {
    	let div;
    	let t_value = /*filterStartDate*/ ctx[1].toLocaleDateString() + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "datepicker-label");
    			add_location(div, file$e, 374, 32, 12464);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filterStartDate*/ 2 && t_value !== (t_value = /*filterStartDate*/ ctx[1].toLocaleDateString() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(372:28) <Datepicker bind:selected={filterStartDate}                                         bind:dateChosen={isStartDateChosen}                                         end={filterEndDate}>",
    		ctx
    	});

    	return block;
    }

    // (379:28) <Datepicker bind:selected={filterEndDate}                                         bind:dateChosen={isEndDateChosen}                                         start={filterStartDate}>
    function create_default_slot(ctx) {
    	let div;
    	let t_value = /*filterEndDate*/ ctx[0].toLocaleDateString() + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "datepicker-label");
    			add_location(div, file$e, 381, 32, 12938);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*filterEndDate*/ 1 && t_value !== (t_value = /*filterEndDate*/ ctx[0].toLocaleDateString() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(379:28) <Datepicker bind:selected={filterEndDate}                                         bind:dateChosen={isEndDateChosen}                                         start={filterStartDate}>",
    		ctx
    	});

    	return block;
    }

    // (400:24) {#key filteredData}
    function create_key_block(ctx) {
    	let chart_bar_vertical;
    	let current;

    	chart_bar_vertical = new Chart_bar_vertical({
    			props: {
    				width: /*width_stacked*/ ctx[6],
    				height: /*height*/ ctx[7],
    				data: /*filteredData*/ ctx[8],
    				xVar: 'Date',
    				yVar: "Seven-Day Tests",
    				yGroups: ["Negative Tests", "Positive Tests"],
    				colorscheme: negativePositive
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chart_bar_vertical.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chart_bar_vertical, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const chart_bar_vertical_changes = {};
    			if (dirty & /*width_stacked*/ 64) chart_bar_vertical_changes.width = /*width_stacked*/ ctx[6];
    			if (dirty & /*height*/ 128) chart_bar_vertical_changes.height = /*height*/ ctx[7];
    			if (dirty & /*filteredData*/ 256) chart_bar_vertical_changes.data = /*filteredData*/ ctx[8];
    			chart_bar_vertical.$set(chart_bar_vertical_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chart_bar_vertical.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chart_bar_vertical.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chart_bar_vertical, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(400:24) {#key filteredData}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let p;
    	let t1;
    	let t2;
    	let graphicfooter;
    	let current;
    	let if_block = /*covidData*/ ctx[2].length > 0 && create_if_block$2(ctx);

    	graphicfooter = new GraphicFooter({
    			props: {
    				note: "",
    				source: "Northeastern Life Sciences Testing Center and the Broad Institute"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "On September 6, 2021, Northeastern launched its redesigned Covid-19\n        dashboard to track and showcase the metrics that are most meaningful\n        among a vaccinated population. The data below is updated daily as soon\n        it becomes available from the university’s Life Sciences Testing\n        Center.";
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(graphicfooter.$$.fragment);
    			add_location(p, file$e, 279, 4, 8270);
    			attr_dev(div, "class", "dashboard-intro");
    			add_location(div, file$e, 278, 0, 8236);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(graphicfooter, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*covidData*/ ctx[2].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*covidData*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t2.parentNode, t2);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(graphicfooter.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(graphicfooter.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(graphicfooter, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const meterColumnWidth = 66;
    const meterColumnLength = 406;
    const DEV_BASE_DIR = "//news.northeastern.edu/interactive/2021/08/updated-covid-dashboard";
    const LOCAL_BASE_DIR = "";

    /**
     * Gets a date object for today.
     *
     * @since 2.0
     *
     * @return Date
     */
    function getToday() {
    	return new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    }

    /**
     * Gets a date object for a specified number of days ago.
     *
     * @since 2.0
     *
     * @return Date
     */
    function getDaysAgo(daysAgo) {
    	return new Date(getToday() - daysAgo * 24 * 60 * 60 * 1000);
    }

    /**
     * Sets a single filter button as active.
     */
    function setActiveFilter(selector) {
    	let filterButtons = document.querySelectorAll('.button-filter');
    	let activeButton = document.querySelector(selector);

    	filterButtons.forEach(filterButton => {
    		filterButton.classList.remove('is-active');
    	});

    	activeButton.classList.add('is-active');
    }

    function insertAfter(referenceNode, newNode) {
    	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let covidData;
    	let filteredData;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	function getSemesterStart() {
    		return new Date(filterEndDate - 7 * 24 * 60 * 60 * 1000);
    	}

    	/**
     * Sets filter dates to past seven days
     */
    	function setFilterLastSevenDays() {
    		$$invalidate(1, filterStartDate = getDaysAgo(7));
    		$$invalidate(0, filterEndDate = getToday());
    		setActiveFilter('.filter-seven-days');
    	}

    	/**
     * Sets filter dates to past thirty days
     */
    	function setFilterLastThirtyDays() {
    		$$invalidate(1, filterStartDate = getDaysAgo(30));
    		$$invalidate(0, filterEndDate = getToday());
    		setActiveFilter('.filter-thirty-days');
    	}

    	/**
     * Sets filter dates to past thirty days
     */
    	function setFilterThisSemester() {
    		$$invalidate(1, filterStartDate = new Date("2021/09/02"));
    		$$invalidate(0, filterEndDate = new Date("2021/12/08"));
    		setActiveFilter('.filter-semester');
    	}

    	/**
     * Set up default dates
     *
     * @since 2.0
     */
    	let filterEndDate = getToday();

    	let filterStartDate = getDaysAgo(7);
    	let isStartDateChosen = false;
    	let isEndDateChosen = false;
    	const parseTime = timeParse("%m/%d/%y");
    	const formatDate = timeFormat("%m/%d/%y");
    	let baseDir;
    	baseDir = DEV_BASE_DIR;

    	if ("localhost" === window.location.hostname) {
    		baseDir = LOCAL_BASE_DIR;
    	}

    	csv$1(baseDir + "/datasets/covidupdate_testData.csv").then(function (data, i) {
    		data.forEach(function (d, i) {
    			Object.keys(d).forEach(function (j) {
    				if (j === "Date" || j === "Mass. Positive Rate") {
    					d[j] = d[j];
    				} else {
    					d[j] = parseFloat(d[j]);
    				}
    			});
    		});

    		$$invalidate(2, covidData = data);
    	});

    	// NEED THESE TO CYCLE THROUGH THE HEADERS OF THE GOOGLE SHEET
    	// Dynamically figure out the width of CSS grid items.
    	let width = document.getElementById('covid-testing-dashboard').getBoundingClientRect().width;

    	let width_donut = Math.min(width, 175);
    	let width_stacked = 20;
    	let height = 500;

    	// height = Math.min(height, 500);
    	if (window.innerWidth > 600) {
    		width_donut = width * 0.22;
    		width_stacked = width * 0.5;
    		height = width * 0.6;
    	}

    	// These are the columns for the table portion; this configuration is passed to the SvelteTable plugin
    	const columns = [
    		{
    			key: "Date",
    			title: "Date",
    			value: v => new Date(v["Date"]),
    			renderValue: v => v["Date"],
    			sortable: true,
    			headerClass: "text-left",
    			class: "date-col"
    		},
    		{
    			key: "Tests Completed",
    			title: "Tests Completed",
    			value: v => v["Tests Completed"],
    			sortable: true,
    			headerClass: "text-left"
    		},
    		{
    			key: "Negative Tests",
    			title: "Negative Tests",
    			value: v => v["Negative Tests"],
    			sortable: true,
    			headerClass: "text-left"
    		},
    		{
    			key: "Negative Rate",
    			title: "Negative Rate",
    			value: v => (v["Negative Tests"] / v["Tests Completed"]).toLocaleString(undefined, {
    				style: 'percent',
    				minimumFractionDigits: 2
    			}),
    			sortable: true,
    			headerClass: "text-left"
    		},
    		{
    			key: "Positive Tests",
    			title: "Positive Tests",
    			value: v => v["Positive Tests"],
    			sortable: true,
    			headerClass: "text-left"
    		},
    		{
    			key: "Positive Rate",
    			title: "Positive Rate",
    			value: v => (v["Positive Tests"] / v["Tests Completed"]).toLocaleString(undefined, {
    				style: 'percent',
    				minimumFractionDigits: 2
    			}),
    			sortable: true,
    			headerClass: "text-left"
    		}
    	];

    	/**
     * Gets the data for the most recent day
     */
    	function getMostRecentEntry(prop) {
    		return covidData[covidData.length - 1][prop];
    	}

    	/**
     * Toggles view of table
     *
     * @since 2.0
     */
    	let initialTableHeight;

    	let fullTableHeight;

    	function toggleTable() {
    		const tableWrapper = document.querySelector('.dash-table-wrapper');
    		const buttonToggleLabel = document.querySelector('.table-button .button-label');
    		const buttonToggleLabelInitial = 'Expand Table';
    		const buttonToggleLabelExpanded = 'Collapse Table';

    		if (!initialTableHeight) {
    			initialTableHeight = tableWrapper.offsetHeight;
    			tableWrapper.style.height = 'auto';
    			fullTableHeight = tableWrapper.offsetHeight;
    			tableWrapper.style.height = initialTableHeight + 'px';
    		}

    		if (tableWrapper.classList.contains('is-expanded')) {
    			tableWrapper.classList.remove('is-expanded');
    			tableWrapper.style.height = initialTableHeight + 'px';
    			buttonToggleLabel.innerText = buttonToggleLabelInitial;
    		} else {
    			tableWrapper.classList.add('is-expanded');
    			tableWrapper.style.height = fullTableHeight + 'px';
    			buttonToggleLabel.innerText = buttonToggleLabelExpanded;
    		}
    	}

    	const writable_props = [];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function datepicker0_selected_binding(value) {
    		filterStartDate = value;
    		$$invalidate(1, filterStartDate);
    	}

    	function datepicker0_dateChosen_binding(value) {
    		isStartDateChosen = value;
    		$$invalidate(3, isStartDateChosen);
    	}

    	function datepicker1_selected_binding(value) {
    		filterEndDate = value;
    		$$invalidate(0, filterEndDate);
    	}

    	function datepicker1_dateChosen_binding(value) {
    		isEndDateChosen = value;
    		$$invalidate(4, isEndDateChosen);
    	}

    	$$self.$capture_state = () => ({
    		GraphicTitle,
    		GraphicFooter,
    		Chart_Donut: Chart_donut,
    		Meter_Chart: Meter_chart,
    		Chart_Bar_Vertical: Chart_bar_vertical,
    		Chart_Wellness_Summary: Wellness_summary,
    		Data_Point: Data_point,
    		SvelteTable,
    		Chart_Covid_Variants: Chart_covid_variants,
    		csv: csv$1,
    		timeFormat,
    		timeParse,
    		negativePositive,
    		Datepicker,
    		meterColumnWidth,
    		meterColumnLength,
    		getToday,
    		getDaysAgo,
    		getSemesterStart,
    		setActiveFilter,
    		setFilterLastSevenDays,
    		setFilterLastThirtyDays,
    		setFilterThisSemester,
    		filterEndDate,
    		filterStartDate,
    		isStartDateChosen,
    		isEndDateChosen,
    		parseTime,
    		formatDate,
    		DEV_BASE_DIR,
    		LOCAL_BASE_DIR,
    		baseDir,
    		width,
    		width_donut,
    		width_stacked,
    		height,
    		columns,
    		getMostRecentEntry,
    		initialTableHeight,
    		fullTableHeight,
    		toggleTable,
    		insertAfter,
    		covidData,
    		filteredData
    	});

    	$$self.$inject_state = $$props => {
    		if ('filterEndDate' in $$props) $$invalidate(0, filterEndDate = $$props.filterEndDate);
    		if ('filterStartDate' in $$props) $$invalidate(1, filterStartDate = $$props.filterStartDate);
    		if ('isStartDateChosen' in $$props) $$invalidate(3, isStartDateChosen = $$props.isStartDateChosen);
    		if ('isEndDateChosen' in $$props) $$invalidate(4, isEndDateChosen = $$props.isEndDateChosen);
    		if ('baseDir' in $$props) baseDir = $$props.baseDir;
    		if ('width' in $$props) $$invalidate(12, width = $$props.width);
    		if ('width_donut' in $$props) $$invalidate(5, width_donut = $$props.width_donut);
    		if ('width_stacked' in $$props) $$invalidate(6, width_stacked = $$props.width_stacked);
    		if ('height' in $$props) $$invalidate(7, height = $$props.height);
    		if ('initialTableHeight' in $$props) initialTableHeight = $$props.initialTableHeight;
    		if ('fullTableHeight' in $$props) fullTableHeight = $$props.fullTableHeight;
    		if ('covidData' in $$props) $$invalidate(2, covidData = $$props.covidData);
    		if ('filteredData' in $$props) $$invalidate(8, filteredData = $$props.filteredData);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*covidData, filterStartDate, filterEndDate*/ 7) {
    			/**
     * Filters test results by date.
     *
     * @since 2.0
     */
    			 $$invalidate(8, filteredData = covidData.filter(function (d) {
    				const START_DATE = new Date(filterStartDate).getTime();
    				const END_DATE = new Date(filterEndDate).getTime();
    				const COMPARE_DATE = new Date(d.Date).getTime();
    				return COMPARE_DATE >= START_DATE && COMPARE_DATE <= END_DATE;
    			}));
    		}
    	};

    	 $$invalidate(2, covidData = []);

    	return [
    		filterEndDate,
    		filterStartDate,
    		covidData,
    		isStartDateChosen,
    		isEndDateChosen,
    		width_donut,
    		width_stacked,
    		height,
    		filteredData,
    		setFilterLastSevenDays,
    		setFilterLastThirtyDays,
    		setFilterThisSemester,
    		width,
    		columns,
    		getMostRecentEntry,
    		toggleTable,
    		datepicker0_selected_binding,
    		datepicker0_dateChosen_binding,
    		datepicker1_selected_binding,
    		datepicker1_dateChosen_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src/charts/BriefHomepage.svelte generated by Svelte v3.42.1 */
    const file$f = "src/charts/BriefHomepage.svelte";

    function create_fragment$f(ctx) {
    	let div3;
    	let div0;
    	let h30;
    	let t1;
    	let span0;
    	let t2_value = /*data*/ ctx[0]["Total Tests"].toLocaleString('en-US') + "";
    	let t2;
    	let t3;
    	let div1;
    	let h31;
    	let t5;
    	let span1;
    	let t6_value = /*data*/ ctx[0]["Total Negative"].toLocaleString('en-US') + "";
    	let t6;
    	let t7;
    	let div2;
    	let h32;
    	let t9;
    	let span2;
    	let t10_value = /*data*/ ctx[0]["Total Positive"].toLocaleString('en-US') + "";
    	let t10;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Tests Completed";
    			t1 = space();
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Negative Tests";
    			t5 = space();
    			span1 = element("span");
    			t6 = text(t6_value);
    			t7 = space();
    			div2 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Positive Tests";
    			t9 = space();
    			span2 = element("span");
    			t10 = text(t10_value);
    			attr_dev(h30, "class", "svelte-6s1zcw");
    			add_location(h30, file$f, 53, 2, 829);
    			attr_dev(span0, "class", "brief-stat svelte-6s1zcw");
    			add_location(span0, file$f, 54, 2, 856);
    			attr_dev(div0, "class", "brief-grid-item svelte-6s1zcw");
    			add_location(div0, file$f, 52, 1, 797);
    			attr_dev(h31, "class", "svelte-6s1zcw");
    			add_location(h31, file$f, 57, 2, 977);
    			attr_dev(span1, "class", "brief-stat svelte-6s1zcw");
    			add_location(span1, file$f, 58, 2, 1003);
    			attr_dev(div1, "class", "brief-grid-item svelte-6s1zcw");
    			add_location(div1, file$f, 56, 1, 945);
    			attr_dev(h32, "class", "posheader svelte-6s1zcw");
    			add_location(h32, file$f, 61, 2, 1127);
    			attr_dev(span2, "class", "brief-stat svelte-6s1zcw");
    			add_location(span2, file$f, 62, 2, 1171);
    			attr_dev(div2, "class", "brief-grid-item svelte-6s1zcw");
    			add_location(div2, file$f, 60, 1, 1095);
    			attr_dev(div3, "class", "homepagebrief svelte-6s1zcw");
    			attr_dev(div3, "id", "homepagebrief");
    			add_location(div3, file$f, 51, 0, 734);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, h30);
    			append_dev(div0, t1);
    			append_dev(div0, span0);
    			append_dev(span0, t2);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			append_dev(div1, h31);
    			append_dev(div1, t5);
    			append_dev(div1, span1);
    			append_dev(span1, t6);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, h32);
    			append_dev(div2, t9);
    			append_dev(div2, span2);
    			append_dev(span2, t10);
    			/*div3_binding*/ ctx[2](div3);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data*/ 1 && t2_value !== (t2_value = /*data*/ ctx[0]["Total Tests"].toLocaleString('en-US') + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*data*/ 1 && t6_value !== (t6_value = /*data*/ ctx[0]["Total Negative"].toLocaleString('en-US') + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*data*/ 1 && t10_value !== (t10_value = /*data*/ ctx[0]["Total Positive"].toLocaleString('en-US') + "")) set_data_dev(t10, t10_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			/*div3_binding*/ ctx[2](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BriefHomepage', slots, []);
    	let el;
    	let { data = { data } } = $$props;
    	data = data[data.length - 1]; // only get the latest day's info
    	const writable_props = ['data'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BriefHomepage> was created with unknown prop '${key}'`);
    	});

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(1, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	$$self.$capture_state = () => ({ onMount, el, data });

    	$$self.$inject_state = $$props => {
    		if ('el' in $$props) $$invalidate(1, el = $$props.el);
    		if ('data' in $$props) $$invalidate(0, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [data, el, div3_binding];
    }

    class BriefHomepage extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { data: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BriefHomepage",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get data() {
    		throw new Error("<BriefHomepage>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<BriefHomepage>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/BriefOnly.svelte generated by Svelte v3.42.1 */

    // (58:0) {#if coviddata.length > 0}
    function create_if_block$3(ctx) {
    	let briefhomepage;
    	let current;

    	briefhomepage = new BriefHomepage({
    			props: { data: /*coviddata*/ ctx[0] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(briefhomepage.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(briefhomepage, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const briefhomepage_changes = {};
    			if (dirty & /*coviddata*/ 1) briefhomepage_changes.data = /*coviddata*/ ctx[0];
    			briefhomepage.$set(briefhomepage_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(briefhomepage.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(briefhomepage.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(briefhomepage, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(58:0) {#if coviddata.length > 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*coviddata*/ ctx[0].length > 0 && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*coviddata*/ ctx[0].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*coviddata*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let coviddata;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('BriefOnly', slots, []);
    	const todaysDate = new Date();
    	const dateCode = todaysDate.getTime();
    	const url = 'https://spreadsheets.google.com/feeds/cells/1C8PDCqHB9DbUYbvrEMN2ZKyeDGAMAxdcNkmO2QSZJsE/1/public/full?alt=json&date=' + dateCode;
    	const parseTime = timeParse("%-m/%d/%y");
    	const formatDate = timeFormat("%-m/%d/%y");

    	const headings = [
    		"Date",
    		"Tests Completed",
    		"Positive Tests",
    		"Negative Tests",
    		"Students Positive",
    		"FacStaff Positive",
    		"Contracted Positive",
    		"Students in Isolation On Campus",
    		"Students in Isolation Off Campus",
    		"Students in Quarantine On Campus",
    		"Students in Quarantine Off Campus",
    		"Students Recovered On Campus",
    		"Students Recovered Off Campus",
    		"Mass. Positive Rate",
    		"Seven-Day Tests",
    		"Seven-Day Positive",
    		"Seven-Day Negative",
    		"Total Tests",
    		"Total Positive",
    		"Total Negative",
    		"Total Students Positive",
    		"Total FacStaff Positive",
    		"Total Contracted Positive"
    	];

    	json(url).then(function (data, i) {
    		let rowcount = data.feed.entry.length / headings.length - 1;
    		let loadeddata = [];

    		for (let r = 0; r < rowcount; r++) {
    			loadeddata[r] = {};
    		}

    		data.feed.entry.filter(d => d.gs$cell.row !== "1").forEach(function (d, i) {
    			let colno = parseFloat([d.gs$cell.col]) - 1;

    			if (colno === 0) {
    				loadeddata[parseFloat([d.gs$cell.row]) - 2][headings[colno]] = formatDate(parseTime(d.gs$cell.inputValue));
    			} else if (colno > 6 && colno < 14) {
    				loadeddata[parseFloat([d.gs$cell.row]) - 2][headings[colno]] = d.gs$cell.inputValue;
    			} else {
    				loadeddata[parseFloat([d.gs$cell.row]) - 2][headings[colno]] = parseFloat(d.gs$cell.numericValue);
    			}
    		});

    		let len = loadeddata.length;

    		for (let k = 0; k < len - 31; k++) {
    			loadeddata.shift();
    		}

    		$$invalidate(0, coviddata = loadeddata);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<BriefOnly> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		BriefHomepage,
    		csv: csv$1,
    		json,
    		timeParse,
    		timeFormat,
    		todaysDate,
    		dateCode,
    		url,
    		parseTime,
    		formatDate,
    		headings,
    		coviddata
    	});

    	$$self.$inject_state = $$props => {
    		if ('coviddata' in $$props) $$invalidate(0, coviddata = $$props.coviddata);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	 $$invalidate(0, coviddata = []);
    	return [coviddata];
    }

    class BriefOnly extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BriefOnly",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    let exporter = {};

    if (document.getElementById('covid-testing-dashboard')) {
    	const app = new App({
    		target: document.getElementById('covid-testing-dashboard')
    	});

    	exporter["app"] = app;
    }

    if (document.getElementById('homepage-dashboard-brief')) {
    	const homepagebrief = new BriefOnly({
    		target: document.getElementById('homepage-dashboard-brief')
    	});

    	exporter["homepagebrief"] = homepagebrief;
    }

    return exporter;

}());
//# sourceMappingURL=bundle.js.map
