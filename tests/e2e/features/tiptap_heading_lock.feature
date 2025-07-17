Feature: TipTap heading lock
  In order to maintain document structure
  As an editor user
  I want Heading 1 and 2 levels to be locked from editing

  Scenario: Attempt to edit a locked heading
    Given I am on the TipTap page
    When I attempt to edit a level 1 heading
    Then the heading remains unchanged
