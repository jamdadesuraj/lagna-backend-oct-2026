import mongoose from 'mongoose';
import config from '../app/config';
import { Height } from '../app/modules/admin/height/height.model';
import { AnnualIncome } from '../app/modules/admin/annual-income/annualIncome.model';
import { MotherTongue } from '../app/modules/admin/mother-tongue/motherTongue.model';
import { Occupation } from '../app/modules/admin/occupation/occupation.model';
import { Qualification } from '../app/modules/admin/qualification/qualification.model';
import { Religion } from '../app/modules/admin/religion/religion.model';
import { Caste } from '../app/modules/admin/religion/caste/caste.model';
import { SubCaste } from '../app/modules/admin/religion/caste/sub-caste/subCaste.model';
import Auth from '../app/modules/auth/auth.model';
import { UserRole } from '../app/modules/auth/auth.interface';

// Seeds all master data in one go. Safe to re-run (existing rows are skipped).
//
// Usage (from backend/):
//   npx ts-node-dev --transpile-only src/scripts/seedMasters.ts                 (all masters)
//   npx ts-node-dev --transpile-only src/scripts/seedMasters.ts height religion (only these)
//
// Names: height, annualIncome, motherTongue, occupation, qualification, religion

// ============================================================
// height
// ============================================================

// Generates 4'0" to 7'0" (format matches the admin API example: 5'8")
const buildHeights = (): string[] => {
  const heights: string[] = [];

  for (let feet = 4; feet <= 6; feet++) {
    for (let inches = 0; inches <= 11; inches++) {
      heights.push(`${feet}'${inches}"`);
    }
  }

  heights.push(`7'0"`);

  return heights;
};

const seedHeights = async (): Promise<void> => {
  const heights = buildHeights();

  const result = await Height.bulkWrite(
    heights.map((height) => ({
      updateOne: {
        filter: { height },
        update: { $setOnInsert: { isDeleted: false } },
        upsert: true,
      },
    })),
  );

  const inserted = result.upsertedCount;

  console.log(
    `[Height] total: ${heights.length}, inserted: ${inserted}, already existed: ${heights.length - inserted}`,
  );
};

// ============================================================
// annualIncome
// ============================================================

const ONE_LAKH = 100000;
const ONE_CRORE = 10000000;

interface IAnnualIncomeSeed {
  annualIncome: string;
  minIncome: number;
  maxIncome: number | null;
}

// Brackets are contiguous: each maxIncome equals the next minIncome
const annualIncomes: IAnnualIncomeSeed[] = [
  { annualIncome: 'Up to ₹ 1 Lakh', minIncome: 0, maxIncome: 1 * ONE_LAKH },
  {
    annualIncome: '₹ 1 Lakh to 2 Lakhs',
    minIncome: 1 * ONE_LAKH,
    maxIncome: 2 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 2 Lakhs to 3 Lakhs',
    minIncome: 2 * ONE_LAKH,
    maxIncome: 3 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 3 Lakhs to 4 Lakhs',
    minIncome: 3 * ONE_LAKH,
    maxIncome: 4 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 4 Lakhs to 5 Lakhs',
    minIncome: 4 * ONE_LAKH,
    maxIncome: 5 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 5 Lakhs to 7 Lakhs',
    minIncome: 5 * ONE_LAKH,
    maxIncome: 7 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 7 Lakhs to 10 Lakhs',
    minIncome: 7 * ONE_LAKH,
    maxIncome: 10 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 10 Lakhs to 15 Lakhs',
    minIncome: 10 * ONE_LAKH,
    maxIncome: 15 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 15 Lakhs to 20 Lakhs',
    minIncome: 15 * ONE_LAKH,
    maxIncome: 20 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 20 Lakhs to 30 Lakhs',
    minIncome: 20 * ONE_LAKH,
    maxIncome: 30 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 30 Lakhs to 50 Lakhs',
    minIncome: 30 * ONE_LAKH,
    maxIncome: 50 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 50 Lakhs to 75 Lakhs',
    minIncome: 50 * ONE_LAKH,
    maxIncome: 75 * ONE_LAKH,
  },
  {
    annualIncome: '₹ 75 Lakhs to 1 Crore',
    minIncome: 75 * ONE_LAKH,
    maxIncome: ONE_CRORE,
  },
  {
    annualIncome: '₹ 1 Crore and above',
    minIncome: ONE_CRORE,
    maxIncome: null,
  },
];

