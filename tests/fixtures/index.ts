export const userFixtures = {
  validUser: {
    email: "test@example.com",
    password: "password123",
    fullName: "Test User",
    phoneNumber: "1234567890",
  },
  adminUser: {
    email: "admin@example.com",
    password: "admin123",
    fullName: "Admin User",
    phoneNumber: "0987654321",
  },
  invalidUser: {
    email: "invalid-email",
    password: "123", // too short
    fullName: "", // empty
    phoneNumber: "abc", // invalid
  },
};

export const petFixtures = {
  dog: {
    name: "Buddy",
    age: 3,
    type: "dog",
  },
  cat: {
    name: "Whiskers",
    age: 2,
    type: "cat",
  },
  invalidPet: {
    name: "", // empty
    age: -1, // invalid
    type: "dragon", // invalid type
  },
};

export const vetFixtures = {
  fullTime: {
    userId: "vet-user-id",
    allowedPetTypes: ["dog", "cat", "bird"],
    startHour: 9,
    endHour: 17,
    days: 5,
  },
  partTime: {
    userId: "part-time-vet-id",
    allowedPetTypes: ["dog"],
    startHour: 14,
    endHour: 18,
    days: 3,
  },
  invalidVet: {
    userId: "invalid-vet-id",
    allowedPetTypes: [], // empty
    startHour: 25, // invalid hour
    endHour: 5, // invalid (end before start)
    days: 8, // invalid (more than 7)
  },
};

export const serviceFixtures = {
  wellness: {
    name: "Annual Wellness Exam",
    description: "Complete physical examination and consultation",
    applicablePetTypes: ["dog", "cat"],
    price: 8500,
  },
  grooming: {
    name: "Basic Grooming",
    description: "Bath and brush service",
    applicablePetTypes: ["dog"],
    price: 5000,
  },
  invalidService: {
    name: "", // empty
    description: "A".repeat(1001), // too long
    applicablePetTypes: [], // empty
    price: -100, // negative
  },
};

export const appointmentFixtures = {
  tomorrow: {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    description: "Regular checkup",
    duration: 30,
  },
  yesterday: {
    date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    description: "Past appointment",
    duration: 45,
  },
  invalidAppointment: {
    date: new Date("invalid date"),
    description: "",
    duration: -10, // negative
  },
};

export const authFixtures = {
  validLogin: {
    email: "test@example.com",
    password: "password123",
  },
  invalidLogin: {
    email: "nonexistent@example.com",
    password: "wrongpassword",
  },
  validReset: {
    email: "test@example.com",
    code: "123456",
    password: "newpassword123",
  },
  invalidReset: {
    email: "test@example.com",
    code: "000000", // invalid code
    password: "new", // too short
  },
};
