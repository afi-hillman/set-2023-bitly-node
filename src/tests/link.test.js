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
});
