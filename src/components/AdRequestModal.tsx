import React, { useState, useEffect } from 'react';
import { AdDuration, AdPlacement, AdRequest, AppLanguage, UserProfile } from '../types';
import {
  submitAdRequest,
  getAdRequests,
  markAdAsPaidAndActivate,
  AD_PRICING_PLANS,
} from '../utils/adStorage';
import { isOwnerAdmin, OFFICIAL_OWNER_EMAIL } from '../utils/authStorage';
import {
  X,
  Megaphone,
  CheckCircle2,
  Clock,
  DollarSign,
  Upload,
  Link as LinkIcon,
  Building,
  Mail,
  Phone,
  FileText,
  Sparkles,
  Eye,
  ShieldCheck,
  Send,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Calendar,
  Check,
  Copy,
} from 'lucide-react';

interface AdRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLang: AppLanguage;
  currentUser?: UserProfile | null;
  initialPlacement?: AdPlacement;
  onOpenAdminPortal?: () => void;
}

const PRESET_LOGOS = [
  {
    name: 'Tech Hub',
    nameHy: 'ՏՏ Կենտրոն',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Language School',
    nameHy: 'Լեզվի Դպրոց',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Bookstore',
    nameHy: 'Գրախանութ',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Study Abroad',
    nameHy: 'Ուսում Արտերկրում',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80',
  },
];

