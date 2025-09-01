document.addEventListener('DOMContentLoaded', () => {
    const quizData = [
        {
            question: "What is the correct way to declare an integer variable in C#?",
            type: "multiple-choice",
            options: [
                "int myNumber = 10;",
                "integer myNumber = 10;",
                "num myNumber = 10;",
                "myNumber = 10;"
            ],
            answer: "int myNumber = 10;",
            explanation: "In C#, integer variables are declared using the 'int' keyword."
        },
        {
            question: "What is the output of this code?",
            type: "multiple-choice",
            codeSnippet: `for (int i = 0; i < 3; i++)\n{\n    Console.Write(i + " ");\n}`,
            options: [
                "0 1 2 ",
                "1 2 3 ",
                "0 1 2 3 ",
                "1 2 "
            ],
            answer: "0 1 2 ",
            explanation: "The loop runs for i = 0, 1, and 2. The loop terminates when i becomes 3. Note the trailing space in the output."
        },
        {
            question: "Complete the while loop to print numbers from 1 to 5.",
            type: "code-completion",
            codeSnippet: `int i = 1;\nwhile (i <= 5)\n{\n    Console.WriteLine(i);\n    // Your code here\n}`,
            answer: "i++;",
            explanation: "You need to increment 'i' in each iteration to avoid an infinite loop."
        },
        {
            question: "Complete the body of this method to return the sum of the two parameters.",
            type: "code-completion",
            codeSnippet: `public int Add(int a, int b)\n{\n    // Your code here\n}`,
            answer: `return a + b;`,
            explanation: "The 'return' keyword is used to return a value from a method. In this case, it returns the sum of 'a' and 'b'."
        },
        {
            question: "Which LINQ method is used to filter a collection based on a predicate?",
            type: "multiple-choice",
            options: [
                "Select()",
                "Where()",
                "First()",
                "OrderBy()"
            ],
            answer: "Where()",
            explanation: "The Where() extension method in LINQ is used to filter a sequence of values based on a predicate (a function that returns a boolean)."
        },
        {
            question: "Fill in the blank to correctly handle the exception.",
            type: "code-completion",
            codeSnippet: `try\n{\n    int result = 10 / int.Parse("0");\n}\ncatch (DivideByZeroException ex)\n{\n    // Your code here\n}`,
            answer: `Console.WriteLine("Cannot divide by zero.");`,
            explanation: "A try-catch block is used for exception handling. The 'catch' block is executed when an exception of the specified type occurs in the 'try' block."
        },
        {
            question: "In C# inheritance, which keyword is used in a derived class to call the constructor of its base class?",
            type: "multiple-choice",
            options: [
                "super",
                "this",
                "base",
                "parent"
            ],
            answer: "base",
            explanation: "The 'base' keyword is used to access members of the base class from within a derived class. It is used to call a method on the base class or to specify which base-class constructor should be called."
        },
        {
            question: "Fix the error in the following code to correctly instantiate the 'Person' object.",
            type: "error-finding",
            codeSnippet: `public class Person\n{\n    public string Name { get; set; }\n    public int Age { get; set; }\n\n    public Person(string name, int age)\n    {\n        Name = name;\n        Age = age;\n    }\n}\n\n// Fix the line below\nPerson p = new Person("John");`,
            answer: `Person p = new Person("John", 30);`,
            explanation: "The Person constructor requires two arguments (a string and an int), but only one was provided. You must provide values for both parameters."
        },
        {
            question: "Fill in the blank to check if the string is null or empty.",
            type: "code-completion",
            codeSnippet: `string myString = GetStringFromSomewhere();\nif (// Your code here)\n{\n    Console.WriteLine("The string is empty.");\n}`,
            answer: `string.IsNullOrEmpty(myString)`,
            explanation: "The `string.IsNullOrEmpty()` method is a convenient way to check if a string is either null or an empty string."
        },
        {
            question: "Arrange the following lines to create a simple C# program that prints a message.",
            type: "rearrange",
            options: [
                "class Program",
                "{",
                "    static void Main()",
                "    {",
                "        Console.WriteLine(\"It works!\");",
                "    }",
                "}",
                "using System;"
            ],
            answer: [
                "using System;",
                "class Program",
                "{",
                "    static void Main()",
                "    {",
                "        Console.WriteLine(\"It works!\");",
                "    }",
                "}"
            ],
            explanation: "A C# program starts with 'using' directives, followed by a class definition containing a 'Main' method."
        }
    ];

    const questionEl = document.getElementById('question');
    const codeSnippetEl = document.getElementById('code-snippet');
    const optionsContainer = document.getElementById('options-container');
    const rearrangeContainer = document.getElementById('rearrange-container');
    const codeEditorEl = document.getElementById('code-editor');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const feedbackContainer = document.getElementById('feedback-container');
    const feedbackEl = document.getElementById('feedback');
    const explanationEl = document.getElementById('explanation');
    const scoreEl = document.getElementById('score');
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar-fill';
    document.getElementById('progress-bar').appendChild(progressBar);

    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;
    let codeMirrorEditor = null;
    let incorrectAttempts = 0;
    const SHOW_ANSWER_THRESHOLD = 3;

    function loadQuestion() {
        const currentQuestion = quizData[currentQuestionIndex];
        questionEl.textContent = currentQuestion.question;
        codeSnippetEl.textContent = '';
        optionsContainer.innerHTML = '';
        rearrangeContainer.innerHTML = '';
        rearrangeContainer.style.display = 'none';

        if (codeMirrorEditor) {
            codeMirrorEditor.getWrapperElement().style.display = 'none';
        }
        // The original textarea is now hidden by CSS, so no need to manage its display here.

        submitBtn.style.display = 'block';
        submitBtn.disabled = true;
        nextBtn.style.display = 'none';
        showAnswerBtn.style.display = 'none';
        feedbackContainer.style.display = 'none';
        selectedOption = null;
        incorrectAttempts = 0;

        if (currentQuestion.codeSnippet) {
            codeSnippetEl.parentElement.style.display = 'block';
            codeSnippetEl.textContent = currentQuestion.codeSnippet;
        } else {
            codeSnippetEl.parentElement.style.display = 'none';
        }

        if (currentQuestion.type === 'multiple-choice') {
            optionsContainer.style.display = 'block';
            currentQuestion.options.forEach(option => {
                const optionEl = document.createElement('div');
                optionEl.classList.add('option');
                optionEl.textContent = option;
                optionEl.addEventListener('click', () => {
                    if (selectedOption) {
                        selectedOption.classList.remove('selected');
                    }
                    selectedOption = optionEl;
                    selectedOption.classList.add('selected');
                    submitBtn.disabled = false;
                });
                optionsContainer.appendChild(optionEl);
            });
        } else if (currentQuestion.type === 'code-completion' || currentQuestion.type === 'error-finding') {
            optionsContainer.style.display = 'none';

            if (!codeMirrorEditor) {
                codeMirrorEditor = CodeMirror.fromTextArea(codeEditorEl, {
                    lineNumbers: true,
                    mode: 'text/x-csharp',
                    theme: 'material-darker',
                    indentUnit: 4
                });
                codeMirrorEditor.on('change', () => {
                    submitBtn.disabled = codeMirrorEditor.getValue().trim() === '';
                });
            }
            codeMirrorEditor.setValue('');
            codeMirrorEditor.setOption("readOnly", false);
            codeMirrorEditor.getWrapperElement().style.display = 'block';
            setTimeout(() => codeMirrorEditor.refresh(), 1);

        } else if (currentQuestion.type === 'rearrange') {
            optionsContainer.style.display = 'none';
            rearrangeContainer.style.display = 'block';
            const shuffledOptions = [...currentQuestion.options].sort(() => Math.random() - 0.5);
            shuffledOptions.forEach(optionText => {
                const line = document.createElement('div');
                line.textContent = optionText;
                line.classList.add('rearrange-line');
                line.draggable = true;
                rearrangeContainer.appendChild(line);
            });
            submitBtn.disabled = false;
        }
        updateProgress();
    }

    let draggedItem = null;

    rearrangeContainer.addEventListener('dragstart', e => {
        if (e.target.classList.contains('rearrange-line')) {
            draggedItem = e.target;
            setTimeout(() => {
                e.target.classList.add('dragging');
            }, 0);
        }
    });

    rearrangeContainer.addEventListener('dragend', e => {
        if (draggedItem) {
            setTimeout(() => {
                draggedItem.classList.remove('dragging');
                draggedItem = null;
            }, 0);
        }
    });

    rearrangeContainer.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(rearrangeContainer, e.clientY);
        if (draggedItem) {
            if (afterElement == null) {
                rearrangeContainer.appendChild(draggedItem);
            } else {
                rearrangeContainer.insertBefore(draggedItem, afterElement);
            }
        }
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.rearrange-line:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateProgress() {
        const progressPercentage = (currentQuestionIndex / quizData.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        scoreEl.textContent = score;
    }

    submitBtn.addEventListener('click', () => {
        const currentQuestion = quizData[currentQuestionIndex];
        let isCorrect = false;

        if (currentQuestion.type === 'multiple-choice') {
            isCorrect = selectedOption.textContent === currentQuestion.answer;
        } else if (currentQuestion.type === 'code-completion' || currentQuestion.type === 'error-finding') {
            const normalize = (str) => str.replace(/\s+/g, '').toLowerCase();
            const userAnswer = normalize(codeMirrorEditor.getValue());
            const correctAnswer = normalize(currentQuestion.answer);
            isCorrect = userAnswer === correctAnswer;
        } else if (currentQuestion.type === 'rearrange') {
            const rearrangedLines = [...document.querySelectorAll('#rearrange-container .rearrange-line')].map(line => line.textContent);
            isCorrect = JSON.stringify(rearrangedLines) === JSON.stringify(currentQuestion.answer);
        }

        if (isCorrect) {
            score++;
            feedbackEl.textContent = "Correct!";
            feedbackContainer.className = 'feedback-container correct';
            submitBtn.style.display = 'none';
            nextBtn.style.display = 'block';
            showAnswerBtn.style.display = 'none';
            // Disable inputs
            if (currentQuestion.type === 'rearrange') {
                [...rearrangeContainer.children].forEach(child => child.draggable = false);
            } else if (codeMirrorEditor) {
                codeMirrorEditor.setOption("readOnly", true);
            }
             if (currentQuestion.type === 'multiple-choice') {
                [...optionsContainer.children].forEach(child => child.style.pointerEvents = 'none');
            }
        } else {
            incorrectAttempts++;
            feedbackEl.textContent = "Incorrect. Please try again.";
            feedbackContainer.className = 'feedback-container incorrect';
            if (incorrectAttempts >= SHOW_ANSWER_THRESHOLD) {
                showAnswerBtn.style.display = 'block';
            }
        }

        explanationEl.textContent = currentQuestion.explanation;
        feedbackContainer.style.display = 'block';
        updateProgress();
    });

    showAnswerBtn.addEventListener('click', () => {
        const currentQuestion = quizData[currentQuestionIndex];
        let answerText = '';
        if (Array.isArray(currentQuestion.answer)) {
            answerText = currentQuestion.answer.join('\n');
        } else {
            answerText = currentQuestion.answer;
        }

        explanationEl.innerHTML = `<b>The correct answer is:</b><br><pre>${answerText}</pre><br>${currentQuestion.explanation}`;

        if (currentQuestion.type === 'code-completion' || currentQuestion.type === 'error-finding') {
            codeMirrorEditor.setValue(currentQuestion.answer);
        }

        showAnswerBtn.style.display = 'none';
    });

    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            showFinalScore();
        }
    });

    function showFinalScore() {
        questionEl.textContent = `Quiz Complete! You scored ${score} out of ${quizData.length}.`;
        codeSnippetEl.parentElement.style.display = 'none';
        optionsContainer.style.display = 'none';
        rearrangeContainer.style.display = 'none';
        if (codeMirrorEditor) {
            codeMirrorEditor.getWrapperElement().style.display = 'none';
        }
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        showAnswerBtn.style.display = 'none';
        feedbackContainer.style.display = 'none';
        progressBar.style.width = '100%';
    }

    loadQuestion();
});
