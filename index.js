const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const {User} = require("./models/User");

const config = require('./config/key');

// bodyParser가 client에서 오는 정보를 서버에서 분석하고 가져올 수 있도록 함
// application/x-www-form-urlencoded 이렇게 된 데이터를 분석, 가져옴
app.use(bodyParser.urlencoded({extended: true}));
// application/json 이렇게 된 데이터를 분석, 가져옴
app.use(bodyParser.json());

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

app.post('/register', (req, res) => {
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`))