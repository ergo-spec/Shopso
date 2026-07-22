// Country Code List and phone formatting helpers to declutter screen views

export const countryCodes = [
  '1242','1246','1264','1268','1284','1345','1441','1649','1664','1721','1758','1767','1784','1809','1829','1849','1868','1869','1876',
  '211','212','213','216','218','220','221','222','223','224','225','226','227','228','229',
  '230','231','232','233','234','235','236','237','238','239','240','241','242','243','244',
  '245','248','249','250','251','252','253','254','255','256','257','258','260','261','262',
  '263','264','265','266','267','268','269','290','291','297','298','299',
  '350','351','352','353','354','356','357','358','359','370','371','372','373','374',
  '375','376','377','378','379','380','381','382','383','385','386','387','389',
  '420','421','423',
  '500','501','502','503','504','505','506','507','508','509','590','591','592','593','594',
  '595','596','597','598','599',
  '670','672','673','674','675','676','677','678','679','680','681','682','683','685','686',
  '687','688','689','690','691','692',
  '850','852','853','855','856','880','886',
  '960','961','962','963','964','965','966','967','968','970','971','972','973','974','975',
  '976','977','992','993','994','995','996','998',
  '20','27','30','31','32','33','34','36','39','40','41','43','45','46','47','48','49',
  '51','52','53','54','55','56','57','58','60','61','62','63','64','65','66','81','82',
  '84','86','90','91','92','93','94','95','98',
  '1','7'
];

export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  let mc = '';
  for (const c of countryCodes) { if (digits.startsWith(c)) { mc = c; break; } }
  if (mc) {
    if (mc.length === 4 && mc.startsWith('1')) {
      const r = digits.substring(4); const npa = mc.substring(1);
      if (!r) return `+1 ${npa}`;
      if (r.length <= 3) return `+1 ${npa} ${r}`;
      return `+1 ${npa} ${r.substring(0,3)} ${r.substring(3,7)}`;
    }
    const r = digits.substring(mc.length);
    if (!r) return `+${mc}`;
    if (mc === '91') return r.length <= 5 ? `+91 ${r}` : `+91 ${r.substring(0,5)} ${r.substring(5,10)}`;
    if (mc === '1') {
      if (r.length <= 3) return `+1 ${r}`;
      if (r.length <= 6) return `+1 ${r.substring(0,3)} ${r.substring(3)}`;
      return `+1 ${r.substring(0,3)} ${r.substring(3,6)} ${r.substring(6,10)}`;
    }
    if (mc === '971') {
      if (r.length <= 2) return `+971 ${r}`;
      if (r.length <= 5) return `+971 ${r.substring(0,2)} ${r.substring(2)}`;
      return `+971 ${r.substring(0,2)} ${r.substring(2,5)} ${r.substring(5,9)}`;
    }
    if (r.length <= 6) return `+${mc} ${r.substring(0,3)} ${r.substring(3)}`;
    return `+${mc} ${r.substring(0,3)} ${r.substring(3,6)} ${r.substring(6,10)}`;
  }
  return `+${digits}`;
};

export const getPhoneDisplayParts = (phoneVal: string) => {
  if (!phoneVal) return { prefix: '', rest: '' };
  const parts = phoneVal.split(' ');
  if (parts[0].startsWith('+') && parts.length > 1) {
    return {
      prefix: parts[0],
      rest: ' ' + parts.slice(1).join(' '),
    };
  }
  return { prefix: '', rest: phoneVal };
};

export const getFormattedMaxLength = (phoneVal: string) => {
  const digits = phoneVal.replace(/\D/g, '');
  if (digits.startsWith('91')) return 15; // "+91 98765 43210"
  if (digits.startsWith('1')) return 15;  // "+1 555 123 4567"
  return 18;
};
