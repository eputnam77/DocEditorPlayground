Feature: Core Pages
  Scenario: Add home page with navigation
    Given I visit the home page
    When I view the navigation menu
    Then I can access links to all editor pages
