import {
  Beneficiaire,
  Filiere,
  Classe,
  Animateur,
  SeancePlanning,
  EnregistrementPresence,
  Infraction,
  Convocation,
  ParametresCentre
} from '../types';

export const initialParametres: ParametresCentre = {
  nomCentre: 'CENTRE DE DEUXIÈME CHANCE – NOUVELLE GÉNÉRATION',
  nomSousTitre: 'YAAKOUB EL MANSOUR - RABAT',
  adresse: 'Avenue Al Massira, Yaakoub El Mansour',
  ville: 'Rabat',
  telephone: '+212 5 37 28 40 10',
  email: 'contact.c2c.yaakoub@men.gov.ma',
  directeurNom: 'M. Mohammed Bennani',
  anneeScolaireActive: '2025-2026',
  horaireMatin: '08:30 - 12:30',
  horaireApresMidi: '14:30 - 18:30'
};

export const initialFilieres: Filiere[] = [
  {
    id: 'fil-1',
    code: 'ELEC',
    nom: 'Électricité de Bâtiment et Domotique',
    description: 'Installation, maintenance et équipements électriques basse tension et domotique.',
    dureeMois: 10,
    statut: 'Active'
  },
  {
    id: 'fil-2',
    code: 'COUT',
    nom: 'Couture, Modélisme et Confection',
    description: 'Conception, coupe et fabrication artisanale et industrielle de vêtements.',
    dureeMois: 10,
    statut: 'Active'
  },
  {
    id: 'fil-3',
    code: 'INFO',
    nom: 'Informatique et Métiers du Numérique',
    description: 'Bureautique avancée, infographie, maintenance informatique et développement web.',
    dureeMois: 10,
    statut: 'Active'
  },
  {
    id: 'fil-4',
    code: 'MEN-BOIS',
    nom: 'Menuiserie, Agencement et Décoration',
    description: 'Travail du bois, machines-outils traditionnelles et agencement moderne.',
    dureeMois: 10,
    statut: 'Active'
  },
  {
    id: 'fil-5',
    code: 'CUIS',
    nom: 'Cuisine et Restauration Professionnelle',
    description: 'Techniques culinaires marocaines et internationales, hygiène alimentaire et service.',
    dureeMois: 10,
    statut: 'Active'
  }
];

export const initialClasses: Classe[] = [
  {
    id: 'cls-101',
    code: 'ELEC-1',
    nom: 'Électricité Groupe A',
    filiereId: 'fil-1',
    anneeScolaire: '2025-2026',
    capaciteMax: 20,
    statut: 'Active'
  },
  {
    id: 'cls-102',
    code: 'ELEC-2',
    nom: 'Électricité Groupe B',
    filiereId: 'fil-1',
    anneeScolaire: '2025-2026',
    capaciteMax: 20,
    statut: 'Active'
  },
  {
    id: 'cls-201',
    code: 'COUT-1',
    nom: 'Couture & Modélisme A',
    filiereId: 'fil-2',
    anneeScolaire: '2025-2026',
    capaciteMax: 18,
    statut: 'Active'
  },
  {
    id: 'cls-301',
    code: 'INFO-1',
    nom: 'Numérique & Bureautique A',
    filiereId: 'fil-3',
    anneeScolaire: '2025-2026',
    capaciteMax: 22,
    statut: 'Active'
  },
  {
    id: 'cls-401',
    code: 'MEN-1',
    nom: 'Menuiserie Agencement A',
    filiereId: 'fil-4',
    anneeScolaire: '2025-2026',
    capaciteMax: 16,
    statut: 'Active'
  }
];

