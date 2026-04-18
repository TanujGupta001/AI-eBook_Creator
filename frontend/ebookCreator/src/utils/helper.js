// ✅ Escape HTML to prevent XSS
export const escapeHtml = (unsafe) => {
  if (!unsafe) return "";

  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// ✅ Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Please enter a valid email address";

  return "";
};

// ✅ Password validation
export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6)
    return "Password must be at least 6 characters";

  return "";
};

// ✅ Name validation
export function validateName(name) {
  if (!name || typeof name !== "string") {
    return "Name is required";
  }

  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return "Name must be at least 2 characters";
  }

  if (trimmed.length > 50) {
    return "Name cannot exceed 50 characters";
  }

  return "";
}

// ✅ Markdown formatter (FIXED)
export function formatMdContent(content = "") {
  const safeContent = escapeHtml(content);

  return safeContent
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || "text";
      return `<pre class="bg-slate-900 text-slate-100 rounded-lg p-4 my-4 overflow-x-auto"><code class="language-${language} text-sm font-mono">${code.trim()}</code></pre>`;
    })

    // Inline code
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    )

    // Headings
    .replace(
      /^### (.*$)/gm,
      "<h3 class='text-xl font-bold mt-6 mb-4 text-slate-900'>$1</h3>"
    )
    .replace(
      /^## (.*$)/gm,
      "<h2 class='text-2xl font-bold mt-8 mb-4 text-slate-900'>$1</h2>"
    )
    .replace(
      /^# (.*$)/gm,
      "<h1 class='text-3xl font-bold mt-8 mb-6 text-slate-900'>$1</h1>"
    )

    // Bold & Italic
    .replace(
      /\*\*(.*?)\*\*/g,
      "<strong class='font-semibold text-slate-900'>$1</strong>"
    )
    .replace(
      /\*(.*?)\*/g,
      "<em class='italic text-slate-700'>$1</em>"
    )

    // Blockquote
    .replace(
      /^> (.*$)/gm,
      "<blockquote class='text-slate-700 italic border-l-4 border-violet-500 pl-4 my-4 bg-violet-50/50 py-2 rounded-r'>$1</blockquote>"
    )

    // Lists - Step A
    .replace(
      /^\- (.*$)/gm,
      "<li class='ml-6 mb-2 text-slate-700 ul-item'>$1</li>"
    )
    .replace(
      /^\d+\. (.*$)/gm,
      "<li class='ml-6 mb-2 text-slate-700 ol-item'>$1</li>"
    )

    // Lists - Step B (UL) ✅ FIXED regex (supports ' and ")
    .replace(
      /((?:<li [^>]*class=['"][^'"]*ul-item[^'"]*['"][^>]*>.*?<\/li>(?:\n|$))+)/g,
      "<ul class='list-disc my-4'>$1</ul>"
    )

    // Lists - Step C (OL) ✅ FIXED regex
    .replace(
      /((?:<li [^>]*class=['"][^'"]*ol-item[^'"]*['"][^>]*>.*?<\/li>(?:\n|$))+)/g,
      "<ol class='list-decimal my-4'>$1</ol>"
    )

    // Paragraphs
    .split("\n\n")
    .map((paragraph) => {
      paragraph = paragraph.trim();
      if (!paragraph) return "";

      // Don't wrap HTML tags
      if (paragraph.startsWith("<")) return paragraph;

      return `<p class="text-slate-700 leading-relaxed mb-4">${paragraph}</p>`;
    })
    .join("");
}