const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  // 아직은 mongodb와 연결은 되지 않았다. new Post를 한 순간 몽고 DB에서 ID를 생성하는 것을 확인하였다.
  // req.userData는 check-auth에서 만든 변수 이다.
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  // 실제 몽고 DB에 생성된 Data를 넣는다.
  post
    .save()
    .then(createdPost => {
      res.status(201).json({
        message: "Post added successfully!",
        post: {
          id: createdPost._id,
          ...createdPost
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  // 1번 째는 where 절이고, 2번째는 update할 값이다.
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then(result => {
      // nModified 가 0이면 수정이 안된 것이고, 1이면 수정이 완료 된 것이다.
      if (result.n > 0) {
        res.status(200).json({
          mssage: "Update successfully!"
        });
      } else {
        res.status(401).json({
          mssage: "Not authorized!"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't Update post!"
      });
    });
};

exports.getPosts = (req, res, next) => {
  // string 앞에 +를 붙이면 number로 convert 된다.
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      return res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });

  // next()는 이 함수를 끝낸다는 뜻이다. 하지만 우리는 계속해서 해야하니 쓰면 안된다.
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!"
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({
          mssage: "Post deleted!"
        });
      } else {
        res.status(401).json({
          mssage: "Not authorized!"
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't delete posts!"
      });
    });
};
