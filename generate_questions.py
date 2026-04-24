import json
import os

EN_PATH = os.path.join('locales', 'en.json')

with open(EN_PATH, 'r', encoding='utf-8') as f:
    data = json.load(f)

quiz_q = {
    "q1_q": "What is 'Clickbait'?",
    "q1_a1": "An internet worm that deletes files.",
    "q1_a2": "A highly exaggerated or sensationalized headline designed purely to attract clicks.",
    "q1_a3": "A type of phishing scam using emails.",
    "q1_c": "b",

    "q2_q": "Which of these is a major red flag that a story might be fake?",
    "q2_a1": "It is reported by multiple independent major news networks.",
    "q2_a2": "It has an author bio that links to a verified LinkedIn page.",
    "q2_a3": "The URL aggressively mimics a real site (e.g., 'abcnews.com.co' instead of 'abcnews.go.com').",
    "q2_c": "c",

    "q3_q": "If you see a highly emotional or shocking viral image online, what is the best first step?",
    "q3_a1": "Share it immediately to warn your friends and family.",
    "q3_a2": "Do a reverse image search to verify its original source context and date.",
    "q3_a3": "Leave an angry comment on the post.",
    "q3_c": "b",

    "q4_q": "What is a 'Deepfake'?",
    "q4_a1": "A fake online persona used to troll others.",
    "q4_a2": "A highly sophisticated, AI-generated convincing fake video or audio recording.",
    "q4_a3": "A news article published anonymously.",
    "q4_c": "b",

    "q5_q": "Why do fake news creators often use extreme, outrage-inducing language?",
    "q5_a1": "Because they want the reader to think deeply and critically.",
    "q5_a2": "Because algorithms favor high emotional engagement, ensuring the post goes viral faster.",
    "q5_a3": "Because it is a requirement to post on certain social media platforms.",
    "q5_c": "b",

    "q6_q": "What does the 'S' in the SIFT method stand for?",
    "q6_a1": "Search",
    "q6_a2": "Stop",
    "q6_a3": "Source",
    "q6_c": "b",

    "q7_q": "What is a characteristic of a 'Bot' account on social media?",
    "q7_a1": "They post personal family photos and life updates.",
    "q7_a2": "They have a high frequency of posts, often repeating the same message 24/7.",
    "q7_a3": "They always use two-factor authentication.",
    "q7_c": "b",

    "q8_q": "What is an 'Echo Chamber'?",
    "q8_a1": "A room designed for high-quality audio recording.",
    "q8_a2": "An environment where users only encounter information that confirms their existing beliefs.",
    "q8_a3": "A social media feature that repeats your messages to more people.",
    "q8_c": "b",

    "q9_q": "How can you verify if a quote from a politician is real?",
    "q9_a1": "If someone you like shared it, it must be real.",
    "q9_a2": "Check if it's reported by several reputable news outlets or search for the full video/speech.",
    "q9_a3": "Believe it if it's written in bold letters with an image of the person.",
    "q9_c": "b",

    "q10_q": "What is 'Confirmation Bias'?",
    "q10_a1": "Updating your beliefs based on new evidence.",
    "q10_a2": "The tendency to favor information that confirms what we already believe.",
    "q10_a3": "Verifying a news story twice before sharing.",
    "q10_c": "b",

    "q11_q": "What is a 'Satirical' news site?",
    "q11_a1": "A site dedicated to leaking classified documents.",
    "q11_a2": "A site that uses humor, irony, and exaggeration to comment on news, intended as a joke.",
    "q11_a3": "A site that only publishes scientific research.",
    "q11_c": "b",

    "q12_q": "What is the primary risk of sharing unverified medical advice?",
    "q12_a1": "You might get fewer likes on your next post.",
    "q12_a2": "It can lead to real-world harm, including dangerous self-treatment or avoiding vaccines.",
    "q12_a3": "It takes up too much space in your friend's feed.",
    "q12_c": "b",

    "q13_q": "What is 'Phishing'?",
    "q13_a1": "Searching for fishing spots on a map.",
    "q13_a2": "A deceptive attempt to obtain sensitive information like passwords or credit cards.",
    "q13_a3": "A way to increase the followers on your social media page.",
    "q13_c": "b",

    "q14_q": "What should you check first when you receive a viral message on WhatsApp?",
    "q14_a1": "How many emojis are in the message.",
    "q14_a2": "Look for the 'Forwarded many times' label and verify the claim on a fact-checking site.",
    "q14_a3": "Reply and ask the sender if they created the message.",
    "q14_c": "b",

    "q15_q": "What is 'Information Pollution'?",
    "q15_a1": "Physical pollution caused by data centers.",
    "q15_a2": "The spread of irrelevant, redundant, or misleading information that overwhelms users.",
    "q15_a3": "Downloading too many apps on your phone.",
    "q15_c": "b",

    "q16_q": "What is a 'Fact-Checker'?",
    "q16_a1": "A person who only likes verified accounts on Twitter.",
    "q16_a2": "An individual or organization that researches claims to determine their accuracy.",
    "q16_a3": "A social media algorithm that deletes negative comments.",
    "q16_c": "b",

    "q17_q": "What does a padlock icon in a browser's address bar mean?",
    "q17_a1": "The website content is 100% true.",
    "q17_a2": "The connection between your browser and the site is encrypted (HTTPS).",
    "q17_a3": "The website is protected by the government.",
    "q17_c": "b",

    "q18_q": "What is 'Doomscrolling'?",
    "q18_a1": "Searching for video game cheats.",
    "q18_a2": "Continuously scrolling through bad news, even when it is distressing or depressing.",
    "q18_a3": "Deleting apps that you no longer use.",
    "q18_c": "b",

    "q19_q": "What is a 'Whistleblower'?",
    "q19_a1": "Someone who referees a sports game.",
    "q19_a2": "A person who exposes secretive information or activity within an organization.",
    "q19_a3": "A user who reports spam accounts continuously.",
    "q19_c": "b",

    "q20_q": "What is 'Astroturfing'?",
    "q20_a1": "Installing artificial grass in your yard.",
    "q20_a2": "Creating the false impression of widespread community support for a cause or product.",
    "q20_a3": "A method to increase solar panel efficiency.",
    "q20_c": "b",

    "q21_q": "In the SIFT method, what does 'T' stand for?",
    "q21_a1": "Trust",
    "q21_a2": "Trace (back to the original context)",
    "q21_a3": "Translate",
    "q21_c": "b",

    "q22_q": "What is a 'Filter Bubble'?",
    "q22_a1": "A cleaning feature on a phone's screen.",
    "q22_a2": "The intellectual isolation that can occur when websites use algorithms to selectively guess what information a user would like to see.",
    "q22_a3": "A waterproof case for electronic devices.",
    "q22_c": "b",

    "q23_q": "What is a 'Coordinated Inauthentic Behavior' (CIB)?",
    "q23_a1": "Groups of people dancing the same steps in a viral video.",
    "q23_a2": "When groups of accounts work together to mislead others about who they are or what they are doing.",
    "q23_a3": "A common glitch in social media messaging apps.",
    "q23_c": "b",

    "q24_q": "What is 'Misleading Context'?",
    "q24_a1": "When a story is written in a language you don't understand.",
    "q24_a2": "When genuine content is shared with false contextual information (fake location, wrong date).",
    "q24_a3": "When a website has too many fonts and colors.",
    "q24_c": "b",

    "q25_q": "What is 'Deceptive Manipulation' in media?",
    "q25_a1": "Translating a video into a different language.",
    "q25_a2": "When genuine imagery or information is manipulated to deceive (e.g., photoshopped image).",
    "q25_a3": "Adding background music to a news report.",
    "q25_c": "b",

    "q26_q": "What is a 'Parody' account?",
    "q26_a1": "A backup account for a famous celebrity.",
    "q26_a2": "An account that imitates a person or organization for comedy or commentary.",
    "q26_a3": "An account used for professional networking.",
    "q26_c": "b",

    "q27_q": "What is the 'Illusory Truth Effect'?",
    "q27_a1": "When you believe everything you read first.",
    "q27_a2": "The tendency to believe information to be correct after repeated exposure to it.",
    "q27_a3": "Thinking that a movie is a real documentary.",
    "q27_c": "b",

    "q28_q": "What is 'Gaslighting' in digital communication?",
    "q28_a1": "Using a bright screen late at night.",
    "q28_a2": "Manipulating someone into doubting their own perception of reality.",
    "q28_a3": "Charging your phone too many times.",
    "q28_c": "b",

    "q29_q": "What is a 'Syllogism' in logical fallacies?",
    "q29_a1": "A type of internet browser.",
    "q29_a2": "A form of reasoning where a conclusion is drawn from two given premises.",
    "q29_a3": "A computer virus that infects text files.",
    "q29_c": "b",

    "q30_q": "What is 'Data Mining'?",
    "q30_a1": "Digging for precious metals near data centers.",
    "q30_a2": "The practice of examining large databases in order to generate new information.",
    "q30_a3": "Deleting duplicate files from your hard drive.",
    "q30_c": "b",

    "q31_q": "What is 'Algorithm' bias?",
    "q31_a1": "When a computer is too slow to load pages.",
    "q31_a2": "Systematic and repeatable errors in a computer system that create unfair outcomes.",
    "q31_a3": "A feature that makes pictures look better.",
    "q31_c": "b",

    "q32_q": "What is a 'Troll Farm'?",
    "q32_a1": "A place where goats are raised for internet memes.",
    "q32_a2": "A professional group of people who aim to interfere in political opinions and decision-making.",
    "q32_a3": "A website where you can play farm simulation games.",
    "q32_c": "b",

    "q33_q": "What is 'Digital Footprint'?",
    "q33_a1": "The size of your smartphone screen.",
    "q33_a2": "The record or trail of data that you leave behind while using the internet.",
    "q33_a3": "A type of biological identification for unlocking phones.",
    "q33_c": "b",

    "q34_q": "What is 'Doxxing'?",
    "q34_a1": "A type of medical diagnosis based on online symptoms.",
    "q34_a2": "Searching for and publishing private or identifying information about a particular individual on the internet.",
    "q34_a3": "Signing up for too many newsletters at once.",
    "q34_c": "b",

    "q35_q": "What is 'Two-Factor Authentication' (2FA)?",
    "q35_a1": "Using two different passwords for the same account.",
    "q35_a2": "A security process that requires two different forms of identification from the user.",
    "q35_a3": "Logging into an account from two different countries.",
    "q35_c": "b",

    "q36_q": "What is a 'Micro-Targeting'?",
    "q36_a1": "A way to aim a camera at small objects.",
    "q36_a2": "A marketing strategy that uses consumer data to identify the interests of specific individuals to influence their behavior.",
    "q36_a3": "Designing apps for very small smartphone screens.",
    "q36_c": "b",

    "q37_q": "What is 'Circular Reporting'?",
    "q37_a1": "A report that is written in a circular shape.",
    "q37_a2": "When one news source publishes fake info, another cites it, and then the first source cites the second as proof.",
    "q37_a3": "Reporting the news at exactly 12:00 PM every day.",
    "q37_c": "b",

    "q38_q": "What is 'Sensationalism'?",
    "q38_a1": "The feeling of cold or heat from a screen.",
    "q38_a2": "The use of exciting or shocking stories or language at the expense of accuracy, in order to provoke public interest.",
    "q38_a3": "Only reading news that matches your current mood.",
    "q38_c": "b",

    "q39_q": "What is 'Yellow Journalism'?",
    "q39_a1": "Journalism that only uses yellow-colored paper.",
    "q39_a2": "Journalism that uses little or no legitimate, well-researched news and instead uses eye-catching headlines.",
    "q39_a3": "News reporting about the history of colors.",
    "q39_c": "b",

    "q40_q": "What is a 'Lede' in a news story?",
    "q40_a1": "The heavy metal used to make old computers.",
    "q40_a2": "The opening sentence or paragraph of a news story, containing the most important details.",
    "q40_a3": "The name of the font used for titles.",
    "q40_c": "b",

    "q41_q": "What is 'Media Literacy'?",
    "q41_a1": "Knowing how to read a physical newspaper.",
    "q41_a2": "The ability to access, analyze, evaluate, and create media in a variety of forms.",
    "q41_a3": "Having more than 5 social media accounts.",
    "q41_c": "b",

    "q42_q": "What is 'Open OSINT' (Open Source Intelligence)?",
    "q42_a1": "An operating system used by spies.",
    "q42_a2": "Data collected from publicly available sources to be used in an intelligence context.",
    "q42_a3": "A secret language used for encrypted messages.",
    "q42_c": "b",

    "q43_q": "What is a 'Fact-Check Bureau'?",
    "q43_a1": "A desk where facts are stored physically.",
    "q43_a2": "An organization dedicated to verifying claims made by public figures or in the news.",
    "q43_a3": "A department in a library for reference books.",
    "q43_c": "b",

    "q44_q": "What is 'Fabricated Content'?",
    "q44_a1": "A news story about the fabric and textile industry.",
    "q44_a2": "New content that is 100% false, designed to deceive and do harm.",
    "q44_a3": "Information that is translated into multiple languages.",
    "q44_c": "b",

    "q45_q": "What is 'Check-First' culture?",
    "q45_a1": "Always checking your notifications first thing in the morning.",
    "q45_a2": "The habit of verifying information before believing or sharing it.",
    "q45_a3": "Checking your bank balance before buying an app.",
    "q45_c": "b",

    "q46_q": "What is 'Source Attribution'?",
    "q46_a1": "A way to name a file on your computer.",
    "q46_a2": "Identifying where information came from so its credibility can be verified.",
    "q46_a3": "The font style used in the main body of a news article.",
    "q46_c": "b",

    "q47_q": "What is 'Metadata' in an image?",
    "q47_a1": "The color of the pixels in the image.",
    "q47_a2": "Hidden data about the file, like the camera model, date taken, and sometimes location.",
    "q47_a3": "A small caption describing the image.",
    "q47_c": "b",

    "q48_q": "What is a 'Logical Fallacy'?",
    "q48_a1": "A mistake in a computer's math calculation.",
    "q48_a2": "An error in reasoning that makes an argument invalid.",
    "q48_a3": "A philosophical term for a dream.",
    "q48_c": "b",

    "q49_q": "What is 'Evidence-Based' reporting?",
    "q49_a1": "Reporting that is based on how many people believe it.",
    "q49_a2": "Reporting that relies on facts, data, and verifiable proofs.",
    "q49_a3": "A story written after seeing someone post about it on social media.",
    "q49_c": "b",

    "q50_q": "What is the ultimate goal of DrishtiX?",
    "q50_a1": "To become the most popular social media site.",
    "q50_a2": "To empower users with tools and knowledge to combat misinformation online.",
    "q50_a3": "To provide a way to chat with friends in multiple languages.",
    "q50_c": "b"
}

data.update(quiz_q)

with open(EN_PATH, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("en.json updated with 50 quiz questions.")
