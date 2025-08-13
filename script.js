// --- Firebase and Gemini Initialization ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAI, getGenerativeModel } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-ai.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhWdltKbJScRhhCW3FW1Hv1aza5U2Eb6Y",
    authDomain: "aibaitap-lien.firebaseapp.com",
    projectId: "aibaitap-lien",
    storageBucket: "aibaitap-lien.appspot.com",
    messagingSenderId: "956841572004",
    appId: "1:956841572004:web:f665c7de5a7ae1312c9831"
};

const app = initializeApp(firebaseConfig);
let model;
const GEMINI_MODEL_NAME = "gemini-2.5-flash";
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// --- DOM Elements ---
const controlsView = document.getElementById('controls-view');
const exerciseView = document.getElementById('exercise-view');
const summaryView = document.getElementById('summary-view');
const historyView = document.getElementById('history-view');
const writingView = document.getElementById('writing-view');
const conversationView = document.getElementById('conversation-view');
const learningView = document.getElementById('learning-view');

const authHeader = document.getElementById('auth-header');
const loginContainer = document.getElementById('login-container');
const loginBtn = document.getElementById('login-btn');
const userInfo = document.getElementById('user-info');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const logoutBtn = document.getElementById('logout-btn');
const historyBtn = document.getElementById('history-btn');

const backToMainBtn = document.getElementById('back-to-main-btn');
const historyLoadingSpinner = document.getElementById('history-loading-spinner');

const practiceTab = document.getElementById('practice-tab');
const interactiveTab = document.getElementById('interactive-tab');
const practiceHistoryContent = document.getElementById('practice-history-content');
const interactiveHistoryContent = document.getElementById('interactive-history-content');
const practiceHistoryList = document.getElementById('practice-history-list');
const interactiveHistoryList = document.getElementById('interactive-history-list');
const noPracticeHistory = document.getElementById('no-practice-history');
const noInteractiveHistory = document.getElementById('no-interactive-history');

const lessonModal = document.getElementById('lesson-modal');
const lessonTitle = document.getElementById('lesson-title');
const lessonContent = document.getElementById('lesson-content');
const closeLessonModal = document.getElementById('close-lesson-modal');

const modeSelect = document.getElementById('mode-select');
const modePracticeBtn = document.getElementById('mode-practice-btn');
const modeInteractiveBtn = document.getElementById('mode-interactive-btn');
const modeLearningBtn = document.getElementById('mode-learning-btn');
const subjectSelect = document.getElementById('subject-select');
const skillSelectContainer = document.getElementById('skill-select-container');
const skillSelect = document.getElementById('skill-select');
const mathLevelSelectContainer = document.getElementById('math-level-select-container');
const mathLevelSelect = document.getElementById('math-level-select');
const levelSelectContainer = document.getElementById('level-select-container');
const levelSelect = document.getElementById('level-select'); 
const dynamicControlsContainer = document.getElementById('dynamic-controls-container');
const generateButton = document.getElementById('generateButton');
const buttonText = document.getElementById('buttonText');
const buttonSpinner = document.getElementById('buttonSpinner');
const statusMessage = document.getElementById('statusMessage');

// Exercise View Elements
const audioPlayerContainer = document.getElementById('audio-player-container');
const playAudioBtn = document.getElementById('play-audio-btn');
const audioStatus = document.getElementById('audio-status');
const showTranscriptBtn = document.getElementById('show-transcript-btn');
const transcriptContainer = document.getElementById('transcript-container');
const practiceModeContainer = document.getElementById('practice-mode-container');
const exerciseListContainer = document.getElementById('exercise-list-container');
const practiceFooter = document.getElementById('practice-footer');
const checkAllAnswersButton = document.getElementById('checkAllAnswersButton');
const practiceActionsContainer = document.getElementById('practice-actions-container');
const restartPracticeBtn = document.getElementById('restart-practice-btn');
const changeSettingsFromPracticeBtn = document.getElementById('change-settings-from-practice-btn');
const interactiveModeContainer = document.getElementById('interactive-mode-container');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const interactiveQuestionHost = document.getElementById('interactive-question-host');
const interactiveFooter = document.getElementById('interactive-footer');
const paperSubject = document.getElementById('paper-subject');
const paperDetails = document.getElementById('paper-details');
const paperScore = document.getElementById('paper-score');

// Writing View Elements
const writingTopic = document.getElementById('writing-topic');
const writingInput = document.getElementById('writing-input');
const wordCount = document.getElementById('word-count');
const getFeedbackBtn = document.getElementById('get-feedback-btn');
const writingFeedbackContainer = document.getElementById('writing-feedback-container');
const writingActionsContainer = document.getElementById('writing-actions-container');
const restartWritingBtn = document.getElementById('restart-writing-btn');
const changeSettingsFromWritingBtn = document.getElementById('change-settings-from-writing-btn');

// Conversation View Elements
const conversationTopic = document.getElementById('conversation-topic');
const conversationLog = document.getElementById('conversation-log');
const conversationInputArea = document.getElementById('conversation-input-area');
const conversationTextInput = document.getElementById('conversation-text-input');
const sendTextBtn = document.getElementById('send-text-btn');
const endConversationBtn = document.getElementById('end-conversation-btn');

// Learning View Elements
const learningPathTitle = document.getElementById('learning-path-title');
const learningPathSubject = document.getElementById('learning-path-subject');
const learningContent = document.getElementById('learning-content');
const changeSettingsFromLearningBtn = document.getElementById('change-settings-from-learning-btn');

// Summary View Elements
const summaryText = document.getElementById('summary-text');
const summaryProgressBar = document.getElementById('summary-progress-bar');
const summarySaveStatus = document.getElementById('summary-save-status');
const restartQuizBtn = document.getElementById('restart-quiz-btn');
const changeSettingsBtn = document.getElementById('change-settings-btn');


// --- State ---
let allQuestions = [];
let currentQuizData = {}; 
let currentQuestionIndex = 0;
let score = 0;
let generatedExercisesCache = [];
let currentUser = null;
let currentTestResult = {};
let sessionResults = [];
let conversationHistory = [];
const synth = window.speechSynthesis;
let audioState = { utterance: null, isPaused: false };
let completedTopics = []; // For learning mode

// --- System Prompt for Learning Mode ---
const LEARNING_MODE_SYSTEM_PROMPT = `**CHỈ THỊ HỆ THỐNG - CHẾ ĐỘ HỌC TẬP ĐANG BẬT**
Bạn là một người hướng dẫn học tập chuyên nghiệp, có khả năng chia nhỏ các chủ đề phức tạp thành một lộ trình học tập rõ ràng.
1.  **Tạo Lộ trình:** Khi người dùng yêu cầu một chủ đề, hãy trả lời bằng một danh sách các bài học có cấu trúc (dùng Markdown với gạch đầu dòng).
2.  **Tạo Liên kết Tương tác:** Đối với MỖI BÀI HỌC trong lộ trình, bạn PHẢI định dạng nó theo cú pháp đặc biệt sau: \`[Tên bài học]{"prompt":"Yêu cầu chi tiết để bạn giảng giải về bài học này"}\`. Prompt phải chi tiết và bằng tiếng Việt.
`;

// --- Utility Functions ---
function sanitizeString(str) {
    if (!str) return '';
    return str.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
}

function extractAndParseJson(rawText) {
    const regex = /```json\s*([\s\S]*?)\s*```/;
    const match = rawText.match(regex);
    let jsonString = (match && match[1]) ? match[1] : rawText;
    jsonString = jsonString.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
    try { return JSON.parse(jsonString); } 
    catch (error) { console.error("JSON Parse Error:", error, "String:", jsonString); return null; }
}

