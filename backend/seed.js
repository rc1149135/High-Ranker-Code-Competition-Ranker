import mongoose from "mongoose";
import problem from "./models/problem.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const problems = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: "Given a list of integers and a target, return the indices of the two numbers that add up to the target. \n\nExample Input: '2 7 11 15 9'\nExample Output: '0 1'",
    difficulty: "Easy",
    testCases: [
      { input: "2 7 11 15 9", expectedOutput: "0 1" },
      { input: "3 2 4 6", expectedOutput: "1 2" }
    ],
    points: 10
  },
  {
    title: "Palindrome Check",
    slug: "palindrome-check",
    description: "Check if a string is a palindrome. \n\nExample Input: 'racecar'\nExample Output: 'true'",
    difficulty: "Easy",
    testCases: [
      { input: "racecar", expectedOutput: "true" },
      { input: "hello", expectedOutput: "false" }
    ],
    points: 10
  },
  {
    title: "Reverse String",
    slug: "reverse-string",
    description: "Reverse a given string. \n\nExample Input: 'hello'\nExample Output: 'olleh'",
    difficulty: "Easy",
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "world", expectedOutput: "dlrow" }
    ],
    points: 10
  },
  {
    title: "Max Subarray Sum",
    slug: "max-subarray-sum",
    description: "Find the maximum sum of a contiguous subarray. \n\nExample Input: '-2 1 -3 4 -1 2 1 -5 4'\nExample Output: '6'",
    difficulty: "Medium",
    testCases: [
      { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      { input: "1", expectedOutput: "1" }
    ],
    points: 20
  },
  {
    title: "Factorial",
    slug: "factorial",
    description: "Calculate the factorial of a number n. \n\nExample Input: '5'\nExample Output: '120'",
    difficulty: "Easy",
    testCases: [
      { input: "5", expectedOutput: "120" },
      { input: "3", expectedOutput: "6" }
    ],
    points: 10
  },
  {
    title: "Fibonacci",
    slug: "fibonacci",
    description: "Find the nth Fibonacci number. \n\nExample Input: '10'\nExample Output: '55'",
    difficulty: "Easy",
    testCases: [
      { input: "5", expectedOutput: "5" },
      { input: "10", expectedOutput: "55" }
    ],
    points: 10
  },
  {
    title: "Contains Duplicate",
    slug: "contains-duplicate",
    description: "Return true if any value appears at least twice. \n\nExample Input: '1 2 3 1'\nExample Output: 'true'",
    difficulty: "Easy",
    testCases: [
      { input: "1 2 3 1", expectedOutput: "true" },
      { input: "1 2 3 4", expectedOutput: "false" }
    ],
    points: 10
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    description: "Check if the input string has valid parentheses. \n\nExample Input: '()[]{}'\nExample Output: 'true'",
    difficulty: "Medium",
    testCases: [
      { input: "()[]{}", expectedOutput: "true" },
      { input: "([)]", expectedOutput: "false" }
    ],
    points: 20
  },
  {
    title: "Binary Search",
    slug: "binary-search",
    description: "Find index of target in sorted array. \n\nExample Input: '-1 0 3 5 9 12 9'\nExample Output: '4'",
    difficulty: "Easy",
    testCases: [
      { input: "-1 0 3 5 9 12 9", expectedOutput: "4" },
      { input: "-1 0 3 5 9 12 2", expectedOutput: "-1" }
    ],
    points: 10
  },
  {
    title: "Climbing Stairs",
    slug: "climbing-stairs",
    description: "How many ways to climb n stairs taking 1 or 2 steps. \n\nExample Input: '3'\nExample Output: '3'",
    difficulty: "Easy",
    testCases: [
      { input: "2", expectedOutput: "2" },
      { input: "3", expectedOutput: "3" }
    ],
    points: 10
  },
  {
    title: "Move Zeroes",
    slug: "move-zeroes",
    description: "Move all 0's to the end while maintaining order. \n\nExample Input: '0 1 0 3 12'\nExample Output: '1 3 12 0 0'",
    difficulty: "Easy",
    testCases: [
      { input: "0 1 0 3 12", expectedOutput: "1 3 12 0 0" },
      { input: "0", expectedOutput: "0" }
    ],
    points: 10
  },
  {
    title: "Single Number",
    slug: "single-number",
    description: "Find the element that appears only once. \n\nExample Input: '4 1 2 1 2'\nExample Output: '4'",
    difficulty: "Easy",
    testCases: [
      { input: "2 2 1", expectedOutput: "1" },
      { input: "4 1 2 1 2", expectedOutput: "4" }
    ],
    points: 10
  },
  {
    title: "FizzBuzz",
    slug: "fizzbuzz",
    description: "For 1 to n, print Fizz if div by 3, Buzz if div by 5, FizzBuzz if both. \n\nExample Input: '3'\nExample Output: '1 2 Fizz'",
    difficulty: "Easy",
    testCases: [
      { input: "3", expectedOutput: "1 2 Fizz" },
      { input: "5", expectedOutput: "1 2 Fizz 4 Buzz" }
    ],
    points: 10
  },
  {
    title: "Length of Last Word",
    slug: "length-of-last-word",
    description: "Return the length of the last word in the string. \n\nExample Input: 'Hello World'\nExample Output: '5'",
    difficulty: "Easy",
    testCases: [
      { input: "Hello World", expectedOutput: "5" },
      { input: "   fly me   to   the moon  ", expectedOutput: "4" }
    ],
    points: 10
  },
  {
    title: "Best Time to Buy and Sell Stock",
    slug: "best-time-stock",
    description: "Find max profit from buying and selling stock. \n\nExample Input: '7 1 5 3 6 4'\nExample Output: '5'",
    difficulty: "Easy",
    testCases: [
      { input: "7 1 5 3 6 4", expectedOutput: "5" },
      { input: "7 6 4 3 1", expectedOutput: "0" }
    ],
    points: 10
  },
  {
    title: "Plus One",
    slug: "plus-one",
    description: "Increment the large integer represented as digits. \n\nExample Input: '1 2 3'\nExample Output: '1 2 4'",
    difficulty: "Easy",
    testCases: [
      { input: "1 2 3", expectedOutput: "1 2 4" },
      { input: "9", expectedOutput: "1 0" }
    ],
    points: 10
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    for (const prob of problems) {
        await problem.findOneAndUpdate(
            { slug: prob.slug }, 
            prob,                
            { upsert: true, new: true }
        );
    }
    
    console.log("Database Seeded Successfully (Upsert Mode)!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();