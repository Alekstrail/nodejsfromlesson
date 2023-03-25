import request from 'supertest'
import {app, HTTP_STATUS} from "../../src/app";
describe('/courses', () => {
    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })
    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200, [])
    })

    it('should return 404 for not existing course', async () => {
        await request(app)
            .get('/courses/999')
            .expect(HTTP_STATUS.NOT_FOUND_404)
    })

    it('should not create course with incorrect input data', async () => {
        await request(app)
            .post('/courses')
            .send({title: ''})
            .expect(HTTP_STATUS.BAD_REQUEST_400)

        await request(app)
            .get('/courses')
            .expect(HTTP_STATUS.OK_200)
    })
    let createdCourse: any = null
    it('should create courses with correct input data', async () => {
        const createResponse = await request(app)
            .post('/courses')
            .send({title: 'it-incubator course'})
            .expect(HTTP_STATUS.CREATED_201)
        createdCourse = createResponse.body;

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: 'it-incubator course'
        })
    })






    it('should not update courses that not exist', async () => {
        await request(app)
            .put('/courses/' + -100)
            .send({title: 'good title'})
            .expect(HTTP_STATUS.NOT_FOUND_404)

    })

    it('should update courses with correct input data', async () => {
        await request(app)
            .put('/courses/' + createdCourse.id)
            .send({title: 'good new title'})
            .expect(HTTP_STATUS.NO_CONTENT)

        await request(app)
            .get('/courses'+createdCourse.id)
            .expect(HTTP_STATUS.OK_200, {
                ... createdCourse,
            title: 'good new title'
            })

    })

        it('should delete both courses', async () => {
            await request(app)
                .delete('/courses/' + createdCourse.id)

                .expect(HTTP_STATUS.NO_CONTENT)




        })
    })

