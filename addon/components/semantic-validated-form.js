import Ember from 'ember';
import layout from '../templates/components/semantic-validated-form';

export default Ember.Component.extend({
  layout,

  // the model to validate. set this in template
  model: null,

  tagName: '',

  // action to be called when the model was successfully validated
  onSuccess: null,

  // action to be called when the model validation failed
  onFailure: null,

  showError: false,

  isValid: Ember.computed.alias('model.validations.isValid'),

  actions: {
    async submit() {
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
    }
  }

});
