const Browser = require('zombie');
const fs = require('fs');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ubiKnopka91019254ret@",
  database: "laravel"
});


class FacebookBot {
  constructor(con){
    this.browser = new Browser();
    if (!this.browser.headers) {
        this.browser.headers = {};
    }
    this.con = con;
    // this.browser.headers['user-agent'] = userAgent;
    // this.browser.headers['cookie'] = cookie;
    this.friends = [];
    this.profile = "";
    this.jobsEnd = 0;
  }
  setAuth(userId, callback){
    this.con.connect((err) => {
      if (err) throw err;
      this.con.query('SELECT * FROM fauths WHERE user_id=' + userId, (err, result) => {
        if (err) throw err;
        let fauth = result[0];
        this.browser.headers['user-agent'] = fauth.user_agent;
        this.browser.headers['cookie'] = fauth.cookie;
        callback()
      });
    });
  }

  findFriends(){
    this.browser.queryAll('td>a:first-child:not([href*="pages/"]):not([href*=bugnub]):not([href*="home.php"]):not([href*="friends/"])').forEach((friend) => {
      this.friends.push({
        name: friend.innerHTML,
        link: friend.href
      })
    })
    if(this.browser.query("#m_more_friends a") !== null){
      this.browser.clickLink('#m_more_friends a',() => {
        this.findFriends();
      });
    }else{
      console.log(JSON.stringify(this.friends));
      process.exit();
    }
  }

  visitFriendsPage(userId){
    this.setAuth(userId, () => {
      this.browser.visit('https://m.facebook.com/',() => {
        let profileNode = this.browser.query(".bd a:nth-child(2)");
        if(profileNode !== null){
          this.profile = profileNode.href.split("/")[3].split("?")[0];

          this.browser.visit('https://m.facebook.com/' + this.profile + '/friends',() => {
            this.findFriends();
          });
        }
      });
    })
  }
  sendMessageInner(userId){
    this.con.query('SELECT * FROM jobs WHERE user_id=' + userId + ' AND status=0 LIMIT 1', (err, result) => {
      if (err) throw err;
      if(result.length === 0) process.exit();
      result.forEach((job) => {
        this.browser.visit(job.url,() => {
          let messageNode = this.browser.query("a[href*='messages/thread']");
          if(messageNode){
            let url = messageNode.href.split("?")[0];
            setTimeout(() => {
              this.browser.visit(url,() => {
                this.browser.fill('body', job.message).then(() => {
                  this.browser.pressButton('[type=submit][name]',() => {
                    this.con.query('UPDATE jobs SET status=1 WHERE id='+job.id, (err, result) => {
                      this.jobs++;
                      if(this.jobs === 10){
                        process.exit();
                      }else{
                        setTimeout(() => {
                          this.sendMessageInner(userId)
                        },200)
                      }
                    });
                  });
                })
              });
            }, 300);
          }else{
            this.con.query('UPDATE jobs SET status=2 WHERE id='+job.id, (err, result) => {
              this.jobs++;
              if(this.jobs === 10){
                process.exit();
              }else{
                setTimeout(() => {
                  this.sendMessageInner(userId)
                },200)
              }
            });
          }
        });
      })
    });
  }

  sendMessage(userId){
    this.setAuth(userId, () => {
      this.sendMessageInner(userId)
    })
  }

  checkAuth(userId){
    this.setAuth(userId, () => {
        this.browser.visit('https://m.facebook.com/',() => {
          let profileNode = this.browser.query(".bd a:nth-child(2)");
          if(profileNode !== null){
            console.log(1);
          }else{
            console.log(0);
          }
          process.exit();
        });
      }
    )
  }
}

if(process.argv[3]){
  const facebookBot = new FacebookBot(con);

  if(process.argv[2] && process.argv[2] === 'getFriends'){
    facebookBot.visitFriendsPage(process.argv[3]);
  }else if(process.argv[2] && process.argv[2] === 'sendMessage'){
    facebookBot.sendMessage(process.argv[3]);
  }else if(process.argv[2] && process.argv[2] === 'checkAuth'){
    facebookBot.checkAuth(process.argv[3]);
  }
}


// if(process.argv[2] && process.argv[2] === 'setAuthCode'){
//   fs.readFile('./browser', {encoding: 'utf-8'}, function(err,data){
//       if (!err) {
//           let arr = JSON.parse(data);
//           arr.forEach((item) => {
//             browser.setCookie(item.key, item.value);
//           });
//       } else {
//           console.log(err);
//       }
//   });
// }
