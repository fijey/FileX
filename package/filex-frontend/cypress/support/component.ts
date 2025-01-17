// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

import { mount } from 'cypress/vue'
import { createPinia, setActivePinia } from 'pinia'

// Create and activate Pinia instance before each test
beforeEach(() => {
  const pinia = createPinia()
  setActivePinia(pinia)
})

// Add mount command with Pinia support
Cypress.Commands.add('mount', (component, options = {}) => {
  return mount(component, {
    global: {
      plugins: [createPinia()]
    },
    ...options,
  })
})

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// Example use:
// cy.mount(MyComponent)