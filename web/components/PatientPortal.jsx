import React, { useState } from 'react';

const PatientPortal = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [conversation, setConversation] = useState([
    { sender: 'bot', message: 'Hi, how can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [expectingPostalCode, setExpectingPostalCode] = useState(false);
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [appointmentVisible, setAppointmentVisible] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState(false); // New state for appointment step
  
  // Add a message to the conversation
  const addMessage = (sender, message) => {
    setConversation((prev) => [...prev, { sender, message }]);
  };

  // Handle chat submission
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

  // Analyze user's message using simple keyword detection
  const handleUserMessage = (message) => {
    const virtualKeywords = [
      'headache', 'migraine', 'muscle pain', 'joint pain', 'arthritis',
      'back pain', 'toothache', 'menstrual cramps', 'sore throat', 'digestive issues',
      'heartburn', 'acid reflux', 'indigestion', 'bloating', 'gas pain', 'nausea', 
      'motion sickness', 'constipation', 'diarrhea', 'stomach cramps', 'common cold', 
      'flu', 'cough', 'seasonal allergies', 'hay fever', 'eczema', 'skin rash', 
      'eye irritation', 'cold sores', 'urinary tract infection', 'anxiety', 'stress relief'
    ];

    const lowerMessage = message.toLowerCase();
    const canBeResolvedVirtually = virtualKeywords.some(keyword =>
      lowerMessage.includes(keyword)
    );

    if (canBeResolvedVirtually) {
      const treatmentAdvice = "Based on your symptoms, try taking a mild dose of paracetamol, rest well, and stay hydrated. If symptoms persist, please book an appointment.";
      addMessage('bot', treatmentAdvice);
      addMessage('bot', "Click the 'Book Appointment' option in the menu to schedule an appointment.");
      setAppointmentVisible(true);
    } else {
      addMessage('bot', "It seems your issue might not be resolvable virtually. Please reach out to the nearest medical center.");
      addMessage('bot', "Could you please provide your postal code so I can find the nearest centers?");
      setExpectingPostalCode(true);
    }
  };

  // Process postal code input and simulate lookup of nearby medical centers
  const handlePostalCode = (postalCode) => {
    const centers = findNearestMedicalCenters(postalCode);
    setMedicalCenters(centers);
    addMessage('bot', "Here are the nearest medical centers:");
    centers.forEach(center => {
      const centerInfo = `${center.name}\nAddress: ${center.address}\nPhone: ${center.phone}\nDistance: ${center.distance}`;
      addMessage('bot', centerInfo);
    });
    setExpectingPostalCode(false);
    setAppointmentStep(true); // Show the appointment button after postal code
  };

  // Simulated function to return nearest medical centers based on postal code
  const findNearestMedicalCenters = (postalCode) => {
    return [
      { name: "City Health Clinic", address: "123 Main St", phone: "123-456-7890", distance: "2 miles" },
      { name: "Downtown Medical Center", address: "456 Elm St", phone: "987-654-3210", distance: "3 miles" },
      { name: "Suburban Hospital", address: "789 Maple Ave", phone: "555-555-5555", distance: "5 miles" },
    ];
  };

  // Handle form submission for booking appointment
  const handleAppointmentSubmit = (e) => {
    e.preventDefault();
    
    if (!appointmentDate || !appointmentTime) {
      alert("Please select both a date and a time.");
      return;
    }

    addMessage('bot', `Your appointment has been booked for ${appointmentDate} at ${appointmentTime}.`);
    setAppointmentVisible(false); // Hide the appointment form after submission
  };

  // Render content based on active section
  const renderSection = () => {
    switch(activeSection) {
      case "home":
        return renderChatSection();
      case "aboutus":
        return renderAboutUs();
      case "contact":
        return renderContactUs();
      case "book":
        return renderCalendar();
      case "profile":
        return renderProfile();
      case "notifications":
        return renderNotifications();
      default:
        return renderChatSection();
    }
  };

  // Chat (Home) section with the AI chatbot
  const renderChatSection = () => (
    <div>
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
      {appointmentStep && (
        <div style={styles.appointmentButtonContainer}>
          <button 
            onClick={() => setActiveSection("book")} 
            style={styles.appointmentButton}
          >
            Make Appointment
          </button>
        </div>
      )}
    </div>
  );

  // About Us section
  const renderAboutUs = () => (
    <div style={styles.section}>
      <h2>About Us</h2>
      <p>
        Welcome to ClickToHeal, a healthcare portal dedicated to connecting patients with quality medical care. Our service offers virtual assistance and streamlined appointment booking with trusted healthcare providers.
      </p>
    </div>
  );

  // Contact Us section
  const renderContactUs = () => (
    <div style={styles.section}>
      <h2>Contact Us</h2>
      <p>Email: support@clicktoheal.com</p>
      <p>Phone: 1-800-123-4567</p>
    </div>
  );

  // Book Appointment section (Date and Time selection)
  const renderCalendar = () => (
    <div style={styles.section}>
      <h2>Book an Appointment</h2>
      <p>Please select your preferred date and time for the appointment.</p>
      <form onSubmit={handleAppointmentSubmit} style={styles.appointmentForm}>
        <input
          type="date"
          id="appointmentDate"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="time"
          id="appointmentTime"
          value={appointmentTime}
          onChange={(e) => setAppointmentTime(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Book Appointment</button>
      </form>
    </div>
  );

  // Profile section with a form for personal details
  const renderProfile = () => (
    <div style={styles.section}>
      <h2>Profile</h2>
      <form style={styles.profileForm}>
        <input type="email" placeholder="Email" style={styles.input} />
        <input type="text" placeholder="Phone Number" style={styles.input} />
        <input type="date" placeholder="Date of Birth" style={styles.input} />
        <input type="number" placeholder="Weight (kg)" style={styles.input} />
        <input type="number" placeholder="Height (cm)" style={styles.input} />
        <input type="text" placeholder="First Name" style={styles.input} />
        <input type="text" placeholder="Last Name" style={styles.input} />
        <button type="submit" style={styles.button}>Update Profile</button>
      </form>
    </div>
  );

  // Notifications section
  const renderNotifications = () => (
    <div style={styles.section}>
      <h2>Notifications</h2>
      <ul>
        <li>Account created successfully.</li>
        <li>You have an appointment tomorrow at 10:00 AM.</li>
        <li>You missed your appointment on 09/25.</li>
      </ul>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header with hamburger menu */}
      <header style={styles.header}>
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          &#9776;
        </button>
        <h1>ClickToHeal Patient Portal</h1>
      </header>

      {/* Side Navigation Menu */}
      {menuOpen && (
        <nav style={styles.sidebar}>
          <ul style={styles.menuList}>
            <li style={styles.menuItem} onClick={() => { setActiveSection("home"); setMenuOpen(false); }}>Home</li>
            <li style={styles.menuItem} onClick={() => { setActiveSection("aboutus"); setMenuOpen(false); }}>About Us</li>
            <li style={styles.menuItem} onClick={() => { setActiveSection("contact"); setMenuOpen(false); }}>Contact Us</li>
            <li style={styles.menuItem} onClick={() => { setActiveSection("book"); setMenuOpen(false); }}>Book Appointment</li>
            <li style={styles.menuItem} onClick={() => { setActiveSection("profile"); setMenuOpen(false); }}>Profile</li>
            <li style={styles.menuItem} onClick={() => { setActiveSection("notifications"); setMenuOpen(false); }}>Notifications</li>
          </ul>
        </nav>
      )}

      {/* Main Content Section */}
      <main style={styles.mainContent}>
        {renderSection()}
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  hamburger: {
    fontSize: '24px',
    marginRight: '20px',
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
  },
  sidebar: {
    position: 'absolute',
    top: '50px',
    left: '0',
    width: '200px',
    backgroundColor: '#f4f4f4',
    borderRight: '1px solid #ddd',
    padding: '10px',
  },
  menuList: {
    listStyle: 'none',
    padding: '0',
  },
  menuItem: {
    padding: '8px 0',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
  },
  mainContent: {
    padding: '20px',
    marginTop: '10px',
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
  },
  appointmentButtonContainer: {
    marginTop: '10px',
    textAlign: 'center'
  },
  appointmentButton: {
    padding: '10px 15px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  section: {
    margin: '20px 0',
  },
  profileForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '400px',
  },
  appointmentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxWidth: '400px',
  },
};

export default PatientPortal;
