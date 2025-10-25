Feature: Search a product
  As a user
  I want to search for products
  So that I can find items I want to purchase

  Scenario Outline: Successful product search with valid keywords
    When I search for a product with the keyword "<keyword>"
    Then I should see <number> search results related to "<keyword>"

    Examples:
      | keyword | number |
      | shirt   | 4      |
      | dress   | 7      |

  Scenario: Search results contain expected products in sorted order
    When I search for a product with the keyword "shirt"
    And I sort the search results by name
    Then I should see the following products in search results:
      | name                            | price   | oldPrice | rating | colors                           |
      | Core Striped Sport Shirt        | $125.00 |          | 100%   | indigo                           |
      | French Cuff Cotton Twill Oxford | $190.00 |          |        | white                            |
      | Plaid Cotton Shirt              | $160.00 |          |        | royal blue, charcoal, khaki, red |
      | Slim fit Dobby Oxford Shirt     | $140.00 | $175.00  |        | blue                             |

  Scenario: Filter search results
    When I enter the "Men" category and choose the "Shirts" subcategory
    And I apply the price range filter "$140.00 - $149.99"
    Then I should see the following products in search results:
      | name                        | price   | oldPrice | rating | colors       |
      | Slim fit Dobby Oxford Shirt | $140.00 | $175.00  |        | blue         |
