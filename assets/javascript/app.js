window.onload = function () {

    // Hide the appropriate divs from the user until ready to show
    document.getElementById("questionContainer").style.display = "none";
    document.getElementById("resultsContainer").style.display = "none";
    document.getElementById("questionResults").style.display = "none";

    // Start the game when the user clicks start or restart
    $("#startGame").on("click", startTriviaGame);
    $("#restartGame").on("click", startTriviaGame);

    // Track which question the user is on
    // Needs to be initialized to zero
    var currentQuestion;

    // Did the user correctly guess the answer?
    // Did the user click on an answer?
    var answerIsCorrect;
    var didUserClickAnswer;

    // Variables to hold our timers
    var questionTimer;
    var resultsTimer;

    // Variables to hold the correctly guessed, wrongly guessed, and unaswered questions
    var userCorrectAnswer;
    var userIncorrectAnswer;
    var userUnanswered;

    // Array to store the various answers in a random order
    var answerArray = [];

    // Variables to hold our question data
    var questionSentence;
    var questionCorrectAnswer;
    var questionMasterArray;
    var questionPic;

    // Variables to hold how much time per question and showing results in between questions
    var questionTimeAllowed;
    var resultsTimeAllowed;

    // Questions to show the user.
    var questions = {
        qOne: {
            question: "Which park has the biggest area (most acres)?",
            correctAnswer: "Wrangell–St. Elias",
            incorrectAnswers: ["Denali", "Gates of the Arctic", "Death Valley", "Glacier Bay"],
            pic: "assets/images/Wrangell-St-Elias.jpg"
        },
        qTwo: {
            question: "This national park had the most visitors in 2017.",
            correctAnswer: "Great Smoky Mountains",
            incorrectAnswers: ["Grand Canyon", "Rocky Mountain", "Yellowstone", "Zion"],
            pic: "assets/images/Great-Smoky-Mountains.jpg"
        },
        qThree: {
            question: "The state with the most national parks is ...?",
            correctAnswer: "California",
            incorrectAnswers: ["Alaska", "Utah", "Arizona", "Colorado"],
            pic: "assets/images/Death-Valley.jpg"
        },
        qFour: {
            question: "Florida has the southernmost national park in the lower 48 states. Which one is it?",
            correctAnswer: "Dry Tortugas",
            incorrectAnswers: ["Everglades", "Biscayne", "Congaree", "Wind Cave"],
            pic: "assets/images/Dry-Tortugas.jpg"
        },
        qFive: {
            question: "This national park has the distinction of being the only one in the southern hemisphere!",
            correctAnswer: "American Samoa",
            incorrectAnswers: ["Petrified Forest", "Hot Springs", "Channel Islands", "Lassen Volcanic"],
            pic: "assets/images/American-Samoa.jpg"
        },
        qSix: {
            question: "Pack your coat! This park has the tallest peak in North America!",
            correctAnswer: "Denali",
            incorrectAnswers: ["Wrangell–St. Elias", "Rocky Mountain", "Glacier Bay", "Mount Rainier"],
            pic: "assets/images/Denali.jpg"
        },
        qSeven: {
            question: "Virginia is the home to which national park?",
            correctAnswer: "Shenandoah",
            incorrectAnswers: ["Big Bend", "Wind Cave", "Cuyahoga Valley", "Acadia"],
            pic: "assets/images/Shenandoah.jpg"
        },
        qEight: {
            question: "Which of the following is the first national park?",
            correctAnswer: "Yellowstone",
            incorrectAnswers: ["Crater Lake", "Sequoia", "Glacier", "Mesa Verde"],
            pic: "assets/images/Yellowstone.jpg"
        },
        qNine: {
            question: "The national park with the least amount of visitors in 2017 is ...?",
            correctAnswer: "Gates of the Arctic",
            incorrectAnswers: ["Lake Clark", "Isle Royale", "Voyageurs", "Black Canyon of the Gunnison"],
            pic: "assets/images/Gates-of-the-Arctic.jpg"
        },
        qTen: {
            question: "The park most recently inducted into the list of national parks is ...?",
            correctAnswer: "Indiana Dunes",
            incorrectAnswers: ["Gateway Arch in St. Louis", "Pinnacles", "Kobuk Valley", "Great Sand Dunes"],
            pic: "assets/images/Indiana-Dunes.jpg"
        }
    };

    // Store the keys in an array which we can then loop on
    var masterQuestionList = Object.keys(questions);

    // Function that controls when the question timer starts
    function startQuestionTimer() {
        questionTimer = setInterval(decrementQuestion, 1000);
    }

    // Subtract time from each question until it reaches zero
    function decrementQuestion() {
        questionTimeAllowed--;
        if (questionTimeAllowed == 5) {
            $("#timeLeft").addClass("rainbow");
        }
        $("#timeLeft").text("Time Left: " + questionTimeAllowed);
        if (questionTimeAllowed == 0) {
            userUnanswered++;
            console.log("Question " + (currentQuestion + 1) + ": You didn't answer this question");
            stopQuestionTimer();
        }
    }

    // Function that starts the question results timer
    function startQuestionResultsTimer() {
        resultsTimer = setInterval(decrementResults, 1000);
    }

    // Subtract time from the results until time up, then start next question
    function decrementResults() {
        resultsTimeAllowed--;
        if (resultsTimeAllowed == 0) {
            clearInterval(resultsTimer);
            showNextQuestion();
        }
    }

    // Stop the question timer
    // Show results of the question
    function stopQuestionTimer() {
        clearInterval(questionTimer);
        $("#timeLeft").removeClass("rainbow");
        showQuestionResults();
    }

    // Show the questions results to the user
    function showQuestionResults() {

        // Increment the current question counter
        currentQuestion++;

        // Hide the question container from the user
        document.getElementById("questionContainer").style.display = "none";

        // Display the remaining time left. Will display 0 if question timed out.
        $("#questionTimeLeft").text("Time Left: " + questionTimeAllowed);

        // Show the message result to the user
        var qResultMessage = "";
        if (!didUserClickAnswer) {
            qResultMessage = "You ran out of time! Try harder!"
        } else {
            if (answerIsCorrect == "true") {
                qResultMessage = "Congratulations! You got the correct answer!"
            } else {
                qResultMessage = "Better luck next time!"
            }
        }
        $("#questionResultsMessage").text(qResultMessage)

        // Show the correct answer
        $("#questionCorrectAnswer").html("<h5>The correct answer is: " + questionCorrectAnswer + "</h5>");

        // Get the image
        $("#questionPicture").attr("src", questionPic);

        // Show the question results
        document.getElementById("questionResults").style.display = "block";

        // Start the timer that tracks how long the results are to be shown
        startQuestionResultsTimer();
    }

    // Given an array, return a random element
    function getRandomArrayElement(myArray) {
        return Math.floor(Math.random() * myArray.length);
    }

    // Show the next question if there is one available
    // Otherwise show trivia results
    function showNextQuestion() {

        // Hide the question results
        document.getElementById("questionResults").style.display = "none";

        // Show the next question in the list
        if (currentQuestion < masterQuestionList.length) {

            // Set the number of seconds to show each question and results screen
            questionTimeAllowed = 15;
            resultsTimeAllowed = 5;

            // Initialize variable for correct answer
            answerIsCorrect = "false";
            didUserClickAnswer = false;

            // Get the information from the object
            questionSentence = questions[masterQuestionList[currentQuestion]].question;
            questionCorrectAnswer = questions[masterQuestionList[currentQuestion]].correctAnswer;
            questionMasterArray = [...questions[masterQuestionList[currentQuestion]].incorrectAnswers];
            questionPic = questions[masterQuestionList[currentQuestion]].pic;

            // Push the correct answer onto the array
            questionMasterArray.push(questionCorrectAnswer);
            var questionMasterArrayLength = questionMasterArray.length;

            // Empty the answer array. Buid the array of answers in a random order.
            answerArray = [];
            for (iBuildArrayList = 0; iBuildArrayList < questionMasterArrayLength; iBuildArrayList++) {
                var arrayIndex = getRandomArrayElement(questionMasterArray);
                answerArray.push(questionMasterArray[arrayIndex]);

                // Now splice the answer we used
                questionMasterArray.splice(arrayIndex, 1);
            }

            // Show the question and answers to the user
            $("#question").html("<h5>" + questionSentence + "</h5>");
            $("#timeLeft").text("Time Left: " + questionTimeAllowed);
            $("#answerA").text(answerArray[0]);
            $("#answerA").attr("isCorrectAnswer", answerArray[0] == questionCorrectAnswer ? "true" : "false");
            $("#answerB").text(answerArray[1]);
            $("#answerB").attr("isCorrectAnswer", answerArray[1] == questionCorrectAnswer ? "true" : "false");
            $("#answerC").text(answerArray[2]);
            $("#answerC").attr("isCorrectAnswer", answerArray[2] == questionCorrectAnswer ? "true" : "false");
            $("#answerD").text(answerArray[3]);
            $("#answerD").attr("isCorrectAnswer", answerArray[3] == questionCorrectAnswer ? "true" : "false");
            $("#answerE").text(answerArray[4]);
            $("#answerE").attr("isCorrectAnswer", answerArray[4] == questionCorrectAnswer ? "true" : "false");
            document.getElementById("questionContainer").style.display = "block";

            // Start the clock!
            startQuestionTimer();

        } else {
            // We have no more questions to show the user
            // Show the final results!
            showFinalResults();
        }
    }

    // If the user clicks an answer, show results of the question
    $(".textClicking").on("click", function () {
        didUserClickAnswer = true;
        answerIsCorrect = $(this).attr("isCorrectAnswer");
        console.log("Question " + (currentQuestion + 1) + ": Did you get the right answer? True is yes, false is no -----> " + answerIsCorrect);
        if (answerIsCorrect == "true") {
            userCorrectAnswer++;
        } else {
            userIncorrectAnswer++;
        }
        stopQuestionTimer();
    });

    // Hightlight the box if the user mouses over an answer
    $(".onMouseOverHighlighting").hover(function () {
        $(this).css("background-color", "darkseagreen");
        $(this).css("border", "3px solid rebeccapurple");
    }, function () {
        $(this).css("background-color", "bisque");
        $(this).css("border", "none");
    })

    // Loop through our questions and track the correct answers, incorrect answers, and unanswered questions
    function startTriviaGame() {

        // Initialize scoring variables and tracking for which question the user is on
        userCorrectAnswer = 0;
        userIncorrectAnswer = 0;
        userUnanswered = 0;
        currentQuestion = 0;

        // Hide our splash message and results (if displayed) when the game starts
        document.getElementById("startGame").style.display = "none";
        document.getElementById("resultsContainer").style.display = "none";

        // Show our next question in the array of questions
        showNextQuestion();
    }

    // Show the final trivia results to the user
    function showFinalResults() {

        // Determine message to display to user
        var finalMessage = "";
        var pctScore = userCorrectAnswer / (userCorrectAnswer + userIncorrectAnswer + userUnanswered)
        if (pctScore == 1) {
            finalMessage = "Lets be honest. You were googling these while taking the quiz, weren't you???"
        } else if (pctScore >= 0.9) {
            finalMessage = "Fantastic job! This isn't easy!"
        } else if (pctScore >= 0.8) {
            finalMessage = "Two thumbs up!"
        } else if (pctScore >= 0.7) {
            finalMessage = "You might want to read up more on the national parks..."
        } else if (pctScore == 0) {
            finalMessage = "You didn't get any correct. Someone randomly clicking answers is bound to get at least one right. Shame on you!!"
        } else {
            finalMessage = "Wikipedia is your friend. Do more reading and try again."
        }

        // Set our text to show the user
        $("#resultsMessage").html("<h5>" + finalMessage + "</h5>");
        $("#resultsCorrect").text("Correct Answers: " + userCorrectAnswer);
        $("#resultsIncorrect").text("Incorrect Answers: " + userIncorrectAnswer);
        $("#resultsNotAnswered").text("Not Answered: " + userUnanswered);

        // Display the results container div
        document.getElementById("resultsContainer").style.display = "block";
    }
}