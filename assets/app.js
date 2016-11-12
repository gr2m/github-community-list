/* global $, atob, markdown */

var baseUrl = 'https://github-api-cache.now.sh/'

// load conents of folder from GitHub API
// https://developer.github.com/v3/repos/contents/#get-contents
$.ajax({
  accept: 'Accept: application/vnd.github.v3+json',
  url: baseUrl + 'repos/fullstackla/pairing-meetup/contents/community'
})

.then(function (files) {
  return Promise.all(files.filter(isNotReadme).map(function (file) {
    return $.ajax({
      accept: 'Accept: application/vnd.github.v3+json',
      url: baseUrl + 'repos/fullstackla/pairing-meetup/contents/' + file.path
    })
  }))
})

.then(function (results) {
  results.forEach(function (result) {
    return $.ajax({
      accept: 'Accept: application/vnd.github.v3+json',
      url: baseUrl + 'users/' + result.name.replace(/\.md$/, '').toLowerCase()
    })

    .then(function (user) {
      var html = '<div class="member col-md-3">';
      html += '<div class="profile-img-cont"><img class="profile-img" src="' + user.avatar_url + '"></div>';
      html += '<div class="profile-description">' + markdown.toHTML(atob(result.content)) + '</div>';

      html += '</div>'
      return $('#content').append(html)
    })
  })
})

.catch(function (error) {
  console.log(error)
})

function isNotReadme (file) {
  return file.name !== 'README.md'
}
