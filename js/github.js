function loadGitHubData() {
    var jsonUser = loadJSONPath("https://api.github.com/users/rubendal");
    var img_url = jsonUser.avatar_url;
    var html_url = jsonUser.html_url;
    $('#header-cont').prepend('<a href="' + html_url + '"><img src="' + img_url + '" width=60 height=60 /></a>');
}