const seedAnnualIncomes = async (): Promise<void> => {
  const result = await AnnualIncome.bulkWrite(
    annualIncomes.map(({ annualIncome, minIncome, maxIncome }) => ({
      updateOne: {
        filter: { annualIncome },
        update: {
          $setOnInsert: {
            minIncome,
            maxIncome,
            isDeleted: false,
          },
        },
        upsert: true,
      },
    })),
  );

  const inserted = result.upsertedCount;

  console.log(
    `[AnnualIncome] total: ${annualIncomes.length}, inserted: ${inserted}, already existed: ${annualIncomes.length - inserted}`,
  );
};

// ============================================================
// motherTongue
// ============================================================

const motherTongues: string[] = [
  'Assamese',
  'Awadhi',
  'Bengali',
  'Bhojpuri',
  'Bodo',
  'Chhattisgarhi',
  'Dogri',
  'English',
  'Garhwali',
  'Garo',
  'Gujarati',
  'Haryanvi',
  'Hindi',
  'Kannada',
  'Kashmiri',
  'Khasi',
  'Kodava',
  'Konkani',
  'Kumaoni',
  'Magahi',
  'Maithili',
  'Malayalam',
  'Manipuri (Meitei)',
  'Marathi',
  'Marwari',
  'Mizo',
  'Nepali',
  'Odia',
  'Punjabi',
  'Rajasthani',
  'Sanskrit',
  'Santali',
  'Sindhi',
  'Tamil',
  'Telugu',
  'Tulu',
  'Urdu',
  'Other',
];

const seedMotherTongues = async (): Promise<void> => {
  const result = await MotherTongue.bulkWrite(
    motherTongues.map((motherTongue) => ({
      updateOne: {
        filter: { motherTongue },
        update: { $setOnInsert: { isDeleted: false } },
        upsert: true,
      },
    })),
  );

  const inserted = result.upsertedCount;

  console.log(
    `[MotherTongue] total: ${motherTongues.length}, inserted: ${inserted}, already existed: ${motherTongues.length - inserted}`,
  );
};

// ============================================================
// occupation
// ============================================================

const occupations: string[] = [
  'IT / Software',
  'Business / Self Employed',
  'Entrepreneur / Startup Founder',
  'Government Service',
  'Public Sector / PSU',
  'Private Sector',
  'Civil Services (IAS / IPS / IFS)',
  'Defence / Armed Forces',
  'Police / Law Enforcement',
  'Engineer',
  'Doctor / Medical Professional',
  'Nursing / Healthcare',
  'Pharmacy',
  'Teaching / Professor / Education',
  'Banking / Finance',
  'Chartered Accountant / CA',
  'Lawyer / Legal',
  'Architecture / Interior Design',
  'Designer / Creative',
  'Media / Journalism',
  'Pilot / Aviation',
  'Merchant Navy / Marine',
  'Scientist / Researcher',
  'Agriculture / Farming',
  'Hospitality / Hotel Management',
  'Real Estate / Construction',
  'Manufacturing / Industry',
  'Sales / Marketing',
  'Consultant',
  'Freelancer',
  'Artist / Sports / Entertainment',
  'Student',
  'Not Working',
  'Homemaker',
  'Retired',
  'Other',
];