export const initialAnimateurs: Animateur[] = [
  {
    id: 'anim-1',
    nom: 'El Amrani',
    prenom: 'Karim',
    telephone: '0661234589',
    email: 'k.elamrani@c2c.ma',
    fonction: 'Formateur',
    filiereId: 'fil-1',
    matiere: 'Installations Électriques & Schémas',
    statut: 'Actif',
    remarque: 'Formateur certifié OFPPT'
  },
  {
    id: 'anim-2',
    nom: 'Benjelloun',
    prenom: 'Fatima-Zahra',
    telephone: '0663456789',
    email: 'fz.benjelloun@c2c.ma',
    fonction: 'Animatrice',
    filiereId: 'fil-2',
    matiere: 'Patronage & Couture Traditionnelle',
    statut: 'Actif',
    remarque: 'Formatrice d’expérience artisanale'
  },
  {
    id: 'anim-3',
    nom: 'Tazi',
    prenom: 'Omar',
    telephone: '0667890123',
    email: 'o.tazi@c2c.ma',
    fonction: 'Formateur',
    filiereId: 'fil-3',
    matiere: 'Bureautique & Développement Web',
    statut: 'Actif',
    remarque: 'Ingénieur informatique'
  },
  {
    id: 'anim-4',
    nom: 'Mansouri',
    prenom: 'Hassan',
    telephone: '0668901234',
    email: 'h.mansouri@c2c.ma',
    fonction: 'Formateur',
    filiereId: 'fil-4',
    matiere: 'Technologie du Bois & Machines',
    statut: 'Actif'
  },
  {
    id: 'anim-5',
    nom: 'Alami',
    prenom: 'Nadia',
    telephone: '0669012345',
    email: 'n.alami@c2c.ma',
    fonction: 'Éducateur spécialisé',
    filiereId: 'fil-1',
    matiere: 'Mise à niveau scolaire & Soft Skills',
    statut: 'Actif',
    remarque: 'Suivi psychosocial et réinsertion'
  }
];

