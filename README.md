# vuejs-headless-drupal

This application demonstrates using Drupal as a backend to a Vuejs 2 web application. 

Some interesting benefits of this approach are:

- Powerful user and role managment (including user registration)
- Provide custom views which can be displayed from standard Drupal pages or using VueJS/rest. 
- Leverage Drupal modules to add custom code (if needed)
- Built in standard support for CORS and security 

Drupal rest is still in its infancy but hopefully some good folks in the Drupal community take it to the next level.
In the meantime, the jdrupal module helps in getting user/session information.  In my opinion the drupal view editor is a bit clunky and awkward when setting up filters and sorting on REST data.  Another concern is paging large data sets via standard drupal views when using REST.

Regardless of the REST support issues, using custom Drupal modules can get around them.  Drupal provides a good structure for adding JSON resources via PHP.

## Throwback Javascript

This app does not use node, npm, bower, vue-cli, ng-cli, webpack, grunt, maven, gradle, sbt, make, nmake, ant, etc...  In a world where everyone is preaching why their favorite build and packaging tools are so important, it was nice to get back to the basics and not deal with the pain involved in using those clunky, half-baked, opinionated tools.  