// --- AI TOOLBOX ---
const tools = [{ functionDeclarations: [ { name: 'createMultipleChoiceQuestion', description: 'Tạo một câu hỏi trắc nghiệm.', parameters: { type: 'OBJECT', properties: { question: { type: 'STRING' }, options: { type: 'ARRAY', items: { type: 'STRING' } }, correctAnswerIndex: { type: 'NUMBER' }, explanation: { type: 'STRING', description: 'Giải thích ngắn gọn tại sao đáp án lại đúng.' } }, required: ['question', 'options', 'correctAnswerIndex', 'explanation'] } }, { name: 'createFillInTheBlankQuestion', description: 'Tạo một câu hỏi điền vào chỗ trống.', parameters: { type: 'OBJECT', properties: { question: { type: 'STRING' }, correctAnswer: { type: 'STRING' }, explanation: { type: 'STRING', description: 'Giải thích ngắn gọn tại sao đáp án lại đúng.' } }, required: ['question', 'correctAnswer', 'explanation'] } }, { name: 'createTrueFalseQuestion', description: 'Tạo một câu hỏi dạng Đúng hoặc Sai.', parameters: { type: 'OBJECT', properties: { statement: { type: 'STRING' }, isCorrect: { type: 'BOOLEAN' }, explanation: { type: 'STRING', description: 'Giải thích ngắn gọn tại sao đáp án lại đúng.' } }, required: ['statement', 'isCorrect', 'explanation'] } }, { name: 'createMatchingQuestion', description: 'Tạo một bài tập nối cột.', parameters: { type: 'OBJECT', properties: { title: { type: 'STRING' }, columnA: { type: 'ARRAY', items: { type: 'STRING' } }, columnB: { type: 'ARRAY', items: { type: 'STRING' } } }, required: ['title', 'columnA', 'columnB'] } }, { name: 'createSortingQuestion', description: 'Tạo một bài tập sắp xếp các mục theo đúng thứ tự.', parameters: { type: 'OBJECT', properties: { title: { type: 'STRING' }, items: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Mảng các mục đã ở đúng thứ tự.' } }, required: ['title', 'items'] } }, { name: 'createShortAnswerQuestion', description: 'Tạo một câu hỏi tự luận ngắn.', parameters: { type: 'OBJECT', properties: { question: { type: 'STRING' }, suggestedAnswer: { type: 'STRING' } }, required: ['question', 'suggestedAnswer'] } }, { name: 'createEnglishReadingComprehensionExercise', description: 'Tạo một bài tập đọc hiểu Tiếng Anh hoàn chỉnh.', parameters: { type: 'OBJECT', properties: { passage: { type: 'STRING' }, questions: { type: 'ARRAY', items: { type: 'OBJECT', properties: { questionType: { type: 'STRING', enum: ['mcq', 'short_answer'] }, questionText: { type: 'STRING' }, options: { type: 'ARRAY', items: { type: 'STRING' } }, correctAnswer: { type: 'STRING' }, explanation: { type: 'STRING', description: 'Giải thích ngắn gọn tại sao đáp án lại đúng.' } }, required: ['questionType', 'questionText', 'correctAnswer'] } } }, required: ['passage', 'questions'] } } ] }];

// --- PROMPTS ---
function getListeningPrompt(level, topic, count, length) { 
    const lengthMap = { short: '50-80 words', medium: '90-120 words', long: '130-160 words' };
    return `You are an expert English teacher. Create a listening comprehension quiz. 1. Generate one monologue or dialogue of about ${lengthMap[length]}. The topic is "${topic}" and for a ${level} CEFR level learner. 2. Based on the script, generate ${count} multiple-choice questions. 3. For each question, provide one correct answer, three plausible distractors, and a brief, helpful explanation IN VIETNAMESE. The "answer" field MUST be the full text of the correct option. You MUST wrap your entire response in a 'json' markdown code block. The structure MUST be a valid JSON object: \`\`\`json\n{ "script": "...", "questions": [ { "question": "...", "options": ["..."], "answer": "...", "explanation": "..." } ] }\n\`\`\``; 
}
function getWritingTopicPrompt(level, topic) { 
    return `You are an English teacher. Generate a single, engaging writing topic for an English learner at the ${level} CEFR level. The topic should be related to "${topic}". The topic should be a question or a statement to respond to. Provide only the topic text, without any extra labels or quotation marks. Example: "Describe your favorite kind of technology and explain why you like it."`; 
}
function getWritingFeedbackPrompt(level, topic, userText) { 
    return `You are an expert English writing evaluator. A student at the ${level} CEFR level has written the following text about the topic "${topic}". IMPORTANT: The 'correctedTextHTML' field in your response MUST be a direct correction of the student's provided text below, using "<del>" and "<ins>" tags. Do not invent a new text. Student's text: """ ${userText} """ Please provide feedback in Vietnamese. You MUST wrap your entire response in a 'json' markdown code block. The JSON object must have the following structure: 1. "overallFeedback": A general comment in Vietnamese (2-3 sentences) on the text's content, clarity, and effort. 2. "score": An integer score from 0 to 100. 3. "correctedTextHTML": The student's original text with corrections applied. 4. "detailedFeedback": An array of objects, where each object explains a specific mistake. Each object should have: "type", "mistake", "correction", "explanation". Example of the required JSON output: \`\`\`json\n{ "overallFeedback": "...", "score": 75, "correctedTextHTML": "...", "detailedFeedback": [ { "type": "Grammar", "mistake": "...", "correction": "...", "explanation": "..." } ] }\n\`\`\``; 
}
function getConversationStartPrompt(topic) { 
    return `You are a friendly, encouraging English conversation partner. Start a conversation with the user about the topic: "${topic}". Ask a simple, open-ended question to begin. Keep your opening short and natural.`; 
}
function getConversationFollowUpPrompt(history, topic) { 
    return `You are a friendly, encouraging English conversation partner. The topic of conversation is "${topic}". Here is the conversation history so far:\n${history}\n\nBased on the user's last message, ask a natural, engaging follow-up question to keep the conversation going. Do not repeat questions. Keep your responses concise and friendly.`; 
}
function getConversationFeedbackPrompt(history, topic, level) { 
    return `You are an expert English teacher. A student at the ${level} CEFR level has just completed a practice conversation with you about "${topic}". Your goal is to provide constructive, encouraging feedback. Here is the full transcript:\n${history}\n\nPlease provide your feedback in Vietnamese. You MUST wrap your entire response in a 'json' markdown code block. The JSON object must have the following structure: 1. "overallFeedback": A friendly, encouraging summary (2-3 sentences) of their performance, highlighting what they did well. 2. "strengths": An array of 1-2 strings, listing positive points (e.g., "Sử dụng tốt từ vựng về du lịch", "Phát âm rõ ràng các âm cuối"). 3. "areasForImprovement": An array of objects, each highlighting a specific area for improvement. Each object should have: "type" (e.g., "Ngữ pháp", "Lựa chọn từ", "Lưu loát"), "original" (the user's original phrase), "suggestion" (a better way to phrase it), and "explanation" (a short, clear explanation in Vietnamese). Focus on the most important points, don't overwhelm the user. Example of the required JSON output: \`\`\`json { "overallFeedback": "...", "strengths": ["..."], "areasForImprovement": [ { "type": "Ngữ pháp", "original": "I go to the cinema yesterday.", "suggestion": "I went to the cinema yesterday.", "explanation": "Khi nói về quá khứ, chúng ta dùng thì quá khứ đơn 'went' thay vì 'go'." } ] } \`\`\``; 
}

function getReinforcementPrompt(questionArgs, userAnswer) {
    const questionText = questionArgs.question || questionArgs.statement || questionArgs.title;
    const correctAnswer = questionArgs.correctAnswer || (questionArgs.options ? questionArgs.options[questionArgs.correctAnswerIndex] : 'N/A');
    const currentSubject = subjectSelect.value;

    let prompt;
    if (currentSubject === 'english') {
        prompt = `Bạn là một gia sư AI tận tình. Một học sinh vừa trả lời SAI một câu hỏi. Hãy cung cấp một bài học **bằng tiếng Việt** để giúp họ hiểu rõ lỗi sai và củng cố kiến thức. Thông tin: - Câu hỏi: "${questionText}" - Câu trả lời sai của học sinh: "${userAnswer}" - Đáp án đúng: "${correctAnswer}". Câu trả lời của bạn BẮT BUỘC phải là một khối JSON được bọc trong markdown, có cấu trúc: { "conceptTitle": "...", "mistakeAnalysis": "...", "conceptExplanation": "...", "examples": [{ "en": "...", "vi": "..." }], "practiceTip": "..." } QUAN TRỌNG: Bên trong các trường JSON "mistakeAnalysis", "conceptExplanation", và "practiceTip", bạn CÓ THỂ sử dụng Markdown (như **in đậm** hoặc danh sách) để định dạng cho dễ đọc.`;
    } else {
        prompt = `Bạn là một gia sư AI tận tình. Một học sinh vừa trả lời SAI một câu hỏi. Hãy cung cấp một bài học **bằng tiếng Việt** để giúp họ hiểu rõ lỗi sai và củng cố kiến thức. Thông tin: - Câu hỏi: "${questionText}" - Câu trả lời sai của học sinh: "${userAnswer}" - Đáp án đúng: "${correctAnswer}". Câu trả lời của bạn BẮT BUỘC phải là một khối JSON được bọc trong markdown, có cấu trúc: { "conceptTitle": "...", "mistakeAnalysis": "...", "conceptExplanation": "...", "examples": ["...", "..."], "practiceTip": "..." } QUAN TRỌNG: Bên trong các trường JSON "mistakeAnalysis", "conceptExplanation", và "practiceTip", bạn CÓ THỂ sử dụng Markdown (như **in đậm** hoặc danh sách) để định dạng cho dễ đọc.`;
    }
    return prompt;
}

function getExpansionPrompt(questionArgs) {
     const questionText = questionArgs.question || questionArgs.statement || questionArgs.title;
    const currentSubject = subjectSelect.value;
    
    let prompt;
    if (currentSubject === 'english') {
        prompt = `Bạn là một gia sư AI thân thiện. Một học sinh vừa trả lời đúng câu hỏi sau: "${questionText}". Hãy khen ngợi họ và cung cấp một bài học mở rộng ngắn gọn **bằng tiếng Việt** để giúp họ hiểu sâu hơn về chủ đề liên quan. Câu trả lời của bạn BẮT BUỘC phải là một khối JSON được bọc trong markdown, có cấu trúc: { "conceptTitle": "...", "conceptExplanation": "...", "examples": [{ "en": "...", "vi": "..." }], "practiceTip": "..." } QUAN TRỌNG: Bên trong các trường JSON "conceptExplanation" và "practiceTip", bạn CÓ THỂ sử dụng Markdown (như **in đậm** hoặc danh sách) để định dạng cho dễ đọc.`;
    } else {
        prompt = `Bạn là một gia sư AI thân thiện. Một học sinh vừa trả lời đúng câu hỏi sau: "${questionText}". Hãy khen ngợi họ và cung cấp một bài học mở rộng ngắn gọn **bằng tiếng Việt** để giúp họ hiểu sâu hơn về chủ đề liên quan. Câu trả lời của bạn BẮT BUỘC phải là một khối JSON được bọc trong markdown, có cấu trúc: { "conceptTitle": "...", "conceptExplanation": "...", "examples": ["...", "..."], "practiceTip": "..." } QUAN TRỌNG: Bên trong các trường JSON "conceptExplanation" và "practiceTip", bạn CÓ THỂ sử dụng Markdown (như **in đậm** hoặc danh sách) để định dạng cho dễ đọc.`;
    }
    return prompt;
}

// --- TEMPLATES ---
const commonExerciseTypesTemplate = `
    <fieldset>
        <legend class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Số lượng cho mỗi dạng bài:</legend>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
             <div><label for="mcqCount" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Trắc nghiệm</label><input type="number" id="mcqCount" value="1" min="0" class="input-base p-2 text-center"></div>
            <div><label for="fibCount" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Điền từ</label><input type="number" id="fibCount" value="1" min="0" class="input-base p-2 text-center"></div>
             <div><label for="tfCount" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Đúng/Sai</label><input type="number" id="tfCount" value="1" min="0" class="input-base p-2 text-center"></div>
            <div><label for="matchingCount" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Nối cột</label><input type="number" id="matchingCount" value="0" min="0" class="input-base p-2 text-center"></div>
            <div><label for="sortingCount" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Sắp xếp</label><input type="number" id="sortingCount" value="0" min="0" class="input-base p-2 text-center"></div>
            <div><label for="saqCount" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Tự luận ngắn</label><input type="number" id="saqCount" value="0" min="0" class="input-base p-2 text-center"></div>
        </div>
    </fieldset>
`;
const controlTemplates = {
    general: `<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center"><i data-lucide="edit-3" class="w-5 h-5 mr-3 text-indigo-500"></i>2. Tùy chỉnh nội dung</h2><div><label for="topicInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nhập chủ đề hoặc nội dung</label><textarea id="topicInput" rows="4" class="input-base" placeholder="Ví dụ: Lịch sử Việt Nam giai đoạn 1945-1954..."></textarea></div>${commonExerciseTypesTemplate}`,
    english_reading: `<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center"><i data-lucide="book-open" class="w-5 h-5 mr-3 text-indigo-500"></i>2. Tùy chỉnh bài đọc</h2><div><label for="topicInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chủ đề bài đọc</label><input type="text" id="topicInput" class="input-base" placeholder="Ví dụ: The future of renewable energy"></div><fieldset class="mt-4"><legend class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Cấu hình bài đọc hiểu:</legend><div class="grid grid-cols-1 md:grid-cols-3 gap-4"><div class="md:col-span-1"><label for="passageLength" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Độ dài</label><select id="passageLength" class="input-base p-2"><option value="short">Ngắn (~150 từ)</option><option value="medium" selected>Vừa (~250 từ)</option><option value="long">Dài (~400 từ)</option></select></div><div class="md:col-span-1"><label for="readingMcqCount" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Câu trắc nghiệm</label><input type="number" id="readingMcqCount" value="2" min="0" class="input-base p-2 text-center"></div><div class="md:col-span-1"><label for="readingSaqCount" class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Câu tự luận</label><input type="number" id="readingSaqCount" value="1" min="0" class="input-base p-2 text-center"></div></div></fieldset>`,
    english_grammar: `<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center"><i data-lucide="spell-check-2" class="w-5 h-5 mr-3 text-indigo-500"></i>2. Tùy chỉnh ngữ pháp</h2><div><label for="topicInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chủ điểm ngữ pháp</label><input type="text" id="topicInput" class="input-base" placeholder="Ví dụ: Present Perfect Tense, Passive Voice..."></div>${commonExerciseTypesTemplate}`,
    english_vocabulary: `<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center"><i data-lucide="book-a" class="w-5 h-5 mr-3 text-indigo-500"></i>2. Tùy chỉnh từ vựng</h2><div><label for="topicInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chủ đề từ vựng</label><input type="text" id="topicInput" class="input-base" placeholder="Ví dụ: Travel, Technology, Environment..."></div>${commonExerciseTypesTemplate}`,
    english_listening: `<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center"><i data-lucide="headphones" class="w-5 h-5 mr-3 text-indigo-500"></i>2. Tùy chỉnh bài nghe</h2><div><label for="topicInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chủ đề bài nghe</label><input type="text" id="topicInput" class="input-base" placeholder="Ví dụ: A conversation at a restaurant"></div><div class="grid grid-cols-2 gap-4 mt-4"><fieldset><legend class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Độ dài</legend><select id="scriptLength" class="input-base p-2"><option value="short">Ngắn</option><option value="medium" selected>Vừa</option><option value="long">Dài</option></select></fieldset><fieldset><legend class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Số câu hỏi</legend><input type="number" id="questionCount" value="3" min="1" max="5" class="input-base p-2 text-center"></fieldset></div>`,
    english_writing: `<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center"><i data-lucide="file-pen-line" class="w-5 h-5 mr-3 text-indigo-500"></i>2. Tùy chỉnh bài viết</h2><div><label for="topicInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chủ đề bài viết</label><input type="text" id="topicInput" class="input-base" placeholder="Ví dụ: The advantages of remote work"></div>`,
    english_conversation: `<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center"><i data-lucide="messages-square" class="w-5 h-5 mr-3 text-indigo-500"></i>2. Tùy chỉnh hội thoại</h2><div><label for="topicInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chủ đề hội thoại</label><input type="text" id="topicInput" class="input-base" placeholder="Ví dụ: Your last vacation"></div>`,
    mathematics: `<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center"><i data-lucide="calculator" class="w-5 h-5 mr-3 text-indigo-500"></i>2. Tùy chỉnh nội dung</h2><div><label for="topicInput" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chủ đề toán học</label><textarea id="topicInput" rows="4" class="input-base" placeholder="Ví dụ: Phương trình bậc hai, Tích phân, Hình học không gian..."></textarea></div>${commonExerciseTypesTemplate}`
};

// --- CORE LOGIC ---
function switchView(view) {
    controlsView.classList.add('hidden');
    exerciseView.classList.add('hidden');
    summaryView.classList.add('hidden');
    historyView.classList.add('hidden');
    writingView.classList.add('hidden');
    conversationView.classList.add('hidden');
    learningView.classList.add('hidden');
    authHeader.classList.remove('hidden');

    if (view === 'controls') controlsView.classList.remove('hidden');
    if (view === 'exercise') exerciseView.classList.remove('hidden');
    if (view === 'summary') summaryView.classList.remove('hidden');
    if (view === 'history') historyView.classList.remove('hidden');
    if (view === 'writing') writingView.classList.remove('hidden');
    if (view === 'conversation') conversationView.classList.remove('hidden');
    if (view === 'learning') learningView.classList.remove('hidden');
}

function resetQuizState() {
    allQuestions = [];
    currentQuizData = {};
    currentQuestionIndex = 0;
    score = 0;
    sessionResults = [];
    exerciseListContainer.innerHTML = '';
    interactiveQuestionHost.innerHTML = '';
    interactiveFooter.innerHTML = '';
    document.getElementById('interactive-passage-host').innerHTML = '';
    learningContent.innerHTML = '';
    completedTopics = [];
    paperScore.classList.add('hidden');
    if (practiceActionsContainer) practiceActionsContainer.classList.add('hidden');
    if (checkAllAnswersButton) checkAllAnswersButton.style.display = 'block';
    summarySaveStatus.textContent = '';
    conversationHistory = [];
    conversationLog.innerHTML = '';
}

function showError(message) {
    alert(message); // Using a temporary alert for the purpose of this demo
}

// --- NEW: Functions for reinforcement and expansion ---
async function requestReinforcement(questionArgs, userAnswer) {
    // Placeholder function to simulate the request
    lessonModal.classList.add('active');
    lessonTitle.textContent = "Củng cố kiến thức";
    lessonContent.innerHTML = '<div class="spinner mx-auto"></div>';
    
    const prompt = getReinforcementPrompt(questionArgs, userAnswer);
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const lessonData = extractAndParseJson(response.text());

        if (lessonData) {
            lessonContent.innerHTML = `
                <h4 class="font-bold text-lg mb-2 text-purple-600 dark:text-purple-400">${lessonData.conceptTitle}</h4>
                <div class="prose dark:prose-invert">
                    <p>${lessonData.mistakeAnalysis}</p>
                    <p>${lessonData.conceptExplanation}</p>
                    <h5 class="font-semibold mt-4 mb-2">Ví dụ:</h5>
                    <ul class="list-disc list-inside">
                        ${lessonData.examples.map(ex => `<li>${typeof ex === 'object' ? `${ex.en} - ${ex.vi}` : ex}</li>`).join('')}
                    </ul>
                    <h5 class="font-semibold mt-4 mb-2">Mẹo luyện tập:</h5>
                    <p>${lessonData.practiceTip}</p>
                </div>
            `;
            renderMath(lessonContent);
        } else {
            lessonContent.innerHTML = `<p class="text-red-500">Lỗi: Không thể nhận phản hồi củng cố kiến thức từ AI.</p>`;
        }
    } catch (error) {
        console.error("Lỗi khi yêu cầu củng cố:", error);
        lessonContent.innerHTML = `<p class="text-red-500">Lỗi: Không thể kết nối với AI để củng cố kiến thức.</p>`;
    }
}

async function requestExpandedKnowledge(questionArgs) {
     // Placeholder function to simulate the request
    lessonModal.classList.add('active');
    lessonTitle.textContent = "Mở rộng kiến thức";
    lessonContent.innerHTML = '<div class="spinner mx-auto"></div>';
    
    const prompt = getExpansionPrompt(questionArgs);
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const lessonData = extractAndParseJson(response.text());
        
        if (lessonData) {
             lessonContent.innerHTML = `
                <h4 class="font-bold text-lg mb-2 text-teal-600 dark:text-teal-400">${lessonData.conceptTitle}</h4>
                <div class="prose dark:prose-invert">
                     <p>${lessonData.conceptExplanation}</p>
                    <h5 class="font-semibold mt-4 mb-2">Ví dụ:</h5>
                    <ul class="list-disc list-inside">
                        ${lessonData.examples.map(ex => `<li>${typeof ex === 'object' ? `${ex.en} - ${ex.vi}` : ex}</li>`).join('')}
                    </ul>
                    <h5 class="font-semibold mt-4 mb-2">Mẹo luyện tập:</h5>
                    <p>${lessonData.practiceTip}</p>
                </div>
            `;
            renderMath(lessonContent);
        } else {
            lessonContent.innerHTML = `<p class="text-red-500">Lỗi: Không thể nhận phản hồi mở rộng kiến thức từ AI.</p>`;
        }
    } catch (error) {
         console.error("Lỗi khi yêu cầu mở rộng:", error);
         lessonContent.innerHTML = `<p class="text-red-500">Lỗi: Không thể kết nối với AI để mở rộng kiến thức.</p>`;
    }
}

// Main controller function
async function startPractice() {
    const mode = modeSelect.value;
    if (mode === 'learning') {
        await startLearningSession();
        return;
    }

    const subject = subjectSelect.value;
    if (subject === 'english') {
        const skill = skillSelect.value;
        switch(skill) {
            case 'listening':
                await startListeningPractice();
                break;
            case 'writing':
                await startWritingPractice();
                break;
            case 'conversation':
                await startConversationPractice();
                break;
            default:
                await generateExercises();
        }
    } else {
        await generateExercises();
    }
}

// --- LISTENING FEATURE ---
async function startListeningPractice() {
    if (!model) { updateStatus('error', "Mô hình AI chưa được khởi tạo."); return; }
    setLoadingState(true);
    resetQuizState();

    const topic = document.getElementById('topicInput').value.trim();
    const level = levelSelect.value;
    const count = document.getElementById('questionCount').value;
    const length = document.getElementById('scriptLength').value;

    if (!topic) {
        updateStatus('error', "Vui lòng nhập chủ đề cho bài nghe.");
        setLoadingState(false);
        return;
    }

    currentQuizData = { type: 'listening', topic, level, count, length };
    
    try {
        const prompt = getListeningPrompt(level, topic, count, length);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const parsedData = extractAndParseJson(response.text());

        if (!parsedData || !parsedData.script || !parsedData.questions) {
            throw new Error("AI không trả về dữ liệu bài nghe hợp lệ.");
        }
        
        currentQuizData.raw = parsedData;
        generatedExercisesCache = parsedData.questions;
        
        switchView('exercise');
        renderListeningQuiz();

    } catch (error) {
        console.error("Error generating listening quiz:", error);
        updateStatus('error', `Đã có lỗi xảy ra: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
}

function renderListeningQuiz() {
    audioPlayerContainer.classList.remove('hidden');
    transcriptContainer.classList.add('hidden');
    transcriptContainer.textContent = currentQuizData.raw.script;
    showTranscriptBtn.textContent = 'Hiện lời thoại';
    setupAudioPlayer();

    if (modeSelect.value === 'practice') {
        practiceModeContainer.classList.remove('hidden');
        interactiveModeContainer.classList.add('hidden');
        renderPracticeMode(generatedExercisesCache);
    } else {
        practiceModeContainer.classList.add('hidden');
        interactiveModeContainer.classList.remove('hidden');
        renderInteractiveMode(generatedExercisesCache);
    }
}

// --- WRITING FEATURE ---
async function startWritingPractice() {
    if (!model) { updateStatus('error', "Mô hình AI chưa được khởi tạo."); return; }
    setLoadingState(true);
    resetQuizState();

    const topic = document.getElementById('topicInput').value.trim();
    const level = levelSelect.value;
    if (!topic) {
        updateStatus('error', "Vui lòng nhập chủ đề bài viết.");
        setLoadingState(false);
        return;
    }
    currentQuizData = { type: 'writing', topic, level };

    try {
        const prompt = getWritingTopicPrompt(level, topic);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const topicText = response.text();

        writingTopic.textContent = topicText;
        writingInput.value = '';
        wordCount.textContent = '0 từ';
        writingFeedbackContainer.innerHTML = '';
        getFeedbackBtn.disabled = false;
        writingInput.disabled = false;
        writingActionsContainer.classList.add('hidden');
        
        switchView('writing');
    } catch (error) {
        updateStatus('error', `Không thể tạo chủ đề luyện viết. Lỗi: ${error.message}.`);
    } finally {
        setLoadingState(false);
    }
}

async function getWritingFeedback() {
    const userText = writingInput.value;
    if (userText.trim().split(/\s+/).length < 10) {
        // Use a custom modal or message box instead of alert
        showError("Vui lòng viết ít nhất 10 từ để nhận được phản hồi chất lượng.");
        return;
    }

    const button = getFeedbackBtn;
    const btnTextEl = button.querySelector('.btn-text');
    const spinnerEl = button.querySelector('.spinner');
    
    btnTextEl.textContent = 'AI đang phân tích...';
    spinnerEl.classList.remove('hidden'); 
    button.disabled = true; 
    writingInput.disabled = true;

    try {
        const { level, topic } = currentQuizData;
        const prompt = getWritingFeedbackPrompt(level, topic, userText);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedbackData = extractAndParseJson(response.text());

        if (!feedbackData) {
            throw new Error("AI không trả về phản hồi hợp lệ. Vui lòng thử lại.");
        }

        displayWritingFeedback(feedbackData);
        writingActionsContainer.classList.remove('hidden');

    } catch (error) {
        writingFeedbackContainer.innerHTML = `<p class="text-red-500">Lỗi: ${error.message}</p>`;
    } finally {
        btnTextEl.textContent = 'Nhận phản hồi từ AI';
        spinnerEl.classList.add('hidden'); 
    }
}

function displayWritingFeedback(data) {
    writingFeedbackContainer.innerHTML = `
        <div class="bg-sky-100 dark:bg-sky-900 border-2 border-sky-300 dark:border-sky-700 rounded-xl p-6 text-center">
            <p class="text-2xl font-semibold mb-2 text-sky-800 dark:text-sky-200">Điểm của bạn</p>
            <p class="text-6xl font-bold text-sky-600 dark:text-sky-400">${data.score} / 100</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Nhận xét chung</h4>
            <p class="text-gray-700 dark:text-gray-300">${data.overallFeedback}</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Bài viết đã sửa</h4>
            <p class="text-lg leading-relaxed">${data.correctedTextHTML}</p>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">Phân tích chi tiết</h4>
            <div class="space-y-3">
                ${(data.detailedFeedback || []).map(item => `
                    <div class="p-3 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                        <p class="font-semibold text-gray-700 dark:text-gray-300"><span class="text-sm font-bold py-0.5 px-2 rounded-full bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200">${item.type}</span></p>
                        <p class="text-red-600 dark:text-red-400 mt-2">Lỗi: <del>${item.mistake}</del></p>
                        <p class="text-green-600 dark:text-green-400">Sửa thành: <ins>${item.correction}</ins></p>
                        <p class="text-gray-600 dark:text-gray-400 mt-2 text-sm"><i>${item.explanation}</i></p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// --- CONVERSATION FEATURE ---
async function startConversationPractice() {
    if (!model) { updateStatus('error', "Mô hình AI chưa được khởi tạo."); return; }
    setLoadingState(true);
    resetQuizState();

    const topic = document.getElementById('topicInput').value.trim();
    const level = levelSelect.value;
    if (!topic) {
        updateStatus('error', "Vui lòng nhập chủ đề hội thoại.");
        setLoadingState(false);
        return;
    }
    currentQuizData = { type: 'conversation', topic, level };
    conversationTopic.textContent = `Chủ đề: ${topic}`;

    try {
        const prompt = getConversationStartPrompt(topic);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = response.text();
        
        addMessageToLog('ai', aiResponse);
        conversationHistory.push({ role: 'model', parts: [{ text: aiResponse }] });
        
        switchView('conversation');
    } catch (error) {
        updateStatus('error', `Không thể bắt đầu hội thoại. Lỗi: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
}

async function handleConversationResponse() {
    const userText = conversationTextInput.value.trim();
    if (!userText) return;

    addMessageToLog('user', userText);
    conversationHistory.push({ role: 'user', parts: [{ text: userText }] });
    conversationTextInput.value = '';
    conversationTextInput.disabled = true;
    sendTextBtn.disabled = true;

    try {
        const historyText = conversationHistory.map(h => `${h.role}: ${h.parts[0].text}`).join('\n');
        const prompt = getConversationFollowUpPrompt(historyText, currentQuizData.topic);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiResponse = response.text();

        addMessageToLog('ai', aiResponse);
        conversationHistory.push({ role: 'model', parts: [{ text: aiResponse }] });

    } catch (error) {
        addMessageToLog('ai', 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
        conversationTextInput.disabled = false;
        sendTextBtn.disabled = false;
        conversationTextInput.focus();
    }
}

async function endConversationAndGetFeedback() {
    endConversationBtn.disabled = true;
    
    lessonModal.classList.add('active');
    lessonTitle.textContent = "Đang phân tích hội thoại...";
    lessonContent.innerHTML = '<div class="spinner mx-auto"></div>';

    try {
        const historyText = conversationHistory.map(h => `${h.role === 'model' ? 'AI' : 'User'}: ${h.parts[0].text}`).join('\n');
        const prompt = getConversationFeedbackPrompt(historyText, currentQuizData.topic, currentQuizData.level);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const feedbackData = extractAndParseJson(response.text());

        if (!feedbackData) { throw new Error("AI không trả về nhận xét hợp lệ."); }
        
        displayConversationFeedback(feedbackData);

    } catch(error) {
        lessonContent.innerHTML = `<p class="text-red-500">Lỗi khi nhận phản hồi: ${error.message}</p>`;
    } finally {
        endConversationBtn.disabled = false;
    }
}

function addMessageToLog(sender, text) {
    const messageEl = document.createElement('div');
    messageEl.className = `bubble bubble-${sender}`;
    messageEl.textContent = text;
    conversationLog.appendChild(messageEl);
    conversationLog.scrollTop = conversationLog.scrollHeight;
}

function displayConversationFeedback(data) {
    lessonTitle.textContent = "Nhận xét buổi hội thoại";
    lessonTitle.className = "text-2xl font-bold text-indigo-600 dark:text-indigo-400";
    
    lessonContent.innerHTML = `
        <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 class="text-md font-bold text-gray-800 dark:text-gray-200 mb-2">Nhận xét chung</h4>
            <p class="text-gray-700 dark:text-gray-300">${data.overallFeedback}</p>
        </div>
        <div class="bg-green-100 dark:bg-green-900 p-3 rounded-lg border border-green-200 dark:border-green-700">
            <h4 class="text-md font-bold text-green-800 dark:text-green-200 mb-2">Điểm mạnh 👍</h4>
            <ul class="list-disc list-inside text-green-700 dark:text-green-300">
                ${(data.strengths || []).map(item => `<li>${item}</li>`).join('')}
            </ul>
        </div>
        <div class="bg-amber-100 dark:bg-amber-900 p-3 rounded-lg border border-amber-200 dark:border-amber-700">
            <h4 class="text-md font-bold text-amber-800 dark:text-amber-200 mb-3">Gợi ý cải thiện 💡</h4>
            <div class="space-y-3">
                ${(data.areasForImprovement || []).map(item => `
                    <div class="p-3 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <p class="font-semibold text-gray-700 dark:text-gray-300"><span class="text-sm font-bold py-0.5 px-2 rounded-full bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200">${item.type}</span></p>
                        <p class="text-red-600 dark:text-red-400 mt-2">Bạn đã nói: <del>${item.original}</del></p>
                        <p class="text-green-600 dark:text-green-400">Gợi ý: <ins>${item.suggestion}</ins></p>
                        <p class="text-gray-600 dark:text-gray-400 mt-2 text-sm"><i>${item.explanation}</i></p>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}


async function generateExercises() {
    if (!model) { updateStatus('error', "Mô hình AI chưa được khởi tạo."); return; }
    setLoadingState(true);
    
    resetQuizState();
    currentTestResult = {};

    const subjectText = subjectSelect.options[subjectSelect.selectedIndex].text;
    const topicInput = document.getElementById('topicInput');
    const topic = topicInput ? topicInput.value.trim() : '';

    if (!topic) { updateStatus('error', "Vui lòng nhập chủ đề."); setLoadingState(false); return; }

    currentTestResult.subject = subjectText;
    currentTestResult.topic = topic;
    currentTestResult.mode = modeSelect.value;

    let prompt = `Luôn cung cấp một giải thích (explanation) bằng tiếng Việt cho mỗi câu hỏi được tạo ra. Quan trọng: Đối với câu hỏi điền vào chỗ trống (createFillInTheBlankQuestion), hãy đảm bảo rằng chuỗi câu hỏi (thuộc tính 'question') luôn chứa chính xác ba dấu gạch dưới ('___') để chỉ định vị trí cần điền. Đối với các công thức toán học, hãy luôn sử dụng định dạng KaTeX.`;
    
    let counts = {};
    let requestParts = [];

    if (subjectSelect.value === 'english') {
        const skillText = skillSelect.options[skillSelect.selectedIndex].text;
        const levelText = levelSelect.options[levelSelect.selectedIndex].text;
        const level = levelSelect ? levelSelect.value : 'B1';
        currentTestResult.details = `Kỹ năng: ${skillText} - Trình độ: ${levelText}`;
        
        if (skillSelect.value === 'reading') {
             counts.readingMcq = document.getElementById('readingMcqCount').value;
             counts.readingSaq = document.getElementById('readingSaqCount').value;
             const passageLength = document.getElementById('passageLength').value;
             prompt += `Hãy sử dụng công cụ 'createEnglishReadingComprehensionExercise'. Tạo một bài đọc hiểu Tiếng Anh về chủ đề "${topic}" cho trình độ ${level}, dài ở mức '${passageLength}'. Bài đọc cần có ${counts.readingMcq} câu hỏi trắc nghiệm và ${counts.readingSaq} câu hỏi tự luận ngắn.`;
        } else { 
            prompt += `Tạo một bộ bài tập về chủ đề ${skillText} Tiếng Anh: "${topic}" cho trình độ ${level}. `;
        }
         paperDetails.textContent = `Chủ đề: ${topic} - Trình độ: ${levelText}`;

    } else if (subjectSelect.value === 'mathematics') {
        const difficulty = mathLevelSelect.value;
        const difficultyText = mathLevelSelect.options[mathLevelSelect.selectedIndex].text;
        currentTestResult.details = `Cấp độ: ${difficultyText}`;
        prompt += `Dựa vào chủ đề toán học sau: "${topic}" cho cấp độ "${difficulty}", `;
        paperDetails.textContent = `Chủ đề: ${topic} - Cấp độ: ${difficultyText}`;

    } else { 
        currentTestResult.details = "Chủ đề chung";
        prompt += `Dựa vào chủ đề sau: "${topic}", `;
        paperDetails.textContent = `Chủ đề: ${topic}`;
    }

    if (subjectSelect.value !== 'english' || (subjectSelect.value === 'english' && skillSelect.value !== 'reading')) {
        counts.mcq = document.getElementById('mcqCount').value;
        counts.fib = document.getElementById('fibCount').value;
        counts.tf = document.getElementById('tfCount').value;
        counts.matching = document.getElementById('matchingCount').value;
        counts.sorting = document.getElementById('sortingCount').value;
        counts.saq = document.getElementById('saqCount').value;

        if (counts.mcq > 0) requestParts.push(`${counts.mcq} câu trắc nghiệm`);
        if (counts.fib > 0) requestParts.push(`${counts.fib} câu điền từ`);
        if (counts.tf > 0) requestParts.push(`${counts.tf} câu Đúng/Sai`);
        if (counts.matching > 0) requestParts.push(`${counts.matching} bài nối cột`);
        if (counts.sorting > 0) requestParts.push(`${counts.sorting} bài sắp xếp`);
        if (counts.saq > 0) requestParts.push(`${counts.saq} câu tự luận ngắn`);

        if (requestParts.length > 0) {
             prompt += `Hãy sử dụng các công cụ được cung cấp để tạo ra: ${requestParts.join(', ')}.`;
        } else {
            updateStatus('error', 'Vui lòng chọn ít nhất một dạng bài tập.');
            setLoadingState(false);
            return;
        }
    }

    try {
        const result = await model.generateContent({
            contents: [{
                role: 'user',
                parts: [{ text: prompt }]
            }],
            tools: tools,
        });
        
        const functionCalls = result.response.functionCalls();
        
        if (!functionCalls || functionCalls.length === 0) {
            updateStatus('error', "AI không thể tạo bài tập. Vui lòng thử lại với chủ đề khác hoặc số lượng ít hơn.");
            return;
        }
        
        generatedExercisesCache = functionCalls;
        
        let flattenedItems = [];
        functionCalls.forEach(call => {
            if (call.name === 'createEnglishReadingComprehensionExercise') {
                flattenedItems.push({
                    name: 'reading_passage',
                    args: { passage: call.args.passage }
                });
                call.args.questions.forEach(subQ => {
                    let questionType, questionArgs;
                    if (subQ.questionType === 'mcq') {
                        const correctIndex = (subQ.options || []).indexOf(subQ.correctAnswer);
                        questionType = 'createMultipleChoiceQuestion';
                        questionArgs = {
                            question: subQ.questionText,
                            options: subQ.options,
                            correctAnswerIndex: correctIndex !== -1 ? correctIndex : 0,
                            explanation: subQ.explanation
                        };
                    } else if (subQ.questionType === 'short_answer') {
                        questionType = 'createShortAnswerQuestion';
                        questionArgs = {
                            question: subQ.questionText,
                            suggestedAnswer: subQ.correctAnswer
                        };
                    }
                    if (questionType) {
                        flattenedItems.push({ name: questionType, args: questionArgs });
                    }
                });
            } else {
                flattenedItems.push(call);
            }
        });
        allQuestions = flattenedItems;

        if (allQuestions.length === 0) {
             updateStatus('error', "Không có bài tập hợp lệ nào được tạo.");
             return;
        }

        paperSubject.innerHTML = `<strong>Môn học:</strong> ${subjectText}`;
        switchView('exercise');
        audioPlayerContainer.classList.add('hidden'); // Hide audio player for non-listening tasks

        if (modeSelect.value === 'practice') {
            practiceModeContainer.classList.remove('hidden');
            interactiveModeContainer.classList.add('hidden');
            renderPracticeMode(allQuestions);
        } else {
            practiceModeContainer.classList.add('hidden');
            interactiveModeContainer.classList.remove('hidden');
            renderInteractiveMode(allQuestions);
        }

    } catch (error) {
        console.error("Error calling API:", error);
        updateStatus('error', `Đã có lỗi xảy ra: ${error.message}`);
    } finally {
        setLoadingState(false);
    }
}

function renderMath(element = document.body) {
    if (window.renderMathInElement) {
        setTimeout(() => {
            renderMathInElement(element, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }, 0);
    }
}

// --- RENDERERS ---
const renderers = { 
    'createMultipleChoiceQuestion': renderMultipleChoice, 
    'createFillInTheBlankQuestion': renderFillInTheBlank, 
    'createTrueFalseQuestion': renderTrueFalse, 
    'createMatchingQuestion': renderMatching, 
    'createSortingQuestion': renderSorting, 
    'createShortAnswerQuestion': renderShortAnswer, 
    'reading_passage': renderReadingPassage
};

// Renders a learning mode quiz (with immediate feedback button)
const learningRenderers = {
    'multiple_choice': renderLearningMultipleChoice,
    'fill_in_the_blank': renderLearningFillInTheBlank,
    'short_answer': renderLearningShortAnswer,
    'flashcard': renderFlashcardQuiz,
    'drag_and_drop_matching': renderDragAndDropMatchingQuiz,
    'sentence_ordering': renderSentenceOrderingQuiz
};

function createQuestionItem(title, questionId) {
    const item = document.createElement('div');
    item.className = 'question-item';
    item.id = `q-${questionId}`;
    const titleDiv = document.createElement('div');
    titleDiv.className = 'font-bold text-lg mb-4 text-gray-800 dark:text-gray-200';
    if (title) {
        titleDiv.innerHTML = marked.parse(sanitizeString(title));
    }
    item.appendChild(titleDiv);
    return item;
}

function createFeedbackDiv(explanation) { 
    const div = document.createElement('div'); 
    div.className = 'feedback-box hidden'; 
    div.innerHTML = marked.parse(sanitizeString(explanation)); 
    return div; 
}

function renderReadingPassage(args, index) {
    const item = document.createElement('div');
    item.className = 'question-item';
    item.innerHTML = `
        <p class="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200"><strong>Đoạn văn:</strong> Đọc và trả lời các câu hỏi bên dưới.</p>
        <div class="p-4 my-4 bg-gray-100 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-justify leading-relaxed prose">${marked.parse(sanitizeString(args.passage))}</div>
        </div>
    `;
    return item;
}

function renderMultipleChoice(args, index) {
    const questionText = args.question;
    const title = `<strong>Câu ${index}:</strong> ${questionText}`;
    const item = createQuestionItem(title, index); item.dataset.type = 'mcq';
    
    const correctIndex = args.correctAnswerIndex ?? (Array.isArray(args.options) ? args.options.indexOf(args.answer) : null);
    item.dataset.correct = correctIndex;
    
    const optionsContainer = document.createElement('div'); optionsContainer.className = 'space-y-2';
    if (Array.isArray(args.options)) {
        args.options.forEach((option, optionIndex) => { 
            optionsContainer.innerHTML += `
                <label for="q${index}-opt${optionIndex}" class="option-label">
                    <input id="q${index}-opt${optionIndex}" name="q-${index}" type="radio" value="${optionIndex}" class="custom-radio">
                    <span class="text-gray-800 dark:text-gray-300">${String.fromCharCode(65 + optionIndex)}. ${sanitizeString(option)}</span>
                </label>`; 
        });
    } else if (args.options && typeof args.options === 'object') { // Handle object options for learning mode quiz
         Object.keys(args.options).forEach((key, optionIndex) => {
            const option = args.options[key];
            optionsContainer.innerHTML += `
                <label for="q${index}-opt${optionIndex}" class="option-label">
                    <input id="q${index}-opt${optionIndex}" name="q-${index}" type="radio" value="${key}" class="custom-radio">
                    <span class="text-gray-800 dark:text-gray-300">${key}. ${sanitizeString(option)}</span>
                </label>`; 
        });
        item.dataset.correct = args.answer; // In learning mode, answer is the key 'A', 'B' etc.
    }
    item.appendChild(optionsContainer);
    const explanation = args.explanation || `Đáp án đúng là lựa chọn ${args.answer}.`;
    item.appendChild(createFeedbackDiv(`<span class="font-bold">Giải thích:</span> ${explanation}`));
    return item;
}

function renderFillInTheBlank(args, index) {
    const title = `<strong>Câu ${index}:</strong>`;
    const item = createQuestionItem('', index);
    item.dataset.type = 'fib';
    
    // FIX: Handle both 'blanks' (array) and 'correctAnswer' (string)
    const correctAnswers = Array.isArray(args.blanks) ? args.blanks : [args.correctAnswer || ''];
    item.dataset.correct = JSON.stringify(correctAnswers.map(b => sanitizeString(b)));
    
    const questionP = item.querySelector('div'); 
    let questionText = sanitizeString(args.sentence || args.question);

    const renderInput = `<input type="text" class="input-fib inline-block w-48 mx-2" placeholder="...">`;

    questionText = questionText.replace(/\{\{BLANK\}\}|___/g, renderInput);
    questionP.innerHTML = `${title} ${marked.parse(questionText)}`;
    
    item.appendChild(createFeedbackDiv(`<span class="font-bold">Giải thích:</span> ${args.explanation || `Đáp án đúng là "${correctAnswers.join(', ')}".`}`));
    return item;
}

function renderTrueFalse(args, index) {
    const title = `<strong>Câu ${index}:</strong> ${sanitizeString(args.statement)}`;
    const item = createQuestionItem(title, index); item.dataset.type = 'tf'; item.dataset.correct = sanitizeString(String(args.isCorrect));
    item.innerHTML += `<div class="flex space-x-4 mt-4">
        <label for="q${index}-true" class="option-label w-1/2"><input id="q${index}-true" name="q-${index}" type="radio" value="true" class="custom-radio"><span class="text-gray-800 dark:text-gray-300">Đúng</span></label>
        <label for="q${index}-false" class="option-label w-1/2"><input id="q${index}-false" name="q-${index}" type="radio" value="false" class="custom-radio"><span class="text-gray-800 dark:text-gray-300">Sai</span></label>
    </div>`;
    item.appendChild(createFeedbackDiv(`<span class="font-bold">Giải thích:</span> ${args.explanation || `Đáp án đúng là ${args.isCorrect ? 'Đúng' : 'Sai'}.`}`));
    return item;
}

function renderMatching(args, index) {
    const title = `<strong>Câu ${index}:</strong> ${sanitizeString(args.title)}`;
    const item = createQuestionItem(title, index);
    item.dataset.type = 'matching';
    const correctMapping = args.columnA.map((itemA, idx) => ({ itemA: sanitizeString(itemA), itemB: sanitizeString(args.columnB[idx]) }));
    item.dataset.correct = JSON.stringify(correctMapping);

    const shuffledB = [...args.columnB].map(b => sanitizeString(b)).sort(() => Math.random() - 0.5);
    const grid = document.createElement('div');
    grid.className = 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-4';
    
    const colADiv = document.createElement('div');
    colADiv.className = 'space-y-3';
    const colBDiv = document.createElement('div');
    colBDiv.className = 'space-y-3';

    args.columnA.forEach((itemA, idx) => {
        colADiv.innerHTML += `<div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center" data-item-a="${sanitizeString(itemA)}"><span class="font-semibold mr-2">${idx + 1}.</span> ${sanitizeString(itemA)}</div>`;
    });

    shuffledB.forEach((itemB, idx) => {
        colBDiv.innerHTML += `<div class="sortable-item p-3 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center cursor-grab" draggable="true" data-item-b="${itemB}"><i data-lucide="grip-vertical" class="w-5 h-5 mr-3 text-gray-500"></i><span class="item-text">${itemB}</span></div>`;
    });
    
    grid.innerHTML = `
        <div class="space-y-4">
            <h4 class="font-semibold">Cột A</h4>
            <div class="space-y-2" id="col-a-container">${colADiv.innerHTML}</div>
        </div>
        <div class="space-y-4">
            <h4 class="font-semibold">Cột B (Kéo thả để nối)</h4>
            <div class="sortable-list space-y-2 min-h-[100px] p-2 rounded-lg bg-gray-200 dark:bg-gray-700/50">${colBDiv.innerHTML}</div>
        </div>
    `;

    item.appendChild(grid);
    addDragDropHandlers(grid.querySelector('.sortable-list'));
    item.appendChild(createFeedbackDiv(""));
    return item;
}

function renderSorting(args, index) {
    const title = `<strong>Câu ${index}:</strong> ${sanitizeString(args.title)}`;
    const item = createQuestionItem(title, index); item.dataset.type = 'sorting'; 
    const sanitizedItems = args.items.map(i => sanitizeString(i));
    item.dataset.correct = JSON.stringify(sanitizedItems);
    
    const list = document.createElement('div'); list.className = 'sortable-list space-y-2 mt-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800';
    const shuffledItems = [...sanitizedItems].sort(() => Math.random() - 0.5);
    shuffledItems.forEach(text => { 
        list.innerHTML += `<div class="sortable-item p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md flex items-center cursor-grab shadow-sm" draggable="true"><i data-lucide="grip-vertical" class="w-5 h-5 mr-3 text-gray-500"></i><span class="item-text">${text}</span></div>`; 
    });
    item.appendChild(list);
    item.appendChild(createFeedbackDiv(""));
    addDragDropHandlers(list);
    return item;
}

function renderShortAnswer(args, index) {
    const title = `<strong>Câu ${index}:</strong> ${args.question}`;
    const item = createQuestionItem(title, index); item.dataset.type = 'saq';
    item.innerHTML += `<textarea class="input-base mt-2 w-full" rows="4" placeholder="Viết câu trả lời của bạn..."></textarea>`;
    item.appendChild(createFeedbackDiv(`<span class="font-bold">Gợi ý đáp án:</span> ${sanitizeString(args.suggestedAnswer || "Đây là câu hỏi mở.")}`));
    return item;
}

// --- NEW Learning Quiz Renderers (with single check button) ---
function renderLearningMultipleChoice(args) {
     const quizWrapper = document.createElement('div');
     quizWrapper.className = 'quiz-wrapper';
     quizWrapper.dataset.type = 'multiple_choice';
     quizWrapper.dataset.correct = args.answer;

     let optionsHtml = '';
     Object.keys(args.options).forEach(key => {
         optionsHtml += `
             <button class="quiz-option-btn" data-option="${key}">
                 <span class="quiz-option-letter">${key}</span>
                 <span class="quiz-option-text">${DOMPurify.sanitize(args.options[key])}</span>
             </button>
         `;
     });
     quizWrapper.innerHTML = `
         <p class="font-semibold mb-3">${DOMPurify.sanitize(args.question)}</p>
         <div class="space-y-2">
             ${optionsHtml}
         </div>
         <div class="quiz-explanation mt-3 hidden"></div>
     `;
     return quizWrapper;
}

function renderLearningFillInTheBlank(args) {
    const quizWrapper = document.createElement('div');
    quizWrapper.className = 'quiz-wrapper';
    quizWrapper.dataset.type = 'fill_in_the_blank';
    quizWrapper.dataset.blanks = JSON.stringify(args.blanks);
    quizWrapper.dataset.explanation = args.explanation;

    let sentenceHtml = DOMPurify.sanitize(args.sentence);
    const numBlanks = (sentenceHtml.match(/\{\{BLANK\}\}/g) || []).length;
    const renderInput = `<input type="text" class="quiz-blank-input inline-block w-32 mx-2 p-2 rounded-md dark:bg-gray-700" placeholder="...">`;
    sentenceHtml = sentenceHtml.replace(/\{\{BLANK\}\}/g, renderInput);
    
    quizWrapper.innerHTML = `
        <p class="font-semibold mb-3">${sentenceHtml}</p>
        <button class="check-learning-quiz-btn btn btn-primary mt-4">Kiểm tra</button>
        <div class="quiz-explanation mt-3 hidden"></div>
    `;
    return quizWrapper;
}

function renderLearningShortAnswer(args) {
    const quizWrapper = document.createElement('div');
    quizWrapper.className = 'quiz-wrapper';
    quizWrapper.dataset.type = 'short_answer';
    quizWrapper.dataset.keywords = JSON.stringify(args.keywords);
    quizWrapper.dataset.gist = args.expected_answer_gist;
    quizWrapper.dataset.explanation = args.explanation;

    quizWrapper.innerHTML = `
        <p class="font-semibold mb-3">${DOMPurify.sanitize(args.question)}</p>
        <textarea class="input-base w-full mt-2" rows="3" placeholder="Nhập câu trả lời của bạn..."></textarea>
        <button class="check-learning-quiz-btn btn btn-primary mt-4">Kiểm tra</button>
        <div class="quiz-explanation mt-3 hidden"></div>
    `;
    return quizWrapper;
}

function renderFlashcardQuiz(args) {
     const quizWrapper = document.createElement('div');
     quizWrapper.className = 'quiz-wrapper flashcard-quiz';
     quizWrapper.dataset.type = 'flashcard';
     quizWrapper.dataset.cardIndex = 0;
     quizWrapper.dataset.quizData = JSON.stringify(args);

     const cardsHtml = args.cards.map((card, i) => `
        <div class="flashcard-face flashcard-front absolute w-full h-full flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-all duration-300 ${i === 0 ? '' : 'hidden'}">
            <span class="text-2xl font-bold">${DOMPurify.sanitize(card.front)}</span>
        </div>
        <div class="flashcard-face flashcard-back absolute w-full h-full flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md transition-all duration-300 opacity-0 hidden">
            <span class="text-lg text-gray-700 dark:text-gray-300">${DOMPurify.sanitize(card.back)}</span>
        </div>
     `).join('');

     quizWrapper.innerHTML = `
        <p class="font-semibold mb-3">${DOMPurify.sanitize(args.title)}</p>
        <div class="relative w-full h-48 cursor-pointer transform-gpu perspective-1000">
            <div class="flashcard-inner w-full h-full relative text-center">
                ${cardsHtml}
            </div>
        </div>
        <div class="flex justify-between mt-4">
            <button class="flashcard-nav-btn prev-btn btn btn-secondary"><i data-lucide="chevron-left" class="w-4 h-4"></i></button>
            <span class="flashcard-counter text-sm font-semibold">${1}/${args.cards.length}</span>
            <button class="flashcard-nav-btn next-btn btn btn-secondary"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
        </div>
     `;
     return quizWrapper;
}

function renderDragAndDropMatchingQuiz(args) {
    const quizWrapper = document.createElement('div');
    quizWrapper.className = 'quiz-wrapper drag-drop-quiz';
    quizWrapper.dataset.type = 'drag_and_drop_matching';
    quizWrapper.dataset.quizData = JSON.stringify(args);

    const itemsHtml = args.items.map(item => `<div class="drag-item" draggable="true" data-id="${item.id}">${DOMPurify.sanitize(item.text)}</div>`).join('');
    const targetsHtml = args.targets.map(target => `<div class="drop-target" data-id="${target.id}">${DOMPurify.sanitize(target.text)}</div>`).join('');

    quizWrapper.innerHTML = `
        <p class="font-semibold mb-3">${DOMPurify.sanitize(args.title)}</p>
        <div class="grid grid-cols-2 gap-4">
            <div class="drag-items-container space-y-2 p-2">${itemsHtml}</div>
            <div class="drop-targets-container space-y-2 p-2">${targetsHtml}</div>
        </div>
        <button class="check-learning-quiz-btn btn btn-primary mt-4">Kiểm tra</button>
        <div class="quiz-explanation mt-3 hidden"></div>
    `;
    return quizWrapper;
}

function renderSentenceOrderingQuiz(args) {
    const quizWrapper = document.createElement('div');
    quizWrapper.className = 'quiz-wrapper sentence-ordering-quiz';
    quizWrapper.dataset.type = 'sentence_ordering';
    quizWrapper.dataset.quizData = JSON.stringify(args);

    const shuffledSentences = [...args.sentences].sort(() => Math.random() - 0.5);
    const sentencesHtml = shuffledSentences.map(s => `<div class="sentence-item" draggable="true" data-id="${s.id}">${DOMPurify.sanitize(s.text)}</div>`).join('');

    quizWrapper.innerHTML = `
        <p class="font-semibold mb-3">${DOMPurify.sanitize(args.title)}</p>
        <div class="sentences-container space-y-2 p-2">${sentencesHtml}</div>
        <button class="check-learning-quiz-btn btn btn-primary mt-4">Kiểm tra</button>
        <div class="quiz-explanation mt-3 hidden"></div>
    `;
    return quizWrapper;
}

// --- Modes ---
function renderPracticeMode(questionsToRender) {
    exerciseListContainer.innerHTML = '';
    let questionCounter = 0;
    questionsToRender.forEach((item, index) => {
        const isListeningQuestion = currentQuizData.type === 'listening';
        const args = isListeningQuestion ? item : item.args;
        const name = isListeningQuestion ? 'createMultipleChoiceQuestion' : item.name;
        const renderFunction = renderers[name];
        
        if (renderFunction) {
            if (name !== 'reading_passage') {
                questionCounter++;
            }
            const element = renderFunction(args, questionCounter);
            element.dataset.mainIndex = index;
            exerciseListContainer.appendChild(element);
        }
    });
    practiceFooter.classList.remove('hidden');
    practiceActionsContainer.classList.add('hidden');
    checkAllAnswersButton.style.display = 'inline-flex';
    lucide.createIcons();
    renderMath(exerciseListContainer);
}

function renderInteractiveMode(questionsToRender) {
    const passageHost = document.getElementById('interactive-passage-host');
    passageHost.innerHTML = '';
    let actualQuestions = questionsToRender;
    let questionCounter = 0;

    if (questionsToRender.length > 0 && questionsToRender[0].name === 'reading_passage') {
        const passageElement = renderReadingPassage(questionsToRender[0].args);
        passageHost.appendChild(passageElement);
        actualQuestions = questionsToRender.slice(1); 
    }

    allQuestions = actualQuestions; 
    currentQuestionIndex = 0;
    score = 0;
    sessionResults = [];

    if (allQuestions.length > 0) {
         displayCurrentInteractiveQuestion();
    } else {
        if (passageHost.innerHTML !== '') { 
             updateStatus('error', 'Bài đọc được tạo nhưng không có câu hỏi nào. Vui lòng thử lại.');
             interactiveFooter.innerHTML = `<button id="change-settings-btn-error" class="btn btn-secondary">Đổi cài đặt</button>`;
             document.getElementById('change-settings-btn-error').addEventListener('click', () => switchView('controls'));
        } else {
            updateStatus('error', 'Không có bài tập hợp lệ nào được tạo.');
            switchView('controls');
        }
    }
}

function displayCurrentInteractiveQuestion() {
    interactiveQuestionHost.innerHTML = ''; 
    interactiveFooter.innerHTML = '';
    interactiveQuestionHost.classList.remove('fade-in'); 
    void interactiveQuestionHost.offsetWidth; 
    interactiveQuestionHost.classList.add('fade-in');
    
    const itemData = allQuestions[currentQuestionIndex];
    const name = itemData.name;
    const args = itemData.args;
    const renderFunction = renderers[name];
    
    if (renderFunction) {
        const questionNumber = currentQuestionIndex + 1;
        const element = renderFunction(args, questionNumber);
        interactiveQuestionHost.appendChild(element);
    }

    const checkButton = document.createElement('button');
    checkButton.id = 'interactive-check-btn';
    checkButton.className = 'btn btn-primary bg-blue-600 hover:bg-blue-700';
    checkButton.innerHTML = 'Kiểm tra';
    checkButton.disabled = true;
    interactiveFooter.appendChild(checkButton);
    
    const enableButton = () => checkButton.disabled = false;
    interactiveQuestionHost.addEventListener('change', enableButton, { once: true });
    interactiveQuestionHost.addEventListener('input', enableButton, { once: true });
    interactiveQuestionHost.addEventListener('dragend', enableButton, { once: true });
    checkButton.addEventListener('click', () => checkInteractiveAnswer(currentQuestionIndex));

    updateProgress();
    lucide.createIcons();
    renderMath(interactiveQuestionHost);
}

function checkInteractiveAnswer(questionIndex) {
    const questionItem = interactiveQuestionHost.querySelector('.question-item');
    const { isCorrect, isGraded, userAnswer } = checkSingleAnswer(questionItem, true, questionIndex);
    
    sessionResults.push({
        question: allQuestions[questionIndex],
        userAnswer: userAnswer,
        isCorrect: isCorrect
    });

    if (isGraded && isCorrect) { score++; confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } }); }
    questionItem.querySelectorAll('input, textarea').forEach(el => el.disabled = true);
    questionItem.querySelectorAll('.sortable-item').forEach(el => el.draggable = false);
    
    const continueButton = document.createElement('button');
    continueButton.id = 'interactive-continue-btn';
    let btnClass = 'btn text-white ';
    if (!isGraded) { btnClass += 'bg-blue-600 hover:bg-blue-700'; } 
    else { btnClass += isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'; }
    continueButton.className = btnClass;
    continueButton.innerHTML = 'Tiếp tục <i data-lucide="arrow-right" class="inline-block w-4 h-4 ml-1"></i>';
    interactiveFooter.innerHTML = ''; interactiveFooter.appendChild(continueButton);
    continueButton.addEventListener('click', showNextQuestion);
    lucide.createIcons();
    renderMath(interactiveQuestionHost);
}

function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < allQuestions.length) { displayCurrentInteractiveQuestion(); } 
    else { showSummary(); }
}

function updateProgress() {
    const totalQuestions = allQuestions.length;
    const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Câu ${currentQuestionIndex + 1} / ${totalQuestions}`;
}

function showSummary() {
    switchView('summary');
    const gradableQuestions = allQuestions.length;
    const percentage = gradableQuestions > 0 ? (score / gradableQuestions) * 100 : 0;
    summaryText.textContent = `Bạn đã trả lời đúng ${score} / ${gradableQuestions} câu.`;
    summaryProgressBar.style.width = `${percentage}%`;

    currentTestResult.score = score;
    currentTestResult.totalGradable = gradableQuestions;
    saveTestResult();
}

// --- Grading Logic ---
function checkSingleAnswer(q, showFeedback = false, questionIndex = -1) {
    let isCorrect = false; 
    let isGraded = true;
    let feedbackHTML = '';
    let userAnswer = null;

    switch (q.dataset.type) {
        case 'mcq':
            const selectedRadioMCQ = q.querySelector('input:checked');
            userAnswer = selectedRadioMCQ ? selectedRadioMCQ.value : null;
            const correctValueMCQ = q.dataset.correct;

            if (selectedRadioMCQ) {
                isCorrect = userAnswer === correctValueMCQ;
                if (showFeedback) {
                    const allLabels = q.querySelectorAll('.option-label');
                    allLabels.forEach((label) => {
                        const radio = label.querySelector('input');
                        if (radio.value == correctValueMCQ) {
                            label.classList.add('correct');
                        } else if (radio.checked) {
                            label.classList.add('incorrect');
                        }
                    });
                }
            }
            break;

        case 'tf':
            const selectedRadioTF = q.querySelector('input:checked');
            if(selectedRadioTF) userAnswer = selectedRadioTF.value;
            const isCorrectTF = q.dataset.correct === 'true';
            if (selectedRadioTF) {
                isCorrect = (selectedRadioTF.value === 'true') === isCorrectTF;
                if (showFeedback) {
                    const userChoiceLabel = selectedRadioTF.closest('.option-label');
                    if (userChoiceLabel) userChoiceLabel.classList.add(isCorrect ? 'correct' : 'incorrect');
                    
                    const correctLabel = q.querySelector(`input[value="${isCorrectTF}"]`).closest('.option-label');
                    if (correctLabel && !correctLabel.classList.contains('correct')) {
                        correctLabel.classList.add('correct');
                    }
                }
            }
            break;
        
        case 'fib':
            const inputs = q.querySelectorAll('.input-fib');
            const correctAnswers = JSON.parse(q.dataset.correct);
            userAnswer = Array.from(inputs).map(i => i.value).join(', ');
            let allCorrect = true;
            inputs.forEach((input, index) => {
                const isInputCorrect = input.value.trim().toLowerCase() === correctAnswers[index].toLowerCase();
                if (!isInputCorrect) allCorrect = false;
                if (showFeedback) {
                    input.classList.add(isInputCorrect ? 'correct' : 'incorrect');
                    if (!isInputCorrect) {
                        const correctAnswerEl = document.createElement('span');
                        correctAnswerEl.className = 'text-green-600 dark:text-green-400 ml-2';
                        correctAnswerEl.textContent = `(Đáp án: ${correctAnswers[index]})`;
                        input.after(correctAnswerEl);
                    }
                }
            });
            isCorrect = allCorrect;
            break;


        case 'matching':
            const listContainer = q.querySelector('.sortable-list');
            const userOrderItems = listContainer.querySelectorAll('.sortable-item');
            userAnswer = Array.from(userOrderItems).map(item => item.dataset.itemB).join(', ');
            const correctMapping = JSON.parse(q.dataset.correct);
            let correctMatches = 0;
            
            correctMapping.forEach((pair, idx) => {
                const userItemB = userOrderItems[idx] ? userOrderItems[idx].dataset.itemB : null;
                const isMatchCorrect = pair.itemB === userItemB;
                if (isMatchCorrect) correctMatches++;

                if (showFeedback) {
                    const itemAContainer = q.querySelector(`#col-a-container`).children[idx];
                    const itemBEl = userOrderItems[idx];

                    if (isMatchCorrect) {
                        if(itemAContainer) itemAContainer.classList.add('bg-green-100', 'dark:bg-green-900/50');
                        if(itemBEl) itemBEl.classList.add('bg-green-100', 'dark:bg-green-900/50');
                    } else {
                        if(itemAContainer) itemAContainer.classList.add('bg-red-100', 'dark:bg-red-900/50');
                        if(itemBEl) itemBEl.classList.add('bg-red-100', 'dark:bg-red-900/50');
                    }
                }
            });
            isCorrect = correctMatches === correctMapping.length;
            feedbackHTML = `<span class="font-bold">Đáp án đúng:</span><ul class="list-none mt-2 space-y-1">`;
            correctMapping.forEach(item => { 
                feedbackHTML += `<li>${item.itemA} &harr; ${item.itemB}</li>`;
            });
            feedbackHTML += `</ul>`;
            break;

        case 'sorting':
            const userOrder = Array.from(q.querySelectorAll('.sortable-item .item-text')).map(item => item.textContent);
            userAnswer = userOrder.join(' -> ');
            const correctOrder = JSON.parse(q.dataset.correct);
            isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
            feedbackHTML = `<span class="font-bold">Thứ tự đúng:</span><ol class="list-decimal list-inside mt-2 space-y-1">`;
            correctOrder.forEach((item, i) => { 
                 feedbackHTML += `<li class="${userOrder[i] === item ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}">${item}</li>`; 
            });
            feedbackHTML += `</ol>`;
            break;
        
        case 'saq': isGraded = false; break;
    }
    
    const feedbackDiv = q.querySelector('.feedback-box');
    if (showFeedback && feedbackDiv) {
        if (feedbackHTML) feedbackDiv.innerHTML = marked.parse(feedbackHTML);
        feedbackDiv.classList.remove('hidden');
        feedbackDiv.classList.add(isGraded ? (isCorrect ? 'correct' : 'incorrect') : 'info');
        
        if (isGraded && questionIndex !== -1) {
            const button = document.createElement('button');
            const questionData = allQuestions[questionIndex];
            const args = questionData.args || questionData;

            if (isCorrect) {
                button.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4 mr-2 inline-block"></i>Mở rộng kiến thức`;
                button.className = 'btn bg-teal-600 hover:bg-teal-700 text-white text-sm mt-4';
                button.onclick = () => requestExpandedKnowledge(args);
            } else {
                button.innerHTML = `<i data-lucide="shield-question" class="w-4 h-4 mr-2 inline-block"></i>Củng cố kiến thức`;
                button.className = 'btn bg-purple-600 hover:bg-purple-700 text-white text-sm mt-4';
                button.onclick = () => {
                    const finalUserAnswer = userAnswer || "(không chọn đáp án)";
                    requestReinforcement(args, finalUserAnswer);
                };
            }
            feedbackDiv.appendChild(button);
            lucide.createIcons();
        }
    }

    return { isCorrect, isGraded, userAnswer };
}

function checkAllPracticeAnswers() {
    let totalScore = 0; 
    let gradableQuestions = 0;
    sessionResults = [];

    let questionCounter = 0;
    exerciseListContainer.querySelectorAll('.question-item').forEach(q_element => {
        let mainIndex = parseInt(q_element.dataset.mainIndex, 10);
        
        if (q_element.dataset.type) { 
            const result = checkSingleAnswer(q_element, true, mainIndex);
            
            const questionData = allQuestions[mainIndex];
            sessionResults.push({
                question: questionData.args || questionData,
                userAnswer: result.userAnswer,
                isCorrect: result.isCorrect
            });

            if (result.isGraded) { 
                gradableQuestions++; 
                if (result.isCorrect) totalScore++; 
            }
        }
    });

    paperScore.innerHTML = `<strong>Điểm số:</strong> ${totalScore} / ${gradableQuestions}`;
    paperScore.classList.remove('hidden');
    
    practiceActionsContainer.classList.remove('hidden');
    checkAllAnswersButton.style.display = 'none';

    currentTestResult.score = totalScore;
    currentTestResult.totalGradable = gradableQuestions;
    saveTestResult();

    lucide.createIcons();
    renderMath(exerciseListContainer);
}

// --- Drag & Drop ---
function addDragDropHandlers(list) {
    let draggingItem = null;
    list.querySelectorAll('.sortable-item').forEach(item => {
        item.addEventListener('dragstart', (e) => { 
            draggingItem = item;
            setTimeout(() => item.classList.add('opacity-50'), 0); 
        });
        item.addEventListener('dragend', () => { 
            item.classList.remove('opacity-50');
            draggingItem = null;
        });
    });
    list.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(list, e.clientY);
        if (draggingItem) {
            if (afterElement == null) { list.appendChild(draggingItem); } 
            else { list.insertBefore(draggingItem, afterElement); }
        }
    });
}
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sortable-item:not(.opacity-50)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) { return { offset: offset, element: child }; } 
        else { return closest; }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- AUTHENTICATION & FIRESTORE ---
