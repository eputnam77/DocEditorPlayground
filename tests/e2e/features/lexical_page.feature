Feature: Core Pages
  Scenario: Implement Lexical page
    Given I navigate to the Lexical page
    When the editor initializes
    Then I can manage extensions and custom nodes, see validation results, load templates and view integration info
