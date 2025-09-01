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
        }
    ];

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

    function loadProblem(index) {
        const problem = problems[index];
        problemTitleEl.textContent = problem.title;
        problemDescriptionEl.textContent = problem.description;
        problemExamplesEl.textContent = problem.examples;

        userEditor.setValue(''); // Clear user editor
        solutionPanel.style.display = 'none'; // Hide solution panel

        // We need to refresh the editor in case it was created while its container was hidden
        setTimeout(() => userEditor.refresh(), 1);
    }

    compareBtn.addEventListener('click', () => {
        const problem = problems[currentProblemIndex];
        solutionEditor.setValue(problem.solution);
        solutionPanel.style.display = 'block';
        setTimeout(() => solutionEditor.refresh(), 1);
    });

    // Load the first problem by default
    loadProblem(currentProblemIndex);
});
