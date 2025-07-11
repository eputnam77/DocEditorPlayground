Feature: Core Pages
  Scenario: Implement Slate page
    Given I navigate to the Slate page
    When the editor initializes
    Then I can use custom schema with plugin integration, view validation messages, load templates and view integration info