export const initialBeneficiaires: Beneficiaire[] = [
  {
    id: 'ben-001',
    numeroInscription: 'INS-2025-001',
    numeroMassar: 'G134589211',
    nomAr: 'الإدريسي',
    prenomAr: 'يوسف',
    nomFr: 'El Idrissi',
    prenomFr: 'Youssef',
    sexe: 'Masculin',
    dateNaissance: '2008-04-12',
    lieuNaissance: 'Rabat',
    niveauScolaire: '2ème année collège',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    telephone: '0612457890',
    telephoneTuteur: '0661223344',
    nomTuteur: 'Ahmed El Idrissi (Père)',
    adresse: 'Hay El Fath, Bloc 14 N°22, Yaakoub El Mansour, Rabat',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
    anneeScolaire: '2025-2026',
    statut: 'En cours',
    dateInscription: '2025-09-10',
    remarques: 'Très motivé en travaux pratiques.'
  },
  {
    id: 'ben-002',
    numeroInscription: 'INS-2025-002',
    numeroMassar: 'G139824102',
    nomAr: 'بناني',
    prenomAr: 'مريم',
    nomFr: 'Bennani',
    prenomFr: 'Meryem',
    sexe: 'Féminin',
    dateNaissance: '2007-09-24',
    lieuNaissance: 'Salé',
    niveauScolaire: '3ème année collège',
    filiereId: 'fil-2',
    classeId: 'cls-201',
    telephone: '0678123456',
    telephoneTuteur: '0665998877',
    nomTuteur: 'Khadija Bennani (Mère)',
    adresse: 'Hay Al Qods, Rue 12 N°5, Yaakoub El Mansour, Rabat',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    anneeScolaire: '2025-2026',
    statut: 'En cours',
    dateInscription: '2025-09-12'
  },
  {
    id: 'ben-003',
    numeroInscription: 'INS-2025-003',
    numeroMassar: 'J145678901',
    nomAr: 'الصديقي',
    prenomAr: 'حمزة',
    nomFr: 'Seddiki',
    prenomFr: 'Hamza',
    sexe: 'Masculin',
    dateNaissance: '2008-01-18',
    lieuNaissance: 'Témara',
    niveauScolaire: '1ère année collège',
    filiereId: 'fil-3',
    classeId: 'cls-301',
    telephone: '0623456789',
    telephoneTuteur: '0671122334',
    nomTuteur: 'Mustapha Seddiki (Père)',
    adresse: 'Douar El Gueraa, Yaakoub El Mansour, Rabat',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    anneeScolaire: '2025-2026',
    statut: 'En cours',
    dateInscription: '2025-09-15'
  },
  {
    id: 'ben-004',
    numeroInscription: 'INS-2025-004',
    numeroMassar: 'G140112233',
    nomAr: 'الشريف',
    prenomAr: 'فاطمة',
    nomFr: 'Cherif',
    prenomFr: 'Fatima',
    sexe: 'Féminin',
    dateNaissance: '2008-11-05',
    lieuNaissance: 'Rabat',
    niveauScolaire: '6ème année primaire',
    filiereId: 'fil-2',
    classeId: 'cls-201',
    telephone: '0634567890',
    telephoneTuteur: '0662334455',
    nomTuteur: 'Aicha Cherif (Mère)',
    adresse: 'Rue Cadi Ayad N°19, Yaakoub El Mansour, Rabat',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    anneeScolaire: '2025-2026',
    statut: 'En cours',
    dateInscription: '2025-09-16'
  },
  {
    id: 'ben-005',
    numeroInscription: 'INS-2025-005',
    numeroMassar: 'G138877665',
    nomAr: 'التازي',
    prenomAr: 'أمين',
    nomFr: 'Tazi',
    prenomFr: 'Amine',
    sexe: 'Masculin',
    dateNaissance: '2007-06-30',
    lieuNaissance: 'Kénitra',
    niveauScolaire: '2ème année collège',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    telephone: '0645678901',
    telephoneTuteur: '0673445566',
    nomTuteur: 'Hassan Tazi (Père)',
    adresse: 'Avenue Sidi Mohamed Ben Abdellah, Yaakoub El Mansour',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    anneeScolaire: '2025-2026',
    statut: 'En cours',
    dateInscription: '2025-09-18'
  },
  {
    id: 'ben-006',
    numeroInscription: 'INS-2025-006',
    numeroMassar: 'G135544332',
    nomAr: 'المرابط',
    prenomAr: 'سارة',
    nomFr: 'El Morabit',
    prenomFr: 'Sara',
    sexe: 'Féminin',
    dateNaissance: '2008-08-14',
    lieuNaissance: 'Rabat',
    niveauScolaire: '3ème année collège',
    filiereId: 'fil-3',
    classeId: 'cls-301',
    telephone: '0656789012',
    telephoneTuteur: '0664556677',
    nomTuteur: 'Latifa El Morabit (Mère)',
    adresse: 'Massira 1, Groupe 5 Immeuble 8, Yaakoub El Mansour',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    anneeScolaire: '2025-2026',
    statut: 'En cours',
    dateInscription: '2025-09-20'
  },
  {
    id: 'ben-007',
    numeroInscription: 'INS-2025-007',
    numeroMassar: 'J149988771',
    nomAr: 'قاسمي',
    prenomAr: 'طارق',
    nomFr: 'Kasmi',
    prenomFr: 'Tariq',
    sexe: 'Masculin',
    dateNaissance: '2007-12-03',
    lieuNaissance: 'Salé',
    niveauScolaire: '1ère année collège',
    filiereId: 'fil-4',
    classeId: 'cls-401',
    telephone: '0667890124',
    telephoneTuteur: '0675667788',
    nomTuteur: 'Brahim Kasmi (Père)',
    adresse: 'Hay Jdid, Rue 9 N°14, Yaakoub El Mansour, Rabat',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&h=200&fit=crop&crop=face',
    anneeScolaire: '2025-2026',
    statut: 'En cours',
    dateInscription: '2025-09-21'
  },
  {
    id: 'ben-008',
    numeroInscription: 'INS-2025-008',
    numeroMassar: 'G132211990',
    nomAr: 'العلوي',
    prenomAr: 'مهدي',
    nomFr: 'Alaoui',
    prenomFr: 'Mehdi',
    sexe: 'Masculin',
    dateNaissance: '2008-02-28',
    lieuNaissance: 'Rabat',
    niveauScolaire: '5ème année primaire',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    telephone: '0678901235',
    telephoneTuteur: '0666778899',
    nomTuteur: 'Rachid Alaoui (Père)',
    adresse: 'Avenue Al Kifah, N°88, Yaakoub El Mansour',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    anneeScolaire: '2025-2026',
    statut: 'En cours',
    dateInscription: '2025-09-22'
  }
];

