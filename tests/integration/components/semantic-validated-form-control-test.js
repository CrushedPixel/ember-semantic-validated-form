import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('semantic-validated-form-control', 'Integration | Component | semantic validated form control', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{semantic-validated-form-control}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#semantic-validated-form-control}}
      template block text
    {{/semantic-validated-form-control}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
