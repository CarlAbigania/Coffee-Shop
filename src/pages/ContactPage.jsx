import { useState } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await axios.post('/api/index.php?route=contact', {
        name: formData.name,
        email: formData.email,
        message: formData.message
      });

      if (response.data.success) {
        setMessage('Message sent successfully! We\'ll get back to you soon.');
        setMessageType('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setMessage(response.data.message || 'Failed to send message. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again later.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-page">
      <div className="contact-container">
        <h1>Get in Touch</h1>
        <p className="contact-intro">
          We'd love to hear your thoughts on our coffee and service. Ask a question, share feedback, or just say hello.
        </p>
          
        <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
          {message && (
            <div className={`form-alert ${messageType}`} role="alert" aria-live="polite">
              {message}
            </div>
          )}

          <label htmlFor="name">Full Name</label>
          <div className="form-field">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name"
              aria-invalid="false"
              autoComplete="name"
              required
              disabled={isSubmitting}
            />
          </div>

          <label htmlFor="email">Email Address</label>
          <div className="form-field">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              aria-invalid="false"
              autoComplete="email"
              required
              disabled={isSubmitting}
            />
          </div>

          <label htmlFor="message">Your Message</label>
          <div className="form-field">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Type your message..."
              rows="5"
              aria-invalid="false"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" id="contact-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
