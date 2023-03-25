import {RequestWithBody, RequestWithBodyAndParams, RequestWithParams, RequestWithQuery} from "../Types";
import {GetCoursesQueryModel} from "../models/GetCoursesQueryModel";
import express, {Express, Response} from "express";
import {CourseViewModel} from "../models/CourseViewModel";
import {URIParamsCourseIDModels} from "../models/URIParamsCourseIDModels";
import {CourseCreateModel} from "../models/courseCreateModel";
import {CourseUpdateModel} from "../models/CourseUpdateModel";
import {app, CourseType, db, getCourseViewModel, HTTP_STATUS} from "../app";
import {DBType} from "../../dist/src/db/db";

export const HTTP_STATUS = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT: 204,
    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}

export const addCoursesRoutes = (app: Express, db:DBType) => {
    app.get('/courses', (req: RequestWithQuery<GetCoursesQueryModel>,
                         res: Response<CourseViewModel[]>) => {
        let foundCourses = db.courses;


        if (req.query.title) {
            foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
        }
        res.json(foundCourses.map(getCourseViewModel))
    })


    app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIDModels>,
                             res: Response<CourseViewModel>) => {
        const foundCourses = db.courses.find(c => c.id === +req.params.id)

        if(!foundCourses) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
            return;
        }
        res.json( getCourseViewModel(foundCourses))
    })

    app.post('/courses', (req: RequestWithBody<CourseCreateModel>,
                          res: Response<CourseViewModel>) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUS.BAD_REQUEST_400)
            return;
        }


        const createdCourse: CourseType = {
            id: +(new Date()),
            title: req.body.title,
            studentsCount: 0

        }
        db.courses.push(createdCourse)
        console.log(createdCourse)
        res.status(HTTP_STATUS.CREATED_201)
        res.json(createdCourse)
    })

    app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIDModels>, res) => {
        db.courses = db.courses.filter(c => c.id === +req.params.id)


        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    })

    app.put('/courses/:id', (req: RequestWithBodyAndParams<URIParamsCourseIDModels,CourseUpdateModel>,
                             res) => {
        let foundCourses = db.courses.find(c => c.id === +req.params.id)

        if(!foundCourses) {
            res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
            return;
        }
        foundCourses.title = req.body.title;
        res.sendStatus(HTTP_STATUS.NO_CONTENT)
    })
}