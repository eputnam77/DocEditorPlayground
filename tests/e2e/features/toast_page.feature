Feature: Core Pages
  Scenario: Implement Toast UI editor page
    Given I navigate to the Toast UI page
    When the editor initializes
    Then I can manage plugins, view validations, load templates and read integration instructions
