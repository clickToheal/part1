import React, { useState } from 'react';

const PatientPortal = () => {
  const [conversation, setConversation] = useState([
    { sender: 'bot', message: 'Hi, how can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [expectingPostalCode, setExpectingPostalCode] = useState(false);
  const [medicalCenters, setMedicalCenters] = useState([]);

  // Add a message to the conversation
  const addMessage = (sender, message) => {
    setConversation((prev) => [...prev, { sender, message }]);
  };

  // Handle user input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');

    if (expectingPostalCode) {
      // Process the postal code provided by the user
      handlePostalCode(userMessage);
    } else {
      // Analyze the user's message to decide on the response
      handleUserMessage(userMessage);
    }
  };

  // Analyze the user's message using simple keyword detection
  const handleUserMessage = (message) => {
    // Define keywords that indicate symptoms that can be managed virtually
    const virtualKeywords = [
  // General Pain & Aches
  'headache', 'migraine', 'muscle pain', 'joint pain', 'arthritis', 
  'back pain', 'toothache', 'menstrual cramps', 'sore throat',

  // Digestive Issues
  'digestive issues', 'heartburn', 'acid reflux', 'indigestion', 
  'bloating', 'gas pain', 'nausea', 'motion sickness', 'constipation', 
  'diarrhea', 'stomach cramps', 'mild food poisoning', 'hiccups', 
  'irritable bowel syndrome', 'acid indigestion', 'traveler’s diarrhea', 
  'gallbladder discomfort', 'hemorrhoids', 'anal itching',

  // Cold, Flu & Respiratory Issues
  'common cold', 'flu', 'cough', 'sore throat', 'nasal congestion', 
  'sinus pressure', 'runny nose', 'sneezing', 'fever', 'chest congestion', 
  'post-nasal drip', 'dry cough', 'bronchitis', 'chest tightness', 
  'whooping cough',

  // Allergies & Skin Conditions
  'seasonal allergies', 'hay fever', 'hives', 'eczema', 'skin rash', 
  'itchy skin', 'poison ivy', 'bug bites', 'sunburn', 'dry skin', 
  'athlete’s foot', 'minor cuts', 'swimmer’s ear', 'earwax buildup', 
  'contact dermatitis', 'psoriasis', 'dandruff', 'seborrheic dermatitis', 
  'scabies', 'lice', 'ringworm', 'ingrown hairs', 'razor burn', 'warts', 
  'fungal nail infections',

  // Eye & Mouth Conditions
  'red or dry eyes', 'eye irritation', 'pink eye', 'eye strain', 
  'eye twitching', 'cold sores', 'canker sores', 'chapped lips', 
  'gum pain', 'mouth ulcers', 'bad breath', 'sensitive teeth',

  // Urinary & Women’s Health
  'urinary tract infection', 'vaginal yeast infection', 'menstrual pain', 
  'bladder irritation', 'mild pelvic pain', 'breast tenderness',

  // General Health Issues
  'mild insomnia', 'anxiety', 'stress relief', 'motion sickness', 
  'jet lag', 'dehydration', 'ear pain', 'neck pain', 'sprains', 
  'bruises', 'shin splints', 'carpal tunnel pain', 'minor nerve pain', 
  'minor burns', 'tendonitis', 'general body aches'
];

    const lowerMessage = message.toLowerCase();
    const canBeResolvedVirtually = virtualKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (canBeResolvedVirtually) {
      // Virtual treatment advice (replace with real treatment logic)
      const treatmentAdvice = "Based on your symptoms, try taking a mild dose of paracetamol, rest well, and stay hydrated. If symptoms persist, please book an appointment with a doctor.";
      addMessage('bot', treatmentAdvice);
      addMessage('bot', "Click the 'Book Appointment' button to schedule an appointment.");
      // Here you could enable a booking button component or route to an appointment page.
    } else {
      // If the issue doesn't seem resolvable virtually, prompt for postal code
      addMessage('bot', "It seems your issue might not be resolvable virtually. Please reach out to the nearest medical center.");
      addMessage('bot', "Could you please provide your postal code so I can find the nearest centers?");
      setExpectingPostalCode(true);
    }
  };

  // Handle postal code input and simulate lookup of nearby medical centers
  const handlePostalCode = (postalCode) => {
    // Replace this with a real API call if needed.
    const centers = findNearestMedicalCenters(postalCode);
    setMedicalCenters(centers);
    addMessage('bot', "Here are the nearest medical centers:");
    centers.forEach(center => {
      const centerInfo = `${center.name}\nAddress: ${center.address}\nPhone: ${center.phone}\nDistance: ${center.distance}`;
      addMessage('bot', centerInfo);
    });
    // Reset the postal code expectation flag
    setExpectingPostalCode(false);
  };

  // Simulated function to return nearest medical centers based on postal code
  const findNearestMedicalCenters = (postalCode) => {
    // For demonstration, returning static sample data
    return [
      { name: "City Health Clinic", address: "123 Main St", phone: "123-456-7890", distance: "2 miles" },
      { name: "Downtown Medical Center", address: "456 Elm St", phone: "987-654-3210", distance: "3 miles" },
      { name: "Suburban Hospital", address: "789 Maple Ave", phone: "555-555-5555", distance: "5 miles" },
    ];
  };

  return (
    <div style={styles.container}>
      <h2>Patient Portal</h2>
      <div style={styles.chatContainer}>
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={msg.sender === 'bot' ? styles.botMessage : styles.userMessage}
          >
            {msg.message.split('\n').map((line, i) => (
              <p key={i} style={{ margin: '4px 0' }}>{line}</p>
            ))}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
      {/* Optionally, add a booking button component below if needed */}
      {/* <button onClick={() => navigateToBooking()} style={styles.button}>Book Appointment</button> */}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    border: '1px solid #ccc',
    borderRadius: '8px'
  },
  chatContainer: {
    border: '1px solid #ddd',
    padding: '10px',
    height: '300px',
    overflowY: 'auto',
    marginBottom: '10px'
  },
  botMessage: {
    textAlign: 'left',
    backgroundColor: '#f1f1f1',
    padding: '8px',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  userMessage: {
    textAlign: 'right',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  inputForm: {
    display: 'flex',
    gap: '8px'
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    padding: '10px 15px',
    fontSize: '16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer'
  }
};

export default PatientPortal;
