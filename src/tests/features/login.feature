Feature: Login
  As a customer
  I want to log in to my account
  So that I can access my personal information and order history

  Scenario: Successful login with valid credentials
    When I navigate to the login page
    And I enter valid credentials
    Then I should be redirected to my account dashboard

  Scenario: Unsuccessful login with invalid credentials
    When I navigate to the login page
    And I enter invalid credentials
    Then I should see an error message indicating invalid login