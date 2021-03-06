/**
 * Copyright 2012 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * framework/BaseView
 *
 * Based on: https://github.com/rmurphey/srchr-demo/blob/master/app/views/base.js
 * License:  https://github.com/rmurphey/srchr-demo/blob/master/LICENSE.md
 *
 * This is a view base class built on top of the default Backbone.View; it
 * provides a set of rendering, binding, and lifecycle methods that tend to
 * be useful in Backbone applications. As part lifecycle methods, it provides
 * the facility to maintain a set of child views, especially to avoid zombies.
 *
 * To use this view, you should call its `extend` method just like you would
 * extend the normal `Backbone.View`.
 *
 * @author Naresh Bhatia
 */
define(
    [
        'backbone',
        'handlebars',
        'jquery',
        'underscore'
    ],
    function(Backbone, Handlebars, $, _) {
        'use strict';

        // Global template cache
        var _templates = {};

        return Backbone.View.extend({

            // Override the constructor to add per-instance configuration
            constructor: function() {
                // Create a per instance children property.
                // It is a map of unique child ids to child views.
                // The child id can be a number or string, e.g. the id of the associated model
                this.children = {};

                // Call super
                Backbone.View.apply(this, arguments);
            },

            addChild: function(childSpec) {

                // Create the child
                var child = new childSpec.viewClass(childSpec.options).render();

                // Add it to the children map
                this.children[childSpec.id] = child;

                // If the parent element is supplied, place the child under the parent
                if (childSpec.parentElement) {
                    child.place(childSpec.parentElement);
                }

                // console.log('addChild: ' + childSpec.id);

                return child;
            },

            addChildren: function(childSpecs) {
                for (var i = 0, l = childSpecs.length; i < l; i++) {
                    this.addChild(childSpecs[i]);
                }
            },

            // Destroys the view and all its children recursively, unbinding their events
            destroy: function() {
                this.destroyChildren();
                this.remove();
            },

            // Destroys all the children of this view recursively, unbinding their events
            destroyChildren: function() {
                var children = this.children;
                for (var id in children) {
                    if (children.hasOwnProperty(id)) {
                        children[id].destroy();
                        // console.log('destroyChild: ' + id);
                        delete children[id];
                    }
                }
            },

            // Destroys the specified child of this view, unbinding its events
            destroyChild: function(id) {
                var children = this.children;
                children[id].destroy();
                delete children[id];
            },

            // ### `render`
            //
            // This method expects the derived class to supply a template.name and
            // a template.source
            render: function() {
                var template = this.getTemplate();
                var model = this.model || {};

                // If the model contains a toJSON method, call it to create the context
                var context = model.toJSON ? model.toJSON() : {};

                // Destroy existing children
                this.destroyChildren();

                this.$el.html(template(context));
                this._setupElements();

                this.postRender();
                return this;
            },

            getTemplate: function() {
                if (!_templates[this.template.name]) {
                    _templates[this.template.name] = Handlebars.compile(this.template.source);
                }

                return _templates[this.template.name];
            },
            
            template: {
                name: 'DefaultTemplate',
                source: '<div></div>'
            },

            // ### `elements`
            //
            // If you would like to store references to certain elements in your
            // template for later use, you can indicate those elements by doing *both*
            // of the following:
            //
            // - adding a classname beginning with `js-` to the elements in your template
            // - listing the classname suffix in your view's `elements` array
            //
            // For example, if your template contains the following:
            //
            //    `<div class="js-interesting"></div>`
            //
            // And your view's `elements` array is:
            //
            //    `[ 'interesting' ]`
            //
            // Then your view will have a property `interestingElement` that references
            // a jQuery object for the div.
            elements : [],

            // ### `_setupElements`
            //
            // The `_setupElements` method is a "private" method for storing references
            // to elements as indicated by the view's `elements` property.
            _setupElements : function() {
                if (this.elements) {
                    _.each(this.elements, function(c) {
                        this[c + 'Element'] = this.$('.js-' + c).eq(0);
                    }, this);
                }
            },

            // ### `place`
            //
            // Once the view has been rendered, it still needs to be placed in the
            // document. The `place` method allows you to specify a destination for
            // the view; this destination can either be a jQuery object, a DOM node,
            // or a selector. The `place` method also optionally takes a position
            // argument, which determines how the object will be placed in the
            // destination node: as the first, last, or only child.
            place: function(node, position) {
                position = position || 'last';

                var method = {
                    'first':     'prepend',
                    'last':      'append',
                    'only':      'html'
                }[position] || 'append';

                $(node)[method](this.$el);

                this.postPlace();
                return this;
            },

            // ## Lifecycle Methods
            //
            // These methods are stubs for implementation by your views. These methods
            // fire after their respective methods are complete.

            // ### `postRender`
            //
            // `postRender` fires just before the view's `render` method returns. Do
            // things here that require the view's basic markup to be in place, but
            // that do NOT require the view to be placed in the document.
            postRender: function() {
            },

            // ### `postPlace`
            //
            // `postPlace` fires just before the view's `place` method returns. Do
            // things here that require the view to be placed in the document, such as
            // operations that require knowing the dimensions of the view.
            postPlace: function() {
            }
        });
    }
);