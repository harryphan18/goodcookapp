$(document).ready(function () {

    var user_role = $('.profile-username').attr('role');
    var user_id = $('.profile-username').attr('id');
    var url = "";
    if(user_role == 0 || user_role == 1)
        url='/cook/all-friends/' + user_id;
    else if (user_role == 2 || user_role == 3)
        url='/all-my-friends';

    fetchData();

    function fetchData(){
        $.ajax({
            type: 'get',
            url: url,
            success: function (data) {
                // console.log(data);
                $('.favourite-recipe-grid').html('');
                data.mydata.data.forEach(function(data) {
                    var body = '<div class="recipe-card">';
                    body += '<div class="card-content">';
                    body += '<div class="featured-recipe-item">';
                    body += '<span>';
                    body += '<a href="/recipe/' + data.recipe_id + '">';
                    body += '<img src="../' + data.photo + '" class="img-recipe-card">';
                    body += '</a>';
                    body += '</span>';
                    body += '<div class="dish-name">';
                    body += '<a href="/recipe/' + data.recipe_id + '">' + data.name + '</a>';
                    body += '</div>';
                    body += '<img src="../' + data.rating_star_photo + '" class="img-star-rate"><span class="review-recipe-card">'+data.num_of_reviews+'</span>';
                    body += '<div class="description-recipe-card">' + data.description + '</div>';
                    body += '</div>';
                    body += '</div>';
                    body += '<div class="recipe-author-info">';
                    body += '<img src="../' + data.avatar +'" class="author-avatar-recipe-card">';
                    body += 'Bởi<a href="/profile" class="author-name-recipe-card">' + data.author_name + '</a>';
                    body += '</div>';
                    body += '</div>';
                    $('.favourite-recipe-grid').append(body);
                });
            }
        });
    }

});