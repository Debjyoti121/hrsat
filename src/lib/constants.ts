export const VIOLATION_TYPES = [
  "Arbitrary Arrest or Detention",
  "Enforced Disappearance",
  "Torture or Cruel, Inhuman, or Degrading Treatment",
  "Extrajudicial Killing",
  "Religious Persecution",
  "Discrimination Based on Race, Ethnicity, Religion, Gender, or Caste",
  "Human Trafficking",
  "Forced Labour or Modern Slavery",
  "Sexual Violence or Exploitation",
  "Child Rights Violations",
  "Forced Marriage",
  "Restrictions on Freedom of Expression or Media",
  "Restrictions on Freedom of Assembly or Association",
  "Property Seizure, Destruction, or Forced Eviction",
  "Hate Crime or Communal Violence",
  "Other",
] as const;

export const RELATIONSHIPS = [
  "Self", "Family member", "Friend", "Witness", "Community member", "Human rights defender",
  "Journalist", "Legal representative", "Organisation representative", "Other",
];

export const GENDERS = ["Male", "Female", "Non-binary / Other", "Prefer not to disclose"];
export const YES_NO_UNKNOWN = ["Yes", "No", "Unknown"];

export const STATUSES = {
  NEW: { label: "New", tone: "bg-sky-50 text-sky-700 ring-sky-600/20", dot: "bg-sky-500" },
  IN_REVIEW: { label: "In review", tone: "bg-amber-50 text-amber-800 ring-amber-600/20", dot: "bg-amber-500" },
  NEEDS_INFO: { label: "Needs info", tone: "bg-violet-50 text-violet-700 ring-violet-600/20", dot: "bg-violet-500" },
  VERIFIED: { label: "Verified", tone: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  CLOSED: { label: "Closed", tone: "bg-slate-100 text-slate-600 ring-slate-500/20", dot: "bg-slate-400" },
} as const;
export type Status = keyof typeof STATUSES;

export const PRIORITIES = {
  LOW: { label: "Low", tone: "text-slate-500" },
  MEDIUM: { label: "Medium", tone: "text-slate-700" },
  HIGH: { label: "High", tone: "text-orange-600" },
  URGENT: { label: "Urgent", tone: "text-red-600" },
} as const;
export type Priority = keyof typeof PRIORITIES;

/** Public-facing wording used in emails and on the tracking page */
export const PUBLIC_STATUS: Record<string, string> = {
  NEW: "Received — awaiting review",
  IN_REVIEW: "Under confidential review",
  NEEDS_INFO: "Additional information requested",
  VERIFIED: "Documented and verified",
  CLOSED: "Closed",
};

export const COUNTRIES = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Côte d'Ivoire","Croatia","Cuba","Cyprus","Czechia","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","São Tomé and Príncipe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Türkiye","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];

export const CONTACT = {
  email: "info@hrsat.org",
  address: "Riviervismarkt 5, unit 2.07, 2513 AM The Hague, Netherlands",
  socials: {
    linkedin: "https://www.linkedin.com/company/global-human-rights-defence/",
    youtube: "https://www.youtube.com/@ghrtvworldnews",
    instagram: "https://www.instagram.com/globalhumanrightsdefence/",
    x: "https://x.com/ghrdthehague",
  },
};
