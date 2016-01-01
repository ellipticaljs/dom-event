//umd pattern

(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-class'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-class'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical=root.elliptical || {};
        root.elliptical.DomEvent=factory(root.elliptical.Class);
        root.returnExports = root.elliptical.DomEvent;
    }
}(this, function (Class) {

    var SCROLL_EVENT='scroll.infinite';
    var SCROLL_TOLERANCE=100;

    return Class.extend({
        _events:[],
        _node:null,
        _context:this,

        events:{},

        event:function(element, event, selector, callback){
            var obj = {};
            obj.element = element;
            obj.event = event;

            //support 3-4 params
            var length = arguments.length;
            if (length === 3) {
                callback = (typeof selector === 'function') ? selector : null;
                selector = null;
            }
            obj.selector = selector;
            obj.callback = callback;
            this._events.push(obj);
            if (selector) {
                element.on(event, selector, function () {
                    var args = [].slice.call(arguments);
                    if (callback) callback.apply(this._context, args);
                });
            } else {
                element.on(event, function () {
                    var args = [].slice.call(arguments);
                    if (callback) callback.apply(this._context, args);
                });
            }
        },

        bind:function(){
            var events=this._events;
            for(var prop in events){
                if(events.hasOwnProperty(prop)){
                    this._bindEvent(events,prop)
                }
            }
        },

        unbind:function(){
            var events = this._events;
            var length = events.length;
            for (var i = 0; i < length; i++) {
                var obj = events[i];
                (obj.selector) ? obj.element.off(obj.event, obj.selector) : obj.element.off(obj.event);
            }
            events.length = 0;
        },

        onScroll:function(){
            var handleScroll=function(){
                var diff=$(document).height() - $(window).height();
                if ($(window).scrollTop() > (diff-SCROLL_TOLERANCE)) {
                    if(callback) callback();
                }
            };
            var bindScroll=function(){
                window.requestAnimationFrame(handleScroll)
            };
            this.event($(window),SCROLL_EVENT,bindScroll );
        },

        scrollOff:function(){
            var events = this._events;
            var length = events.length;
            for (var i = 0; i < length; i++) {
                var obj = events[i];
                if(obj.event===SCROLL_EVENT){
                    (obj.selector) ? obj.element.off(obj.event, obj.selector) : obj.element.off(obj.event);
                    events.splice(i);
                    break;
                }
            }
        },

        _click:function(){
            return ('ontouchend' in document) ? 'touchstart' : 'click';
        },

        _press:function(){
            return ('ontouchend' in document) ? 'touchend' : 'click';
        },

        _tap:function(){
            return ('ontouchend' in document) ? 'tap' : 'click';
        },

        _getEvent:function(evt){
            if(evt==='click') return this._click();
            else if(evt==='press') return this._press();
            else if(evt==='tap') return this._tap();
            else return evt;
        },

        _bindEvent:function(events,prop){
            var event;
            var callback=events[prop];
            var eventParams=prop.split('@');
            var length=eventParams.length;
            if(length===1){
                event=this._getEvent(eventParams[0]);
                this.event(this._node,event,callback);
            }else if(length===2){
                var selector=eventParams[0];
                event=this._getEvent(eventParams[1]);
                if(selector==='document') this.event($(document),event,callback);
                if(selector==='window') this.event($(window),event,callback);
                else this.event(this.element,event,selector,callback)
            }
        }

    },{

        init:function(node,context){
            if(node && node !==undefined) {
                if(node.nodeName !==undefined) this.constructor._node=$(node);
            }
            if(context && context !==undefined) this.constructor._context=context;
        },

        event:function(element, event, selector, callback){
            this.constructor.event(element,event,selector,callback);
        },

        bind:function(){
            this.constructor.bind();
        },

        unbind:function(){
            this.constructor.unbind();
        },

        onScroll:function(){
            this.constructor.onScroll();
        },

        scrollOff:function(){
            this.constructor.scrollOff();
        }

    });
}));

