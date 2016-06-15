function loadGitHubData() {
    var jsonUser = loadJSONPath("https://api.github.com/users/rubendal");
    var img_url = jsonUser.avatar_url;
    var html_url = jsonUser.html_url;
    $('#github-user').append('<a href="' + html_url + '"><img id="github-profile" class="header-image" src="' + img_url + '"/></a>');
    $('#favicon').attr("href", img_url);
}