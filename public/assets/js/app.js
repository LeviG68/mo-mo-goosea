

$(document).ready(function(){
  $('.alert-success').hide()
  $(".alert-danger").hide()
});

// scrape button

$("#scrape").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).done(function (data) {
    console.log(data)
    window.location = "/article"
  })
});

// save articles button
$(".save-button").on('click', function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "articles/save/" + thisId
  }).done(function(data) {
    $(".alert-success").modal("hide");
    window.location = "/"
  })
});


// delete article from saved

$(".delete-article").on("click", function () {
  console.log($(this).attr("data-id"));
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "DELETE",
    url: "/delete/" + thisId
  }).then(function (data) {
    window.location.reload()
    // window.location = "/saved"
  })
});

// save note button
$(".ave-note").on("click", function () {
  var thisId = $(this).attr("data-id");
  if ($("#note-content" + thisId).val()=="") {
    alert("Note can't be blank!");s
  }else {
    $.ajax({
      method: "POST",
      url: '/notes/save/' +thisId,
      data: {
        text: $("#note-content" + thisId).val()
      }
    }).done(function (data) {
      console.log(data);
      $("#note-content" + thisId).val("");
      $(".note-modal").modal("hide");
      window.location = "/saved"
    });
  }
});

// delete note button
$(".delete-note").on("click", function () {
  var noteId = $(this).attr("data-note-id");
  var articleId = $(this).attr("data-article-id");
  $.ajax({
    method: "DELETE",
    url: "/note/delete" + noteId + "/" + articleId
  }).done(function(data) {
    console.log(data);
    $(".modalNote").modal("hide");
    window.location = "/saved"
  })
});