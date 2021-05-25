let dbUrl = "https://desolate-journey-00287.herokuapp.com/";
/* globals Chart:false, feather:false */
let userData 

function showTime() {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59
  var session = "AM";

  if (h == 0) {
    h = 12;
  }

  if (h > 12) {
    h = h - 12;
    session = "PM";
  }

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  var time = h + ":" + m + ":" + s + " " + session;
  document.getElementById("MyClockDisplay").innerText = time;
  document.getElementById("MyClockDisplay").textContent = time;

  setTimeout(showTime, 1000);
}

showTime();

function getUserData() {
  $.ajax({
    url: dbUrl,
    type: "GET",
    dataType: 'json',  
    url: dbUrl,
    success: function (data) {
      console.log(data)
      userData = data.data
      var tableHTML = null
       userData.map(item => {
         if (window.location.pathname == "/reports.html") {
          tableHTML= `<tr><td>${item.username}</td><td>Yes</td><td>${item.aadharNumber}</td><td>No</td><td class="safe">Safe</td><td><a href="report.pdf" download class="btn btn-sm btn-primary">Download Report</a></td></tr>`
         }else {
           tableHTML= `<tr><td>${item.username}</td><td>Yes</td><td>${item.aadharNumber}</td><td>No</td><td class="safe">Safe</td></tr>`
         }
         $('#tableBody').append(tableHTML)

      })
    },
    error: function (err) {
      alert("SOME ERROR ACCURED");
    },
  });
}

function signUp(username,aadharNumber, email) {
  document.getElementById("tabl")
  let data = {
    id:1,
    username: username,
    aadharNumber: aadharNumber,
    email: email,
  };

  $.ajax({
    url: dbUrl + 'add',
    type: "POST",
    data: data,
    success: function (data) {
      getUserData()
    },
    error: function (er) {
      alert("Some error Accured");
    },
  });
}


$(function () {
  feather.replace();
})

