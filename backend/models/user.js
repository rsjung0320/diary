const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  // title: {type: String, require: true, default: 'Hello'},
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true }
});

userSchema.plugin(uniqueValidator);

// 1번 째는 param은 모델 이름, 2번 째는 스키마 정의
module.exports = mongoose.model("User", userSchema);
