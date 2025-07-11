Feature: Core Pages
  Scenario: Implement Editor.js (CodeX) page
    Given I navigate to the CodeX page
    When the editor initializes
    Then I can control blocks and plugins, see validation feedback, load templates and view integration info
