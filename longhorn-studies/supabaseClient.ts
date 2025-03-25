import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rneezqbhlvyyxidajvhu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZWV6cWJobHZ5eXhpZGFqdmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4ODE3NjcsImV4cCI6MjA1ODQ1Nzc2N30.el_WH2agsayHMETK8CHyDR2qNsg7hyYQ5EsyQ3KNbEw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
