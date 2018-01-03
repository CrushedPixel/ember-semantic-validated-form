import Ember from 'ember';
import layout from '../templates/components/semantic-validated-form-control';
import EmberUUID from 'ember-uuid';

export default Ember.Component.extend({
  layout,

  classNameBindings: ['outerClass'],

  outerClass: Ember.computed('displayError', function() {
    return this.get('displayError') ? 'field error' : 'field';
  }),

  model: null,
  property: null, // must be set initially

  showError: false,
  focusLeft: false,
  wasValid: false, // whether the property was valid at least once

  hasError: false,
  popupMessage: undefined,
  popupId: Ember.computed(EmberUUID.v4),

  init() {
    this._super(...arguments);

    const property = this.get('property');
    if (property === null) {
      throw new Error('semantic-validated-form: \'property\' must be set upon initialization');
    }

    this.displayError = Ember.computed('showError', 'focusLeft', `model.validations.attrs.${property}.isInvalid`,
      function() {
        const invalid = this.get(`model.validations.attrs.${property}.isInvalid`);
        return this.get('showError') || ((this.get('focusLeft') || this.get('wasValid')) && invalid);
      }
    );

    const observerFunc = function() {
      if (this.get(`model.validations.attrs.${property}.isValid`)) {
        this.set('wasValid', true);
      }

      let message = this.get(`model.validations.attrs.${property}.message`);

      const p = this.$('.popup-trigger');
      if (!p.popup('exists')) {
        p.popup({
          popup: `#${this.get('popupId')}`,
          onShow: () => {
            // if displayError is undefined, the result of the && expression is undefined as well,
            // causing the popup to be displayed. therefore, ensure the result of the expression is true
            return (this.get('displayError') && this.get('hasError')) === true
          }
        });
      }

      const hasError = message !== undefined;
      this.set('hasError', hasError);

      if (hasError) {
        if (this.get('displayError')) {
          p.popup('show');
        }

        // only change the displayed popup message if it's not empty,
        // to avoid the value becoming empty before the popup hiding transition is finished
        this.set('popupMessage', message);
      } else {
        p.popup('hide');
      }
    }.bind(this);


    Ember.addObserver(this, `model.validations.attrs.${property}.message`, observerFunc);
    Ember.addObserver(this, `model.validations.attrs.${property}.isInvalid`, observerFunc);

    Ember.run.scheduleOnce('afterRender', observerFunc);
  },

  actions: {
    onFocusOut() {
      this.set('focusLeft', true);
    }
  }

});
