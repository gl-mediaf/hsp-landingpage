import crypto from 'crypto';

function hash(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

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
    // Airtable
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

    // Meta CAPI — Lead Event
    if (process.env.META_CAPI_TOKEN) {
      const pixelId = '1094687270905953';
      const eventTime = Math.floor(Date.now() / 1000);

      const userData = {};
      if (email)   userData.em = hash(email);
      if (phone)   userData.ph = hash(phone.replace(/\s+/g, ''));
      if (vorname) userData.fn = hash(vorname);
      if (nachname) userData.ln = hash(nachname);
      if (stadt)   userData.ct = hash(stadt);
      if (plz)     userData.zp = hash(plz);
      if (land)    userData.country = hash(land);
      if (fbclid)  userData.fbc = `fb.1.${Date.now()}.${fbclid}`;

      const capiPayload = {
        data: [{
          event_name: 'Lead',
          event_time: eventTime,
          event_source_url: 'https://starten.hsp-derjob.de/danke',
          action_source: 'website',
          user_data: userData,
        }],
      };

      try {
        const capiRes = await fetch(
          `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${process.env.META_CAPI_TOKEN}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(capiPayload),
          }
        );
        if (!capiRes.ok) {
          const err = await capiRes.text();
          console.error('Meta CAPI error:', err);
        }
      } catch (capiErr) {
        console.error('Meta CAPI exception:', capiErr);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Submit error:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
