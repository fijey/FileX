import Search from '../../src/presentation/components/ui/Search.vue'
import { createPinia, setActivePinia } from 'pinia'
import { SearchBloc } from '../../src/presentation/bloc/SearchBloc'

describe('Search.vue', () => {
    beforeEach(() => {
        const pinia = createPinia()
        setActivePinia(pinia)
    })

    it('mounts successfully', () => {
        cy.mount(Search)
        cy.get('.flex.gap-2.relative').should('exist')
    })

    it('should update input value when typing', () => {
        cy.mount(Search)
        cy.get('input.flex-1.bg-white\\/5')
            .type('test query')
            .should('have.value', 'test query')
    })

    it('should trigger search when clicking search button', () => {
        const searchSpy = cy.spy().as('searchSpy')
        cy.stub(SearchBloc.prototype, 'search').as('searchStub').callsFake(searchSpy)
        cy.stub(SearchBloc.prototype, 'resetSearch')
        
        cy.mount(Search)
        cy.get('input.flex-1.bg-white\\/5').type('test query')
        cy.get('button.bg-white\\/5').click()
        cy.get('@searchSpy').should('have.been.calledWith', 'test query')
    })
})