export const AdRequestModal: React.FC<AdRequestModalProps> = ({
  isOpen,
  onClose,
  appLang,
  currentUser,
  initialPlacement = 'hero_top',
  onOpenAdminPortal,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'status'>('form');

  // Form inputs
  const [businessName, setBusinessName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>(currentUser?.email || '');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [headline, setHeadline] = useState<string>('');
  const [adText, setAdText] = useState<string>('');
  const [callToAction, setCallToAction] = useState<string>('Learn More');
  const [targetUrl, setTargetUrl] = useState<string>('https://example.com');
  const [imageUrl, setImageUrl] = useState<string>(PRESET_LOGOS[0].url);
  const [placement, setPlacement] = useState<AdPlacement>(initialPlacement);
  const [duration, setDuration] = useState<AdDuration>('30_days');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isEmailCopied, setIsEmailCopied] = useState<boolean>(false);

  const handleCopyOwnerEmail = () => {
    try {
      navigator.clipboard.writeText(OFFICIAL_OWNER_EMAIL);
      setIsEmailCopied(true);
      setTimeout(() => setIsEmailCopied(false), 2200);
    } catch {
      setIsEmailCopied(true);
      setTimeout(() => setIsEmailCopied(false), 2200);
    }
  };

  // Inquiries list for the tracking tab
  const [inquiries, setInquiries] = useState<AdRequest[]>(() => getAdRequests());

  // Keep email in sync if currentUser changes
  useEffect(() => {
    if (currentUser?.email && !contactEmail) {
      setContactEmail(currentUser.email);
    }
  }, [currentUser, contactEmail]);

  // Update placement if initialPlacement changes
  useEffect(() => {
    if (initialPlacement) {
      setPlacement(initialPlacement);
    }
  }, [initialPlacement]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Automatically refresh inquiries when modal opens
  useEffect(() => {
    if (isOpen) {
      setInquiries(getAdRequests());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Selected duration details and price
  const currentPlan = AD_PRICING_PLANS[duration] || AD_PRICING_PLANS['30_days'];
  const selectedPriceAMD = currentPlan.priceAMD;

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!businessName.trim()) {
      setFormError(appLang === 'hy' ? 'Խնդրում ենք լրացնել բիզնեսի անվանումը:' : 'Please enter your business or project name.');
      return;
    }
    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setFormError(appLang === 'hy' ? 'Խնդրում ենք մուտքագրել ճիշտ էլ. փոստ:' : 'Please enter a valid contact email address.');
      return;
    }
    if (!headline.trim()) {
      setFormError(appLang === 'hy' ? 'Լրացրեք գովազդի վերնագիրը:' : 'Please enter the ad headline.');
      return;
    }
    if (!adText.trim()) {
      setFormError(appLang === 'hy' ? 'Լրացրեք գովազդի տեքստը / նկարագրությունը:' : 'Please enter the ad description copy.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      submitAdRequest({
        businessName: businessName.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim() || undefined,
        headline: headline.trim(),
        adText: adText.trim(),
        callToAction: callToAction.trim() || (appLang === 'hy' ? 'Իմանալ ավելին' : 'Learn More'),
        targetUrl: targetUrl.trim() || 'https://',
        imageUrl: imageUrl.trim() || PRESET_LOGOS[0].url,
        placement,
        duration,
        price: selectedPriceAMD,
        currency: 'AMD',
        submitterUserId: currentUser?.id,
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);
      setInquiries(getAdRequests());
    }, 300);
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setBusinessName('');
    setHeadline('');
    setAdText('');
    setFormError(null);
  };

  const handleSimulatePayment = (adId: string) => {
    markAdAsPaidAndActivate(adId);
    setInquiries(getAdRequests());
  };

  const getPlacementTitle = (pl: AdPlacement) => {
    switch (pl) {
      case 'hero_top':
        return appLang === 'hy' ? 'Գլխավոր էջ (Top Hero Banner)' : 'Top Hero Banner';
      case 'sidebar_dashboard':
        return appLang === 'hy' ? 'Ուսանողի վահանակ (Student Dashboard)' : 'Student Dashboard Card';
      case 'lesson_footer':
        return appLang === 'hy' ? 'Դասերի բաժին (Lesson Partner)' : 'Lessons Inline Partner';
      case 'quiz_finish':
        return appLang === 'hy' ? 'Թեստի ավարտի էկրան (Quiz Rewards)' : 'Quiz Completion Rewards';
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity z-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-br from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {appLang === 'hy' ? 'Գովազդեք HayEnglish-ում' : 'Advertise with HayEnglish'}
                </h3>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px]">
                  B2B Partners
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                {appLang === 'hy'
                  ? 'Հասեք հազարավոր ակտիվ անգլերեն սովորող հայ ուսանողների ու մասնագետների:'
                  : 'Reach thousands of motivated Armenian students and English learners.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAdminPortal && isOwnerAdmin(currentUser) && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminPortal();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs cursor-pointer transition-all active:scale-95 shadow-xs"
                title={appLang === 'hy' ? 'Կայքի տիրոջ ադմին վահանակ' : 'Owner Super Admin Desk'}
              >
                <span>👑</span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>{appLang === 'hy' ? 'Ադմին (Տեր)' : 'Admin Desk'}</span>
              </button>
            )}

            {/* Robust Close X Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-all shadow-2xs z-20"
              aria-label={appLang === 'hy' ? 'Փակել' : 'Close'}
              title={appLang === 'hy' ? 'Փակել' : 'Close'}
            >
              <X className="w-5 h-5 stroke-2.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OFFICIAL WEBSITE OWNER & SUPER ADMIN CONTACT DISPLAY                      */}
        {/* "Send your advertisement request to: kurghinyanartyom2@gmail.com"         */}
        {/* ========================================================================= */}
        <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-2xl bg-linear-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 border-2 border-indigo-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Mail className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                  {appLang === 'hy' ? 'Կայքի տիրոջ պաշտոնական էլ. փոստ' : "Website Owner's Official Admin Email"}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {appLang === 'hy' ? 'Գովազդի ընդունում' : 'Ad Inquiries Desk'}
                </span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5 flex-wrap">
                <span>{appLang === 'hy' ? 'Ուղարկեք ձեր գովազդային հարցումը՝' : 'Send your advertisement request to:'}</span>
                <a
                  href={`mailto:${OFFICIAL_OWNER_EMAIL}?subject=Ad%20Placement%20Request%20-%20HayEnglish`}
                  className="text-indigo-700 hover:text-indigo-900 underline decoration-indigo-400 font-black inline-flex items-center gap-1"
                >
                  <span>{OFFICIAL_OWNER_EMAIL}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={handleCopyOwnerEmail}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-indigo-950 border border-indigo-200/80 font-bold text-xs cursor-pointer transition-all active:scale-95 shadow-2xs flex items-center gap-1.5"
              title="Copy Email Address"
            >
              {isEmailCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-3" />
                  <span className="text-emerald-700 font-extrabold">{appLang === 'hy' ? 'Պատճենված է' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{appLang === 'hy' ? 'Պատճենել' : 'Copy Email'}</span>
                </>
              )}
            </button>

            <a
              href={`mailto:${OFFICIAL_OWNER_EMAIL}?subject=Ad%20Placement%20Request%20-%20HayEnglish`}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs cursor-pointer transition-all shadow-2xs inline-flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{appLang === 'hy' ? 'Գրել նամակ' : 'Send Email'}</span>
            </a>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 px-4 sm:px-6 pt-2 bg-slate-50/40">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all ${
              activeTab === 'form'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {appLang === 'hy' ? '1. Լրացնել հայտը' : '1. Submit Request'}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('status');
              setInquiries(getAdRequests());
            }}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'status'
                ? 'border-indigo-600 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{appLang === 'hy' ? '2. Հայտերի կարգավիճակ' : '2. Track Requests'}</span>
            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] flex items-center justify-center font-black">
              {inquiries.length}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'form' ? (
            submitSuccess ? (
              /* Success Screen */
              <div className="py-6 sm:py-8 text-center space-y-5 max-w-lg mx-auto animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9 stroke-2.5" />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xl font-black text-slate-900">
                    {appLang === 'hy'
                      ? 'Գովազդի հարցումը հաջողությամբ ուղարկվեց:'
                      : 'Ad Placement Request Submitted!'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {appLang === 'hy'
                      ? 'Ձեր հարցումը գաղտնի ուղարկվել է ադմինիստրատորին: Ադմինը կվերանայի գովազդի նյութերը, կհաստատի այն, և վճարումը նշելուց հետո այն կհրապարակվի կայքում:'
                      : 'Your inquiry was sent privately to the admin. The admin will review details, approve it, and upon payment confirmation, your ad will go live.'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{appLang === 'hy' ? 'Բիզնես՝' : 'Business:'}</span>
                    <span className="font-bold text-slate-900">{businessName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{appLang === 'hy' ? 'Տեղադրություն՝' : 'Placement:'}</span>
                    <span className="font-bold text-indigo-700">{getPlacementTitle(placement)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{appLang === 'hy' ? 'Տևողություն՝' : 'Duration:'}</span>
                    <span className="font-bold text-slate-900">
                      {appLang === 'hy' ? currentPlan.labelHy : currentPlan.labelEn}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                    <span className="text-slate-600 font-bold">{appLang === 'hy' ? 'Ավտոմատ արժեք՝' : 'Selected Price:'}</span>
                    <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {selectedPriceAMD.toLocaleString()} AMD (֏)
                    </span>
                  </div>
                  <div className="flex justify-between pt-0.5">
                    <span className="text-slate-500">{appLang === 'hy' ? 'Կարգավիճակ՝' : 'Status:'}</span>
                    <span className="font-bold text-amber-800 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[11px]">
                      {appLang === 'hy' ? 'Սպասում է ադմինի հաստատմանը' : 'Pending Admin Review'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('status');
                      setInquiries(getAdRequests());
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs cursor-pointer shadow-sm transition-all"
                  >
                    {appLang === 'hy' ? 'Տեսնել հայտերի կարգավիճակը' : 'View Inquiries Status'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                  >
                    {appLang === 'hy' ? 'Ուղարկել նոր հայտ' : 'Submit Another Request'}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 active:scale-95 text-slate-600 font-bold text-xs cursor-pointer transition-all"
                  >
                    {appLang === 'hy' ? 'Փակել պատուհանը' : 'Close Window'}
                  </button>
                </div>
              </div>
            ) : (
              /* Submission Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in-50">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Submitter & Business Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appLang === 'hy' ? 'Բիզնեսի / կազմակերպության անվանում *' : 'Business / Name *'}</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder={appLang === 'hy' ? 'օր. Yerevan Language Academy' : 'e.g. Oxford Prep Armenia'}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appLang === 'hy' ? 'Կոնտակտային էլ. փոստ *' : 'Contact Email *'}</span>
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="contact@yourbusiness.am"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>

                {/* Headline and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appLang === 'hy' ? 'Գովազդի վերնագիր *' : 'Ad Headline *'}</span>
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder={appLang === 'hy' ? 'օր. Անգլերենի ինտենսիվ դասընթացներ Կենտրոնում' : 'e.g. Intensive English Course in Yerevan'}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appLang === 'hy' ? 'Հեռախոս (կամփոփ)' : 'Phone (Optional)'}</span>
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+374 99 12-34-56"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>

                {/* Ad Description Text */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{appLang === 'hy' ? 'Գովազդի տեքստ (նկարագրություն) *' : 'Ad Text / Description *'}</span>
                  </label>
                  <textarea
                    rows={2}
                    value={adText}
                    onChange={(e) => setAdText(e.target.value)}
                    placeholder={appLang === 'hy' ? 'Համառոտ ներկայացրեք ձեր ծառայությունը, առավելությունները կամ առաջարկվող զեղչը...' : 'Describe your service, key advantages, special student discounts, or contact info...'}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>

                {/* ========================================================================= */}
                {/* DURATION SELECTION & AUTOMATIC PRICING (EXPLICIT USER REQUIREMENT)        */}
                {/* 1 week — 4,000 AMD, 2 weeks — 8,000 AMD, 1 month — 12,000 AMD, 3 months — 25,000 AMD */}
                {/* ========================================================================= */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{appLang === 'hy' ? 'Ընտրեք գովազդի տևողությունը *' : 'Select Ad Duration & Plan *'}</span>
                    </label>
                    <span className="text-[11px] text-indigo-600 font-bold">
                      {appLang === 'hy' ? 'Գինը հաշվարկվում է ավտոմատ' : 'Price updates automatically'}
                    </span>
                  </div>

                  {/* 4 Interactive Duration Cards Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(Object.keys(AD_PRICING_PLANS) as AdDuration[]).map((durKey) => {
                      const plan = AD_PRICING_PLANS[durKey];
                      const isSelected = duration === durKey;

                      return (
                        <button
                          key={durKey}
                          type="button"
                          onClick={() => setDuration(durKey)}
                          className={`relative p-3 rounded-2xl border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                            isSelected
                              ? 'bg-linear-to-b from-indigo-50 to-blue-50 border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm'
                              : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700'
                          }`}
                        >
                          {/* Top badge if applicable */}
                          {plan.badgeEn && (
                            <span
                              className={`absolute -top-2 right-2 px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider ${
                                isSelected
                                  ? 'bg-indigo-600 text-white shadow-2xs'
                                  : 'bg-amber-100 text-amber-900 border border-amber-200'
                              }`}
                            >
                              {appLang === 'hy' ? plan.badgeHy : plan.badgeEn}
                            </span>
                          )}

                          <div className="space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900">
                                {appLang === 'hy' ? plan.labelHy : plan.labelEn}
                              </span>
                              {isSelected && (
                                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 stroke-3" />
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block">
                              {plan.days} {appLang === 'hy' ? 'օր' : 'days'}
                            </span>
                          </div>

                          <div className="mt-2 pt-1.5 border-t border-slate-200/60">
                            <span
                              className={`text-sm sm:text-base font-black ${
                                isSelected ? 'text-indigo-700' : 'text-slate-900'
                              }`}
                            >
                              {plan.priceAMD.toLocaleString()} AMD
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Automatic Price Calculation Display Box */}
                  <div className="p-3.5 rounded-2xl bg-linear-to-r from-emerald-500/10 via-indigo-500/10 to-blue-500/10 border border-emerald-300/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                        ֏
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">
                            {appLang === 'hy' ? 'Ընտրված սակագին՝ ' : 'Selected Duration: '}
                            <span className="text-indigo-700">
                              {appLang === 'hy' ? currentPlan.labelHy : currentPlan.labelEn}
                            </span>
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {appLang === 'hy'
                            ? 'Հաշվարկված գինը ներառում է ամբողջ ժամանակահատվածը (առանց թաքնված վճարների):'
                            : 'All-inclusive rate for the full duration. No setup or hidden fees.'}
                        </span>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {appLang === 'hy' ? 'Ավտոմատ գին' : 'Total Price'}
                      </span>
                      <span className="text-xl sm:text-2xl font-black text-emerald-700">
                        {selectedPriceAMD.toLocaleString()} AMD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Placement Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">
                    {appLang === 'hy' ? 'Ցանկալի տեղադրություն (Placement) *' : 'Desired Placement *'}
                  </label>
                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value as AdPlacement)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="hero_top">
                      {appLang === 'hy'
                        ? '🚀 Գլխավոր էջ (Top Hero Banner) — Առավելագույն տեսանելիություն'
                        : '🚀 Top Hero Banner — Highest visibility on homepage'}
                    </option>
                    <option value="sidebar_dashboard">
                      {appLang === 'hy'
                        ? '📊 Ուսանողի վահանակ (Student Dashboard) — Ակտիվ սովորողներ'
                        : '📊 Student Dashboard — Engaged active learners daily'}
                    </option>
                    <option value="lesson_footer">
                      {appLang === 'hy'
                        ? '📚 Դասերի ներքևում (Lesson Footer) — Կրթական գործընկեր'
                        : '📚 Lesson Footer — Native educational context'}
                    </option>
                    <option value="quiz_finish">
                      {appLang === 'hy'
                        ? '🎯 Օրական թեստի ավարտ (Quiz Completion Rewards)'
                        : '🎯 Daily Quiz Completion Rewards Screen'}
                    </option>
                  </select>
                </div>

                {/* Target URL and Button CTA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appLang === 'hy' ? 'Թիրախային հղում (Կայք կամ էջ)' : 'Destination Link (URL)'}</span>
                    </label>
                    <input
                      type="url"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://yoursite.am"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">
                      {appLang === 'hy' ? 'Կոճակի տեքստ (Call To Action)' : 'Button CTA Text'}
                    </label>
                    <input
                      type="text"
                      value={callToAction}
                      onChange={(e) => setCallToAction(e.target.value)}
                      placeholder={appLang === 'hy' ? 'օր. Գրանցվել զեղչով' : 'e.g. Claim 20% Discount'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>

                {/* Image / Logo Upload & Presets */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appLang === 'hy' ? 'Լոգո կամ պատկեր (Image or Logo)' : 'Image or Logo'}</span>
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {appLang === 'hy' ? 'Ընտրեք օրինակ կամ բեռնեք ֆայլ' : 'Choose preset or upload file'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="Ad Logo Preview"
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-200 shadow-xs"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold">
                          No Logo
                        </div>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {PRESET_LOGOS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setImageUrl(preset.url)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer transition-all active:scale-95 ${
                              imageUrl === preset.url
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            }`}
                          >
                            {appLang === 'hy' ? preset.nameHy : preset.name}
                          </button>
                        ))}

                        <label className="px-2.5 py-1 rounded-lg text-[11px] font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer inline-flex items-center gap-1 active:scale-95 transition-all">
                          <Upload className="w-3 h-3 text-slate-500" />
                          <span>{appLang === 'hy' ? 'Բեռնել ֆայլ' : 'Upload File'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://... image url"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time Live Ad Preview Card */}
                <div className="p-4 bg-slate-50/80 border border-slate-200/90 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{appLang === 'hy' ? 'Իրական նախադիտում (Live Ad Preview)' : 'Live Ad Preview'}</span>
                    </span>
                    <span className="text-[11px] text-indigo-600 font-bold">
                      {getPlacementTitle(placement)}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center gap-3">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 font-black flex items-center justify-center shrink-0">
                        {businessName ? businessName.charAt(0) : 'A'}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 text-amber-900">
                          {appLang === 'hy' ? 'Հովանավոր' : 'Sponsored'}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500 truncate">
                          {businessName || (appLang === 'hy' ? 'Ձեր բիզնեսի անվանումը' : 'Your Business Name')}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {headline || (appLang === 'hy' ? 'Գովազդի գրավիչ վերնագիր' : 'Catchy Ad Headline')}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {adText || (appLang === 'hy' ? 'Գովազդի նկարագրական տեքստը...' : 'Short description of your service or offer...')}
                      </p>
                    </div>

                    <span className="shrink-0 px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px]">
                      {callToAction || (appLang === 'hy' ? 'Իմանալ ավելին' : 'Learn More')}
                    </span>
                  </div>
                </div>

                {/* Workflow Note */}
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-900 text-xs flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <p className="leading-snug">
                    {appLang === 'hy'
                      ? 'Հայտը գաղտնի ուղարկվում է ադմինիստրատորին: Ադմինը կհաստատի այն, կստուգի տեղադրումը և վճարումը նշելուց հետո այն ավտոմատ կակտիվանա նշված տեղում:'
                      : 'The request is submitted privately to the admin. The admin reviews and approves it, and upon payment confirmation, the advertisement is published automatically.'}
                  </p>
                </div>

                {/* Actions: Submit & Cancel */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 transition-all disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {appLang === 'hy'
                            ? `Ուղարկել հայտը (${selectedPriceAMD.toLocaleString()} AMD)`
                            : `Submit Ad Request (${selectedPriceAMD.toLocaleString()} AMD)`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full sm:w-auto py-3.5 px-5 rounded-xl border border-slate-200 hover:bg-slate-100 active:scale-98 text-slate-700 font-bold text-xs cursor-pointer transition-all"
                  >
                    {appLang === 'hy' ? 'Չեղարկել' : 'Cancel'}
                  </button>
                </div>
              </form>
            )
          ) : (
            /* ========================================================================= */
            /* TAB 2: INQUIRIES & STATUS TRACKING                                         */
            /* ========================================================================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {appLang === 'hy' ? 'Բոլոր ներկայացված հայտերը' : 'Submitted Ad Requests'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {appLang === 'hy'
                      ? 'Դիտեք ադմինի հաստատումները, սահմանված գները և ակտիվ գովազդները:'
                      : 'Review admin approval statuses, pricing, and live published ads.'}
                  </p>
                </div>

                {onOpenAdminPortal && isOwnerAdmin(currentUser) && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAdminPortal();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-linear-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-xs active:scale-95 cursor-pointer transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <span>👑</span>
                    <span>{appLang === 'hy' ? 'Բացել ադմին վահանակը (Տեր)' : 'Open Admin Desk (Owner)'}</span>
                  </button>
                )}
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <Megaphone className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">
                    {appLang === 'hy' ? 'Դեռևս հայտեր չկան' : 'No ad requests submitted yet'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => {
                    const isPending = inq.status === 'pending_review';
                    const isApproved = inq.status === 'approved';
                    const isActive = inq.status === 'active';
                    const isRejected = inq.status === 'rejected';

                    const plan = AD_PRICING_PLANS[inq.duration] || AD_PRICING_PLANS['30_days'];
                    const displayPrice = inq.price ?? plan.priceAMD;

                    return (
                      <div
                        key={inq.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isActive
                            ? 'bg-emerald-50/50 border-emerald-200 shadow-2xs'
                            : isApproved
                            ? 'bg-blue-50/50 border-blue-200 shadow-2xs'
                            : isRejected
                            ? 'bg-rose-50/50 border-rose-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            {inq.imageUrl ? (
                              <img
                                src={inq.imageUrl}
                                alt={inq.businessName}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0">
                                {inq.businessName.charAt(0)}
                              </div>
                            )}

                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="font-extrabold text-sm text-slate-900">
                                  {inq.businessName}
                                </h5>
                                <span className="text-xs text-slate-400">• {inq.contactEmail}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-800">{inq.headline}</p>
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-0.5">
                                <span>{getPlacementTitle(inq.placement)}</span>
                                <span>•</span>
                                <span className="font-semibold text-slate-700">
                                  {appLang === 'hy' ? plan.labelHy : plan.labelEn}
                                </span>
                                <span>•</span>
                                <span className="font-bold text-indigo-700">
                                  {displayPrice.toLocaleString()} {inq.currency || 'AMD'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status Badge & Actions */}
                          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                            {isPending && (
                              <div className="flex flex-col sm:items-end gap-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                                  <span>{appLang === 'hy' ? 'Ուսումնասիրվում է' : 'Pending Review'}</span>
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {displayPrice.toLocaleString()} AMD
                                </span>
                              </div>
                            )}

                            {isApproved && (
                              <div className="flex flex-col sm:items-end gap-1">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 font-bold text-xs border border-blue-200">
                                  <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                                  <span>
                                    {appLang === 'hy' ? 'Հաստատված է՝ ' : 'Approved: '}
                                    {displayPrice.toLocaleString()} {inq.currency || 'AMD'}
                                  </span>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleSimulatePayment(inq.id)}
                                  className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs cursor-pointer shadow-2xs transition-colors"
                                >
                                  {appLang === 'hy' ? 'Վճարել և ակտիվացնել 💳' : 'Pay & Activate Ad 💳'}
                                </button>
                              </div>
                            )}

                            {isActive && (
                              <div className="space-y-0.5 sm:text-right">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-200">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{appLang === 'hy' ? 'Ակտիվ է կայքում ✅' : 'Live on Website ✅'}</span>
                                </span>
                                <p className="text-[11px] font-semibold text-emerald-800">
                                  {displayPrice.toLocaleString()} {inq.currency || 'AMD'} (Paid)
                                </p>
                              </div>
                            )}

                            {isRejected && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-bold text-xs border border-rose-200">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>{appLang === 'hy' ? 'Մերժված է' : 'Rejected'}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {inq.adminNotes && (
                          <div className="mt-2.5 p-2 rounded-xl bg-white/70 border border-slate-200/80 text-[11px] text-slate-600">
                            <span className="font-bold text-slate-700">
                              {appLang === 'hy' ? 'Ադմինի նշում՝ ' : 'Admin note: '}
                            </span>
                            <span>{inq.adminNotes}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
