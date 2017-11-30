# ember-semantic-validated-form

Simple validated form component for [Semantic UI](https://github.com/Semantic-Org/Semantic-UI-Ember).

Uses [ember-cp-validations](https://github.com/offirgolan/ember-cp-validations) for form validation. 

## Installation

```
ember install ember-semantic-validated-form
```

### Example usage
The following code outlines an exemplary `signup-form` component:

```js
// components/signup-form.js
import Ember from 'ember';
import { buildValidations, validator } from 'ember-cp-validations';

// ember-cp-validations model. For examples and instructions, 
// visit http://offirgolan.github.io/ember-cp-validations/
const Validations = buildValidations({
  username: [
    validator('presence', true),
    validator('format', {
      regex: /^[a-zA-Z0-9-$_]+$/,
      message: 'Username may only contain letters, numbers, $ and _'
    }),
    validator('length', {
      min: 1,
      max: 39
    })
  ],

  email: [
    validator('presence', true),
    validator('format', {
      type: 'email'
    })
  ],

  password: [
    validator('presence', true),
    validator('length', {
      min: 6
    })
  ],

  passwordConfirmation: [
    validator('presence', true),
    validator('confirmation', {
      on: 'password',
      message: 'Passwords do not match'
    })
  ]
});

const SignupModel = Ember.Object.extend(Validations, {
  username: null,
  email: null,
  password: null,
  passwordConfirmation: null
});

export default Ember.Component.extend({

  session: Ember.inject.service(),
  router: Ember.inject.service(),

  signupModel: null,

  init() {
    this._super(...arguments);
    // Owner injection is required to validate non-ember-data objects.
    this.set('signupModel', SignupModel.create(Ember.getOwner(this).ownerInjection()));
  },

  actions: {
    signup() {
      const username = this.get('signupModel.username');
      const email = this.get('signupModel.email');
      const password = this.get('signupModel.password');
      
      // your signup code goes here.
    }
  }
});

```


```hbs
{{!templates/components/signup-form.hbs}}
<h1 class="ui top attached header">Create Account</h1>
{{#semantic-validated-form
  class="ui bottom attached form segment"
  model=signupModel
  onSuccess=(action "signup")
as |form|}}
  {{#form.control
    class="required"
    property="username"
    label="Username"
  as |control|}}
    {{input
      value=control.value
      placeholder="Enter Username"
      maxlength=20
      focus-out=control.focus-out
    }}
  {{/form.control}}
  {{#form.control
    class="required"
    property="email"
    label="E-mail"
  as |control|}}
    {{input
      value=control.value
      placeholder="Enter E-Mail address"
      focus-out=control.focus-out
    }}
  {{/form.control}}
  {{#form.control
    class="required"
    property="password"
    label="Password"
  as |control|}}
    {{input
      value=control.value
      placeholder="Enter Password"
      focus-out=control.focus-out
      type="password"
    }}
  {{/form.control}}
  {{#form.control
    class="required"
    property="passwordConfirmation"
    label="Confirm Password"
  as |control|}}
    {{input
      value=control.value
      placeholder="Repeat Password"
      focus-out=control.focus-out
      type="password"
    }}
  {{/form.control}}
  {{#form.button class="fluid"}}
    Sign up
  {{/form.button}}
{{/semantic-validated-form}}
```

### Notes
The `onSuccess` action is invoked when the `form.button` is pressed while the model is valid.  
An optional `onFailure` action is invoked if the model is invalid.

The `control.focus-out` action should be bound to the control's `input` component, if applicable, to mark the field red 
if it's left with invalid content. 