// createdBy is required on the Occupation model — use the admin's id,
// fall back to "system" if the admin has not been created yet.
const resolveCreatedBy = async (): Promise<string> => {
  const admin = await Auth.findOne({ role: UserRole.ADMIN })
    .select('_id')
    .lean();

  if (!admin) {
    console.warn(`[Occupation] No admin found, using createdBy = "system"`);
    return 'system';
  }

  return String(admin._id);
};

const seedOccupations = async (): Promise<void> => {
  const createdBy = await resolveCreatedBy();

  const result = await Occupation.bulkWrite(
    occupations.map((occupation) => ({
      updateOne: {
        filter: { occupation },
        update: { $setOnInsert: { createdBy, isDeleted: false } },
        upsert: true,
      },
    })),
  );

  const inserted = result.upsertedCount;

  console.log(
    `[Occupation] total: ${occupations.length}, inserted: ${inserted}, already existed: ${occupations.length - inserted}`,
  );
};

// ============================================================
// qualification
// ============================================================

// Each Qualification document is one (qualification, educationType, occupation) row.
// Rows are generated as qualifications x occupations within each education type.
interface IQualificationGroup {
  educationType: string;
  qualifications: string[];
  occupations: string[];
}

const groups: IQualificationGroup[] = [
  {
    educationType: 'Engineering',
    qualifications: [
      'Diploma in Engineering',
      'Bachelor of Engineering (B.E.)',
      'Bachelor of Technology (B.Tech)',
      'Master of Engineering (M.E.)',
      'Master of Technology (M.Tech)',
    ],
    occupations: [
      'Software Engineer',
      'Civil Engineer',
      'Mechanical Engineer',
      'Electrical Engineer',
      'Electronics Engineer',
      'Chemical Engineer',
      'Project Manager',
      'Production Engineer',
    ],
  },
  {
    educationType: 'Computer Science / IT',
    qualifications: [
      'Bachelor of Computer Applications (BCA)',
      'B.Sc Computer Science',
      'B.Sc Information Technology',
      'Master of Computer Applications (MCA)',
      'M.Sc Computer Science',
    ],
    occupations: [
      'Software Developer',
      'Backend Developer',
      'Frontend Developer',
      'Full Stack Developer',
      'Mobile App Developer',
      'Data Analyst',
      'Data Scientist',
      'QA / Test Engineer',
      'UI / UX Designer',
      'System Administrator',
    ],
  },
  {
    educationType: 'Medicine',
    qualifications: ['MBBS', 'MD', 'MS'],
    occupations: [
      'Doctor',
      'Surgeon',
      'Medical Officer',
      'Consultant Physician',
      'Resident Doctor',
    ],
  },
  {
    educationType: 'Dental',
    qualifications: ['BDS', 'MDS'],
    occupations: [
      'Dentist',
      'Orthodontist',
      'Dental Surgeon',
      'Dental Clinic Owner',
    ],
  },
  {
    educationType: 'Ayush / Alternative Medicine',
    qualifications: ['BAMS', 'BHMS', 'BUMS'],
    occupations: [
      'Ayurvedic Doctor',
      'Homeopathic Doctor',
      'Unani Doctor',
      'Clinic Owner',
    ],
  },
  {
    educationType: 'Pharmacy',
    qualifications: [
      'Diploma in Pharmacy (D.Pharm)',
      'Bachelor of Pharmacy (B.Pharm)',
      'Master of Pharmacy (M.Pharm)',
    ],
    occupations: [
      'Pharmacist',
      'Medical Store Owner',
      'Clinical Research Associate',
      'Pharma Sales Executive',
    ],
  },
  {
    educationType: 'Nursing & Allied Health',
    qualifications: [
      'General Nursing and Midwifery (GNM)',
      'B.Sc Nursing',
      'M.Sc Nursing',
      'Bachelor of Physiotherapy (BPT)',
      'Master of Physiotherapy (MPT)',
    ],
    occupations: [
      'Nurse',
      'Physiotherapist',
      'Lab Technician',
      'Healthcare Professional',
    ],
  },
  {
    educationType: 'Chartered Accountancy',
    qualifications: ['Chartered Accountant (CA)'],
    occupations: [
      'Chartered Accountant',
      'Auditor',
      'Tax Consultant',
      'Financial Controller',
    ],
  },
  {
    educationType: 'Company Secretary',
    qualifications: ['Company Secretary (CS)'],
    occupations: ['Company Secretary', 'Compliance Officer'],
  },
  {
    educationType: 'Commerce',
    qualifications: [
      'Bachelor of Commerce (B.Com)',
      'Master of Commerce (M.Com)',
    ],
    occupations: [
      'Accountant',
      'Auditor',
      'Tax Consultant',
      'Bank Officer',
      'Financial Analyst',
    ],
  },
  {
    educationType: 'Management',
    qualifications: [
      'Bachelor of Business Administration (BBA)',
      'Master of Business Administration (MBA)',
      'Post Graduate Diploma in Management (PGDM)',
      'Executive MBA',
    ],
    occupations: [
      'Manager',
      'Business Analyst',
      'Marketing Manager',
      'HR Manager',
      'Operations Manager',
      'Product Manager',
      'Consultant',
      'Business Owner',
    ],
  },
  {
    educationType: 'Science',
    qualifications: [
      'Bachelor of Science (B.Sc)',
      'Master of Science (M.Sc)',
      'Ph.D',
    ],
    occupations: [
      'Scientist',
      'Research Associate',
      'Lab Technician',
      'Lecturer',
      'Data Analyst',
    ],
  },
  {
    educationType: 'Education',
    qualifications: [
      'Diploma in Education (D.Ed)',
      'Bachelor of Education (B.Ed)',
      'Master of Education (M.Ed)',
    ],
    occupations: ['Teacher', 'Lecturer', 'Professor', 'Principal'],
  },
  {
    educationType: 'Arts & Humanities',
    qualifications: [
      'Bachelor of Arts (BA)',
      'Master of Arts (MA)',
      'Bachelor of Social Work (BSW)',
      'Master of Social Work (MSW)',
    ],
    occupations: [
      'Writer',
      'Social Worker',
      'Government Employee',
      'Translator',
      'Content Creator',
      'Teacher',
    ],
  },
  {
    educationType: 'Mass Communication & Media',
    qualifications: [
      'Bachelor of Journalism and Mass Communication (BJMC)',
      'Master of Journalism and Mass Communication (MJMC)',
    ],
    occupations: [
      'Journalist',
      'Content Creator',
      'Video Editor',
      'PR Manager',
      'Media Producer',
    ],
  },
  {
    educationType: 'Law',
    qualifications: [
      'Bachelor of Laws (LLB)',
      'BA LLB',
      'Master of Laws (LLM)',
    ],
    occupations: [
      'Advocate',
      'Legal Advisor',
      'Corporate Lawyer',
      'Public Prosecutor',
      'Judge / Judicial Officer',
    ],
  },
  {
    educationType: 'Architecture & Design',
    qualifications: [
      'Bachelor of Architecture (B.Arch)',
      'Master of Architecture (M.Arch)',
      'Bachelor of Design (B.Des)',
      'Master of Design (M.Des)',
    ],
    occupations: [
      'Architect',
      'Interior Designer',
      'Graphic Designer',
      'Fashion Designer',
      'Product Designer',
    ],
  },
  {
    educationType: 'Aviation & Marine',
    qualifications: [
      'Commercial Pilot License (CPL)',
      'B.Sc Aviation',
      'B.Sc Nautical Science',
      'Diploma in Nautical Science',
    ],
    occupations: [
      'Pilot',
      'Cabin Crew',
      'Merchant Navy Officer',
      'Aircraft Maintenance Engineer',
    ],
  },
  {
    educationType: 'Hospitality',
    qualifications: [
      'Bachelor of Hotel Management (BHM)',
      'Diploma in Hotel Management',
    ],
    occupations: [
      'Hotel Manager',
      'Chef',
      'Front Office Executive',
      'Food & Beverage Manager',
    ],
  },
  {
    educationType: 'Agriculture',
    qualifications: ['B.Sc Agriculture', 'M.Sc Agriculture'],
    occupations: [
      'Farmer',
      'Agricultural Officer',
      'Agronomist',
      'Agri Business Owner',
    ],
  },
  {
    educationType: 'ITI / Diploma',
    qualifications: ['ITI', 'Diploma (Other)'],
    occupations: ['Technician', 'Electrician', 'Mechanic', 'Supervisor'],
  },
  {
    educationType: 'High School',
    qualifications: ['10th (SSC)', '12th (HSC)'],
    occupations: [
      'Self Employed',
      'Shop Owner',
      'Sales Executive',
      'Technician',
      'Farmer',
      'Clerk',
    ],
  },
];

