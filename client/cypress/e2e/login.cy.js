describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://studenttaskdeadlinetracker.netlify.app/login')
    cy.get('#root [name="email"]').click();
    cy.get('#root [name="email"]').type('test1@email.com');
    cy.get('#root [name="password"]').click();
    cy.get('#root [name="password"]').type('123456');
    cy.get('#root button.css-1ybtx5q').click();
    cy.get('#root div.css-1ggmdmd button:nth-child(2)').click();
    cy.get('#root button.css-1a563oh').click();
    cy.get('input[required=""]').click();
    cy.get('input[required=""]').type('Java');
    cy.get('textarea[aria-invalid="false"]').click();
    cy.get('textarea[aria-invalid="false"]').type('Java course');
    cy.get('div:nth-child(3) > div.css-ws9ald > input.css-1pk1fka').click();
    cy.get('input[type="date"]').first().click();
    cy.get('input[placeholder="Example: Monday & Wednesday, 10:00 AM"]').click();
    cy.get('input[placeholder="Example: Monday & Wednesday, 10:00 AM"]').type('Friday, 12:30pm');
    cy.get('button.css-go06f4').click();
  })
})