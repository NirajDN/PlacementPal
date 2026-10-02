/**
 * PlacementPal - Core Question Seed Database
 * Provides initial seed context, category metadata, and fallback seed questions
 * for DSA, JavaScript, and HR / Behavioral categories.
 */

export const CATEGORIES = {
  dsa: {
    id: "dsa",
    name: "Data Structures & Algorithms",
    description: "Arrays, Strings, Hashing, Two Pointers, Sliding Window, Stack/Queue, Binary Search, Linked Lists, Trees",
    icon: "Code2",
    subtopics: [
      "Arrays", "Strings", "Hashing", "Two Pointers", "Sliding Window",
      "Stack/Queue", "Binary Search", "Linked Lists", "Trees"
    ]
  },
  javascript: {
    id: "javascript",
    name: "JavaScript & Web Fundamentals",
    description: "let/const/var, Closures, Promises, async/await, Event Loop, Hoisting, Array methods, DOM basics",
    icon: "FileCode",
    subtopics: [
      "let/const/var", "Closures", "Promises", "async/await",
      "Event Loop", "Hoisting", "Array methods", "DOM basics"
    ]
  },
  hr: {
    id: "hr",
    name: "HR & Behavioral",
    description: "Tell me about yourself, Strengths & weaknesses, Project discussion, Teamwork, Conflict, Leadership, Career goals",
    icon: "UserCheck",
    subtopics: [
      "Tell me about yourself", "Strengths and weaknesses", "Project discussion",
      "Teamwork", "Conflict", "Leadership", "Career goals"
    ]
  }
};

