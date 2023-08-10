import app from "../app";
import supertest from "supertest";
import dbInit from "../database/init";
import postgresConnection from "../database/connection";
import { QueryTypes } from "sequelize";
import session from "supertest-session";

describe("test auth controller", function () {
  let authSession;
  beforeEach(async function () {
    authSession = session(app);
  });
  beforeAll(async function () {
    await dbInit();
  });
  afterAll(async function () {
    await postgresConnection.query(
      "DELETE FROM users WHERE username = 'testNewUser'",
      { type: QueryTypes.DELETE }
    );
  });
  // Positive test case
  test("LOGIN correct identifier and password", async function () {
    const result = await supertest(app).post("/api/login").send({
      identifier: "afi",
      password: "password1",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("Login successful!");
  });
  // Negative test case
  test("LOGIN empty identifier and password", async function () {
    const result = await supertest(app).post("/api/login").send({
      identifier: "",
      password: "",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.errors[0].msg).toBe("Wrong credentials input!");
  });
  test("LOGIN wrong identifier and password", async function () {
    const result = await supertest(app).post("/api/login").send({
      identifier: "wrongIdBro",
      password: "definitelynotright",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.errors[0].msg).toBe("Wrong credentials input!");
  });
  // Positive test case
  test("REGISTER correct identifiers and password", async function () {
    const result = await supertest(app).post("/api/register").send({
      username: "testNewUser",
      email: "testemail@mail.com",
      password: "testPassword123",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("a user registered!");
  });
  // Negative test case
  test("REGISTER email taken", async function () {
    const result = await supertest(app).post("/api/register").send({
      username: "yayayaya",
      email: "afi@mail.com",
      password: "testPassword123",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.data.errors[0].message).toBe("email must be unique");
  });
  test("REGISTER username taken", async function () {
    const result = await supertest(app).post("/api/register").send({
      username: "afi",
      email: "testemail@mail.com",
      password: "testPassword123",
    });
    expect(result.statusCode).toEqual(400);
    expect(result.body.data.errors[0].message).toBe("username must be unique");
  });
  // Positive test case

  test("LOGOUT success", async function () {
    const loginResult = await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1",
    });
    console.log(loginResult);
    const result = await authSession.get("/api/logout");
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("logout successful!");
  });
  // Negative test case
  test("LOGOUT fail", async function () {
    const result = await supertest(app).get("/api/logout");
    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toBe("unauthorized!");
  });
});
