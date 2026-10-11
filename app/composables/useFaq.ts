export interface FaqItem {
  topic: 'Tracking' | 'Sending' | 'Receiving' | 'Account and payment'
  question: string
  answer: string
}

// Frequently asked questions, shared by the home page and the Help page.
// The tracking number prefix comes from the site settings.
export function useFaq() {
  const settings = useSiteSettings()

  return computed<FaqItem[]>(() => {
    const prefix = settings.value.trackingPrefix?.toUpperCase()
    return [
      {
        topic: 'Tracking',
        question: 'Where do I find my tracking number?',
        answer: `It's on the receipt you were given when you dropped off the parcel and in your confirmation email${prefix ? `. It starts with ${prefix}` : ''}. If you're the recipient, ask the sender for it.`,
      },
      {
        topic: 'Tracking',
        question: "My tracking hasn't updated for several days",
        answer: 'During sea freight or customs clearance, several days can pass between two updates. If nothing changes after the estimated delivery date, contact us with your tracking number.',
      },
      {
        topic: 'Sending',
        question: 'How do I get a price?',
        answer: 'Fill in the quote form with the origin, destination, weight and dimensions. We reply within 24 hours.',
      },
      {
        topic: 'Sending',
        question: 'Which countries do you deliver to?',
        answer: 'Over 150 countries, by air, sea or road. Enter your destination in the quote request to see the options available.',
      },
      {
        topic: 'Tracking',
        question: 'What does "Delayed" mean?',
        answer: 'An issue is holding up the shipment, for example a missing customs document or an incomplete address. Our team is dealing with it and will contact the sender or recipient if needed.',
      },
      {
        topic: 'Sending',
        question: 'What can\'t I send?',
        answer: 'Dangerous goods, weapons, drugs, counterfeit items and anything banned in the destination country. Some goods (food, batteries, medicines) need special handling: tell us about them in your quote request.',
      },
      {
        topic: 'Receiving',
        question: 'Will I have to pay customs duties?',
        answer: 'It depends on the destination country, the contents and their value. When duties apply, we let you know before delivery.',
      },
      {
        topic: 'Receiving',
        question: "What happens if I'm not in when the parcel arrives?",
        answer: 'The delivery partner will try to contact you using the phone number given by the sender to arrange another delivery.',
      },
      {
        topic: 'Account and payment',
        question: 'How do I pay for a shipment?',
        answer: 'Once you accept your quote, we send you the payment details. We never ask for payment by text message or through a link in an unexpected email.',
      },
    ]
  })
}
