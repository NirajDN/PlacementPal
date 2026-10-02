import React, { useState } from 'react';
import QuestionCard from '../components/QuestionCard';
import AnswerInput from '../components/AnswerInput';
import FeedbackCard from '../components/FeedbackCard';
import FollowUpCard from '../components/FollowUpCard';
import { evaluateUserAnswer, getFollowUpQuestion, getNextQuestion, getInterviewSummary } from '../services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function InterviewRoom({ sessionData, onFinishInterview, onEndEarly }) {
  const [currentStep, setCurrentStep] = useState({
    index: sessionData.currentQuestionIndex || 1,
    total: sessionData.totalQuestions || 5,
    category: sessionData.category || 'DSA',
    difficulty: sessionData.difficulty || 'Medium',
    questionText: sessionData.questionText || ''
  });

  const [phase, setPhase] = useState('answering'); // 'answering' | 'evaluating' | 'feedback' | 'finished'
  const [evaluation, setEvaluation] = useState(null);
  const [followUp, setFollowUp] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  // Handle user submitting their answer
  const handleSubmitAnswer = async (userAnswer) => {
    setErrorMsg(null);
    setPhase('evaluating');
    setLoadingMsg('AI is evaluating your answer...');

    try {
      // 1. Evaluate answer
      const evalRes = await evaluateUserAnswer(
        sessionData.sessionId,
        currentStep.index,
        currentStep.questionText,
        userAnswer
      );

      setEvaluation(evalRes.evaluation);

      // 2. Fetch adaptive follow-up
      setLoadingMsg('Generating interviewer follow-up question...');
      const followUpRes = await getFollowUpQuestion(
        sessionData.sessionId,
        currentStep.index,
        currentStep.questionText,
        userAnswer,
        evalRes.evaluation
      );

      setFollowUp(followUpRes.followUp);
      setPhase('feedback');
    } catch (err) {
      console.error("Evaluation error:", err);
      setErrorMsg("PlacementPal couldn't reach the AI interviewer. Please try again.");
      setPhase('answering');
    }
  };

  // Handle Skipping a Question
  const handleSkipQuestion = async () => {
    handleSubmitAnswer(''); // Submit blank answer for skip evaluation
  };

  // Advance to next question or complete interview
  const handleContinueNext = async () => {
    setErrorMsg(null);
    setPhase('evaluating');
    setLoadingMsg('Preparing your next interview question...');

    try {
      const nextRes = await getNextQuestion(sessionData.sessionId);

      if (nextRes.isFinished) {
        setLoadingMsg('Compiling your final placement performance report...');
        const summaryRes = await getInterviewSummary(sessionData.sessionId);
        onFinishInterview(summaryRes.summary);
      } else {
        setCurrentStep(prev => ({
          ...prev,
          index: nextRes.currentQuestionIndex,
          questionText: nextRes.questionText
        }));
        setEvaluation(null);
        setFollowUp(null);
        setPhase('answering');
      }
    } catch (err) {
      console.error("Next question error:", err);
      setErrorMsg(err.message || "Failed to load next question.");
      setPhase('feedback');
    }
  };

  const progressPercent = Math.round((currentStep.index / currentStep.total) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Top Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Question {currentStep.index} of {currentStep.total}</span>
          <span>{progressPercent}% Complete</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Error Banner */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
          <button 
            onClick={() => setErrorMsg(null)}
            className="text-rose-400 hover:text-white text-xs underline font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Question Card Display */}
      <QuestionCard
        currentQuestionIndex={currentStep.index}
        totalQuestions={currentStep.total}
        category={currentStep.category}
        difficulty={currentStep.difficulty}
        questionText={currentStep.questionText}
      />

      {/* Answering Phase */}
      {phase === 'answering' && (
        <AnswerInput
          onSubmit={handleSubmitAnswer}
          onSkip={handleSkipQuestion}
          onEndInterview={onEndEarly}
          isLoading={false}
        />
      )}

      {/* Evaluating Loading Overlay */}
      {phase === 'evaluating' && (
        <div className="glass-card rounded-2xl p-12 text-center space-y-4 border border-indigo-900/40">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-base font-semibold text-white tracking-wide">
            {loadingMsg}
          </p>
          <p className="text-xs text-slate-400 font-mono">
            Google Gemma Open-Weight Model is analyzing your response
          </p>
        </div>
      )}

      {/* Feedback & Followup Phase */}
      {phase === 'feedback' && (
        <div className="space-y-8">
          <FeedbackCard evaluation={evaluation} />

          <FollowUpCard
            followUpQuestion={followUp}
            onContinue={handleContinueNext}
            isLastQuestion={currentStep.index === currentStep.total}
          />
        </div>
      )}

    </div>
  );
}
