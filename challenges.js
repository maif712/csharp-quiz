document.addEventListener('DOMContentLoaded', () => {
    const challenges = [
        {
            title: "Simple Calculator",
            description: "Complete the `Calculate` method. It should take two doubles and a character representing an operator (+, -, *, /) and return the result. Handle the case where a division by zero might occur.",
            examples: `Calculate(10, 5, '+') == 15\nCalculate(10, 5, '/') == 2\nCalculate(10, 0, '/') should handle the error gracefully.`,
            solution: `public double Calculate(double num1, double num2, char op)
{
    switch (op)
    {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            if (num2 == 0)
            {
                Console.WriteLine("Error: Cannot divide by zero.");
                return 0; // Or throw an exception
            }
            return num1 / num2;
        default:
            Console.WriteLine("Error: Invalid operator.");
            return 0; // Or throw an exception
    }
}

// Explanation:
// A 'switch' statement is a clean way to handle different operations based on the 'op' character.
// It's crucial to include a check for division by zero to prevent runtime errors.`
        },
        {
            title: "Filter a List of Numbers",
            description: "Complete the `GetEvenNumbers` method. It should take a `List<int>` and return a new `List<int>` containing only the even numbers from the original list.",
            examples: `GetEvenNumbers(new List<int> {1, 2, 3, 4, 5}) == new List<int> {2, 4}`,
            solution: `public List<int> GetEvenNumbers(List<int> numbers)
{
    List<int> evenNumbers = new List<int>();
    foreach (int num in numbers)
    {
        if (num % 2 == 0)
        {
            evenNumbers.Add(num);
        }
    }
    return evenNumbers;
}

// Explanation:
// 1. Initialize a new empty list to store the results.
// 2. Loop through each number in the input list using a 'foreach' loop.
// 3. Use the modulo operator (%) to check if a number is even.
// 4. If it is, add it to the new list.`
        },
        {
            title: "Create a Student Class",
            description: "Define a simple `Student` class. The class should have a `Name` (string) property and a `Grade` (int) property. It should also have a constructor to initialize these properties and a method `GetStudentInfo` that returns a string like 'Name: [Name], Grade: [Grade]'.",
            examples: `var student = new Student("Alice", 85);\nstudent.GetStudentInfo() == "Name: Alice, Grade: 85"`,
            solution: `public class Student
{
    public string Name { get; set; }
    public int Grade { get; set; }

    public Student(string name, int grade)
    {
        Name = name;
        Grade = grade;
    }

    public string GetStudentInfo()
    {
        return $"Name: {Name}, Grade: {Grade}";
    }
}

// Explanation:
// This demonstrates basic class structure in C#.
// - 'Name' and 'Grade' are auto-implemented properties.
// - The constructor is a special method for creating and initializing an object.
// - The method uses string interpolation ($"...") for easy formatting.`
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
        challenges.forEach((problem, index) => {
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
        const problem = challenges[index];
        problemTitleEl.textContent = problem.title;
        problemDescriptionEl.textContent = problem.description;
        problemExamplesEl.textContent = problem.examples;

        userEditor.setValue(''); // Clear user editor
        solutionPanel.style.display = 'none'; // Hide solution panel

        setTimeout(() => userEditor.refresh(), 1);
    }

    compareBtn.addEventListener('click', () => {
        const problem = challenges[currentProblemIndex];
        solutionEditor.setValue(problem.solution);
        solutionPanel.style.display = 'block';
        setTimeout(() => solutionEditor.refresh(), 1);
    });

    // Initial load
    populateProblemList();
    loadProblem(currentProblemIndex);
});
