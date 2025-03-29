supabase;

const { createClient } = supabase;
const url = "https://rlzcmzmvupiejtlimxsj.supabase.co";
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsemNtem12dXBpZWp0bGlteHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5MDM4NDQsImV4cCI6MjA1ODQ3OTg0NH0.NQyccqUam9fI3iKM0elo9-yQyo6voT8ue2PYvhaLw8w";
const supabaseClient = createClient(url, apiKey);

window.supabase = supabaseClient;
