/* global $, atob, markdown */

// load conents of folder from GitHub API
// https://developer.github.com/v3/repos/contents/#get-contents
$.ajax({
  accept: 'Accept: application/vnd.github.v3+json',
  url: 'https://api.github.com/repos/fullstackla/pairing-meetup/contents/community'
})

.then(function (files) {
  return Promise.all(files.filter(isNotReadme).map(function (file) {
    return $.ajax({
      accept: 'Accept: application/vnd.github.v3+json',
      url: 'https://api.github.com/repos/fullstackla/pairing-meetup/contents/' + file.path
    })
  }))
})

.then(function (results) {
  results.forEach(function (result) {
    return $.ajax({
      accept: 'Accept: application/vnd.github.v3+json',
      url: 'https://api.github.com/users/' + result.name.replace(/\.md$/, '').toLowerCase()
    })

    .then(function (user) {
      var html = markdown.toHTML(atob(result.content))
      html = '<img src="' + user.avatar_url + '" style="float:left; max-height: 100px; max-width: 100px" />' + html
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
