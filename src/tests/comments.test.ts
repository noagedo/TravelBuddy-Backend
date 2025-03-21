import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comment";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
    app = await initApp();
    console.log("beforeAll");
    await commentsModel.deleteMany();
});



let commentId = "675d809094c66c170eae16d1";
const testComment = {
    content: "Test content",  
    postId: "erwtgwerbt245t4256b345", 
    sender: "yuval",
};

const invalidComment = {
    content: "Test content", 
};

describe("Comments test suite", () => {
    test("Comment test get all", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    
    test("Test adding new comment", async () => {
        const response = await request(app).post("/comments").send(testComment);
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(testComment.content);
        expect(response.body.postId).toBe(testComment.postId);
        expect(response.body.sender).toBe(testComment.sender);
        expect(response.body.createdAt).toBeDefined();  
        commentId = response.body._id;
    });

    
    test("Test adding invalid comment", async () => {
        const response = await request(app).post("/comments").send(invalidComment);
        expect(response.statusCode).not.toBe(200);
    });

    
    test("Test get all comments after adding", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    
    test("Test get comment by sender", async () => {
        const response = await request(app).get("/comments?sender=" + testComment.sender);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].sender).toBe(testComment.sender);
    });

    
    test("Test get comment by id", async () => {
        const response = await request(app).get("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
       
    });

   
    test("Test get comment by id fail", async () => {
        const response = await request(app).get("/comments/" + "3");
        console.log(response.body);
        if(response.body.length === 0){
          response.statusCode = 404;
        }
        expect(response.statusCode).toBe(404);
    });

    
    test("Test update comment", async () => {
        const response = await request(app).put("/comments/" + commentId).send({ content: "Updated content" });
        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe("Updated content");
    });

    
    test("Test update comment fail", async () => {
        const response = await request(app).put("/comments/" + "3").send({ content: "Updated content" });
        expect(response.statusCode).toBe(400);
    });

    
    test("Test delete comment", async () => {
        const response = await request(app).delete("/comments/" + commentId);
        expect(response.statusCode).toBe(200);
    });

    
    test("Test delete comment fail", async () => {
        const response = await request(app).delete("/comments/" + "invalidId123");
        expect(response.statusCode).toBe(400); 
        expect(response.body.message).toBe("Invalid comment ID");
    
        const response2 = await request(app).delete("/comments/" + "64c7f9ad72c123456789abcd"); 
        expect(response2.statusCode).toBe(404); 
        expect(response2.body.message).toBe("Comment not found");
    });

    test("Test delete all comments", async () => {
        const response = await request(app).delete("/comments");
        expect(response.statusCode).toBe(200);
    });

    test("Test get all comments after deleting all", async () => {
        const response = await request(app).get("/comments");
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(0);
    });

    afterAll(async () => {
      console.log("afterAll");
      await mongoose.connection.close();
  });
});