export const initialPlanning: SeancePlanning[] = [
  {
    id: 'plan-1',
    jour: 'Lundi',
    heureDebut: '08:30',
    heureFin: '10:30',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    matiere: 'Installations Électriques & Schémas',
    animateurId: 'anim-1',
    salle: 'Atelier Électricité 1'
  },
  {
    id: 'plan-2',
    jour: 'Lundi',
    heureDebut: '10:45',
    heureFin: '12:30',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    matiere: 'Sécurité au Travail & Normes',
    animateurId: 'anim-1',
    salle: 'Salle de cours 2'
  },
  {
    id: 'plan-3',
    jour: 'Lundi',
    heureDebut: '08:30',
    heureFin: '12:30',
    filiereId: 'fil-2',
    classeId: 'cls-201',
    matiere: 'Patronage & Couture',
    animateurId: 'anim-2',
    salle: 'Atelier Couture'
  },
  {
    id: 'plan-4',
    jour: 'Lundi',
    heureDebut: '14:30',
    heureFin: '16:30',
    filiereId: 'fil-3',
    classeId: 'cls-301',
    matiere: 'Bureautique & Informatique',
    animateurId: 'anim-3',
    salle: 'Laboratoire Informatique'
  },
  {
    id: 'plan-5',
    jour: 'Mardi',
    heureDebut: '08:30',
    heureFin: '12:30',
    filiereId: 'fil-4',
    classeId: 'cls-401',
    matiere: 'Menuiserie & Travail du Bois',
    animateurId: 'anim-4',
    salle: 'Atelier Menuiserie'
  },
  {
    id: 'plan-6',
    jour: 'Mardi',
    heureDebut: '14:30',
    heureFin: '17:30',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    matiere: 'Mise à niveau & Compétences de vie',
    animateurId: 'anim-5',
    salle: 'Salle Polyvalente'
  }
];

export const getTodayDateString = (): string => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const initialPresences: EnregistrementPresence[] = [
  // Today's attendances for ELEC-1
  {
    id: 'pres-1',
    date: getTodayDateString(),
    heure: '08:30',
    beneficiaireId: 'ben-001',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    seanceMatiere: 'Installations Électriques & Schémas',
    animateurId: 'anim-1',
    statut: 'Présent'
  },
  {
    id: 'pres-2',
    date: getTodayDateString(),
    heure: '08:30',
    beneficiaireId: 'ben-005',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    seanceMatiere: 'Installations Électriques & Schémas',
    animateurId: 'anim-1',
    statut: 'Retard',
    dureeRetardMinutes: 25,
    motif: 'Panne de bus urbain',
    observation: 'Arrivé à 08h55, admis en atelier.'
  },
  {
    id: 'pres-3',
    date: getTodayDateString(),
    heure: '08:30',
    beneficiaireId: 'ben-008',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    seanceMatiere: 'Installations Électriques & Schémas',
    animateurId: 'anim-1',
    statut: 'Absent',
    motif: 'Non justifié',
    observation: 'Non joignable au téléphone ce matin.',
    justifie: false
  },
  // Yesterday's attendances
  {
    id: 'pres-4',
    date: '2026-10-04',
    heure: '08:30',
    beneficiaireId: 'ben-002',
    filiereId: 'fil-2',
    classeId: 'cls-201',
    seanceMatiere: 'Patronage & Couture Traditionnelle',
    animateurId: 'anim-2',
    statut: 'Présent'
  },
  {
    id: 'pres-5',
    date: '2026-10-04',
    heure: '08:30',
    beneficiaireId: 'ben-004',
    filiereId: 'fil-2',
    classeId: 'cls-201',
    seanceMatiere: 'Patronage & Couture Traditionnelle',
    animateurId: 'anim-2',
    statut: 'Absent',
    motif: 'Rendez-vous médical',
    observation: 'Certificat médical fourni le lendemain.',
    justifie: true
  },
  {
    id: 'pres-6',
    date: '2026-10-03',
    heure: '14:30',
    beneficiaireId: 'ben-003',
    filiereId: 'fil-3',
    classeId: 'cls-301',
    seanceMatiere: 'Bureautique & Informatique',
    animateurId: 'anim-3',
    statut: 'Retard',
    dureeRetardMinutes: 30,
    motif: 'Contrainte familiale',
    observation: 'Admis après avertissement oral.'
  },
  {
    id: 'pres-7',
    date: '2026-10-02',
    heure: '08:30',
    beneficiaireId: 'ben-008',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    seanceMatiere: 'Installations Électriques & Schémas',
    animateurId: 'anim-1',
    statut: 'Absent',
    motif: 'Non justifié',
    observation: 'Deuxième absence consécutive',
    justifie: false
  }
];

