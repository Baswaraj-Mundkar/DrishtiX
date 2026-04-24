/**
 * DrishtiX Quiz Engine
 * Dynamic 10-question randomized quiz from a pool of 50.
 * Shuffles options for each question.
 */

document.addEventListener('DOMContentLoaded', async () => {
    if (!window.i18n) {
        console.error("i18n.js not found!");
        return;
    }

    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;
    let userAnswers = [];

    const elements = {
        app: document.getElementById('quiz-app'),
        loading: document.getElementById('quiz-loading'),
        active: document.getElementById('quiz-active'),
        result: document.getElementById('quiz-result'),
        progress: document.getElementById('quiz-progress'),
        count: document.getElementById('question-count'),
        text: document.getElementById('question-text'),
        options: document.getElementById('options-container'),
        score: document.getElementById('final-score'),
        title: document.getElementById('result-title'),
        desc: document.getElementById('result-desc')
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const initQuiz = (retryCount = 0) => {
        elements.loading.style.display = 'block';
        elements.active.style.display = 'none';
        elements.result.style.display = 'none';

        console.log(`quiz_engine: Initializing (Attempt ${retryCount + 1})...`);

        if (window.i18n && window.i18n.isReady) {
            console.log("quiz_engine: i18n is ready, starting quiz.");
            startQuiz();
        } else {
            console.warn("quiz_engine: i18n not ready yet. Waiting for 'languageChanged' event...");
            
            // Failsafe: if after 5 seconds was haven't started, try to force it if locales exist
            if (retryCount < 5) {
                setTimeout(() => {
                    if (currentQuestions.length === 0) {
                        initQuiz(retryCount + 1);
                    }
                }, 1000);
            } else if (window.i18n && window.i18n.locales && window.i18n.locales['en']) {
                console.error("quiz_engine: i18n.isReady timeout. Forcing start with available locales.");
                startQuiz();
            }
        }
    };

    const startQuiz = () => {
        // Pick 10 random question IDs from 1 to 50
        const allIds = Array.from({length: 50}, (_, i) => i + 1);
        const shuffledIds = shuffleArray([...allIds]).slice(0, 10);
        
        currentQuestions = shuffledIds.map(id => {
            const rawCorrect = window.i18n.t(`q${id}_c`);
            // Standardize correct answer to a, b, or c. If missing/invalid, default to 'a'
            const correctKeyChar = ['a', 'b', 'c'].includes(rawCorrect.toLowerCase()) ? rawCorrect.toLowerCase() : 'a';
            
            return {
                id: id,
                q: window.i18n.t(`q${id}_q`),
                options: [
                    { id: 'a', text: window.i18n.t(`q${id}_a1`), isCorrect: correctKeyChar === 'a' },
                    { id: 'b', text: window.i18n.t(`q${id}_a2`), isCorrect: correctKeyChar === 'b' },
                    { id: 'c', text: window.i18n.t(`q${id}_a3`), isCorrect: correctKeyChar === 'c' }
                ]
            };
        });

        currentIndex = 0;
        score = 0;
        userAnswers = [];

        elements.loading.style.display = 'none';
        elements.active.style.display = 'block';
        renderQuestion();
    };

    const renderQuestion = () => {
        const qData = currentQuestions[currentIndex];
        
        // Update Progress
        const percent = ((currentIndex) / 10) * 100;
        elements.progress.style.width = `${percent}%`;
        elements.count.innerText = window.i18n.t('quiz_q_count', { current: currentIndex + 1 });
        
        // Update Text
        elements.text.innerText = qData.q;
        
        // Update Options with Shuffling
        elements.options.innerHTML = '';
        const shuffledOptions = shuffleArray([...qData.options]);
        
        shuffledOptions.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'option-card';
            btn.innerHTML = `<span>${opt.text}</span>`;
            btn.onclick = () => handleChoice(opt.isCorrect, btn);
            elements.options.appendChild(btn);
        });
    };

    let isTransitioning = false;

    const handleChoice = (isCorrect, element) => {
        if (isTransitioning) return;
        isTransitioning = true;

        if (isCorrect) score++;
        
        element.classList.add('selected');
        element.classList.add(isCorrect ? 'correct' : 'wrong');

        setTimeout(() => {
            currentIndex++;
            isTransitioning = false;
            if (currentIndex < 10) {
                renderQuestion();
            } else {
                showResults();
            }
        }, 600); // Slightly longer for feedback
    };

    const showResults = () => {
        elements.active.style.display = 'none';
        elements.result.style.display = 'block';
        elements.progress.style.width = '100%';
        
        // Update final score display
        elements.score.innerText = score;
        
        // Determine result category
        let resKey = 'caution';
        if (score === 10) resKey = 'master';
        else if (score >= 8) resKey = 'savvy';
        else if (score >= 5) resKey = 'develop';

        // Localize and display result title, icon and description
        const iconElem = document.getElementById('result-icon');
        if (iconElem) {
            iconElem.innerText = window.i18n.t(`quiz_res_${resKey}_i`);
        }
        elements.title.innerText = window.i18n.t(`quiz_res_${resKey}_t`);
        elements.desc.innerText = window.i18n.t(`quiz_res_${resKey}_d`);
    };

    // React to language change event from i18n.js
    document.addEventListener('languageChanged', () => {
        // If quiz hasn't started or is finished, we can safely init/restart
        // If mid-quiz, we just want to re-render the current question to update text
        if (currentQuestions.length === 0 || currentIndex >= 10) {
            initQuiz();
        } else {
            // Re-map the current questions to update their text from the new locale
            currentQuestions = currentQuestions.map(item => {
                const id = item.id;
                const rawCorrect = window.i18n.t(`q${id}_c`);
                const correctKeyChar = ['a', 'b', 'c'].includes(rawCorrect.toLowerCase()) ? rawCorrect.toLowerCase() : 'a';
                
                return {
                    id: id,
                    q: window.i18n.t(`q${id}_q`),
                    options: [
                        { id: 'a', text: window.i18n.t(`q${id}_a1`), isCorrect: correctKeyChar === 'a' },
                        { id: 'b', text: window.i18n.t(`q${id}_a2`), isCorrect: correctKeyChar === 'b' },
                        { id: 'c', text: window.i18n.t(`q${id}_a3`), isCorrect: correctKeyChar === 'c' }
                    ]
                };
            });
            renderQuestion();
        }
    });

    initQuiz();
});
