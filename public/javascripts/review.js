$(document).ready(function () {

    var recipe_id=$('.recipe-name').attr('id');

    $.ajax({
        type: 'get',
        url: '/recipe/allreviews/' + recipe_id,

        success: function (data) {
            console.log(data);
            console.log(recipe_id);
            $('.all-reviews').html('');
            data.mydata.data.forEach(function(data) {
                console.log('ahihi');
                var body = '<div class="comment-card row">';
                body += '<div class="left">';
                body += '<img src="' + data.avatar + '" class="author-comment-avatar">';
                body += '</div>';
                body += '<div class="right">';
                body += '<div class="row author-comment-name"><strong>' + data.authors_fullname + '</strong></div>';
                body += '<div class="row "><img class="star-rating" src="' + data.rating_image + '"> </div>';
                body += '<div class="row comment-content">' + data.comment + '</div>';
                body += '</div>';
                body += '</div><hr>';
                $('.all-reviews').append(body);
            });
        }
    });
    var rate;

    $('.submit-comment-btn').on('click', function () {
        $('input[name="rate"]:checked').each(function() {
            rate = this.value;
        });
        console.log(rate);
        $.ajax({
            type: 'put',
            data: {
                recipe_id: recipe_id,
                comment: $('.comment-area').val(),
                rate: rate,
                // image: $('#lastname').val(),
                // author_id: $('#introduction').val(),
            },
            url: '/recipe/user-review/save-review',
            success: function (data) {
                // alert("Update successful");
                console.log("Added successfully!");
            }
        });
    });

    $('.liked-btn').on('click', function () {
        console.log(rate);
        $.ajax({
            type: 'put',
            url: '/save/recipe/' + recipe_id,
            success: function (data) {
                alert("Đã thêm vào yêu thích của bạn");
                console.log("Added successfully!");
            }
        });
    });

});