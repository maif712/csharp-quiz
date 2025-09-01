document.addEventListener('DOMContentLoaded', () => {
    const problems = [
        {
            title: "Reverse a String",
            description: "Write a C# method `ReverseString` that takes a string as input and returns the string reversed.",
            examples: `ReverseString("hello") == "olleh"\nReverseString("world") == "dlrow"`,
            solution: `public string ReverseString(string s)
{
    char[] charArray = s.ToCharArray();
    Array.Reverse(charArray);
    return new string(charArray);
}

// Explanation:
// 1. Convert the string to a character array.
// 2. Use the built-in Array.Reverse() method for an efficient in-place reversal.
// 3. Create a new string from the reversed character array.`
        },
        {
            title: "Check for Palindrome",
            description: "Write a C# method `IsPalindrome` that checks if a given string is a palindrome. A palindrome is a word, phrase, number, or other sequence of characters that reads the same forward and backward (ignoring case and non-alphanumeric characters).",
            examples: `IsPalindrome("A man, a plan, a canal: Panama") == true\nIsPalindrome("race a car") == false`,
            solution: `public bool IsPalindrome(string s)
{
    var left = 0;
    var right = s.Length - 1;

    while (left < right)
    {
        while (left < right && !char.IsLetterOrDigit(s[left]))
        {
            left++;
        }
        while (left < right && !char.IsLetterOrDigit(s[right]))
        {
            right--;
        }

        if (char.ToLower(s[left]) != char.ToLower(s[right]))
        {
            return false;
        }

        left++;
        right--;
    }
    return true;
}

// Explanation:
// This solution uses a two-pointer approach for efficiency.
// 1. Pointers start at the beginning and end of the string.
// 2. They move inwards, skipping any non-alphanumeric characters.
// 3. At each step, they compare the lowercase versions of the characters.
// 4. If a mismatch is found, it's not a palindrome.`
        },
        {
            title: "FizzBuzz",
            description: "Write a C# method that prints numbers from 1 to 100. For multiples of three, print 'Fizz' instead of the number. For multiples of five, print 'Buzz'. For numbers which are multiples of both three and five, print 'FizzBuzz'.",
            examples: `1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz`,
            solution: `public void FizzBuzz()
{
    for (int i = 1; i <= 100; i++)
    {
        if (i % 3 == 0 && i % 5 == 0)
        {
            Console.WriteLine("FizzBuzz");
        }
        else if (i % 3 == 0)
        {
            Console.WriteLine("Fizz");
        }
        else if (i % 5 == 0)
        {
            Console.WriteLine("Buzz");
        }
        else
        {
            Console.WriteLine(i);
        }
    }
}

// Explanation:
// This is a classic programming problem. The key is to check for the 'FizzBuzz'
// condition (divisible by both 3 and 5) first, because the other two
// conditions (divisible by 3 or 5) would also be true.`
        },
        {
            title: "Find Maximum Value",
            description: "Write a C# method `FindMax` that takes an array of integers and returns the largest integer in the array.",
            examples: `FindMax(new int[] { 1, 3, 2 }) == 3\nFindMax(new int[] { -1, -5, -2 }) == -1`,
            solution: `public int FindMax(int[] nums)
{
    if (nums == null || nums.Length == 0)
    {
        throw new ArgumentException("Input array cannot be null or empty.");
    }

    int max = nums[0];
    for (int i = 1; i < nums.Length; i++)
    {
        if (nums[i] > max)
        {
            max = nums[i];
        }
    }
    return max;
}

// Explanation:
// 1. Handle the edge case of a null or empty array.
// 2. Initialize a 'max' variable with the first element of the array.
// 3. Loop through the rest of the array, updating 'max' whenever a larger element is found.`
        }
    ];

    const problemListEl = document.getElementById('problem-list');
    const problemTitleEl = document.getElementById('problem-title');
    const problemDescriptionEl = document.getElementById('problem-description');
    const problemExamplesEl = document.getElementById('problem-examples');
    const compareBtn = document.getElementById('compare-btn');
    const solutionPanel = document.getElementById('solution-panel');

    const userEditor = CodeMirror.fromTextArea(document.getElementById('code-editor-practice'), {
        lineNumbers: true,
        mode: 'text/x-csharp',
        theme: 'material-darker',
        indentUnit: 4
    });

    const solutionEditor = CodeMirror.fromTextArea(document.getElementById('solution-editor'), {
        lineNumbers: true,
        mode: 'text/x-csharp',
        theme: 'material-darker',
        readOnly: true
    });

    let currentProblemIndex = 0;

    function populateProblemList() {
        problemListEl.innerHTML = '';
        problems.forEach((problem, index) => {
            const li = document.createElement('li');
            li.textContent = problem.title;
            li.dataset.index = index;
            if (index === currentProblemIndex) {
                li.classList.add('active');
            }
            li.addEventListener('click', () => {
                currentProblemIndex = index;
                loadProblem(index);
                // Update active class
                document.querySelector('#problem-list li.active').classList.remove('active');
                li.classList.add('active');
            });
            problemListEl.appendChild(li);
        });
    }

    function loadProblem(index) {
        const problem = problems[index];
        problemTitleEl.textContent = problem.title;
        problemDescriptionEl.textContent = problem.description;
        problemExamplesEl.textContent = problem.examples;

        userEditor.setValue(''); // Clear user editor
        solutionPanel.style.display = 'none'; // Hide solution panel

        setTimeout(() => userEditor.refresh(), 1);
    }

    compareBtn.addEventListener('click', () => {
        const problem = problems[currentProblemIndex];
        solutionEditor.setValue(problem.solution);
        solutionPanel.style.display = 'block';
        setTimeout(() => solutionEditor.refresh(), 1);
    });

    // Initial load
    populateProblemList();
    loadProblem(currentProblemIndex);
});