onAuthStateChanged(auth, user => {
    if (user) {
        currentUser = user;
        loginContainer.classList.add('hidden');
        userInfo.classList.remove('hidden');
        userInfo.classList.add('flex');
        userAvatar.src = user.photoURL;
        userName.textContent = user.displayName;
    } else {
        currentUser = null;
        loginContainer.classList.remove('hidden');
        userInfo.classList.add('hidden');
        userInfo.classList.remove('flex');
    }
});

loginBtn.addEventListener('click', () => {
    signInWithPopup(auth, provider).catch((error) => console.error("Authentication error:", error));
});

logoutBtn.addEventListener('click', () => {
    signOut(auth).catch((error) => console.error("Sign out error:", error));
});

async function saveTestResult() {
    if (!currentUser) {
        summarySaveStatus.textContent = 'Đăng nhập để lưu kết quả của bạn.';
        return;
    }
    if (currentTestResult.totalGradable === undefined) return;

    summarySaveStatus.textContent = 'Đang lưu kết quả...';
    try {
        await addDoc(collection(db, "userResults"), {
            userId: currentUser.uid,
            userName: currentUser.displayName,
            createdAt: serverTimestamp(),
            ...currentTestResult
        });
        summarySaveStatus.textContent = 'Kết quả đã được lưu thành công!';
    } catch (e) {
        console.error("Error adding document: ", e);
        summarySaveStatus.textContent = 'Lỗi khi lưu kết quả.';
    }
}

