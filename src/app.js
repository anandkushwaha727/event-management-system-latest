
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/User.Routes.js'
import eventRouter from './routes/Events.Routes.js'

//routes declaration

app.use("/api/v1/users", userRouter)
app.use("/api/v1/events", eventRouter);

export { app }