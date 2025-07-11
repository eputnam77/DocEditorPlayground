Feature: Core Pages
  Scenario: Implement Quill page
    Given I navigate to the Quill page
    When the editor initializes
    Then I can toggle modules, see validation results, load templates and view integration info
