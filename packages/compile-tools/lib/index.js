/*
 * @Descripttion:
 * @Author: OwenWong
 * @Email: owen.cq.cn@gmail.com
 * @Date: 2021-06-03 21:41:28
 */
module.exports =
  process.env.NODE_ENV === "production"
    ? require("./config/prod")
    : require("./config/dev");