async function renderHistory() {
    switchView('history');
    historyLoadingSpinner.classList.remove('hidden');
    practiceHistoryList.innerHTML = '';
    interactiveHistoryList.innerHTML = '';
    noPracticeHistory.classList.add('hidden');
    noInteractiveHistory.classList.add('hidden');

    if (!currentUser) {
        noPracticeHistory.classList.remove('hidden');
        noPracticeHistory.textContent = 'Vui lòng đăng nhập để xem lịch sử.';
        noInteractiveHistory.classList.remove('hidden');
        noInteractiveHistory.textContent = 'Vui lòng đăng nhập để xem lịch sử.';
        historyLoadingSpinner.classList.add('hidden');
        return;
    }

    try {
        const q = query(collection(db, "userResults"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        let practiceCount = 0;
        let interactiveCount = 0;

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.createdAt?.toDate().toLocaleString('vi-VN') || 'Không rõ ngày';
            const scoreColor = data.score / data.totalGradable >= 0.5 ? 'text-green-500' : 'text-red-500';

            const historyItemHTML = `
                <div class="card p-4 flex justify-between items-center">
                    <div>
                        <p class="font-bold text-gray-800 dark:text-gray-200">${data.subject}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">${data.topic}</p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">${date}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-lg ${scoreColor}">${data.score} / ${data.totalGradable}</p>
                        <p class="text-xs font-semibold text-gray-500 dark:text-gray-400">${data.mode === 'practice' ? 'Luyện tập' : 'Tương tác'}</p>
                    </div>
                </div>
            `;

            if (data.mode === 'practice') {
                practiceHistoryList.innerHTML += historyItemHTML;
                practiceCount++;
            } else {
                interactiveHistoryList.innerHTML += historyItemHTML;
                interactiveCount++;
            }
        });

        if (practiceCount === 0) noPracticeHistory.classList.remove('hidden');
        if (interactiveCount === 0) noInteractiveHistory.classList.remove('hidden');

    } catch (error) {
        console.error("Error fetching history: ", error);
        noPracticeHistory.classList.remove('hidden');
        noPracticeHistory.textContent = 'Lỗi khi tải lịch sử.';
    } finally {
        historyLoadingSpinner.classList.add('hidden');
    }
}

