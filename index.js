// import { createDataFilePromise, getAllFilesByFloderPath } from './lib/utils'


const Koa = require('koa')



const app = new Koa()
// 端口
const PORT = 3010

app.use(async (ctx, next) => {
  ctx.body = {
    code: 0,
    message: "success",
    data: {}
  }
  next()
})

app.listen(PORT, () => {
  console.log(`Server is listening ${PORT}，http://localhost:${PORT}`)
})