export const QUESTION_BANK = {
  dsa: {
    Easy: [
      {
        topic: "Arrays / Hashing",
        question: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Explain your approach, time complexity, and space complexity.",
        hint: "Consider using a Hash Table to look up complementary values in O(1) time."
      },
      {
        topic: "Strings / Two Pointers",
        question: "How would you determine if a given string is a valid palindrome, considering only alphanumeric characters and ignoring cases? What is the time and space complexity of your approach?",
        hint: "You can use two pointers starting at opposite ends of the string."
      },
      {
        topic: "Stack",
        question: "Explain how you would implement a Valid Parentheses validator to check if strings containing '()[]{}' have correctly closed brackets in order.",
        hint: "A LIFO Stack is ideal for keeping track of open brackets."
      },
      {
        topic: "Binary Search",
        question: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if inserted in order. Explain the algorithm.",
        hint: "Use binary search with low and high pointers to achieve O(log N)."
      },
      {
        topic: "Arrays",
        question: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
        hint: "Sum formula n*(n+1)/2 or XOR approach."
      }
    ],
    Medium: [
      {
        topic: "Sliding Window",
        question: "Given a string `s`, find the length of the longest substring without repeating characters. Walk through your logic with an example like 'abcabcbb'.",
        hint: "Maintain a dynamic sliding window with left/right indices and a set/map of seen characters."
      },
      {
        topic: "Two Pointers",
        question: "Given an integer array `height` representing container walls, find two lines that together with the x-axis form a container containing the most water. How do you decide which pointer to move?",
        hint: "Move the pointer pointing to the shorter line inward to maximize height potential."
      },
      {
        topic: "Trees",
        question: "Given the root of a binary tree, determine if it is a valid Binary Search Tree (BST). Explain the constraint checks you must maintain during tree traversal.",
        hint: "Each node value must strictly fit within valid (min, max) bounds inherited from parent nodes."
      },
      {
        topic: "Linked Lists",
        question: "How do you detect if a linked list contains a cycle? Explain Floyd's Cycle Detection (Fast and Slow pointer) algorithm.",
        hint: "If a slow pointer advances 1 step and fast advances 2 steps, they will meet inside a cycle."
      },
      {
        topic: "Hashing / Arrays",
        question: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence in O(n) time.",
        hint: "Store numbers in a Hash Set and only initiate sequence counting if `num - 1` is not in the set."
      }
    ],
    Hard: [
      {
        topic: "Arrays / Hard Math",
        question: "Given an unsorted integer array `nums`, return the smallest missing positive integer in O(n) time and O(1) auxiliary space.",
        hint: "Use cyclic sort / index hashing to place elements in their natural position (`nums[i] == i + 1`)."
      },
      {
        topic: "Sliding Window / Monotonic Queue",
        question: "You are given an array of integers `nums` and a sliding window size `k`. Find the maximum element in each sliding window position in O(n) time.",
        hint: "Maintain a monotonic decreasing deque storing indices of maximum candidates."
      },
      {
        topic: "Trees / Graph Traversal",
        question: "Given the root of a binary tree, serialize it into a string and deserialize it back into the original tree structure. Explain your design.",
        hint: "Pre-order traversal with explicit null sentinel values (e.g. 'null,#') allows exact reconstruction."
      }
    ]
  },
  javascript: {
    Easy: [
      {
        topic: "let/const/var",
        question: "What are the key differences between `var`, `let`, and `const` in JavaScript regarding scope, hoisting, and re-declaration?",
        hint: "Mention function scope vs block scope, TDZ (Temporal Dead Zone), and re-assignment rules."
      },
      {
        topic: "Array methods",
        question: "Explain the difference between `Array.prototype.map()`, `Array.prototype.forEach()`, and `Array.prototype.filter()`. When would you use each?",
        hint: "`map` returns a new array, `filter` returns a subset matching a condition, `forEach` executes side-effects without returning a new array."
      },
      {
        topic: "Hoisting",
        question: "What is hoisting in JavaScript? Explain how function declarations and variable declarations (var vs let/const) behave during creation phase.",
        hint: "Functions and `var` are hoisted with initial `undefined` value; `let`/`const` remain in Temporal Dead Zone."
      }
    ],
    Medium: [
      {
        topic: "Closures",
        question: "What is a closure in JavaScript? Provide a real-world code example where closures are helpful (e.g. data privacy or function currying).",
        hint: "A closure is a function bundled together with references to its surrounding lexical environment."
      },
      {
        topic: "Promises & async/await",
        question: "How do Promises work under the hood in JavaScript? Explain the states of a Promise and how `async/await` syntactically builds on top of Promises.",
        hint: "Pending, Fulfilled, Rejected states. Async functions automatically wrap returned values in Promises."
      },
      {
        topic: "Event Loop",
        question: "Explain the JavaScript Event Loop, Call Stack, Microtask Queue (Promises), and Macrotask Queue (setTimeout/setInterval). What is the output of:\n`console.log(1); setTimeout(()=>console.log(2), 0); Promise.resolve().then(()=>console.log(3)); console.log(4);`?",
        hint: "Output order is 1, 4, 3, 2 because microtasks run before macrotasks."
      }
    ],
    Hard: [
      {
        topic: "DOM & Performance",
        question: "Explain event delegation in JavaScript and why it is useful. How would you handle dynamic list item clicks efficiently?",
        hint: "Attach a single event listener to a parent container using `event.target` instead of binding listeners to every child."
      },
      {
        topic: "Prototypal Inheritance",
        question: "Explain JavaScript's prototypal inheritance model (`__proto__` vs `prototype`). How does property lookup propagate up the prototype chain?",
        hint: "Objects inherit directly from other objects via prototype reference until reaching `null`."
      }
    ]
  },
  hr: {
    Easy: [
      {
        topic: "Tell me about yourself",
        question: "Tell me about yourself and walk me through your background, technical focus, and why you are interested in software engineering placements.",
        hint: "Use the Present-Past-Future structure: Current status/skills, past projects/education, future goal."
      },
      {
        topic: "Strengths and weaknesses",
        question: "What is one of your greatest technical strengths, and what is a genuine area of improvement you are actively working on?",
        hint: "Frame weaknesses constructively with concrete action steps you take to overcome them."
      }
    ],
    Medium: [
      {
        topic: "Project discussion",
        question: "Tell me about a challenging technical project you built. What was the core problem, what technology did you choose, and how did you measure success?",
        hint: "Use the STAR method: Situation, Task, Action, Result."
      },
      {
        topic: "Teamwork & Conflict",
        question: "Describe a situation where you had a disagreement with a team member or project peer about an architectural or design decision. How did you resolve it?",
        hint: "Focus on active listening, objective data/benchmarks, and consensus building."
      }
    ],
    Hard: [
      {
        topic: "Leadership & Adaptability",
        question: "Tell me about a time when a project requirement completely changed right before a deadline or a unexpected technical blocker occurred. How did you handle it?",
        hint: "Highlight calm prioritization, clear communication, and trade-off analysis."
      }
    ]
  }
};
