import express, {Response} from "express";
import {CourseViewModel} from "./models/CourseViewModel";
import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams, RequestWithQuery} from "./Types";
import {GetCoursesQueryModel} from "./models/GetCoursesQueryModel";
import {URIParamsCourseIDModels} from "./models/URIParamsCourseIDModels";
import {CourseCreateModel} from "./models/courseCreateModel";
import {CourseUpdateModel} from "./models/CourseUpdateModel";
import {addCoursesRoutes, HTTP_STATUS} from "./routes/courses";
import {db} from "../dist/src/db/db";
import {addTestsRoutes} from "../dist/src/routes/tests";

export const app = express()
export const jsonBodyMiddleware = express.json()


app.use(jsonBodyMiddleware)

addCoursesRoutes(app);

app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUS.NO_CONTENT)
})
appCoursesRoutes(app,db);
addTestsRoutes(app,db);