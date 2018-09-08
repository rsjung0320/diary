const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  // title: {type: String, require: true, default: 'Hello'},
  title: { type: String, require: true },
  content: { type: String, require: true },
  imagePath: { type: String, require: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true }
});

// 1번 째는 param은 모델 이름, 2번 째는 스키마 정의
module.exports = mongoose.model("Post", postSchema);
