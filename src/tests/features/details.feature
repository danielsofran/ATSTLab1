Feature: View a product's details
  As a user
  I want to access a product's details
  So I know if I really want to purchase it or not

  Scenario: Fail to add a product to cart when not selecting size and color
    When I search for a product with the keyword "shirt"
    And I view the 1nth product details
    And I click the "Add to Cart" button from the details page
    Then I should see 2 error messages indicating that some fields are required

  Scenario: Add product to cart after selecting size and color
    When I search for a product with the keyword "shirt"
    And I view the 1nth product details
    And I select the size XS and color Indigo from the details page
    And I click the "Add to Cart" button from the details page
    Then The cart should contain the product

  Scenario: Zoom in a product's picture
    When I search for a product with the keyword "shirt"
    And I view the 1nth product details
    Then I should be able to zoom in the product's picture

#    Then I should see the following information on the details page:
#      | property     | value                                                                                          |
#      | name         | Core Striped Sport Shirt                                                                       |
#      | price        | $125.00                                                                                        |
#      | reviews      | 1                                                                                              |
#      | colors       | indigo                                                                                         |
#      | sizes        | XS, S, M, L, XL                                                                                |
#      | shortDesc    | This grommet closure sports shirt is wrinkle free straight from the dryer.                     |
#      | description  | Slim fit. Two chest pockets. Silver grommet detail. Grinding and nicking at hems. 100% cotton. |
#      | inf.occasion | Casual                                                                                         |
#      | inf.type     | Polos                                                                                          |
#      | inf.gender   | Male                                                                                           |
#      | inf.gender   | Male                                                                                           |
