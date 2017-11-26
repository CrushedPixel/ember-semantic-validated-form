import Ember from 'ember';
import layout from '../templates/components/semantic-validated-form-control';

export default Ember.Component.extend({
  layout,

  classNameBindings: ['outerClass'],

  model: null,
  property: null, // must be set initially

  showError: false,
  focusLeft: false,

  // the message displayed by the error popup
  errorPopupMessage: null,

  init() {
    this._super(...arguments);

    const property = this.get('property');
    if (property === null) {
      throw new Error('semantic-validated-form: \'property\' must be set upon initialization');
    }

    this.displayError = Ember.computed('showError', 'focusLeft', `model.validations.attrs.${property}.isInvalid`,
      function() {
        const invalid = this.get(`model.validations.attrs.${property}.isInvalid`);
        return (this.get('showError') || this.get('focusLeft')) && invalid;
      }
    );

    const updateErrorPopupMessage = function() {
      const message = this.get(`model.validations.attrs.${property}.message`);

      // only update the errorPopupMessage if it isn't empty.
      // this way, the popup doesn't get empty for a split second
      // before being closed by the hidePopup observer.
      if (message) {
        this.set('errorPopupMessage', message);
      }
    }.bind(this);

    // invoke it once to set the initial message
    updateErrorPopupMessage();
    Ember.addObserver(this, `model.validations.attrs.${property}.message`, updateErrorPopupMessage);
  },

  outerClass: Ember.computed('displayError', function() {
    return this.get('displayError') ? 'field error' : 'field';
  }),

  hidePopup: Ember.observer('displayError', function() {
    if (!this.get('displayError')) {
      this.$('.popup').popup('hide');
    }
  }),

  actions: {
    onFocusOut() {
      this.set('focusLeft', true);
    },

    onShowPopup() {
      // only allow the error message popup to show
      // if the property is invalid
      return this.get('displayError');
    }
  }

});
