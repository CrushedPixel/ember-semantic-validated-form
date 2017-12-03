import Ember from 'ember';
import layout from '../templates/components/semantic-validated-form-button';

export default Ember.Component.extend({
  layout,
  tagName: 'button',

  attributeBindings: ['type'],
  type: 'button',

  classNames: 'ui button',
  classNameBindings: ['displayClasses'],

  displayClasses: Ember.computed('enabled', function() {
    if (this.get('enabled')) {
      return 'positive';
    } else {
      return 'basic negative';
    }
  }),

  click: function() {
    this.get('submit')()
  }
});
