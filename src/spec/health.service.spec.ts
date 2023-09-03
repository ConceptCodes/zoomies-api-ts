import request from "supertest";
import { app } from "../index";
import { expect } from "chai";

describe("GET /example", () => {
  it("should return all examples", async () => {
    const response = await request(app).get("/example");
    expect(response.status).to.equal(200);
    expect(response.body).to.equal([{ message: "Service is Alive" }]);
  });
});
