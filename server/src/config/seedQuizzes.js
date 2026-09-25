import { Quiz } from '../models/Quiz.js';
import { Skill } from '../models/Skill.js';

export const quizCatalog = [
  // 1. Web Fundamentals
  {
    title: 'HTML & CSS Fundamentals',
    description: 'Test your core web architecture knowledge: DOM hierarchy, CSS specificity, the box model, and layout models.',
    category: 'Web Fundamentals',
    difficulty: 'beginner',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 100,
    coinReward: 25,
    maxAttempts: 10,
    questions: [
      {
        text: 'In the standard CSS box model, what constitutes the total rendered width of a block element?',
        options: [
          'width only',
          'width + padding + border',
          'width + padding + border + margin',
          'width + margin only'
        ],
        correctIndex: 1,
        explanation: 'In the standard box-sizing: content-box model, the rendered element width is width + left/right padding + left/right border. Margin creates outer space around the box.'
      },
      {
        text: 'Which CSS selector has the highest specificity weight?',
        options: [
          'div.header > p',
          '#main-nav .menu-item',
          'body #content p.highlight',
          '.nav-link:hover'
        ],
        correctIndex: 2,
        explanation: 'body #content p.highlight contains 1 ID selector (#content), 1 class (.highlight), and 2 element tags (body, p), resulting in specificity (0, 1, 1, 2) which beats (0, 1, 1, 0).'
      },
      {
        text: 'What is the primary architectural benefit of HTML5 semantic elements (e.g. <article>, <nav>, <aside>)?',
        options: [
          'They render significantly faster on GPU accelerators',
          'They improve accessibility tree comprehension and SEO structural parsing',
          'They automatically apply flexbox styling without CSS',
          'They encrypt text elements across HTTP transmissions'
        ],
        correctIndex: 1,
        explanation: 'Semantic elements provide meaningful structural context for screen readers, accessibility engines, and search engine crawlers.'
      },
      {
        text: 'In CSS Flexbox, what does justify-content align along?',
        options: [
          'Always the vertical axis',
          'The cross axis',
          'The main axis defined by flex-direction',
          'The baseline of adjacent inline elements'
        ],
        correctIndex: 2,
        explanation: 'justify-content distributes extra space along the main axis, which depends on flex-direction (row or column).'
      }
    ]
  },
  {
    title: 'Responsive Web Design',
    description: 'Master viewport configuration, fluid responsive typography, CSS Grid, media queries, and mobile-first layouts.',
    category: 'Web Fundamentals',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'Why is `<meta name="viewport" content="width=device-width, initial-scale=1.0">` essential for responsive designs?',
        options: [
          'It forces desktop browsers to load smaller image files',
          'It maps the CSS layout viewport 1:1 with device-independent screen pixels',
          'It enables hardware-accelerated 3D transforms on mobile GPUs',
          'It triggers dark mode styling on supported mobile OS displays'
        ],
        correctIndex: 1,
        explanation: 'Without this viewport tag, mobile browsers assume a desktop page width (~980px) and scale it down, rendering fonts illegibly small.'
      },
      {
        text: 'In CSS Grid, what does the template column declaration `repeat(auto-fit, minmax(280px, 1fr))` achieve?',
        options: [
          'A fixed 280px column that refuses to shrink on mobile',
          'A responsive auto-wrapping grid that fits as many >=280px tracks as available space allows',
          'An animated carousel slider with 280ms duration',
          'A table with strictly 1 fraction column'
        ],
        correctIndex: 1,
        explanation: 'repeat(auto-fit, minmax(...)) dynamically calculates how many tracks fit the container and stretches them equally without needing media queries.'
      },
      {
        text: 'In mobile-first responsive architecture, how are CSS media queries typically structured?',
        options: [
          'Using max-width queries from desktop down to mobile',
          'Using min-width queries progressively enhancing larger viewports',
          'Using orientation queries only',
          'Using device-pixel-ratio queries exclusively'
        ],
        correctIndex: 1,
        explanation: 'Mobile-first design defines base styles for small screens and uses min-width media queries as screen real estate expands.'
      },
      {
        text: 'What is the key difference between CSS units `rem` and `em`?',
        options: [
          'rem is relative to root (html) font-size, while em is relative to its immediate parent font-size',
          'rem only applies to paddings, whereas em is strictly for font-size',
          'rem is fixed in millimeters, em is relative to viewport height',
          'There is no functional difference in modern browsers'
        ],
        correctIndex: 0,
        explanation: 'rem (root em) always scales relative to the <html> root element font size, avoiding compound nesting scaling issues common with em.'
      }
    ]
  },

  // 2. JavaScript
  {
    title: 'JavaScript Fundamentals',
    description: 'Deep-dive into JavaScript execution context, lexical scoping, closures, hoisting, and type coercion.',
    category: 'JavaScript',
    difficulty: 'beginner',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 100,
    coinReward: 25,
    maxAttempts: 10,
    questions: [
      {
        text: 'What will `typeof NaN` and `typeof null` evaluate to in JavaScript?',
        options: [
          '"number" and "object"',
          '"nan" and "null"',
          '"undefined" and "object"',
          '"number" and "null"'
        ],
        correctIndex: 0,
        explanation: 'In JavaScript, NaN is considered a numeric type ("number"), and typeof null returning "object" is a historic ECMAScript specification behavior.'
      },
      {
        text: 'How does variable hoisting behave for `var` compared to `let` and `const`?',
        options: [
          'let and const are hoisted and initialized to null',
          'var is hoisted and initialized to undefined; let and const are in the Temporal Dead Zone (TDZ)',
          'var is not hoisted at all, only functions are hoisted',
          'None of them are hoisted in ES6+'
        ],
        correctIndex: 1,
        explanation: 'var is hoisted and initialized as undefined. let and const declarations are hoisted to the top of their block scope but remain uninitialized in the TDZ until evaluated.'
      },
      {
        text: 'What is a closure in JavaScript?',
        options: [
          'A method to terminate an infinite loop safely',
          'A function bundled together with references to its surrounding lexical environment',
          'An immutable JSON document stored in localStorage',
          'A private class property syntax introduced in ES2022'
        ],
        correctIndex: 1,
        explanation: 'A closure gives an inner function access to an outer function’s scope even after the outer function has executed and returned.'
      },
      {
        text: 'What will `console.log(1 + "2" + 3)` output?',
        options: [
          '"6"',
          '"123"',
          '15',
          'NaN'
        ],
        correctIndex: 1,
        explanation: '1 + "2" performs string coercion yielding "12", and "12" + 3 subsequently coerces to string "123".'
      }
    ]
  },
  {
    title: 'JavaScript Array Methods Mastery',
    description: 'Test your understanding of map, filter, reduce, slice, splice, and functional immutable transformations.',
    category: 'JavaScript',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 300,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'Which array method returns a brand new array with transformed elements without mutating the original?',
        options: ['forEach()', 'map()', 'push()', 'splice()'],
        correctIndex: 1,
        explanation: 'map() creates a new array populated with the results of calling a provided function on every element in the calling array without modifying the source.'
      },
      {
        text: 'What is the return value of `[1, 2, 3, 4].filter(x => x % 2 === 0)`?',
        options: ['[1, 3]', '[2, 4]', '[true, false]', '4'],
        correctIndex: 1,
        explanation: 'filter() returns an array with elements that evaluate truthy for the predicate test (even numbers: [2, 4]).'
      },
      {
        text: 'What will `[1, 2, 3].reduce((acc, curr) => acc + curr, 10)` evaluate to?',
        options: ['6', '16', '10', 'undefined'],
        correctIndex: 1,
        explanation: 'With an initial accumulator of 10, adding 1 + 2 + 3 yields a final sum of 16.'
      },
      {
        text: 'What is the core behavioral difference between `Array.prototype.slice()` and `Array.prototype.splice()`?',
        options: [
          'slice() mutates in-place; splice() returns a shallow copy',
          'slice() returns a shallow copy without mutation; splice() mutates the original array',
          'slice() only works on numbers; splice() works on strings',
          'Both methods mutate the calling array identically'
        ],
        correctIndex: 1,
        explanation: 'slice() extracts a shallow slice without touching the original array. splice() modifies the array directly by removing or replacing elements.'
      }
    ]
  },
  {
    title: 'JavaScript ES6+ Concepts',
    description: 'Evaluate your knowledge of Promises, async/await, restructuring, modules, Symbol, and Optional Chaining.',
    category: 'JavaScript',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 130,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'What will `Promise.all([p1, p2, p3])` do if `p2` rejects?',
        options: [
          'Wait for p1 and p3 to finish, then resolve successful values',
          'Immediately reject with p2’s reason without waiting for remaining promises',
          'Retry p2 three times before failing',
          'Resolve with null in place of p2'
        ],
        correctIndex: 1,
        explanation: 'Promise.all rejects immediately upon the first rejection (fail-fast behavior).'
      },
      {
        text: 'What is the evaluation of `const user = null; console.log(user?.profile?.name ?? "Guest");`?',
        options: [
          'Throws TypeError: Cannot read property profile of null',
          '"Guest"',
          'undefined',
          'null'
        ],
        correctIndex: 1,
        explanation: 'Optional chaining `user?.profile` short-circuits to `undefined`, and nullish coalescing `??` replaces `undefined` with fallback `"Guest"`.'
      },
      {
        text: 'In the event loop, in which order are Microtasks (Promises) and Macrotasks (setTimeout) executed?',
        options: [
          'Macrotasks always run before Microtasks',
          'All Microtasks in the queue are executed immediately after current synchronous code before the next Macrotask',
          'They execute in strict 1-to-1 round-robin order',
          'Microtasks only execute when Web Workers are idle'
        ],
        correctIndex: 1,
        explanation: 'The microtask queue is completely drained after each execution task/call stack clearance before moving to the next macrotask.'
      },
      {
        text: 'How does object spread `const clone = { ...original }` handle nested object properties?',
        options: [
          'Performs a recursive deep clone of all nested objects',
          'Performs a shallow copy; nested references still point to original memory locations',
          'Converts nested objects into strings',
          'Throws an error if depth exceeds 1'
        ],
        correctIndex: 1,
        explanation: 'Spread syntax `{ ...obj }` creates a shallow copy. Nested objects are copied by reference.'
      }
    ]
  },

  // 3. Python
  {
    title: 'Python Fundamentals',
    description: 'Verify your mastery of Python syntax, data types, slicing operations, truthiness, and control structures.',
    category: 'Python',
    difficulty: 'beginner',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 100,
    coinReward: 25,
    maxAttempts: 10,
    questions: [
      {
        text: 'What is the output of `lst = [10, 20, 30, 40, 50]; print(lst[::-2])` in Python?',
        options: [
          '[50, 30, 10]',
          '[10, 30, 50]',
          '[40, 20]',
          '[50, 40, 30]'
        ],
        correctIndex: 0,
        explanation: 'The slice `[::-2]` steps backwards from the end by 2, picking index 4 (50), index 2 (30), and index 0 (10).'
      },
      {
        text: 'Which of the following values evaluates to `False` in a Python Boolean context?',
        options: [
          '[0]',
          '"False"',
          '()',
          '{"key": None}'
        ],
        correctIndex: 2,
        explanation: 'Empty sequences like empty tuple `()` evaluate to False. Non-empty collections `[0]`, `"False"`, and `{"key": None}` are truthy.'
      },
      {
        text: 'What is the difference between `is` and `==` in Python?',
        options: [
          '`is` checks memory identity (same object), while `==` checks value equality',
          '`==` checks memory identity, `is` checks value equality',
          '`is` is used only for strings, `==` for numbers',
          'They are completely synonymous aliases'
        ],
        correctIndex: 0,
        explanation: '`is` checks if two variables point to the exact same memory location (id), while `==` calls the `__eq__` method to compare values.'
      },
      {
        text: 'How does Python handle variable scope inside a function when modifying a global variable without the `global` keyword?',
        options: [
          'Modifies the global variable directly',
          'Creates a new local variable inside the function scope or raises UnboundLocalError on premature read',
          'Throws a syntax error during file parsing',
          'Converts the variable to a static thread-local'
        ],
        correctIndex: 1,
        explanation: 'Assigning to a variable inside a function without `global` scopes it locally, causing UnboundLocalError if referenced before assignment.'
      }
    ]
  },
  {
    title: 'Python Data Structures',
    description: 'Test list comprehensions, dictionary operations, sets, tuples, and memory efficiency.',
    category: 'Python',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'What is the average time complexity for checking membership (`x in collection`) in a Python `set` vs a `list`?',
        options: [
          'Set: O(1), List: O(N)',
          'Set: O(N), List: O(1)',
          'Both are O(log N)',
          'Set: O(N log N), List: O(N)'
        ],
        correctIndex: 0,
        explanation: 'Sets are implemented as hash tables offering O(1) average lookup, whereas lists require O(N) linear scans.'
      },
      {
        text: 'What will `{x: x**2 for x in range(4) if x % 2 != 0}` generate?',
        options: [
          '{0: 0, 2: 4}',
          '{1: 1, 3: 9}',
          '[1, 9]',
          '{1: 1, 2: 4, 3: 9}'
        ],
        correctIndex: 1,
        explanation: 'The dictionary comprehension filters for odd numbers in range 0..3 (which are 1 and 3) mapping to squares 1 and 9.'
      },
      {
        text: 'Why can a `tuple` be used as a dictionary key in Python, while a `list` cannot?',
        options: [
          'Tuples are immutable and hashable; lists are mutable and unhashable',
          'Tuples have a fixed maximum size of 256 items',
          'Lists take up less RAM than tuples',
          'Dictionaries only accept string-like keys'
        ],
        correctIndex: 0,
        explanation: 'Dictionary keys must be hashable. Tuples containing immutable elements have fixed hash values, whereas mutable lists cannot guarantee invariant hashes.'
      },
      {
        text: 'What does `dict.get(key, default)` return if `key` does not exist in the dictionary?',
        options: [
          'Throws KeyError',
          'The provided default argument (or None if omitted)',
          '0',
          'Empty string ""'
        ],
        correctIndex: 1,
        explanation: '`.get()` safely retrieves values without raising KeyError, returning the fallback default parameter.'
      }
    ]
  },
  {
    title: 'Python Functions & OOP',
    description: 'Master decorators, *args/**kwargs, inheritance, dunder methods, and generator functions.',
    category: 'Python',
    difficulty: 'advanced',
    passingScore: 70,
    timeLimit: 420,
    xpReward: 140,
    coinReward: 35,
    maxAttempts: 10,
    questions: [
      {
        text: 'What does the `yield` keyword do when placed inside a Python function body?',
        options: [
          'Immediately terminates program execution',
          'Turns the function into a generator, producing values lazily on demand via the iterator protocol',
          'Locks the CPU thread until background I/O finishes',
          'Returns a static list of all arguments'
        ],
        correctIndex: 1,
        explanation: 'Functions containing `yield` return a generator object that pauses execution state between successive `next()` calls.'
      },
      {
        text: 'In Python object-oriented programming, what is the role of `__repr__` compared to `__str__`?',
        options: [
          '`__repr__` is for developer debugging (unambiguous representation), `__str__` is for readable user display',
          '`__repr__` converts objects to XML; `__str__` converts to JSON',
          '`__str__` is required for all classes, `__repr__` is deprecated',
          '`__repr__` only handles numeric instances'
        ],
        correctIndex: 0,
        explanation: '`__repr__` aims to provide an official, unambiguous string (often valid Python code), while `__str__` provides a clean human-readable representation.'
      },
      {
        text: 'What happens when a default mutable argument like `def func(lst=[])` is defined in Python?',
        options: [
          'A new list is created every time the function is called',
          'The same list instance is shared across all function calls that omit the parameter',
          'Python raises a SyntaxError at compile time',
          'The list is automatically frozen into an immutable tuple'
        ],
        correctIndex: 1,
        explanation: 'Default parameter values are evaluated once when the function is defined, causing mutable defaults to persist state across invocations.'
      },
      {
        text: 'What decorator is used to define a method that operates on the class itself rather than an instance?',
        options: [
          '@staticmethod',
          '@classmethod',
          '@property',
          '@abstractmethod'
        ],
        correctIndex: 1,
        explanation: '@classmethod passes the class `cls` as its first parameter instead of an instance `self`.'
      }
    ]
  },

  // 4. Java
  {
    title: 'Java Fundamentals',
    description: 'Evaluate your knowledge of the JVM runtime, primitive types, wrapper classes, and memory garbage collection.',
    category: 'Java',
    difficulty: 'beginner',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 100,
    coinReward: 25,
    maxAttempts: 10,
    questions: [
      {
        text: 'What is the role of the Java Virtual Machine (JVM)?',
        options: [
          'It compiles raw Java source code (.java) into machine native binary',
          'It executes compiled Java bytecode (.class) providing cross-platform portability',
          'It manages database relational schemas',
          'It replaces the operating system kernel'
        ],
        correctIndex: 1,
        explanation: 'The JVM interprets and JIT-compiles universal Java bytecode into target CPU architecture instructions.'
      },
      {
        text: 'Where are objects created with the `new` keyword stored in Java memory architecture?',
        options: [
          'Call Stack',
          'Heap Memory',
          'CPU Registers',
          'Native Method Stack'
        ],
        correctIndex: 1,
        explanation: 'All objects in Java are dynamically allocated on the Heap memory, managed by the Garbage Collector.'
      },
      {
        text: 'What will `String s1 = "hello"; String s2 = new String("hello"); System.out.println(s1 == s2);` output?',
        options: [
          'true',
          'false',
          'NullPointerException',
          'Compilation error'
        ],
        correctIndex: 1,
        explanation: '`==` compares object memory references. s1 points to the String Constant Pool, while `new String(...)` allocates a distinct object on the heap.'
      },
      {
        text: 'Which Java collection class is synchronized and thread-safe by default?',
        options: [
          'ArrayList',
          'Vector',
          'LinkedList',
          'HashSet'
        ],
        correctIndex: 1,
        explanation: 'Vector methods are synchronized for thread-safety, unlike ArrayList which is unsynchronized for faster single-thread throughput.'
      }
    ]
  },
  {
    title: 'Java OOP Concepts',
    description: 'Demonstrate understanding of polymorphism, inheritance, abstract classes, interfaces, and method overriding.',
    category: 'Java',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'Can a Java class extend multiple abstract classes?',
        options: [
          'Yes, by separating them with commas',
          'No, Java does not support multiple class inheritance to avoid the diamond problem',
          'Yes, but only if all methods are static',
          'Yes, if the classes are declared final'
        ],
        correctIndex: 1,
        explanation: 'Java allows single class inheritance (extends) but multiple interface implementations (implements).'
      },
      {
        text: 'What happens when a subclass defines a method with the exact same signature as its superclass?',
        options: [
          'Method Overloading',
          'Method Overriding',
          'Method Shadowing',
          'Compilation Error'
        ],
        correctIndex: 1,
        explanation: 'Defining the same method signature in a subclass is Method Overriding (runtime polymorphism).'
      },
      {
        text: 'What is the purpose of the `final` keyword when applied to a Java class?',
        options: [
          'It prevents the class from being instantiated',
          'It prevents the class from being subclassed (inherited)',
          'It makes all class fields immutable automatically',
          'It forces garbage collection upon class unload'
        ],
        correctIndex: 1,
        explanation: 'A final class cannot be extended by any other class (e.g. java.lang.String is final).'
      },
      {
        text: 'Which principle states that objects of a superclass should be replaceable with objects of its subclasses without altering program correctness?',
        options: [
          'Single Responsibility Principle',
          'Liskov Substitution Principle (LSP)',
          'Open/Closed Principle',
          'Interface Segregation Principle'
        ],
        correctIndex: 1,
        explanation: 'LSP (the L in SOLID) asserts that subclasses must remain substitutable for their parent classes without breaking system expectations.'
      }
    ]
  },

  // 5. C++
  {
    title: 'C++ Fundamentals',
    description: 'Test pointer arithmetic, memory management, references, stack vs heap, and operator precedence.',
    category: 'C++',
    difficulty: 'beginner',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 100,
    coinReward: 25,
    maxAttempts: 10,
    questions: [
      {
        text: 'What is the crucial difference between `delete` and `delete[]` in C++?',
        options: [
          '`delete` is for single dynamically allocated objects; `delete[]` invokes destructors for arrays allocated with `new[]`',
          '`delete[]` is deprecated in modern C++20',
          '`delete` zeroes memory, `delete[]` frees memory',
          'They can be used interchangeably without undefined behavior'
        ],
        correctIndex: 0,
        explanation: 'Using `delete` on memory allocated with `new[]` leads to undefined behavior because only the first element’s destructor would be invoked.'
      },
      {
        text: 'What does a C++ reference `int& ref = x;` represent under the hood?',
        options: [
          'A copy of x with independent memory address',
          'An immutable alias to x sharing its exact memory address',
          'A pointer that defaults to nullptr',
          'A thread-safe atomic lock'
        ],
        correctIndex: 1,
        explanation: 'A reference acts as an alias to an existing object and cannot be reseated to another variable once bound.'
      },
      {
        text: 'What header guard pattern prevents multiple definition compilation errors in C++?',
        options: [
          '#pragma once or #ifndef HEADER_H / #define HEADER_H / #endif',
          '#include_unique',
          '#static_assert',
          '#import <iostream>'
        ],
        correctIndex: 0,
        explanation: 'Include guards ensure the preprocessor includes the header file contents exactly once per translation unit.'
      },
      {
        text: 'What will `int a = 5; int* p = &a; *p = 10; std::cout << a;` print?',
        options: [
          '5',
          '10',
          'The memory address of a',
          'Compilation error'
        ],
        correctIndex: 1,
        explanation: 'Dereferencing the pointer `*p` directly modifies the value stored at variable `a`’s memory address.'
      }
    ]
  },
  {
    title: 'C++ STL Basics',
    description: 'Evaluate your knowledge of Standard Template Library containers, iterators, std::vector, and std::unordered_map.',
    category: 'C++',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'What is the amortized time complexity of `std::vector::push_back()`?',
        options: [
          'O(1)',
          'O(N)',
          'O(log N)',
          'O(N^2)'
        ],
        correctIndex: 0,
        explanation: '`push_back` is amortized O(1). When vector capacity doubles, reallocation is O(N), but spread over N insertions it amortizes to constant time.'
      },
      {
        text: 'What data structure powers `std::map` vs `std::unordered_map` in C++ STL?',
        options: [
          '`std::map` uses a Red-Black Tree (O(log N)); `std::unordered_map` uses a Hash Table (O(1) average)',
          '`std::map` uses a Hash Table; `std::unordered_map` uses a Linked List',
          'Both use contiguous array vectors',
          '`std::map` uses B+ Trees; `std::unordered_map` uses Heap'
        ],
        correctIndex: 0,
        explanation: '`std::map` maintains keys in sorted order using a self-balancing binary search tree (Red-Black), while `std::unordered_map` uses hashing.'
      },
      {
        text: 'What happens to iterators pointing to elements in a `std::vector` when a reallocation occurs?',
        options: [
          'They are automatically updated to the new memory buffer',
          'They are invalidated; dereferencing them causes undefined behavior',
          'They throw `std::out_of_range` exception',
          'They lock until read'
        ],
        correctIndex: 1,
        explanation: 'When vector growth exceeds capacity and reallocates a new buffer, all existing iterators, pointers, and references to its elements are invalidated.'
      },
      {
        text: 'What is the time complexity of `std::sort` on random-access iterators?',
        options: [
          'O(N log N) worst and average case',
          'O(N^2) worst case',
          'O(N)',
          'O(log N)'
        ],
        correctIndex: 0,
        explanation: 'std::sort uses Introsort (quicksort switching to heapsort and insertion sort) guaranteeing O(N log N) worst-case time complexity.'
      }
    ]
  },

  // 6. Data Structures & Algorithms
  {
    title: 'Arrays & Strings',
    description: 'Master sliding window, two-pointer techniques, prefix sums, and algorithmic string processing.',
    category: 'Data Structures & Algorithms',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 420,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'Which algorithmic pattern is most optimal for finding a contiguous subarray of size K with the maximum sum in an array of N integers?',
        options: [
          'Brute Force Nested Loops (O(N*K))',
          'Fixed-Size Sliding Window (O(N))',
          'Binary Search on Prefix Sums (O(N log N))',
          'Depth-First Search (O(2^N))'
        ],
        correctIndex: 1,
        explanation: 'A fixed sliding window of size K slides across the array in a single O(N) pass by adding the next element and subtracting the departing element.'
      },
      {
        text: 'What does the Two-Pointer technique require when searching for two elements in an array that sum to target T in O(N) time and O(1) space?',
        options: [
          'The array elements must be sorted',
          'The array elements must all be positive integers',
          'The array size must be a power of 2',
          'The array must be indexed in reverse'
        ],
        correctIndex: 0,
        explanation: 'The classic two-pointer convergence (left and right pointers) requires the array to be sorted so moving pointers monotonically increases or decreases sums.'
      },
      {
        text: 'What is the time complexity to answer Q range sum queries on an array after computing a Prefix Sum array in O(N)?',
        options: [
          'O(1) per query',
          'O(log N) per query',
          'O(N) per query',
          'O(Q * N)'
        ],
        correctIndex: 0,
        explanation: 'Once prefix sums are precalculated, any range sum [L, R] is computed in O(1) via `prefix[R] - prefix[L - 1]`.'
      },
      {
        text: 'What is the space complexity of reversing a string in-place?',
        options: [
          'O(1) auxiliary space',
          'O(N) auxiliary space',
          'O(log N) auxiliary space',
          'O(N^2) auxiliary space'
        ],
        correctIndex: 0,
        explanation: 'Swapping characters from both ends towards the center requires only two pointer indices, achieving O(1) auxiliary memory.'
      }
    ]
  },
  {
    title: 'Searching & Sorting',
    description: 'Understand Binary Search invariants, Quicksort partitioning, Merge Sort divide-and-conquer, and Big-O bounds.',
    category: 'Data Structures & Algorithms',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'What is the maximum number of comparisons Binary Search performs on a sorted array of 1,000,000 elements in the worst case?',
        options: [
          '~20 comparisons',
          '~1,000 comparisons',
          '~500,000 comparisons',
          '1,000,000 comparisons'
        ],
        correctIndex: 0,
        explanation: 'ceil(log2(1,000,000)) = 20 comparisons, since 2^20 = 1,048,576.'
      },
      {
        text: 'Why is standard Merge Sort preferred over standard Quick Sort for sorting Singly Linked Lists?',
        options: [
          'Merge sort does not require random access indexing and can merge linked list nodes in O(1) extra space',
          'Quick sort is unable to compare string data',
          'Merge sort has O(1) time complexity on linked lists',
          'Linked lists cannot be partitioned'
        ],
        correctIndex: 0,
        explanation: 'Merge sort does not need random access and seamlessly merges linked list pointers in O(1) auxiliary space.'
      },
      {
        text: 'What is the worst-case time complexity of Quick Sort when selecting the first element as pivot on an already sorted array?',
        options: [
          'O(N log N)',
          'O(N^2)',
          'O(N)',
          'O(log N)'
        ],
        correctIndex: 1,
        explanation: 'Unbalanced partitions on sorted input degrade quicksort recursion depth to N, resulting in O(N^2) quadratic comparisons.'
      },
      {
        text: 'Which of the following sorting algorithms is stable and has O(N log N) worst-case time complexity?',
        options: [
          'Heapsort',
          'Merge Sort',
          'Quick Sort',
          'Selection Sort'
        ],
        correctIndex: 1,
        explanation: 'Merge Sort guarantees O(N log N) in all cases and preserves the relative order of duplicate elements (stability).'
      }
    ]
  },
  {
    title: 'Linked Lists',
    description: 'Examine singly, doubly, and circular linked lists, Floyd’s cycle detection, and pointer reversal.',
    category: 'Data Structures & Algorithms',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'How does Floyd’s Cycle-Finding Algorithm ("Tortoise and Hare") detect a cycle in a linked list?',
        options: [
          'By storing visited node addresses in a hash set',
          'By advancing a slow pointer 1 step and a fast pointer 2 steps; if they meet, a cycle exists',
          'By counting total nodes until reaching integer overflow',
          'By reversing all links until pointing back to null'
        ],
        correctIndex: 1,
        explanation: 'The fast pointer closes the distance by 1 node per iteration relative to the slow pointer, guaranteeing they intersect in O(N) time and O(1) memory if a cycle exists.'
      },
      {
        text: 'What is the time complexity of deleting a node from a Doubly Linked List given a direct pointer to that node?',
        options: [
          'O(1)',
          'O(N)',
          'O(log N)',
          'O(N^2)'
        ],
        correctIndex: 0,
        explanation: 'Because both `node->prev` and `node->next` pointers are directly accessible, re-linking adjacent nodes is done in O(1) without traversal.'
      },
      {
        text: 'In reversing a singly linked list iteratively, how many pointers are typically maintained?',
        options: [
          '1 (current only)',
          '3 (prev, current, next)',
          '5',
          'None, recursion is mandatory'
        ],
        correctIndex: 1,
        explanation: 'Three pointers (prev, curr, next) are used to reverse the `curr.next` link without losing the reference to the rest of the list.'
      },
      {
        text: 'What is a key disadvantage of Linked Lists compared to Arrays?',
        options: [
          'Linked lists cannot store non-integer types',
          'Linked lists lack contiguous memory locality, causing higher CPU cache miss rates and O(N) element access',
          'Linked lists have fixed capacities set at creation',
          'Linked lists cannot be dynamically resized'
        ],
        correctIndex: 1,
        explanation: 'Scattered heap node allocations mean poor cache locality, and accessing the k-th node requires traversing from the head in O(k).'
      }
    ]
  },
  {
    title: 'Stacks & Queues',
    description: 'Explore LIFO and FIFO invariants, monotonic stacks, circular queues, and BFS/DFS traversal mechanics.',
    category: 'Data Structures & Algorithms',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'Which data structure is fundamentally utilized to implement Breadth-First Search (BFS) on graphs?',
        options: [
          'Stack (LIFO)',
          'Queue (FIFO)',
          'Priority Queue exclusively',
          'Binary Search Tree'
        ],
        correctIndex: 1,
        explanation: 'A FIFO queue ensures nodes are explored level-by-level in the exact order they were discovered.'
      },
      {
        text: 'What algorithmic problem is most efficiently solved using a Monotonic Decreasing Stack in O(N) time?',
        options: [
          'Next Greater Element for each item in an array',
          'Finding the median of a stream',
          'Dijkstra’s Shortest Path',
          'Matrix multiplication'
        ],
        correctIndex: 0,
        explanation: 'A monotonic stack maintains elements in order and finds the Next Greater Element for all items in a single O(N) pass.'
      },
      {
        text: 'How can a Queue be implemented using two Stacks (inStack and outStack)?',
        options: [
          'Push items to inStack; on dequeue, if outStack is empty, pop all inStack elements to outStack, then pop outStack',
          'Merge both stacks into an array before every pop operation',
          'Alternate pushing items between stack 1 and stack 2',
          'It is mathematically impossible to implement a queue with stacks'
        ],
        correctIndex: 0,
        explanation: 'Transferring elements from inStack to outStack reverses their order back to FIFO, achieving amortized O(1) per operation.'
      },
      {
        text: 'What condition indicates a Circular Queue of capacity C is full when using front and rear pointers?',
        options: [
          '`(rear + 1) % C == front`',
          '`rear == C`',
          '`front == rear`',
          '`front == 0`'
        ],
        correctIndex: 0,
        explanation: 'In a circular buffer array implementation, the next increment of rear wrapping around to front indicates buffer saturation.'
      }
    ]
  },
  {
    title: 'Trees & Graphs',
    description: 'Test binary search tree validation, DFS/BFS traversals, graph cycle detection, and shortest paths.',
    category: 'Data Structures & Algorithms',
    difficulty: 'advanced',
    passingScore: 70,
    timeLimit: 420,
    xpReward: 150,
    coinReward: 35,
    maxAttempts: 10,
    questions: [
      {
        text: 'In a valid Binary Search Tree (BST), what traversal order visits nodes in strictly ascending sorted order?',
        options: [
          'Pre-order (Root, Left, Right)',
          'In-order (Left, Root, Right)',
          'Post-order (Left, Right, Root)',
          'Level-order (BFS)'
        ],
        correctIndex: 1,
        explanation: 'In-order traversal recursively visits the smaller left subtree, the root, and then the larger right subtree, outputting sorted keys.'
      },
      {
        text: 'What algorithm finds the single-source shortest path in a graph with non-negative edge weights in O((V + E) log V)?',
        options: [
          'Dijkstra’s Algorithm with Min-Heap',
          'Bellman-Ford Algorithm',
          'Floyd-Warshall Algorithm',
          'Kruskal’s Minimum Spanning Tree'
        ],
        correctIndex: 0,
        explanation: 'Dijkstra with a priority queue/min-heap efficiently extracts the closest unvisited vertex in O(log V) time per step.'
      },
      {
        text: 'What algorithm is used to produce a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v?',
        options: [
          'Topological Sort (Kahn’s Algorithm or DFS post-order reversal)',
          'Prim’s Algorithm',
          'Tarjan’s Bridge-Finding Algorithm',
          'Binary Search'
        ],
        correctIndex: 0,
        explanation: 'Topological sorting determines valid dependency execution sequences for Directed Acyclic Graphs.'
      },
      {
        text: 'What is the height of a balanced binary tree containing N nodes?',
        options: [
          'O(N)',
          'O(log N)',
          'O(N log N)',
          'O(1)'
        ],
        correctIndex: 1,
        explanation: 'A balanced binary tree (such as AVL or Red-Black) maintains height proportional to log2(N).'
      }
    ]
  },

  // 7. Databases
  {
    title: 'SQL Fundamentals',
    description: 'Verify relational query construction: JOIN types, aggregations with GROUP BY / HAVING, and subqueries.',
    category: 'Databases',
    difficulty: 'beginner',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 100,
    coinReward: 25,
    maxAttempts: 10,
    questions: [
      {
        text: 'What is the difference between the `WHERE` clause and the `HAVING` clause in SQL?',
        options: [
          '`WHERE` filters rows before grouping/aggregation; `HAVING` filters aggregated group results after `GROUP BY`',
          '`HAVING` only works with strings; `WHERE` works with numbers',
          '`WHERE` is used exclusively in subqueries',
          'They are completely interchangeable syntaxes'
        ],
        correctIndex: 0,
        explanation: '`WHERE` filters individual table rows prior to aggregation, while `HAVING` evaluates aggregate expressions (like COUNT, SUM) on grouped results.'
      },
      {
        text: 'Which SQL JOIN returns all records from the left table, and matching records from the right table (with NULLs for non-matches)?',
        options: [
          'INNER JOIN',
          'LEFT JOIN (or LEFT OUTER JOIN)',
          'CROSS JOIN',
          'FULL OUTER JOIN'
        ],
        correctIndex: 1,
        explanation: 'LEFT JOIN preserves all rows from the primary left table regardless of whether matching rows exist in the right table.'
      },
      {
        text: 'What is the effect of the SQL `UNION` operator compared to `UNION ALL`?',
        options: [
          '`UNION` automatically removes duplicate rows from the combined result set; `UNION ALL` retains duplicates',
          '`UNION ALL` is slower because it sorts rows',
          '`UNION` only merges numeric columns',
          '`UNION ALL` only works across tables with identical schemas'
        ],
        correctIndex: 0,
        explanation: '`UNION` performs a distinct de-duplication step, whereas `UNION ALL` simply concatenates result sets without extra sorting overhead.'
      },
      {
        text: 'What constraint guarantees uniqueness across a column and forbids NULL values in a relational table?',
        options: [
          'FOREIGN KEY',
          'PRIMARY KEY',
          'CHECK',
          'DEFAULT'
        ],
        correctIndex: 1,
        explanation: 'A PRIMARY KEY uniquely identifies each record in a table and implicitly enforces UNIQUE and NOT NULL constraints.'
      }
    ]
  },
  {
    title: 'Database Concepts',
    description: 'Deepen understanding of ACID transaction semantics, indexing strategies (B-Tree), and database normalization.',
    category: 'Databases',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 120,
    coinReward: 30,
    maxAttempts: 10,
    questions: [
      {
        text: 'In the ACID transaction model, what does the "I" (Isolation) guarantee?',
        options: [
          'Transactions execute in complete hardware isolation on separate server racks',
          'Concurrent execution of transactions results in a system state as if they were executed serially',
          'Data changes are instantly written to non-volatile SSD disks',
          'All database indexes are immutable'
        ],
        correctIndex: 1,
        explanation: 'Isolation ensures that concurrently executing transactions cannot view uncommitted or intermediate states of other transactions.'
      },
      {
        text: 'Why do relational databases commonly use B-Trees (or B+ Trees) for indexing rather than Binary Search Trees?',
        options: [
          'B-Trees have high fan-out, minimizing the number of disk/block I/O operations required during searches',
          'B-Trees require zero memory allocation',
          'Binary Search Trees cannot store string data types',
          'B-Trees do not require sorting'
        ],
        correctIndex: 0,
        explanation: 'B-Trees store many keys per node, keeping the tree broad and shallow, which minimizes disk block seeks.'
      },
      {
        text: 'What is the core objective of Database Normalization (up to 3NF)?',
        options: [
          'To increase database file size for backup redundancy',
          'To eliminate data redundancy and prevent insertion, update, and deletion anomalies',
          'To combine all tables into a single wide denormalized sheet',
          'To encrypt user credentials at the filesystem level'
        ],
        correctIndex: 1,
        explanation: 'Normalization organizes columns and tables to ensure dependencies make structural sense, eliminating redundant data and update anomalies.'
      },
      {
        text: 'What is a "Deadlock" in database transaction processing?',
        options: [
          'When two or more transactions are permanently blocked because each holds a lock the other requires',
          'When a database runs out of available storage disk space',
          'When an SSL certificate expires during an API request',
          'When a table contains more than 1 billion rows'
        ],
        correctIndex: 0,
        explanation: 'A deadlock occurs when concurrent transactions hold circular wait locks on resources, requiring the database engine to abort and rollback one transaction.'
      }
    ]
  },

  // 8. AI & Machine Learning
  {
    title: 'Machine Learning Fundamentals',
    description: 'Test core supervised vs unsupervised learning, overfitting/underfitting, cross-validation, and loss metrics.',
    category: 'AI & Machine Learning',
    difficulty: 'beginner',
    passingScore: 70,
    timeLimit: 360,
    xpReward: 100,
    coinReward: 25,
    maxAttempts: 10,
    questions: [
      {
        text: 'What distinguishes Supervised Learning from Unsupervised Learning?',
        options: [
          'Supervised learning trains on labeled input-output pairs; Unsupervised learning discovers hidden patterns in unlabeled data',
          'Supervised learning does not use loss functions',
          'Unsupervised learning only works with tabular spreadsheets',
          'Supervised learning requires quantum compute clusters'
        ],
        correctIndex: 0,
        explanation: 'Supervised models learn a mapping function from input features to known ground-truth targets. Unsupervised algorithms cluster or project unlabeled data.'
      },
      {
        text: 'What is "Overfitting" in machine learning models?',
        options: [
          'When a model learns the training noise and fails to generalize to unseen test data',
          'When a model is too simple to capture the underlying pattern in the data',
          'When the dataset contains missing values',
          'When model training completes in under one second'
        ],
        correctIndex: 0,
        explanation: 'Overfitting occurs when high-capacity models memorize training noise, leading to very low training loss but poor real-world test generalization.'
      },
      {
        text: 'Which metric is most appropriate for evaluating a classification model on an imbalanced dataset (e.g., 99% negative, 1% positive)?',
        options: [
          'Raw Accuracy',
          'Precision, Recall, and F1-Score (or PR-AUC)',
          'Mean Squared Error (MSE)',
          'R-Squared'
        ],
        correctIndex: 1,
        explanation: 'In heavily skewed datasets, a trivial model predicting negative 100% of the time yields 99% accuracy; F1-score balances precision and recall on the minority class.'
      },
      {
        text: 'What is the purpose of K-Fold Cross-Validation?',
        options: [
          'To generate artificial synthetic image samples',
          'To evaluate model generalization performance reliably across multiple train/test data splits',
          'To encrypt the model parameters before deployment',
          'To convert neural networks to decision trees'
        ],
        correctIndex: 1,
        explanation: 'K-Fold partitions the dataset into K subsets, iteratively validating on each fold to produce an unbiased performance estimate.'
      }
    ]
  },
  {
    title: 'AI & ML Concepts',
    description: 'Explore neural network architectures, gradient descent, backpropagation, attention mechanisms, and transformers.',
    category: 'AI & Machine Learning',
    difficulty: 'intermediate',
    passingScore: 70,
    timeLimit: 420,
    xpReward: 130,
    coinReward: 35,
    maxAttempts: 10,
    questions: [
      {
        text: 'What is the core role of Backpropagation in training deep neural networks?',
        options: [
          'Computing gradients of the loss function with respect to model weights using the chain rule of calculus',
          'Initializing random weights uniformly across all layers',
          'Compressing neural networks into mobile formats',
          'Translating Python code to CUDA C++ binaries'
        ],
        correctIndex: 0,
        explanation: 'Backpropagation applies the chain rule backward from the output layer to compute gradients of the loss for gradient descent weight updates.'
      },
      {
        text: 'Why are non-linear activation functions (e.g. ReLU, GELU, Sigmoid) necessary in multilayer neural networks?',
        options: [
          'Without non-linear activations, stacking multiple linear layers collapses into a single linear transformation incapable of learning complex functions',
          'They prevent the GPU from consuming too much wattage',
          'They convert float32 numbers into 8-bit integers',
          'They are only used to output probabilities between 0 and 1'
        ],
        correctIndex: 0,
        explanation: 'Linear combinations of linear layers remain strictly linear. Non-linear activation functions enable neural networks to act as universal function approximators.'
      },
      {
        text: 'What mathematical mechanism allows Transformer models to dynamically weight the importance of different tokens in a sequence?',
        options: [
          'Scaled Dot-Product Self-Attention (Query, Key, Value vectors)',
          'Convolutional Max-Pooling',
          'Recurrent LSTM Hidden State Gates',
          'Principal Component Analysis'
        ],
        correctIndex: 0,
        explanation: 'Self-attention calculates attention weights using `softmax(Q * K^T / sqrt(d_k)) * V`, allowing arbitrary token context interaction across the full sequence.'
      },
      {
        text: 'What is a Vector Embedding in modern AI systems (e.g. text/image embeddings)?',
        options: [
          'A high-dimensional numerical vector representation where geometric distance captures semantic similarity',
          'An SVG graphic rendering of a word',
          'A compressed zip archive of training logs',
          'A database password hash'
        ],
        correctIndex: 0,
        explanation: 'Embeddings map words, concepts, or images to dense continuous vectors in an embedding space where semantically similar items have high cosine similarity.'
      }
    ]
  }
];