// --- HELPERS & INITIALIZATION ---
function updateStatus(type, message) { const colors = { 'success': 'text-green-600 dark:text-green-400', 'error': 'text-red-600 dark:text-red-400', 'info': 'text-gray-600 dark:text-gray-400' }; statusMessage.textContent = message; statusMessage.className = `mt-6 text-center font-semibold ${colors[type] || 'text-gray-600 dark:text-gray-400'}`; }
function setLoadingState(isLoading) { generateButton.disabled = isLoading; const icon = generateButton.querySelector('i'); if(icon) icon.classList.toggle('hidden', isLoading); buttonText.classList.toggle('hidden', isLoading); buttonSpinner.classList.toggle('hidden', !isLoading); if (isLoading) updateStatus('info', 'AI đang làm việc, vui lòng chờ trong giây lát...'); }

function updateDynamicControls() {
    const subject = subjectSelect.value;
    const mode = modeSelect.value;

    skillSelectContainer.classList.add('hidden');
    levelSelectContainer.classList.add('hidden');
    mathLevelSelectContainer.classList.add('hidden');
    
    let templateKey = subject;
    if (subject === 'english') {
        const skill = skillSelect.value;
        templateKey = `english_${skill}`;
        skillSelectContainer.classList.remove('hidden');
        levelSelectContainer.classList.remove('hidden');
    } else if (subject === 'mathematics') {
        templateKey = 'mathematics';
        mathLevelSelectContainer.classList.remove('hidden');
    }

    dynamicControlsContainer.innerHTML = controlTemplates[templateKey] || controlTemplates.general;

    if (mode === 'learning') {
        const fieldset = dynamicControlsContainer.querySelector('fieldset');
        if (fieldset) fieldset.classList.add('hidden');
        const topicInput = document.getElementById('topicInput');
        if(topicInput && topicInput.tagName === 'TEXTAREA') {
            topicInput.placeholder = "Nhập chủ đề bạn muốn học, ví dụ: 'Lịch sử máy tính', 'Các thì trong Tiếng Anh'...";
        }
    }

    lucide.createIcons();
}

