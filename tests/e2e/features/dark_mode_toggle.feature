Feature: Other Features
  Scenario: Implement dark mode toggle
    Given the application is running
    When I activate the dark mode switch
    Then the UI changes between light and dark themes
