Feature: Core Pages
  Scenario: Implement TipTap editor page
    Given I navigate to the TipTap page
    When the editor initializes
    Then I can manage plugins, see validation results, load templates and view integration info
