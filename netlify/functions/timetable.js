// Netlify Function for persisting SLIIT Timetable entries (personal use)
// Install faunadb: npm install faunadb --save
// Set a FaunaDB secret in Netlify environment variables: FAUNADB_SECRET

const faunadb = require('faunadb');
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

exports.handler = async (event, context) => {
  const method = event.httpMethod;

  // GET: retrieve all stored entries (as an array)
  if (method === 'GET') {
    try {
      const index = q.Match(q.Index('all_entries'));
      const page = await client.query(q.Paginate(index));
      const refs = page.data;
      const entries = await Promise.all(
        refs.map(ref => client.query(q.Get(ref)))
      );
      return {
        statusCode: 200,
        body: JSON.stringify(entries.map(e => e.data)),
      };
    } catch (err) {
      console.error('Fauna GET error', err);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch entries' }) };
    }
  }

  // POST: replace stored entries with the supplied array
  if (method === 'POST') {
    try {
      const entries = JSON.parse(event.body);
      // Delete old entries (clear collection)
      const index = q.Match(q.Index('all_entries'));
      const page = await client.query(q.Paginate(index));
      const refs = page.data;
      await Promise.all(refs.map(ref => client.query(q.Delete(ref)));
      // Insert new entries
      await Promise.all(
        entries.map(entry => client.query(q.Create(q.Collection('entries'), { data: entry })))
      );
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    } catch (err) {
      console.error('Fauna POST error', err);
      return { statusCode: 500, body: JSON.stringify({ error: 'Failed to save entries' }) };
    }
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
