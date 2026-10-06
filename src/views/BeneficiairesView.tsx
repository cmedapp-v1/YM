import React, { useState, useMemo, useRef } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  Download,
  Upload,
  Printer,
  Trash2,
  Edit2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import {
  Beneficiaire,
  Filiere,
  Classe,
  NiveauScolaire,
  Sexe,
  StatutBeneficiaire,
  EnregistrementPresence,
  Infraction,
  Convocation,
  ParametresCentre
} from '../types';
import { excelUtils } from '../utils/excel';
import { ConfirmModal } from '../components/ConfirmModal';
import { FicheIndividuelleModal } from './FicheIndividuelleModal';
import {
  AR_NIVEAUX_SCOLAIRES,
  formatNiveauAr,
  formatSexeAr,
  formatStatutBeneficiaireAr
} from '../utils/arabicLabels';

interface BeneficiairesViewProps {
  beneficiaires: Beneficiaire[];
  filieres: Filiere[];
  classes: Classe[];
  presences: EnregistrementPresence[];
  infractions: Infraction[];
  convocations: Convocation[];
  parametres: ParametresCentre;
  onSaveBeneficiaire: (ben: Beneficiaire) => void;
  onDeleteBeneficiaire: (id: string) => void;
  onImportBeneficiaires: (newBens: Beneficiaire[]) => void;
}

