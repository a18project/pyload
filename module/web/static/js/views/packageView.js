define(['jquery', 'app', 'views/abstract/itemView', 'underscore'],
    function($, App, itemView, _) {

        // Renders a single package item
        return itemView.extend({

            tagName: 'li',
            className: 'package-view',
            template: _.compile($("#template-package").html()),
            events: {
                'click .package-name, .btn-open': 'open',
                'click .iconf-refresh': 'restart',
                'click .select': 'select',
                'click .btn-delete': 'deleteItem'
            },

            // Ul for child packages (unused)
            ul: null,
            // Currently unused
            expanded: false,

            initialize: function() {
                this.listenTo(this.model, 'filter:added', this.hide);
                this.listenTo(this.model, 'filter:removed', this.show);
                this.listenTo(this.model, 'change', this.render);
                this.listenTo(this.model, 'remove', this.unrender);

                // Clear drop down menu
                var self = this;
                this.$el.on('mouseleave', function() {
                    self.$('.dropdown-menu').parent().removeClass('open');
                });
            },

            onDestroy: function() {
            },

            // Render everything, optional only the fileViews
            render: function() {
                this.$el.html(this.template(this.model.toJSON()));
                this.$el.initTooltips();

                return this;
            },

            unrender: function() {
                itemView.prototype.unrender.apply(this);

                // TODO: display other package
                App.vent.trigger('dashboard:loading', null);
            },


            // TODO
            // Toggle expanding of packages
            expand: function(e) {
                e.preventDefault();
            },

            open: function(e) {
                e.preventDefault();
                App.dashboard.openPackage(this.model);
            },

            select: function(e) {
                e.preventDefault();
                var checked = this.$('.select').hasClass('iconf-check');
                // toggle class immediately, so no re-render needed
                this.model.set('selected', !checked, {silent: true});
                this.$('.select').toggleClass('iconf-check').toggleClass('iconf-check-empty');
                App.vent.trigger('package:selection');
            }
        });
    });