// --- AUDIO PLAYBACK LOGIC ---
function playSpeech(text) {
    if (synth.speaking) {
        synth.cancel();
    }
    audioState.isPaused = false;
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    let selectedVoice = voices.find(voice => voice.name === 'Google US English' || voice.name === 'Microsoft David - English (United States)');
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
    }
    utterance.voice = selectedVoice;
    utterance.rate = 0.9;
    
    utterance.onstart = () => {
        playAudioBtn.innerHTML = `<i data-lucide="pause" class="w-6 h-6"></i>`;
        lucide.createIcons();
        audioStatus.textContent = "Đang phát...";
    };
    
    utterance.onend = () => {
        if (!audioState.isPaused) {
            playAudioBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6"></i>`;
            lucide.createIcons();
            audioStatus.textContent = "Nghe lại";
        }
    };
    
    audioState.utterance = utterance;
    synth.speak(utterance);
}

function setupAudioPlayer() {
    playAudioBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6"></i>`;
    lucide.createIcons();
    audioStatus.textContent = "Nhấn để nghe";
    
    playAudioBtn.onclick = () => {
        if (synth.speaking && !synth.paused) {
            synth.pause();
            audioState.isPaused = true;
            playAudioBtn.innerHTML = `<i data-lucide="play" class="w-6 h-6"></i>`;
            lucide.createIcons();
            audioStatus.textContent = "Đã tạm dừng";
        } else if (synth.paused) {
            synth.resume();
            audioState.isPaused = false;
            playAudioBtn.innerHTML = `<i data-lucide="pause" class="w-6 h-6"></i>`;
            lucide.createIcons();
            audioStatus.textContent = "Đang phát...";
        } else {
            playSpeech(currentQuizData.raw.script);
        }
    };
}