interface IQualificationSeed {
  qualification: string;
  educationType: string;
  occupation: string;
}

const buildQualifications = (): IQualificationSeed[] => {
  const rows: IQualificationSeed[] = [];

  for (const group of groups) {
    for (const qualification of group.qualifications) {
      for (const occupation of group.occupations) {
        rows.push({
          qualification,
          educationType: group.educationType,
          occupation,
        });
      }
    }
  }

  return rows;
};

const seedQualifications = async (): Promise<void> => {
  const rows = buildQualifications();

  // No unique index on this model, so match on all three fields to stay idempotent
  const result = await Qualification.bulkWrite(
    rows.map((row) => ({
      updateOne: {
        filter: row,
        update: { $setOnInsert: { isDeleted: false } },
        upsert: true,
      },
    })),
  );

  const inserted = result.upsertedCount;

  console.log(
    `[Qualification] total: ${rows.length}, inserted: ${inserted}, already existed: ${rows.length - inserted}`,
  );
};

// ============================================================
// religion
// ============================================================

interface ICasteSeed {
  caste: string;
  subCastes?: string[];
}

interface IReligionSeed {
  religion: string;
  castes: ICasteSeed[];
}

const religions: IReligionSeed[] = [
  {
    religion: 'Hindu',
    castes: [
      {
        caste: 'Brahmin',
        subCastes: [
          'Deshastha',
          'Kokanastha (Chitpavan)',
          'Karhade',
          'Saraswat',
          'Gaur',
          'Iyer',
          'Iyengar',
          'Maithil',
          'Kanyakubja',
          'Saryupareen',
        ],
      },
      {
        caste: 'Maratha',
        subCastes: ['96 Kuli Maratha', 'Maratha Kunbi', 'Maratha Patil'],
      },
      { caste: 'Kunbi' },
      {
        caste: 'Rajput',
        subCastes: [
          'Rathore',
          'Chauhan',
          'Sisodia',
          'Parmar',
          'Solanki',
          'Bundela',
        ],
      },
      {
        caste: 'Agarwal',
        subCastes: ['Goyal', 'Garg', 'Singhal', 'Mittal', 'Bansal'],
      },
      { caste: 'Baniya / Vaishya' },
      {
        caste: 'Kayastha',
        subCastes: [
          'Chitraguptavanshi',
          'Srivastava',
          'Mathur',
          'Saxena',
          'Bhatnagar',
        ],
      },
      { caste: 'Kshatriya' },
      { caste: 'Yadav' },
      { caste: 'Jat' },
      { caste: 'Gujjar' },
      {
        caste: 'Patel',
        subCastes: ['Leuva Patel', 'Kadva Patel'],
      },
      { caste: 'Mali' },
      { caste: 'Koli' },
      { caste: 'Dhangar' },
      { caste: 'Teli' },
      { caste: 'Sonar' },
      { caste: 'Kumbhar' },
      { caste: 'Vishwakarma' },
      { caste: 'Gupta' },
      {
        caste: 'Lingayat',
        subCastes: ['Panchamasali', 'Banajiga', 'Sadar', 'Jangam'],
      },
      {
        caste: 'Vokkaliga',
        subCastes: ['Gowda', 'Kunchitiga'],
      },
      {
        caste: 'Reddy',
        subCastes: [
          'Panta Reddy',
          'Pakanati Reddy',
          'Motati Reddy',
          'Gone Reddy',
        ],
      },
      { caste: 'Kamma' },
      { caste: 'Kapu' },
      { caste: 'Naidu' },
      { caste: 'Nair' },
      { caste: 'Ezhava' },
      { caste: 'Nadar' },
      { caste: 'Thevar' },
      { caste: 'Mudaliar' },
      { caste: 'Chettiar' },
      { caste: 'Scheduled Caste (SC)' },
      { caste: 'Scheduled Tribe (ST)' },
      { caste: 'Other' },
    ],
  },
  {
    religion: 'Muslim',
    castes: [
      {
        caste: 'Sunni',
        subCastes: [
          'Hanafi',
          "Shafi'i",
          'Maliki',
          'Hanbali',
          'Barelvi',
          'Deobandi',
        ],
      },
      {
        caste: 'Shia',
        subCastes: ['Ithna Ashari', 'Ismaili', 'Dawoodi Bohra'],
      },
      { caste: 'Syed' },
      { caste: 'Sheikh' },
      { caste: 'Pathan' },
      { caste: 'Ansari' },
      { caste: 'Qureshi' },
      { caste: 'Mughal' },
      { caste: 'Memon' },
      { caste: 'Khoja' },
      { caste: 'Other' },
    ],
  },
  {
    religion: 'Christian',
    castes: [
      {
        caste: 'Roman Catholic',
        subCastes: [
          'Latin Catholic',
          'Syro-Malabar',
          'Syro-Malankara',
          'Goan Catholic',
          'East Indian Catholic',
        ],
      },
      { caste: 'Protestant' },
      { caste: 'Orthodox' },
      { caste: 'Syrian Christian' },
      { caste: 'Jacobite' },
      { caste: 'Marthoma' },
      { caste: 'Church of South India (CSI)' },
      { caste: 'Anglican' },
      { caste: 'Methodist' },
      { caste: 'Baptist' },
      { caste: 'Lutheran' },
      { caste: 'Pentecostal' },
      { caste: 'Evangelical' },
      { caste: 'Born Again' },
      { caste: 'Other' },
    ],
  },
  {
    religion: 'Sikh',
    castes: [
      { caste: 'Jat Sikh' },
      { caste: 'Khatri' },
      { caste: 'Arora' },
      { caste: 'Ramgarhia' },
      { caste: 'Saini' },
      { caste: 'Kamboj' },
      { caste: 'Lubana' },
      { caste: 'Ravidasia' },
      { caste: 'Majhabi' },
      { caste: 'Other' },
    ],
  },
  {
    religion: 'Jain',
    castes: [
      {
        caste: 'Digambar',
        subCastes: ['Terapanth', 'Bispanth', 'Taranpanth'],
      },
      {
        caste: 'Shwetambar',
        subCastes: ['Murtipujak', 'Sthanakvasi', 'Terapanthi'],
      },
      { caste: 'Oswal' },
      { caste: 'Porwal' },
      { caste: 'Agarwal Jain' },
      { caste: 'Khandelwal Jain' },
      { caste: 'Other' },
    ],
  },
  {
    religion: 'Buddhist',
    castes: [
      { caste: 'Neo-Buddhist' },
      { caste: 'Theravada' },
      { caste: 'Mahayana' },
      { caste: 'Vajrayana' },
      { caste: 'Other' },
    ],
  },
  {
    religion: 'Parsi',
    castes: [{ caste: 'Parsi' }, { caste: 'Irani' }],
  },
  {
    religion: 'Jewish',
    castes: [
      { caste: 'Bene Israel' },
      { caste: 'Baghdadi' },
      { caste: 'Cochin Jewish' },
      { caste: 'Bnei Menashe' },
    ],
  },
  {
    religion: 'Other',
    castes: [],
  },
];

