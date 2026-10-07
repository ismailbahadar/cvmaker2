import React, { useState } from 'react';
import { PersonalInfo } from '../../types/resume';
import { Upload, Trash2, Eye, EyeOff, User, Phone, Mail, MapPin, Shield, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

// Regex validation supporting English, Urdu script, Arabic, all Unicode letters, numbers, and common punctuation
export const FATHER_NAME_REGEX = /^[\p{L}\p{N}\p{M}\s.,'"`()/:_#&–—\-]*$/u;

export function getFatherNameValidation(val: string) {
  const trimmed = (val || '').trim();
  if (!trimmed) return { isValid: true, message: '' };
  if (FATHER_NAME_REGEX.test(trimmed)) {
    return {
      isValid: true,
      message: '✓ Valid text (English & Urdu supported)',
    };
  }
  return {
    isValid: true,
    message: '✓ Text accepted',
  };
}

// Flexible regex supporting both numeric Pakistani CNICs and alphanumeric/text IDs (NICOP, Passport, Overseas)
export const CNIC_GENERAL_REGEX = /^[\p{L}\p{N}\p{M}\s./\-–—]*$/u;

export function getCnicValidation(val: string) {
  const trimmed = (val || '').trim();
  if (!trimmed) return { isValid: true, type: 'empty', message: '', canAutoFormat: false };

  // 1. Standard 13-digit Pakistani CNIC with dashes (37405-1234567-1)
  if (/^\d{5}-\d{7}-\d{1}$/.test(trimmed)) {
    return {
      isValid: true,
      type: 'pakistan-cnic',
      message: '✓ Valid 13-digit Pakistani CNIC (XXXXX-XXXXXXX-X)',
      canAutoFormat: false,
    };
  }

  // 2. Pure 13 continuous digits without dashes (e.g. 3740512345671)
  if (/^\d{13}$/.test(trimmed)) {
    return {
      isValid: true,
      type: 'numeric-13',
      message: '✓ 13-digit numeric CNIC (Click "Add Dashes" to format)',
      canAutoFormat: true,
    };
  }

  // 3. Partial digits and dashes in progress
  if (/^[\d\-]{1,15}$/.test(trimmed)) {
    const rawDigits = trimmed.replace(/\D/g, '');
    return {
      isValid: true,
      type: 'in-progress',
      message: `Entering CNIC digits (${rawDigits.length}/13 digits)`,
      canAutoFormat: rawDigits.length === 13,
    };
  }

  // 4. Urdu / Arabic-Indic numerals
  if (/^[\u0660-\u0669\u06F0-\u06F9\-\s]{1,20}$/.test(trimmed)) {
    return {
      isValid: true,
      type: 'urdu-numerals',
      message: '✓ Valid Urdu / Arabic numeric CNIC',
      canAutoFormat: false,
    };
  }

  // 5. Alphanumeric / Overseas NICOP / Passport / Regional text ID (supports both text & numbers)
  if (CNIC_GENERAL_REGEX.test(trimmed)) {
    return {
      isValid: true,
      type: 'alphanumeric',
      message: '✓ Valid Alphanumeric / Overseas / Passport ID',
      canAutoFormat: false,
    };
  }

  return {
    isValid: true,
    type: 'valid',
    message: '✓ ID input accepted',
    canAutoFormat: false,
  };
}

export function formatToStandardCnic(val: string): string {
  const digits = (val || '').replace(/\D/g, '');
  if (digits.length === 13) {
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
  }
  return val;
}

export const PersonalInfoForm: React.FC<Props> = ({ data, onChange }) => {
  const [showParticularsSettings, setShowParticularsSettings] = useState(false);
  const [photoMessage, setPhotoMessage] = useState<string | null>(null);

  const safeData = data || ({} as PersonalInfo);

  const update = (field: keyof PersonalInfo, value: any) => {
    onChange({ ...safeData, [field]: value });
  };

  const updateFields = (fields: Partial<PersonalInfo>) => {
    onChange({ ...safeData, ...fields });
  };

  const fatherValidation = getFatherNameValidation(safeData.fatherName || '');
  const cnicValidation = getCnicValidation(safeData.cnic || '');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setPhotoMessage('Please choose an image under 2MB.');
        return;
      }
      setPhotoMessage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        update('photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Photo & Basic Details */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="relative group shrink-0">
          <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-sm">
            {data.photoUrl ? (
              <img src={data.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-400" />
            )}
          </div>
          {data.photoUrl && (
            <button
              type="button"
              onClick={() => update('photoUrl', undefined)}
              className="absolute -top-2 -right-2 p-1.5 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 transition"
              title="Remove photo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-sm font-semibold text-slate-800">Profile Photo</h4>
          <p className="text-xs text-slate-500 mb-3">Upload a clean, professional headshot (JPG or PNG).</p>
          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm transition">
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>Upload Photo</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Primary Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="e.g. Muhammad Saeed Ahmad"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Title *</label>
          <input
            type="text"
            value={data.jobTitle || ''}
            onChange={(e) => update('jobTitle', e.target.value)}
            placeholder="e.g. Senior High School Teacher / Software Engineer"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* 1. Father Name */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="father-name-input" className="text-xs font-semibold text-slate-800">
              Father Name <span className="text-slate-400 font-normal">(والد کا نام)</span>
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Text & Urdu Supported</span>
          </div>
          <input
            id="father-name-input"
            name="fatherName"
            type="text"
            dir="auto"
            readOnly={false}
            disabled={false}
            autoComplete="name"
            autoCorrect="off"
            spellCheck={false}
            value={safeData.fatherName || ''}
            onChange={(e) => updateFields({ fatherName: e.target.value, showFatherName: true })}
            placeholder="e.g. Haji Muhammad Bashir / حاجی محمد بشیر"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          {fatherValidation.message && (
            <p className="text-[10px] mt-1 flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>{fatherValidation.message}</span>
            </p>
          )}
        </div>

        {/* 2. CNIC No */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="cnic-input" className="text-xs font-semibold text-slate-800">
              CNIC No <span className="text-slate-400 font-normal">(قومی شناختی کارڈ)</span>
            </label>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-medium">Numeric & Alphanumeric</span>
              {cnicValidation.canAutoFormat && (
                <button
                  type="button"
                  onClick={() => updateFields({ cnic: formatToStandardCnic(safeData.cnic || '') })}
                  className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-1.5 py-0.5 rounded transition"
                  title="Format as 37405-1234567-1"
                >
                  Add Dashes
                </button>
              )}
            </div>
          </div>
          <input
            id="cnic-input"
            name="cnic"
            type="text"
            inputMode="text"
            dir="auto"
            readOnly={false}
            disabled={false}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={safeData.cnic || ''}
            onChange={(e) => updateFields({ cnic: e.target.value, showCnic: true })}
            placeholder="e.g. 37405-1234567-1, 3740512345671, or Passport/ID"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-mono"
          />
          {cnicValidation.message && (
            <p className="text-[10px] mt-1 flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>{cnicValidation.message}</span>
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => update('email', e.target.value)}
            placeholder="name@example.com"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+92 300 1234567"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">WhatsApp (Optional)</label>
          <input
            type="tel"
            value={data.whatsapp || ''}
            onChange={(e) => update('whatsapp', e.target.value)}
            placeholder="+92 300 1234567"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">City, Country</label>
          <input
            type="text"
            value={data.city || ''}
            onChange={(e) => update('city', e.target.value)}
            placeholder="Islamabad, Pakistan"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">Postal / Street Address</label>
          <input
            type="text"
            value={data.address || ''}
            onChange={(e) => update('address', e.target.value)}
            placeholder="House #12, Street 4, Sector F-8/2"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">LinkedIn Profile</label>
          <input
            type="text"
            value={data.linkedIn || ''}
            onChange={(e) => update('linkedIn', e.target.value)}
            placeholder="linkedin.com/in/username"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Portfolio / Website</label>
          <input
            type="text"
            value={data.portfolioUrl || ''}
            onChange={(e) => update('portfolioUrl', e.target.value)}
            placeholder="github.com/user or portfolio.com"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>
      </div>

      {/* Pakistan & Civil Service Specific Particulars */}
      <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold uppercase tracking-wide text-slate-800">
              Biographical & Regional Fields (Pakistani / Civil Service CVs)
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowParticularsSettings(!showParticularsSettings)}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showParticularsSettings ? 'Hide Options' : 'Configure Visible Fields'}
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Optional particulars commonly requested for Pakistan Government, FPSC, Teaching, and Middle East jobs. You can toggle each field's visibility.
        </p>

        {showParticularsSettings && (
          <div className="p-3 bg-white border border-slate-200 rounded-lg mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!data.showFatherName}
                onChange={(e) => update('showFatherName', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Show Father Name</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!data.showCnic}
                onChange={(e) => update('showCnic', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Show CNIC</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!data.showDob}
                onChange={(e) => update('showDob', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Show Date of Birth</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!data.showReligion}
                onChange={(e) => update('showReligion', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Show Religion</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!data.showMaritalStatus}
                onChange={(e) => update('showMaritalStatus', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Show Marital Status</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!data.showDomicile}
                onChange={(e) => update('showDomicile', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Show Domicile</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!data.showNationality}
                onChange={(e) => update('showNationality', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Show Nationality</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!!data.showGender}
                onChange={(e) => update('showGender', e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span>Show Gender</span>
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth (تاریخ پیدائش)</label>
            <input
              type="date"
              readOnly={false}
              disabled={false}
              value={data.dateOfBirth || ''}
              onChange={(e) => updateFields({ dateOfBirth: e.target.value, showDob: true })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Domicile / District (ڈومیسائل)</label>
            <input
              type="text"
              readOnly={false}
              disabled={false}
              value={data.domicile || ''}
              onChange={(e) => updateFields({ domicile: e.target.value, showDomicile: true })}
              placeholder="e.g. Rawalpindi / Punjab / Chitral"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Religion (مذہب)</label>
            <input
              type="text"
              readOnly={false}
              disabled={false}
              value={data.religion || ''}
              onChange={(e) => updateFields({ religion: e.target.value, showReligion: true })}
              placeholder="e.g. Islam / Christianity / etc."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Marital Status (ازدواجی حیثیت)</label>
            <select
              value={data.maritalStatus || 'Single'}
              onChange={(e) => updateFields({ maritalStatus: e.target.value, showMaritalStatus: true })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Single">Single (غیر شادی شدہ)</option>
              <option value="Married">Married (شادی شدہ)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality (قومی شناخت)</label>
            <input
              type="text"
              readOnly={false}
              disabled={false}
              value={data.nationality || ''}
              onChange={(e) => updateFields({ nationality: e.target.value, showNationality: true })}
              placeholder="e.g. Pakistani / پاکستانی"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gender (جنس)</label>
            <select
              value={data.gender || 'Male'}
              onChange={(e) => updateFields({ gender: e.target.value, showGender: true })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Male">Male (مرد)</option>
              <option value="Female">Female (خاتون)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
