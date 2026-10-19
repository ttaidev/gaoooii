import React, { useState } from 'react';
import { X, Sparkles, Check, RotateCcw } from 'lucide-react';
import { CardConfig } from '../config/cardConfig';

interface CustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: CardConfig;
  onSave: (newConfig: CardConfig) => void;
  onResetToDefault: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onResetToDefault,
}) => {
  const [recipient, setRecipient] = useState(config.recipient);
  const [p1, setP1] = useState(config.greetingParagraphs[0] || '');
  const [p2, setP2] = useState(config.greetingParagraphs[1] || '');
  const [p3, setP3] = useState(config.greetingParagraphs[2] || '');
  const [signature, setSignature] = useState(config.signature);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...config,
      recipient,
      greetingParagraphs: [p1, p2, p3].filter((p) => p.trim() !== ''),
      signature,
    });
    onClose();
  };

  const handleReset = () => {
    onResetToDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white/95 rounded-3xl shadow-2xl border border-rose-100 max-w-lg w-full p-6 sm:p-7 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="font-serif text-lg font-bold text-slate-800">
              Tùy Chỉnh Thiệp 20/10
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Người nhận:
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Happy women's day"
              className="w-full px-3.5 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 bg-rose-50/30"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Đoạn văn 1 (Dẫn dắt & Ý nghĩa):
            </label>
            <textarea
              rows={3}
              value={p1}
              onChange={(e) => setP1(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 bg-rose-50/30 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Đoạn văn 2 (Lời chúc chính):
            </label>
            <textarea
              rows={3}
              value={p2}
              onChange={(e) => setP2(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 bg-rose-50/30 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Đoạn văn 3 (Lời chúc kết):
            </label>
            <textarea
              rows={2}
              value={p3}
              onChange={(e) => setP3(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 bg-rose-50/30 text-xs sm:text-sm"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Chữ ký / Lời kết:
            </label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Thân ái & Yêu thương,"
              className="w-full px-3.5 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 bg-rose-50/30"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-rose-100">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-rose-600 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Khôi phục mặc định
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium text-xs shadow-md shadow-rose-200 hover:opacity-95 transition"
              >
                <Check className="w-3.5 h-3.5" />
                Lưu lời chúc
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