export async function seedQuizzes(adminUserId) {
  try {
    console.log(`[Seed Quizzes] Seeding ${quizCatalog.length} curated Knowledge Trials...`);

    // Fetch existing skills to optionally associate matching categories
    const skills = await Skill.find();
    const skillMap = {};
    skills.forEach((s) => {
      skillMap[s.name.toLowerCase()] = s._id;
    });

    for (const quizData of quizCatalog) {
      let skillId = null;
      if (quizData.category.includes('Web') || quizData.category.includes('JavaScript')) {
        skillId = skillMap['web fundamentals'] || skillMap['react ecosystem'];
      } else if (quizData.category.includes('Data Structures') || quizData.category.includes('Algorithms')) {
        skillId = skillMap['data structures & algorithms'];
      } else if (quizData.category.includes('Python') || quizData.category.includes('Java') || quizData.category.includes('C++')) {
        skillId = skillMap['data structures & algorithms'] || skillMap['node.js & backend'];
      }

      await Quiz.findOneAndUpdate(
        { title: quizData.title },
        {
          $set: {
            ...quizData,
            skillId: skillId || undefined,
            createdBy: adminUserId,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    const totalQuizzes = await Quiz.countDocuments();
    console.log(`[Seed Quizzes] Successfully seeded ${totalQuizzes} Knowledge Trials.`);
    return totalQuizzes;
  } catch (error) {
    console.error('[Seed Quizzes Error]:', error.message);
    throw error;
  }
}
