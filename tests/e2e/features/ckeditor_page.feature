Feature: Core Pages
  Scenario: Implement CKEditor 5 page
    Given I navigate to the CKEditor page
    When the editor initializes
    Then I can manage plugins, customize the toolbar, view validations, load templates and see integration info
