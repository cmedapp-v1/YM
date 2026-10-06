import * as XLSX from 'xlsx';
import {
  Beneficiaire,
  Filiere,
  Classe,
  Animateur,
  EnregistrementPresence,
  Infraction,
  Convocation,
  SeancePlanning,
  NiveauScolaire,
  Sexe
} from '../types';

export const excelUtils = {
  // Download standard Excel template for Beneficiaires
  downloadBeneficiaireTemplate(): void {
    const templateData = [
      {
        'Numéro d\'inscription': 'INS-2025-050',
        'Nom arabe': 'المريني',
        'Prénom arabe': 'عمر',
        'Nom français': 'El Marini',
        'Prénom français': 'Omar',
        'Sexe': 'Masculin',
        'Date de naissance': '2008-05-15',
        'Lieu de naissance': 'Rabat',
        'Numéro Massar': 'G139988112',
        'Niveau scolaire': '2ème année collège',
        'Filière': 'Électricité de Bâtiment et Domotique',
        'Classe': 'Électricité Groupe A',
        'Téléphone': '0612345678',
        'Adresse': 'Hay El Fath, Rabat',
        'Année scolaire': '2025-2026'
      },
      {
        'Numéro d\'inscription': 'INS-2025-051',
        'Nom arabe': 'الفاسي',
        'Prénom arabe': 'سلمى',
        'Nom français': 'El Fassi',
        'Prénom français': 'Salma',
        'Sexe': 'Féminin',
        'Date de naissance': '2008-09-20',
        'Lieu de naissance': 'Salé',
        'Numéro Massar': 'J142233445',
        'Niveau scolaire': '3ème année collège',
        'Filière': 'Couture, Modélisme et Confection',
        'Classe': 'Couture & Modélisme A',
        'Téléphone': '0622334455',
        'Adresse': 'Avenue Al Massira, Yaakoub El Mansour',
        'Année scolaire': '2025-2026'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Modele_Beneficiaires');
    XLSX.writeFile(workbook, 'Modele_Import_Beneficiaires_CDC_Yaakoub.xlsx');
  },

  // Parse imported file
  async parseBeneficiaireExcel(
    file: File,
    filieres: Filiere[],
    classes: Classe[],
    existingBeneficiaires: Beneficiaire[]
  ): Promise<{
    success: boolean;
    imported: Beneficiaire[];
    duplicates: string[];
    errors: string[];
    totalRows: number;
  }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

          if (!rows || rows.length === 0) {
            resolve({
              success: false,
              imported: [],
              duplicates: [],
              errors: ['Le fichier Excel est vide ou ne contient aucune ligne de données.'],
              totalRows: 0
            });
            return;
          }

          const existingInscriptions = new Set(existingBeneficiaires.map((b) => b.numeroInscription.trim().toLowerCase()));
          const existingMassars = new Set(existingBeneficiaires.map((b) => b.numeroMassar.trim().toLowerCase()));

          const imported: Beneficiaire[] = [];
          const duplicates: string[] = [];
          const errors: string[] = [];

          rows.forEach((row, index) => {
            const rowNum = index + 2; // header is row 1
            const numInscription = String(row['Numéro d\'inscription'] || row['Numero inscription'] || row['num_inscription'] || '').trim();
            const nomFr = String(row['Nom français'] || row['Nom' ] || '').trim();
            const prenomFr = String(row['Prénom français'] || row['Prenom'] || '').trim();
            const nomAr = String(row['Nom arabe'] || '').trim();
            const prenomAr = String(row['Prénom arabe'] || '').trim();
            const massar = String(row['Numéro Massar'] || row['Massar'] || '').trim();
            const sexeVal = String(row['Sexe'] || 'Masculin').trim();
            const dateNaiss = String(row['Date de naissance'] || '2008-01-01').trim();
            const lieuNaiss = String(row['Lieu de naissance'] || 'Rabat').trim();
            const niveau = String(row['Niveau scolaire'] || 'Autre').trim() as NiveauScolaire;
            const filiereName = String(row['Filière'] || row['Filiere'] || '').trim();
            const classeName = String(row['Classe'] || '').trim();
            const tel = String(row['Téléphone'] || row['Telephone'] || '').trim();
            const adresse = String(row['Adresse'] || '').trim();
            const anneeScolaire = String(row['Année scolaire'] || '2025-2026').trim();

            if (!numInscription && !nomFr && !prenomFr) {
              // skip empty row
              return;
            }

            if (!numInscription || !nomFr || !prenomFr) {
              errors.push(`Ligne ${rowNum} : Numéro d'inscription, nom et prénom sont obligatoires.`);
              return;
            }

            // Check duplicate
            if (existingInscriptions.has(numInscription.toLowerCase())) {
              duplicates.push(`Ligne ${rowNum} : N° Inscription « ${numInscription} » existe déjà.`);
              return;
            }

            if (massar && existingMassars.has(massar.toLowerCase())) {
              duplicates.push(`Ligne ${rowNum} : N° Massar « ${massar} » existe déjà pour un autre bénéficiaire.`);
              return;
            }

            // Match filiere
            let filiere = filieres.find((f) => f.nom.toLowerCase() === filiereName.toLowerCase() || f.code.toLowerCase() === filiereName.toLowerCase());
            if (!filiere && filieres.length > 0) filiere = filieres[0];

            // Match classe
            let classe = classes.find((c) => c.nom.toLowerCase() === classeName.toLowerCase() || c.code.toLowerCase() === classeName.toLowerCase());
            if (!classe && classes.length > 0) classe = classes[0];

            const newBen: Beneficiaire = {
              id: 'ben-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
              numeroInscription: numInscription,
              numeroMassar: massar || `MASSAR-${Math.floor(100000000 + Math.random() * 900000000)}`,
              nomAr: nomAr || nomFr,
              prenomAr: prenomAr || prenomFr,
              nomFr,
              prenomFr,
              sexe: sexeVal.toLowerCase().startsWith('f') ? 'Féminin' : 'Masculin',
              dateNaissance: dateNaiss,
              lieuNaissance: lieuNaiss,
              niveauScolaire: niveau,
              filiereId: filiere ? filiere.id : '',
              classeId: classe ? classe.id : '',
              telephone: tel,
              adresse: adresse || 'Yaakoub El Mansour, Rabat',
              photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
              anneeScolaire,
              statut: 'En cours',
              dateInscription: new Date().toISOString().split('T')[0]
            };

            imported.push(newBen);
            existingInscriptions.add(numInscription.toLowerCase());
            if (massar) existingMassars.add(massar.toLowerCase());
          });

          resolve({
            success: imported.length > 0,
            imported,
            duplicates,
            errors,
            totalRows: rows.length
          });
        } catch {
          resolve({
            success: false,
            imported: [],
            duplicates: [],
            errors: ['Erreur lors de la lecture du fichier Excel. Vérifiez le format .xlsx.'],
            totalRows: 0
          });
        }
      };

      reader.onerror = () => {
        resolve({
          success: false,
          imported: [],
          duplicates: [],
          errors: ['Erreur d’accès au fichier.'],
          totalRows: 0
        });
      };

      reader.readAsArrayBuffer(file);
    });
  },

  // Export Beneficiaires
  exportBeneficiaires(beneficiaires: Beneficiaire[], filieres: Filiere[], classes: Classe[]): void {
    const filiereMap = new Map(filieres.map((f) => [f.id, f.nom]));
    const classeMap = new Map(classes.map((c) => [c.id, c.nom]));

    const data = beneficiaires.map((b) => ({
      'N° Inscription': b.numeroInscription,
      'N° Massar': b.numeroMassar,
      'Nom Français': b.nomFr,
      'Prénom Français': b.prenomFr,
      'Nom Arabe': b.nomAr,
      'Prénom Arabe': b.prenomAr,
      'Sexe': b.sexe,
      'Date de Naissance': b.dateNaissance,
      'Lieu de Naissance': b.lieuNaissance,
      'Niveau Scolaire': b.niveauScolaire,
      'Filière': filiereMap.get(b.filiereId) || 'Non assignée',
      'Classe': classeMap.get(b.classeId) || 'Non assignée',
      'Téléphone': b.telephone,
      'Téléphone Tuteur': b.telephoneTuteur || '',
      'Adresse': b.adresse,
      'Statut': b.statut,
      'Année Scolaire': b.anneeScolaire,
      'Date Inscription': b.dateInscription
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Beneficiaires');
    XLSX.writeFile(workbook, `Beneficiaires_CDC_Yaakoub_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  // Export Presences / Absences
  exportPresences(
    presences: EnregistrementPresence[],
    beneficiaires: Beneficiaire[],
    filieres: Filiere[],
    classes: Classe[],
    animateurs: Animateur[],
    filterStatut?: 'Absent' | 'Retard'
  ): void {
    const benMap = new Map(beneficiaires.map((b) => [b.id, b]));
    const filiereMap = new Map(filieres.map((f) => [f.id, f.nom]));
    const classeMap = new Map(classes.map((c) => [c.id, c.nom]));
    const animMap = new Map(animateurs.map((a) => [a.id, `${a.prenom} ${a.nom}`]));

    const filtered = filterStatut ? presences.filter((p) => p.statut === filterStatut) : presences;

    const data = filtered.map((p) => {
      const ben = benMap.get(p.beneficiaireId);
      return {
        'Date': p.date,
        'Heure': p.heure,
        'N° Inscription': ben?.numeroInscription || '-',
        'N° Massar': ben?.numeroMassar || '-',
        'Bénéficiaire (FR)': ben ? `${ben.prenomFr} ${ben.nomFr}` : 'Inconnu',
        'Bénéficiaire (AR)': ben ? `${ben.prenomAr} ${ben.nomAr}` : '-',
        'Statut': p.statut,
        'Durée Retard (min)': p.dureeRetardMinutes || '',
        'Filière': filiereMap.get(p.filiereId) || '-',
        'Classe': classeMap.get(p.classeId) || '-',
        'Séance / Matière': p.seanceMatiere || '-',
        'Animateur': animMap.get(p.animateurId) || '-',
        'Motif': p.motif || '',
        'Observation': p.observation || '',
        'Justifié': p.justifie ? 'Oui' : 'Non'
      };
    });

    const prefix = filterStatut ? filterStatut.toLowerCase() + 's' : 'presences';
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, prefix.toUpperCase());
    XLSX.writeFile(workbook, `${prefix}_CDC_Yaakoub_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  // Export Infractions
  exportInfractions(
    infractions: Infraction[],
    beneficiaires: Beneficiaire[],
    filieres?: Filiere[],
    classes?: Classe[],
    animateurs?: Animateur[]
  ): void {
    const benMap = new Map(beneficiaires.map((b) => [b.id, b]));
    const filiereMap = new Map((filieres || []).map((f) => [f.id, f.nom]));
    const classeMap = new Map((classes || []).map((c) => [c.id, c.nom]));
    const animMap = new Map((animateurs || []).map((a) => [a.id, `${a.prenom} ${a.nom}`]));

    const data = infractions.map((i) => {
      const ben = benMap.get(i.beneficiaireId);
      return {
        'Date': i.date,
        'Heure': i.heure,
        'Bénéficiaire': ben ? `${ben.prenomFr} ${ben.nomFr}` : 'Inconnu',
        'N° Massar': i.numeroMassar || ben?.numeroMassar || '',
        'Filière': filiereMap.get(i.filiereId) || '',
        'Classe': classeMap.get(i.classeId) || '',
        'Formateur': animMap.get(i.animateurId) || '',
        'Type Infraction': i.typeInfraction,
        'Gravité': i.gravite,
        'Description': i.description,
        'Lieu': i.lieu,
        'Action Prise': i.actionPrise,
        'Statut': i.statut,
        'Observation': i.observation
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Infractions');
    XLSX.writeFile(workbook, `Infractions_CDC_Yaakoub_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  // Export Convocations
  exportConvocations(
    convocations: Convocation[],
    beneficiaires: Beneficiaire[],
    filieres?: Filiere[],
    classes?: Classe[]
  ): void {
    const benMap = new Map(beneficiaires.map((b) => [b.id, b]));
    const filiereMap = new Map((filieres || []).map((f) => [f.id, f.nom]));
    const classeMap = new Map((classes || []).map((c) => [c.id, c.nom]));

    const data = convocations.map((c) => {
      const ben = benMap.get(c.beneficiaireId);
      return {
        'Date Convocation': c.date,
        'Heure': c.heure,
        'Bénéficiaire': ben ? `${ben.prenomFr} ${ben.nomFr}` : 'Inconnu',
        'N° Inscription': ben?.numeroInscription || '',
        'N° Massar': ben?.numeroMassar || '',
        'Filière': ben ? (filiereMap.get(ben.filiereId) || '') : '',
        'Classe': ben ? (classeMap.get(ben.classeId) || '') : '',
        'Téléphone Tuteur': ben?.telephoneTuteur || ben?.telephone || '',
        'Personne Concernée': c.personneConcernee,
        'Motif': c.motif,
        'Statut': c.statut,
        'Origine': c.sourceType,
        'Observation': c.observation,
        'Date Création': c.dateCreation
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Convocations');
    XLSX.writeFile(workbook, `Convocations_CDC_Yaakoub_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  // Export Planning
  exportPlanning(planning: SeancePlanning[], filieres: Filiere[], classes: Classe[], animateurs: Animateur[]): void {
    const filiereMap = new Map(filieres.map((f) => [f.id, f.nom]));
    const classeMap = new Map(classes.map((c) => [c.id, c.nom]));
    const animMap = new Map(animateurs.map((a) => [a.id, `${a.prenom} ${a.nom}`]));

    const data = planning.map((p) => ({
      'Jour': p.jour,
      'Heure Début': p.heureDebut,
      'Heure Fin': p.heureFin,
      'Filière': filiereMap.get(p.filiereId) || '',
      'Classe': classeMap.get(p.classeId) || '',
      'Séance / Matière': p.matiere,
      'Formateur / Animateur': animMap.get(p.animateurId) || '',
      'Salle / Atelier': p.salle
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Planning');
    XLSX.writeFile(workbook, `Planning_CDC_Yaakoub_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
};
