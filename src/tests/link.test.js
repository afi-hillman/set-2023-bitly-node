import app from "../app";
import supertest from "supertest";
import dbInit from "../database/init";
import postgresConnection from "../database/connection";
import { QueryTypes } from "sequelize";
import session from "supertest-session";

describe("test link controller", function () {
  let authSession;
  beforeEach(async function () {
    authSession = session(app);
  });
  beforeAll(async function () {
    await dbInit();
  });
  afterAll(async function () {
    await postgresConnection.query(
      "DELETE FROM links WHERE slug = 'testLink'",
      {
        type: QueryTypes.DELETE,
      }
    );
  });
  // Positive test case
  test("CREATE new link, success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1",
    });
    const result = await authSession.post("/api/link").send({
      slug: "testLink",
      link: "https://twitch.tv",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("link created");
  });
  // Negative test case
  test("CREATE new link, slug taken", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1",
    });
    const result = await authSession.post("/api/link").send({
      slug: "strimmer",
      link: "https://youtube.com",
    });
    expect(result.statusCode).toEqual(500);
    expect(result.body.error.errors[0].message).toBe("slug must be unique");
  });
  // Positive test case
  test("LIST ALL links success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1",
    });
    const result = await authSession.get("/api/link");
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("links are found!");
  });
  // // Positive test case
  // test("REDIRECT link success", async function () {
  //   await authSession.post("/api/login").send({
  //     identifier: "afi",
  //     password: "password1",
  //   });
  //   const result = await authSession.get("/abcd2020");
  //   expect(result.statusCode).toEqual(200);
  // });
  // Positive test case
  test("UPDATE link success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1",
    });
    const result = await authSession.put("/api/link").send({
      slug: "testLink",
      link: "https://youtube.com",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.message).toBe("link updated!");
  });
  // Positive test case
  test("DELETE link success", async function () {
    await authSession.post("/api/login").send({
      identifier: "afi",
      password: "password1",
    });
    const result = await authSession.delete("/api/link").send({
      slug: "testLink",
    });
    expect(result.statusCode).toEqual(200);
    expect(result.body.link).toBe("successfully deleted!");
  });
  // Negative test case
  test("DELETE link fail, no auth", async function () {
    const result = await supertest(app).delete("/api/link").send({
      slug: "testLink",
    });
    expect(result.statusCode).toEqual(401);
    expect(result.body.message).toBe("unauthorized!");
  });
});
