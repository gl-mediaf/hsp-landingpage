export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    vorname, nachname, alter,
    email, phone, erreichbarkeit,
    stadt, plz, land, motivation,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    fbclid, gclid, ScCid,
  } = req.body;

  const fields = {
    'Datum': new Date().toISOString(),
    'Vorname': vorname || '',
    'Nachname': nachname || '',
    'Email': email || '',
    'Phone': phone || '',
    'Motivation': motivation || '',
    'Stadt': stadt || '',
    'PLZ': plz || '',
    'Land': land || '',
    'Status': 'Beworben',
  };

  if (erreichbarkeit) fields['Erreichbarkeit'] = erreichbarkeit;
  if (utm_source)    fields['Source']    = utm_source;
  if (utm_medium)    fields['Medium']    = utm_medium;
  if (utm_campaign)  fields['Campaign']  = utm_campaign;
  if (utm_content)   fields['Content']   = utm_content;
  if (utm_term)      fields['Zielgruppe'] = utm_term;
  if (fbclid)        fields['fbclid']    = fbclid;
  if (gclid)         fields['gclid']     = gclid;
  if (ScCid)         fields['Content']   = (fields['Content'] ? fields['Content'] + ' | ScCid:' : 'ScCid:') + ScCid;

  try {
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/appnSlhPDnFbHZGnh/tblL8ttCgeBrPZ7fn`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!airtableRes.ok) {
      const err = await airtableRes.text();
      console.error('Airtable error:', err);
      return res.status(500).json({ error: 'Airtable error' });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Submit error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
