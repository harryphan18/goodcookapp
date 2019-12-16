$(document).ready(function () {
    console.log($('.responsive-avatar').attr("src"));
    $('.savebtn').on('click', function () {
        $.ajax({
            type: 'put',
            data: {
                email: $('#email').val(),
                password: $('#password').val(),
                firstname: $('#firstname').val(),
                lastname: $('#lastname').val(),
                avatar: $('.responsive-avatar').attr("src"),
                introduction: $('#introduction').val(),
                numbers: $('#numbers').val(),
                facebook: $('#facebook').val(),
                instagram: $('#instagram').val()
            },
            url: '/profile/edit/update',
            success: function (data) {
                alert("Cập nhật thành công");
                // console.log("Updateed successfully!");
            }
        });
    });

    $('.discardbtn').on('click', function () {
        $.ajax({
            type: 'get',
            url: '/my/about-me',
            success: function (data) {
                alert("Bạn có muốn thoát?");
                // console.log("Updateed successfully!");
            }
        });
    });
});