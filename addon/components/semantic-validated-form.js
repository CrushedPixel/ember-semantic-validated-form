import Ember from 'ember';
import layout from '../templates/components/semantic-validated-form';

export default Ember.Component.extend({
  layout,

  tagName: 'form',
  classNames: 'ui form',

  // the model to validate. set this in template
  model: null,

  // whether pressing the enter key should try to submit the form
  submitOnEnter: true,

  // action to be called when the model was successfully validated
  onSuccess: null,

  // action to be called when the model validation failed
  onFailure: null,

  showError: false,

  isValid: Ember.computed.alias('model.validations.isValid'),

  // ember event handler
  keyDown(event) {
    if (this.get('submitOnEnter') && event.keyCode === 13) {
      this._onSubmit()
    }
  },

  _onSubmit() {
    if (this.get('isValid')) {
      const onSuccess = this.get('onSuccess');
      if (!onSuccess) {
        throw new Error('semantic-validated-form: onSuccess must be set');
      }
      onSuccess();
    } else {
      this.set('showError', true);

      const onFailure = this.get('onFailure');
      if (onFailure) {
        onFailure();
      }
    }
  },

  actions: {
    submit() {
      this._onSubmit();
    }
  }

});
