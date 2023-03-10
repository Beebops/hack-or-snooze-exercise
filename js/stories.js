'use strict'

// This is the global list of the stories, an instance of StoryList
let storyList

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories()
  $storiesLoadingMsg.remove()

  putStoriesOnPage()
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  const hostName = story.getHostName()

  // if the user is logged in, show the heart on each story
  const showHeart = Boolean(currentUser)

  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getTrashCanBtnHtml() : ''}
        ${showHeart ? getheartHTML(story, currentUser) : ''}  
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `)
}

/* show if story is favorite or not by changing class of heart */
function getheartHTML(story, user) {
  const isFavorite = user.isFavoriteStory(story)
  const heartType = isFavorite ? 'fa-solid' : 'fa-regular'
  return `
      <span class="heart">
        <i class="${heartType} fa-heart"></i>
      </span>`
}

/* generate HTML of trash can for delete button for story */
function getTrashCanBtnHtml() {
  return `
    <span class="trash-can">
      <i class="fa-solid fa-trash"></i>
    </span>  
    `
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug('putStoriesOnPage')

  $allStoriesList.empty()

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story)
    $allStoriesList.append($story)
  }

  $allStoriesList.show()
}

async function deleteStory(e) {
  const $li = $(e.target).closest('li')
  const storyId = $li.attr('id')

  await storyList.removeStory(currentUser, storyId)

  await putUserStoriesOnPage()
}
$userStoriesList.on('click', '.trash-can', deleteStory)

async function putUserStoriesOnPage() {
  $userStoriesList.empty()

  if (currentUser.ownStories.length === 0) {
    $userStoriesList.append('<p>You have not added any stories yet</p>')
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true)
      $userStoriesList.append($story)
    }
  }
  $userStoriesList.show()
}

/** Gets list of favorite stories from server, generates their HTML, and puts on page. */

function putFavoritesOnPage() {
  $favoritesList.empty()
  if (currentUser.favorites.length === 0) {
    $favoritesList.append('<p>You have no favorite stories yet!</p>')
  } else {
    const favorites = currentUser.favorites
    for (let story of favorites) {
      const $story = generateStoryMarkup(story)
      $favoritesList.append($story)
    }
  }

  $favoritesList.show()
}

async function toggleFavoriteStory(e) {
  console.debug('toggleFavoriteStory')
  // get the story in the list whose id matches the clicked on storyId
  const $target = $(e.target)
  const $li = $target.closest('li')
  const storyId = $li.attr('id')
  const story = storyList.stories.find((el) => el.storyId === storyId)
  if ($target.hasClass('fa-solid')) {
    await currentUser.removeFavorite(story)
    console.log(currentUser.favorites)
    $target.closest('i').toggleClass('fa-solid fa-regular')
  } else {
    await currentUser.addFavorite(story)
    console.log(currentUser.favorites)
    $target.closest('i').toggleClass('fa-solid fa-regular')
  }
}
$storiesLists.on('click', '.heart', toggleFavoriteStory)

/* get the data from the form, call the .addStory method and put that new story on the page. */

async function submitNewStory(e) {
  e.preventDefault()
  // get the inputs from the form
  const author = $('#create-author').val()
  const title = $('#create-title').val()
  const url = $('#create-url').val()
  // get current user's username and the data from form to pass to addyStory method
  const username = currentUser.username
  const storyData = { author, title, url, username }
  const story = await storyList.addStory(currentUser, storyData)
  // generate markup for new story and prepend it to story list

  const $story = generateStoryMarkup(story)
  $allStoriesList.prepend($story)
  // clear the form
  $('#create-author').val('')
  $('#create-title').val('')
  $('#create-url').val('')
  $storyForm.hide()
}

$storyForm.on('submit', submitNewStory)
