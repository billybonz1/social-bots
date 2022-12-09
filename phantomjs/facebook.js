var page = require('webpage').create();
page.open('https://www.facebook.com/', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    var val = page.evaluate(function() {
      var email = document.querySelector("[name=email]");
      var pass = document.querySelector("[name=pass]");
      email.value = "kalini.art@gmail.com"
      pass.value = "Knopka91019253";

      var ev = document.createEvent("MouseEvents");
      ev.initEvent("click", true, true);
      document.querySelector("[name=login]").dispatchEvent(ev);
      return document.querySelector('body').innerHTML;
    });
    console.log(JSON.stringify(val));
  }
  phantom.exit();
});
