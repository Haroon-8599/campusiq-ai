"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Search,
  Plus,
  Tag,
  CheckCircle2,
  Building2,
  X,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerItem {
  id: string;
  content: string;
  upvotes: number;
  isAccepted: boolean;
  user: { name: string; avatar: string | null; role: string };
  createdAt: string;
}

interface QuestionItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  views: number;
  upvotes: number;
  user: { name: string; avatar: string | null };
  college?: { name: string; shortName: string; slug: string } | null;
  answers: AnswerItem[];
  createdAt: string;
}

export default function CommunityPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Ask Question Modal State
  const [askModalOpen, setAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  // Answering State
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState("");

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const url = selectedTag
        ? `/api/questions?tag=${encodeURIComponent(selectedTag)}`
        : "/api/questions";
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [selectedTag]);

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const tagsArray = newTags
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);

      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          tags: tagsArray.length > 0 ? tagsArray : ["General"],
        }),
      });

      if (res.ok) {
        setAskModalOpen(false);
        setNewTitle("");
        setNewContent("");
        setNewTags("");
        loadQuestions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAnswer = async (questionId: string) => {
    if (!answerContent.trim()) return;

    try {
      const res = await fetch(`/api/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent }),
      });

      if (res.ok) {
        setAnsweringQuestionId(null);
        setAnswerContent("");
        loadQuestions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    searchQuery
      ? q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.content.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const popularTags = [
    "IIT Bombay",
    "NIT Trichy",
    "Placements",
    "CSE",
    "Branch Change",
    "Fees",
    "Hostels",
  ];

  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              CAMPUSIQ COMMUNITY
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold">
              Student Q&A
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Peer & Senior Discussions
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Ask authentic questions about campus culture, hostel realities, and placement trends.
          </p>
        </div>

        <button
          onClick={() => setAskModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-xs font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.25)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>
      </div>

      {/* Search & Tag filter bar */}
      <div className="space-y-3 mb-8">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussion threads, branch policies, or hostel FAQs..."
            className="w-full bg-white/90 border border-slate-200/90 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-bold mr-1">Trending Topics:</span>
          <button
            onClick={() => setSelectedTag("")}
            className={cn(
              "px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer",
              !selectedTag
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white/80 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-white"
            )}
          >
            All Topics
          </button>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? "" : tag)}
              className={cn(
                "px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer",
                selectedTag === tag
                  ? "bg-blue-50 text-blue-700 border-blue-200 shadow-xs"
                  : "bg-white/80 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-white"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Thread List */}
      <div className="space-y-6">
        {loading && (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-medium text-slate-500">Loading community discussions...</p>
          </div>
        )}

        {!loading && filteredQuestions.length === 0 && (
          <div className="p-12 text-center rounded-[28px] glass-card-light border border-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.03)] max-w-md mx-auto">
            <MessageSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No questions found</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">Be the first to post a query to seniors.</p>
            <button
              onClick={() => setAskModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Ask First Question
            </button>
          </div>
        )}

        {!loading &&
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-6 rounded-[28px] glass-card-light border border-white/90 shadow-[0_6px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all duration-300 space-y-4"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-800">{q.user.name}</span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(q.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    {q.college && (
                      <span className="text-[11px] font-bold text-blue-700 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/60">
                        {q.college.shortName}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">{q.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{q.content}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {q.tags?.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200/60 text-[11px] font-medium text-slate-600"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Action Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-semibold text-slate-700">{q.upvotes} Upvotes</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-semibold text-slate-700">{q.answers?.length || 0} Answers</span>
                  </span>
                </div>

                <button
                  onClick={() =>
                    setAnsweringQuestionId(answeringQuestionId === q.id ? null : q.id)
                  }
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {answeringQuestionId === q.id ? "Cancel Answer" : "Write an Answer"}
                </button>
              </div>

              {/* Inline Answer Form */}
              {answeringQuestionId === q.id && (
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <textarea
                    rows={3}
                    value={answerContent}
                    onChange={(e) => setAnswerContent(e.target.value)}
                    placeholder="Share your firsthand insight, cutoff experience, or advice..."
                    className="w-full bg-white/90 border border-slate-200/90 rounded-2xl p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
                  />
                  <button
                    onClick={() => handlePostAnswer(q.id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Answer</span>
                  </button>
                </div>
              )}

              {/* Answers List */}
              {q.answers && q.answers.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Verified Responses
                  </span>
                  {q.answers.map((ans) => (
                    <div
                      key={ans.id}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{ans.user.name}</span>
                          {ans.isAccepted && (
                            <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Verified Senior
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {new Date(ans.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-normal">{ans.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Ask Question Modal */}
      {askModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <form
            onSubmit={handlePostQuestion}
            className="w-full max-w-lg bg-white border border-white/90 rounded-[28px] p-6 sm:p-8 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Ask CampusIQ Community</h3>
              <button
                type="button"
                onClick={() => setAskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Question Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Is NIT Surathkal CSE better than IIT Goa CS for algorithmic trading?"
                className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Details & Context</label>
              <textarea
                required
                rows={4}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Include your rank, budget constraints, or specific queries about academics/hostels..."
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="e.g. Placements, IIT Bombay, CSE"
                className="w-full bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
            >
              Publish Question
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
