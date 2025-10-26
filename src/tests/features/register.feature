Feature: Register
  As a new user
  I want to register an account
  So that I can access member-only features

  Scenario Outline: Successful registration with valid details
    When I navigate to the registration page
    And I fill in the registration form with the following valid details:
      | firstName   | lastName   | email   | password   | confirmation   |
      | <firstName> | <lastName> | <email> | <password> | <confirmation> |
    Then I should see a register confirmation message

    Examples:
      | firstName | lastName | email           | password | confirmation |
      | test-7    | test-7   | test-7@test.com | test-7   | test-7       |
      | test-8    | test-8   | test-8@test.com | test-8   | test-8       |
#      | John      | Doe      | john.doe@test.com   | john.doe   | john.doe     |
#      | Jane      | Smith    | jane.smith@test.com | jane.smith | jane.smith   |
#      | Alex      | Brown    | alex.brown@test.com | alex.brown | alex.brown   |
