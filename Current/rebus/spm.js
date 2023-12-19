let questions = [
    {
      question: "Sofie har spist boller her, og Markus går minst to runder her når han kan. Plassen har sitt navn etter hvor du skal. Hvor skal du?",
      answer: "Slottsparken"
    },
    {
        question: "I parken, finner du tre speil. Speilet du skal til arver fra damen med de flotte hattene. Hva heter speilet?",
        answer: "Dronningdammen"
      },
      {
        question: "Nå er du like ved meg. Jeg sitter ikke ved ditt speil, men ved siden av. Jeg kikker på slotten. Hvem er jeg?",
        answer: "Dronning Sonja"
      },
  ];
  
  let currentQuestion = 0;
  
  document.getElementById('question').innerText = questions[currentQuestion].question;
  
  document.getElementById('submitBtn').addEventListener('click', function() {
    let input = document.getElementById('answerInput');
    if (input.value.toLowerCase() == questions[currentQuestion].answer.toLowerCase()) {
      document.getElementById('result').innerText = 'Riktig';
      input.value = "";
      currentQuestion += 1;
      if (currentQuestion < questions.length) {
        document.getElementById('question').innerText = questions[currentQuestion].question;
      } else {
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('question').innerText = 'Husk å titte høyt og lavt! Du har nå nådd slutten';
      }
    } else {
      document.getElementById('result').innerText = 'Feil! Små og store bokstaver har ingenting å si, men har du skrevet det riktig?';
    }
  });