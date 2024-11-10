
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const cloudinary = require("./cloud");

const registerUser = async (req, res) => {

    console.log(req.body);
    console.log("Reacheddd registerUser")
  var { username, email, password, preview } = req.body;

  try {

//     if(preview){
//     pic = await cloudinary.uploader.upload(preview, {
//       folder: "/user_DP",
//     });
//   }
 
    if (!username || !email || !password) {
      res.status(400).send(JSON.stringify("Please Input all the Feilds"));
      console.error("Please Input all the Feilds");
      return;
    }

    const userExist = await pool.query(
      "select * from osp.users where username=($1)",
      [username]
    );

    if (userExist.rows.length) {
      res.status(400).send(JSON.stringify("User already exists"));
      console.error("User already exists");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    try {
      if (preview && pic) {
        await pool.query(
          "insert into osp.users (username, email, password,pic) values  ($1,$2,$3,$4)",
          [username, email, password, pic.url]
        );
      } else {
        await pool.query(
          "insert into osp.users (username, email, password) values  ($1,$2,$3)",
          [username, email, password]
        );
      }

      const user = await pool.query(
        `select * from osp.users where username='${username}'`
      );
      console.log(user.rows);
      res.status(201).json({
        id: user.rows[0].id,
        name: user.rows[0].username,
        email: user.rows[0].email,
        pic: user.rows[0].pic,
        token: generateToken(user.rows[0].id),
      });
    } catch (error) {
      console.log(error);
      console.log("this");
    }

} catch (err) {
    console.log(err);
    res.status(400).json({
        errMsg : "Something went wrong"
    })
  }
};

module.exports = { registerUser };
