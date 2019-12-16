
$(document).ready(function () {
    $('.recipe-save-btn').on('click', function () {
        $.ajax({
            type: 'put',
            data: {
                name: $('#recipe-title').val(),
                description: $('#recipe-desciption').val(),
                ingredients: $('#recipe-ingredients').val(),
                directions: $('#recipe-directions').val(),
                prep_time: $('#prep-time').val(),
                cook_time: $('#cook-time').val(),
                num_of_servings: $('#num-of-servings').val(),
                nutri_facts: $('#nutrition-facts').val(),
                notes: $('#recipe-notes').val(),
                photo: $(".responsive-image").attr("src"),
            },
            url: '/my/add-recipe/save-recipe',
            success: function (data) {
                console.log(data.photo);
                // alert("Update successful");
                console.log("added successfully!");
            }
        });
    });

    $('.display-image-btn').on('click', function () {
        $.ajax({
            type: 'get',
            url: '/my/add-recipe',
            success: function (data) {
                if(data == 'false') {
                    alert('Không có người dùng');
                }
                else{
                    // $('#content').html(data); //dữ liệu HTML trả về sẽ được chèn vào trong thẻ có id content
                }
            }
        })
    })

});