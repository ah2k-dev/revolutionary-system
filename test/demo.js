const register = async (req, res) => {
    // #swagger.tags = ['auth']
    try {
      const { firstName, lastName, email, password} = req.body;
      const {avatar,coverImg} = req.files;
    console.log(req.body);
    // console.log(req.files);
      if (
        !password.match(
          /(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/
        )
      ) {
        return ErrorHandler(
          "Password must contain atleast one uppercase letter, one special character and one number",
          400,
          req,
          res
        );
      }
  
      if (!req.files || !avatar || !coverImg) {
        return ErrorHandler("Please upload Avatar and Cover Image", 400, req, res);
      }
  
      if (!avatar.mimetype.startsWith("image") || !coverImg.mimetype.startsWith("image")) {
        return ErrorHandler("Please upload an image file", req, 400, res);
    }
  
    const avatarFileName = `${req.user._id}${Date.now()}${avatar.name}`;
    const coverImgfileName = `${req.user._id}${Date.now()}${coverImg.name}`;
  
    avatar.mv(path.join(__dirname, `../../uploads/${avatarFileName}`), (err) => {
        if (err) {
            return ErrorHandler(err.message, req, 500, res);
        }
    });
  // Cover Img
    coverImg.mv(path.join(__dirname, `../../uploads/${coverImgfileName}`), (err) => {
      if (err) {
          return ErrorHandler(err.message, req, 500, res);
      }
  });
  
      // const avatarUrl = './uploads/' + avatar.name
      // const coverImgUrl = './uploads/' + coverImg.name
      // //move photo to uploads directory
      // avatar.mv(avatarUrl);
      // coverImg.mv(coverImgUrl);
      
    //   let images = []
    //   _.forEach(_.keysIn(req.files.photos), (key) => {
    //     let photo = req.files.photos[key];
    //   //push file details
    //     data.push({
    //         name: photo.name,
    //         mimetype: photo.mimetype,
    //         size: photo.size
    //     });
    // });
  
  
  
      const user = await User.findOne({ email });
      if (user) {
        return ErrorHandler("User already exists", 400, req, res);
      }
      const uniqueId = String(Date.now()).slice(-3)
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password,
        username: `${firstName}${uniqueId}`,
        avatar: `/uploads/${avatarFileName}`,
        coverImg: `/uploads/${coverImgfileName}`,
      });
      newUser.save();
      return SuccessHandler("User created successfully", 200, res);
    } catch (error) {
      return ErrorHandler(error.message, 500, req, res);
    }
  };