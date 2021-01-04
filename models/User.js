const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlenght: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlenght: 5
    },
    lastname: {
        type: String,
        maxlenght: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next) {
    var user = this
    //비밀번호 암호화
    //비밀번호 변경할 때만 실행되게끔 조건문
    if(user.isModified('password')) {
        //salt 생성시 saltRounds 필요
        bcrypt.genSalt(saltRounds, function(err, salt) {
            //error발생시 index.js의 user.save()함수로 돌려보냄
            if(err) return next(err)
            //salt 정상 실행시
            // hash(현재 가지고 있는 패스워드, salt, funtion(){})
            //hash : 암호화된 비밀번호를 의미
            bcrypt.hash(user.password, salt, function(err, hash) {
                //error 발생시
                if(err) return next(err)
                //정상 실행시 password를 hash로 교체
                user.password = hash
                next()
            });
        });
    }else {
        next()
    }
})

//로그인 라우터에서 비밀번호 비교하기
userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword와 암호화된 비밀번호가 일치하는지 체크
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err)
        cb(null, isMatch)
    })
}

//로그인 라우터에서 토큰 생성
userSchema.methods.generateToken = function(cb) {
    var user = this
    //jsonwebtoken을 이용하여 token 생성
    //user._id + 'secretToken' = token
    //token을 가지고 누구인지 판별
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User}