// --- LEARNING MODE FUNCTIONS ---
async function startLearningSession() {
    if (!model) { updateStatus('error', "Mô hình AI chưa được khởi tạo."); return; }
    setLoadingState(true);
    resetQuizState();

    const topic = document.getElementById('topicInput').value.trim();
    if (!topic) {
        updateStatus('error', "Vui lòng nhập chủ đề bạn muốn học.");
        setLoadingState(false);
        return;
    }

    learningPathTitle.textContent = `Lộ trình học: ${topic}`;
    learningPathSubject.textContent = subjectSelect.options[subjectSelect.selectedIndex].text;
    switchView('learning');
    learningContent.innerHTML = '<div class="spinner mx-auto mt-10"></div>';

    try {
        // Modified prompt to be simpler, asking only for the path
        const prompt = `Bạn là một người hướng dẫn học tập chuyên nghiệp, có khả năng chia nhỏ các chủ đề phức tạp thành một lộ trình học tập rõ ràng.
        Khi người dùng yêu cầu một chủ đề, hãy trả lời bằng một danh sách các bài học có cấu trúc (dùng Markdown với gạch đầu dòng).
        Đối với MỖI BÀI HỌC trong lộ trình, bạn PHẢI định dạng nó theo cú pháp đặc biệt sau: \`[Tên bài học]{"prompt":"Yêu cầu chi tiết để bạn giảng giải về bài học này"}\`. Prompt phải chi tiết và bằng tiếng Việt.
        Ví dụ, với chủ đề "Các thì trong tiếng Anh", bạn có thể tạo một lộ trình gồm các bài học như sau:
        - [Tổng quan về Thì (Tenses) trong tiếng Anh]{"prompt":"Xin hãy giới thiệu về khái niệm thì (tenses) trong tiếng Anh là gì, giải thích tầm quan trọng của việc sử dụng đúng thì trong giao tiếp và viết lách, và cung cấp một cái nhìn tổng quan về cách thì giúp thể hiện thời gian và hành động."}
        - [Thì Hiện tại Đơn (Present Simple)]{"prompt":"Xin hãy giảng giải chi tiết về Thì Hiện tại Đơn (Present Simple). Bao gồm cấu trúc, cách dùng, dấu hiệu nhận biết và ví dụ."}
        - [Thì Quá khứ Đơn (Past Simple)]{"prompt":"Xin hãy giảng giải chi tiết về Thì Quá khứ Đơn (Past Simple). Bao gồm cấu trúc, cách dùng, dấu hiệu nhận biết và ví dụ."}
        ...
        Yêu cầu của người dùng: Tạo một lộ trình học chi tiết cho chủ đề "${topic}".`;
        const result = await model.generateContent(prompt);
        const response = result.response;
        const responseText = response.text();
        renderLearningPath(responseText);
    } catch (error) {
        console.error("Error starting learning session:", error);
        learningContent.innerHTML = `<p class="text-red-500">Đã có lỗi xảy ra khi tạo lộ trình học. Vui lòng thử lại.</p>`;
    } finally {
        setLoadingState(false);
    }
}

function renderLearningPath(text) {
    learningContent.innerHTML = ''; // Clear spinner
    const pathContainer = document.createElement('div');
    pathContainer.className = 'learning-item';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = marked.parse(text);

    tempDiv.querySelectorAll('li').forEach(li => {
        const linkMatch = li.innerHTML.match(/\[([^\]]+?)\]\{"prompt":"([^"]+?)"\}/);
        if (linkMatch) {
            const title = linkMatch[1];
            const prompt = linkMatch[2];
            const sanitizedPrompt = prompt.replace(/"/g, '&quot;');
            const isCompleted = completedTopics.includes(sanitizedPrompt);
            const completedClass = isCompleted ? 'completed' : '';
            const icon = isCompleted ? '<i data-lucide="check-circle-2" class="w-5 h-5"></i>' : '<i data-lucide="circle" class="w-5 h-5"></i>';
            
            const buttonHTML = `
                <button class="learning-link ${completedClass}" data-prompt="${sanitizedPrompt}">
                    <span class="icon">${icon}</span>
                    <span>${title}</span>
                </button>
            `;
            li.innerHTML = buttonHTML;
        }
    });

    pathContainer.appendChild(tempDiv);
    learningContent.appendChild(pathContainer);
    lucide.createIcons();
    renderMath(learningContent);
}

