Feature:
  Testing the creation of the a new site.

  @javascript  @frontend
  Scenario: Test the creation of a new site and verify that we don't get JS alert.
    Given I am logging in as "admin"
      And I wait for page actions to complete
     When I visit "/"
      And I click "Create Your Site Here"
      And I fill in "edit-domain" with "mysite"
      And I sleep for "10"
      And I press "edit-submit"
      And I wait for page actions to complete
     Then I should see "Success! The new site has been created."