export const BeneficiairesView: React.FC<BeneficiairesViewProps> = ({
  beneficiaires,
  filieres,
  classes,
  presences,
  infractions,
  convocations,
  parametres,
  onSaveBeneficiaire,
  onDeleteBeneficiaire,
  onImportBeneficiaires
}) => {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filiereFilter, setFiliereFilter] = useState('');
  const [classeFilter, setClasseFilter] = useState('');
  const [sexeFilter, setSexeFilter] = useState('');
  const [niveauFilter, setNiveauFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBen, setEditingBen] = useState<Beneficiaire | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [selectedForFiche, setSelectedForFiche] = useState<Beneficiaire | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Import feedback
  const [importStatus, setImportStatus] = useState<{
    loading: boolean;
    result?: {
      success: boolean;
      imported: Beneficiaire[];
      duplicates: string[];
      errors: string[];
      totalRows: number;
    };
  }>({ loading: false });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const initialFormState: Partial<Beneficiaire> = {
    numeroInscription: `INS-2025-${String(beneficiaires.length + 1).padStart(3, '0')}`,
    numeroMassar: '',
    nomAr: '',
    prenomAr: '',
    nomFr: '',
    prenomFr: '',
    sexe: 'Masculin',
    dateNaissance: '2008-01-01',
    lieuNaissance: 'الرباط',
    niveauScolaire: '2ème année collège',
    filiereId: filieres[0]?.id || '',
    classeId: classes[0]?.id || '',
    telephone: '',
    telephoneTuteur: '',
    nomTuteur: '',
    adresse: 'يعقوب المنصور، الرباط',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    anneeScolaire: parametres.anneeScolaireActive,
    statut: 'En cours',
    dateInscription: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState<Partial<Beneficiaire>>(initialFormState);
  const [formError, setFormError] = useState('');

  const filiereMap = useMemo(() => new Map(filieres.map((f) => [f.id, f])), [filieres]);
  const classeMap = useMemo(() => new Map(classes.map((c) => [c.id, c])), [classes]);

  // Filtered list
  const filteredBeneficiaires = useMemo(() => {
    return beneficiaires.filter((b) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const match =
          b.nomFr.toLowerCase().includes(q) ||
          b.prenomFr.toLowerCase().includes(q) ||
          b.nomAr.includes(q) ||
          b.prenomAr.includes(q) ||
          b.numeroMassar.toLowerCase().includes(q) ||
          b.numeroInscription.toLowerCase().includes(q) ||
          b.telephone.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (filiereFilter && b.filiereId !== filiereFilter) return false;
      if (classeFilter && b.classeId !== classeFilter) return false;
      if (sexeFilter && b.sexe !== sexeFilter) return false;
      if (niveauFilter && b.niveauScolaire !== niveauFilter) return false;
      if (statutFilter && b.statut !== statutFilter) return false;
      return true;
    });
  }, [beneficiaires, searchTerm, filiereFilter, classeFilter, sexeFilter, niveauFilter, statutFilter]);

  const handleOpenAdd = () => {
    setEditingBen(null);
    setFormData({
      ...initialFormState,
      numeroInscription: `INS-2025-${String(beneficiaires.length + 1).padStart(3, '0')}`
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (ben: Beneficiaire) => {
    setEditingBen(ben);
    setFormData({ ...ben });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.numeroMassar?.trim()) {
      setFormError('يرجى إدخال رقم مسار.');
      return;
    }
    if (!formData.nomAr?.trim() || !formData.prenomAr?.trim()) {
      setFormError('يرجى إدخال الاسم والنسب بالعربية.');
      return;
    }
    if (!formData.nomFr?.trim() || !formData.prenomFr?.trim()) {
      setFormError('يرجى إدخال الاسم والنسب بالفرنسية.');
      return;
    }

    const savedBen: Beneficiaire = {
      id: editingBen ? editingBen.id : `ben-${Date.now()}`,
      numeroInscription: formData.numeroInscription || `INS-2025-${String(beneficiaires.length + 1).padStart(3, '0')}`,
      numeroMassar: formData.numeroMassar.trim().toUpperCase(),
      nomAr: formData.nomAr.trim(),
      prenomAr: formData.prenomAr.trim(),
      nomFr: formData.nomFr.trim(),
      prenomFr: formData.prenomFr.trim(),
      sexe: formData.sexe as Sexe,
      dateNaissance: formData.dateNaissance || '2008-01-01',
      lieuNaissance: formData.lieuNaissance || 'الرباط',
      niveauScolaire: formData.niveauScolaire as NiveauScolaire,
      filiereId: formData.filiereId || filieres[0]?.id || '',
      classeId: formData.classeId || classes[0]?.id || '',
      telephone: formData.telephone || '',
      telephoneTuteur: formData.telephoneTuteur || '',
      nomTuteur: formData.nomTuteur || '',
      adresse: formData.adresse || '',
      photoUrl: formData.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.numeroMassar}`,
      anneeScolaire: formData.anneeScolaire || parametres.anneeScolaireActive,
      statut: (formData.statut || 'En cours') as StatutBeneficiaire,
      dateInscription: formData.dateInscription || new Date().toISOString().split('T')[0],
      remarques: formData.remarques || ''
    };

    onSaveBeneficiaire(savedBen);
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      onDeleteBeneficiaire(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus({ loading: true });
    try {
      const res = await excelUtils.parseBeneficiaireExcel(file, filieres, classes, beneficiaires);
      setImportStatus({ loading: false, result: res });
      if (res.imported.length > 0) {
        onImportBeneficiaires(res.imported);
      }
    } catch {
      setImportStatus({
        loading: false,
        result: {
          success: false,
          imported: [],
          duplicates: [],
          errors: ['حدث خطأ أثناء قراءة ملف Excel. يرجى التحقق من الصيغة.'],
          totalRows: 0
        }
      });
    }
  };

  return (
    <div dir="rtl" className="space-y-6 font-arabic text-right">
      {/* 1. Header with Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-blue-700 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>تدبير المستفيدين والمستفيدات</span>
          </div>
          <h1 className="text-xl font-black text-slate-900">
            سجل المستفيدين الرسمي
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {parametres.nomCentre} · {beneficiaires.length} مسجلون بالسنة {parametres.anneeScolaireActive}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مستفيد</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>استيراد ملف Excel</span>
          </button>

          <button
            onClick={() => excelUtils.exportBeneficiaires(filteredBeneficiaires, filieres, classes)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير Excel</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة اللائحة</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
            <input
              type="text"
              placeholder="بحث بالاسم، النسب، رقم مسار، رقم التسجيل، الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-9 pl-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-blue-500 font-medium text-right"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {/* Filter: Filière */}
            <select
              value={filiereFilter}
              onChange={(e) => setFiliereFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-hidden focus:border-blue-500 font-bold"
            >
              <option value="">جميع الشعب</option>
              {filieres.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nom}
                </option>
              ))}
            </select>

            {/* Filter: Classe */}
            <select
              value={classeFilter}
              onChange={(e) => setClasseFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-hidden focus:border-blue-500 font-bold"
            >
              <option value="">جميع الأقسام</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </select>

            {/* Filter: Sexe */}
            <select
              value={sexeFilter}
              onChange={(e) => setSexeFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-hidden focus:border-blue-500 font-bold"
            >
              <option value="">الجنس (الكل)</option>
              <option value="Masculin">ذكر</option>
              <option value="Féminin">أنثى</option>
            </select>

            {/* Filter: Statut */}
            <select
              value={statutFilter}
              onChange={(e) => setStatutFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-hidden focus:border-blue-500 font-bold"
            >
              <option value="">الحالة (الكل)</option>
              <option value="En cours">مستمر</option>
              <option value="Inscrit">مسجل</option>
              <option value="Abandonné">منقطع</option>
              <option value="Réorienté">تمت إعادة توجيهه</option>
              <option value="Diplômé">متخرج</option>
            </select>
          </div>
        </div>

        {/* Results summary counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold pt-1 border-t border-slate-100">
          <span>
            عدد النتائج المعروضة: <strong className="text-slate-900 font-black">{filteredBeneficiaires.length}</strong> من أصل {beneficiaires.length}
          </span>
          {(searchTerm || filiereFilter || classeFilter || sexeFilter || niveauFilter || statutFilter) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFiliereFilter('');
                setClasseFilter('');
                setSexeFilter('');
                setNiveauFilter('');
                setStatutFilter('');
              }}
              className="text-rose-600 hover:underline font-bold"
            >
              إلغاء التصفية
            </button>
          )}
        </div>
      </div>

      {/* 3. Beneficiaires Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right">
            <thead className="bg-slate-50 text-slate-700 uppercase font-black text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">الصورة</th>
                <th className="py-3 px-3">رقم التسجيل</th>
                <th className="py-3 px-3">رقم مسار</th>
                <th className="py-3 px-3">الاسم والنسب (عربي / فرنسي)</th>
                <th className="py-3 px-3 text-center">الجنس</th>
                <th className="py-3 px-3">الشعبة والقسم</th>
                <th className="py-3 px-3">المستوى الدراسي</th>
                <th className="py-3 px-3">الهاتف</th>
                <th className="py-3 px-3 text-center">الحالة</th>
                <th className="py-3 px-3 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBeneficiaires.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-bold">
                    لا يوجد مستفيدون يطابقون معايير البحث
                  </td>
                </tr>
              ) : (
                filteredBeneficiaires.map((ben) => {
                  const fil = filiereMap.get(ben.filiereId);
                  const cls = classeMap.get(ben.classeId);
                  return (
                    <tr key={ben.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <img
                          src={ben.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${ben.id}`}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        {ben.numeroInscription}
                      </td>
                      <td className="py-3 px-3 font-mono font-black text-blue-900 bg-blue-50/50 rounded-md">
                        {ben.numeroMassar}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-black text-slate-900 text-xs">
                          {ben.prenomAr} {ben.nomAr}
                        </div>
                        <div className="font-latin text-[10px] text-slate-500 font-semibold">
                          {ben.prenomFr} {ben.nomFr}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-bold">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] ${
                            ben.sexe === 'Masculin' || ben.sexe === ('ذكر' as any)
                              ? 'bg-blue-50 text-blue-800'
                              : 'bg-rose-50 text-rose-800'
                          }`}
                        >
                          {formatSexeAr(ben.sexe)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 truncate max-w-[160px]">
                          {fil?.nom || 'غير محدد'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-semibold truncate max-w-[160px]">
                          {cls?.nom || 'غير محدد'}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-semibold">
                        {formatNiveauAr(ben.niveauScolaire)}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600 font-bold">
                        {ben.telephone || '-'}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            ben.statut === 'En cours' || ben.statut === ('مستمر' as any)
                              ? 'bg-emerald-100 text-emerald-800'
                              : ben.statut === 'Abandonné' || ben.statut === ('منقطع' as any)
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {formatStatutBeneficiaireAr(ben.statut)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedForFiche(ben)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض البطاقة الفردية والطباعة"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(ben)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="تعديل بيانات المستفيد"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(ben.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف المستفيد"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Add/Edit Beneficiary Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto font-arabic">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="p-5 bg-[#0B2545] text-white flex items-center justify-between">
              <h2 className="text-base font-black">
                {editingBen ? 'تعديل بيانات المستفيد' : 'إضافة مستفيد جديد'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 text-slate-300 hover:text-white"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-right">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Administrative IDs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    رقم التسجيل الداخلي *
                  </label>
                  <input
                    type="text"
                    value={formData.numeroInscription || ''}
                    onChange={(e) => setFormData({ ...formData, numeroInscription: e.target.value })}
                    required
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    رقم مسار (Massar) *
                  </label>
                  <input
                    type="text"
                    value={formData.numeroMassar || ''}
                    onChange={(e) => setFormData({ ...formData, numeroMassar: e.target.value })}
                    required
                    placeholder="مثال: G139988112"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold uppercase"
                  />
                </div>
              </div>

              {/* Arabic Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    الاسم الشخصي (بالعربية) *
                  </label>
                  <input
                    type="text"
                    value={formData.prenomAr || ''}
                    onChange={(e) => setFormData({ ...formData, prenomAr: e.target.value })}
                    required
                    placeholder="الاسم الشخصي بالعربية"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    الاسم العائلي / النسب (بالعربية) *
                  </label>
                  <input
                    type="text"
                    value={formData.nomAr || ''}
                    onChange={(e) => setFormData({ ...formData, nomAr: e.target.value })}
                    required
                    placeholder="النسب بالعربية"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* French Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    الاسم الشخصي بالفرنسية (Prénom) *
                  </label>
                  <input
                    type="text"
                    value={formData.prenomFr || ''}
                    onChange={(e) => setFormData({ ...formData, prenomFr: e.target.value })}
                    required
                    placeholder="Prénom en français"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-latin font-bold text-left"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    الاسم العائلي بالفرنسية (Nom) *
                  </label>
                  <input
                    type="text"
                    value={formData.nomFr || ''}
                    onChange={(e) => setFormData({ ...formData, nomFr: e.target.value })}
                    required
                    placeholder="Nom de famille en français"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-latin font-bold text-left"
                  />
                </div>
              </div>

              {/* Sexe, Date de naissance, Lieu */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    الجنس *
                  </label>
                  <select
                    value={formData.sexe || 'Masculin'}
                    onChange={(e) => setFormData({ ...formData, sexe: e.target.value as Sexe })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="Masculin">ذكر</option>
                    <option value="Féminin">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    تاريخ الازدياد *
                  </label>
                  <input
                    type="date"
                    value={formData.dateNaissance || '2008-01-01'}
                    onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    مكان الازدياد
                  </label>
                  <input
                    type="text"
                    value={formData.lieuNaissance || ''}
                    onChange={(e) => setFormData({ ...formData, lieuNaissance: e.target.value })}
                    placeholder="مكان الازدياد"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>
              </div>

              {/* Niveau scolaire, Filière, Classe */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    المستوى الدراسي *
                  </label>
                  <select
                    value={formData.niveauScolaire || '2ème année collège'}
                    onChange={(e) => setFormData({ ...formData, niveauScolaire: e.target.value as NiveauScolaire })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="4ème année primaire">السنة الرابعة ابتدائي</option>
                    <option value="5ème année primaire">السنة الخامسة ابتدائي</option>
                    <option value="6ème année primaire">السنة السادسة ابتدائي</option>
                    <option value="1ère année collège">السنة الأولى إعدادي</option>
                    <option value="2ème année collège">السنة الثانية إعدادي</option>
                    <option value="3ème année collège">السنة الثالثة إعدادي</option>
                    <option value="Autre">أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    الشعبة *
                  </label>
                  <select
                    value={formData.filiereId || ''}
                    onChange={(e) => setFormData({ ...formData, filiereId: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {filieres.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    القسم *
                  </label>
                  <select
                    value={formData.classeId || ''}
                    onChange={(e) => setFormData({ ...formData, classeId: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Téléphone & Tuteur */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    هاتف المستفيد
                  </label>
                  <input
                    type="text"
                    value={formData.telephone || ''}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="06XXXXXXXX"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    هاتف ولي الأمر
                  </label>
                  <input
                    type="text"
                    value={formData.telephoneTuteur || ''}
                    onChange={(e) => setFormData({ ...formData, telephoneTuteur: e.target.value })}
                    placeholder="06XXXXXXXX"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    اسم ولي الأمر
                  </label>
                  <input
                    type="text"
                    value={formData.nomTuteur || ''}
                    onChange={(e) => setFormData({ ...formData, nomTuteur: e.target.value })}
                    placeholder="اسم الأب أو الأم أو الوالي"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Adresse, Année, Statut */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    العنوان السكني
                  </label>
                  <input
                    type="text"
                    value={formData.adresse || ''}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    placeholder="العنوان بالرباط"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    السنة الدراسية
                  </label>
                  <input
                    type="text"
                    value={formData.anneeScolaire || parametres.anneeScolaireActive}
                    onChange={(e) => setFormData({ ...formData, anneeScolaire: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">
                    الحالة
                  </label>
                  <select
                    value={formData.statut || 'En cours'}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as StatutBeneficiaire })}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="En cours">مستمر</option>
                    <option value="Inscrit">مسجل</option>
                    <option value="Abandonné">منقطع</option>
                    <option value="Réorienté">تمت إعادة توجيهه</option>
                    <option value="Diplômé">متخرج</option>
                  </select>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-colors"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Import Excel Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-arabic">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-right">
            <div className="p-5 bg-[#0B2545] text-white flex items-center justify-between">
              <h3 className="text-sm font-black flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>استيراد ملف Excel</span>
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 font-bold leading-relaxed">
                يمكنك استيراد لائحة المستفيدين دفعة واحدة عبر ملف Excel (.xlsx أو .xls). يرجى التأكد من تطابق أعمدة الملف مع النموذج المعتمد.
              </p>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-blue-900">تحميل النموذج الاسترشادي</h4>
                  <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                    ملف يحتوي على أسماء الأعمدة الصحيحة لضمان الاستيراد بدون أخطاء.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => excelUtils.downloadBeneficiaireTemplate()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل النموذج</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1.5">
                  اختر ملف Excel من جهازك :
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileImport}
                  className="w-full text-xs text-slate-600 file:mr-0 file:ml-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
              </div>

              {/* Import Result Status */}
              {importStatus.loading && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>جاري استيراد البيانات ومعالجتها...</span>
                </div>
              )}

              {importStatus.result && (
                <div
                  className={`p-4 rounded-2xl border text-xs ${
                    importStatus.result.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="font-black mb-1">
                    {importStatus.result.success
                      ? `تم استيراد ${importStatus.result.imported.length} مستفيد بنجاح!`
                      : 'فشل استيراد البيانات'}
                  </div>
                  {importStatus.result.duplicates.length > 0 && (
                    <div className="text-[11px] text-amber-700 font-semibold mt-1">
                      تم تجاهل {importStatus.result.duplicates.length} أرقام مسار مكررة.
                    </div>
                  )}
                  {importStatus.result.errors.length > 0 && (
                    <ul className="text-[11px] list-disc list-inside mt-1 space-y-0.5 text-rose-700 font-semibold">
                      {importStatus.result.errors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="تأكيد حذف المستفيد"
        message="هل أنت متأكد من رغبتك في حذف هذا المستفيد؟ سيتم حذف جميع سجلات الغياب والمخالفات المرتبطة به."
        confirmLabel="حذف نهائي"
        cancelLabel="إلغاء"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* 7. Individual File Modal */}
      {selectedForFiche && (
        <FicheIndividuelleModal
          beneficiaire={selectedForFiche}
          onClose={() => setSelectedForFiche(null)}
          filiere={filiereMap.get(selectedForFiche.filiereId)}
          classe={classeMap.get(selectedForFiche.classeId)}
          presences={presences.filter((p) => p.beneficiaireId === selectedForFiche.id)}
          infractions={infractions.filter((i) => i.beneficiaireId === selectedForFiche.id)}
          convocations={convocations.filter((c) => c.beneficiaireId === selectedForFiche.id)}
          parametres={parametres}
        />
      )}
    </div>
  );
};
