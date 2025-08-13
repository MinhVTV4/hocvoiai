<!DOCTYPE html>
<html lang="vi" class="">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trợ lý AI v3 - Nền tảng Học tập Hiện đại</title>
    
    <!-- External CSS -->
    <link rel="stylesheet" href="style.css">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- KaTeX for Math Formulas -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js" crossorigin="anonymous"></script>
    
    <!-- Marked.js for Markdown rendering -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    
    <!-- DOMPurify to sanitize HTML from Markdown -->
    <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>

</head>
<body class="text-gray-800 dark:bg-gray-900 dark:text-gray-200">

    <div id="app-container" class="container mx-auto p-4 md:p-6 max-w-7xl">
        <!-- AUTHENTICATION HEADER -->
        <div id="auth-header" class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-2">
                <i data-lucide="brain-circuit" class="w-8 h-8 text-indigo-500"></i>
                <span class="font-bold text-xl">EduAI</span>
            </div>
            <div class="flex items-center gap-4">
                <button id="theme-toggle-btn" class="btn btn-ghost p-2">
                    <i data-lucide="sun" class="w-5 h-5 block dark:hidden"></i>
                    <i data-lucide="moon" class="w-5 h-5 hidden dark:block"></i>
                </button>
                <div id="user-info" class="hidden items-center gap-4">
                    <button id="history-btn" class="btn btn-secondary text-sm"><i data-lucide="history" class="w-4 h-4 mr-2"></i>Lịch sử</button>
                    <img id="user-avatar" class="w-10 h-10 rounded-full" src="" alt="User Avatar">
                    <div class="text-sm">
                        <div class="font-semibold" id="user-name"></div>
                        <button id="logout-btn" class="text-xs text-gray-500 dark:text-gray-400 hover:underline">Đăng xuất</button>
                    </div>
                </div>
                <div id="login-container">
                    <button id="login-btn" class="btn btn-primary flex items-center gap-2">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.021,35.596,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                        <span>Đăng nhập</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- SETTINGS VIEW (VIEW 1) -->
        <div id="controls-view">
            <header class="text-center mb-10">
                <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-4">Trợ lý Giáo dục AI</h1>
                <p class="text-lg text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">Kiến tạo bài tập & Luyện tập kỹ năng chuyên biệt theo yêu cầu của bạn.</p>
            </header>
            <main>
                <div id="controls" class="card p-6 md:p-8 max-w-4xl mx-auto">
                    <div class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center"><i data-lucide="swords" class="w-5 h-5 mr-3 text-indigo-500"></i>Chọn chế độ</h2>
                        <div class="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-xl max-w-lg mx-auto">
                            <button id="mode-practice-btn" class="w-1/3 p-2 rounded-lg font-semibold text-sm transition-all bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow">Luyện tập</button>
                            <button id="mode-interactive-btn" class="w-1/3 p-2 rounded-lg font-semibold text-sm transition-all text-gray-500 dark:text-gray-400">Tương tác</button>
                            <button id="mode-learning-btn" class="w-1/3 p-2 rounded-lg font-semibold text-sm transition-all text-gray-500 dark:text-gray-400">Học tập</button>
                        </div>
                        <input type="hidden" id="mode-select" value="practice">
                    </div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8">
                        <div class="space-y-6">
                            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-3 flex items-center"><i data-lucide="settings-2" class="w-5 h-5 mr-3 text-indigo-500"></i>1. Cài đặt chung</h2>
                            <div>
                                <label for="subject-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Môn học</label>
                                <select id="subject-select" class="input-base">
                                    <option value="general">Môn học chung</option>
                                    <option value="english">Tiếng Anh</option>
                                    <option value="mathematics">Toán</option>
                                </select>
                            </div>
                            <div id="skill-select-container" class="hidden">
                                <label for="skill-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kỹ năng</label>
                                <select id="skill-select" class="input-base">
                                    <option value="vocabulary">Từ vựng</option>
                                    <option value="grammar">Ngữ pháp</option>
                                    <option value="reading">Đọc hiểu</option>
                                    <option value="listening">Nghe hiểu</option>
                                    <option value="writing">Luyện viết</option>
                                    <option value="conversation">Hội thoại</option>
                                </select>
                            </div>
                            <div id="math-level-select-container" class="hidden">
                                <label for="math-level-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cấp độ</label>
                                <select id="math-level-select" class="input-base">
                                    <option value="intermediate">Lớp 6-9 (Cơ bản)</option>
                                    <option value="advanced">Lớp 10-12 (Trung bình)</option>
                                    <option value="expert">Nâng cao (Khó)</option>
                                </select>
                            </div>
                            <div id="level-select-container" class="hidden">
                                <label for="level-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cấp độ (CEFR)</label>
                                <select id="level-select" class="input-base">
                                    <option value="A2">A2 (Sơ cấp)</option>
                                    <option value="B1" selected>B1 (Trung cấp)</option>
                                    <option value="B2">B2 (Trung-cao cấp)</option>
                                    <option value="C1">C1 (Cao cấp)</option>
                                    <option value="C2">C2 (Thành thạo)</option>
                                </select>
                            </div>
                        </div>
                        <div id="dynamic-controls-container" class="space-y-6"></div>
                    </div>
                    <div class="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                        <button id="generateButton" class="btn btn-primary w-full md:w-auto text-base py-3 px-10 transform hover:-translate-y-1">
                            <i data-lucide="wand-2" class="w-5 h-5 mr-2"></i>
                            <span id="buttonText">Bắt đầu Luyện tập</span>
                            <svg id="buttonSpinner" class="spinner h-5 w-5 text-white hidden ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </button>
                    </div>
                </div>
                 <div id="statusMessage" class="mt-6 text-center font-semibold"></div>
            </main>
        </div>

        <!-- EXERCISE VIEW (VIEW 2) -->
        <div id="exercise-view" class="hidden">
             <div class="max-w-4xl mx-auto">
                <div class="card p-6 md:p-8 mb-6">
                    <h2 class="text-3xl font-bold text-center text-gray-800 dark:text-white">BÀI KIỂM TRA</h2>
                    <div class="mt-6 text-center border-t border-b border-gray-200 dark:border-gray-700 py-4">
                        <div id="paper-subject" class="font-bold text-indigo-600 dark:text-indigo-400"></div>
                        <div id="paper-details" class="text-sm text-gray-500 dark:text-gray-400 mt-1"></div>
                        <div id="paper-score" class="hidden font-bold mt-2 text-2xl text-green-600 dark:text-green-400"></div>
                    </div>
                </div>

                <!-- AUDIO PLAYER CONTAINER -->
                <div id="audio-player-container" class="hidden mb-6 card p-4">
                    <h3 class="font-bold mb-3 text-lg text-gray-800 dark:text-gray-200">Bài nghe</h3>
                    <div class="flex items-center gap-4">
                        <button id="play-audio-btn" class="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-full shadow-md">
                            <i data-lucide="play" class="w-6 h-6"></i>
                        </button>
                        <div id="audio-status" class="font-semibold text-gray-600 dark:text-gray-300">Nhấn để nghe</div>
                    </div>
                    <button id="show-transcript-btn" class="text-sm text-sky-600 hover:underline mt-3">Hiện lời thoại</button>
                    <div id="transcript-container" class="hidden mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-300 text-sm italic"></div>
                </div>

                <!-- Practice Mode -->
                <div id="practice-mode-container">
                    <div id="exercise-list-container"></div>
                    <div id="practice-footer" class="mt-8 text-center">
                        <button id="checkAllAnswersButton" class="btn btn-primary bg-blue-600 hover:bg-blue-700 text-lg py-3 px-8">
                            Chấm bài
                        </button>
                        <div id="practice-actions-container" class="hidden mt-4 flex justify-center gap-4">
                            <button id="restart-practice-btn" class="btn btn-primary"><i data-lucide="rotate-cw" class="w-5 h-5 mr-2 inline-block"></i>Làm lại</button>
                            <button id="change-settings-from-practice-btn" class="btn btn-secondary"><i data-lucide="sliders-horizontal" class="w-5 h-5 mr-2 inline-block"></i>Đổi cài đặt</button>
                        </div>
                    </div>
                </div>
                <!-- Interactive Mode -->
                <div id="interactive-mode-container" class="hidden">
                    <div id="interactive-header" class="flex justify-between items-center mb-4 p-4 card">
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div id="progress-bar" class="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style="width: 0%"></div>
                        </div>
                        <div class="font-semibold text-gray-600 dark:text-gray-300 text-sm whitespace-nowrap ml-4">
                            <span id="progress-text">Câu 0 / 0</span>
                        </div>
                    </div>
                    <div id="interactive-passage-host" class="mb-6"></div>
                    <div id="interactive-question-host" class="fade-in"></div>
                    <div id="interactive-footer" class="mt-6 text-center"></div>
                </div>
             </div>
        </div>
        
        <!-- WRITING VIEW -->
        <div id="writing-view" class="hidden max-w-4xl mx-auto">
            <div class="card p-6 md:p-8">
                <h2 id="writing-topic" class="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Chủ đề Viết</h2>
                <textarea id="writing-input" class="input-base w-full min-h-[300px]" placeholder="Viết bài của bạn ở đây..."></textarea>
                <div id="writing-footer">
                    <div class="text-right my-4 font-semibold text-gray-600 dark:text-gray-400" id="word-count">0 từ</div>
                    <button id="get-feedback-btn" class="btn btn-primary w-full">
                        <span class="btn-text">Nhận phản hồi từ AI</span>
                        <svg class="spinner h-5 w-5 text-white hidden ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </button>
                    <div id="writing-feedback-container" class="mt-8 space-y-4 prose-feedback"></div>
                    <div id="writing-actions-container" class="hidden mt-4 flex justify-center gap-4">
                        <button id="restart-writing-btn" class="btn btn-primary"><i data-lucide="rotate-cw" class="w-5 h-5 mr-2 inline-block"></i>Làm lại</button>
                        <button id="change-settings-from-writing-btn" class="btn btn-secondary"><i data-lucide="sliders-horizontal" class="w-5 h-5 mr-2 inline-block"></i>Đổi cài đặt</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- CONVERSATION VIEW -->
        <div id="conversation-view" class="hidden max-w-4xl mx-auto">
            <div class="card p-6 md:p-8">
                <h2 id="conversation-topic" class="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">Hội thoại thực hành</h2>
                <div id="conversation-log" class="h-96 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex flex-col gap-4">
                    <!-- Messages will be appended here -->
                </div>
                <div id="conversation-footer">
                    <div id="conversation-input-area" class="flex gap-4 items-center">
                        <input type="text" id="conversation-text-input" class="input-base flex-grow" placeholder="Gõ câu trả lời...">
                        <button id="send-text-btn" class="btn btn-primary bg-blue-600 hover:bg-blue-700 p-3 rounded-lg"><i data-lucide="send" class="w-5 h-5"></i></button>
                    </div>
                    <button id="end-conversation-btn" class="btn bg-red-600 hover:bg-red-700 text-white w-full mt-6">Kết thúc & Nhận xét</button>
                </div>
            </div>
        </div>

        <!-- LEARNING VIEW -->
        <div id="learning-view" class="hidden">
            <div class="max-w-4xl mx-auto">
                <div class="card p-6 md:p-8 mb-6">
                    <div class="flex justify-between items-center">
                        <div>
                            <h2 id="learning-path-title" class="text-2xl font-bold text-gray-800 dark:text-white">Lộ trình học tập</h2>
                            <p id="learning-path-subject" class="text-sm text-gray-500 dark:text-gray-400 mt-1"></p>
                        </div>
                        <button id="change-settings-from-learning-btn" class="btn btn-secondary"><i data-lucide="sliders-horizontal" class="w-5 h-5 mr-2 inline-block"></i>Đổi cài đặt</button>
                    </div>
                </div>
                <div id="learning-content" class="space-y-4">
                    <!-- Learning path and lessons will be appended here -->
                </div>
            </div>
        </div>


        <!-- SUMMARY VIEW (VIEW 3) -->
        <div id="summary-view" class="hidden">
            <div class="text-center max-w-2xl mx-auto card p-8 fade-in">
                <i data-lucide="award" class="w-20 h-20 text-amber-500 mx-auto"></i>
                <h2 class="text-3xl font-bold text-gray-800 dark:text-white mt-4">Hoàn thành!</h2>
                <p id="summary-text" class="text-lg text-gray-600 dark:text-gray-400 mt-2">Bạn đã trả lời đúng 0/0 câu.</p>
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 my-6"><div id="summary-progress-bar" class="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full" style="width: 0%"></div></div>
                <div id="summary-save-status" class="text-sm text-gray-500 dark:text-gray-400 mb-6"></div>
                <div class="flex justify-center gap-4 mt-8">
                    <button id="restart-quiz-btn" class="btn btn-primary"><i data-lucide="rotate-cw" class="w-5 h-5 mr-2 inline-block"></i>Làm lại</button>
                    <button id="change-settings-btn" class="btn btn-secondary"><i data-lucide="sliders-horizontal" class="w-5 h-5 mr-2 inline-block"></i>Đổi cài đặt</button>
                </div>
            </div>
        </div>
        
        <!-- HISTORY VIEW (VIEW 4) -->
        <div id="history-view" class="hidden">
            <div class="card p-6 md:p-8">
                <div class="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Lịch sử làm bài</h2>
                    <button id="back-to-main-btn" class="btn btn-secondary"><i data-lucide="arrow-left" class="w-4 h-4 mr-2"></i>Quay lại</button>
                </div>

                <!-- Tabs for history -->
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="-mb-px flex space-x-6" aria-label="Tabs">
                        <button id="practice-tab" class="tab-btn active whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">Luyện tập</button>
                        <button id="interactive-tab" class="tab-btn whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600">Tương tác</button>
                    </nav>
                </div>

                <div id="history-loading-spinner" class="text-center py-10 hidden">
                    <svg class="spinner h-8 w-8 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p class="mt-2 font-semibold">Đang tải lịch sử...</p>
                </div>

                <!-- Practice History Content -->
                <div id="practice-history-content">
                    <div id="practice-history-list" class="space-y-4 mt-6"></div>
                    <div id="no-practice-history" class="text-center py-10 text-gray-500 hidden">
                        <i data-lucide="archive-x" class="w-12 h-12 mx-auto mb-2"></i>
                        <p>Chưa có lịch sử luyện tập nào.</p>
                    </div>
                </div>

                <!-- Interactive History Content -->
                <div id="interactive-history-content" class="hidden">
                    <div id="interactive-history-list" class="space-y-4 mt-6"></div>
                    <div id="no-interactive-history" class="text-center py-10 text-gray-500 hidden">
                        <i data-lucide="archive-x" class="w-12 h-12 mx-auto mb-2"></i>
                        <p>Chưa có lịch sử tương tác nào.</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- MODAL FOR LESSONS (EXPAND/REINFORCE) -->
    <div id="lesson-modal" class="modal-overlay">
        <div class="modal-content">
            <div class="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-4">
                <h3 id="lesson-title" class="text-2xl font-bold">Bài học từ AI</h3>
                <button id="close-lesson-modal" class="text-gray-400 hover:text-red-500 transition-colors"><i data-lucide="x" class="w-6 h-6"></i></button>
            </div>
            <div id="lesson-content" class="space-y-4">
                <div class="spinner mx-auto"></div>
            </div>
        </div>
    </div>

    <!-- GENERIC ALERT MODAL -->
    <div id="alert-modal" class="modal-overlay">
        <div class="modal-content text-center">
            <h3 id="alert-modal-title" class="text-xl font-bold mb-4">Thông báo</h3>
            <p id="alert-modal-text" class="text-gray-600 dark:text-gray-300 mb-6"></p>
            <button id="close-alert-modal" class="btn btn-primary">Đã hiểu</button>
        </div>
    </div>

    <!-- NEW: SCROLL TO TOP BUTTON -->
    <button id="scroll-to-top-btn" title="Cuộn lên đầu trang">
        <i data-lucide="arrow-up" class="w-6 h-6"></i>
    </button>

    <!-- External JS -->
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js"></script>
    <script type="module" src="script.js"></script>
</body>
</html>
