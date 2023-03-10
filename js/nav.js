'use strict'

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug('navAllStories', evt)
  hidePageComponents()
  putStoriesOnPage()
}

$body.on('click', '#nav-all', navAllStories)

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug('navLoginClick', evt)
  hidePageComponents()
  $loginForm.show()
  $signupForm.show()
}

$navLogin.on('click', navLoginClick)

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug('updateNavOnLogin')
  $('.main-nav-links').show()
  $navLogin.hide()
  $navLogOut.show()
  $navProfileLinks.show()
  $navUserProfile.text(`${currentUser.username}`).show()
}

function navSubmitStoryClick() {
  hidePageComponents()
  $allStoriesList.show()
  $storyForm.show()
}
$navSubmit.on('click', navSubmitStoryClick)

function navFavoritesClick(e) {
  hidePageComponents()
  putFavoritesOnPage()
}
$body.on('click', '#nav-favorites', navFavoritesClick)

/** show user's own stories on page by clicking 'my stories' */
function navUserStories(e) {
  hidePageComponents()
  putUserStoriesOnPage()
  $navUserStories.show()
}
$body.on('click', '#nav-user-stories', navUserStories)
