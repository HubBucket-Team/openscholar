Feature:
  Verify that privacy of bundles is respected in the LOP widget.

  @api @wip
  Scenario: Verify that anonymous user can see public bundles in the LOP.
    Given I am logging in as "john"
      And the widget "All Posts" is set in the "News" page with the following <settings>:
          | Content Type             | All    | select list |
          | Display style            | Teaser | select list |
      And I logout
     When I visit "john/news"
     Then I should see "John F. Kennedy: A Biography"

  @api @widgets @javascript
  Scenario: Verify that private bundles don't show up in the LOP.
    Given I am logging in as "john"
      And I sleep for "5"
      And I set feature "Publications" to "Site Members" on "john"
      And the widget "All Posts" is set in the "News" page with the following <settings>:
          | Content Type             | All    | select list |
          | Display style            | Teaser | select list |
      And I visit "john/news"
      And I should not see "John F. Kennedy: A Biography"
          # Set the App back to "Public".
      And I set feature "Publications" to "Everyone" on "john"
