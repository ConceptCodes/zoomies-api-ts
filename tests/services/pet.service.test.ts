import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "bun:test";
import PetService from "../../src/services/pet";
import { TestDatabaseHelper } from "../helpers/database";
import { petFixtures } from "../fixtures";
import { EntityNotFoundError } from "../../src/exceptions";

describe("PetService", () => {
  let petService: PetService;
  let testUserId: string;

  beforeAll(async () => {
    petService = new PetService();
  });

  beforeEach(async () => {
    await TestDatabaseHelper.cleanDatabase();
    const user = await TestDatabaseHelper.createTestUser();
    testUserId = user.id;
  });

  afterAll(async () => {
    await TestDatabaseHelper.cleanDatabase();
  });

  describe("getAll", () => {
    test("should return empty array when no pets exist", async () => {
      // Act
      const result = await petService.getAll(testUserId);

      // Assert
      expect(result).toEqual([]);
    });

    test("should return user's pets only", async () => {
      // Arrange
      await TestDatabaseHelper.createTestPet(petFixtures.dog, testUserId);
      await TestDatabaseHelper.createTestPet(petFixtures.cat, "other-user-id");

      // Act
      const result = await petService.getAll(testUserId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe(petFixtures.dog.name);
      expect(result[0].type).toBe(petFixtures.dog.type);
    });
  });

  describe("getOne", () => {
    test("should return pet by ID", async () => {
      // Arrange
      const pet = await TestDatabaseHelper.createTestPet(
        petFixtures.dog,
        testUserId
      );

      // Act
      const result = await petService.getOne(pet.id, testUserId);

      // Assert
      expect(result).toBeDefined();
      expect(result!.name).toBe(petFixtures.dog.name);
      expect(result!.type).toBe(petFixtures.dog.type);
    });

    test("should return null for non-existent pet", async () => {
      // Act
      const result = await petService.getOne("non-existent-id", testUserId);

      // Assert
      expect(result).toBeNull();
    });

    test("should return null for pet owned by different user", async () => {
      // Arrange
      const otherUserId = "other-user-id";
      const pet = await TestDatabaseHelper.createTestPet(
        petFixtures.dog,
        otherUserId
      );

      // Act
      const result = await petService.getOne(pet.id, testUserId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe("getAllByType", () => {
    test("should return pets of specific type", async () => {
      // Arrange
      await TestDatabaseHelper.createTestPet(petFixtures.dog, testUserId);
      await TestDatabaseHelper.createTestPet(petFixtures.cat, testUserId);

      // Act
      const result = await petService.getAllByType("dog", testUserId);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].type).toBe("dog");
    });

    test("should return empty array for type with no pets", async () => {
      // Arrange
      await TestDatabaseHelper.createTestPet(petFixtures.cat, testUserId);

      // Act
      const result = await petService.getAllByType("bird", testUserId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    test("should create new pet successfully", async () => {
      // Act
      await petService.create({
        ...petFixtures.dog,
        ownerId: testUserId,
      });

      // Assert
      const pets = await petService.getAll(testUserId);
      expect(pets).toHaveLength(1);
      expect(pets[0].name).toBe(petFixtures.dog.name);
      expect(pets[0].type).toBe(petFixtures.dog.type);
    });

    test("should throw error for non-existent owner", async () => {
      // Act & Assert
      await expect(
        petService.create({
          ...petFixtures.dog,
          ownerId: "non-existent-user-id",
        })
      ).toThrow(EntityNotFoundError);
    });

    test("should create pet with valid data", async () => {
      // Act
      await petService.create({
        name: "Fluffy",
        age: 5,
        type: "cat",
        ownerId: testUserId,
      });

      // Assert
      const pets = await petService.getAll(testUserId);
      expect(pets).toHaveLength(1);
      expect(pets[0].name).toBe("Fluffy");
      expect(pets[0].age).toBe(5);
      expect(pets[0].type).toBe("cat");
    });
  });

  describe("update", () => {
    test("should update pet successfully", async () => {
      // Arrange
      const pet = await TestDatabaseHelper.createTestPet(
        petFixtures.dog,
        testUserId
      );

      // Act
      await petService.update({
        id: pet.id,
        name: "Updated Name",
        age: 4,
        type: "cat",
        ownerId: testUserId,
      });

      // Assert
      const updatedPet = await petService.getOne(pet.id, testUserId);
      expect(updatedPet!.name).toBe("Updated Name");
      expect(updatedPet!.age).toBe(4);
      expect(updatedPet!.type).toBe("cat");
    });

    test("should throw error for non-existent pet", async () => {
      // Act & Assert
      await expect(
        petService.update({
          id: "non-existent-id",
          name: "Updated Name",
          age: 4,
          type: "cat",
          ownerId: testUserId,
        })
      ).toThrow(EntityNotFoundError);
    });

    test("should throw error for pet owned by different user", async () => {
      // Arrange
      const otherUserId = "other-user-id";
      const pet = await TestDatabaseHelper.createTestPet(
        petFixtures.dog,
        otherUserId
      );

      // Act & Assert
      await expect(
        petService.update({
          id: pet.id,
          name: "Updated Name",
          age: 4,
          type: "cat",
          ownerId: testUserId,
        })
      ).toThrow(EntityNotFoundError);
    });
  });

  describe("delete", () => {
    test("should delete pet successfully", async () => {
      // Arrange
      const pet = await TestDatabaseHelper.createTestPet(
        petFixtures.dog,
        testUserId
      );

      // Act
      await petService.delete(pet.id, testUserId);

      // Assert
      const result = await petService.getOne(pet.id, testUserId);
      expect(result).toBeNull();
    });

    test("should throw error for non-existent pet", async () => {
      // Act & Assert
      await expect(petService.delete("non-existent-id", testUserId)).toThrow(
        EntityNotFoundError
      );
    });

    test("should throw error for pet owned by different user", async () => {
      // Arrange
      const otherUserId = "other-user-id";
      const pet = await TestDatabaseHelper.createTestPet(
        petFixtures.dog,
        otherUserId
      );

      // Act & Assert
      await expect(petService.delete(pet.id, testUserId)).toThrow(
        EntityNotFoundError
      );
    });
  });
});