export const initialInfractions: Infraction[] = [
  {
    id: 'infr-1',
    beneficiaireId: 'ben-008',
    numeroMassar: 'G132211990',
    date: '2026-10-02',
    heure: '09:15',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    animateurId: 'anim-1',
    typeInfraction: 'Absence répétée',
    description: 'Absences répétées non justifiées aux séances de travaux pratiques.',
    lieu: 'Atelier Électricité',
    gravite: 'Moyenne',
    observation: 'Le bénéficiaire accumule les retards et absences sans justificatif.',
    actionPrise: 'Convocation du parent/tuteur',
    statut: 'En cours'
  },
  {
    id: 'infr-2',
    beneficiaireId: 'ben-007',
    numeroMassar: 'J149988771',
    date: '2026-09-28',
    heure: '11:00',
    filiereId: 'fil-4',
    classeId: 'cls-401',
    animateurId: 'anim-4',
    typeInfraction: 'Perturbation de séance',
    description: 'Bruit excessif et refus de ranger les outils de menuiserie en fin d atelier.',
    lieu: 'Atelier Menuiserie',
    gravite: 'Faible',
    observation: 'Rappel à l ordre par le formateur.',
    actionPrise: 'Avertissement verbal',
    statut: 'Traité'
  },
  {
    id: 'infr-3',
    beneficiaireId: 'ben-005',
    numeroMassar: 'G138877665',
    date: '2026-09-22',
    heure: '15:20',
    filiereId: 'fil-1',
    classeId: 'cls-101',
    animateurId: 'anim-5',
    typeInfraction: 'Utilisation interdite du téléphone',
    description: 'Utilisation du smartphone pendant la séance de mise à niveau malgré les rappels.',
    lieu: 'Salle Polyvalente',
    gravite: 'Faible',
    observation: 'Téléphone déposé à l administration jusqu à la fin de la séance.',
    actionPrise: 'Avertissement verbal',
    statut: 'Résolu'
  }
];

export const initialConvocations: Convocation[] = [
  {
    id: 'conv-1',
    beneficiaireId: 'ben-008',
    date: '2026-10-07',
    heure: '10:00',
    motif: 'Absences répétées non justifiées et manque d assiduité',
    observation: 'Entretien avec le père pour signature d engagement d assiduité.',
    personneConcernee: 'Bénéficiaire et Parent',
    statut: 'En attente',
    sourceType: 'infraction',
    sourceId: 'infr-1',
    dateCreation: '2026-10-02'
  },
  {
    id: 'conv-2',
    beneficiaireId: 'ben-003',
    date: '2026-09-25',
    heure: '11:30',
    motif: 'Retards répétés à la séance du matin',
    observation: 'Mise au point sur la ponctualité effectuée en présence du responsable.',
    personneConcernee: 'Bénéficiaire',
    statut: 'Traité',
    sourceType: 'retard',
    dateCreation: '2026-09-20'
  }
];
