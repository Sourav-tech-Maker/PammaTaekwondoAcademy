require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const {
  FITBIT_CLIENT_ID,
  FITBIT_CLIENT_SECRET,
  FITBIT_REDIRECT_URI
} = process.env;

// Step 1: Redirect user to Fitbit OAuth
app.get('/api/fitbit/auth', (req, res) => {
  const url = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${FITBIT_CLIENT_ID}&redirect_uri=${encodeURIComponent(FITBIT_REDIRECT_URI)}&scope=sleep%20activity%20heartrate%20profile&expires_in=604800`;
  res.redirect(url);
});

// Step 2: Fitbit redirects back with code, exchange for access token
app.get('/fitbit-callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post('https://api.fitbit.com/oauth2/token',
      new URLSearchParams({
        client_id: FITBIT_CLIENT_ID,
        grant_type: 'authorization_code',
        redirect_uri: FITBIT_REDIRECT_URI,
        code
      }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    // Save tokenRes.data.access_token in session or DB for this user
    // For demo, send token to frontend (not secure for production)
    res.send(`<script>
      window.opener.postMessage(${JSON.stringify(tokenRes.data)}, "*");
      window.close();
    </script>`);
  } catch (err) {
    res.status(500).send('Fitbit auth failed');
  }
});

// Step 3: Endpoint to fetch sleep/activity data
app.post('/api/fitbit/data', async (req, res) => {
  const { access_token } = req.body;
  try {
    // Fetch sleep data (last night)
    const sleepRes = await axios.get('https://api.fitbit.com/1.2/user/-/sleep/date/today.json', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    // Fetch activity summary (today)
    const activityRes = await axios.get('https://api.fitbit.com/1/user/-/activities/date/today.json', {
      headers: { 'Authorization': `Bearer ${access_token}` }
    });
    res.json({
      sleep: sleepRes.data,
      activity: activityRes.data
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Fitbit data' });
  }
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Add your OpenAI key to .env

app.post('/api/fitbit/advice', async (req, res) => {
  const { sleep, activity } = req.body;
  try {
    const prompt = `
You are a fitness and recovery expert. 
Given this user's Fitbit data, give a short, friendly recovery tip (max 2 sentences) for today.

Sleep summary: ${JSON.stringify(sleep)}
Activity summary: ${JSON.stringify(activity)}
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a fitness and recovery expert." },
          { role: "user", content: prompt }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json({ advice: response.data.choices[0].message.content.trim() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get advice from ChatGPT' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));