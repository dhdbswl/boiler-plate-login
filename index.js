const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {User} = require("./models/User");
const {auth} = require('./middleware/auth');
const config = require('./config/key');

// bodyParser가 client에서 오는 정보를 서버에서 분석하고 가져올 수 있도록 함
// application/x-www-form-urlencoded 이렇게 된 데이터를 분석, 가져옴
app.use(bodyParser.urlencoded({extended: true}));
// application/json 이렇게 된 데이터를 분석, 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

// application에 mongoDB 연결
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  // mongoDB 오류 없애기
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 새해 복 많이 받으세요'))

//레지스터 라우터
app.post('/api/users/register', (req, res) => {
  //회원가입할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다.
  const user = new User(req.body)

  //save() : mongoDB 함수, user모델에 저장
  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

//로그인 라우터
app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾기
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }
    
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) {
        return res.json({
          oginSuccess: false,
          message: "비밀번호가 일치하지 않습니다."
        });
      }

      //비밀번호까지 맞다면 토큰 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        //토큰을 저장한다. 어디에? ex)쿠키, 세션, 로컬스토리지 등...
        //예제로 쿠키에 저장 (cookie-parser 라이브러리 설치)
        res.cookie("x_auth", user.token)
        .status(200)
        .json({
          loginSuccess: true,
          userId: user._id
        });
      });
    })
  })
})

//인증 Auth 라우터
//get(,auth,) auth: 미들웨어
app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    //유저가 관리자인지 확인
    //role === 0 : 일반 유저, 0이 아니면 관리자
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

// 로그아웃 라우터
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id:req.user._id}, {token: ""}, (err, user) => {
    if(err) return res.json({success: false, err});
    return res.status(200).send({
      success: true
    });
  });
})


//
app.listen(port, () => console.log(`Example app listening on port ${port}!`))