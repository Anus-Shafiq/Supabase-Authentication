supabase;

console.log(supabase);

const { createClient } = supabase;
const url = "https://yicipmhgqfbaymfmunqp.supabase.co";
const apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpY2lwbWhncWZiYXltZm11bnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MTQ5NTIsImV4cCI6MjA1MjE5MDk1Mn0.2u4qDgd5_Edp2Uu35yMWRpS5OAZkOHhEQYGPMRkROg0";
const supabaseClient = createClient(url, apiKey);

window.supabase = supabaseClient;
