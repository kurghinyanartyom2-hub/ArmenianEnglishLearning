import React, { useState, useEffect } from 'react';
import { AdRequest, AdStatus, AppLanguage, UserProfile } from '../types';
import {
  getAdRequests,
  reviewAndSetPrice,
  rejectAdRequest,
  markAdAsPaidAndActivate,
  deleteAdRequest,
  toggleAdActive,
  AD_PRICING_PLANS,
} from '../utils/adStorage';
import { isOwnerAdmin, OFFICIAL_OWNER_EMAIL } from '../utils/authStorage';
import {
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Trash2,
  ExternalLink,
  Edit3,
  Megaphone,
  Power,
  Check,
} from 'lucide-react';

interface AdminAdPortalProps {
  isOpen: boolean;
  onClose: () => void;
  appLang: AppLanguage;
  currentUser?: UserProfile | null;
}

export const AdminAdPortal: React.FC<AdminAdPortalProps> = ({
  isOpen,
  onClose,
  appLang,
  currentUser,
}) => {
  const [ads, setAds] = useState<AdRequest[]>(() => getAdRequests());
  const [filterStatus, setFilterStatus] = useState<'all' | AdStatus>('all');

  // Active editing state for pricing
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState<number>(12000);
  const [currencyInput, setCurrencyInput] = useState<string>('AMD');
  const [adminNoteInput, setAdminNoteInput] = useState<string>('');

  // In-app reject dialog state (replaces window.prompt which is blocked in iframes)
  const [rejectingAdId, setRejectingAdId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  // In-app delete confirmation state (replaces window.confirm which is blocked in iframes)
  const [deletingAdId, setDeletingAdId] = useState<string | null>(null);

  const refreshAds = () => {
    setAds(getAdRequests());
  };

  useEffect(() => {
    if (isOpen && isOwnerAdmin(currentUser)) {
      refreshAds();
    }
  }, [isOpen, currentUser]);

  // Handle escape key
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

  // STRICT ACCESS CONTROL: Only the registered owner account can access the Admin Panel
  if (!isOpen || !isOwnerAdmin(currentUser)) return null;

  // Stats
  const totalCount = ads.length;
  const pendingCount = ads.filter((a) => a.status === 'pending_review').length;
  const approvedCount = ads.filter((a) => a.status === 'approved').length;
  const activeCount = ads.filter((a) => a.status === 'active').length;
  const totalRevenue = ads
    .filter((a) => a.status === 'active' && a.price)
    .reduce((sum, a) => sum + (a.price || 0), 0);

  const filteredAds = ads.filter((a) => {
    if (filterStatus === 'all') return true;
    return a.status === filterStatus;
  });

  const handleStartReview = (ad: AdRequest) => {
    setEditingAdId(ad.id);
    const standardPlan = AD_PRICING_PLANS[ad.duration];
    const defaultPrice = ad.price || standardPlan?.priceAMD || 12000;
    setPriceInput(defaultPrice);
    setCurrencyInput(ad.currency || 'AMD');
    setAdminNoteInput(ad.adminNotes || '');
  };

  const handleApproveWithPrice = (adId: string) => {
    reviewAndSetPrice(adId, priceInput, currencyInput, adminNoteInput);
    setEditingAdId(null);
    refreshAds();
  };

  const handleOpenRejectModal = (adId: string) => {
    setRejectingAdId(adId);
    setRejectReason('');
  };

  const handleConfirmReject = (adId: string) => {
    rejectAdRequest(adId, rejectReason.trim() || undefined);
    setRejectingAdId(null);
    setRejectReason('');
    refreshAds();
  };

  const handleMarkPaid = (adId: string) => {
    markAdAsPaidAndActivate(adId);
    refreshAds();
  };

  const handleToggle = (adId: string) => {
    toggleAdActive(adId);
    refreshAds();
  };

  const handleOpenDelete = (adId: string) => {
    setDeletingAdId(adId);
  };

  const handleConfirmDelete = (adId: string) => {
    deleteAdRequest(adId);
    setDeletingAdId(null);
    refreshAds();
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

      {/* Admin Panel Modal Container */}
      <div
        className="relative z-10 bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-md shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  {appLang === 'hy' ? 'Ադմինիստրատորի գովազդային վահանակ' : 'Admin Ad Desk & Pricing Review'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase">
                  Private Desk
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                  👑 {OFFICIAL_OWNER_EMAIL}
                </span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-1">
                {appLang === 'hy'
                  ? 'Ուսումնասիրեք հայտերը, սահմանեք գները, հաստատեք կամ մերժեք և նշեք վճարված:'
                  : 'Review private inquiries, confirm ad rates, approve/reject, and mark as paid to publish live.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-all shadow-2xs z-20"
            aria-label={appLang === 'hy' ? 'Փակել' : 'Close'}
            title={appLang === 'hy' ? 'Փակել' : 'Close'}
          >
            <X className="w-5 h-5 stroke-2.5" />
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 sm:px-6 bg-slate-50 border-b border-slate-200/80 text-xs">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <p className="text-slate-500 font-medium">{appLang === 'hy' ? 'Ընդհանուր հայտեր' : 'Total Inquiries'}</p>
            <p className="text-xl font-black text-slate-900">{totalCount}</p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl shadow-2xs">
            <p className="text-amber-800 font-medium">{appLang === 'hy' ? 'Սպասում են հաստատման' : 'Pending Review'}</p>
            <p className="text-xl font-black text-amber-900">{pendingCount}</p>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl shadow-2xs">
            <p className="text-blue-800 font-medium">{appLang === 'hy' ? 'Հաստատված (Չվճարված)' : 'Approved (Unpaid)'}</p>
            <p className="text-xl font-black text-blue-900">{approvedCount}</p>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-2xs">
            <p className="text-emerald-800 font-medium">{appLang === 'hy' ? 'Ակտիվ կայքում (Վճարված)' : 'Live & Active Ads'}</p>
            <p className="text-xl font-black text-emerald-900">
              {activeCount} <span className="text-xs font-normal text-emerald-700">({totalRevenue.toLocaleString()} ֏)</span>
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 overflow-x-auto scrollbar-none">
          {[
            { id: 'all', labelHy: 'Բոլորը', labelEn: 'All', count: totalCount },
            { id: 'pending_review', labelHy: 'Ուսումնասիրման ենթակա', labelEn: 'Pending Review', count: pendingCount },
            { id: 'approved', labelHy: 'Հաստատված', labelEn: 'Approved', count: approvedCount },
            { id: 'active', labelHy: 'Ակտիվ (Կայքում)', labelEn: 'Active (Live)', count: activeCount },
            { id: 'rejected', labelHy: 'Մերժված', labelEn: 'Rejected', count: ads.filter((a) => a.status === 'rejected').length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id as 'all' | AdStatus)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all active:scale-95 ${
                filterStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{appLang === 'hy' ? tab.labelHy : tab.labelEn}</span>
              <span className="ml-1.5 px-1.5 py-0.2 rounded-md bg-white/20 text-[10px] font-black">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Inquiries List */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {filteredAds.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Megaphone className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-bold">
                {appLang === 'hy' ? 'Հայտեր չեն գտնվել այս կարգավիճակում' : 'No ad requests found in this filter'}
              </p>
            </div>
          ) : (
            filteredAds.map((ad) => {
              const isEditing = editingAdId === ad.id;
              const isRejecting = rejectingAdId === ad.id;
              const isDeleting = deletingAdId === ad.id;
              const standardPlan = AD_PRICING_PLANS[ad.duration] || AD_PRICING_PLANS['30_days'];
              const displayPrice = ad.price ?? standardPlan.priceAMD;

              return (
                <div
                  key={ad.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                    ad.status === 'active'
                      ? 'bg-white border-emerald-300 shadow-xs'
                      : ad.status === 'approved'
                      ? 'bg-white border-blue-300 shadow-xs'
                      : ad.status === 'pending_review'
                      ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left: Ad Details */}
                    <div className="flex items-start gap-4">
                      {ad.imageUrl ? (
                        <img
                          src={ad.imageUrl}
                          alt={ad.businessName}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-700 font-black text-2xl flex items-center justify-center shrink-0">
                          {ad.businessName.charAt(0)}
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900">
                            {ad.businessName}
                          </h4>

                          {/* Status Pill */}
                          {ad.status === 'pending_review' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px]">
                              ● {appLang === 'hy' ? 'Սպասում է հաստատման' : 'Needs Review'}
                            </span>
                          )}
                          {ad.status === 'approved' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-extrabold text-[10px]">
                              ● {appLang === 'hy' ? 'Հաստատված • Սպասում է վճարման' : 'Approved • Awaiting Payment'}
                            </span>
                          )}
                          {ad.status === 'active' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-[10px]">
                              ✓ {appLang === 'hy' ? 'Ակտիվ է կայքում (Վճարված)' : 'Live & Active (Paid)'}
                            </span>
                          )}
                          {ad.status === 'rejected' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-extrabold text-[10px]">
                              ✕ {appLang === 'hy' ? 'Մերժված' : 'Rejected'}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-slate-800">{ad.headline}</p>
                        <p className="text-xs text-slate-600 line-clamp-2 max-w-2xl">{ad.adText}</p>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 font-medium">
                          <span>📧 {ad.contactEmail}</span>
                          {ad.contactPhone && <span>📞 {ad.contactPhone}</span>}
                          <span>🎯 {ad.placement}</span>
                          <span className="font-semibold text-slate-700">
                            ⏳ {appLang === 'hy' ? standardPlan.labelHy : standardPlan.labelEn}
                          </span>
                          {ad.targetUrl && (
                            <a
                              href={ad.targetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                            >
                              <span>Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Pricing & Controls */}
                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-medium">
                          {appLang === 'hy' ? 'Սահմանված արժեք' : 'Ad Price'}
                        </p>
                        <p className="text-lg font-black text-indigo-700">
                          {displayPrice.toLocaleString()} {ad.currency || 'AMD'}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {/* Price & Review button */}
                        <button
                          type="button"
                          onClick={() => handleStartReview(ad)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-xs cursor-pointer transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>{appLang === 'hy' ? 'Սահմանել գին / Հաստատել' : 'Set Price / Approve'}</span>
                        </button>

                        {/* Mark as paid & activate button */}
                        {ad.status !== 'active' && (
                          <button
                            type="button"
                            onClick={() => handleMarkPaid(ad.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs cursor-pointer transition-colors inline-flex items-center gap-1 shadow-2xs"
                            title={appLang === 'hy' ? 'Նշել որպես վճարված և անմիջապես ակտիվացնել կայքում' : 'Mark as paid & publish to site'}
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>{appLang === 'hy' ? 'Նշել վճարված (Ակտիվացնել)' : 'Mark Paid & Publish'}</span>
                          </button>
                        )}

                        {/* Toggle active / paused */}
                        {ad.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => handleToggle(ad.id)}
                            className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-900 font-bold text-xs cursor-pointer transition-colors inline-flex items-center gap-1"
                            title="Pause ad"
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{appLang === 'hy' ? 'Կասեցնել' : 'Pause'}</span>
                          </button>
                        )}

                        {/* Reject button */}
                        {ad.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => handleOpenRejectModal(ad.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 text-rose-700 font-bold text-xs cursor-pointer transition-colors"
                            title="Reject inquiry"
                          >
                            <span>{appLang === 'hy' ? 'Մերժել' : 'Reject'}</span>
                          </button>
                        )}

                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={() => handleOpenDelete(ad.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-colors cursor-pointer"
                          title="Delete ad request"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline Pricing & Approval Editor */}
                  {isEditing && (
                    <div className="mt-4 pt-4 border-t border-slate-200 bg-indigo-50/60 p-4 rounded-2xl space-y-3 animate-in fade-in-50">
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-xs text-indigo-900 flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4 text-indigo-600" />
                          <span>{appLang === 'hy' ? 'Սահմանել գովազդի արժեքը և հաստատել' : 'Set Ad Placement Price & Approve'}</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => setEditingAdId(null)}
                          className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">
                            {appLang === 'hy' ? 'Գին (AMD)' : 'Price Amount'}
                          </label>
                          <input
                            type="number"
                            value={priceInput}
                            onChange={(e) => setPriceInput(parseInt(e.target.value, 10) || 0)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">
                            {appLang === 'hy' ? 'Տարադրամ' : 'Currency'}
                          </label>
                          <select
                            value={currencyInput}
                            onChange={(e) => setCurrencyInput(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900"
                          >
                            <option value="AMD">AMD (֏)</option>
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700">
                            {appLang === 'hy' ? 'Նշում գովազդատուին' : 'Admin Note'}
                          </label>
                          <input
                            type="text"
                            value={adminNoteInput}
                            onChange={(e) => setAdminNoteInput(e.target.value)}
                            placeholder="e.g. Approved for hero placement"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900"
                          />
                        </div>
                      </div>

                      {/* Quick standard rate buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 mr-1">
                          {appLang === 'hy' ? 'Ստանդարտ սակագներ՝' : 'Standard plans:'}
                        </span>
                        {(Object.keys(AD_PRICING_PLANS) as (keyof typeof AD_PRICING_PLANS)[]).map((k) => {
                          const p = AD_PRICING_PLANS[k];
                          return (
                            <button
                              key={k}
                              type="button"
                              onClick={() => setPriceInput(p.priceAMD)}
                              className="px-2 py-0.5 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-900 text-[10px] font-bold cursor-pointer"
                            >
                              {p.labelEn}: {p.priceAMD.toLocaleString()} AMD
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleApproveWithPrice(ad.id)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{appLang === 'hy' ? 'Հաստատել գնով (Սպասում է վճարման)' : 'Approve with Price'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAdId(null)}
                          className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                        >
                          {appLang === 'hy' ? 'Չեղարկել' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Rejection Dialog (Replaces blocked window.prompt) */}
                  {isRejecting && (
                    <div className="mt-4 pt-4 border-t border-rose-200 bg-rose-50/60 p-4 rounded-2xl space-y-3 animate-in fade-in-50">
                      <div className="flex items-center justify-between">
                        <h5 className="font-extrabold text-xs text-rose-900 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          <span>{appLang === 'hy' ? 'Մերժել գովազդի հարցումը' : 'Reject Ad Request'}</span>
                        </h5>
                        <button
                          type="button"
                          onClick={() => setRejectingAdId(null)}
                          className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 hover:bg-rose-200 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          {appLang === 'hy' ? 'Մերժման պատճառ (կամփոփ)' : 'Rejection Reason (optional)'}
                        </label>
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder={appLang === 'hy' ? 'օր. Անհամապատասխան նկար կամ բովանդակություն' : 'e.g. Creative materials do not meet guidelines'}
                          className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs text-slate-900"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleConfirmReject(ad.id)}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          {appLang === 'hy' ? 'Հաստատել մերժումը' : 'Confirm Rejection'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectingAdId(null)}
                          className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                        >
                          {appLang === 'hy' ? 'Չեղարկել' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Inline Delete Dialog (Replaces blocked window.confirm) */}
                  {isDeleting && (
                    <div className="mt-4 pt-4 border-t border-rose-200 bg-rose-50/80 p-4 rounded-2xl space-y-2.5 animate-in fade-in-50">
                      <p className="text-xs font-bold text-rose-900">
                        {appLang === 'hy'
                          ? 'Իսկապե՞ս ցանկանում եք ջնջել այս գովազդի հարցումը:'
                          : 'Are you sure you want to permanently delete this ad request?'}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleConfirmDelete(ad.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          {appLang === 'hy' ? 'Այո, ջնջել' : 'Yes, Delete'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingAdId(null)}
                          className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                        >
                          {appLang === 'hy' ? 'Չեղարկել' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>{appLang === 'hy' ? 'Ադմինիստրատորի ինտերֆեյս' : 'Private Admin Console'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 active:scale-95 text-slate-800 font-bold cursor-pointer transition-colors"
          >
            {appLang === 'hy' ? 'Փակել' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
