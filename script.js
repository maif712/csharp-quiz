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
            question: "Write a method named 'Add' that takes two integers and returns their sum.",
            type: "code-completion",
            codeSnippet: `public class Calculator\n{\n    // Your method here\n}`,
            answer: `public int Add(int a, int b)\n{\n    return a + b;\n}`,
            explanation: "A method has a return type, a name, and parameters. The 'return' keyword is used to return a value."
        },
        {
            question: "What is the purpose of a constructor in C#?",
            type: "multiple-choice",
            options: [
                "To destroy an object",
                "To initialize an object's properties",
                "To run the main application logic",
                "To define an object's methods"
            ],
            answer: "To initialize an object's properties",
            explanation: "A constructor is a special method that is called when an object of a class is created. Its primary purpose is to initialize the object's fields."
        },
        {
            question: "Find the error in this class definition.",
            type: "error-finding",
            codeSnippet: `public class Person\n{\n    public string name;\n    public int age;\n\n    public Person(string n, int a)\n    {\n        name = n;\n        age = a;\n    }\n}\n\n// How to create an instance?\nPerson p = new Person("John");`,
            answer: 'new Person("John", 30)',
            explanation: "The Person constructor is defined to take two arguments (a string and an int). You must provide values for both parameters, for example: new Person(\"John\", 30)."
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
        codeEditorEl.style.display = 'none';

        submitBtn.disabled = true;
        nextBtn.style.display = 'none';
        feedbackContainer.style.display = 'none';
        selectedOption = null;

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
            codeEditorEl.style.display = 'block';

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
        } else {
            feedbackEl.textContent = "Incorrect!";
            feedbackContainer.className = 'feedback-container incorrect';
        }

        explanationEl.textContent = currentQuestion.explanation;
        feedbackContainer.style.display = 'block';
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        // Disable further interaction
        if (currentQuestion.type === 'rearrange') {
            [...rearrangeContainer.children].forEach(child => child.draggable = false);
        } else if (codeMirrorEditor) {
            codeMirrorEditor.setOption("readOnly", true);
        }
        updateProgress();
    });

    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (codeMirrorEditor) {
            codeMirrorEditor.setOption("readOnly", false);
        }
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
            submitBtn.style.display = 'block';
            nextBtn.style.display = 'none';
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
        feedbackContainer.style.display = 'none';
        progressBar.style.width = '100%';
    }

    loadQuestion();
});
