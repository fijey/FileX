/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('expandFolder', () => {
  cy.get('.lucide-chevron-down-icon').should('be.visible').first().click()
  cy.wait('@getFolders')
})

Cypress.Commands.add('selectFolder', (index = 1) => {
  cy.get('.title').should('have.length.at.least', index + 1)
  cy.get('.title').eq(index).should('be.visible').click()
  cy.wait('@getFolders')
})

Cypress.Commands.add('searchFolder', (searchTerm) => {
  cy.get('input[type="text"]').should('be.visible').type(searchTerm)
  cy.get('button').contains('Search').click()
  cy.wait('@getFolders')
})

declare global {
  namespace Cypress {
    interface Chainable {
      expandFolder(): Chainable<void>
      selectFolder(index?: number): Chainable<void>
      searchFolder(searchTerm: string): Chainable<void>
    }
  }
}