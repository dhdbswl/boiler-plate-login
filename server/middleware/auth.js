const {User} = require('../models/User');

let auth = (req, res, next) => {
  //인증 처리를 하는 곳

  // 1. 클라이언트 쿠키에서 토큰 가져오기
  let token = req.cookies.x_auth;

  // 2. 토큰을 복호화(decode)한 후 유저 찾기
  User.findByToken(token, (err, user) => {
    console.log(user);
    if(err) throw err;
    // 3. 유저가 있으면 인증 okay
    if(!user) return res.json({isAuth: false, err: true})

    // 4. 유저가 있으면 인증 no
    req.token = token;
    req.user = user;
    next();
  })
}

//
module.exports = {auth};