describe('Filex Explorer Tests', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/v1/folders**').as('getFolders')
    cy.visit('http://localhost:3001')
    cy.wait('@getFolders')
    cy.get('.grid').should('exist')
  })

  it('should expand folder when chevron is clicked', () => {
    cy.expandFolder()
    cy.get('.rounded-lg').should('be.visible')
  })

  it('should select folder and display contents', () => {
    cy.expandFolder()
    cy.selectFolder(1)
    
    cy.get('.text-lg.font-semibold.mb-4')
      .should('be.visible')
      .should('not.be.a', 'Root Folder')
    cy.get('.grid.grid-cols-3').should('be.visible')
  })

  it('should search folders and display results', () => {
    const searchTerm = 'Folder 2'
    cy.expandFolder()
    cy.selectFolder(1)
    cy.searchFolder(searchTerm)
    
    cy.get('.text-lg.font-semibold.mb-4')
      .should('be.visible')
      .should('contain', 'Search Results')
    cy.get('.folder-name')
      .should('be.visible')
      .should('contain', searchTerm)
  })

  it('should load more folders when show more is clicked', () => {
    cy.expandFolder()
    cy.selectFolder(1)
    
    cy.get('.grid.grid-cols-3 > div')
      .its('length')
      .then(initialCount => {
        cy.get('button').contains('Show More').click()
        cy.wait('@getFolders')
        
        cy.get('.grid.grid-cols-3 > div')
          .its('length')
          .should('be.gt', initialCount)
      })
  })
})