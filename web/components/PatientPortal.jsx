import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientPortal = () => {
  const [conversation, setConversation] = useState([
    { sender: 'bot', message: 'Hi, how can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [expectingPostalCode, setExpectingPostalCode] = useState(false);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const navigate = useNavigate();

  // Append a new message to the conversation
  const addMessage = (sender, message) => {
    setConversation((prev) => [...prev, { sender, message }]);
  };

  // Handle form submission from the chat input
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = input.trim();
    addMessage('user', userMessage);
    setInput('');

    if (expectingPostalCode) {
      handlePostalCode(userMessage);
    } else {
      handleUserMessage(userMessage);
    }
  };

  // Function to analyze the user's message
  const handleUserMessage = (message) => {
    // Keywords for symptoms likely to be managed virtually
    const virtualKeywords = ['cough', 'fever', 'headache', 'cold', 'sore throat', 'mild'];
    const lowerMessage = message.toLowerCase();
    const canBeResolvedVirtually = virtualKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (canBeResolvedVirtually) {
      const treatmentAdvice = "Based on your symptoms, try taking a mild dose of paracetamol, rest well, and stay hydrated. If symptoms persist, please book an appointment with a doctor.";
      addMessage('bot', treatmentAdvice);
      addMessage('bot', "Click the 'Book Appointment' button to schedule an appointment.");
      // Append a special message identifier that we'll use to render the booking button.
      addMessage('bot', "BOOK_APPOINTMENT_BUTTON");
    } else {
      addMessage('bot', "It seems your issue might not be resolvable virtually. Please reach out to the nearest medical center.");
      addMessage('bot', "Could you please provide your postal code so I can find the nearest centers?");
      setExpectingPostalCode(true);
    }
  };

  // Function to fetch medical centers dynamically using real APIs
  const fetchMedicalCenters = async (postalCode) => {
    try {
      // Get latitude and longitude from the postal code via Nominatim API
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${postalCode}&format=json&limit=1`);
      const geoData = await geoRes.json();
      if (geoData.length === 0) {
        return [];
      }
      const { lat, lon } = geoData[0];

      // Build an Overpass API query for hospitals, clinics, and doctor facilities within 7km radius
      const query = `
        [out:json];
        (
          node["amenity"="hospital"](around:7000,${lat},${lon});
          node["amenity"="clinic"](around:7000,${lat},${lon});
          node["amenity"="doctors"](around:7000,${lat},${lon});
        );
        out body;
      `;

      const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain"
        },
        body: query
      });

      const overpassData = await overpassRes.json();
      // Map the results into a simplified format
      const centers = overpassData.elements.map(el => ({
        name: el.tags.name || "Unnamed Facility",
        address: el.tags["addr:street"] || "Address not available",
        phone: el.tags.phone || "Phone not available",
        distance: "Within 7km" // In a real-world scenario, compute the actual distance
      }));

      return centers;
    } catch (error) {
      console.error("Error fetching medical centers:", error);
      return [];
    }
  };

  // Handle the postal code input from the user
  const handlePostalCode = async (postalCode) => {
    setLoadingCenters(true);
    addMessage('bot', "Looking up medical centers near your location...");
    const centers = await fetchMedicalCenters(postalCode);
    if (centers.length === 0) {
      addMessage('bot', "Sorry, no medical centers were found within 7km of your location.");
    } else {
      addMessage('bot', "Here are the nearest medical centers:");
      centers.forEach(center => {
        const centerInfo = `${center.name}\nAddress: ${center.address}\nPhone: ${center.phone}\nDistance: ${center.distance}`;
        addMessage('bot', centerInfo);
      });
    }
    setExpectingPostalCode(false);
    setLoadingCenters(false);
  };

  // Function to route the user to the appointment booking page
  const bookAppointment = () => {
    navigate('/appointment');
  };

  return (
    <div style={styles.container}>
      <h2>Patient Portal</h2>
      <div style={styles.chatContainer}>
        {conversation.map((msg, index) => (
          <div key={index} style={msg.sender === 'bot' ? styles.botMessage : styles.userMessage}>
            {msg.message === "BOOK_APPOINTMENT_BUTTON" ? (
              <button onClick={bookAppointment} style={styles.button}>Book Appointment</button>
            ) : (
              msg.message.split('\n').map((line, i) => (
                <p key={i} style={{ margin: '4px 0' }}>{line}</p>
              ))
            )}
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
        <button type="submit" style={styles.button} disabled={loadingCenters}>Send</button>
      </form>
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