async function fetchAndDisplayLesson(prompt, buttonElement) {
    buttonElement.disabled = true;
    const iconSpan = buttonElement.querySelector('.icon');
    if (iconSpan) iconSpan.innerHTML = '<div class="spinner w-5 h-5"></div>';
    
    const lessonContainer = document.createElement('div');
    lessonContainer.className = 'learning-item fade-in';
    learningContent.appendChild(lessonContainer);
    lessonContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    try {
        // Modified prompt to be simpler, asking for detailed lesson content only
        const fullPrompt = `Chỉ cung cấp nội dung bài học chi tiết cho yêu cầu sau. KHÔNG tạo ra quiz hay các liên kết tương tác nào khác. Sử dụng Markdown để định dạng và KaTeX cho công thức toán học. Yêu cầu: ${prompt}`;
        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();
        
        const formattedContent = marked.parse(responseText);

        // Create a div for the lesson title
        const lessonTitleEl = document.createElement('h3');
        lessonTitleEl.className = 'text-xl font-bold mb-4 text-gray-800 dark:text-gray-200';
        lessonTitleEl.textContent = buttonElement.textContent.trim();
        lessonContainer.appendChild(lessonTitleEl);

        // Create a div for the lesson content
        const lessonContentEl = document.createElement('div');
        lessonContentEl.className = 'prose max-w-none text-gray-700 dark:text-gray-300';
        lessonContentEl.innerHTML = DOMPurify.sanitize(formattedContent);
        lessonContainer.appendChild(lessonContentEl);
        
        // Render any math formulas
        renderMath(lessonContainer);
        lucide.createIcons();

        const sanitizedPrompt = prompt.replace(/"/g, '&quot;');
        if (!completedTopics.includes(sanitizedPrompt)) {
            completedTopics.push(sanitizedPrompt);
        }
        buttonElement.classList.add('completed');
        if (iconSpan) iconSpan.innerHTML = '<i data-lucide="check-circle-2" class="w-5 h-5"></i>';
        lucide.createIcons();

    } catch (error) {
        console.error("Error fetching lesson:", error);
        lessonContainer.innerHTML = `<p class="text-red-500">Lỗi khi tải bài học.</p>`;
    } finally {
        buttonElement.disabled = false;
        if (!buttonElement.classList.contains('completed')) {
            if(iconSpan) iconSpan.innerHTML = '<i data-lucide="circle" class="w-5 h-5"></i>';
            lucide.createIcons();
        }
    }
}

// This function is now unused in the new learning mode flow but kept for other modes.
function insertRenderedQuizzes(container, quizzes) {
    quizzes.forEach(quiz => {
        const placeholder = container.querySelector(`#${quiz.id}`);
        if (placeholder) {
            try {
                const quizData = JSON.parse(quiz.json);
                let quizElement;
                if (learningRenderers[quizData.type]) {
                    quizElement = learningRenderers[quizData.type](quizData, quizzes.indexOf(quiz) + 1);
                     // Add check button and logic for interactive learning quiz
                    const checkBtn = document.createElement('button');
                    checkBtn.className = 'check-learning-quiz-btn btn btn-primary mt-4';
                    checkBtn.textContent = 'Kiểm tra';
                    quizElement.appendChild(checkBtn);
                    checkBtn.addEventListener('click', () => {
                        const isCorrect = checkSingleLearningQuizAnswer(quizElement, quizData);
                        checkBtn.disabled = true;
                        quizElement.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);
                    });
                } else {
                    throw new Error(`Unsupported quiz type: ${quizData.type}`);
                }
                
                if (quizElement) {
                    placeholder.replaceWith(quizElement);
                }
            } catch (e) {
                console.error("Failed to parse quiz JSON:", e, quiz.json);
                placeholder.innerHTML = `<p class="text-red-500">Lỗi hiển thị quiz.</p>`;
            }
        }
    });
}

function checkSingleLearningQuizAnswer(quizElement, quizData) {
    let isCorrect = false;
    let explanationText = quizData.explanation;

    switch(quizElement.dataset.type) {
        case 'multiple_choice':
            const selectedOption = quizElement.querySelector('.quiz-option-btn:not([disabled])');
            const selectedValue = selectedOption ? selectedOption.dataset.option : null;
            isCorrect = selectedValue === quizData.answer;
            
            quizElement.querySelectorAll('.quiz-option-btn').forEach(btn => {
                btn.disabled = true;
                if (btn.dataset.option === quizData.answer) {
                    btn.classList.add('correct');
                } else if (btn.dataset.option === selectedValue) {
                    btn.classList.add('incorrect');
                }
            });
            break;
        case 'fill_in_the_blank':
            const inputs = quizElement.querySelectorAll('.quiz-blank-input');
            isCorrect = Array.from(inputs).every((input, index) => {
                const correct = input.value.trim().toLowerCase() === quizData.blanks[index].toLowerCase();
                input.classList.add(correct ? 'correct' : 'incorrect');
                return correct;
            });
            if (!isCorrect) {
                explanationText = `Đáp án đúng là: ${quizData.blanks.join(', ')}. ${explanationText}`;
            }
            break;
        case 'short_answer':
            const userAnswer = quizElement.querySelector('textarea').value.trim().toLowerCase();
            const keywords = quizData.keywords.map(k => k.toLowerCase());
            isCorrect = keywords.every(keyword => userAnswer.includes(keyword));
            break;
        case 'flashcard':
        case 'drag_and_drop_matching':
        case 'sentence_ordering':
            isCorrect = false; // These are not graded automatically by this function
            break;
    }

    const explanationDiv = quizElement.querySelector('.quiz-explanation');
    explanationDiv.innerHTML = `
        <span class="font-bold">${isCorrect ? 'Chính xác!' : 'Chưa chính xác.'}</span>
        <p class="mt-2">${DOMPurify.sanitize(marked.parse(explanationText))}</p>
    `;
    explanationDiv.classList.remove('hidden');
    explanationDiv.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    return isCorrect;
}

// --- EVENT LISTENERS ---
function updateButtonText() {
    const mode = modeSelect.value;
    if (mode === 'practice') buttonText.textContent = 'Bắt đầu Luyện tập';
    else if (mode === 'interactive') buttonText.textContent = 'Bắt đầu Tương tác';
    else if (mode === 'learning') buttonText.textContent = 'Tạo Lộ trình học';
}

function handleModeChange(selectedMode) {
    modeSelect.value = selectedMode;
    [modePracticeBtn, modeInteractiveBtn, modeLearningBtn].forEach(btn => {
        btn.classList.remove('bg-white', 'dark:bg-gray-900', 'text-indigo-600', 'dark:text-indigo-400', 'shadow');
        btn.classList.add('text-gray-500', 'dark:text-gray-400');
    });
    const selectedBtn = document.getElementById(`mode-${selectedMode}-btn`);
    selectedBtn.classList.add('bg-white', 'dark:bg-gray-900', 'text-indigo-600', 'dark:text-indigo-400', 'shadow');
    selectedBtn.classList.remove('text-gray-500', 'dark:text-gray-400');
    updateButtonText();
    updateDynamicControls();
}

modePracticeBtn.addEventListener('click', () => handleModeChange('practice'));
modeInteractiveBtn.addEventListener('click', () => handleModeChange('interactive'));
modeLearningBtn.addEventListener('click', () => handleModeChange('learning'));

subjectSelect.addEventListener('change', updateDynamicControls);
skillSelect.addEventListener('change', updateDynamicControls); 

generateButton.addEventListener('click', startPractice); 
checkAllAnswersButton.addEventListener('click', checkAllPracticeAnswers);
getFeedbackBtn.addEventListener('click', getWritingFeedback);
writingInput.addEventListener('input', () => {
    const text = writingInput.value;
    const count = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    wordCount.textContent = `${count} từ`;
});
showTranscriptBtn.addEventListener('click', () => {
    transcriptContainer.classList.toggle('hidden');
    showTranscriptBtn.textContent = transcriptContainer.classList.contains('hidden') ? 'Hiện lời thoại' : 'Ẩn lời thoại';
});

const handleRestart = () => {
     if (generatedExercisesCache.length === 0) {
         // Use a custom modal or message box instead of alert
         showError("Không có bài tập nào để làm lại. Vui lòng tạo bài tập trước.");
         return;
     }
     resetQuizState();
     
     if (modeSelect.value === 'practice') {
        renderPracticeMode(generatedExercisesCache);
    } else {
        renderInteractiveMode(generatedExercisesCache);
    }
     switchView('exercise');
};
const handleChangeSettings = () => switchView('controls');
restartQuizBtn.addEventListener('click', handleRestart);
changeSettingsBtn.addEventListener('click', handleChangeSettings);
restartPracticeBtn.addEventListener('click', handleRestart);
changeSettingsFromPracticeBtn.addEventListener('click', handleChangeSettings);
restartWritingBtn.addEventListener('click', startWritingPractice);
changeSettingsFromWritingBtn.addEventListener('click', handleChangeSettings);
changeSettingsFromLearningBtn.addEventListener('click', handleChangeSettings);

sendTextBtn.addEventListener('click', handleConversationResponse);
conversationTextInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleConversationResponse();
    }
});
endConversationBtn.addEventListener('click', endConversationAndGetFeedback);

historyBtn.addEventListener('click', renderHistory);
backToMainBtn.addEventListener('click', () => switchView('controls'));

practiceTab.addEventListener('click', () => {
    practiceTab.classList.add('active');
    interactiveTab.classList.remove('active');
    practiceHistoryContent.classList.remove('hidden');
    interactiveHistoryContent.classList.add('hidden');
});

interactiveTab.addEventListener('click', () => {
    interactiveTab.classList.add('active');
    practiceTab.classList.remove('active');
    interactiveHistoryContent.classList.remove('hidden');
    practiceHistoryContent.classList.add('hidden');
});

closeLessonModal.addEventListener('click', () => lessonModal.classList.remove('active'));
lessonModal.addEventListener('click', (event) => {
    if (event.target === lessonModal) {
        lessonModal.classList.remove('active');
    }
});

learningContent.addEventListener('click', (e) => {
    const link = e.target.closest('.learning-link');
    if (link) {
        e.preventDefault();
        fetchAndDisplayLesson(link.dataset.prompt, link);
    }
});

// Listen for clicks on dynamically added quiz elements
learningContent.addEventListener('click', (e) => {
    const quizWrapper = e.target.closest('.quiz-wrapper');
    if (!quizWrapper) return;
    
    if (e.target.closest('.quiz-option-btn')) {
        const button = e.target.closest('.quiz-option-btn');
        const quizData = JSON.parse(quizWrapper.dataset.quizData);
        const isCorrect = button.dataset.option === quizData.answer;
        
        quizWrapper.querySelectorAll('.quiz-option-btn').forEach(btn => btn.disabled = true);
        if (isCorrect) {
            button.classList.add('correct');
        } else {
            button.classList.add('incorrect');
            const correctBtn = quizWrapper.querySelector(`.quiz-option-btn[data-option="${quizData.answer}"]`);
            if (correctBtn) correctBtn.classList.add('correct');
        }

        const explanationDiv = quizWrapper.querySelector('.quiz-explanation');
        explanationDiv.innerHTML = DOMPurify.sanitize(marked.parse(`
            <span class="font-bold">${isCorrect ? 'Chính xác!' : 'Chưa chính xác.'}</span>
            <p class="mt-2">${quizData.explanation}</p>
        `));
        explanationDiv.classList.remove('hidden');
        explanationDiv.classList.add(isCorrect ? 'correct' : 'incorrect');

    } else if (e.target.closest('.check-learning-quiz-btn')) {
         const checkBtn = e.target.closest('.check-learning-quiz-btn');
         const quizData = JSON.parse(quizWrapper.dataset.quizData);
         const isCorrect = checkSingleLearningQuizAnswer(quizWrapper, quizData);
         
         checkBtn.disabled = true;
         quizWrapper.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);

    } else if (e.target.closest('.flashcard-quiz')) {
         const cardInner = quizWrapper.querySelector('.flashcard-inner');
         cardInner.classList.toggle('flipped');
    } else if (e.target.closest('.flashcard-nav-btn')) {
         const navBtn = e.target.closest('.flashcard-nav-btn');
         let cardIndex = parseInt(quizWrapper.dataset.cardIndex);
         const totalCards = JSON.parse(quizWrapper.dataset.quizData).cards.length;

         if (navBtn.classList.contains('next-btn')) {
             cardIndex = (cardIndex + 1) % totalCards;
         } else {
             cardIndex = (cardIndex - 1 + totalCards) % totalCards;
         }
         
         quizWrapper.dataset.cardIndex = cardIndex;
         quizWrapper.querySelector('.flashcard-counter').textContent = `${cardIndex + 1}/${totalCards}`;
         
         quizWrapper.querySelector('.flashcard-inner').style.transform = 'rotateY(0deg)';
         quizWrapper.querySelectorAll('.flashcard-face').forEach(face => face.classList.add('hidden', 'opacity-0'));
         quizWrapper.querySelectorAll(`.flashcard-front`)[cardIndex].classList.remove('hidden', 'opacity-0');

    }
});

// --- DARK MODE TOGGLE ---
const themeToggleBtn = document.getElementById('theme-toggle-btn');
themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Load theme from local storage
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    try {
        model = getGenerativeModel(getAI(app), { model: GEMINI_MODEL_NAME });
        updateStatus('success', "Mô hình AI đã sẵn sàng!");
        updateDynamicControls();
        renderMath();
    } catch (e) {
        updateStatus('error', `Lỗi khởi tạo AI: ${e.message}`);
    }
    lucide.createIcons();
});