const seedReligions = async (): Promise<void> => {
  // 1. Religions

  const religionResult = await Religion.bulkWrite(
    religions.map(({ religion }) => ({
      updateOne: {
        filter: { religion },
        update: { $setOnInsert: { isDeleted: false } },
        upsert: true,
      },
    })),
  );

  const religionDocs = await Religion.find({
    religion: { $in: religions.map((item) => item.religion) },
  })
    .select('_id religion')
    .lean();

  const religionIdByName = new Map<string, string>(
    religionDocs.map((doc) => [doc.religion, String(doc._id)]),
  );

  // 2. Castes

  const casteRows = religions.flatMap(({ religion, castes }) =>
    castes.map(({ caste }) => ({
      religionId: religionIdByName.get(religion)!,
      caste,
    })),
  );

  const casteResult = await Caste.bulkWrite(
    casteRows.map(({ religionId, caste }) => ({
      updateOne: {
        filter: { religionId, caste },
        update: { $setOnInsert: { isDeleted: false } },
        upsert: true,
      },
    })),
  );

  const casteDocs = await Caste.find({
    religionId: { $in: Array.from(religionIdByName.values()) },
  })
    .select('_id religionId caste')
    .lean();

  const casteIdByKey = new Map<string, string>(
    casteDocs.map((doc) => [
      `${String(doc.religionId)}|${doc.caste}`,
      String(doc._id),
    ]),
  );

  // 3. Sub-castes

  const subCasteRows = religions.flatMap(({ religion, castes }) => {
    const religionId = religionIdByName.get(religion)!;

    return castes.flatMap(({ caste, subCastes }) =>
      (subCastes ?? []).map((subCaste) => ({
        religionId,
        casteId: casteIdByKey.get(`${religionId}|${caste}`)!,
        subCaste,
      })),
    );
  });

  const subCasteResult = await SubCaste.bulkWrite(
    subCasteRows.map(({ religionId, casteId, subCaste }) => ({
      updateOne: {
        filter: { casteId, subCaste },
        update: { $setOnInsert: { religionId, isDeleted: false } },
        upsert: true,
      },
    })),
  );

  console.log(
    `[Religion] total: ${religions.length}, inserted: ${religionResult.upsertedCount}`,
  );
  console.log(
    `[Caste] total: ${casteRows.length}, inserted: ${casteResult.upsertedCount}`,
  );
  console.log(
    `[SubCaste] total: ${subCasteRows.length}, inserted: ${subCasteResult.upsertedCount}`,
  );
};

// ============================================================
// Runner
// ============================================================

const masterSeeders: Record<string, () => Promise<void>> = {
  height: seedHeights,
  annualIncome: seedAnnualIncomes,
  motherTongue: seedMotherTongues,
  occupation: seedOccupations,
  qualification: seedQualifications,
  religion: seedReligions, // also seeds castes and sub-castes
};

const main = async (): Promise<void> => {
  const only = process.argv.slice(2);
  const available = Object.keys(masterSeeders);
  const unknown = only.filter((name) => !masterSeeders[name]);

  if (unknown.length) {
    throw new Error(
      `Unknown seeder(s): ${unknown.join(', ')}. Available: ${available.join(', ')}`,
    );
  }

  await mongoose.connect(config.database_url as string);
  console.log('Database connected.');

  try {
    for (const name of only.length ? only : available) {
      await masterSeeders[name]();
    }
    console.log('Master seeding completed.');
  } finally {
    await mongoose.disconnect();
  }
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Master seeding failed:', error);
    process.exit(1);
  });
