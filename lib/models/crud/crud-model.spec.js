import setupTestDb from "./../../config/setupTestDb.js";
import { jest } from "@jest/globals";

describe("Crud Model", () => {
  let TestMongoClient;
  let TestCollection;
  // for crud-tests
  let testCreatedObject;

  beforeAll(async () => {
    const { Collection, MongoClient } = await setupTestDb();
    TestMongoClient = MongoClient;
    TestCollection = Collection;
  });

  afterAll(async () => {
    await TestMongoClient.close();
  });

  it("returns an object from the nowUTC method", () => {
    const res = TestCollection.nowUTC();
    expect(typeof res).toBe("object");
  });

  it("Crud.collectionName matches input param", () => {
    expect(TestCollection.collectionName).toBe("TestCollection");
  });

  const expectedKeys = [
    "connectionObj",
    "client",
    "db",
    "collectionName",
    "collection",
  ];
  it.each(expectedKeys)(`%s key is present`, (xKey) => {
    const catKeys = Object.getOwnPropertyNames(TestCollection);
    expect(catKeys.includes(xKey)).toBe(true);
  });

  describe("methods work with persistent object", () => {
    afterEach(async () => {
      await TestCollection.remove();
    });
    it("createOne", async () => {
      const testObj = { dog: "horse" };
      testCreatedObject = await TestCollection.createOne(testObj);
      expect(Object.keys(testCreatedObject).toString()).toBe(
        "acknowledged,insertedId",
      );
      expect(testCreatedObject.acknowledged).toBe(true);
    });
    it("readOne", async () => {
      const testObj = { dog: "horse" };
      testCreatedObject = await TestCollection.createOne(testObj);
      const testFoundObj = await TestCollection.readOne({
        _id: testCreatedObject.insertedId,
      });
      expect(testCreatedObject.insertedId.toString()).toBe(
        testFoundObj._id.toString(),
      );
      expect(testFoundObj.dog).toBe("horse");
    });
    it("readMany", async () => {
      await TestCollection.createOne({ cat: "ralph" });
      await TestCollection.createOne({ horse: "george" });
      const findManyRes = await TestCollection.readMany();
      expect(await findManyRes.length).toBe(2);
    });
  });

  it("Delete: throws: with no object parameter", async () => {
    try {
      await TestCollection.deleteOne();
    } catch (e) {
      expect(e.message).toBe(
        "Cannot call TestCollection.deleteOne without an object param",
      );
    }
  });
  it('Delete: throws: with no "id" key in the obj param', async () => {
    try {
      await TestCollection.deleteOne({ horse: "dog" });
    } catch (e) {
      expect(e.message).toBe(
        "Cannot call TestCollection.deleteOne without 'id' key",
      );
    }
  });

  it('calls "drop" on remove', async () => {
    const MOCK_RETURN = "this is a dummy string";
    jest
      .spyOn(TestCollection.collection, "drop")
      .mockResolvedValueOnce(MOCK_RETURN);
    try {
      const testRes = await TestCollection.remove();
      expect(testRes).toBe(MOCK_RETURN);
    } catch (e) {
      console.log("drop test err");
      console.log(e.message);
    }
  });

  describe("updateOne", () => {
    const testObj = { dog: "horse" };
    const updateObj = { $set: { water: "melon" } };
    let testUpdateRes;
    let testCreatedObject;
    it("acknowledged === true", async () => {
      testCreatedObject = await TestCollection.createOne(testObj);
      testUpdateRes = await TestCollection.updateOne(
        { _id: testCreatedObject.insertedId },
        updateObj,
      );
      expect(testUpdateRes.acknowledged).toBe(true);
    });
    it("modifiedCount === 1", () => {
      expect(testUpdateRes.modifiedCount).toBe(1);
    });
    it("upsertedId === null", () => {
      expect(testUpdateRes.upsertedId).toBe(null);
    });
    it("upsertedCount === 0", () => {
      expect(testUpdateRes.upsertedCount).toBe(0);
    });
    it("matchedCount === 1", () => {
      expect(testUpdateRes.matchedCount).toBe(1);
    });
    it("find obj and asserts updated key/val is present", async () => {
      const found = await await TestCollection.readOne({
        _id: testCreatedObject.insertedId,
      });
      expect(found.water).toBe("melon");
    });

    it("throws err without 2 obj params", async () => {
      try {
        await TestCollection.updateOne({ _id: testCreatedObject.insertedId });
      } catch (e) {
        expect(e.message).toBe(
          "Cannot call TestCollection.updateOne without 2 object params: 1 the find obj, 2 the update obj",
        );
      }
    });
  });

  describe("errors throw when db is disconnected", () => {
    beforeAll(async () => {
      await TestMongoClient.close();
    });

    it("createOne", async () => {
      const testObj = { failable: "obj" };

      try {
        await TestCollection.createOne(testObj);
      } catch (e) {
        expect(e.message).toBe(
          "MongoNotConnectedError: Client must be connected before running operations",
        );
      }
    });

    it("readOne", async () => {
      try {
        await TestCollection.readOne({ _id: testCreatedObject.insertedId });
      } catch (e) {
        expect(e.message).toBe(
          "MongoNotConnectedError: Client must be connected before running operations",
        );
      }
    });
    it("readOne", async () => {
      try {
        await TestCollection.readMany();
      } catch (e) {
        expect(e.message).toBe(
          "MongoNotConnectedError: Client must be connected before running operations",
        );
      }
    });
    it("updateOne", async () => {
      try {
        await TestCollection.updateOne(
          { _id: testCreatedObject.insertedId },
          { $set: { poiu: "lkjh" } },
        );
      } catch (e) {
        expect(e.message).toBe(
          "MongoNotConnectedError: Client must be connected before running operations",
        );
      }
    });
    it("deleteOne", async () => {
      try {
        await TestCollection.deleteOne({ id: "horse" });
      } catch (e) {
        expect(e.message).toBe(
          "MongoNotConnectedError: Client must be connected before running operations",
        );
      }
    });
    it("remove", async () => {
      try {
        await TestCollection.remove();
      } catch (e) {
        expect(e.message).toBe(
          "MongoNotConnectedError: Client must be connected before running operations",
        );
      }
    });
  });
});
