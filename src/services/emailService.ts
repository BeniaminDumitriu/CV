import emailjs from 'emailjs-com';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_fa5aqu9';
const EMAILJS_TEMPLATE_ID_CONFIRMATION = process.env.REACT_APP_EMAILJS_ADMIN_TEMPLATE_ID || 'template_v6u5v9t'; // Contact Us - TRIMIS CĂTRE ADMIN
const EMAILJS_TEMPLATE_ID_NOTIFICATION = process.env.REACT_APP_EMAILJS_CLIENT_TEMPLATE_ID || 'template_4e0nz16'; // Auto-Reply - TRIMIS CĂTRE CLIENT
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'iXAraLhbNy1n92yF2';

// EmailJS initialized successfully

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
}

// Send confirmation email to the person who submitted the form (CLIENT)
export const sendConfirmationEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    const templateParams = {
      email: formData.email,
      to_name: `${formData.firstName} ${formData.lastName}`,
      from_name: 'Beniamin Dumitriu',
    };

    // Sending auto-reply confirmation email

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_NOTIFICATION, // Auto-Reply template pentru CLIENT
      templateParams
    );

    // Auto-reply sent successfully
    return true;
  } catch (error) {
    console.error('❌ Error sending auto-reply to client:', error);
    return false;
  }
};

// Send notification email to admin about new contact (ADMIN)
export const sendNotificationEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: 'beniamindumitriu@gmail.com', // Email-ul ADMIN - aici se trimite notificarea
      to_name: 'Beniamin',
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      phone: formData.phone || 'Nu a fost furnizat',
      message: formData.message || 'Nu a fost furnizat mesaj',
      reply_to: formData.email,
    };

    // Sending notification to admin

    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_CONFIRMATION, // Contact Us template pentru ADMIN
      templateParams
    );

    // Notification sent successfully
    return true;
  } catch (error) {
    console.error('❌ Error sending notification to admin:', error);
    return false;
  }
};

// Professional confirmation message template
const getConfirmationMessage = (firstName: string): string => {
  return `Bună ${firstName}!

Mulțumesc foarte mult pentru că m-ai contactat! 🚀

Am primit mesajul tău și sunt încântat să văd interesul tău pentru serviciile mele de dezvoltare web. 

Îți voi răspunde în cel mai scurt timp posibil (de obicei în 24 de ore) cu toate detaliile și să discutăm despre proiectul tău.

În timpul acesta, te invit să:
🔍 Explorezi portofoliul meu complet pe site
💼 Verifici proiectele mele pe GitHub
📱 Mă urmărești pe LinkedIn pentru noutăți

Îmi place să lucrez cu oameni pasionați de tehnologie și cu proiecte inovatoare, așa că abia aștept să discutăm!

Cu multe mulțumiri,
Beniamin Dumitriu

---
🌐 Website: [Link către site]
📧 Email: beniamindumitriu@gmail.com
📱 Telefon: +40 747 651 829
💻 GitHub: [Link către GitHub]

P.S.: Dacă ai întrebări urgente, nu ezita să mă suni direct!`;
};

// Send both emails when contact form is submitted
export const sendContactEmails = async (formData: ContactFormData): Promise<{
  confirmationSent: boolean;
  notificationSent: boolean;
}> => {
  // Processing contact form submission
  
  // Send both emails in parallel for better performance
  const [confirmationSent, notificationSent] = await Promise.all([
    sendConfirmationEmail(formData),
    sendNotificationEmail(formData)
  ]);

  return {
    confirmationSent,
    notificationSent
  };
}; 