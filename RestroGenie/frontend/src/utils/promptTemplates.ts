/**
 * Implements conversational Hinglish marketing message templates
 * structured strictly after prompts/marketing.txt.
 * Used when running client-side preview drafts or offline local engine.
 */

export interface MessageGenParams {
  customerName?: string;
  favoriteFood?: string;
  lastOrderDate?: string;
  customerSegment?: string;
  channel?: 'WhatsApp' | 'Email' | 'Sms';
  tone?: 'Hinglish Humorous (Default)' | 'Warm & Friendly' | 'Executive & Classic';
}

export function generateHinglishMarketingDraft(params: MessageGenParams): string {
  const name = params.customerName?.trim() || 'Foodie';
  const food = params.favoriteFood?.trim() || 'delicious food';
  const segment = params.customerSegment || 'Regular';
  const tone = params.tone || 'Hinglish Humorous (Default)';

  if (tone === 'Warm & Friendly') {
    if (food && food !== 'delicious food') {
      return `Hi ${name}! 😊 We noticed you've been craving ${food} lately. Your table is always ready for you at RestroGenie!`;
    }
    return `Hello ${name}! 👋 We’d love to welcome you back for an amazing meal this week. Hope to see you soon!`;
  }

  if (tone === 'Executive & Classic') {
    return `Dear ${name}, it has been a pleasure serving you. We warmly invite you back to savor your preferred dining favorites with us this week.`;
  }

  // Default: Conversational Hinglish Humorous per prompts/marketing.txt
  if (segment.includes('Frequent')) {
    return `Arey ${name} bhai! 😂 Lagta hai kitchen wale aapka favourite ${food} prepare karte hi aapka naam lene lagte hain! Aaj sham ka kya plan hai?`;
  }

  if (segment.includes('High Spender')) {
    return `Namaste ${name} ji! 👑 Royalty level taste buds hain aapke. Hamara chef keh raha hai ki bina ${food} order kiye weekend अधूरा lag raha hai. Order ho jaye?`;
  }

  if (segment.includes('Inactive')) {
    return `Arey ${name}, itne din ho gaye! 🥺 Kahin diet ka chakkar toh nahi? Aise rooth mat jao yaar, aapka pyara ${food} kitchen me akele ro raha hai!`;
  }

  if (segment.includes('New Customer')) {
    return `Welcome to the family ${name}! 🎉 Pehli date me hi dil jeet liya tha aapne. Ab time aa gaya hai hamare signature ${food} ko dobara try karne ka!`;
  }

  if (food && food !== 'delicious food') {
    return `Hey ${name}! 🤤 Humne suna hai pet me chuhe daud rahe hain aur unhe sirf ${food} hi shaant kar sakta hai. Toh phir soch kya rahe ho, order lagayein?`;
  }

  return `Hey ${name}! 😄 Zindagi me tension bohot hai, par biryani aur burger ka solution sirf ek click door hai. Aaj kuch lajawab khaya jaye?`;
}
